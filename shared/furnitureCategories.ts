// ============================================================
// Furniture category metadata — single source of truth.
//
// Deliberately framework-agnostic (no Vite-specific imports like
// import.meta.glob) so this file can be imported from BOTH:
//   - the frontend (src/data/furniture.ts re-exports these), and
//   - Vercel serverless functions (api/*.ts) that need to validate
//     an upload's target category/folder server-side.
//
// The Cloudinary folder for a category is always its `id` — e.g.
// category "beds" -> Cloudinary folder "beds".
// ============================================================

export type FurnitureCategoryId =
  | "beds"
  | "bar-chairs"
  | "coffee-cafe-tables"
  | "daybeds"
  | "office-furniture-sofa"
  | "outdoor"
  | "mirrors"
  | "wall-art"
  | "clocks";

export interface FurnitureCategoryMeta {
  id: FurnitureCategoryId;
  name: string;         // Display name
  description: string;  // One-line category description
  isPopulated: boolean;  // Phase 4A: only beds=true; 4B will flip the rest
}

export const furnitureCategories: FurnitureCategoryMeta[] = [
  {
    id:          "beds",
    name:        "Beds",
    description: "Bed frames and bedside tables — solid wood and upholstered construction.",
    isPopulated: true,
  },
  {
    id:          "bar-chairs",
    name:        "Bar Chairs",
    description: "Counter-height and bar-height seating for hospitality and residential bars.",
    // Pulled back to Coming Soon: all 24 source images are raw catalogue-slide
    // crops with visible supplier branding / SKU codes / spec-table remnants.
    // Flip back to true once the photos are re-cropped or replaced.
    isPopulated: false,
  },
  {
    id:          "daybeds",
    name:        "Daybeds",
    description: "Solid wood and cane daybeds with plush upholstery.",
    isPopulated: true,
  },
  {
    id:          "office-furniture-sofa",
    name:        "Office Furniture & Sofa",
    description: "Premium executive office furniture and sofa collections.",
    isPopulated: true,
  },
  {
    id:          "outdoor",
    name:        "Outdoor",
    description: "Weather-resistant furniture for terraces, pools, and garden spaces.",
    isPopulated: true,
  },
  {
    id:          "mirrors",
    name:        "Mirrors",
    description: "Decorative and full-length mirrors in a range of frame finishes.",
    isPopulated: true,
  },
  {
    id:          "wall-art",
    name:        "Wall Art",
    description: "Curated wall art pieces for residential and hospitality interiors.",
    isPopulated: true,
  },
  {
    id:          "clocks",
    name:        "Clocks",
    description: "Statement wall clocks in solid wood and metal finishes.",
    isPopulated: true,
  },
  {
    id:          "coffee-cafe-tables",
    name:        "Coffee & Cafe Tables",
    description: "Low coffee tables and cafe-height tables for living and hospitality spaces.",
    isPopulated: true,
  },
];

export const isFurnitureCategoryId = (s: string): s is FurnitureCategoryId =>
  furnitureCategories.some((c) => c.id === s);
