import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { furnitureCategories } from "../data/furniture";
import type { FurnitureCategoryMeta } from "../data/furniture";

const FURNITURE_ACCENT = "#3D4A2E";

// Subtle olive stripe texture — placeholder visual for all hero/image areas
const OliveTexture: React.FC<{ className?: string; opacity?: string }> = ({
  className = "",
  opacity = "0.06",
}) => (
  <div
    className={`absolute inset-0 ${className}`}
    style={{
      backgroundImage:
        "repeating-linear-gradient(45deg, #3D4A2E 0, #3D4A2E 1px, transparent 0, transparent 50%)",
      backgroundSize: "20px 20px",
      opacity,
    }}
  />
);

// Category card — links to /furniture/[slug]
const CategoryCard: React.FC<{ cat: FurnitureCategoryMeta; index: number }> = ({
  cat,
  index,
}) => (
  <Link
    to={`/furniture/${cat.id}`}
    className="group relative flex flex-col overflow-hidden border border-[#EBE8E2] bg-white hover:border-[#3D4A2E]/30 transition-all duration-500 reveal-on-scroll"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    {/* Image placeholder */}
    {/* TODO: client to provide licensed furniture photography for each category */}
    <div
      className="relative h-52 overflow-hidden shrink-0"
      style={{ backgroundColor: "#16232B" }}
    >
      <OliveTexture />
      <div className="absolute inset-0 bg-[#3D4A2E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Coming soon badge for unpopulated categories */}
      {!cat.isPopulated && (
        <div className="absolute top-3 right-3 text-[8px] uppercase tracking-[0.25em] font-sans border border-[#243040] text-[#8FA3B1] px-2.5 py-1">
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
      <h3 className="text-lg font-serif font-light text-[#16232B] mb-2 group-hover:text-[#3D4A2E] transition-colors duration-300">
        {cat.name}
      </h3>
      <p className="text-xs text-[#6B6B6B] font-light leading-relaxed flex-grow">
        {cat.description}
      </p>
      <div className="flex items-center space-x-1.5 mt-5 text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#3D4A2E]">
        <span>{cat.isPopulated ? "Explore" : "View"}</span>
        <ArrowRight
          size={11}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </div>
  </Link>
);

export const FurnitureLanding: React.FC = () => (
  <div className="bg-[#FAFAF7]">

    {/* ================================================================
        HERO — full viewport, dark placeholder
        ================================================================ */}
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Dark navy placeholder — TODO: client to provide hero furniture photography */}
      <div className="absolute inset-0 bg-[#16232B]" />
      <OliveTexture opacity="0.04" />
      {/* Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#16232B]/95 via-[#16232B]/30 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-6"
          style={{ color: FURNITURE_ACCENT }}
        >
          {/* TODO: client to provide licensed hero photography */}
          Photography coming soon
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white leading-[1.05] mb-8 max-w-3xl">
          Design-led <span className="italic font-normal">furniture</span>.
        </h1>
        <p className="text-sm md:text-base text-[#8FA3B1] font-light leading-relaxed max-w-lg mb-12">
          MADIO Furniture offers a curated collection of beds, seating, tables, and decorative pieces for residential and hospitality interiors across India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#categories"
            className="inline-flex items-center justify-center space-x-2 text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:opacity-90 transition-opacity duration-300"
            style={{ backgroundColor: FURNITURE_ACCENT }}
          >
            <span>Browse Categories</span>
            <ArrowRight size={13} />
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center space-x-2 border border-white/50 text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            <span>Request a Quote</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 md:right-12 z-10 flex flex-col items-center space-y-2 opacity-40">
        <span className="text-[9px] uppercase tracking-[0.3em] text-white font-sans rotate-90 origin-center mb-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-white/60" />
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
        {furnitureCategories.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>
    </section>

    {/* ================================================================
        BRAND STATEMENT STRIP
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] bg-[#16232B] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <p className="text-2xl md:text-3xl font-serif font-light text-white leading-snug max-w-lg reveal-on-scroll">
          Crafted for architects.<br className="hidden md:block" /> Specified for life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 text-white px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:opacity-90 transition-opacity duration-300 reveal-on-scroll"
            style={{ backgroundColor: FURNITURE_ACCENT }}
          >
            <span>Enquire</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 border border-[#243040] text-[#8FA3B1] px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:border-[#3D4A2E] hover:text-[#3D4A2E] transition-all duration-300 reveal-on-scroll"
          >
            <span>← Back to MADIO</span>
          </Link>
        </div>
      </div>
    </section>

  </div>
);
