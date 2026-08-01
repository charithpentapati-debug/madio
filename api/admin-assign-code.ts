// Called by the admin page right after a file finishes uploading (Cloudinary
// Upload Widget success callback), NOT during the signed-upload step itself —
// the widget's `uploadSignature` callback fires once per file in a batch
// with a static widget config, so a per-file server-decided value like a
// product code can't be baked into that signature safely for multi-file
// uploads. Assigning it as a separate step right after upload succeeds
// avoids that.
//
// That separate step used to be a plain read-max-then-write, which is NOT
// safe against two near-simultaneous uploads (the client's real usage
// pattern, e.g. selecting several files at once — the widget fires one
// success callback per file, so this endpoint gets called once per file,
// concurrently): both requests could read the same "current max" before
// either had written its result, and both would compute and write the SAME
// next code — this is exactly how MFB-054/MFB-055 ended up duplicated.
//
// Fixed with a bounded write-then-verify retry loop (assignProductCode
// below) rather than a lock: Cloudinary has no compare-and-swap or atomic
// increment primitive to lock against, and there's no external lock store
// (Redis etc.) in this project's infra, so an actual mutex isn't available
// to build against. The retry loop instead minimizes the collision window
// to a single write + immediate re-read, and resolves any collision that
// does slip through deterministically (earliest Cloudinary-recorded
// creation time wins, so both racing requests agree on the same outcome
// without needing to coordinate with each other).
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySessionToken } from "../api-lib/session.js";
import { listCategoryAssets, setAssetProductCode, type CategoryAsset } from "../api-lib/cloudinaryAdmin.js";
import { isKnownCategoryIdAsync } from "../api-lib/categoryValidation.js";
import { resolveProductCodeScope } from "../api-lib/productCodeScope.js";
import { parseProductCodeNumber, formatProductCode } from "../shared/categoryProductCodes.js";

const MAX_ATTEMPTS = 6;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scanFolders(folders: string[]): Promise<CategoryAsset[]> {
  const assets: CategoryAsset[] = [];
  for (const folder of folders) {
    assets.push(...(await listCategoryAssets(folder)));
  }
  return assets;
}

// Deterministic winner among assets that ended up sharing the same code:
// earliest Cloudinary creation time wins; publicId breaks an exact tie.
// Every racing request runs this same comparison independently and reaches
// the same answer, so no coordination between them is needed.
function pickWinner(holders: CategoryAsset[]): CategoryAsset {
  return holders.slice().sort((a, b) => {
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
    return a.publicId < b.publicId ? -1 : 1;
  })[0];
}

async function assignProductCode(publicId: string, config: { prefix: string; baselineMax: number }, folders: string[]): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      // Jittered backoff so two racing requests that just collided don't
      // immediately collide again on the exact same retry cadence.
      await sleep(150 + Math.random() * 250);
    }

    const before = await scanFolders(folders);
    let maxNum = config.baselineMax;
    for (const asset of before) {
      const n = parseProductCodeNumber(config.prefix, asset.productCode);
      if (n !== null && n > maxNum) maxNum = n;
    }
    const candidateCode = formatProductCode(config.prefix, maxNum + 1);

    await setAssetProductCode(publicId, candidateCode);

    // Immediately re-read to see who actually holds this code now.
    const after = await scanFolders(folders);
    const holders = after.filter((a) => a.productCode === candidateCode);

    if (holders.length <= 1) {
      return candidateCode; // uncontested
    }

    if (pickWinner(holders).publicId === publicId) {
      return candidateCode; // we won the tie-break
    }
    // Lost the tie-break — loop again; the next scan will see the winner's
    // code taken and compute a fresh, higher candidate automatically.
  }
  throw new Error(`Could not assign a unique product code for "${publicId}" after ${MAX_ATTEMPTS} attempts`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, category, publicId } = (req.body ?? {}) as {
    token?: unknown;
    category?: unknown;
    publicId?: unknown;
  };

  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (typeof category !== "string" || !(await isKnownCategoryIdAsync(category))) {
    return res.status(400).json({ error: "Unknown category" });
  }
  if (typeof publicId !== "string" || !publicId.startsWith(`${category}/`)) {
    return res.status(400).json({ error: "publicId does not match category folder" });
  }

  try {
    // Both verticals number per-category — scope is just this one category's
    // own prefix + numbering. See resolveProductCodeScope for how Furniture
    // and Doors & Windows each resolve their config from the same call.
    const { config, folders } = await resolveProductCodeScope(category);

    const productCode = await assignProductCode(publicId, config, folders);
    // No direct rebuild trigger here — Cloudinary's account-level webhook
    // (Console → Settings → Upload → Notification URL) fires for this
    // context update independently and is now the SOLE rebuild trigger, so
    // every upload/delete doesn't burn two deploys against Vercel's daily
    // quota. See api-lib/deployHook.ts's triggerRebuild(), still available
    // but deliberately unused here.

    return res.status(200).json({ productCode });
  } catch (err) {
    console.error("[admin-assign-code] Error:", err);
    return res.status(500).json({ error: "Failed to assign product code" });
  }
}
