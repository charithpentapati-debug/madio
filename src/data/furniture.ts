// ============================================================
// MADIO Furniture — data model and product catalogue
//
// SOURCE OF TRUTH: client-supplied PDFs only.
// All product codes mapped to MADIO-branded SKUs.
// External supplier identifiers are stored ONLY in sku_internal
// and are NEVER referenced in any UI component.
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

  // Internal supplier reference — NEVER rendered in any UI component.
  // Kept here purely for cross-referencing against the client's catalogue PDFs.
  /** @internal */
  sku_internal?: string;
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
    isPopulated: true,
  },
  {
    id:          "coffee-cafe-tables",
    name:        "Coffee & Cafe Tables",
    description: "Low coffee tables and cafe-height tables for living and hospitality spaces.",
    isPopulated: true,
  },
  {
    id:          "daybeds",
    name:        "Daybeds",
    description: "Solid wood and cane daybeds with plush upholstery.",
    isPopulated: false,
  },
  {
    id:          "office-furniture-sofa",
    name:        "Office Furniture & Sofa",
    description: "Premium executive office furniture and sofa collections.",
    isPopulated: false,
  },
  {
    id:          "outdoor",
    name:        "Outdoor",
    description: "Weather-resistant furniture for terraces, pools, and garden spaces.",
    isPopulated: false,
  },
  {
    id:          "mirrors",
    name:        "Mirrors",
    description: "Decorative and full-length mirrors in a range of frame finishes.",
    isPopulated: false,
  },
  {
    id:          "wall-art",
    name:        "Wall Art",
    description: "Curated wall art pieces for residential and hospitality interiors.",
    isPopulated: false,
  },
  {
    id:          "clocks",
    name:        "Clocks",
    description: "Statement wall clocks in solid wood and metal finishes.",
    isPopulated: false,
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
      sku_internal: `FRN-${1000 + i + 1}`,
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
      sku_internal: `FRN-${2000 + i + 1}`,
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
    sku_internal: "FRN-HC-001"
  },
  {
    id:           "mfbc-002",
    sku:          "MFBC-002",
    name:         "TRAVIS CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-002"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 19\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-002"
  },
  {
    id:           "mfbc-003",
    sku:          "MFBC-003",
    name:         "VERANO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-003"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 19\" (W) x 19\" (D) x 44\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-003"
  },
  {
    id:           "mfbc-004",
    sku:          "MFBC-004",
    name:         "ROSELLE CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-004"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 21\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-004"
  },
  {
    id:           "mfbc-005",
    sku:          "MFBC-005",
    name:         "LUMERA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-005"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18\" (W) x 19\" (D) x 41\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-005"
  },
  {
    id:           "mfbc-006",
    sku:          "MFBC-006",
    name:         "ORLINA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-006"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 21\" (D) x 44\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-006"
  },
  {
    id:           "mfbc-007",
    sku:          "MFBC-007",
    name:         "MONTERA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-007"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 16\" (W) x 17\" (D) x 40\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-007"
  },
  {
    id:           "mfbc-008",
    sku:          "MFBC-008",
    name:         "OREVO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-008"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 17\" (W) x 18\" (D) x 42\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-008"
  },
  {
    id:           "mfbc-009",
    sku:          "MFBC-009",
    name:         "ELANZO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-009"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18.5\" (W) x 19\" (D) x 42\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-009"
  },
  {
    id:           "mfbc-010",
    sku:          "MFBC-010",
    name:         "ELOWEN CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-010"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18\" (W) x 19\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-010"
  },
  {
    id:           "mfbc-011",
    sku:          "MFBC-011",
    name:         "VINTARA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-011"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 17\" (W) x 19\" (D) x 43\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-011"
  },
  {
    id:           "mfbc-012",
    sku:          "MFBC-012",
    name:         "AURIC CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-012"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 17.5\" (W) x 22\" (D) x 44\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-013"
  },
  {
    id:           "mfbc-013",
    sku:          "MFBC-013",
    name:         "ELIO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-013"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 16.5\" (W) x 19\" (D) x 43\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-014"
  },
  {
    id:           "mfbc-014",
    sku:          "MFBC-014",
    name:         "VELUTO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-014"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18\" (W) x 21\" (D) x 42\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-015"
  },
  {
    id:           "mfbc-015",
    sku:          "MFBC-015",
    name:         "AMBERLY CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-015"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 17.5\" (W) x 19\" (D) x 43\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-016"
  },
  {
    id:           "mfbc-016",
    sku:          "MFBC-016",
    name:         "LUNERO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-016"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 18\" (W) x 19\" (D) x 42\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-017"
  },
  {
    id:           "mfbc-017",
    sku:          "MFBC-017",
    name:         "MONVERO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-017"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 21\" (W) x 21\" (D) x 41\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-W-018"
  },
  {
    id:           "mfbc-018",
    sku:          "MFBC-018",
    name:         "ORVESSA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-018"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 22.6\" (W) x 20.6\" (D) x 41\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-020"
  },
  {
    id:           "mfbc-019",
    sku:          "MFBC-019",
    name:         "VALEN CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-019"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 22\" (D) x 36.6 (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-021"
  },
  {
    id:           "mfbc-020",
    sku:          "MFBC-020",
    name:         "ORÉL CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-020"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 19.6\" (W) x 19.6\" (D) x 44.6\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-022"
  },
  {
    id:           "mfbc-021",
    sku:          "MFBC-021",
    name:         "CALIX CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-021"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 21\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-W-023"
  },
  {
    id:           "mfbc-022",
    sku:          "MFBC-022",
    name:         "DORÉN CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-022"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 20\" (W) x 21\" (D) x 45\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-024"
  },
  {
    id:           "mfbc-023",
    sku:          "MFBC-023",
    name:         "CAVARO CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-023"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 19\" (W) x 22.6\" (D) x 40\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-025"
  },
  {
    id:           "mfbc-024",
    sku:          "MFBC-024",
    name:         "ORVEA CHAIR",
    category:     "bar-chairs",
    description:  "",
    images:       barChairImg("MFBC-024"),
    specs:        { material: "Acacia Wood Structure, MS Footrest and caps, Upholstered Seat", dimensions: "Overall: 19.6\" (W) x 22\" (D) x 40\" (H)", seatingHeight: "30\"", customizations: "Wood Type & Stain, Upholstery Material & Colors, Metal Type & Shade" },
    sku_internal: "FRN-HC-026"
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
    sku_internal: "FRN-001"
  },
  {
    id:           "mfct-002",
    sku:          "MFCT-002",
    name:         "MFCT-002",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-002"),
    specs:        { material: "Engineered wood", dimensions: "W: 61\" D: 84\" H: 85\"", customizations: "Custom diﬀerent woods: " },
    sku_internal: "FRN-002"
  },
  {
    id:           "mfct-003",
    sku:          "MFCT-003",
    name:         "MFCT-003",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-003"),
    specs:        { material: "Acacia wood", dimensions: "W: 22\" D: 42\" H: 14\"", customizations: "Custom diﬀerent woods: " },
    sku_internal: "FRN-003"
  },
  {
    id:           "mfct-004",
    sku:          "MFCT-004",
    name:         "MFCT-004",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-004"),
    specs:        { material: "Acacia wood", dimensions: "W: 50\" D: 25\" H: 16\"", customizations: "Custom diﬀerent woods: " },
    sku_internal: "FRN-004"
  },
  {
    id:           "mfct-005",
    sku:          "MFCT-005",
    name:         "MFCT-005",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-005"),
    specs:        { material: "Metal base legs & marbel top", dimensions: "W: 36\" H: 16\"" },
    sku_internal: "FRN-005"
  },
  {
    id:           "mfct-006",
    sku:          "MFCT-006",
    name:         "MFCT-006",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-006"),
    specs:        { material: "Metal base legs & marbel top", dimensions: "W: 36\" D: “ H: 16\"", customizations: "Custom diﬀerent woods: " },
    sku_internal: "FRN-006"
  },
  {
    id:           "mfct-007",
    sku:          "MFCT-007",
    name:         "MFCT-007",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-007"),
    specs:        { material: "Acacia wood", dimensions: "W: 48\" D:24 “ H: 16\"", customizations: "Custom diﬀerent woods: " },
    sku_internal: "FRN-007"
  },
  {
    id:           "mfct-008",
    sku:          "MFCT-008",
    name:         "MFCT-008",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-008"),
    specs:        { material: "Acacia wood", dimensions: "W: 36\" H: 16\"", customizations: "Custom diﬀerent woods: " },
    sku_internal: "FRN-008"
  },
  {
    id:           "mfct-009",
    sku:          "MFCT-009",
    name:         "MFCT-009",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-009"),
    specs:        { material: "Metal", dimensions: "W: 54\" D:24 “ H: 16\"" },
    sku_internal: "FRN-009"
  },
  {
    id:           "mfct-010",
    sku:          "MFCT-010",
    name:         "MFCT-010",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-010"),
    specs:        { material: "Marbel", dimensions: "W: 54\" D:24 “ H: 16\"" },
    sku_internal: "FRN-010"
  },
  {
    id:           "mfct-011",
    sku:          "MFCT-011",
    name:         "MFCT-011",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-011"),
    specs:        { material: "Brass", dimensions: "W: 36“ H: 16\"" },
    sku_internal: "FRN-011"
  },
  {
    id:           "mfct-012",
    sku:          "MFCT-012",
    name:         "MFCT-012",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-012"),
    specs:        { material: "Brass", dimensions: "W: 54\" D:54 “ H: 56\"" },
    sku_internal: "FRN-012"
  },
  {
    id:           "mfct-013",
    sku:          "MFCT-013",
    name:         "MFCT-013",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-013"),
    specs:        { material: "Brass", dimensions: "W: 42“ H: 56\"" },
    sku_internal: "FRN-013"
  },
  {
    id:           "mfct-014",
    sku:          "MFCT-014",
    name:         "MFCT-014",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-014"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 36\" H: 16\"" },
    sku_internal: "FRN-014"
  },
  {
    id:           "mfct-015",
    sku:          "MFCT-015",
    name:         "MFCT-015",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-015"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 20\"" },
    sku_internal: "FRN-015"
  },
  {
    id:           "mfct-016",
    sku:          "MFCT-016",
    name:         "MFCT-016",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-016"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" D:48 “ H: 16\"" },
    sku_internal: "FRN-016"
  },
  {
    id:           "mfct-017",
    sku:          "MFCT-017",
    name:         "MFCT-017",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-017"),
    specs:        { material: "Acacia wood and cane work", dimensions: "W: 26\" H: 18\"" },
    sku_internal: "FRN-017"
  },
  {
    id:           "mfct-018",
    sku:          "MFCT-018",
    name:         "MFCT-018",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-018"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 42\" H: 16\"" },
    sku_internal: "FRN-018"
  },
  {
    id:           "mfct-019",
    sku:          "MFCT-019",
    name:         "MFCT-019",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-019"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 54\" D:54 “ H: 16\"" },
    sku_internal: "FRN-019"
  },
  {
    id:           "mfct-020",
    sku:          "MFCT-020",
    name:         "MFCT-020",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-020"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 52\" D:22 “ H: 16\"" },
    sku_internal: "FRN-020"
  },
  {
    id:           "mfct-021",
    sku:          "MFCT-021",
    name:         "MFCT-021",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-021"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 36\" H: 16\"" },
    sku_internal: "FRN-021"
  },
  {
    id:           "mfct-022",
    sku:          "MFCT-022",
    name:         "MFCT-022",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-022"),
    specs:        { material: "Acacia wood", dimensions: "W: 43.3\" D: 22.4\" H: 15.5\"", customizations: "Custom diﬀerent woods: " },
    sku_internal: "FRN-022"
  },
  {
    id:           "mfct-023",
    sku:          "MFCT-023",
    name:         "MFCT-023",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-023"),
    specs:        { material: "Metal base", dimensions: "W: 43.3\" D: 22\" H: 17.7\"", customizations: "Custom diﬀerent Marble options: " },
    sku_internal: "FRN-023"
  },
  {
    id:           "mfct-024",
    sku:          "MFCT-024",
    name:         "MFCT-024",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-024"),
    specs:        { material: "Metal base", dimensions: "W: 46\" D: 46\" H: 30\"", customizations: "Custom diﬀerent Wooden top &" },
    sku_internal: "FRN-024"
  },
  {
    id:           "mfct-025",
    sku:          "MFCT-025",
    name:         "MFCT-025",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-025"),
    specs:        { material: "Metal base", dimensions: "W: 46\" D: 46\" H: 30\"", customizations: "Custom diﬀerent Wooden top &" },
    sku_internal: "FRN-025"
  },
  {
    id:           "mfct-026",
    sku:          "MFCT-026",
    name:         "MFCT-026",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-026"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 36\" H: 30\"" },
    sku_internal: "FRN-026"
  },
  {
    id:           "mfct-027",
    sku:          "MFCT-027",
    name:         "MFCT-027",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-027"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 30\"" },
    sku_internal: "FRN-027"
  },
  {
    id:           "mfct-028",
    sku:          "MFCT-028",
    name:         "MFCT-028",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-028"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 30\"" },
    sku_internal: "FRN-028"
  },
  {
    id:           "mfct-029",
    sku:          "MFCT-029",
    name:         "MFCT-029",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-029"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 30\"" },
    sku_internal: "FRN-029"
  },
  {
    id:           "mfct-030",
    sku:          "MFCT-030",
    name:         "MFCT-030",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-030"),
    specs:        { material: "Metal base & marble top", dimensions: "W: 48\" H: 30\"" },
    sku_internal: "FRN-030"
  },
  {
    id:           "mfct-031",
    sku:          "MFCT-031",
    name:         "MFCT-031",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-031"),
    specs:        { material: "Solidwood", dimensions: "W: 48\" H: 30\"" },
    sku_internal: "FRN-031"
  },
  {
    id:           "mfct-032",
    sku:          "MFCT-032",
    name:         "MFCT-032",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-032"),
    specs:        { material: "Solidwood top & heavy metal base", dimensions: "W: 58\" D:36\" H: 30\"" },
    sku_internal: "FRN-032"
  },
  {
    id:           "mfct-033",
    sku:          "MFCT-033",
    name:         "MFCT-033",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-033"),
    specs:        { material: "Solidwood", dimensions: "W: 26\" D:20\" H: 42\"" },
    sku_internal: "FRN-033"
  },
  {
    id:           "mfct-034",
    sku:          "MFCT-034",
    name:         "MFCT-034",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-034"),
    specs:        { material: "Solidwood  top & metal base", dimensions: "W: 60\" D:60\" H: 74\"" },
    sku_internal: "FRN-034"
  },
  {
    id:           "mfct-035",
    sku:          "MFCT-035",
    name:         "MFCT-035",
    category:     "coffee-cafe-tables",
    description:  "",
    images:       coffeeTableImg("MFCT-035"),
    specs:        { material: "Marble  top & metal base", dimensions: "W: 60\" D:60\" H: 74\"" },
    sku_internal: "FRN-035"
  },
];

export const furnitureProducts: FurnitureProduct[] = [
  ...bedsProducts,
  ...barChairsProducts,
  ...coffeeTablesProducts,
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
