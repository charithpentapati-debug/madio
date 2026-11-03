import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X, ZoomIn } from "lucide-react";
import { collectionsData } from "../data/collections";
import { usePageMeta } from "../hooks/usePageMeta";

const EXTERIOR_IDS = ["aar-coat", "cimento", "exterior-stucco"];
const INTERIOR_IDS = ["texture-bubbles", "metallics-2d", "marbre", "oyster", "matt-decor", "pearl-burst"];

export const ColorCollections: React.FC = () => {
  usePageMeta(
    "Color Library | MAP Architectural Plasters",
    "Browse MAP's full shade and color library across all decorative surface collections."
  );

  const [lightbox, setLightbox] = useState<{ name: string; tagline: string; image: string } | null>(null);

  const exterior = collectionsData.filter((c) => EXTERIOR_IDS.includes(c.id));
  const interior = collectionsData.filter((c) => INTERIOR_IDS.includes(c.id));

  const renderGrid = (items: typeof collectionsData) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((col, i) => (
        <div
          key={col.id}
          className="group relative overflow-hidden rounded-[4px] border border-[#EBE8E2] bg-white/60 backdrop-blur-sm hover:border-[#C5A059]/60 hover:shadow-lg reveal-on-scroll cursor-pointer"
          style={{
            transitionDelay: `${i * 0.06}s`,
            transition: "border-color 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
          onClick={() => setLightbox({ name: col.name, tagline: col.tagline, image: col.image })}
        >
          {/* Finish image — this IS the swatch */}
          <div className="relative h-56 overflow-hidden bg-[#F4F1EA]/40">
            <img
              src={col.image}
              alt={`${col.name} finish`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105"
              style={{ transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}
            />
            {/* Texture thumbnail overlay */}
            <div className="absolute bottom-3 right-3 w-14 h-14 overflow-hidden border-2 border-white/80 shadow-md opacity-0 group-hover:opacity-100"
              style={{ transition: "opacity 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
              <img
                src={col.textureImage}
                alt={`${col.name} texture`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Zoom hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
              style={{ transition: "opacity 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
              <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-[#121212] scale-75 group-hover:scale-100"
                style={{ transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
                <ZoomIn size={16} />
              </div>
            </div>
          </div>

          {/* Label */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-light text-[#121212] group-hover:text-[#C5A059]"
                style={{ transition: "color 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
                {col.name}
              </h3>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-sans font-light">
                {col.tagline}
              </span>
            </div>
            <Link
              to={`/quote?collection=${col.id}`}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 ml-4 px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] font-sans font-medium border border-[#C5A059]/60 text-[#C5A059] hover:bg-[#C5A059] hover:text-white"
              style={{ transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)" }}
            >
              Sample
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="texture-overlay min-h-screen pt-36 pb-24 bg-[#F4F1EA]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="max-w-3xl mb-16 reveal-on-scroll">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059] font-sans font-semibold block mb-4">
            Finish Library
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-[#121212] mb-6 leading-tight">
            The Finish <span className="italic font-normal text-[#C5A059]">Library</span>
          </h1>
          <p className="text-sm md:text-base text-[#6B6B6B] font-light leading-relaxed">
            Browse all 9 MAP finish systems. Each card shows the real applied finish — click to view full detail, or request a physical sample board.
          </p>
        </div>

        {/* Exterior section */}
        <div className="mb-16 reveal-on-scroll">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-[#C5A059]">
              Exterior Systems
            </span>
            <div className="flex-1 h-px bg-[#EBE8E2]" />
            <span className="text-[10px] text-[#6B6B6B] font-mono">{exterior.length} finishes</span>
          </div>
          {renderGrid(exterior)}
        </div>

        {/* Interior section */}
        <div className="reveal-on-scroll">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-[#C5A059]">
              Interior Systems
            </span>
            <div className="flex-1 h-px bg-[#EBE8E2]" />
            <span className="text-[10px] text-[#6B6B6B] font-mono">{interior.length} finishes</span>
          </div>
          {renderGrid(interior)}
        </div>

        {/* CTA strip */}
        <div className="mt-20 pt-12 border-t border-[#EBE8E2] flex flex-col sm:flex-row items-center justify-between gap-6 reveal-on-scroll">
          <p className="text-xs text-[#6B6B6B] font-light leading-relaxed max-w-md">
            Physical A4 sample boards, substrate specifications, and MSDS sheets are available for all finish systems. Couriered to architecture offices nationwide.
          </p>
          <Link
            to="/contact?source=map"
            className="shrink-0 inline-flex items-center space-x-2 px-8 py-3 bg-[#121212] text-white text-[10px] uppercase tracking-[0.25em] font-sans font-medium hover:bg-[#C5A059]"
            style={{ transition: "background-color 0.3s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <span>Request Sample Boards</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-[#121212]/95 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative bg-[#F4F1EA] max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 text-[#121212] hover:text-[#C5A059]"
              style={{ transition: "color 0.3s cubic-bezier(0.16,1,0.3,1)" }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <img
              src={lightbox.image}
              alt={lightbox.name}
              className="w-full max-h-[60vh] object-cover"
            />
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-light text-[#121212]">{lightbox.name}</h2>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-sans">{lightbox.tagline}</span>
              </div>
              <Link
                to="/contact?source=map"
                className="px-6 py-2.5 bg-[#C5A059] text-white text-[10px] uppercase tracking-[0.2em] font-sans font-medium hover:bg-[#121212]"
                style={{ transition: "background-color 0.3s cubic-bezier(0.16,1,0.3,1)" }}
                onClick={() => setLightbox(null)}
              >
                Request Sample
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
