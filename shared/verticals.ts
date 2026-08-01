// Registry connecting the two admin-manageable verticals (Furniture, Doors &
// Windows). This is the ONE place that needs to know both verticals exist —
// shared/furnitureCategories.ts and shared/doorsWindowsCategories.ts each
// stay self-contained and mirror each other's structure exactly, with no
// awareness of one another. Anything that needs to validate or route across
// BOTH verticals (the admin serverless functions) imports from here instead
// of hand-rolling an `isFurnitureCategoryId(x) || isDoorsWindowsCategoryId(x)`
// check at each call site.
import { isFurnitureCategoryId, type FurnitureCategoryId } from "./furnitureCategories.js";
import { isDoorsWindowsCategoryId, type DoorsWindowsCategoryId } from "./doorsWindowsCategories.js";

export type Vertical = "furniture" | "doors-windows";
export type AnyCategoryId = FurnitureCategoryId | DoorsWindowsCategoryId;

export const isKnownCategoryId = (s: string): s is AnyCategoryId =>
  isFurnitureCategoryId(s) || isDoorsWindowsCategoryId(s);

export function verticalOf(category: string): Vertical | undefined {
  if (isFurnitureCategoryId(category)) return "furniture";
  if (isDoorsWindowsCategoryId(category)) return "doors-windows";
  return undefined;
}
