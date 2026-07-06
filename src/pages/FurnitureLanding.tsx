import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { furnitureCategories, getProductsByCategory } from "../data/furniture";
import type { FurnitureCategoryMeta } from "../data/furniture";
import { usePageMeta } from "../hooks/usePageMeta";
import heroBedImg from "../assets/furniture/beds/MFB-015.png";

// First available real product photo for a category, or undefined if the
// category has no clean photography yet (renders the placeholder instead).
const categoryThumbnail = (categoryId: FurnitureCategoryMeta["id"]): string | undefined =>
  getProductsByCategory(categoryId).find((p) => p.images.length > 0)?.images[0];

const FURNITURE_ACCENT = "#B8956A";

// Subtle olive stripe texture — placeholder visual for all hero/image areas
const OliveTexture: React.FC<{ className?: string; opacity?: string }> = ({
  className = "",
  opacity = "0.06",
}) => (
  <div
    className={`absolute inset-0 ${className}`}
    style={{
      backgroundImage:
        "repeating-linear-gradient(45deg, #B8956A 0, #B8956A 1px, transparent 0, transparent 50%)",
      backgroundSize: "20px 20px",
      opacity,
    }}
  />
);

// Category card — links to /furniture/[slug]
const CategoryCard: React.FC<{ cat: FurnitureCategoryMeta; index: number }> = ({
  cat,
  index,
}) => {
  const thumbnail = cat.isPopulated ? categoryThumbnail(cat.id) : undefined;

  return (
  <Link
    to={`/furniture/${cat.id}`}
    className="group relative flex flex-col overflow-hidden border border-[#EBE8E2] bg-white hover:border-[#B8956A]/30 transition-all duration-500 reveal-on-scroll"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    {/* Real product photo when available, textured placeholder otherwise */}
    <div
      className="relative h-52 overflow-hidden shrink-0"
      style={{ backgroundColor: "#EBE8E2" }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={cat.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <OliveTexture />
      )}
      <div className="absolute inset-0 bg-[#B8956A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Coming soon badge for unpopulated categories */}
      {!cat.isPopulated && (
        <div className="absolute top-3 right-3 text-[8px] uppercase tracking-[0.25em] font-sans border border-[#243040] text-[#C4B9A8] px-2.5 py-1">
          Coming Soon
        </div>
      )}
      {cat.isPopulated && (
        <div
          className="absolute top-3 right-3 text-[8px] uppercase tracking-[0.25em] font-sans px-2.5 py-1"
          style={{ backgroundColor: FURNITURE_ACCENT, color: "#fff" }}
        >
          Available
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4">
        <div
          className="w-6 h-[2px] mb-0 transition-all duration-300 group-hover:w-10"
          style={{ backgroundColor: FURNITURE_ACCENT }}
        />
      </div>
    </div>

    {/* Card body */}
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-lg font-serif font-light text-[#16232B] mb-2 group-hover:text-[#B8956A] transition-colors duration-300">
        {cat.name}
      </h3>
      <p className="text-xs text-[#6B6B6B] font-light leading-relaxed flex-grow">
        {cat.description}
      </p>
      <div className="flex items-center space-x-1.5 mt-5 text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#B8956A]">
        <span>{cat.isPopulated ? "Explore" : "View"}</span>
        <ArrowRight
          size={11}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </div>
  </Link>
  );
};

export const FurnitureLanding: React.FC = () => {
  usePageMeta(
    "MADIO Furniture | Design-Led Furniture for Residential & Hospitality Interiors",
    "MADIO Furniture offers a curated collection of beds, seating, tables, and decorative pieces for residential and hospitality interiors across India."
  );

  return (
  <div className="bg-[#FAFAF7]">

    {/* ================================================================
        HERO — MAP-style full viewport dark overlay
        ================================================================ */}
    <section className="relative h-[95vh] flex items-center justify-center bg-[#1A1A1A] overflow-hidden">
      {/* Background Image with Dark/Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBedImg}
          alt="MADIO Furniture — Beds collection"
          className="w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-[#1A1A1A]/35" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center text-white flex flex-col items-center">
        <div className="flex items-center space-x-2 border border-[#B8956A]/60 px-4 py-1.5 mb-8 animate-fade-in">
          <Sparkles size={12} className="text-[#B8956A]" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#EBE8E2]">
            Furniture Brand
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-light tracking-wide leading-[1.1] mb-6 animate-fade-in-up">
          Design-led <br />
          <span className="italic font-normal text-[#B8956A]">furniture.</span>
        </h1>

        <p className="text-sm md:text-lg tracking-wider font-light text-[#F5F0EB]/95 max-w-2xl mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          MADIO Furniture offers a curated collection of beds, seating, tables, and decorative pieces for residential and hospitality interiors across India.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <a
            href="#categories"
            className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium bg-[#B8956A] text-white hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 shadow-md text-center"
          >
            Explore Collections
          </a>
          <Link
            to="/contact?source=furniture"
            className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-white text-white hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 text-center"
          >
            Request a Quote
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/60 animate-bounce">
        <span className="text-[9px] uppercase tracking-[0.25em] mb-2 font-sans font-light">Scroll Down</span>
        <ChevronDown size={14} />
      </div>
    </section>

    {/* ================================================================
        CATEGORY GRID
        ================================================================ */}
    <section id="categories" className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <div className="mb-12">
        <span
          className="text-[10px] tracking-[0.25em] uppercase font-sans font-medium block mb-4 reveal-on-scroll"
          style={{ color: FURNITURE_ACCENT }}
        >
          Collections
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-light text-[#16232B] leading-snug reveal-on-scroll">
          Explore the collection.
        </h2>
      </div>

      {/* 3-column grid on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {furnitureCategories
          .filter((cat) => cat.id !== "bar-chairs")
          .map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
      </div>
    </section>

    {/* ================================================================
        BRAND STATEMENT STRIP
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] bg-[#C4B9A8] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <p className="text-2xl md:text-3xl font-serif font-light text-[#16232B] leading-snug max-w-lg reveal-on-scroll">
          Crafted for architects.<br className="hidden md:block" /> Specified for life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact?source=furniture"
            className="inline-flex items-center space-x-2 text-white px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:opacity-90 transition-opacity duration-300 reveal-on-scroll"
            style={{ backgroundColor: FURNITURE_ACCENT }}
          >
            <span>Enquire</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 border border-[#16232B] text-[#16232B] px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:border-[#B8956A] hover:text-[#B8956A] transition-all duration-300 reveal-on-scroll"
          >
            <span>← Back to MADIO</span>
          </Link>
        </div>
      </div>
    </section>

  </div>
  );
};
