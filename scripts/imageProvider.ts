// The ONE function that knows how to fetch a category's images from the
// current image provider (Cloudinary). Swapping providers later (ImageKit,
// Cloudflare Images, etc.) means rewriting only this file's internals —
// scripts/generate-image-data.ts and every frontend page stay untouched.
//
// Deliberately lives outside src/ rather than at src/lib/imageProvider.ts:
// it uses Node-only globals (process.env) and the Cloudinary Admin API
// secret, neither of which can safely sit inside src/ — that directory is
// bundled into the browser by Vite and type-checked by tsconfig.app.json's
// browser-oriented settings (no `process` global there). This file only
// ever runs in Node, invoked by scripts/generate-image-data.ts at build
// time. Frontend pages never import it — they read the static JSON that
// generate-image-data.ts produces (see src/data/cloudinaryImages.generated.json).
//
// Cloudinary folders are just the furniture category id — e.g. category
// "beds" -> Cloudinary asset folder "beds" (see shared/furnitureCategories.ts
// and api/cloudinary-sign.ts, which upload into the same folder names).
//
// Reuses api-lib/cloudinaryAdmin.ts's listCategoryAssets (same function the
// admin list/delete/assign-code endpoints use) rather than duplicating the
// Cloudinary call here — this is what carries each photo's assigned
// product_code (from Cloudinary context metadata) through to the generated
// data file, which is what lets the frontend render client-uploaded photos
// as real product cards instead of a bare, code-less image gallery.
import { listCategoryAssets } from "../api-lib/cloudinaryAdmin.ts";

export interface CategoryPhoto {
  secureUrl: string;
  productCode: string;
}

export async function getCategoryImages(category: string): Promise<CategoryPhoto[]> {
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials are not configured (need VITE_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
    );
  }

  const assets = await listCategoryAssets(category);

  // Skip anything without a product code (shouldn't happen — admin-assign-code
  // runs immediately after every upload — but a code-less photo has nothing
  // sensible to render as a SKU/name, so it's excluded rather than shown broken).
  return assets
    .filter((a) => !!a.productCode)
    .map((a) => ({ secureUrl: a.secureUrl, productCode: a.productCode! }));
}
