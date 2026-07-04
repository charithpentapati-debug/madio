// Product finish images — imported so Vite hashes them correctly in production
import cimentoHero from "../assets/products/cimento/travertine-beige.jpg";
import cimentoTexture from "../assets/products/cimento/coarse-raw.jpg";
import aarCoatHero from "../assets/products/aar-coat/1.jpeg";
import aarCoatTexture from "../assets/products/aar-coat/2.jpeg";
import exteriorStuccoHero from "../assets/products/exterior-stucco/1.jpeg";
import exteriorStuccoTexture from "../assets/products/exterior-stucco/5.jpeg";
import metallicsHero from "../assets/products/2d-metallics/1.jpg";
import metallicsTexture from "../assets/products/2d-metallics/5.jpg";
import oysterHero from "../assets/products/oyster/3.jpg";
import oysterTexture from "../assets/products/oyster/6.jpg";
import marbreHero from "../assets/products/marbre/1.jpg";
import marbreTexture from "../assets/products/marbre/4.jpg";
import textureBubblesHero from "../assets/products/texture-bubbles/1.jpg";
import textureBubblesTexture from "../assets/products/texture-bubbles/5.jpg";
import mattDecorHero from "../assets/products/matt-decor/1.jpg";
import mattDecorTexture from "../assets/products/matt-decor/5.jpg";
import pearlBurstHero from "../assets/products/pearl-burst/APB-01.jpg";
import pearlBurstTexture from "../assets/products/pearl-burst/APB-03.jpg";

export interface Shade {
  code: string;
  name: string;
  hex: string;
}

export interface Collection {
  id: string;
  name: string;
  tagline: string;
  description: string;
  shadesCount: string;
  shadePrefix: string;
  shades: Shade[];
  specs: {
    application: string;
    thickness: string;
    substrate: string;
    coverage: string;
    voc: string;
    packageSizes: string;
    recommendedTools: string;
  };
  image: string;
  textureImage: string;
  // Commerce extension point — undefined in Phase 1 (no prices shown).
  // Populate when e-commerce layer is added; Products.tsx will render it automatically.
  price?: string;
}

export const collectionsData: Collection[] = [
  {
    id: "cimento",
    name: "Cimento",
    tagline: "Microcement Finish System",
    description: "A seamless, high-performance architectural concrete surface designed for floors, walls, and wet areas. Cimento offers a monolithic, continuous finish with exceptional durability and a sleek industrial-modern aesthetic, bridging the gap between raw concrete and refined interior surfaces.",
    shadesCount: "27 shades",
    shadePrefix: "AMD-16 to AMD-52",
    shades: Array.from({ length: 27 }, (_, i) => {
      const codeNum = 16 + i;
      // Interpolate colors from warm grey to dark charcoal for concrete feel
      const lightness = 85 - (i * 2.2);
      return {
        code: `AMD-${codeNum}`,
        name: `Cimento ${getConcreteName(codeNum)}`,
        hex: hslToHex(35, 8, lightness)
      };
    }),
    specs: {
      application: "",
      thickness: "2.0 mm to 3.0 mm (multi-layered)",
      substrate: "Concrete, cement screed, existing ceramic tiles, drywall, plywood",
      coverage: "1.5 - 1.8 kg / m² for 2 coats",
      voc: "Ultra-low (Eco-friendly, water-based)",
      packageSizes: "",
      recommendedTools: "Steel trowel, microfiber roller (for sealer)"
    },
    image: cimentoHero,
    textureImage: cimentoTexture
  },
  {
    id: "aar-coat",
    name: "Aar Coat",
    tagline: "Limestone Surface Coating",
    description: "A thick, highly textured limestone-based wall cladding coating. Designed to encapsulate the raw, rustic spirit of cut mountain stone, Aar Coat delivers a deeply structured, breathable external and internal finish that ages beautifully over time.",
    shadesCount: "24 shades",
    shadePrefix: "AC-01 to AC-24",
    shades: Array.from({ length: 24 }, (_, i) => {
      const codeNum = i + 1;
      const formattedCode = codeNum < 10 ? `0${codeNum}` : `${codeNum}`;
      const light = 90 - (i * 2.1);
      return {
        code: `AC-${formattedCode}`,
        name: `Aar Coat ${getStoneName(codeNum)}`,
        hex: hslToHex(38, 8, light)
      };
    }),
    specs: {
      application: "",
      thickness: "2.0 mm to 4.0 mm",
      substrate: "Exterior cement plaster, brickwork, primed concrete blocks",
      coverage: "2.5 - 3.0 kg / m²",
      voc: "Zero VOC",
      packageSizes: "",
      recommendedTools: "Coarse texturing trowel, sponge float"
    },
    image: aarCoatHero,
    textureImage: aarCoatTexture
  },
  {
    id: "exterior-stucco",
    name: "Exterior Stucco",
    tagline: "Facade Finishes",
    description: "A high-durability exterior stucco finish engineered specifically to withstand heavy monsoons, direct solar heat, and urban elements. Blends flexible acrylic resins with fine mineral aggregates to deliver a classic, crack-resistant textured plaster facade.",
    shadesCount: "16 shades",
    shadePrefix: "ES-01 to ES-16",
    shades: Array.from({ length: 16 }, (_, i) => {
      const codeNum = i + 1;
      const formattedCode = codeNum < 10 ? `0${codeNum}` : `${codeNum}`;
      const light = 88 - (i * 2.3);
      return {
        code: `ES-${formattedCode}`,
        name: `Stucco ${getExteriorName(codeNum)}`,
        hex: hslToHex(42, 6, light)
      };
    }),
    specs: {
      application: "",
      thickness: "2.0 mm to 3.0 mm",
      substrate: "External grade sand-faced cement plaster, exterior board",
      coverage: "2.2 - 2.6 kg / m²",
      voc: "Low VOC",
      packageSizes: "",
      recommendedTools: "Plastering trowel, spray gun (optional)"
    },
    image: exteriorStuccoHero,
    textureImage: exteriorStuccoTexture
  },
  {
    id: "metallics-2d",
    name: "2D Metallics",
    tagline: "High Pearl Gloss finish",
    description: "A luxury designer paint system loaded with high-density pearlescent and fine metallic pigments. 2D Metallics create a dual-tone shimmering effect that catches light, revealing a subtle, silk-like reflection that shifts dynamically as you move through the space.",
    shadesCount: "18 finishes",
    shadePrefix: "A2D-01 to A2D-18",
    shades: Array.from({ length: 18 }, (_, i) => {
      const codeNum = i + 1;
      const formattedCode = codeNum < 10 ? `0${codeNum}` : `${codeNum}`;
      // Shimmering metallics (golds, silvers, bronzes)
      const metallicColors = [
        "#D4AF37", "#C5A059", "#D4C9B8", "#E6E8EA",
        "#C0C0C0", "#A8A9AD", "#8C7853", "#7A6348",
        "#A3704C", "#B8956A", "#C9A075", "#DDC0A0",
        "#DEC39D", "#CAA57C", "#8B7D6B", "#706357",
        "#4F473E", "#2B2925"
      ];
      return {
        code: `A2D-${formattedCode}`,
        name: `Pearl ${getMetallicName(codeNum)}`,
        hex: metallicColors[i] || "#B8956A"
      };
    }),
    specs: {
      application: "",
      thickness: "Very thin (two coats brushed or roller-applied)",
      substrate: "Perfectly smooth, acrylic-primed wall surfaces",
      coverage: "6.0 - 8.0 m² / liter",
      voc: "Low VOC",
      packageSizes: "",
      recommendedTools: "Spanish brush, effect roller, spray application"
    },
    image: metallicsHero,
    textureImage: metallicsTexture
  },
  {
    id: "oyster",
    name: "Oyster",
    tagline: "Complete Interior Texture Range",
    description: "A comprehensive interior texturing plaster composed of crushed sea shell carbonates, marble aggregates, and light-reflective quartz sands. Oyster creates a tactile, slightly shimmering shell-like finish that infuses walls with organic movement and sophisticated light play.",
    shadesCount: "50+ products",
    shadePrefix: "OS-Fine, OS-Medium, OS-Coarse",
    shades: [
      { code: "OS-F01", name: "Oyster Fine Pearl", hex: "#FAF8F5" },
      { code: "OS-F02", name: "Oyster Fine Cream", hex: "#F5F0EB" },
      { code: "OS-F03", name: "Oyster Fine Bone", hex: "#EAE6DF" },
      { code: "OS-M01", name: "Oyster Medium Sand", hex: "#DECBB7" },
      { code: "OS-M02", name: "Oyster Medium Stone", hex: "#C4B9A8" },
      { code: "OS-M03", name: "Oyster Medium Clay", hex: "#C0B2A3" },
      { code: "OS-C01", name: "Oyster Coarse Quartz", hex: "#D4C9B8" },
      { code: "OS-C02", name: "Oyster Coarse Granite", hex: "#A89F90" }
    ],
    specs: {
      application: "",
      thickness: "1.0 mm to 2.0 mm",
      substrate: "Smooth plaster, drywall boards, wood panels",
      coverage: "1.2 - 1.5 kg / m²",
      voc: "Ultra-low VOC",
      packageSizes: "",
      recommendedTools: "Medium-grain trowel, texturing brush"
    },
    image: oysterHero,
    textureImage: oysterTexture
  },
  {
    id: "marbre",
    name: "Marbre",
    tagline: "Venetian Plaster Finish",
    description: "Marbre is a lime-based paste for interior walls and ceilings that produces a highly polished, rock-hard, marble-like finish. Especially suited to columns, corbels, and curved walls, it is applied over a primer in one to four layers and buffed with a steel trowel to a smooth, glass-like sheen — a Venetian stucco that brings the look and feel of natural marble and granite within reach.",
    shadesCount: "TODO",
    shadePrefix: "AMBC",
    shades: [],
    specs: {
      application: "Applied over a primer in 1–4 layers, then buffed with a steel trowel to a polished, glass-like sheen.",
      thickness: "TODO",
      substrate: "Interior walls and ceilings",
      coverage: "TODO",
      voc: "TODO",
      packageSizes: "1kg, 5kg, and 20kg buckets (paste)",
      recommendedTools: ""
    },
    image: marbreHero,
    textureImage: marbreTexture
  },
  {
    id: "texture-bubbles",
    name: "Texture Bubbles",
    tagline: "Decorative Texture Finish",
    description: "Texture Bubbles is a water-based paste that creates a fun, bubbly texture that stays smooth to the touch. Its versatility allows a wide range of textures, and it pairs with other products for endless effects.",
    shadesCount: "TODO",
    shadePrefix: "ATB",
    shades: [],
    specs: {
      application: "Ready to use; can be top-coated for matt, satin, or gloss finishes, and combined with other products for varied effects.",
      thickness: "TODO",
      substrate: "Interior walls",
      coverage: "TODO",
      voc: "TODO",
      packageSizes: "1kg can, 5kg bucket, and 20kg bucket (paste)",
      recommendedTools: ""
    },
    image: textureBubblesHero,
    textureImage: textureBubblesTexture
  },
  {
    id: "matt-decor",
    name: "Matt Decor",
    tagline: "Matte Decorative Finish",
    description: "Matt Decor is a creamy paste used for colour-washing, bringing authentic old-world charm and a weathered, time-worn feel to any room. Water-based and suitable for interior and exterior walls, it is applied over a contrasting base colour to produce a mellow, soft texture. A Dead Matt variant is available for an absolute matt finish.",
    shadesCount: "TODO",
    shadePrefix: "ADCM",
    shades: [],
    specs: {
      application: "Applied as a top coat with a sponge or other tools over a contrasting base colour; tintable to any desired colour for a wash effect.",
      thickness: "TODO",
      substrate: "Interior and exterior walls",
      coverage: "TODO",
      voc: "TODO",
      packageSizes: "1kg can (paste)",
      recommendedTools: ""
    },
    image: mattDecorHero,
    textureImage: mattDecorTexture
  },
  {
    id: "pearl-burst",
    name: "Pearl Burst",
    tagline: "Pearlescent Surface Finish",
    description: "Pearl Burst is a fusion of texture and shine — a mica-based metallic pearl pigment paste that creates rugged textures with high pearl gloss for a lavish impression on any accent wall.",
    shadesCount: "TODO",
    shadePrefix: "APB",
    shades: [],
    specs: {
      application: "Ready to use; applied over a base coat with brush and trowel. Tintable to any colour, and also available in gold, silver, and two-tone iridescent metallic tones.",
      thickness: "TODO",
      substrate: "Interior accent walls",
      coverage: "TODO",
      voc: "TODO",
      packageSizes: "500g can and 1kg can",
      recommendedTools: ""
    },
    image: pearlBurstHero,
    textureImage: pearlBurstTexture
  }
];

// Helper functions for mock colors & names
function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function getConcreteName(code: number): string {
  const names: Record<number, string> = {
    16: "Chalk", 17: "Mist", 18: "Platinum", 19: "Pale Concrete",
    20: "Alabaster", 21: "Warm Sand", 22: "Desert Dust", 23: "Tuscan Sun",
    24: "Canyon", 25: "Pumice", 26: "Shale", 27: "Clay",
    28: "Silt", 29: "Pebble", 30: "Cobble", 31: "Smoky Quartz",
    32: "Urban Grey", 33: "Ash", 34: "Graphite", 35: "Slate",
    36: "Storm", 37: "Carbon", 38: "Basalt", 39: "Iron",
    40: "Coal", 41: "Obsidian", 42: "Midnight"
  };
  return names[code] || "Concrete Tone";
}

function getStoneName(code: number): string {
  const names = [
    "Alabaster Crag", "Pumice Ridge", "Travertine Slab", "Desert Mesa",
    "Sandstone Cliff", "Clay Slate", "Sedimentary Cream", "Tuscan Ochre",
    "Sienna Crust", "Aged Terracotta", "Mudstone", "River Pebble",
    "Shale Deposit", "Granite Escarpment", "Basalt Ledge", "Volcanic Dust",
    "Onyx Vein", "Canyon Wall", "Fossil Bluff", "Flint Stone",
    "Moraine Soil", "Silt Bed", "Gravel Path", "Coal Seam"
  ];
  return names[code - 1] || "Limestone Coat";
}

function getExteriorName(code: number): string {
  const names = [
    "Morning Fog", "Parchment Shell", "Desert Sand", "Warm Travertine",
    "Aged Stucco", "Dune Edge", "Clay Earth", "Stone Path",
    "Tuscan Villa", "Pebble Shore", "Ash Rock", "Slate Tiles",
    "Stormy Cliff", "Iron Ore", "Charcoal Facade", "Midnight Shadow"
  ];
  return names[code - 1] || "Exterior Finish";
}

function getMetallicName(code: number): string {
  const names = [
    "Antique Gold", "Shimmering Brass", "Champagne Shimmer", "Silver Foil",
    "Chrome Gloss", "Steel Shimmer", "Bronze Lustre", "Aged Copper",
    "Rose Gold", "Muted Gold", "Golden Honey", "Sand Pearl",
    "Clay Pearl", "Bronze Pearl", "Pewter Gloss", "Titanium Shimmer",
    "Gunmetal Metallic", "Black Pearl"
  ];
  return names[code - 1] || "Metallic Finish";
}
