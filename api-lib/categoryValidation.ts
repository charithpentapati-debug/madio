// Dynamic-category-aware version of shared/verticals.ts's isKnownCategoryId
// — checks the fast static (sync) path first, since the vast majority of
// admin actions target one of the original static categories, and only
// falls back to fetching Cloudinary for the dynamic (admin-created) lists
// if that fails. Used by the admin endpoints (cloudinary-sign.ts,
// admin-list-photos.ts, admin-delete-photo.ts, admin-assign-code.ts) so
// uploads/deletes/listing work for admin-created categories exactly like
// the static ones.
//
// Deliberately its own file, separate from api-lib/dynamicCategories.ts:
// this one imports shared/verticals.js as a real (value) import, which only
// resolves correctly under Vercel's bundled api/*.ts context — it must
// never be imported from scripts/generate-image-data.ts's Node-native TS
// execution context (see dynamicCategories.ts's header comment for why that
// distinction matters).
import { isKnownCategoryId } from "../shared/verticals.js";
import { getDynamicCategories } from "./dynamicCategories.js";

export async function isKnownCategoryIdAsync(category: string): Promise<boolean> {
  if (isKnownCategoryId(category)) return true;
  for (const vertical of ["furniture", "doors-windows"] as const) {
    const dynamic = await getDynamicCategories(vertical);
    if (dynamic.some((c) => c.id === category)) return true;
  }
  return false;
}
