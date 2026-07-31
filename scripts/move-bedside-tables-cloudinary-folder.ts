// ONE-TIME migration script (Task 2 of the Bedside Tables category split).
// The 28 MFBS-* images were migrated into Cloudinary in the earlier
// image-unification loop, before the category split was decided, so they
// currently sit under the "beds" asset_folder (beds/mfbs-001 etc.) — same
// folder as the 52 bed frames. Since the folder = category id convention
// drives both the frontend's Cloudinary lookup AND the admin panel's
// per-category photo list, this moves each of the 28 assets into a new
// "bedside-tables" asset_folder (bedside-tables/mfbs-001 etc.) so it lines
// up with the new bedside-tables category exactly like every other
// category's images do.
//
// Two Cloudinary calls per asset, in sequence — confirmed by direct testing
// this is genuinely required, not optional: (1) image/rename to move the
// public_id path (asset_folder in the rename response does NOT follow the
// new public_id — this account's Dynamic Folders track asset_folder as
// independent metadata), so (2) image/explicit sets asset_folder on the new
// public_id explicitly. context.custom.product_code is preserved by both
// calls automatically — verified, not re-set here.
//
// Safe to re-run: if an asset was already moved, the rename call 404s
// (from_public_id no longer exists there) — script logs and skips.
import crypto from "node:crypto";

function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

async function main() {
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary credentials.");
    process.exit(1);
  }

  const skus = Array.from({ length: 28 }, (_, i) => `mfbs-${String(i + 1).padStart(3, "0")}`);

  let moved = 0;
  let skipped = 0;
  let failed = 0;

  for (const sku of skus) {
    const fromId = `beds/${sku}`;
    const toId = `bedside-tables/${sku}`;

    const renameTs = Math.floor(Date.now() / 1000);
    const renameParams = { from_public_id: fromId, to_public_id: toId, timestamp: renameTs };
    const renameSig = signCloudinaryParams(renameParams, apiSecret);
    const renameRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/rename`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...renameParams, timestamp: String(renameTs), api_key: apiKey, signature: renameSig } as Record<string, string>),
    });

    if (renameRes.status === 404) {
      console.log(`  SKIP ${sku} — from_public_id not found (already moved?)`);
      skipped++;
      continue;
    }
    if (!renameRes.ok) {
      console.log(`  FAIL ${sku} rename: ${renameRes.status} ${await renameRes.text()}`);
      failed++;
      continue;
    }

    const explicitTs = Math.floor(Date.now() / 1000);
    const explicitParams = { public_id: toId, type: "upload", asset_folder: "bedside-tables", timestamp: explicitTs };
    const explicitSig = signCloudinaryParams(explicitParams, apiSecret);
    const explicitRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/explicit`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...explicitParams, timestamp: String(explicitTs), api_key: apiKey, signature: explicitSig } as Record<string, string>),
    });

    if (!explicitRes.ok) {
      console.log(`  FAIL ${sku} asset_folder update: ${explicitRes.status} ${await explicitRes.text()}`);
      failed++;
      continue;
    }

    console.log(`  OK   ${sku}: beds/${sku} -> bedside-tables/${sku}`);
    moved++;
  }

  console.log(`\n[move] done: ${moved} moved, ${skipped} skipped (already moved), ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[move] Fatal error:", err);
  process.exit(1);
});
