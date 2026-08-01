// ============================================================
// MADIO Doors & Windows — data model and catalogue
//
// SOURCE OF TRUTH: "Madio Catalogue 2026 — Visual Masterpiece.pdf"
// (client-supplied product catalogue) + handwritten planning notes
// (client-supplied, WhatsApp photo, 2026-07-16).
//
// CORRECTIONS APPLIED — do not revert without client sign-off:
//   1. The source PDF calls Madio "a premium manufacturer." Madio does not
//      manufacture in-house — systems are custom-engineered to Madio's spec
//      by a production partner. All copy here is reworded to avoid
//      "manufacturer" / "we manufacture" / "our factory" framing, and the
//      production partner is never named.
//   2. The source PDF claims a blanket "15-Year Warranty" per system. The
//      client has only confirmed 10 years as current truth, and specifically
//      per-product (not a sitewide guarantee). Every warranty field below is
//      "10 Years", stored per-system and hasValue()-gated in the UI — never
//      hardcoded as a single banner claim — so individual systems can be
//      corrected independently once the client confirms further.
//
// Every other spec below (dimensions, track widths, wind load, glass
// thickness, load capacity, locking systems, material comparison, typologies,
// process steps, performance standards) is real, unaltered client data.
// ============================================================

// --------------- Category types ---------------
// Single source of truth lives in shared/doorsWindowsCategories.ts so that
// Vercel serverless functions (api/*.ts) can validate against the same
// category list without pulling in Vite-only code (import.meta.glob etc.) —
// same reasoning as furniture.ts / shared/furnitureCategories.ts.
export type { DoorsWindowsCategoryId as DWCategoryId, DoorsWindowsCategoryMeta as DWCategoryMeta } from "../../shared/doorsWindowsCategories";
export { doorsWindowsCategories as dwCategories, isDoorsWindowsCategoryId as isDWCategoryId } from "../../shared/doorsWindowsCategories";
import type { DoorsWindowsCategoryId as DWCategoryId, DoorsWindowsCategoryMeta } from "../../shared/doorsWindowsCategories";
import { doorsWindowsCategories as dwCategories } from "../../shared/doorsWindowsCategories";
import dwCategoryPhotosByCategory from "./dwCategoryPhotos.generated";

// --------------- Product (populated systems) types ---------------

export interface DWTrackValue {
  twoTrack?: string;
  threeTrack?: string;
}

export interface DWSystemSpec {
  // Track table — 2-track / 3-track sliding systems only.
  trackWidth?: DWTrackValue;
  // Flat frame dimensions — HL 50 Casement Door only (not a sliding/track system).
  frameWidth?: string;
  frameHeight?: string;
  interlock?: string;

  // Flat specification table — populated where the PDF documents a value.
  glassThickness?: string;
  maxHeight?: string;
  maxWidth?: string;
  lockingSystem?: string;
  netOption?: string;
  loadCapacity?: string;
  windLoad?: string;

  // Per-product, hasValue()-gated — see correction note at top of file.
  warranty?: string;
}

export interface DWSystem {
  id: DWCategoryId;
  name: string;
  tagline: string;
  description: string;
  coreFeatures: string[];
  specs: DWSystemSpec;
  bestFor: string;
  images: string[];
}

// Vite glob: resolves clean product photography once the client supplies it.
// Catalogue PDF renders are physical-book photography (visible page spread/
// binding) and are not used here — same standard applied to furniture.ts,
// where raw catalogue crops are excluded in favour of a "coming soon" state.
const _dwImgs = import.meta.glob<string>(
  "../assets/doors-windows/*.{png,jpeg,jpg,webp}",
  { eager: true, import: "default" },
);

// Client-uploaded photos for a category, via the admin upload tool — same
// Cloudinary-sourced pipeline as Furniture (see furniture.ts's
// cloudinaryImagesFor). Cloudinary photos come first so a system's primary
// display image (images[0]) is real client photography once any exists;
// the static glob below is a fallback only, kept for parity with Furniture's
// transitional pattern (in practice always empty for D&W — no filename in
// src/assets/doors-windows/ matches a category id).
function dwImg(id: string): string[] {
  const cloudinaryUrls = getCategoryPhotos(id as DWCategoryId).map((p) => p.secureUrl);
  const png = _dwImgs[`../assets/doors-windows/${id}.png`];
  const jpeg = _dwImgs[`../assets/doors-windows/${id}.jpeg`];
  const jpg = _dwImgs[`../assets/doors-windows/${id}.jpg`];
  const staticUrl = png ?? jpeg ?? jpg;
  return staticUrl ? [...cloudinaryUrls, staticUrl] : cloudinaryUrls;
}

// Every Cloudinary photo uploaded for a category, with its stable MDW-XXX
// code — used both by dwImg() above (populated systems) and by
// DoorsWindows.tsx / DoorsWindowsDetail.tsx to render a real photo grid for
// an un-populated category once it has client photos, replacing the
// "Coming Soon" state (same pattern Bar Chairs uses in Furniture).
export interface DWCategoryPhoto {
  productCode: string;
  secureUrl: string;
}

export const getCategoryPhotos = (id: DWCategoryId): DWCategoryPhoto[] =>
  dwCategoryPhotosByCategory[id] ?? [];

export const dwSystems: DWSystem[] = [
  {
    id: "hl-vista-slim",
    name: "HL Vista Slim System",
    tagline: "Premium sliding system engineered for large openings and maximum glass visibility.",
    description:
      "Introducing the HL Vista Slim Sliding System — a truly bespoke solution crafted for those who demand nothing less than perfection. This extra-premium range is engineered for an elite clientele and discerning projects worldwide, offering an unparalleled canvas of light and view. With industry-leading slim sightlines and exceptional load-bearing capacity, the Vista Slim blurs the lines between indoor comfort and the grandeur of the outdoors, transforming your space into an extraordinary sanctuary of light, openness, and sophisticated living.",
    coreFeatures: [
      "Sound Insulation — superior acoustic attenuation for undisturbed interiors",
      "Water Tightness — engineered seals prevent ingress under extreme weather",
      "Wind Load Resistance — rated to 2.8 KPA for high-exposure installations",
      "Colour Customisation — available in any RAL shade or bespoke finish",
      "Impact Resistance — tested for durability against mechanical stress",
    ],
    specs: {
      trackWidth: { twoTrack: "150 mm", threeTrack: "217 mm" },
      frameHeight: "31 mm",
      interlock: "17 mm",
      glassThickness: "12 – 32 mm",
      maxHeight: "4500 mm",
      maxWidth: "3000 mm",
      lockingSystem: "Multi-locking (Top & Bottom)",
      netOption: "Pleated Net",
      loadCapacity: "300 kg",
      windLoad: "2.8 KPA",
      warranty: "10 Years",
    },
    bestFor: "Large panoramic openings, penthouse glazing, premium residential projects.",
    images: dwImg("hl-vista-slim"),
  },
  {
    id: "hl-50-casement-door",
    name: "HL 50 Casement Door",
    tagline: "Grand openings, unyielding performance.",
    description:
      "The HL 50 Casement Door transforms standard door openings into statements of both elegance and robust functionality. Delivering effortless, wide-swinging operation that seamlessly connects your indoor and outdoor spaces, this system provides an opulent feel without compromising on an airtight seal and unyielding structural integrity. Versatile locking options ensure security meets sophistication at every threshold.",
    coreFeatures: [
      "Sound Insulation — acoustic sealing for peaceful interior environments",
      "Water Tightness — continuous weather gaskets for complete seal integrity",
      "Wind Load Resistance — structurally reinforced for exposed positions",
      "Colour Customisation — unlimited RAL palette and wood-grain finishes",
      "Impact Resistance — robust profile withstands daily operational demands",
    ],
    specs: {
      frameWidth: "50 mm",
      frameHeight: "46 mm",
      glassThickness: "5 – 38 mm",
      maxHeight: "2500 mm",
      maxWidth: "1350 mm",
      lockingSystem: "Multi-locking / Single Locking",
      warranty: "10 Years",
    },
    bestFor: "Entry doors, French doors, bedroom and bathroom openings.",
    images: dwImg("hl-50-casement-door"),
  },
  {
    id: "hl-retro-gulf-slim",
    name: "HL Retro Gulf Slim System",
    tagline: "Embrace timeless charm with modern performance.",
    description:
      "The Retro Gulf Slim System is a masterful blend of vintage aesthetics with modern functionality. Meticulously crafted with slim aluminium profiles that evoke the distinctive charm of traditional Gulf design, this system delivers a fusion of nostalgic beauty and durable, low-maintenance performance. It brings sophisticated, old-world character to your contemporary space while maintaining the engineering rigour Madio is known for.",
    coreFeatures: [
      "Sound Insulation — effective noise reduction for residential comfort",
      "Water Tightness — multi-chamber drainage for reliable weather protection",
      "Wind Load Resistance — rated to 1.8 KPA for mid-rise applications",
      "Colour Customisation — heritage tones and custom RAL finishes available",
      "Impact Resistance — reinforced profiles for long-term reliability",
    ],
    specs: {
      trackWidth: { twoTrack: "100 mm", threeTrack: "150 mm" },
      frameHeight: "41 mm",
      interlock: "25 mm",
      glassThickness: "5 – 23 mm",
      maxHeight: "3500 mm",
      maxWidth: "2000 mm",
      lockingSystem: "Single / Multi-locking",
      netOption: "Shutter Net / Pleated Net",
      loadCapacity: "120 kg",
      windLoad: "1.8 KPA",
      warranty: "10 Years",
    },
    bestFor: "Mid-size residential openings, balconies, apartment projects.",
    images: dwImg("hl-retro-gulf-slim"),
  },
  {
    id: "hl-ultra-slim",
    name: "HL Ultra Slim System",
    tagline: "Redefining transparency — the ultimate in minimalist aesthetics.",
    description:
      "The Ultra Slim System represents the ultimate in minimalist aesthetics, featuring profiles so incredibly narrow they virtually disappear, creating a stunning effect of pure, uninterrupted glass. For architects seeking the closest experience to frameless glazing, the Ultra Slim delivers an invisible barrier that elevates your property with unparalleled elegance and openness — letting architecture and landscape take centre stage.",
    coreFeatures: [
      "Sound Insulation — precision-engineered seals minimise acoustic transfer",
      "Water Tightness — concealed drainage channels ensure dry interiors",
      "Wind Load Resistance — rated to 2.0 KPA despite near-invisible profiles",
      "Colour Customisation — full RAL spectrum including anodised options",
      "Impact Resistance — high-grade alloy construction for structural confidence",
    ],
    specs: {
      trackWidth: { twoTrack: "118 mm", threeTrack: "173 mm" },
      frameHeight: "28 mm",
      interlock: "19 mm",
      glassThickness: "5 – 20 mm",
      maxHeight: "3600 mm",
      maxWidth: "2000 mm",
      lockingSystem: "Multi-locking (Top & Bottom)",
      netOption: "Pleated Net",
      loadCapacity: "250 kg",
      windLoad: "2.0 KPA",
      warranty: "10 Years",
    },
    bestFor: "Luxury villas, designer residences, minimalist architectural projects.",
    images: dwImg("hl-ultra-slim"),
  },
  {
    id: "hl-eco-gulf-slim",
    name: "HL Eco Gulf Slim System",
    tagline: "Smart design that enhances aesthetics and natural light without exceeding your budget.",
    description:
      "The Eco Gulf Slim System is a smart and affordable upgrade for any renovation or new construction project. Engineered to enhance your home's aesthetics and natural light without exceeding your budget, it delivers the coveted sleek, minimalist look that defines the Madio range. This system proves that premium fenestration need not carry a premium price — bringing quality, performance, and style to every home.",
    coreFeatures: [
      "Sound Insulation — effective noise dampening for everyday residential use",
      "Water Tightness — sealed construction prevents weather ingress",
      "Wind Load Resistance — rated to 0.8 KPA for standard residential settings",
      "Colour Customisation — wide selection of RAL colours and finishes",
      "Impact Resistance — durable construction for lasting daily performance",
    ],
    specs: {
      trackWidth: { twoTrack: "83 mm", threeTrack: "120 mm" },
      frameHeight: "41 mm",
      interlock: "19 mm",
      glassThickness: "5 – 11.5 mm",
      maxHeight: "2100 mm",
      maxWidth: "1200 mm",
      lockingSystem: "Single / Multi-locking",
      netOption: "Shutter Net / Pleated Net",
      loadCapacity: "80 kg",
      windLoad: "0.8 KPA",
      warranty: "10 Years",
    },
    bestFor: "Budget-conscious residential projects, compact apartments, internal partitions.",
    images: dwImg("hl-eco-gulf-slim"),
  },
  {
    id: "hl-elite-gulf-slim",
    name: "HL Elite Gulf Slim System",
    tagline: "Unyielding strength, uninterrupted views.",
    description:
      "For projects demanding the ultimate in performance and elegance, the Elite Gulf Slim System is designed to withstand the rigorous demands of large openings and challenging environments. Its signature slim sightlines ensure superior strength, smooth operation, and sophisticated design converge — delivering uncompromised structural performance for high-rise facades, commercial buildings, and architectural projects where wind resistance and durability are non-negotiable.",
    coreFeatures: [
      "Sound Insulation — high-performance acoustic isolation for commercial environments",
      "Water Tightness — advanced multi-seal architecture for extreme weather defence",
      "Wind Load Resistance — rated to 2.8 KPA for high-rise and coastal installations",
      "Colour Customisation — any RAL colour, anodised, or speciality finish available",
      "Impact Resistance — heavy-duty construction for demanding applications",
    ],
    specs: {
      trackWidth: { twoTrack: "108 mm", threeTrack: "161 mm" },
      frameHeight: "41 mm",
      interlock: "21 mm",
      glassThickness: "10 – 28 mm",
      maxHeight: "4000 mm",
      maxWidth: "2100 mm",
      lockingSystem: "Single / Multi-locking",
      netOption: "Shutter Net / Pleated Net",
      loadCapacity: "250 kg",
      windLoad: "2.8 KPA",
      warranty: "10 Years",
    },
    bestFor: "High-rise buildings, commercial facades, large-span commercial openings.",
    images: dwImg("hl-elite-gulf-slim"),
  },
];

// --------------- Overview page content (real, client-supplied data) ---------------

export const materialComparison = [
  { parameter: "Durability", aluminium: "40+ year lifespan; corrosion-resistant", wood: "15–25 years; prone to rot, termites", upvc: "20–30 years; yellows and warps" },
  { parameter: "Maintenance", aluminium: "Near-zero; wipe-clean finish", wood: "High; regular sanding, sealing, painting", upvc: "Low initially; non-repairable damage" },
  { parameter: "Strength-to-Weight", aluminium: "Superior; enables slim profiles and large spans", wood: "Heavy; limits maximum panel sizes", upvc: "Requires steel reinforcement for strength" },
  { parameter: "Design Flexibility", aluminium: "Powder-coated in any RAL colour, anodised finishes", wood: "Limited to paint or stain colours", upvc: "Limited colour options; cannot be repainted" },
  { parameter: "Thermal Performance", aluminium: "Thermal break technology for excellent insulation", wood: "Natural insulator but degrades with age", upvc: "Good insulation; weakens at weld joints" },
  { parameter: "Fire Resistance", aluminium: "Non-combustible; does not emit toxic fumes", wood: "Combustible; fire hazard", upvc: "Self-extinguishing but releases toxic gases" },
  { parameter: "Sustainability", aluminium: "100% recyclable; low embodied energy in recycling", wood: "Renewable but often unsustainably sourced", upvc: "Non-biodegradable; difficult to recycle" },
  { parameter: "Max Span Capability", aluminium: "Up to 4500 mm height with slim sightlines", wood: "Limited by structural weight", upvc: "Limited; requires thick profiles for rigidity" },
  { parameter: "Aesthetic Profile", aluminium: "Ultra-slim sightlines (17–25 mm interlock)", wood: "Bulky frames reduce glass area", upvc: "Wider frames compromise views" },
];

export const windowDoorTypologies = [
  { configuration: "2-Track Sliding", application: "Standard residential openings; balconies" },
  { configuration: "3-Track Sliding", application: "Wide openings; living rooms; commercial facades" },
  { configuration: "Casement (Openable)", application: "Bedrooms; bathrooms; ventilation-priority areas" },
  { configuration: "Fixed Glazing", application: "Picture windows; feature walls" },
  { configuration: "Combination Systems", application: "Mixed sliding + fixed for architectural flexibility" },
  { configuration: "Pleated Net Integration", application: "Insect protection without compromising aesthetics" },
];

export const aluminiumAdvantages = [
  { advantage: "Affordability", description: "Competitive pricing with superior long-term value; minimal maintenance costs over decades" },
  { advantage: "Durability", description: "Resistant to corrosion, warping, and UV degradation; maintains structural integrity for 40+ years" },
  { advantage: "Easy Maintenance", description: "Powder-coated finishes require only periodic wiping; no painting, staining, or sealing needed" },
  { advantage: "Design Versatility", description: "Available in unlimited RAL colours, wood-grain finishes, and anodised options to match any aesthetic" },
  { advantage: "Thermal Efficiency", description: "Advanced thermal break technology minimises heat transfer; reduces energy costs year-round" },
  { advantage: "Eco-Friendly", description: "100% recyclable with no loss of quality; significantly lower carbon footprint than alternatives" },
  { advantage: "Security", description: "Inherent strength allows for multi-point locking systems; superior resistance to forced entry" },
  { advantage: "Acoustic Insulation", description: "Combined with appropriate glazing, achieves sound reduction up to 38 dB" },
];

// Process step 2 reworded from the PDF's "Precision Manufacturing" — Madio does
// not manufacture in-house (see correction note at top of file).
export const madioProcess = [
  {
    step: 1,
    title: "Design & Consulting",
    tagline: "Your vision, our expertise.",
    bullets: [
      "Dedicated design consultation with experienced fenestration specialists",
      "Site assessment and precise measurement services",
      "System recommendation based on architectural requirements, orientation, and climate",
      "3D visualisation and technical drawings for project approval",
      "Budget planning and value engineering support",
    ],
  },
  {
    step: 2,
    title: "Precision Engineering",
    tagline: "Where engineering meets artistry.",
    bullets: [
      "State-of-the-art CNC fabrication for micron-level accuracy",
      "Premium-grade aluminium alloy (6063-T5) for optimal strength and finish",
      "Multi-stage powder coating with QUALICOAT-standard finishes",
      "Rigorous quality control at every stage of the process",
      "Custom colour matching and special finish capabilities",
    ],
  },
  {
    step: 3,
    title: "Expert Installation",
    tagline: "Precision delivered to your doorstep.",
    bullets: [
      "Specialist-trained installation teams with precision tooling",
      "Strict adherence to Madio's installation protocols",
      "Weather-sealing, alignment, and hardware calibration",
      "Site cleanliness and protection of surrounding finishes",
      "Post-installation quality audit and sign-off",
    ],
  },
  {
    step: 4,
    title: "After-Sales Support",
    tagline: "Our relationship begins at installation.",
    bullets: [
      "Warranty coverage confirmed and documented per system at handover",
      "Dedicated support helpline for service requests",
      "Annual maintenance guidance and care documentation",
      "Hardware replacement and adjustment services",
      "Lifetime technical support for all Madio products",
    ],
  },
];

// Warranty corrected from the PDF's blanket "15 Years" — see correction note
// at top of file. This table is general standards copy, not a per-product
// claim, but is kept consistent with the confirmed 10-year figure.
export const performanceStandards = [
  { standard: "Acoustic Insulation", specification: "≤ 38 dB" },
  { standard: "Wind Load Classification", specification: "Class A" },
  { standard: "Hardware Origin", specification: "Imported European Hardware" },
  { standard: "Aluminium Grade", specification: "6063-T5 Architectural Grade" },
  { standard: "Powder Coating", specification: "QUALICOAT Certified" },
  { standard: "Warranty", specification: "10 Years" },
  { standard: "Glass Compatibility", specification: "Single, DGU, and Laminated" },
];

// --------------- Helpers ---------------

export const getCategoryMeta = (id: string): DoorsWindowsCategoryMeta | undefined =>
  dwCategories.find((c) => c.id === id);

export const getSystemById = (id: string): DWSystem | undefined =>
  dwSystems.find((s) => s.id === id);

// "System Comparison At A Glance" — built directly from dwSystems so the
// table can never drift from the per-system spec data above.
export interface DWComparisonRow {
  system: string;
  maxHeight: string;
  maxWidth: string;
  loadCapacity: string;
  windLoad: string;
  interlock: string;
  frameHeight: string;
}

const DASH = "—";

export const getSystemComparison = (): DWComparisonRow[] =>
  dwSystems.map((s) => ({
    system: s.name,
    maxHeight: s.specs.maxHeight ?? DASH,
    maxWidth: s.specs.maxWidth ?? DASH,
    loadCapacity: s.specs.loadCapacity ?? DASH,
    windLoad: s.specs.windLoad ?? DASH,
    interlock: s.specs.interlock ?? DASH,
    frameHeight: s.specs.frameHeight ?? DASH,
  }));
