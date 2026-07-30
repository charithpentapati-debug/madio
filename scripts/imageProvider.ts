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

interface CloudinaryResource {
  secure_url: string;
}

interface CloudinaryByAssetFolderResponse {
  resources?: CloudinaryResource[];
  next_cursor?: string | null;
}

export async function getCategoryImages(category: string): Promise<string[]> {
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials are not configured (need VITE_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
    );
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const urls: string[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({
      asset_folder: category,
      max_results: "500",
      ...(cursor ? { next_cursor: cursor } : {}),
    });
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/by_asset_folder?${params.toString()}`,
      { headers: { Authorization: `Basic ${auth}` } },
    );

    if (!res.ok) {
      throw new Error(
        `Cloudinary Admin API request failed for folder "${category}": ${res.status} ${res.statusText}`,
      );
    }

    const data = (await res.json()) as CloudinaryByAssetFolderResponse;
    urls.push(...(data.resources ?? []).map((r) => r.secure_url));
    cursor = data.next_cursor ?? undefined;
  } while (cursor);

  return urls;
}
