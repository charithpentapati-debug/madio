import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChevronDown } from "lucide-react";
import { dwProductsData } from "../data/doorsWindows";
import { VerticalProductCard } from "../components/VerticalProductCard";
import { usePageMeta } from "../hooks/usePageMeta";

const DW_ACCENT = "#B8956A";

// Why MADIO D&W — from PDF page 7, verbatim
const whyPoints = [
  "Ultra-slim aluminium profiles — as narrow as 25 mm sightlines — maximising glass area and delivering unobstructed panoramic views.",
  "Imported European hardware on every system, ensuring precision tolerances, smooth long-life operation, and elevated tactile quality.",
  "Complete in-house technical support — from architectural shop drawings through to on-site installation supervision.",
  "Custom finish library: any RAL shade in premium powder-coat, or bright and matte anodized profiles for a timeless architectural finish.",
  "10-year product warranty on select systems backed by certified manufacturing processes and rigorous quality assurance at every stage.",
];

export const DoorsWindows: React.FC = () => {
  usePageMeta(
    "MADIO Doors & Windows | Premium Fenestration Systems for Architecture",
    "Premium architectural fenestration systems engineered for discerning residential and commercial projects — slim sliding systems, casements, glass partitions, and motorised integrated blinds."
  );

  return (
  <div className="bg-[#FAFAF7]">

    {/* ================================================================
        HERO — MAP-style full viewport dark overlay (solid background placeholder)
        ================================================================ */}
    <section className="relative h-[95vh] flex items-center justify-center bg-[#1A1A1A] overflow-hidden">
      {/* Background/Texture Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #B8956A 0, #B8956A 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-[#1A1A1A]/35" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center text-white flex flex-col items-center">
        <div className="flex items-center space-x-2 border border-[#B8956A]/60 px-4 py-1.5 mb-8 animate-fade-in">
          <Sparkles size={12} className="text-[#B8956A]" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#EBE8E2]">
            Doors &amp; Windows
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-light tracking-wide leading-[1.1] mb-6 animate-fade-in-up">
          Where Architecture <br />
          <span className="italic font-normal text-[#B8956A]">Meets Precision</span>
        </h1>

        <p className="text-sm md:text-lg tracking-wider font-light text-[#F5F0EB]/95 max-w-2xl mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Premium architectural aluminium fenestration systems engineered for discerning residential and commercial projects. Every profile, every sightline, every hardware component — selected to perform beautifully for decades.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Link
            to="/contact?source=doors-windows"
            className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium bg-[#B8956A] text-white hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 shadow-md text-center"
          >
            Request a Consultation
          </Link>
          <a
            href="#systems"
            className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-white text-white hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 text-center"
          >
            View Systems
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/60 animate-bounce">
        <span className="text-[9px] uppercase tracking-[0.25em] mb-2 font-sans font-light">Scroll Down</span>
        <ChevronDown size={14} />
      </div>
    </section>

    {/* ================================================================
        BRAND ATTRIBUTES — from PDF page 2
        ================================================================ */}
    <section className="bg-[#F5F0EB] border-t border-[#EBE8E2]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#EBE8E2]">
          {[
            { label: "Precision Engineering",  desc: "Structurally engineered profiles for lasting performance." },
            { label: "Minimalist Aesthetics",  desc: "Ultra-slim sightlines that keep the view unobstructed." },
            { label: "Sustainable Luxury",     desc: "Low-E glazing and thermal break technology as standard." },
          ].map((item) => (
            <div key={item.label} className="bg-[#F5F0EB] px-8 py-10 md:px-10">
              <div className="w-6 h-[2px] mb-5" style={{ backgroundColor: DW_ACCENT }} />
              <h3 className="text-sm font-sans font-medium tracking-[0.1em] uppercase text-[#16232B] mb-2">
                {item.label}
              </h3>
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ================================================================
        PRODUCT LISTING
        ================================================================ */}
    <section id="systems" className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: DW_ACCENT }}>
            Product Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-[#16232B] leading-tight">
            Our Fenestration{" "}
            <span className="italic font-normal">Systems</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dwProductsData.map((product) => (
            <VerticalProductCard
              key={product.id}
              image={product.images && product.images[0] ? product.images[0] : ""}
              imageAlt={product.name}
              category={product.categoryLabel}
              name={product.name}
              description={product.description}
              accent={DW_ACCENT}
              primaryAction="enquire"
              primaryActionLabel="Request a Quote"
              enquireHref="/contact?source=doors-windows"
              detailHref={`/doors-windows/${product.id}`}
              detailLabel="View System"
              // price intentionally undefined — Phase 1
            />
          ))}
        </div>
      </div>
    </section>

    {/* ================================================================
        WHY MADIO DOORS & WINDOWS — from PDF page 7
        ================================================================ */}
    <section className="bg-[#F5F0EB]/50 border-t border-[#EBE8E2] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-5" style={{ color: DW_ACCENT }}>
            Why MADIO Doors &amp; Windows
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-[#16232B] leading-snug">
            The standard for premium fenestration in India.
          </h2>
        </div>
        <div className="space-y-5">
          {whyPoints.map((point, i) => (
            <div key={i} className="flex items-start space-x-4">
              <span className="text-[10px] font-mono text-[#B8956A] font-medium mt-0.5 shrink-0 w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

  </div>
  );
};
