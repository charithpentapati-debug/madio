// Baseline product-code numbering per category, derived from the existing
// PDF-sourced catalogue in src/data/furniture.ts (e.g. Beds already runs
// MFB-001…MFB-052). New client-uploaded photos continue that SAME numbering
// — the first uploaded Beds photo becomes MFB-053 — rather than starting a
// separate sequence. If the static catalogue's SKU range ever grows, update
// baselineMax to match.
import type { FurnitureCategoryId } from "./furnitureCategories";

export interface CategoryProductCodeConfig {
  prefix: string;
  baselineMax: number;
}

export const categoryProductCodeConfig: Record<FurnitureCategoryId, CategoryProductCodeConfig> = {
  beds: { prefix: "MFB", baselineMax: 52 },
  "bar-chairs": { prefix: "MFBC", baselineMax: 24 },
  "coffee-cafe-tables": { prefix: "MFCT", baselineMax: 35 },
  daybeds: { prefix: "MFDB", baselineMax: 12 },
  "office-furniture-sofa": { prefix: "MFO", baselineMax: 52 },
  outdoor: { prefix: "MFOUT", baselineMax: 28 },
  mirrors: { prefix: "MFM", baselineMax: 39 },
  "wall-art": { prefix: "MFWA", baselineMax: 161 },
  clocks: { prefix: "MFCL", baselineMax: 49 },
};

// "MFB-053" + prefix "MFB" -> 53. Returns null for anything that doesn't
// match (missing context on an older/legacy asset, wrong prefix, etc.) so
// callers can safely ignore it when computing the next number.
export function parseProductCodeNumber(prefix: string, code: string | undefined): number | null {
  if (!code) return null;
  const match = code.match(new RegExp(`^${prefix}-(\\d+)$`));
  if (!match) return null;
  return parseInt(match[1], 10);
}

export function formatProductCode(prefix: string, num: number): string {
  return `${prefix}-${String(num).padStart(3, "0")}`;
}
