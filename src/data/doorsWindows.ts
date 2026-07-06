// All specs derived exclusively from Madio Portfolio 2026 Architect.pdf.
// Fields without documented values are left undefined and hidden by hasValue() in the UI.

export interface DWSpec {
  profileDepth?: string;
  trackConfig?: string;
  hardware?: string;
  finish?: string;
  acoustic?: string;
  thermal?: string;
  windLoad?: string;
  locking?: string;
  glazing?: string;
  application?: string;
  automation?: string;
  warranty?: string;
}

export interface DWVariant {
  code: string;      // e.g. "H-27"
  note?: string;
}

export interface DWProduct {
  id: string;         // URL slug
  name: string;
  categoryLabel: string;
  tagline: string;
  description: string;
  longDescription: string;
  variants?: DWVariant[];
  specs: DWSpec;
  images: string[];   // Clean product images from PDF
  // Commerce extension point — undefined in Phase 1 (no prices shown).
  // Populate when e-commerce is enabled; DoorsWindowsDetail will render it automatically.
  price?: string;
}

const _dwImgs = import.meta.glob<string>(
  '../assets/doors-windows/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

function dwImg(sku: string): string[] {
  const png = _dwImgs[`../assets/doors-windows/${sku}.png`];
  if (png) return [png];
  const jpeg = _dwImgs[`../assets/doors-windows/${sku}.jpeg`];
  if (jpeg) return [jpeg];
  const jpg = _dwImgs[`../assets/doors-windows/${sku}.jpg`];
  if (jpg) return [jpg];
  return [];
}

export const dwProductsData: DWProduct[] = [
  {
    id: "slim-sliding",
    name: "Slim Sliding Systems",
    categoryLabel: "Flagship System",
    tagline: "Ultra-slim profiles. Maximum openness.",
    description:
      "Ultra-slim aluminum sliding systems with 25–40 mm profile depth. Multi-track configurations with imported European hardware, custom RAL finishes, and engineered acoustic and wind-load performance.",
    longDescription:
      "MADIO Slim Sliding Systems are engineered for maximum glass area and unobstructed panoramic views. Available in a range of profiles from H-27 through to the Vision Invisible series, each system features multi-chamber EPDM seals for acoustic control, enhanced thermal break construction, and powder-coated or anodized aluminium in any RAL shade. 2-track and 3-track multi-panel configurations are available for residential and commercial applications.",
    images: dwImg("slim-sliding"),
    variants: [
      { code: "H-27" },
      { code: "H-29" },
      { code: "Mono Slim" },
      { code: "Nero Slim" },
      { code: "Vision Invisible" },
    ],
    specs: {
      profileDepth:  "25–40 mm ultra-slim sightlines",
      trackConfig:   "2-track & 3-track multi-panel configurations",
      hardware:      "Premium imported European hardware",
      finish:        "Powder-coated & anodized profiles — custom RAL available",
      acoustic:      "Multi-chamber EPDM seals — ≤ 38 dB sound attenuation",
      thermal:       "Thermal break construction — compatible with Low-E glazing",
      windLoad:      "Class A structural wind-load resistance",
      warranty:      "10-year product warranty",
    },
  },
  {
    id: "casement-50mm",
    name: "Casement 50mm",
    categoryLabel: "Casement Series",
    tagline: "Precision frames. Acoustic excellence.",
    description:
      "50 mm profile casement systems delivering exceptional acoustic control, thermal efficiency, and minimalist sightlines with robust multi-point locking hardware.",
    longDescription:
      "The MADIO Casement 50mm series offers precision-engineered frames for residential and commercial openings. The 50 mm profile balances slim sightlines with the structural integrity required for multi-point locking hardware. The result is a casement window that performs to commercial-grade acoustic and thermal standards while maintaining a refined architectural profile.",
    images: dwImg("casement-50mm"),
    specs: {
      profileDepth: "50 mm profile series",
      acoustic:     "Exceptional acoustic control",
      thermal:      "High thermal efficiency",
      locking:      "Robust multi-point locking hardware",
      finish:       "Powder-coated & anodized profiles — custom RAL available",
    },
  },
  {
    id: "glass-partitions",
    name: "Glass Partitions",
    categoryLabel: "Commercial System",
    tagline: "Seamless sightlines. Structural precision.",
    description:
      "Floor-to-ceiling partition systems for commercial interiors. Single and double glazed options with anodized aluminium mullions for open-plan environments.",
    longDescription:
      "MADIO Glass Partition systems deliver seamless floor-to-ceiling glazed enclosures for offices, executive suites, meeting rooms, and hospitality environments. Single and double glazed units are available, with anodized aluminium mullions sized for structural rigidity across large-format spans. Sightlines are minimised to maintain the open-plan quality of the interior.",
    images: dwImg("glass-partitions"),
    specs: {
      glazing:      "Single & double glazed options",
      application:  "Floor-to-ceiling commercial interiors",
      finish:       "Anodized aluminium mullions — custom RAL available",
    },
  },
  {
    id: "motorised-blinds",
    name: "Motorised Integrated Blinds",
    categoryLabel: "Smart System",
    tagline: "In-glass automation. Architecturally invisible.",
    description:
      "Factory-integrated motorised blinds sealed within the double-glazed unit — dust-free, maintenance-free, and smart-home compatible.",
    longDescription:
      "MADIO Motorised Integrated Blinds are factory-sealed within the glazed unit itself, eliminating the need for external blinds or curtains. The result is a completely clean architectural sightline with no visible hardware. The system is dust-free and maintenance-free by design. Smart-home integration enables automated control via app or building management systems.",
    images: [],
    specs: {
      automation:   "Factory-integrated in-glass unit — smart-home compatible",
      application:  "Sealed within double-glazed unit — dust-free, maintenance-free",
    },
  },
];
