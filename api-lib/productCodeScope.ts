// Async, dynamic-category-aware version of "what product-code config and
// Cloudinary folder(s) apply to this category id" — lives in api-lib/ (not
// shared/categoryProductCodes.ts) specifically because it needs to fall back
// to Cloudinary-stored dynamic (admin-created) categories when the static
// config doesn't recognise the id, which means importing
// api-lib/dynamicCategories.ts (Node-only). shared/categoryProductCodes.ts
// stays framework-agnostic; this file is the api/*.ts-only extension of it.
import {
  categoryProductCodeConfig,
  doorsWindowsProductCodeConfig,
  type CategoryProductCodeConfig,
} from "../shared/categoryProductCodes.js";
import { isFurnitureCategoryId } from "../shared/furnitureCategories.js";
import { isDoorsWindowsCategoryId } from "../shared/doorsWindowsCategories.js";
import { getDynamicCategories } from "./dynamicCategories.js";

export async function resolveProductCodeScope(category: string): Promise<{
  config: CategoryProductCodeConfig;
  folders: string[];
}> {
  if (isFurnitureCategoryId(category)) {
    return { config: categoryProductCodeConfig[category], folders: [category] };
  }
  if (isDoorsWindowsCategoryId(category)) {
    return { config: doorsWindowsProductCodeConfig[category], folders: [category] };
  }

  // Not a static category — check admin-created (dynamic) ones. A dynamic
  // category always numbers from 0 (it never has a pre-existing catalogue
  // to continue), matching every D&W category's baselineMax.
  for (const vertical of ["furniture", "doors-windows"] as const) {
    const dynamic = await getDynamicCategories(vertical);
    const match = dynamic.find((c) => c.id === category);
    if (match) {
      return { config: { prefix: match.prefix, baselineMax: 0 }, folders: [category] };
    }
  }

  throw new Error(`resolveProductCodeScope: unknown category "${category}"`);
}
