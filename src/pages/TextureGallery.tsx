import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, ZoomIn, Layers } from "lucide-react";
import { usePageMeta } from "../hooks/usePageMeta";
import g1Img from "../assets/products/marbre/1.jpg";
import g2Img from "../assets/products/cimento/3.jpg";
import g3Img from "../assets/products/2d-metallics/1.jpg";
import g4Img from "../assets/products/oyster/3.jpg";
import g5Img from "../assets/products/aar-coat/1.jpeg";
import g6Img from "../assets/products/texture-bubbles/1.jpg";
import g7Img from "../assets/products/matt-decor/1.jpg";
import g8Img from "../assets/products/pearl-burst/APB-01.jpg";
import g9Img from "../assets/products/exterior-stucco/1.jpeg";

interface GalleryItem {
  id: string;
  title: string;
  category: "venetian" | "microcement" | "metallics" | "concrete" | "custom";
  collectionName: string;
  image: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Minimalist Master Suite",
    category: "venetian",
    collectionName: "Marbre",
    image: g1Img,
    description: "Satin-sheen polished slaked-lime Marbre wall that acts as a quiet, light-absorbing canvas for the master bedroom."
  },
  {
    id: "g2",
    title: "Monolithic Microcement Lounge",
    category: "microcement",
    collectionName: "Cimento",
    image: g2Img,
    description: "Joint-free, sand-toned Cimento microcement flooring, delivering a continuous floor plane extending out to the patio."
  },
  {
    id: "g3",
    title: "Lustrous Foyer Accents",
    category: "metallics",
    collectionName: "2D Metallics",
    image: g3Img,
    description: "Gold pearl 2D Metallics finish applied in fine cross-hatch striae that responds to changing daylight and warm spotlights."
  },
  {
    id: "g4",
    title: "Wabi-Sabi Kitchen Stucco",
    category: "venetian",
    collectionName: "Oyster",
    image: g4Img,
    description: "A custom fine-sand Oyster plaster giving a soft, cloud-toned visual texture with an organic, chalky matte overlay."
  },
  {
    id: "g5",
    title: "Limestone Facade Cladding",
    category: "custom",
    collectionName: "Aar Coat",
    image: g5Img,
    description: "Weather-resistant, highly breathable exterior Aar Coat limestone plaster, evoking the monumentality of cut rock cliffs."
  },
  {
    id: "g6",
    title: "Urban Industrial Office Walls",
    category: "concrete",
    collectionName: "Texture Bubbles",
    image: g6Img,
    description: "Water-based textured finish with a soft, bubbled surface, used here across office feature walls for tactile depth."
  },
  {
    id: "g7",
    title: "Mineral Wash Library",
    category: "venetian",
    collectionName: "Matt Decor",
    image: g7Img,
    description: "Soft colour-washed Matt Decor finish on brick, giving a velvety, breathable patina."
  },
  {
    id: "g8",
    title: "Eco-Luxe Spa Bathroom",
    category: "microcement",
    collectionName: "Pearl Burst",
    image: g8Img,
    description: "Mica-based Pearl Burst finish with a rugged, high-gloss pearl texture across the walls and bath surround."
  },
  {
    id: "g9",
    title: "Modernist Villa Facade",
    category: "custom",
    collectionName: "Exterior Stucco",
    image: g9Img,
    description: "Flexible, aggregate-based exterior stucco facade system in custom warm off-white, protecting against heavy monsoon cycles."
  }
];

export const TextureGallery: React.FC = () => {
  usePageMeta(
    "Texture Gallery | MAP Architectural Finishes",
    "Browse MAP's gallery of Venetian plasters, microcement, and decorative surface textures in real architectural settings."
  );

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filters = [
    { value: "all", label: "All Works" },
    { value: "venetian", label: "Venetian Plaster" },
    { value: "microcement", label: "Microcement" },
    { value: "metallics", label: "2D Metallics" },
    { value: "concrete", label: "Concrete Finish" },
    { value: "custom", label: "Limestone & Facades" },
  ];

  const filteredItems = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <div className="texture-overlay min-h-screen pt-36 pb-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16 reveal-on-scroll">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-sans font-semibold block mb-4">
            Aesthetic Portfolio
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] mb-6 leading-tight">
            The Texture <span className="italic font-normal text-[#B8956A]">Gallery</span>
          </h1>
          <p className="text-sm md:text-base text-[#6B6B6B] font-light leading-relaxed">
            A visual curation of architectural projects throughout India utilizing MAP surface technologies. Browse slaked-lime Venetian finishes, monolithic floor systems, and mineral facade plasters in situ.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-[#EBE8E2] pb-6 mb-12 reveal-on-scroll">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`text-xs uppercase tracking-[0.2em] font-sans transition-all duration-300 pb-2 border-b relative -bottom-[2px] cursor-pointer ${
                activeFilter === filter.value
                  ? "text-[#B8956A] border-[#B8956A] font-medium"
                  : "text-[#6B6B6B] border-transparent hover:text-[#1A1A1A]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-[#F5F0EB]/40 border border-[#EBE8E2] group cursor-pointer overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-300 reveal-on-scroll"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              {/* Photo */}
              <div className="h-[380px] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                
                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-[#1A1A1A]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-4 bg-white/90 backdrop-blur-sm rounded-full text-[#1A1A1A] scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn size={20} />
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="p-6">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#B8956A] font-sans font-semibold">
                  {item.collectionName}
                </span>
                <h3 className="text-lg font-serif font-light text-[#1A1A1A] mt-1 group-hover:text-[#B8956A] transition-colors duration-300">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-[#1A1A1A]/95 flex items-center justify-center p-4 md:p-8 animate-fade-in">
            {/* Close trigger background */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedItem(null)} />

            {/* Modal Box */}
            <div className="relative z-10 bg-[#FAFAF7] w-full max-w-6xl max-h-[90vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 shadow-2xl animate-fade-in-up">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-[#1A1A1A] hover:text-[#B8956A] transition-all shadow-sm focus:outline-none"
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>

              {/* Photo Area */}
              <div className="lg:col-span-8 bg-black h-[50vh] lg:h-[80vh] flex items-center justify-center overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Metadata Area */}
              <div className="lg:col-span-4 p-8 md:p-10 flex flex-col justify-between h-full bg-[#FAFAF7]">
                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#B8956A] font-sans font-semibold block mb-2">
                      Project Highlight
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-light text-[#1A1A1A] leading-tight">
                      {selectedItem.title}
                    </h2>
                  </div>

                  <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                    {selectedItem.description}
                  </p>

                  <div className="border-t border-[#EBE8E2] pt-6 space-y-4 text-xs">
                    <div className="flex items-center space-x-3.5">
                      <Layers size={15} className="text-[#B8956A]" />
                      <div>
                        <span className="text-[10px] uppercase text-[#6B6B6B] block">Finish System</span>
                        <span className="text-[#1A1A1A] font-medium">{selectedItem.collectionName} Collection</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-[#EBE8E2] mt-12 flex flex-col sm:flex-row gap-4">
                  <Link
                    to={`/contact?source=map&collection=${selectedItem.collectionName.toLowerCase().replace(" ", "-")}`}
                    className="flex-1 bg-[#1A1A1A] text-white text-center py-3 text-[10px] uppercase tracking-[0.2em] font-sans font-medium hover:bg-[#B8956A] transition-colors"
                  >
                    Request Sample Spec
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
