// Baseline product-code numbering, per category — same structure for both
// verticals, numbering always resets to 001 per category.
//
// Furniture: derived from the existing PDF-sourced catalogue in
// src/data/furniture.ts (e.g. Beds already runs MFB-001…MFB-052). New
// client-uploaded photos continue that SAME numbering — the first uploaded
// Beds photo becomes MFB-053 — rather than starting a separate sequence. If
// the static catalogue's SKU range ever grows, update baselineMax to match.
//
// Doors & Windows: no pre-existing numbered catalogue to continue (unlike
// Furniture's PDF-sourced ranges), so every category starts at baselineMax 0
// — the first photo uploaded to any D&W category becomes ...-001.
import type { FurnitureCategoryId } from "./furnitureCategories.js";
import type { DoorsWindowsCategoryId } from "./doorsWindowsCategories.js";

export interface CategoryProductCodeConfig {
  prefix: string;
  baselineMax: number;
}

export const categoryProductCodeConfig: Record<FurnitureCategoryId, CategoryProductCodeConfig> = {
  beds: { prefix: "MFB", baselineMax: 52 },
  "bedside-tables": { prefix: "MFBS", baselineMax: 28 },
  "bar-chairs": { prefix: "MFBC", baselineMax: 24 },
  "coffee-cafe-tables": { prefix: "MFCT", baselineMax: 35 },
  daybeds: { prefix: "MFDB", baselineMax: 12 },
  "office-furniture-sofa": { prefix: "MFO", baselineMax: 52 },
  outdoor: { prefix: "MFOUT", baselineMax: 28 },
  mirrors: { prefix: "MFM", baselineMax: 39 },
  "wall-art": { prefix: "MFWA", baselineMax: 161 },
  clocks: { prefix: "MFCL", baselineMax: 49 },
};

export const doorsWindowsProductCodeConfig: Record<DoorsWindowsCategoryId, CategoryProductCodeConfig> = {
  "hl-vista-slim": { prefix: "MDW-VS", baselineMax: 0 },
  "hl-50-casement-door": { prefix: "MDW-CD", baselineMax: 0 },
  "hl-retro-gulf-slim": { prefix: "MDW-RG", baselineMax: 0 },
  "hl-ultra-slim": { prefix: "MDW-US", baselineMax: 0 },
  "hl-eco-gulf-slim": { prefix: "MDW-EG", baselineMax: 0 },
  "hl-elite-gulf-slim": { prefix: "MDW-EL", baselineMax: 0 },
  "metal-ceiling-systems": { prefix: "MDW-MC", baselineMax: 0 },
  "balcony-railing-system": { prefix: "MDW-BR", baselineMax: 0 },
  "modular-partition-facade": { prefix: "MDW-PF", baselineMax: 0 },
  "glass-partitions-doors": { prefix: "MDW-GP", baselineMax: 0 },
  "casement-windows-openable": { prefix: "MDW-CW", baselineMax: 0 },
  "sliding-folding-bifold": { prefix: "MDW-SF", baselineMax: 0 },
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

// resolveProductCodeScope (static-categories lookup) lives in
// api-lib/productCodeScope.ts, not here — it needs to fall back to Cloudinary-
// stored dynamic (admin-created) categories for categories this static
// config doesn't know about, which means importing api-lib/dynamicCategories.ts
// (Node-only: process.env, fetch to the Cloudinary Admin API). This file
// stays framework-agnostic on purpose — it's imported by frontend code too
// (indirectly, nothing here currently is, but the sibling shared/*.ts files
// this one imports are) — so nothing Node-only belongs in it.
