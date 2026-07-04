import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { dwProductsData } from "../data/doorsWindows";
import { VerticalProductCard } from "../components/VerticalProductCard";

const DW_ACCENT = "#4A6741";

// Why MADIO D&W — from PDF page 7, verbatim
const whyPoints = [
  "Ultra-slim aluminium profiles — as narrow as 25 mm sightlines — maximising glass area and delivering unobstructed panoramic views.",
  "Imported European hardware on every system, ensuring precision tolerances, smooth long-life operation, and elevated tactile quality.",
  "Complete in-house technical support — from architectural shop drawings through to on-site installation supervision.",
  "Custom finish library: any RAL shade in premium powder-coat, or bright and matte anodized profiles for a timeless architectural finish.",
  "10-year product warranty on select systems backed by certified manufacturing processes and rigorous quality assurance at every stage.",
];

export const DoorsWindows: React.FC = () => (
  <div className="bg-[#FAFAF7]">

    {/* ================================================================
        HERO — dark navy placeholder (no licensed photography yet)
        ================================================================ */}
    <section className="relative min-h-[85vh] flex items-end overflow-hidden bg-[#16232B]">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #4A6741 0, #4A6741 1px, transparent 0, transparent 50%)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#16232B] via-[#16232B]/60 to-transparent" />

      {/* TODO: client to provide licensed Doors & Windows installation photography */}
      <div className="absolute top-8 right-8 md:right-12 z-10 text-[9px] uppercase tracking-[0.2em] text-[#4A6741] font-sans border border-[#243040] px-3 py-1.5">
        Photography coming soon
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium text-[#4A6741] block mb-5">
          MADIO Doors &amp; Windows
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white leading-[1.05] mb-6 max-w-3xl">
          Where Architecture<br />Meets{" "}
          <span className="italic font-normal">Precision</span>.
        </h1>
        <p className="text-sm md:text-base text-[#8FA3B1] font-light leading-relaxed max-w-xl mb-12">
          Premium architectural aluminium fenestration systems engineered for discerning residential and commercial projects. Every profile, every sightline, every hardware component — selected to perform beautifully for decades.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-all duration-300"
            style={{ backgroundColor: DW_ACCENT }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#3a5233")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = DW_ACCENT)}
          >
            <span>Request a Consultation</span>
            <ArrowRight size={13} />
          </Link>
          <a
            href="#systems"
            className="inline-flex items-center space-x-2 border border-white/40 text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            <span>View Systems</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>

    {/* ================================================================
        BRAND ATTRIBUTES — from PDF page 2
        ================================================================ */}
    <section className="bg-[#16232B] border-t border-[#243040]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#243040]">
          {[
            { label: "Precision Engineering",  desc: "Structurally engineered profiles for lasting performance." },
            { label: "Minimalist Aesthetics",  desc: "Ultra-slim sightlines that keep the view unobstructed." },
            { label: "Sustainable Luxury",     desc: "Low-E glazing and thermal break technology as standard." },
          ].map((item) => (
            <div key={item.label} className="bg-[#16232B] px-8 py-10 md:px-10">
              <div className="w-6 h-[2px] mb-5" style={{ backgroundColor: DW_ACCENT }} />
              <h3 className="text-sm font-sans font-medium tracking-[0.1em] uppercase text-white mb-2">
                {item.label}
              </h3>
              <p className="text-xs text-[#8FA3B1] font-light leading-relaxed">{item.desc}</p>
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
              image=""              // No licensed photography yet — VerticalProductCard handles empty
              imageAlt={product.name}
              category={product.categoryLabel}
              name={product.name}
              description={product.description}
              accent={DW_ACCENT}
              primaryAction="enquire"
              primaryActionLabel="Request a Quote"
              enquireHref="/contact"
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
              <span className="text-[10px] font-mono text-[#4A6741] font-medium mt-0.5 shrink-0 w-5">
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
