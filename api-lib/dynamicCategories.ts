// Storage for admin-created categories (category management, Phase A —
// "add a new category"). This project has no database and no GitHub-write
// access to commit new entries directly into shared/furnitureCategories.ts /
// shared/doorsWindowsCategories.ts, so those two files stay the STATIC
// baseline (the categories with real PDF-sourced catalogue data — beds,
// wall-art, HL Vista Slim, etc.), and everything an admin adds afterward is
// stored as a small JSON file in Cloudinary itself (a `raw` resource, not an
// image), fetched at build time (see scripts/generate-image-data.ts) and
// merged into the category lists the frontend renders. A dynamically-added
// category has no static catalogue data by construction — it starts exactly
// like Bar Chairs or an un-populated D&W category: "Coming Soon" until the
// admin uploads photos to it, at which point the EXISTING client-uploaded-
// photo mechanism (already built for both verticals) picks it up with no
// further changes needed.
//
// Read path deliberately does NOT use the plain CDN delivery URL for the
// "latest" version — confirmed by direct testing that Cloudinary's raw
// delivery is edge-cached and can serve stale content for several seconds
// after an overwrite even with invalidate:true, which is exactly the kind
// of staleness this whole project has been bitten by before. Instead: ask
// the Admin API (which reads Cloudinary's system of record, not the CDN)
// for the resource's CURRENT version number, then fetch that exact
// versioned URL — every version has a permanently distinct URL, so there's
// no caching ambiguity to worry about.
// No runtime (value) imports from shared/ here, on purpose — this file is
// loaded from two different module-resolution contexts: Vercel's bundled
// api/*.ts functions (which require explicit .js extensions on relative
// imports, resolved by its nodenext bundler) AND scripts/generate-image-data.ts
// via Node's native TS execution (which requires the REAL .ts extension and
// does actual filesystem resolution — no bundler to paper over a mismatch).
// A `.js`-suffixed *value* import here would resolve fine under Vercel but
// fail outright under the scripts/ context (no verticals.js file exists on
// disk). `import type` is fine either way since it's fully erased before
// either context tries to resolve anything at runtime. The one function that
// needed a real (value) import from shared/verticals.ts — isKnownCategoryIdAsync
// — lives in api-lib/categoryValidation.ts instead, which is ONLY ever
// imported from api/*.ts, never from scripts/, so its .js import is safe.
import crypto from "node:crypto";
import type { Vertical } from "../shared/verticals.js";

export interface DynamicCategory {
  id: string; // URL slug, e.g. "accent-chairs"
  name: string; // display name, e.g. "Accent Chairs"
  prefix: string; // product-code prefix, e.g. "MFAC" or "MDW-AC"
  vertical: Vertical;
  createdAt: string;
}

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

function publicIdFor(vertical: Vertical): string {
  return vertical === "furniture" ? "_meta/furniture-categories.json" : "_meta/doors-windows-categories.json";
}

export async function getDynamicCategories(vertical: Vertical): Promise<DynamicCategory[]> {
  const publicId = publicIdFor(vertical);

  const infoRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName()}/resources/raw/upload/${publicId}`,
    { headers: { Authorization: authHeader() } },
  );

  if (infoRes.status === 404) return []; // no categories created yet for this vertical

  if (!infoRes.ok) {
    throw new Error(`Cloudinary raw resource lookup failed for "${publicId}": ${infoRes.status} ${infoRes.statusText}`);
  }

  const info = (await infoRes.json()) as { secure_url: string };
  const contentRes = await fetch(info.secure_url);
  if (!contentRes.ok) {
    throw new Error(`Failed to fetch dynamic categories content for "${publicId}": ${contentRes.status}`);
  }
  return (await contentRes.json()) as DynamicCategory[];
}

function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

async function writeDynamicCategories(vertical: Vertical, categories: DynamicCategory[]): Promise<void> {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) throw new Error("Cloudinary credentials are not configured.");

  const publicId = publicIdFor(vertical);
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { public_id: publicId, timestamp, overwrite: "true", invalidate: "true" };
  const signature = signCloudinaryParams(paramsToSign, apiSecret);

  const json = JSON.stringify(categories, null, 2);
  const form = new FormData();
  form.append("file", new Blob([json], { type: "application/json" }), "categories.json");
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("public_id", publicId);
  form.append("overwrite", "true");
  form.append("invalidate", "true");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName()}/raw/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to write dynamic categories for "${vertical}": ${res.status} ${body}`);
  }
}

// Appends a new category to whichever vertical it belongs to. Caller
// (api/admin-create-category.ts) is responsible for validating uniqueness
// against BOTH the static baseline AND every existing dynamic category in
// BOTH verticals before calling this — Cloudinary folder names are flat, not
// vertical-namespaced, so a slug collision across verticals would mix two
// categories' photos into the same folder.
export async function addDynamicCategory(category: DynamicCategory): Promise<void> {
  const existing = await getDynamicCategories(category.vertical);
  await writeDynamicCategories(category.vertical, [...existing, category]);
}

// Category management, Phase D — "delete a section." Only ever removes the
// category's ENTRY from this JSON store; the caller (api/admin-delete-category.ts)
// is responsible for deleting the category's actual Cloudinary photos itself
// beforehand, since that's real, permanent, irreversible data loss and needs
// its own explicit confirmation/counting, not something to fold silently
// into a metadata-store write. Static categories (shared/furnitureCategories.ts,
// shared/doorsWindowsCategories.ts) can never reach this function at all —
// they're not in this store to begin with, which is what makes them
// undeletable through the admin UI by construction, not by a runtime check.
export async function removeDynamicCategory(vertical: Vertical, categoryId: string): Promise<void> {
  const existing = await getDynamicCategories(vertical);
  const filtered = existing.filter((c) => c.id !== categoryId);
  await writeDynamicCategories(vertical, filtered);
}
