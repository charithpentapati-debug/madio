// Called by the admin page right after a file finishes uploading (Cloudinary
// Upload Widget success callback), NOT during the signed-upload step itself —
// the widget's `uploadSignature` callback fires once per file in a batch
// with a static widget config, so a per-file server-decided value like a
// product code can't be baked into that signature safely for multi-file
// uploads. Assigning it as a separate step right after upload succeeds
// avoids that, at the cost of a small (accepted) race window if two admins
// somehow uploaded to the same category at the exact same instant — not a
// realistic concern for this single-admin tool.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySessionToken } from "../api-lib/session.js";
import { listCategoryAssets, setAssetProductCode } from "../api-lib/cloudinaryAdmin.js";
import { triggerRebuild } from "../api-lib/deployHook.js";
import { isKnownCategoryId } from "../shared/verticals.js";
import { resolveProductCodeScope, parseProductCodeNumber, formatProductCode } from "../shared/categoryProductCodes.js";

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
  if (typeof category !== "string" || !isKnownCategoryId(category)) {
    return res.status(400).json({ error: "Unknown category" });
  }
  if (typeof publicId !== "string" || !publicId.startsWith(`${category}/`)) {
    return res.status(400).json({ error: "publicId does not match category folder" });
  }

  try {
    // Furniture: scope is just this one category (its own prefix + numbering).
    // Doors & Windows: scope is every category in the vertical (one shared
    // MDW prefix + numbering) — see resolveProductCodeScope for why.
    const { config, folders } = resolveProductCodeScope(category);

    let maxNum = config.baselineMax;
    for (const folder of folders) {
      const assets = await listCategoryAssets(folder);
      for (const asset of assets) {
        const n = parseProductCodeNumber(config.prefix, asset.productCode);
        if (n !== null && n > maxNum) maxNum = n;
      }
    }

    const productCode = formatProductCode(config.prefix, maxNum + 1);
    await setAssetProductCode(publicId, productCode);
    await triggerRebuild();

    return res.status(200).json({ productCode });
  } catch (err) {
    console.error("[admin-assign-code] Error:", err);
    return res.status(500).json({ error: "Failed to assign product code" });
  }
}
