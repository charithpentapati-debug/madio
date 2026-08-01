// Cloudinary Admin API calls shared by the admin list/delete/assign-code
// endpoints. Endpoints confirmed directly against the live account before
// writing this: `by_asset_folder?context=true` for listing with context,
// `POST /image/explicit` for setting context on an existing asset (the
// dedicated `/resources/.../context` endpoint returns 404 on this account —
// /image/explicit is the one that actually works), and the standard
// `DELETE /resources/image/upload` for removal.
function authHeader(): string {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) throw new Error("Cloudinary credentials are not configured.");
  return "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
}

function cloudName(): string {
  const name = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!name) throw new Error("VITE_CLOUDINARY_CLOUD_NAME is not configured.");
  return name;
}

export interface CategoryAsset {
  publicId: string;
  secureUrl: string;
  productCode?: string;
  // Cloudinary's own creation timestamp (ISO string) — the source of truth
  // for "recently uploaded first" ordering (see FurnitureCategoryPage.tsx /
  // AdminUpload.tsx) and for deterministic tie-breaking when two uploads
  // race for the same product code (see admin-assign-code.ts).
  createdAt: string;
}

export async function listCategoryAssets(category: string): Promise<CategoryAsset[]> {
  const assets: CategoryAsset[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({
      asset_folder: category,
      context: "true",
      max_results: "500",
      ...(cursor ? { next_cursor: cursor } : {}),
    });
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName()}/resources/by_asset_folder?${params.toString()}`,
      { headers: { Authorization: authHeader() } },
    );

    if (res.status === 404) break; // folder doesn't exist yet — no photos uploaded here

    if (!res.ok) {
      throw new Error(`Cloudinary list failed for folder "${category}": ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as {
      resources?: Array<{
        public_id: string;
        secure_url: string;
        created_at: string;
        context?: { custom?: { product_code?: string } };
      }>;
      next_cursor?: string | null;
    };

    for (const r of data.resources ?? []) {
      assets.push({
        publicId: r.public_id,
        secureUrl: r.secure_url,
        productCode: r.context?.custom?.product_code,
        createdAt: r.created_at,
      });
    }
    cursor = data.next_cursor ?? undefined;
  } while (cursor);

  return assets;
}

export async function setAssetProductCode(publicId: string, productCode: string): Promise<void> {
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName()}/image/explicit`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      public_id: publicId,
      type: "upload",
      context: `product_code=${productCode}`,
    }),
  });

  if (!res.ok) {
    throw new Error(`Cloudinary context update failed for "${publicId}": ${res.status} ${res.statusText}`);
  }
}

export async function deleteAsset(publicId: string): Promise<void> {
  const params = new URLSearchParams();
  params.append("public_ids[]", publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName()}/resources/image/upload?${params.toString()}`,
    { method: "DELETE", headers: { Authorization: authHeader() } },
  );

  if (!res.ok) {
    throw new Error(`Cloudinary delete failed for "${publicId}": ${res.status} ${res.statusText}`);
  }
}
