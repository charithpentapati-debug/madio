// ONE-TIME migration script (Loop 1 of the Cloudinary image-unification
// migration — see conversation/task notes). Uploads every real, currently-
// rendering static catalogue image (src/assets/furniture/<category>/*) into
// the matching Cloudinary asset folder, writing the exact existing product
// code into context.custom.product_code — the same field admin-assign-code
// already uses for client uploads, so both origins are structurally
// identical in Cloudinary afterwards.
//
// Deliberately run ONE CATEGORY AT A TIME (`--category=<id>`), not all 449
// images in one shot — see Loop 1 requirements. Re-running for the same
// category is safe: public_id is deterministic (`<category>/<sku-lower>`)
// and overwrite:true means a re-run just re-uploads the same asset in place,
// it never creates a duplicate.
//
// Bar Chairs is intentionally NOT a valid --category value here — its 24
// images are quarantined (_quarantined-images/bar-chairs/, supplier
// watermarks baked into the pixels) and must never reach Cloudinary.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_ROOT = path.resolve(__dirname, "../src/assets/furniture");

// Categories with real static images to migrate. Bar Chairs excluded on
// purpose — see file header. Kept as an explicit allowlist (not derived from
// furnitureCategories.ts) so this script can never silently pick up a new
// category folder without a deliberate decision to include it here.
const MIGRATABLE_CATEGORIES = [
  "beds",
  "coffee-cafe-tables",
  "daybeds",
  "office-furniture-sofa",
  "outdoor",
  "mirrors",
  "wall-art",
  "clocks",
] as const;

function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

interface UploadResult {
  file: string;
  sku: string;
  ok: boolean;
  publicId?: string;
  error?: string;
}

async function uploadOne(
  category: string,
  filePath: string,
  sku: string,
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  dryRun: boolean,
): Promise<UploadResult> {
  const publicId = `${category}/${sku.toLowerCase()}`;

  if (dryRun) {
    return { file: path.basename(filePath), sku, ok: true, publicId };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    asset_folder: category,
    context: `product_code=${sku}`,
    invalidate: "true",
    overwrite: "true",
    public_id: publicId,
    timestamp,
  };
  const signature = signCloudinaryParams(paramsToSign, apiSecret);

  const buffer = readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mime }), path.basename(filePath));
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("asset_folder", category);
  form.append("context", `product_code=${sku}`);
  form.append("invalidate", "true");
  form.append("overwrite", "true");
  form.append("public_id", publicId);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const body = await res.text();
      return { file: path.basename(filePath), sku, ok: false, error: `${res.status} ${res.statusText}: ${body}` };
    }
    return { file: path.basename(filePath), sku, ok: true, publicId };
  } catch (err) {
    return { file: path.basename(filePath), sku, ok: false, error: (err as Error).message };
  }
}

async function main() {
  const categoryArg = process.argv.find((a) => a.startsWith("--category="))?.split("=")[1];
  const dryRun = process.argv.includes("--dry-run");

  if (!categoryArg || !(MIGRATABLE_CATEGORIES as readonly string[]).includes(categoryArg)) {
    console.error(
      `Usage: node scripts/migrate-catalogue-images.ts --category=<id> [--dry-run]\n` +
        `Valid categories: ${MIGRATABLE_CATEGORIES.join(", ")}`,
    );
    process.exit(1);
  }
  const category = categoryArg;

  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary credentials (VITE_CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET).");
    process.exit(1);
  }

  const dir = path.join(ASSETS_ROOT, category);
  const files = readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  console.log(`[migrate] ${category}: ${files.length} file(s) to upload${dryRun ? " (DRY RUN)" : ""}`);

  const results: UploadResult[] = [];
  for (const file of files) {
    const sku = file.replace(/\.[^.]+$/, "");
    const filePath = path.join(dir, file);
    const result = await uploadOne(category, filePath, sku, cloudName, apiKey, apiSecret, dryRun);
    results.push(result);
    console.log(`  ${result.ok ? "OK  " : "FAIL"} ${sku} -> ${result.publicId ?? ""} ${result.error ?? ""}`);
  }

  const ok = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  console.log(`\n[migrate] ${category} done: ${ok.length}/${results.length} uploaded, ${failed.length} failed.`);
  if (failed.length > 0) {
    console.log(`[migrate] FAILURES in ${category}:`);
    for (const f of failed) console.log(`  - ${f.sku} (${f.file}): ${f.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[migrate] Fatal error:", err);
  process.exit(1);
});
