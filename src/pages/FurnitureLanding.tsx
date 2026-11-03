import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles, ChevronDown, MapPin, Phone, Clock, MessageCircle, Navigation } from "lucide-react";
import { furnitureCategories, getProductsByCategory } from "../data/furniture";
import type { FurnitureCategoryMeta } from "../data/furniture";
import { usePageMeta } from "../hooks/usePageMeta";
import heroImg from "../assets/furniture/home-hero.jpeg";

const VERTICALS = [
  {
    key: "furniture",
    title: "Madio Furniture",
    desc: "Architectural furniture collections — solid wood, hand-finished, built for modern residences.",
    href: "/",
    current: true,
  },
  {
    key: "doors-windows",
    title: "Madio Doors and Windows",
    desc: "Engineered slim-sliding, casement and bi-fold systems for Hyderabad homes and villas.",
    href: "/doors-windows",
    current: false,
  },
  {
    key: "map",
    title: "MAP — Premium Architectural Plasters",
    desc: "Microcements, Venetian plasters and metallic finishes, formulated and applied in-house.",
    href: "/map",
    current: false,
  },
];

// First available real product photo for a category, or undefined if the
// category has no clean photography yet (renders the placeholder instead).
const categoryThumbnail = (categoryId: FurnitureCategoryMeta["id"]): string | undefined =>
  getProductsByCategory(categoryId).find((p) => p.images.length > 0)?.images[0];

const FURNITURE_ACCENT = "#C5A059";

// Subtle olive stripe texture — placeholder visual for all hero/image areas
const OliveTexture: React.FC<{ className?: string; opacity?: string }> = ({
  className = "",
  opacity = "0.06",
}) => (
  <div
    className={`absolute inset-0 ${className}`}
    style={{
      backgroundImage:
        "repeating-linear-gradient(45deg, #C5A059 0, #C5A059 1px, transparent 0, transparent 50%)",
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
    className="group relative flex flex-col overflow-hidden border border-[#EBE8E2] bg-white hover:border-[#C5A059]/30 transition-all duration-500 reveal-on-scroll"
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
      <div className="absolute inset-0 bg-[#C5A059]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Coming soon badge for unpopulated categories */}
      {!cat.isPopulated && (
        <div className="absolute top-3 right-3 text-[8px] uppercase tracking-[0.25em] font-sans border border-[#2A2A2A] text-[#C4B9A8] px-2.5 py-1">
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
      <h3 className="text-lg font-serif font-light text-[#121212] mb-2 group-hover:text-[#C5A059] transition-colors duration-300">
        {cat.name}
      </h3>
      <p className="text-xs text-[#6B6B6B] font-light leading-relaxed flex-grow">
        {cat.description}
      </p>
      <div className="flex items-center space-x-1.5 mt-5 text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#C5A059]">
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
    "Madio Furniture | Design-Led Furniture for Residential & Hospitality Interiors",
    "Madio Furniture offers a curated collection of beds, seating, tables, and decorative pieces for residential and hospitality interiors across India."
  );

  return (
  <div className="bg-[#F4F1EA]">

    {/* ================================================================
        HERO — MAP-style full viewport dark overlay
        ================================================================ */}
    <section className="relative h-[95vh] flex items-center justify-center bg-[#121212] overflow-hidden">
      {/* Background Image with Dark/Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Madio Furniture — living room showroom"
          className="w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/70 via-transparent to-[#121212]/35" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center text-white flex flex-col items-center">
        <div className="flex items-center space-x-2 border border-[#C5A059]/60 px-4 py-1.5 mb-8 animate-fade-in">
          <Sparkles size={12} className="text-[#C5A059]" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#EBE8E2]">
            Furniture Brand
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-light tracking-wide leading-[1.1] mb-6 animate-fade-in-up">
          Design-led <br />
          <span className="italic font-normal text-[#C5A059]">furniture.</span>
        </h1>

        <p className="text-sm md:text-lg tracking-wider font-light text-[#F4F1EA]/95 max-w-2xl mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Madio Furniture offers a curated collection of beds, seating, tables, and decorative pieces for residential and hospitality interiors across India.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <a
            href="#categories"
            className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium bg-[#C5A059] text-white hover:bg-white hover:text-[#121212] transition-all duration-300 shadow-md text-center"
          >
            Explore Collections
          </a>
          <Link
            to="/contact?source=furniture"
            className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-white text-white hover:bg-white hover:text-[#121212] transition-all duration-300 text-center"
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
        VERTICAL SWITCHER — Madio Furniture, Madio Doors and Windows, MAP
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] bg-white py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-serif font-light text-[#121212] mb-10 reveal-on-scroll">
          Three verticals, <span className="italic text-[#C5A059]">one Gruppo.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {VERTICALS.map((v, i) => (
            <Link
              key={v.key}
              to={v.href}
              className={`group flex flex-col justify-between border p-7 min-h-[200px] transition-all duration-300 reveal-on-scroll ${
                v.current
                  ? "border-[#C5A059] bg-[#F4F1EA]"
                  : "border-[#EBE8E2] hover:border-[#C5A059]/40"
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div>
                <h3 className="font-serif text-xl font-light text-[#121212]">{v.title}</h3>
                <p className="mt-2 text-xs text-[#6B6B6B] font-light leading-relaxed">{v.desc}</p>
              </div>
              <div className="mt-6 flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#C5A059]">
                <span>{v.current ? "You are here" : "Explore"}</span>
                {!v.current && (
                  <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                )}
              </div>
            </Link>
          ))}
        </div>
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
        <h2 className="text-3xl md:text-4xl font-serif font-light text-[#121212] leading-snug reveal-on-scroll">
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
        <p className="text-2xl md:text-3xl font-serif font-light text-[#121212] leading-snug max-w-lg reveal-on-scroll">
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
          <a
            href="#experience-center"
            className="inline-flex items-center space-x-2 border border-[#121212] text-[#121212] px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 reveal-on-scroll"
          >
            <span>Visit the Experience Center</span>
          </a>
        </div>
      </div>
    </section>

    {/* ================================================================
        EXPERIENCE CENTER — Hyderabad showroom, directions, WhatsApp
        ================================================================ */}
    <section id="experience-center" className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div className="flex flex-col justify-center">
          <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-medium block mb-4" style={{ color: FURNITURE_ACCENT }}>
            Kondapur, Hyderabad
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-[#121212] leading-snug reveal-on-scroll">
            The Madio <span className="italic text-[#C5A059]">Experience Center.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm text-[#6B6B6B] font-light leading-relaxed">
            Every finish, system and fitting across Madio Furniture, Madio Doors
            and Windows, and MAP is on display. Walk in for a private design
            consultation, or book a slot in advance.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-[#C5A059] shrink-0 mt-0.5" />
              <p className="text-sm text-[#121212] font-light leading-relaxed">
                1st Floor, Road No.1, Plot No.25, Shilpa Hills,
                <br />
                Kondapur, Hyderabad, Telangana 500084
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Clock size={18} className="text-[#C5A059] shrink-0 mt-0.5" />
              <p className="text-sm text-[#121212] font-light">Open daily · 10:00 AM – 8:00 PM</p>
            </div>
            <div className="flex items-start space-x-3">
              <Phone size={18} className="text-[#C5A059] shrink-0 mt-0.5" />
              <div className="text-sm text-[#121212] font-light">
                <p>+91 99486 01899 · +91 99486 01799</p>
                <p className="text-[#6B6B6B] mt-0.5">Landline: 040 3520 9199</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://wa.me/919948601899"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#2bab39] text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-sans font-medium hover:bg-[#249a30] transition-colors duration-300"
            >
              <MessageCircle size={14} />
              <span>Instant WhatsApp Consultation</span>
            </a>
            <a
              href="https://maps.google.com/?q=Madio+Experience+Center+Shilpa+Hills+Kondapur+Hyderabad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#121212] text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-sans font-medium hover:bg-[#C5A059] transition-colors duration-300"
            >
              <Navigation size={14} />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

        <div className="relative min-h-[320px] bg-[#C4B9A8] overflow-hidden">
          <OliveTexture opacity="0.12" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2 text-white text-center px-6">
              <MapPin size={36} className="text-[#C5A059]" strokeWidth={1.5} />
              <span className="bg-white/90 text-[#121212] px-3 py-1 text-xs font-sans font-medium">
                Madio Experience Center · Kondapur
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
  );
};
