import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImg        from "../assets/hero.png";
import mapCardImg     from "../assets/products/marbre/1.jpg";

export const MadioHome: React.FC = () => (
  <div className="bg-[#FAFAF7]">

    {/* ================================================================
        HERO — full viewport, dark-overlay on hero.png
        ================================================================ */}
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background image */}
      <img
        src={heroImg}
        alt=""
        role="presentation"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Navy overlay — two layers for richer depth */}
      <div className="absolute inset-0 bg-[#16232B]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#16232B]/90 via-[#16232B]/20 to-transparent" />

      {/* Content — anchored to bottom */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium text-[#3D4A2E] block mb-6">
          Furniture | MAP | Doors &amp; Windows
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white leading-[1.05] mb-8 max-w-3xl">
          Spaces shaped by <span className="italic font-normal">craft</span>.
        </h1>
        <p className="text-sm md:text-base text-[#8FA3B1] font-light leading-relaxed max-w-lg mb-12">
          MADIO is a Hyderabad-based design house developing premium furniture, architectural surface finishes, and building products for architects and luxury developers across India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/furniture"
            className="inline-flex items-center justify-center space-x-2 bg-[#3D4A2E] text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-[#4A5938] transition-all duration-300"
          >
            <span>Explore MADIO Furniture</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center space-x-2 border border-white/50 text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            <span>Enquire</span>
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
        THREE VERTICALS — asymmetric grid, Furniture dominant
        ================================================================ */}
    <section className="bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-6">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#3D4A2E] font-sans font-medium">
          Our Brands
        </span>
      </div>

      {/* Asymmetric grid: Furniture 2/3, MAP + D&W stacked 1/3 */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-3">

          {/* ── Furniture: dominant left block ── */}
          <Link
            to="/furniture"
            className="lg:col-span-2 lg:row-span-2 relative min-h-[420px] lg:min-h-[560px] group overflow-hidden flex flex-col justify-end"
          >
            {/* TODO: client to provide hero furniture photography for this block */}
            <div className="absolute inset-0 bg-[#16232B]" />
            {/* Olive texture lines — placeholder visual treatment */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, #3D4A2E 0, #3D4A2E 1px, transparent 0, transparent 50%)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute top-8 right-8 text-[9px] uppercase tracking-[0.25em] text-[#3D4A2E] font-sans border border-[#243040] px-3 py-1.5">
              {/* TODO: client to provide furniture photography */}
              Photography coming soon
            </div>
            {/* Hover reveal overlay */}
            <div className="absolute inset-0 bg-[#3D4A2E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Content */}
            <div className="relative z-10 p-8 md:p-12">
              <div className="w-10 h-[2px] bg-[#3D4A2E] mb-6 transition-all duration-300 group-hover:w-16" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#3D4A2E] font-sans font-medium block mb-2">
                Flagship Vertical
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-white mb-3">
                MADIO Furniture
              </h2>
              <p className="text-xs text-[#8FA3B1] font-light leading-relaxed max-w-sm mb-6">
                Design-led furniture for residential and hospitality projects, crafted in Hyderabad.
              </p>
              <span className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-white group-hover:space-x-3 transition-all duration-300">
                <span>Explore</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>
          </Link>

          {/* ── MAP ── */}
          <Link
            to="/map"
            className="relative min-h-[260px] group overflow-hidden flex flex-col justify-end"
          >
            <img
              src={mapCardImg}
              alt="MAP architectural finishes"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[#16232B]/55 group-hover:bg-[#16232B]/40 transition-colors duration-500" />
            <div className="relative z-10 p-6 md:p-8">
              <div className="w-8 h-[2px] bg-[#B8956A] mb-4 transition-all duration-300 group-hover:w-12" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#B8956A] font-sans font-medium block mb-1">
                Architectural Finishes
              </span>
              <h2 className="text-2xl font-serif font-light text-white mb-4">MAP</h2>
              <span className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-[0.2em] font-sans font-medium text-white group-hover:space-x-3 transition-all duration-300">
                <span>Explore</span>
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>
          </Link>

          {/* ── Doors & Windows ── */}
          <Link
            to="/doors-windows"
            className="relative min-h-[260px] group overflow-hidden flex flex-col justify-end"
          >
            {/* TODO: client to provide Doors & Windows product/showroom photography */}
            <div className="absolute inset-0 bg-[#1E2F3C]" />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "repeating-linear-gradient(-45deg, #4A6741 0, #4A6741 1px, transparent 0, transparent 50%)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="absolute inset-0 bg-[#4A6741]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 p-6 md:p-8">
              <div className="w-8 h-[2px] bg-[#4A6741] mb-4 transition-all duration-300 group-hover:w-12" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#4A6741] font-sans font-medium block mb-1">
                Fenestration Systems
              </span>
              <h2 className="text-2xl font-serif font-light text-white mb-4">
                MADIO Doors &amp; Windows
              </h2>
              <span className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-[0.2em] font-sans font-medium text-white group-hover:space-x-3 transition-all duration-300">
                <span>Explore</span>
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>

    {/* ================================================================
        BRAND INTRO STRIP
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] bg-[#F5F0EB]/50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#3D4A2E] font-sans font-medium block mb-5">
            About MADIO
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-[#16232B] leading-snug mb-6">
            A Hyderabad-based house of design brands.
          </h2>
          <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">
            {/* TODO: client to provide company about copy — founding story, philosophy, scale */}
            MADIO develops and distributes design-led products across three verticals: furniture, architectural surface finishes, and precision building products. Our work is rooted in craft, material honesty, and the needs of contemporary Indian architecture.
          </p>
        </div>
        <div className="flex flex-col space-y-6 md:pl-8 md:border-l border-[#EBE8E2]">
          {[
            { label: "Verticals", value: "Three" },
            { label: "Base", value: "Hyderabad, India" },
            { label: "Served",  value: "Architects & Developers" },
          ].map((item) => (
            <div key={item.label} className="flex items-baseline justify-between border-b border-[#EBE8E2] pb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-sans">{item.label}</span>
              <span className="text-sm font-serif font-light text-[#16232B]">{item.value}</span>
            </div>
          ))}
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#3D4A2E] hover:text-[#16232B] transition-colors duration-300 pt-2"
          >
            <span>Get in Touch</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>

    {/* ================================================================
        DARK TAGLINE STRIP
        ================================================================ */}
    <section className="bg-[#16232B] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <p className="text-2xl md:text-3xl font-serif font-light text-white leading-snug max-w-lg">
          Built on craft.<br className="hidden md:block" /> Specified by architects.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/furniture"
            className="inline-flex items-center space-x-2 bg-[#3D4A2E] text-white px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-[#4A5938] transition-all duration-300"
          >
            <span>View MADIO Furniture</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 border border-[#243040] text-[#8FA3B1] px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:border-[#3D4A2E] hover:text-[#3D4A2E] transition-all duration-300"
          >
            <span>Enquire</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>

  </div>
);
