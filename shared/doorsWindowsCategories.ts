// ============================================================
// Doors & Windows category metadata — single source of truth.
//
// Mirrors shared/furnitureCategories.ts exactly in structure and purpose:
// deliberately framework-agnostic (no Vite-specific imports like
// import.meta.glob) so this file can be imported from BOTH:
//   - the frontend (src/data/doorsWindows.ts re-exports these), and
//   - Vercel serverless functions (api/*.ts) that need to validate an
//     upload's target category/folder server-side.
//
// The upload-provider folder for a category is always its `id` — e.g.
// category "hl-vista-slim" -> folder "hl-vista-slim" — same convention as
// Furniture (see shared/furnitureCategories.ts and api/cloudinary-sign.ts).
// ============================================================

export type DoorsWindowsCategoryId =
  | "hl-vista-slim"
  | "hl-50-casement-door"
  | "hl-retro-gulf-slim"
  | "hl-ultra-slim"
  | "hl-eco-gulf-slim"
  | "hl-elite-gulf-slim"
  | "metal-ceiling-systems"
  | "balcony-railing-system"
  | "modular-partition-facade"
  | "glass-partitions-doors"
  | "casement-windows-openable"
  | "sliding-folding-bifold";

export interface DoorsWindowsCategoryMeta {
  id: DoorsWindowsCategoryId;
  name: string;
  description: string;
  isPopulated: boolean;
  // For un-populated categories: the one real, client-confirmed data point
  // (from the handwritten notes) — shown honestly instead of inventing specs.
  confirmedNote?: string;
  // Sliding Folding Bi-Fold only: real panel-arrangement configurations.
  panelConfigs?: string[];
}

export const doorsWindowsCategories: DoorsWindowsCategoryMeta[] = [
  {
    id: "hl-vista-slim",
    name: "HL Vista Slim System",
    description: "Premium slim sliding system engineered for large openings and maximum glass visibility.",
    isPopulated: true,
  },
  {
    id: "hl-50-casement-door",
    name: "HL 50 Casement Door",
    description: "Grand openings, unyielding performance.",
    isPopulated: true,
  },
  {
    id: "hl-retro-gulf-slim",
    name: "HL Retro Gulf Slim System",
    description: "Embrace timeless charm with modern performance.",
    isPopulated: true,
  },
  {
    id: "hl-ultra-slim",
    name: "HL Ultra Slim System",
    description: "Redefining transparency — the ultimate in minimalist aesthetics.",
    isPopulated: true,
  },
  {
    id: "hl-eco-gulf-slim",
    name: "HL Eco Gulf Slim System",
    description: "Smart design that enhances aesthetics and natural light without exceeding your budget.",
    isPopulated: true,
  },
  {
    id: "hl-elite-gulf-slim",
    name: "HL Elite Gulf Slim System",
    description: "Unyielding strength, uninterrupted views.",
    isPopulated: true,
  },
  {
    id: "metal-ceiling-systems",
    name: "Metal Ceiling Systems",
    description: "Aluminium metal ceiling systems, including baffle-ceiling configurations.",
    isPopulated: false,
    confirmedNote: "Material: aluminium only. Includes a baffle-ceiling sub-type, covering all kinds of metal ceiling series.",
  },
  {
    id: "balcony-railing-system",
    name: "Balcony Railing System",
    description: "Aluminium balcony railing systems for residential and commercial facades.",
    isPopulated: false,
    confirmedNote: "Material: aluminium only.",
  },
  {
    id: "modular-partition-facade",
    name: "Modular Partition / Facade System",
    description: "Modular partition and facade systems for flexible interior and exterior configurations.",
    isPopulated: false,
  },
  {
    id: "glass-partitions-doors",
    name: "Glass Partitions & Doors",
    description: "Glass partition and door systems for open-plan residential and commercial interiors.",
    isPopulated: false,
    confirmedNote: "Glass thickness: 12 mm.",
  },
  {
    id: "casement-windows-openable",
    name: "Casement Windows (Openable)",
    description: "Openable casement window systems — distinct from the HL 50 Casement Door, which is a door system.",
    isPopulated: false,
    confirmedNote: "Mechanism: openable casement window.",
  },
  {
    id: "sliding-folding-bifold",
    name: "Sliding Folding Bi-Fold System",
    description: "Sliding folding bi-fold systems available in multiple panel arrangements.",
    isPopulated: false,
    panelConfigs: ["3+0", "3+1", "3+3 (centre openable)", "5+1", "5+0"],
  },
];

export const isDoorsWindowsCategoryId = (s: string): s is DoorsWindowsCategoryId =>
  doorsWindowsCategories.some((c) => c.id === s);
