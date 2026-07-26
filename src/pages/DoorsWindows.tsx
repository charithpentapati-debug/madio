import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import {
  dwCategories,
  dwSystems,
  materialComparison,
  windowDoorTypologies,
  aluminiumAdvantages,
  madioProcess,
  performanceStandards,
  getSystemComparison,
} from "../data/doorsWindows";
import type { DWCategoryMeta } from "../data/doorsWindows";
import { usePageMeta } from "../hooks/usePageMeta";

const DW_ACCENT = "#D4AF37";

// Why MADIO D&W — reworded from the source catalogue PDF to remove
// "manufacturer" framing and the blanket 15-Year Warranty claim.
const whyPoints = [
  "Ultra-slim aluminium profiles — interlocks as narrow as 17 mm — maximising glass area and delivering unobstructed panoramic views.",
  "Imported European hardware on every system, ensuring precision tolerances, smooth long-life operation, and elevated tactile quality.",
  "Complete technical support — from architectural shop drawings through to on-site installation supervision.",
  "Custom finish library: any RAL shade in premium powder-coat, or bright and matte anodized profiles for a timeless architectural finish.",
  "10-year warranty coverage confirmed per system, backed by rigorous quality assurance at every stage.",
];

const OliveTexture: React.FC<{ className?: string; opacity?: string }> = ({
  className = "",
  opacity = "0.06",
}) => (
  <div
    className={`absolute inset-0 ${className}`}
    style={{
      backgroundImage:
        "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)",
      backgroundSize: "20px 20px",
      opacity,
    }}
  />
);

// Category card — links to /doors-windows/[slug]. Mirrors FurnitureLanding's
// CategoryCard so both verticals present catalogues the same way.
const CategoryCard: React.FC<{ cat: DWCategoryMeta; index: number }> = ({ cat, index }) => {
  const system = dwSystems.find((s) => s.id === cat.id);
  const thumbnail = cat.isPopulated ? system?.images[0] : undefined;

  return (
    <Link
      to={`/doors-windows/${cat.id}`}
      className="group relative flex flex-col overflow-hidden border border-[#EBE8E2] bg-white hover:border-[#D4AF37]/30 transition-all duration-500 reveal-on-scroll"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative h-52 overflow-hidden shrink-0" style={{ backgroundColor: "#EBE8E2" }}>
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
        <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {!cat.isPopulated && (
          <div className="absolute top-3 right-3 text-[8px] uppercase tracking-[0.25em] font-sans border border-[#243040] text-[#C4B9A8] px-2.5 py-1">
            Coming Soon
          </div>
        )}
        {cat.isPopulated && (
          <div
            className="absolute top-3 right-3 text-[8px] uppercase tracking-[0.25em] font-sans px-2.5 py-1"
            style={{ backgroundColor: DW_ACCENT, color: "#fff" }}
          >
            Available
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <div
            className="w-6 h-[2px] mb-0 transition-all duration-300 group-hover:w-10"
            style={{ backgroundColor: DW_ACCENT }}
          />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-serif font-light text-[#16232B] mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
          {cat.name}
        </h3>
        <p className="text-xs text-[#6B6B6B] font-light leading-relaxed flex-grow">
          {cat.description}
        </p>
        <div className="flex items-center space-x-1.5 mt-5 text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#D4AF37]">
          <span>{cat.isPopulated ? "Explore" : "View"}</span>
          <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

// Small reusable data-table shell used across the overview sections below.
const DataTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div className="overflow-x-auto border border-[#EBE8E2]">
    <table className="w-full text-xs">
      <thead>
        <tr className="bg-[#16232B]">
          {headers.map((h) => (
            <th
              key={h}
              className="text-left font-sans font-medium uppercase tracking-[0.1em] text-[10px] text-white px-4 py-3 whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 1 ? "bg-[#F5F0EB]/60" : "bg-white"}>
            {row.map((cell, j) => (
              <td
                key={j}
                className={`px-4 py-3 align-top ${
                  j === 0 ? "font-medium text-[#16232B] whitespace-nowrap" : "text-[#6B6B6B] font-light"
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DoorsWindows: React.FC = () => {
  usePageMeta(
    "MADIO Doors & Windows | Premium Fenestration Systems for Architecture",
    "Custom-engineered architectural aluminium fenestration systems — slim sliding systems, casement doors, metal ceilings, balcony railings, and glass partitions."
  );

  const comparisonRows = getSystemComparison();

  return (
  <div className="bg-[#FAFAF7]">

    {/* ================================================================
        HERO
        ================================================================ */}
    <section className="relative h-[95vh] flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/35" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center text-white flex flex-col items-center">
        <div className="flex items-center space-x-2 border border-[#D4AF37]/60 px-4 py-1.5 mb-8 animate-fade-in">
          <Sparkles size={12} className="text-[#D4AF37]" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#EBE8E2]">
            Doors &amp; Windows
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-light tracking-wide leading-[1.1] mb-6 animate-fade-in-up">
          Where Architecture <br />
          <span className="italic font-normal text-[#D4AF37]">Meets Precision</span>
        </h1>

        <p className="text-sm md:text-lg tracking-wider font-light text-[#F5F0EB]/95 max-w-2xl mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Custom-engineered architectural aluminium fenestration systems, made to Madio's exacting specifications for discerning residential and commercial projects.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Link
            to="/contact?source=doors-windows"
            className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium bg-[#D4AF37] text-white hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 shadow-md text-center"
          >
            Request a Consultation
          </Link>
          <a
            href="#systems"
            className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-white text-white hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 text-center"
          >
            View Systems
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/60 animate-bounce">
        <span className="text-[9px] uppercase tracking-[0.25em] mb-2 font-sans font-light">Scroll Down</span>
        <ChevronDown size={14} />
      </div>
    </section>

    {/* ================================================================
        ABOUT — reworded to remove the "premium manufacturer" claim.
        Madio custom-engineers systems to spec; it does not manufacture
        in-house, and the production partner is not named publicly.
        ================================================================ */}
    <section className="bg-[#F5F0EB] border-t border-[#EBE8E2] py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-5" style={{ color: DW_ACCENT }}>
          About Madio Doors &amp; Windows
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-light text-[#16232B] leading-snug mb-6">
          Engineering the future of fenestration.
        </h2>
        <p className="text-sm text-[#6B6B6B] font-light leading-relaxed mb-4">
          Madio Doors &amp; Windows offers custom-engineered architectural aluminium fenestration systems, made to Madio's exacting specifications for the modern built environment. Founded on the principles of minimalist design, engineering precision, and uncompromising performance, Madio delivers solutions that transform spaces while standing the test of time.
        </p>
        <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">
          We believe that every window and door is more than a structural element — it is a design statement, a barrier against the elements, and a gateway to natural light and panoramic views. Our systems are trusted by leading architects, discerning builders, and homeowners who refuse to compromise.
        </p>
      </div>
    </section>

    {/* ================================================================
        CATEGORY GRID — 6 populated systems + 6 categories pending
        full client specification.
        ================================================================ */}
    <section id="systems" className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <div className="mb-12">
        <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: DW_ACCENT }}>
          Product Portfolio
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-light text-[#16232B] leading-tight">
          Our Fenestration <span className="italic font-normal">Systems</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dwCategories.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>
    </section>

    {/* ================================================================
        SYSTEM COMPARISON AT A GLANCE — from the catalogue PDF
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: DW_ACCENT }}>
            At A Glance
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-[#16232B]">
            System Comparison
          </h2>
        </div>
        <DataTable
          headers={["System", "Max Height", "Max Width", "Max Load", "Wind Load", "Interlock", "Frame H."]}
          rows={comparisonRows.map((r) => [
            r.system,
            r.maxHeight,
            r.maxWidth,
            r.loadCapacity,
            r.windLoad,
            r.interlock,
            r.frameHeight,
          ])}
        />
      </div>
    </section>

    {/* ================================================================
        MATERIAL COMPARISON — Aluminium vs Wood vs UPVC
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] bg-[#F5F0EB]/50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: DW_ACCENT }}>
            Material Comparison
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-[#16232B]">
            Why Aluminium?
          </h2>
          <p className="text-sm text-[#6B6B6B] font-light leading-relaxed max-w-2xl mt-4">
            Choosing the right frame material is a critical architectural decision. Here's how aluminium — the core of every Madio system — compares to traditional alternatives.
          </p>
        </div>
        <DataTable
          headers={["Parameter", "Aluminium (Madio)", "Wood", "UPVC"]}
          rows={materialComparison.map((r) => [r.parameter, r.aluminium, r.wood, r.upvc])}
        />
      </div>
    </section>

    {/* ================================================================
        WINDOW & DOOR TYPOLOGIES
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: DW_ACCENT }}>
            Configurations
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-[#16232B]">
            Window &amp; Door Typologies
          </h2>
        </div>
        <DataTable
          headers={["Configuration", "Application"]}
          rows={windowDoorTypologies.map((r) => [r.configuration, r.application])}
        />
      </div>
    </section>

    {/* ================================================================
        THE MADIO PROCESS — Step 2 reworded from "Precision Manufacturing"
        to "Precision Engineering"; Step 3/4 reworded to remove
        "manufacturer" wording and the blanket 15-Year Warranty claim.
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] bg-[#F5F0EB]/50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: DW_ACCENT }}>
            Our Process
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-[#16232B] mb-4">
            End-to-End Excellence
          </h2>
          <p className="text-sm text-[#6B6B6B] font-light leading-relaxed max-w-2xl">
            At Madio, we believe that exceptional fenestration is not just about the product — it's about the entire experience. Our end-to-end process ensures perfection at every stage.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {madioProcess.map((step) => (
            <div key={step.step} className="bg-white border border-[#EBE8E2] p-7">
              <span className="text-[10px] font-mono text-[#D4AF37] font-medium block mb-3">
                Step {step.step}
              </span>
              <h3 className="text-lg font-serif font-light text-[#16232B] mb-1">{step.title}</h3>
              <p className="text-xs italic text-[#6B6B6B] font-light mb-5">{step.tagline}</p>
              <ul className="space-y-2">
                {step.bullets.map((b, i) => (
                  <li key={i} className="text-xs text-[#6B6B6B] font-light leading-relaxed flex items-start">
                    <span className="mt-1.5 mr-2.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: DW_ACCENT }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ================================================================
        PERFORMANCE STANDARDS — Warranty corrected from 15 to 10 Years.
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: DW_ACCENT }}>
            Standards
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-[#16232B]">
            Performance Standards
          </h2>
        </div>
        <DataTable
          headers={["Standard", "Specification"]}
          rows={performanceStandards.map((r) => [r.standard, r.specification])}
        />
      </div>
    </section>

    {/* ================================================================
        ALUMINIUM ADVANTAGES
        ================================================================ */}
    <section className="border-t border-[#EBE8E2] bg-[#F5F0EB]/50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: DW_ACCENT }}>
            Why It Lasts
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-light text-[#16232B]">
            The Advantages of Aluminium Windows
          </h2>
        </div>
        <DataTable
          headers={["Advantage", "Description"]}
          rows={aluminiumAdvantages.map((r) => [r.advantage, r.description])}
        />
      </div>
    </section>

    {/* ================================================================
        WHY MADIO DOORS & WINDOWS
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
              <span className="text-[10px] font-mono text-[#D4AF37] font-medium mt-0.5 shrink-0 w-5">
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
