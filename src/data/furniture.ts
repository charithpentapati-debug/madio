// ============================================================
// MADIO Furniture — data model and product catalogue
//
// SOURCE OF TRUTH: client-supplied PDFs only.
// All product codes mapped to MADIO-branded SKUs.
// Internal supplier SKU codes (FRN-*) are intentionally NOT stored in this
// file — a prior version kept them in a `sku_internal` field, which was never
// rendered but still shipped in the client JS bundle. See
// _quarantined-images/README.md for the removal note.
//
// Phase 4A: Beds category fully populated from
//   "BEDS PORTFOLIO. Frnij.pdf" (52 beds + 28 bedsides).
//   All other categories: stubbed for Phase 4B.
// ============================================================

// --------------- Category types ---------------

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
  isPopulated: boolean; // Phase 4A: only beds=true; 4B will flip the rest
}

// --------------- Product types ---------------

export interface FurnitureProductSpec {
  // All optional — populated only when real data is available from PDFs.
  // hasValue() guards hide empty fields in the UI.
  construction?: string;    // e.g. "Solid Wood, Cane, Plush Upholstery"
  material?: string;
  dimensions?: string;      // Overall dimensions — not yet documented in PDFs
  finish?: string;
  upholstery?: string;
  seatingHeight?: string;   // Relevant for chairs / bar chairs
  tableTop?: string;        // Relevant for tables
  warranty?: string;
  customizations?: string;  // Customization options
}

export interface FurnitureProductVariant {
  name: string;    // e.g. "King", "Queen", "Single"
  sku?: string;    // Variant-level SKU
  // Commerce extension — all undefined in Phase 1
  price?: string;
  stock?: number;
}

export interface FurnitureProduct {
  id: string;                      // URL slug, e.g. "mfb-001"
  sku: string;                     // User-facing reference, e.g. "MFB-001"
  name: string;                    // Product display name (= SKU until real names provided)
  category: FurnitureCategoryId;
  subcategory?: string;            // e.g. "bed" | "bedside" within the Beds category
  description: string;             // Product description — empty until client provides copy
  images: string[];                // Vite-resolved asset URLs; [] = placeholder rendered
  specs: FurnitureProductSpec;
  featured?: boolean;

  // Commerce extension points — ALL undefined in Phase 1; typed so adding them
  // later requires only data changes, not component rewrites.
  variants?: FurnitureProductVariant[];
  price?: string;
  stock?: number;
}

// --------------- Category metadata ---------------

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

// --------------- BEDS — Phase 4A (fully populated) ---------------
//
// Source: "BEDS PORTFOLIO. Frnij.pdf"
//
// 52 bed frames (catalogue pp. 3–19)  → MADIO codes MFB-001 to MFB-052
// 28 bedside tables (catalogue pp. 21–27) → MADIO codes MFBS-001 to MFBS-028
//
// Photography extracted from the client catalogue PDF (supplier suppressed per
// project rules — no FRN codes or supplier names are exposed in the UI).
// Product names and specs not present in the PDF — those fields remain TODO.

// Vite glob: imports all extracted bed PNGs at build time as resolved URLs.
// The Record key is the module path; the value is the asset URL string.
const _bedImgs = import.meta.glob<string>(
  "../assets/furniture/beds/*.png",
  { eager: true, import: "default" },
);

function bedImg(sku: string): string[] {
  const url = _bedImgs[`../assets/furniture/beds/${sku}.png`];
  return url ? [url] : [];
}

const bedsProducts: FurnitureProduct[] = [
  ...Array.from({ length: 52 }, (_, i): FurnitureProduct => {
    const num = String(i + 1).padStart(3, "0");
    const sku  = `MFB-${num}`;
    return {
      id:           `mfb-${num}`,
      sku,
      name:         sku,             // TODO: client to provide product names
      category:     "beds",
      subcategory:  "bed",
      description:  "",              // TODO: client to provide descriptions
      images:       bedImg(sku),     // extracted from catalogue PDF
      specs:        {},              // TODO: client to provide specs / dimensions
    };
  }),
  ...Array.from({ length: 28 }, (_, i): FurnitureProduct => {
    const num = String(i + 1).padStart(3, "0");
    const sku  = `MFBS-${num}`;
    return {
      id:           `mfbs-${num}`,
      sku,
      name:         sku,
      category:     "beds",
      subcategory:  "bedside",
      description:  "",
      images:       bedImg(sku),
      specs:        {},
    };
  }),
];

// --------------- Master product catalogue ---------------
// Phase 4B will add products for the other 8 categories.

// --------------- BAR CHAIRS — Phase 4B ---------------
const _barChairImgs = import.meta.glob<string>(
  '../assets/furniture/bar-chairs/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

function barChairImg(sku: string): string[] {
  const png = _barChairImgs[`../assets/furniture/bar-chairs/${sku}.png`];
  if (png) return [png];
  const jpeg = _barChairImgs[`../assets/furniture/bar-chairs/${sku}.jpeg`];
  if (jpeg) return [jpeg];
  const jpg = _barChairImgs[`../assets/furniture/bar-chairs/${sku}.jpg`];
  if (jpg) return [jpg];
  return [];
}

const barChairsProducts: FurnitureProduct[] = [
  {
    id:           "mfbc-001",
    sku:          "MFBC-001",
    name:         "CLASSIC CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-001"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20.6\" (W) x 22\" (D) x 46\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-002",
    sku:          "MFBC-002",
    name:         "TRAVIS CHAIR",
    category:     "bar-chairs",
    description:  "",
    // MFBC-002.png pulled — raw catalogue crop with visible supplier SKU
    // ("FRN-HC-001") and branding baked into the image. Falls back to
    // placeholder until a clean replacement photo is supplied.
    images:       [],
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 19\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-003",
    sku:          "MFBC-003",
    name:         "VERANO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-003"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 19\" (W) x 19\" (D) x 44\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-004",
    sku:          "MFBC-004",
    name:         "ROSELLE CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-004"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 21\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-005",
    sku:          "MFBC-005",
    name:         "LUMERA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-005"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18\" (W) x 19\" (D) x 41\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-006",
    sku:          "MFBC-006",
    name:         "ORLINA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-006"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 21\" (D) x 44\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-007",
    sku:          "MFBC-007",
    name:         "MONTERA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-007"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 16\" (W) x 17\" (D) x 40\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-008",
    sku:          "MFBC-008",
    name:         "OREVO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-008"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 17\" (W) x 18\" (D) x 42\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-009",
    sku:          "MFBC-009",
    name:         "ELANZO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-009"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18.5\" (W) x 19\" (D) x 42\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-010",
    sku:          "MFBC-010",
    name:         "ELOWEN CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-010"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18\" (W) x 19\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-011",
    sku:          "MFBC-011",
    name:         "VINTARA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-011"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 17\" (W) x 19\" (D) x 43\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-012",
    sku:          "MFBC-012",
    name:         "AURIC CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-012"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 17.5\" (W) x 22\" (D) x 44\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-013",
    sku:          "MFBC-013",
    name:         "ELIO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-013"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 16.5\" (W) x 19\" (D) x 43\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-014",
    sku:          "MFBC-014",
    name:         "VELUTO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-014"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18\" (W) x 21\" (D) x 42\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-015",
    sku:          "MFBC-015",
    name:         "AMBERLY CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-015"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 17.5\" (W) x 19\" (D) x 43\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-016",
    sku:          "MFBC-016",
    name:         "LUNERO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-016"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18\" (W) x 19\" (D) x 42\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-017",
    sku:          "MFBC-017",
    name:         "MONVERO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-017"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 21\" (W) x 21\" (D) x 41\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-018",
    sku:          "MFBC-018",
    name:         "ORVESSA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-018"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 22.6\" (W) x 20.6\" (D) x 41\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-019",
    sku:          "MFBC-019",
    name:         "VALEN CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-019"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 22\" (D) x 36.6 (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-020",
    sku:          "MFBC-020",
    name:         "ORÉL CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-020"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 19.6\" (W) x 19.6\" (D) x 44.6\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-021",
    sku:          "MFBC-021",
    name:         "CALIX CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-021"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 21\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-022",
    sku:          "MFBC-022",
    name:         "DORÉN CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-022"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 21\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-023",
    sku:          "MFBC-023",
    name:         "CAVARO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-023"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 19\" (W) x 22.6\" (D) x 40\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
  {
    id:           "mfbc-024",
    sku:          "MFBC-024",
    name:         "ORVEA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-024"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 19.6\" (W) x 22\" (D) x 40\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
  },
];

// --------------- COFFEE & CAFE TABLES — Phase 4B ---------------
const _coffeeTableImgs = import.meta.glob<string>(
  '../assets/furniture/coffee-cafe-tables/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

function coffeeTableImg(sku: string): string[] {
  const png = _coffeeTableImgs[`../assets/furniture/coffee-cafe-tables/${sku}.png`];
  if (png) return [png];
  const jpeg = _coffeeTableImgs[`../assets/furniture/coffee-cafe-tables/${sku}.jpeg`];
  if (jpeg) return [jpeg];
  const jpg = _coffeeTableImgs[`../assets/furniture/coffee-cafe-tables/${sku}.jpg`];
  if (jpg) return [jpg];
  return [];
}

const coffeeTablesProducts: FurnitureProduct[] = [
  {
    id:           "mfct-001",
    sku:          "MFCT-001",
    name:         "MFCT-001",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-001"),
    specs:        { material: "Acacia wood", dimensions: "W: 43\" D: 23\" H: 16\"", customizations: "Custom diﬀerent woods: " },
  },
  {
    id:           "mfct-002",
    sku:          "MFCT-002",
    name:         "MFCT-002",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-002"),
    specs:        { material: "Engineered wood", dimensions: "W: 61\" D: 84\" H: 85\"", customizations: "Custom diﬀerent woods: " },
  },
  {
    id:           "mfct-003",
    sku:          "MFCT-003",
    name:         "MFCT-003",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-003"),
    specs:        { material: "Acacia wood", dimensions: "W: 22\" D: 42\" H: 14\"", customizations: "Custom diﬀerent woods: " },
  },
  {
    id:           "mfct-004",
    sku:          "MFCT-004",
    name:         "MFCT-004",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-004"),
    specs:        { material: "Acacia wood", dimensions: "W: 50\" D: 25\" H: 16\"", customizations: "Custom diﬀerent woods: " },
  },
  {
    id:           "mfct-005",
    sku:          "MFCT-005",
    name:         "MFCT-005",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-005"),
    specs:        { material: "Metal base legs & marbel top", dimensions: "W: 36\" H: 16\"" },
  },
  {
    id:           "mfct-006",
    sku:          "MFCT-006",
    name:         "MFCT-006",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-006"),
    specs:        { material: "Metal base legs & marbel top", dimensions: "W: 36\" D: “ H: 16\"", customizations: "Custom diﬀerent woods: " },
  },
  {
    id:           "mfct-007",
    sku:          "MFCT-007",
    name:         "MFCT-007",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-007"),
    specs:        { material: "Acacia wood", dimensions: "W: 48\" D:24 “ H: 16\"", customizations: "Custom diﬀerent woods: " },
  },
  {
    id:           "mfct-008",
    sku:          "MFCT-008",
    name:         "MFCT-008",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-008"),
    specs:        { material: "Acacia wood", dimensions: "W: 36\" H: 16\"", customizations: "Custom diﬀerent woods: " },
  },
  {
    id:           "mfct-009",
    sku:          "MFCT-009",
    name:         "MFCT-009",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-009"),
    specs:        { material: "Metal", dimensions: "W: 54\" D:24 “ H: 16\"" },
  },
  {
    id:           "mfct-010",
    sku:          "MFCT-010",
    name:         "MFCT-010",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-010"),
    specs:        { material: "Marbel", dimensions: "W: 54\" D:24 “ H: 16\"" },
  },
  {
    id:           "mfct-011",
    sku:          "MFCT-011",
    name:         "MFCT-011",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-011"),
    specs:        { material: "Brass", dimensions: "W: 36“ H: 16\"" },
  },
  {
    id:           "mfct-012",
    sku:          "MFCT-012",
    name:         "MFCT-012",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-012"),
    specs:        { material: "Brass", dimensions: "W: 54\" D:54 “ H: 56\"" },
  },
  {
    id:           "mfct-013",
    sku:          "MFCT-013",
    name:         "MFCT-013",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-013"),
    specs:        { material: "Brass", dimensions: "W: 42“ H: 56\"" },
  },
  {
    id:           "mfct-014",
    sku:          "MFCT-014",
    name:         "MFCT-014",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-014"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 36\" H: 16\"" },
  },
  {
    id:           "mfct-015",
    sku:          "MFCT-015",
    name:         "MFCT-015",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-015"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 20\"" },
  },
  {
    id:           "mfct-016",
    sku:          "MFCT-016",
    name:         "MFCT-016",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-016"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" D:48 “ H: 16\"" },
  },
  {
    id:           "mfct-017",
    sku:          "MFCT-017",
    name:         "MFCT-017",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-017"),
    specs:        { material: "Acacia wood and cane work", dimensions: "W: 26\" H: 18\"" },
  },
  {
    id:           "mfct-018",
    sku:          "MFCT-018",
    name:         "MFCT-018",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-018"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 42\" H: 16\"" },
  },
  {
    id:           "mfct-019",
    sku:          "MFCT-019",
    name:         "MFCT-019",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-019"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 54\" D:54 “ H: 16\"" },
  },
  {
    id:           "mfct-020",
    sku:          "MFCT-020",
    name:         "MFCT-020",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-020"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 52\" D:22 “ H: 16\"" },
  },
  {
    id:           "mfct-021",
    sku:          "MFCT-021",
    name:         "MFCT-021",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-021"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 36\" H: 16\"" },
  },
  {
    id:           "mfct-022",
    sku:          "MFCT-022",
    name:         "MFCT-022",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-022"),
    specs:        { material: "Acacia wood", dimensions: "W: 43.3\" D: 22.4\" H: 15.5\"", customizations: "Custom diﬀerent woods: " },
  },
  {
    id:           "mfct-023",
    sku:          "MFCT-023",
    name:         "MFCT-023",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-023"),
    specs:        { material: "Metal base", dimensions: "W: 43.3\" D: 22\" H: 17.7\"", customizations: "Custom diﬀerent Marble options: " },
  },
  {
    id:           "mfct-024",
    sku:          "MFCT-024",
    name:         "MFCT-024",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-024"),
    specs:        { material: "Metal base", dimensions: "W: 46\" D: 46\" H: 30\"", customizations: "Custom diﬀerent Wooden top &" },
  },
  {
    id:           "mfct-025",
    sku:          "MFCT-025",
    name:         "MFCT-025",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-025"),
    specs:        { material: "Metal base", dimensions: "W: 46\" D: 46\" H: 30\"", customizations: "Custom diﬀerent Wooden top &" },
  },
  {
    id:           "mfct-026",
    sku:          "MFCT-026",
    name:         "MFCT-026",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-026"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 36\" H: 30\"" },
  },
  {
    id:           "mfct-027",
    sku:          "MFCT-027",
    name:         "MFCT-027",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-027"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 30\"" },
  },
  {
    id:           "mfct-028",
    sku:          "MFCT-028",
    name:         "MFCT-028",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-028"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 30\"" },
  },
  {
    id:           "mfct-029",
    sku:          "MFCT-029",
    name:         "MFCT-029",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-029"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 30\"" },
  },
  {
    id:           "mfct-030",
    sku:          "MFCT-030",
    name:         "MFCT-030",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-030"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 30\"" },
  },
  {
    id:           "mfct-031",
    sku:          "MFCT-031",
    name:         "MFCT-031",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-031"),
    specs:        { material: "Solidwood", dimensions: "W: 48\" H: 30\"" },
  },
  {
    id:           "mfct-032",
    sku:          "MFCT-032",
    name:         "MFCT-032",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-032"),
    specs:        { material: "Solidwood top & heavy metal base", dimensions: "W: 58\" D:36\" H: 30\"" },
  },
  {
    id:           "mfct-033",
    sku:          "MFCT-033",
    name:         "MFCT-033",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-033"),
    specs:        { material: "Solidwood", dimensions: "W: 26\" D:20\" H: 42\"" },
  },
  {
    id:           "mfct-034",
    sku:          "MFCT-034",
    name:         "MFCT-034",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-034"),
    specs:        { material: "Solidwood  top & metal base", dimensions: "W: 60\" D:60\" H: 74\"" },
  },
  {
    id:           "mfct-035",
    sku:          "MFCT-035",
    name:         "MFCT-035",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-035"),
    specs:        { material: "Marble  top & metal base", dimensions: "W: 60\" D:60\" H: 74\"" },
  },
];


// --------------- DAYBEDS — Phase 4B ---------------
const _daybedImgs = import.meta.glob<string>(
  '../assets/furniture/daybeds/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

function daybedImg(sku: string): string[] {
  const png = _daybedImgs[`../assets/furniture/daybeds/${sku}.png`];
  if (png) return [png];
  const jpeg = _daybedImgs[`../assets/furniture/daybeds/${sku}.jpeg`];
  if (jpeg) return [jpeg];
  const jpg = _daybedImgs[`../assets/furniture/daybeds/${sku}.jpg`];
  if (jpg) return [jpg];
  return [];
}

const daybedsProducts: FurnitureProduct[] = [
  {
    id:           "mfdb-001",
    sku:          "MFDB-001",
    name:         "MFDB-001",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-001"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-002",
    sku:          "MFDB-002",
    name:         "MFDB-002",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-002"),
    specs:        { construction: "Solid Wood & Plush Upholstery" },
  },
  {
    id:           "mfdb-003",
    sku:          "MFDB-003",
    name:         "MFDB-003",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-003"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-004",
    sku:          "MFDB-004",
    name:         "MFDB-004",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-004"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-005",
    sku:          "MFDB-005",
    name:         "MFDB-005",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-005"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-006",
    sku:          "MFDB-006",
    name:         "MFDB-006",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-006"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-007",
    sku:          "MFDB-007",
    name:         "MFDB-007",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-007"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-008",
    sku:          "MFDB-008",
    name:         "MFDB-008",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-008"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-009",
    sku:          "MFDB-009",
    name:         "MFDB-009",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-009"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-010",
    sku:          "MFDB-010",
    name:         "MFDB-010",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-010"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-011",
    sku:          "MFDB-011",
    name:         "MFDB-011",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-011"),
    specs:        { construction: "Solid Wood, Cane, Plush Upholstery" },
  },
  {
    id:           "mfdb-012",
    sku:          "MFDB-012",
    name:         "MFDB-012",
    category:     "daybeds",
    description:  "",
    images:       daybedImg("MFDB-012"),
    specs:        { construction: "Solid Wood & Plush Upholstery" },
  },
];

// --------------- OFFICE FURNITURE & SOFA — Phase 4B ---------------
const _officeImgs = import.meta.glob<string>(
  '../assets/furniture/office-furniture-sofa/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

function officeImg(sku: string): string[] {
  const png = _officeImgs[`../assets/furniture/office-furniture-sofa/${sku}.png`];
  if (png) return [png];
  const jpeg = _officeImgs[`../assets/furniture/office-furniture-sofa/${sku}.jpeg`];
  if (jpeg) return [jpeg];
  const jpg = _officeImgs[`../assets/furniture/office-furniture-sofa/${sku}.jpg`];
  if (jpg) return [jpg];
  return [];
}

const officeFurnitureSofaProducts: FurnitureProduct[] = [
  {
    id:           "mfo-001",
    sku:          "MFO-001",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-001"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° Rotatable, Adjustable Height"
    },
  },
  {
    id:           "mfo-002",
    sku:          "MFO-002",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-002"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° Rotatable, Adjustable Height"
    },
  },
  {
    id:           "mfo-003",
    sku:          "MFO-003",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-003"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-004",
    sku:          "MFO-004",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-004"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-005",
    sku:          "MFO-005",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-005"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-006",
    sku:          "MFO-006",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-006"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-007",
    sku:          "MFO-007",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-007"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-008",
    sku:          "MFO-008",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-008"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-009",
    sku:          "MFO-009",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-009"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-010",
    sku:          "MFO-010",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-010"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-011",
    sku:          "MFO-011",
    name:         "Aluminum Armrest Office Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-011"),
    specs:        {
      material: "ND PU, Aluminum Armrest with Soft Pad",
      customizations: "30-45 High Density Pure Foam, 85mm Chrome Gas Lift"
    },
  },
  {
    id:           "mfo-012",
    sku:          "MFO-012",
    name:         "Aluminum Armrest Office Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-012"),
    specs:        {
      material: "ND PU, Aluminum Armrest with Soft Pad",
      customizations: "30-45 High Density Pure Foam, 85mm Chrome Gas Lift"
    },
  },
  {
    id:           "mfo-013",
    sku:          "MFO-013",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-013"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D68 x H100 cm"
    },
  },
  {
    id:           "mfo-014",
    sku:          "MFO-014",
    name:         "Ergonomic High Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-014"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D68 x H111 cm"
    },
  },
  {
    id:           "mfo-015",
    sku:          "MFO-015",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-015"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D68 x H100 cm"
    },
  },
  {
    id:           "mfo-016",
    sku:          "MFO-016",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-016"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D68 x H1100 cm"
    },
  },
  {
    id:           "mfo-017",
    sku:          "MFO-017",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-017"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D68 x H100 cm"
    },
  },
  {
    id:           "mfo-018",
    sku:          "MFO-018",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-018"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D68 x H100 cm"
    },
  },
  {
    id:           "mfo-019",
    sku:          "MFO-019",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-019"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D68 x H100 cm"
    },
  },
  {
    id:           "mfo-020",
    sku:          "MFO-020",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-020"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D68 x H100 cm"
    },
  },
  {
    id:           "mfo-021",
    sku:          "MFO-021",
    name:         "Mesh Ergonomic Office Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-021"),
    specs:        {
      material: "Mesh, Polished Aluminium Base",
      customizations: "3D Headrest, Height Adjustable Backrest with 3D Lumbar Support, 4D armrest"
    },
  },
  {
    id:           "mfo-022",
    sku:          "MFO-022",
    name:         "Mesh Ergonomic Office Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-022"),
    specs:        {
      material: "Mesh, Polished Aluminium Base",
      customizations: "3D Headrest, Height Adjustable Backrest with 3D Lumbar Support, 4D armrest"
    },
  },
  {
    id:           "mfo-023",
    sku:          "MFO-023",
    name:         "Mesh Ergonomic Office Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-023"),
    specs:        {
      material: "Mesh, Polished Aluminium Base",
      customizations: "3D Headrest, Height Adjustable Backrest with 3D Lumbar Support, 4D armrest"
    },
  },
  {
    id:           "mfo-024",
    sku:          "MFO-024",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-024"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-025",
    sku:          "MFO-025",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-025"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-026",
    sku:          "MFO-026",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-026"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D67 x H123/130 cm"
    },
  },
  {
    id:           "mfo-027",
    sku:          "MFO-027",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-027"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support"
    },
  },
  {
    id:           "mfo-028",
    sku:          "MFO-028",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-028"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W64 x D60 x H107 cm"
    },
  },
  {
    id:           "mfo-029",
    sku:          "MFO-029",
    name:         "Ergonomic Medium Back Chair",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-029"),
    specs:        {
      material: "Premium Vegan Leather",
      customizations: "360° swivel Rotatable, Adjustable Height, Comfortable Arm Support", dimensions: "W72.5 x D70.5 x H99 cm"
    },
  },
  {
    id:           "mfo-030",
    sku:          "MFO-030",
    name:         "Premium Office Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-030"),
    specs:        {
      material: "Wooden Tabletop, Metal Legs", dimensions: "W100 x D120 x H75 cm", customizations: "Side storage unit with 2 lockable drawers"
    },
  },
  {
    id:           "mfo-031",
    sku:          "MFO-031",
    name:         "Elegant Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-031"),
    specs:        {
      material: "Wood Texture, Matte Black Finish", dimensions: "W160 x D160 x H75 cm", customizations: "Side storage / credenza unit"
    },
  },
  {
    id:           "mfo-032",
    sku:          "MFO-032",
    name:         "Premium Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-032"),
    specs:        {
      material: "Dark Wood Finish", dimensions: "W160 x D165 x H75 cm", customizations: "Attached side storage unit"
    },
  },
  {
    id:           "mfo-033",
    sku:          "MFO-033",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-033"),
    specs:        {
      dimensions: "W160 x D160 x H75 cm"
    },
  },
  {
    id:           "mfo-034",
    sku:          "MFO-034",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-034"),
    specs:        {
      dimensions: "W160 x D160 x H75 cm"
    },
  },
  {
    id:           "mfo-035",
    sku:          "MFO-035",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-035"),
    specs:        {
      dimensions: "W180 x D180 x H75 cm"
    },
  },
  {
    id:           "mfo-036",
    sku:          "MFO-036",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-036"),
    specs:        {
      dimensions: "W180 x D160 x H75 cm"
    },
  },
  {
    id:           "mfo-037",
    sku:          "MFO-037",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-037"),
    specs:        {
      dimensions: "W180 x D160 x H75 cm"
    },
  },
  {
    id:           "mfo-038",
    sku:          "MFO-038",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-038"),
    specs:        {
      dimensions: "W180 x D180 x H76 cm"
    },
  },
  {
    id:           "mfo-039",
    sku:          "MFO-039",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-039"),
    specs:        {
      dimensions: "W180 x D180 x H76 cm"
    },
  },
  {
    id:           "mfo-040",
    sku:          "MFO-040",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-040"),
    specs:        {
      dimensions: "W240 x D190 x H76 cm"
    },
  },
  {
    id:           "mfo-041",
    sku:          "MFO-041",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-041"),
    specs:        {
      dimensions: "W240 x D190 x H76 cm"
    },
  },
  {
    id:           "mfo-042",
    sku:          "MFO-042",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-042"),
    specs:        {
      dimensions: "W260 x D200 x H75 cm"
    },
  },
  {
    id:           "mfo-043",
    sku:          "MFO-043",
    name:         "Executive Desk",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-043"),
    specs:        {
      dimensions: "W320 x D140 x H75 cm"
    },
  },
  {
    id:           "mfo-044",
    sku:          "MFO-044",
    name:         "Office Pendant Lamp",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-044"),
    specs:        { dimensions: "1200mm" },
  },
  {
    id:           "mfo-045",
    sku:          "MFO-045",
    name:         "Antique Office Wall Clock",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-045"),
    specs:        { dimensions: "600mm" },
  },
  {
    id:           "mfo-046",
    sku:          "MFO-046",
    name:         "Office Decorative Piece",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-046"),
    specs:        {},
  },
  {
    id:           "mfo-047",
    sku:          "MFO-047",
    name:         "Premium Fabric Sofa (3-Seater)",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-047"),
    specs:        { material: "Premium Fabric" },
  },
  {
    id:           "mfo-048",
    sku:          "MFO-048",
    name:         "Premium Fabric Sofa (2-Seater)",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-048"),
    specs:        { material: "Premium Fabric" },
  },
  {
    id:           "mfo-049",
    sku:          "MFO-049",
    name:         "Premium Fabric Sofa (1-Seater)",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-049"),
    specs:        { material: "Premium Fabric" },
  },
  {
    id:           "mfo-050",
    sku:          "MFO-050",
    name:         "Decorative Office Plant",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-050"),
    specs:        { material: "Premium Fabric" },
  },
  {
    id:           "mfo-051",
    sku:          "MFO-051",
    name:         "Office Decorative Accent",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-051"),
    specs:        {},
  },
  {
    id:           "mfo-052",
    sku:          "MFO-052",
    name:         "Premium Italian Console Table",
    category:     "office-furniture-sofa",
    description:  "",
    images:       officeImg("MFO-052"),
    specs:        { dimensions: "140 x 42 x 83 cm" },
  },
];

// --------------- OUTDOOR — Phase 4B ---------------
const _outdoorImgs = import.meta.glob<string>(
  '../assets/furniture/outdoor/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

function outdoorImg(sku: string): string[] {
  const png = _outdoorImgs[`../assets/furniture/outdoor/${sku}.png`];
  if (png) return [png];
  const jpeg = _outdoorImgs[`../assets/furniture/outdoor/${sku}.jpeg`];
  if (jpeg) return [jpeg];
  const jpg = _outdoorImgs[`../assets/furniture/outdoor/${sku}.jpg`];
  if (jpg) return [jpg];
  return [];
}

const outdoorProducts: FurnitureProduct[] = [
  {
    id:           "mfout-001",
    sku:          "MFOUT-001",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-001"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 56 x 62 x 80, T- 63D x 48"
    },
  },
  {
    id:           "mfout-002",
    sku:          "MFOUT-002",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-002"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "56 x 62 x 80"
    },
  },
  {
    id:           "mfout-003",
    sku:          "MFOUT-003",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-003"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 58 x 60 x 78, T- 50D x 48"
    },
  },
  {
    id:           "mfout-004",
    sku:          "MFOUT-004",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-004"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "58 x 60 x 78"
    },
  },
  {
    id:           "mfout-005",
    sku:          "MFOUT-005",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-005"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 58 x 60 x 78, T- 50D x 48"
    },
  },
  {
    id:           "mfout-006",
    sku:          "MFOUT-006",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-006"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "58 x 60 x 78"
    },
  },
  {
    id:           "mfout-007",
    sku:          "MFOUT-007",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-007"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 51 x 55 x 76, T- 50D x 48"
    },
  },
  {
    id:           "mfout-008",
    sku:          "MFOUT-008",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-008"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "51 x 55 x 76"
    },
  },
  {
    id:           "mfout-009",
    sku:          "MFOUT-009",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-009"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 51 x 55 x 76, T- 50D x 48"
    },
  },
  {
    id:           "mfout-010",
    sku:          "MFOUT-010",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-010"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "51 x 55 x 76"
    },
  },
  {
    id:           "mfout-011",
    sku:          "MFOUT-011",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-011"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "54 x 60 x 80"
    },
  },
  {
    id:           "mfout-012",
    sku:          "MFOUT-012",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-012"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "54 x 60 x 80"
    },
  },
  {
    id:           "mfout-013",
    sku:          "MFOUT-013",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-013"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "54 x 60 x 80"
    },
  },
  {
    id:           "mfout-014",
    sku:          "MFOUT-014",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-014"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "54 x 60 x 80"
    },
  },
  {
    id:           "mfout-015",
    sku:          "MFOUT-015",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-015"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 62 x 66 x 75 | T - 51D x 52H"
    },
  },
  {
    id:           "mfout-016",
    sku:          "MFOUT-016",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-016"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "62 x 66 x 75"
    },
  },
  {
    id:           "mfout-017",
    sku:          "MFOUT-017",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-017"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 62 x 66 x 75 | T - 51D x 52H"
    },
  },
  {
    id:           "mfout-018",
    sku:          "MFOUT-018",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-018"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "62 x 66 x 75"
    },
  },
  {
    id:           "mfout-019",
    sku:          "MFOUT-019",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-019"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 62 x 65 x 78 | T - 51D x 52H"
    },
  },
  {
    id:           "mfout-020",
    sku:          "MFOUT-020",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-020"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "62 x 65 x 78"
    },
  },
  {
    id:           "mfout-021",
    sku:          "MFOUT-021",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-021"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 62 x 65 x 78 | T - 51D x 52H"
    },
  },
  {
    id:           "mfout-022",
    sku:          "MFOUT-022",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-022"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "62 x 65 x 78"
    },
  },
  {
    id:           "mfout-023",
    sku:          "MFOUT-023",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-023"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 56 x 62 x 76 | T - 51D x 52H"
    },
  },
  {
    id:           "mfout-024",
    sku:          "MFOUT-024",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-024"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "56 x 62 x 76"
    },
  },
  {
    id:           "mfout-025",
    sku:          "MFOUT-025",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-025"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 56 x 62 x 76 | T - 51D x 52H"
    },
  },
  {
    id:           "mfout-026",
    sku:          "MFOUT-026",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-026"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "56 x 62 x 76"
    },
  },
  {
    id:           "mfout-027",
    sku:          "MFOUT-027",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-027"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "C - 58 x 58 x 76 | T - 51D x 52H"
    },
  },
  {
    id:           "mfout-028",
    sku:          "MFOUT-028",
    name:         "Outdoor Rope Weaving",
    category:     "outdoor",
    description:  "",
    images:       outdoorImg("MFOUT-028"),
    specs:        {
      material: "Metal, Rope",
      finish: "Powder Coating",
      dimensions: "58 x 58 x 76"
    },
  },
];

// --------------- MIRRORS ---------------
// Photography extracted from client catalogue PDFs (48. MIRRORS.pdf, 49. MIRRORS.pdf,
// 39.MIRRORS WL.pdf) via embedded-image extraction, hand-reviewed for supplier
// watermarks/branding/quality before inclusion. Internal supplier codes are NOT
// stored here — see _internal-supplier-sku-map.txt for the cross-reference.
const _mirrorImgs = import.meta.glob<string>(
  '../assets/furniture/mirrors/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

function mirrorImg(sku: string): string[] {
  const png = _mirrorImgs[`../assets/furniture/mirrors/${sku}.png`];
  if (png) return [png];
  const jpeg = _mirrorImgs[`../assets/furniture/mirrors/${sku}.jpeg`];
  if (jpeg) return [jpeg];
  const jpg = _mirrorImgs[`../assets/furniture/mirrors/${sku}.jpg`];
  if (jpg) return [jpg];
  return [];
}

const mirrorsProducts: FurnitureProduct[] = [
  {
    id:           "mfm-001",
    sku:          "MFM-001",
    name:         "Aaranya Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-001"),
    specs:        { material: "Regular Mirror, Teak Wood", dimensions: "60\"X24\"" },
  },
  {
    id:           "mfm-002",
    sku:          "MFM-002",
    name:         "Ananta Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-002"),
    specs:        { material: "Regular Mirror, Metal" },
  },
  {
    id:           "mfm-003",
    sku:          "MFM-003",
    name:         "Aura Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-003"),
    specs:        { material: "Regular Mirror, Teakwood" },
  },
  {
    id:           "mfm-004",
    sku:          "MFM-004",
    name:         "Belt Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-004"),
    specs:        { material: "Metal, Leather, Regular" },
  },
  {
    id:           "mfm-005",
    sku:          "MFM-005",
    name:         "Ciara Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-005"),
    specs:        { material: "Regular Mirror, Teak Wood", dimensions: "52\"X18\", 78\"x27\"" },
  },
  {
    id:           "mfm-006",
    sku:          "MFM-006",
    name:         "Curve Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-006"),
    specs:        { material: "Teak Wood", dimensions: "36\"" },
  },
  {
    id:           "mfm-007",
    sku:          "MFM-007",
    name:         "Dino Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-007"),
    specs:        { material: "Regular Mirror, Teak Wood", dimensions: "51\"X18\"" },
  },
  {
    id:           "mfm-008",
    sku:          "MFM-008",
    name:         "Eira Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-008"),
    specs:        { material: "Regular Mirror, Teak Wood" },
  },
  {
    id:           "mfm-009",
    sku:          "MFM-009",
    name:         "Ember Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-009"),
    specs:        { material: "Regular Mirror, Teak Wood" },
  },
  {
    id:           "mfm-010",
    sku:          "MFM-010",
    name:         "Emerald Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-010"),
    specs:        { material: "Teak Wood", dimensions: "24\"X48\"" },
  },
  {
    id:           "mfm-011",
    sku:          "MFM-011",
    name:         "Evara Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-011"),
    specs:        { material: "Teak Wood", dimensions: "23\"x47\"" },
  },
  {
    id:           "mfm-012",
    sku:          "MFM-012",
    name:         "Fable Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-012"),
    specs:        { material: "Regular Mirror, Teak Wood" },
  },
  {
    id:           "mfm-013",
    sku:          "MFM-013",
    name:         "Helix Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-013"),
    specs:        { material: "Teak Wood", dimensions: "72\"X30\"" },
  },
  {
    id:           "mfm-014",
    sku:          "MFM-014",
    name:         "Lawrwnce Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-014"),
    specs:        { material: "Regular Mirror, Teak Wood", dimensions: "55\"X22\"" },
  },
  {
    id:           "mfm-015",
    sku:          "MFM-015",
    name:         "Ligna Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-015"),
    specs:        { material: "Regular Mirror, Teak Wood" },
  },
  {
    id:           "mfm-016",
    sku:          "MFM-016",
    name:         "Luzano Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-016"),
    specs:        { material: "Regular Mirror, Teak Wood" },
  },
  {
    id:           "mfm-017",
    sku:          "MFM-017",
    name:         "Mirenza Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-017"),
    specs:        { material: "Regular Mirror, Teak Wood", dimensions: "24\"X32\"" },
  },
  {
    id:           "mfm-018",
    sku:          "MFM-018",
    name:         "Orchid Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-018"),
    specs:        { material: "Regular Mirror, Frp", dimensions: "33\"" },
  },
  {
    id:           "mfm-019",
    sku:          "MFM-019",
    name:         "Orvia Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-019"),
    specs:        { material: "Teak Wood", dimensions: "18\"x42\"" },
  },
  {
    id:           "mfm-020",
    sku:          "MFM-020",
    name:         "Purewood Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-020"),
    specs:        { material: "Teak Wood", dimensions: "33\"" },
  },
  {
    id:           "mfm-021",
    sku:          "MFM-021",
    name:         "Pyramid Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-021"),
    specs:        { material: "Teak Wood", dimensions: "26\"x30\", 36\"X42\"" },
  },
  {
    id:           "mfm-022",
    sku:          "MFM-022",
    name:         "Refine Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-022"),
    specs:        { material: "Regular Mirror, Teak Wood" },
  },
  {
    id:           "mfm-023",
    sku:          "MFM-023",
    name:         "Reva Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-023"),
    specs:        { material: "Regular Mirror, Teak Wood", dimensions: "24\"X48\", 72\"x36\"" },
  },
  {
    id:           "mfm-024",
    sku:          "MFM-024",
    name:         "Selfie Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-024"),
    specs:        { material: "Teak Wood", dimensions: "65\"X30\"" },
  },
  {
    id:           "mfm-025",
    sku:          "MFM-025",
    name:         "Signature Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-025"),
    specs:        { material: "Regular Mirror, Mdf", dimensions: "34\"X72\"" },
  },
  {
    id:           "mfm-026",
    sku:          "MFM-026",
    name:         "Sleek Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-026"),
    specs:        { material: "Regular Mirror, Teakwood" },
  },
  {
    id:           "mfm-027",
    sku:          "MFM-027",
    name:         "Specchio Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-027"),
    specs:        { material: "Regular Mirror, Teak Wood" },
  },
  {
    id:           "mfm-028",
    sku:          "MFM-028",
    name:         "Spectra Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-028"),
    specs:        { material: "Regular Mirror, Metal" },
  },
  {
    id:           "mfm-029",
    sku:          "MFM-029",
    name:         "Trio Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-029"),
    specs:        { material: "Regular Mirror, Metal" },
  },
  {
    id:           "mfm-030",
    sku:          "MFM-030",
    name:         "Tripple Rectangle Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-030"),
    specs:        { material: "Regular Mirror, Metal" },
  },
  {
    id:           "mfm-031",
    sku:          "MFM-031",
    name:         "Vintage Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-031"),
    specs:        { material: "Regular Mirror, Teakwood" },
  },
  {
    id:           "mfm-032",
    sku:          "MFM-032",
    name:         "Vista Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-032"),
    specs:        { material: "Regular Mirror, Teakwood" },
  },
  {
    id:           "mfm-033",
    sku:          "MFM-033",
    name:         "Zen Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-033"),
    specs:        { material: "Regular Mirror, Metal" },
  },
  {
    id:           "mfm-034",
    sku:          "MFM-034",
    name:         "Zorro Mirror",
    category:     "mirrors",
    description:  "",
    images:       mirrorImg("MFM-034"),
    specs:        { material: "Teak Wood", dimensions: "60\"X28\"" },
  },
  {
    id:           "mfm-035",
    sku:          "MFM-035",
    name:         "Ariso Mirror",
    category:     "mirrors",
    description:  "",
    images:       [],
    specs:        { material: "Regular Mirror, Metal" },
  },
  {
    id:           "mfm-036",
    sku:          "MFM-036",
    name:         "Aurelia Mirror",
    category:     "mirrors",
    description:  "",
    images:       [],
    specs:        { material: "Regular Mirror, Teak Wood", dimensions: "24\"x52\"" },
  },
  {
    id:           "mfm-037",
    sku:          "MFM-037",
    name:         "Aurex Mirror",
    category:     "mirrors",
    description:  "",
    images:       [],
    specs:        { material: "S S Frame", dimensions: "55\"x24\"" },
  },
  {
    id:           "mfm-038",
    sku:          "MFM-038",
    name:         "Triple Unity Mirror",
    category:     "mirrors",
    description:  "",
    images:       [],
    specs:        { material: "Ss" },
  },
  {
    id:           "mfm-039",
    sku:          "MFM-039",
    name:         "Vintage Pro Mirror",
    category:     "mirrors",
    description:  "",
    images:       [],
    specs:        { material: "Regular Mirror, Teakwood" },
  },
];

// --------------- WALL ART ---------------
// Extracted from client catalogue PDFs (171/176/186 WALLARTS.pdf) via embedded-image
// extraction. Sample-reviewed (not exhaustive given volume — ~160 products) for supplier
// watermarks/branding/quality, plus an automated scan across ALL parsed names for
// third-party brand/trademark terms (2 hits found and neutralized: an IKEA and a Nexon
// reference in the supplier's own naming — replaced with the SKU as display name).
const _wallArtImgs = import.meta.glob<string>(
  '../assets/furniture/wall-art/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

function wallArtImg(sku: string): string[] {
  const png = _wallArtImgs[`../assets/furniture/wall-art/${sku}.png`];
  if (png) return [png];
  const jpeg = _wallArtImgs[`../assets/furniture/wall-art/${sku}.jpeg`];
  if (jpeg) return [jpeg];
  const jpg = _wallArtImgs[`../assets/furniture/wall-art/${sku}.jpg`];
  if (jpg) return [jpg];
  return [];
}

const wallArtProducts: FurnitureProduct[] = [
  {
    id:           "mfwa-001",
    sku:          "MFWA-001",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-001"),
    specs:        {},
  },
  {
    id:           "mfwa-002",
    sku:          "MFWA-002",
    name:         "Skyler Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-002"),
    specs:        {},
  },
  {
    id:           "mfwa-003",
    sku:          "MFWA-003",
    name:         "Saturn Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-003"),
    specs:        {},
  },
  {
    id:           "mfwa-004",
    sku:          "MFWA-004",
    name:         "MFWA-004",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-004"),
    specs:        {},
  },
  {
    id:           "mfwa-005",
    sku:          "MFWA-005",
    name:         "Oracle Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-005"),
    specs:        {},
  },
  {
    id:           "mfwa-006",
    sku:          "MFWA-006",
    name:         "Mercury Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-006"),
    specs:        {},
  },
  {
    id:           "mfwa-007",
    sku:          "MFWA-007",
    name:         "Hills Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-007"),
    specs:        {},
  },
  {
    id:           "mfwa-008",
    sku:          "MFWA-008",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-008"),
    specs:        {},
  },
  {
    id:           "mfwa-009",
    sku:          "MFWA-009",
    name:         "Waterdrop Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-009"),
    specs:        {},
  },
  {
    id:           "mfwa-010",
    sku:          "MFWA-010",
    name:         "Glimpse Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-010"),
    specs:        {},
  },
  {
    id:           "mfwa-011",
    sku:          "MFWA-011",
    name:         "Fusia Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-011"),
    specs:        { dimensions: "30\",48\"" },
  },
  {
    id:           "mfwa-012",
    sku:          "MFWA-012",
    name:         "Blossom Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-012"),
    specs:        {},
  },
  {
    id:           "mfwa-013",
    sku:          "MFWA-013",
    name:         "Azure Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-013"),
    specs:        {},
  },
  {
    id:           "mfwa-014",
    sku:          "MFWA-014",
    name:         "Clifton Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-014"),
    specs:        {},
  },
  {
    id:           "mfwa-015",
    sku:          "MFWA-015",
    name:         "Thumb Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-015"),
    specs:        {},
  },
  {
    id:           "mfwa-016",
    sku:          "MFWA-016",
    name:         "Callisto Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-016"),
    specs:        {},
  },
  {
    id:           "mfwa-017",
    sku:          "MFWA-017",
    name:         "Angelic Wall Art",
    category:     "wall-art",
    description:  "",
    images:       [],
    specs:        {},
  },
  {
    id:           "mfwa-018",
    sku:          "MFWA-018",
    name:         "Safal Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-018"),
    specs:        {},
  },
  {
    id:           "mfwa-019",
    sku:          "MFWA-019",
    name:         "Seibel Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-019"),
    specs:        {},
  },
  {
    id:           "mfwa-020",
    sku:          "MFWA-020",
    name:         "Ellision Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-020"),
    specs:        {},
  },
  {
    id:           "mfwa-021",
    sku:          "MFWA-021",
    name:         "Carnival Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-021"),
    specs:        {},
  },
  {
    id:           "mfwa-022",
    sku:          "MFWA-022",
    name:         "Ethereal Pro Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-022"),
    specs:        {},
  },
  {
    id:           "mfwa-023",
    sku:          "MFWA-023",
    name:         "Alloy Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-023"),
    specs:        {},
  },
  {
    id:           "mfwa-024",
    sku:          "MFWA-024",
    name:         "Artistic Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-024"),
    specs:        {},
  },
  {
    id:           "mfwa-025",
    sku:          "MFWA-025",
    name:         "Lumina Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-025"),
    specs:        {},
  },
  {
    id:           "mfwa-026",
    sku:          "MFWA-026",
    name:         "Galaxy Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-026"),
    specs:        {},
  },
  {
    id:           "mfwa-027",
    sku:          "MFWA-027",
    name:         "Golden Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-027"),
    specs:        { dimensions: "9\",11\",13\" (SET OF 3),SCULPTURE =7\"" },
  },
  {
    id:           "mfwa-028",
    sku:          "MFWA-028",
    name:         "Elix Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-028"),
    specs:        {},
  },
  {
    id:           "mfwa-029",
    sku:          "MFWA-029",
    name:         "Horse Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-029"),
    specs:        {},
  },
  {
    id:           "mfwa-030",
    sku:          "MFWA-030",
    name:         "Carnival Pro Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-030"),
    specs:        {},
  },
  {
    id:           "mfwa-031",
    sku:          "MFWA-031",
    name:         "Abstact Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-031"),
    specs:        {},
  },
  {
    id:           "mfwa-032",
    sku:          "MFWA-032",
    name:         "Abstact Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-032"),
    specs:        {},
  },
  {
    id:           "mfwa-033",
    sku:          "MFWA-033",
    name:         "Pyrite",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-033"),
    specs:        {},
  },
  {
    id:           "mfwa-034",
    sku:          "MFWA-034",
    name:         "Pyrite Cone Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-034"),
    specs:        {},
  },
  {
    id:           "mfwa-035",
    sku:          "MFWA-035",
    name:         "Selen Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-035"),
    specs:        {},
  },
  {
    id:           "mfwa-036",
    sku:          "MFWA-036",
    name:         "Symphony Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-036"),
    specs:        {},
  },
  {
    id:           "mfwa-037",
    sku:          "MFWA-037",
    name:         "Abstract Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-037"),
    specs:        {},
  },
  {
    id:           "mfwa-038",
    sku:          "MFWA-038",
    name:         "Abstract Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-038"),
    specs:        {},
  },
  {
    id:           "mfwa-039",
    sku:          "MFWA-039",
    name:         "Abstract Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-039"),
    specs:        {},
  },
  {
    id:           "mfwa-040",
    sku:          "MFWA-040",
    name:         "Celestial Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-040"),
    specs:        {},
  },
  {
    id:           "mfwa-041",
    sku:          "MFWA-041",
    name:         "Universal Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-041"),
    specs:        {},
  },
  {
    id:           "mfwa-042",
    sku:          "MFWA-042",
    name:         "Epic Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-042"),
    specs:        {},
  },
  {
    id:           "mfwa-043",
    sku:          "MFWA-043",
    name:         "Artistry Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-043"),
    specs:        {},
  },
  {
    id:           "mfwa-044",
    sku:          "MFWA-044",
    name:         "Aura Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-044"),
    specs:        {},
  },
  {
    id:           "mfwa-045",
    sku:          "MFWA-045",
    name:         "Urban Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-045"),
    specs:        {},
  },
  {
    id:           "mfwa-046",
    sku:          "MFWA-046",
    name:         "Serene Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-046"),
    specs:        {},
  },
  {
    id:           "mfwa-047",
    sku:          "MFWA-047",
    name:         "MFWA-047",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-047"),
    specs:        {},
  },
  {
    id:           "mfwa-048",
    sku:          "MFWA-048",
    name:         "Noble Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-048"),
    specs:        {},
  },
  {
    id:           "mfwa-049",
    sku:          "MFWA-049",
    name:         "Wonder Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-049"),
    specs:        {},
  },
  {
    id:           "mfwa-050",
    sku:          "MFWA-050",
    name:         "Sthira Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-050"),
    specs:        {},
  },
  {
    id:           "mfwa-051",
    sku:          "MFWA-051",
    name:         "Palette Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-051"),
    specs:        {},
  },
  {
    id:           "mfwa-052",
    sku:          "MFWA-052",
    name:         "Fairytale Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-052"),
    specs:        {},
  },
  {
    id:           "mfwa-053",
    sku:          "MFWA-053",
    name:         "Surf Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-053"),
    specs:        {},
  },
  {
    id:           "mfwa-054",
    sku:          "MFWA-054",
    name:         "Cubic Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-054"),
    specs:        {},
  },
  {
    id:           "mfwa-055",
    sku:          "MFWA-055",
    name:         "Magic Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-055"),
    specs:        {},
  },
  {
    id:           "mfwa-056",
    sku:          "MFWA-056",
    name:         "Easter Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-056"),
    specs:        {},
  },
  {
    id:           "mfwa-057",
    sku:          "MFWA-057",
    name:         "Fusion Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-057"),
    specs:        {},
  },
  {
    id:           "mfwa-058",
    sku:          "MFWA-058",
    name:         "Inspire Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-058"),
    specs:        {},
  },
  {
    id:           "mfwa-059",
    sku:          "MFWA-059",
    name:         "Bliss Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-059"),
    specs:        {},
  },
  {
    id:           "mfwa-060",
    sku:          "MFWA-060",
    name:         "Splash Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-060"),
    specs:        {},
  },
  {
    id:           "mfwa-061",
    sku:          "MFWA-061",
    name:         "Og Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-061"),
    specs:        {},
  },
  {
    id:           "mfwa-062",
    sku:          "MFWA-062",
    name:         "S Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-062"),
    specs:        {},
  },
  {
    id:           "mfwa-063",
    sku:          "MFWA-063",
    name:         "Tapestry Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-063"),
    specs:        {},
  },
  {
    id:           "mfwa-064",
    sku:          "MFWA-064",
    name:         "Chic Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-064"),
    specs:        {},
  },
  {
    id:           "mfwa-065",
    sku:          "MFWA-065",
    name:         "Cat Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-065"),
    specs:        {},
  },
  {
    id:           "mfwa-066",
    sku:          "MFWA-066",
    name:         "Belle Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-066"),
    specs:        {},
  },
  {
    id:           "mfwa-067",
    sku:          "MFWA-067",
    name:         "Sparrow Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-067"),
    specs:        {},
  },
  {
    id:           "mfwa-068",
    sku:          "MFWA-068",
    name:         "Trio Face Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-068"),
    specs:        {},
  },
  {
    id:           "mfwa-069",
    sku:          "MFWA-069",
    name:         "Visual Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-069"),
    specs:        {},
  },
  {
    id:           "mfwa-070",
    sku:          "MFWA-070",
    name:         "Artisan Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-070"),
    specs:        {},
  },
  {
    id:           "mfwa-071",
    sku:          "MFWA-071",
    name:         "Dreamscape Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-071"),
    specs:        {},
  },
  {
    id:           "mfwa-072",
    sku:          "MFWA-072",
    name:         "Vibrant Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-072"),
    specs:        {},
  },
  {
    id:           "mfwa-073",
    sku:          "MFWA-073",
    name:         "Lotus Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-073"),
    specs:        {},
  },
  {
    id:           "mfwa-074",
    sku:          "MFWA-074",
    name:         "Fractured Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-074"),
    specs:        {},
  },
  {
    id:           "mfwa-075",
    sku:          "MFWA-075",
    name:         "Bloom Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-075"),
    specs:        {},
  },
  {
    id:           "mfwa-076",
    sku:          "MFWA-076",
    name:         "Horizon Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-076"),
    specs:        {},
  },
  {
    id:           "mfwa-077",
    sku:          "MFWA-077",
    name:         "Rustic Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-077"),
    specs:        {},
  },
  {
    id:           "mfwa-078",
    sku:          "MFWA-078",
    name:         "Plush Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-078"),
    specs:        {},
  },
  {
    id:           "mfwa-079",
    sku:          "MFWA-079",
    name:         "Charcoal Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-079"),
    specs:        {},
  },
  {
    id:           "mfwa-080",
    sku:          "MFWA-080",
    name:         "Thread Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-080"),
    specs:        {},
  },
  {
    id:           "mfwa-081",
    sku:          "MFWA-081",
    name:         "Green Horizon Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-081"),
    specs:        {},
  },
  {
    id:           "mfwa-082",
    sku:          "MFWA-082",
    name:         "Face Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-082"),
    specs:        {},
  },
  {
    id:           "mfwa-083",
    sku:          "MFWA-083",
    name:         "Double Horse Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-083"),
    specs:        {},
  },
  {
    id:           "mfwa-084",
    sku:          "MFWA-084",
    name:         "Fort Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-084"),
    specs:        {},
  },
  {
    id:           "mfwa-085",
    sku:          "MFWA-085",
    name:         "Grey Square Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-085"),
    specs:        {},
  },
  {
    id:           "mfwa-086",
    sku:          "MFWA-086",
    name:         "Angle Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-086"),
    specs:        {},
  },
  {
    id:           "mfwa-087",
    sku:          "MFWA-087",
    name:         "Fabrica Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-087"),
    specs:        {},
  },
  {
    id:           "mfwa-088",
    sku:          "MFWA-088",
    name:         "Olive Hues Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-088"),
    specs:        {},
  },
  {
    id:           "mfwa-089",
    sku:          "MFWA-089",
    name:         "Forest Valley Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-089"),
    specs:        {},
  },
  {
    id:           "mfwa-090",
    sku:          "MFWA-090",
    name:         "Timber Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-090"),
    specs:        {},
  },
  {
    id:           "mfwa-091",
    sku:          "MFWA-091",
    name:         "Dream Waves Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-091"),
    specs:        {},
  },
  {
    id:           "mfwa-092",
    sku:          "MFWA-092",
    name:         "Brown Horse Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-092"),
    specs:        {},
  },
  {
    id:           "mfwa-093",
    sku:          "MFWA-093",
    name:         "Glory Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-093"),
    specs:        {},
  },
  {
    id:           "mfwa-094",
    sku:          "MFWA-094",
    name:         "Earthen Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-094"),
    specs:        {},
  },
  {
    id:           "mfwa-095",
    sku:          "MFWA-095",
    name:         "Mahadev Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-095"),
    specs:        {},
  },
  {
    id:           "mfwa-096",
    sku:          "MFWA-096",
    name:         "Spirit Faces",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-096"),
    specs:        {},
  },
  {
    id:           "mfwa-097",
    sku:          "MFWA-097",
    name:         "Soulful Mask",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-097"),
    specs:        {},
  },
  {
    id:           "mfwa-098",
    sku:          "MFWA-098",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-098"),
    specs:        {},
  },
  {
    id:           "mfwa-099",
    sku:          "MFWA-099",
    name:         "Clifton Pro Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-099"),
    specs:        {},
  },
  {
    id:           "mfwa-100",
    sku:          "MFWA-100",
    name:         "Wood Palate Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-100"),
    specs:        {},
  },
  {
    id:           "mfwa-101",
    sku:          "MFWA-101",
    name:         "Wood Square Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-101"),
    specs:        {},
  },
  {
    id:           "mfwa-102",
    sku:          "MFWA-102",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-102"),
    specs:        {},
  },
  {
    id:           "mfwa-103",
    sku:          "MFWA-103",
    name:         "Up Down Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-103"),
    specs:        {},
  },
  {
    id:           "mfwa-104",
    sku:          "MFWA-104",
    name:         "Leaves Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-104"),
    specs:        {},
  },
  {
    id:           "mfwa-105",
    sku:          "MFWA-105",
    name:         "Liner Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-105"),
    specs:        {},
  },
  {
    id:           "mfwa-106",
    sku:          "MFWA-106",
    name:         "Infina Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-106"),
    specs:        {},
  },
  {
    id:           "mfwa-107",
    sku:          "MFWA-107",
    name:         "Elephant Pro Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-107"),
    specs:        {},
  },
  {
    id:           "mfwa-108",
    sku:          "MFWA-108",
    name:         "Lumira Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-108"),
    specs:        {},
  },
  {
    id:           "mfwa-109",
    sku:          "MFWA-109",
    name:         "Empirea Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-109"),
    specs:        {},
  },
  {
    id:           "mfwa-110",
    sku:          "MFWA-110",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-110"),
    specs:        {},
  },
  {
    id:           "mfwa-111",
    sku:          "MFWA-111",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-111"),
    specs:        {},
  },
  {
    id:           "mfwa-112",
    sku:          "MFWA-112",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-112"),
    specs:        {},
  },
  {
    id:           "mfwa-113",
    sku:          "MFWA-113",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-113"),
    specs:        {},
  },
  {
    id:           "mfwa-114",
    sku:          "MFWA-114",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-114"),
    specs:        {},
  },
  {
    id:           "mfwa-115",
    sku:          "MFWA-115",
    name:         "Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-115"),
    specs:        {},
  },
  {
    id:           "mfwa-116",
    sku:          "MFWA-116",
    name:         "Florina Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-116"),
    specs:        {},
  },
  {
    id:           "mfwa-117",
    sku:          "MFWA-117",
    name:         "Moon Pro Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-117"),
    specs:        {},
  },
  {
    id:           "mfwa-118",
    sku:          "MFWA-118",
    name:         "Casa Mask Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-118"),
    specs:        {},
  },
  {
    id:           "mfwa-119",
    sku:          "MFWA-119",
    name:         "Ornella Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-119"),
    specs:        {},
  },
  {
    id:           "mfwa-120",
    sku:          "MFWA-120",
    name:         "Black Horse Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-120"),
    specs:        {},
  },
  {
    id:           "mfwa-121",
    sku:          "MFWA-121",
    name:         "Arista Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-121"),
    specs:        {},
  },
  {
    id:           "mfwa-122",
    sku:          "MFWA-122",
    name:         "Nuvira Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-122"),
    specs:        {},
  },
  {
    id:           "mfwa-123",
    sku:          "MFWA-123",
    name:         "Opira Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-123"),
    specs:        {},
  },
  {
    id:           "mfwa-124",
    sku:          "MFWA-124",
    name:         "Lady With Ring",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-124"),
    specs:        {},
  },
  {
    id:           "mfwa-125",
    sku:          "MFWA-125",
    name:         "Immora Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-125"),
    specs:        {},
  },
  {
    id:           "mfwa-126",
    sku:          "MFWA-126",
    name:         "Sitting Man With Ring",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-126"),
    specs:        {},
  },
  {
    id:           "mfwa-127",
    sku:          "MFWA-127",
    name:         "Lumina Pro Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-127"),
    specs:        {},
  },
  {
    id:           "mfwa-128",
    sku:          "MFWA-128",
    name:         "Dancing Dolls",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-128"),
    specs:        {},
  },
  {
    id:           "mfwa-129",
    sku:          "MFWA-129",
    name:         "Man With Horse",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-129"),
    specs:        {},
  },
  {
    id:           "mfwa-130",
    sku:          "MFWA-130",
    name:         "Silent Man",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-130"),
    specs:        {},
  },
  {
    id:           "mfwa-131",
    sku:          "MFWA-131",
    name:         "Pristora Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-131"),
    specs:        {},
  },
  {
    id:           "mfwa-132",
    sku:          "MFWA-132",
    name:         "Whisper Of Souls Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-132"),
    specs:        {},
  },
  {
    id:           "mfwa-133",
    sku:          "MFWA-133",
    name:         "Smiling Soul Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-133"),
    specs:        {},
  },
  {
    id:           "mfwa-134",
    sku:          "MFWA-134",
    name:         "Red Rising Foldwall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-134"),
    specs:        {},
  },
  {
    id:           "mfwa-135",
    sku:          "MFWA-135",
    name:         "Pure Fold Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-135"),
    specs:        {},
  },
  {
    id:           "mfwa-136",
    sku:          "MFWA-136",
    name:         "Human Axis Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-136"),
    specs:        {},
  },
  {
    id:           "mfwa-137",
    sku:          "MFWA-137",
    name:         "Earthline Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-137"),
    specs:        {},
  },
  {
    id:           "mfwa-138",
    sku:          "MFWA-138",
    name:         "Hollow Curve Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-138"),
    specs:        {},
  },
  {
    id:           "mfwa-139",
    sku:          "MFWA-139",
    name:         "Silent Faces Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-139"),
    specs:        {},
  },
  {
    id:           "mfwa-140",
    sku:          "MFWA-140",
    name:         "Quiet Faces Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-140"),
    specs:        {},
  },
  {
    id:           "mfwa-141",
    sku:          "MFWA-141",
    name:         "Flora Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-141"),
    specs:        {},
  },
  {
    id:           "mfwa-142",
    sku:          "MFWA-142",
    name:         "Pause Faces Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-142"),
    specs:        {},
  },
  {
    id:           "mfwa-143",
    sku:          "MFWA-143",
    name:         "Blue Current Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-143"),
    specs:        {},
  },
  {
    id:           "mfwa-144",
    sku:          "MFWA-144",
    name:         "Parallel Souls Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-144"),
    specs:        {},
  },
  {
    id:           "mfwa-145",
    sku:          "MFWA-145",
    name:         "Atlas Disc Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-145"),
    specs:        {},
  },
  {
    id:           "mfwa-146",
    sku:          "MFWA-146",
    name:         "Fuild Flow Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-146"),
    specs:        {},
  },
  {
    id:           "mfwa-147",
    sku:          "MFWA-147",
    name:         "Shiva Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-147"),
    specs:        {},
  },
  {
    id:           "mfwa-148",
    sku:          "MFWA-148",
    name:         "Human Drapes Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-148"),
    specs:        {},
  },
  {
    id:           "mfwa-149",
    sku:          "MFWA-149",
    name:         "Terra Fold Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-149"),
    specs:        {},
  },
  {
    id:           "mfwa-150",
    sku:          "MFWA-150",
    name:         "Divided Circle Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-150"),
    specs:        {},
  },
  {
    id:           "mfwa-151",
    sku:          "MFWA-151",
    name:         "Silent Currents Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-151"),
    specs:        {},
  },
  {
    id:           "mfwa-152",
    sku:          "MFWA-152",
    name:         "Woodland Matrix Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-152"),
    specs:        {},
  },
  {
    id:           "mfwa-153",
    sku:          "MFWA-153",
    name:         "Calm Carvings Wall Art",
    category:     "wall-art",
    description:  "",
    images:       [],
    specs:        {},
  },
  {
    id:           "mfwa-154",
    sku:          "MFWA-154",
    name:         "Woodwave Circle Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-154"),
    specs:        {},
  },
  {
    id:           "mfwa-155",
    sku:          "MFWA-155",
    name:         "Silent Struggle Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-155"),
    specs:        {},
  },
  {
    id:           "mfwa-156",
    sku:          "MFWA-156",
    name:         "Fort Pro Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-156"),
    specs:        {},
  },
  {
    id:           "mfwa-157",
    sku:          "MFWA-157",
    name:         "Flowridge Panels Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-157"),
    specs:        {},
  },
  {
    id:           "mfwa-158",
    sku:          "MFWA-158",
    name:         "Silent Avians Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-158"),
    specs:        {},
  },
  {
    id:           "mfwa-159",
    sku:          "MFWA-159",
    name:         "Mark Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-159"),
    specs:        {},
  },
  {
    id:           "mfwa-160",
    sku:          "MFWA-160",
    name:         "Fight Of Becoming Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-160"),
    specs:        {},
  },
  {
    id:           "mfwa-161",
    sku:          "MFWA-161",
    name:         "Abstract Wall Art",
    category:     "wall-art",
    description:  "",
    images:       wallArtImg("MFWA-161"),
    specs:        {},
  },
];

// --------------- CLOCKS ---------------
// Extracted from client catalogue PDF (58.CLOCKS .WL.pdf). Sample-reviewed (not
// exhaustive — ~49 products). Automated brand-name scan found 3 hits (Costco, Mini
// Cooper, Nomon — all real third-party brands used as informal names by the supplier)
// — neutralized to SKU as display name.
const _clockImgs = import.meta.glob<string>(
  '../assets/furniture/clocks/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

function clockImg(sku: string): string[] {
  const png = _clockImgs[`../assets/furniture/clocks/${sku}.png`];
  if (png) return [png];
  const jpeg = _clockImgs[`../assets/furniture/clocks/${sku}.jpeg`];
  if (jpeg) return [jpeg];
  const jpg = _clockImgs[`../assets/furniture/clocks/${sku}.jpg`];
  if (jpg) return [jpg];
  return [];
}

const clockProducts: FurnitureProduct[] = [
  {
    id:           "mfcl-001",
    sku:          "MFCL-001",
    name:         "MFCL-001",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-001"),
    specs:        {},
  },
  {
    id:           "mfcl-002",
    sku:          "MFCL-002",
    name:         "Black Circle Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-002"),
    specs:        {},
  },
  {
    id:           "mfcl-003",
    sku:          "MFCL-003",
    name:         "Destiny Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-003"),
    specs:        {},
  },
  {
    id:           "mfcl-004",
    sku:          "MFCL-004",
    name:         "Oval Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-004"),
    specs:        {},
  },
  {
    id:           "mfcl-005",
    sku:          "MFCL-005",
    name:         "Champion Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-005"),
    specs:        {},
  },
  {
    id:           "mfcl-006",
    sku:          "MFCL-006",
    name:         "Minerva Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-006"),
    specs:        {},
  },
  {
    id:           "mfcl-007",
    sku:          "MFCL-007",
    name:         "Marble Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-007"),
    specs:        {},
  },
  {
    id:           "mfcl-008",
    sku:          "MFCL-008",
    name:         "Marvel Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-008"),
    specs:        {},
  },
  {
    id:           "mfcl-009",
    sku:          "MFCL-009",
    name:         "Icon Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-009"),
    specs:        {},
  },
  {
    id:           "mfcl-010",
    sku:          "MFCL-010",
    name:         "Woo",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-010"),
    specs:        {},
  },
  {
    id:           "mfcl-011",
    sku:          "MFCL-011",
    name:         "MFCL-011",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-011"),
    specs:        {},
  },
  {
    id:           "mfcl-012",
    sku:          "MFCL-012",
    name:         "Kiva Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-012"),
    specs:        {},
  },
  {
    id:           "mfcl-013",
    sku:          "MFCL-013",
    name:         "Bruno Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-013"),
    specs:        {},
  },
  {
    id:           "mfcl-014",
    sku:          "MFCL-014",
    name:         "Stainley Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-014"),
    specs:        {},
  },
  {
    id:           "mfcl-015",
    sku:          "MFCL-015",
    name:         "Celleyssa Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-015"),
    specs:        {},
  },
  {
    id:           "mfcl-016",
    sku:          "MFCL-016",
    name:         "Magic Art Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-016"),
    specs:        {},
  },
  {
    id:           "mfcl-017",
    sku:          "MFCL-017",
    name:         "Elight Table Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-017"),
    specs:        {},
  },
  {
    id:           "mfcl-018",
    sku:          "MFCL-018",
    name:         "Jupiter Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-018"),
    specs:        {},
  },
  {
    id:           "mfcl-019",
    sku:          "MFCL-019",
    name:         "Pluto Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-019"),
    specs:        {},
  },
  {
    id:           "mfcl-020",
    sku:          "MFCL-020",
    name:         "Alpha Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-020"),
    specs:        {},
  },
  {
    id:           "mfcl-021",
    sku:          "MFCL-021",
    name:         "Concrete Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-021"),
    specs:        {},
  },
  {
    id:           "mfcl-022",
    sku:          "MFCL-022",
    name:         "Pro Champion Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-022"),
    specs:        {},
  },
  {
    id:           "mfcl-023",
    sku:          "MFCL-023",
    name:         "Charcoal Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-023"),
    specs:        {},
  },
  {
    id:           "mfcl-024",
    sku:          "MFCL-024",
    name:         "Elegance Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-024"),
    specs:        {},
  },
  {
    id:           "mfcl-025",
    sku:          "MFCL-025",
    name:         "Sapphire Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-025"),
    specs:        {},
  },
  {
    id:           "mfcl-026",
    sku:          "MFCL-026",
    name:         "Neptune Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-026"),
    specs:        {},
  },
  {
    id:           "mfcl-027",
    sku:          "MFCL-027",
    name:         "Saturn Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-027"),
    specs:        {},
  },
  {
    id:           "mfcl-028",
    sku:          "MFCL-028",
    name:         "Venus Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-028"),
    specs:        {},
  },
  {
    id:           "mfcl-029",
    sku:          "MFCL-029",
    name:         "Amber Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-029"),
    specs:        {},
  },
  {
    id:           "mfcl-030",
    sku:          "MFCL-030",
    name:         "Divine Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-030"),
    specs:        {},
  },
  {
    id:           "mfcl-031",
    sku:          "MFCL-031",
    name:         "Fiesta Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-031"),
    specs:        {},
  },
  {
    id:           "mfcl-032",
    sku:          "MFCL-032",
    name:         "Pendulum Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-032"),
    specs:        {},
  },
  {
    id:           "mfcl-033",
    sku:          "MFCL-033",
    name:         "Square Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-033"),
    specs:        {},
  },
  {
    id:           "mfcl-034",
    sku:          "MFCL-034",
    name:         "Veneto Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-034"),
    specs:        {},
  },
  {
    id:           "mfcl-035",
    sku:          "MFCL-035",
    name:         "Nova Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-035"),
    specs:        {},
  },
  {
    id:           "mfcl-036",
    sku:          "MFCL-036",
    name:         "Deer Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-036"),
    specs:        {},
  },
  {
    id:           "mfcl-037",
    sku:          "MFCL-037",
    name:         "Geometric Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-037"),
    specs:        {},
  },
  {
    id:           "mfcl-038",
    sku:          "MFCL-038",
    name:         "MFCL-038",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-038"),
    specs:        {},
  },
  {
    id:           "mfcl-039",
    sku:          "MFCL-039",
    name:         "Hathi Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-039"),
    specs:        {},
  },
  {
    id:           "mfcl-040",
    sku:          "MFCL-040",
    name:         "Orbit Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-040"),
    specs:        {},
  },
  {
    id:           "mfcl-041",
    sku:          "MFCL-041",
    name:         "Quantum Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-041"),
    specs:        {},
  },
  {
    id:           "mfcl-042",
    sku:          "MFCL-042",
    name:         "Infinity Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-042"),
    specs:        {},
  },
  {
    id:           "mfcl-043",
    sku:          "MFCL-043",
    name:         "Tectile Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-043"),
    specs:        {},
  },
  {
    id:           "mfcl-044",
    sku:          "MFCL-044",
    name:         "Pendulum Pro Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-044"),
    specs:        {},
  },
  {
    id:           "mfcl-045",
    sku:          "MFCL-045",
    name:         "Impereal Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-045"),
    specs:        {},
  },
  {
    id:           "mfcl-046",
    sku:          "MFCL-046",
    name:         "Chrona Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-046"),
    specs:        {},
  },
  {
    id:           "mfcl-047",
    sku:          "MFCL-047",
    name:         "Edge Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-047"),
    specs:        {},
  },
  {
    id:           "mfcl-048",
    sku:          "MFCL-048",
    name:         "Century Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-048"),
    specs:        {},
  },
  {
    id:           "mfcl-049",
    sku:          "MFCL-049",
    name:         "Vision Wall Clock",
    category:     "clocks",
    description:  "",
    images:       clockImg("MFCL-049"),
    specs:        {},
  },
];

export const furnitureProducts: FurnitureProduct[] = [
  ...bedsProducts,
  ...barChairsProducts,
  ...coffeeTablesProducts,
  ...daybedsProducts,
  ...officeFurnitureSofaProducts,
  ...outdoorProducts,
  ...mirrorsProducts,
  ...wallArtProducts,
  ...clockProducts,
];

// --------------- Helpers ---------------

export const getProductsByCategory = (category: FurnitureCategoryId): FurnitureProduct[] =>
  furnitureProducts.filter((p) => p.category === category);

export const getProductById = (id: string): FurnitureProduct | undefined =>
  furnitureProducts.find((p) => p.id === id);

export const getCategoryMeta = (id: FurnitureCategoryId): FurnitureCategoryMeta | undefined =>
  furnitureCategories.find((c) => c.id === id);

// Type guard — validates that a slug is a known category id
export const isFurnitureCategoryId = (s: string): s is FurnitureCategoryId =>
  furnitureCategories.some((c) => c.id === s);
