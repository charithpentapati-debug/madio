import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import {
  dwCategories,
  getCategoryMeta,
  getCategoryPhotos,
  getSystemById,
  isDWCategoryId,
} from "../data/doorsWindows";
import type { DWCategoryPhoto, DWSystemSpec } from "../data/doorsWindows";
import { usePageMeta } from "../hooks/usePageMeta";

const DW_ACCENT = "#D4AF37";

const hasValue = (v: string | undefined): v is string =>
  !!v && v.trim() !== "" && v.trim().toLowerCase() !== "todo";

// Flat spec rows (excludes trackWidth/interlock, which render as their own
// track table, and frameHeight when a track table is present).
const FLAT_SPEC_LABELS: Partial<Record<keyof DWSystemSpec, string>> = {
  frameWidth: "Frame Width",
  frameHeight: "Frame Height",
  glassThickness: "Glass Thickness",
  maxHeight: "Maximum Height",
  maxWidth: "Maximum Width",
  lockingSystem: "Locking System",
  netOption: "Net Option",
  loadCapacity: "Load Capacity",
  windLoad: "Wind Load",
};

// Coming soon state — used for the 6 categories pending full client
// specification. Shows the one confirmed real data point instead of
// inventing specs, matching the pattern used for un-populated Furniture
// categories. Once the client has uploaded photos via /admin/upload for a
// category like this, `photos` replaces the empty placeholder area with a
// real grid — same pattern Bar Chairs uses in Furniture once it has real
// photos — while the rest (confirmed note, enquire CTA) stays, since full
// specs still aren't confirmed even once reference photos exist.
const ComingSoonState: React.FC<{
  confirmedNote?: string;
  panelConfigs?: string[];
  photos?: DWCategoryPhoto[];
}> = ({ confirmedNote, panelConfigs, photos = [] }) => (
  <div className="py-24 text-center max-w-xl mx-auto">
    {photos.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-14 text-left">
        {photos.map((p) => (
          <div key={p.productCode} className="relative aspect-square overflow-hidden bg-[#EBE8E2] border border-[#EBE8E2]">
            <img src={p.secureUrl} alt={p.productCode} loading="lazy" className="w-full h-full object-cover" />
            <span className="absolute bottom-2 left-2 text-[8px] font-mono text-white bg-black/50 px-1.5 py-0.5 tracking-wider">
              {p.productCode}
            </span>
          </div>
        ))}
      </div>
    )}

    <div className="w-8 h-[2px] mx-auto mb-8" style={{ backgroundColor: DW_ACCENT }} />

    {(confirmedNote || (panelConfigs && panelConfigs.length > 0)) && (
      <div className="bg-[#F5F0EB] border border-[#EBE8E2] px-6 py-5 mb-10 text-left">
        <span className="text-[9px] uppercase tracking-[0.25em] font-sans font-medium block mb-3" style={{ color: DW_ACCENT }}>
          Confirmed So Far
        </span>
        {confirmedNote && (
          <p className="text-xs text-[#6B6B6B] font-light leading-relaxed mb-3">{confirmedNote}</p>
        )}
        {panelConfigs && panelConfigs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {panelConfigs.map((cfg) => (
              <span
                key={cfg}
                className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 border text-[#16232B] border-[#EBE8E2] bg-white"
              >
                {cfg}
              </span>
            ))}
          </div>
        )}
      </div>
    )}

    <p className="text-xs text-[#6B6B6B] font-light max-w-xs mx-auto mb-10 leading-relaxed">
      {photos.length > 0
        ? "Full technical specifications are still being finalised. Enquire below for pricing and availability."
        : "Full specifications are being finalised with the client. Enquire below and we'll get in touch once they're available."}
    </p>
    <Link
      to="/contact?source=doors-windows"
      className="inline-flex items-center space-x-2 px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: DW_ACCENT }}
    >
      <span>Enquire</span>
      <ArrowRight size={12} />
    </Link>
  </div>
);

export const DoorsWindowsDetail: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const meta = category && isDWCategoryId(category) ? getCategoryMeta(category) : undefined;
  const system = category ? getSystemById(category) : undefined;
  const clientPhotos = category && isDWCategoryId(category) ? getCategoryPhotos(category) : [];
  const isAvailable = !!meta?.isPopulated || clientPhotos.length > 0;

  usePageMeta(
    meta ? `${meta.name} | MADIO Doors & Windows` : "MADIO Doors & Windows",
    meta?.description ?? "Custom-engineered architectural aluminium fenestration systems from MADIO Doors & Windows."
  );

  // Unknown slug → redirect to landing
  if (!category || !isDWCategoryId(category) || !meta) {
    return <Navigate to="/doors-windows" replace />;
  }

  const hasTrack =
    !!system && (hasValue(system.specs.trackWidth?.twoTrack) || hasValue(system.specs.trackWidth?.threeTrack));

  const flatRows = system
    ? (Object.entries(system.specs) as [keyof DWSystemSpec, string | undefined][])
        .filter(([key, v]) => {
          if (key === "trackWidth" || key === "interlock" || key === "warranty") return false;
          if (key === "frameHeight" && hasTrack) return false; // frame height lives in the track table instead
          return hasValue(v as string | undefined) && FLAT_SPEC_LABELS[key] !== undefined;
        })
        .map(([key, value]) => ({ label: FLAT_SPEC_LABELS[key]!, value: value as string }))
    : [];

  return (
    <div className="bg-[#FAFAF7]">

      {/* ── Header banner ── */}
      <section className="relative bg-[#F5F0EB] pt-32 pb-16 px-6 md:px-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Link
            to="/doors-windows"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors mb-10"
          >
            <ArrowLeft size={13} />
            <span>All Systems</span>
          </Link>

          <div className="max-w-3xl">
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: DW_ACCENT }}>
              {isAvailable ? "Product System" : "Coming Soon"}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-light text-[#16232B] leading-tight mb-4">
              {meta.name}
            </h1>
            <p className="text-sm text-[#6B6B6B] font-light leading-relaxed max-w-xl">
              {system?.tagline ?? meta.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {!meta.isPopulated || !system ? (
          <ComingSoonState
            confirmedNote={meta.confirmedNote}
            panelConfigs={meta.panelConfigs}
            photos={clientPhotos}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left: image + description + core features */}
            <div className="lg:col-span-6 space-y-6">
              <div className="relative h-[420px] flex flex-col items-center justify-center overflow-hidden bg-[#EBE8E2]">
                {system.images.length > 0 ? (
                  <img
                    src={system.images[0]}
                    alt={system.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div
                      className="absolute inset-0 opacity-[0.05]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    <div className="relative z-10 text-center px-8">
                      <div className="w-10 h-[2px] mb-6 mx-auto" style={{ backgroundColor: DW_ACCENT }} />
                      <p className="text-[9px] uppercase tracking-[0.25em] font-sans text-[#6B6B6B]">
                        Photography coming soon
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-4">
                  Overview
                </h2>
                <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">{system.description}</p>
              </div>

              {system.coreFeatures.length > 0 && (
                <div className="border-t border-[#EBE8E2] pt-6">
                  <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-4">
                    Core Performance Features
                  </h2>
                  <ul className="space-y-2.5">
                    {system.coreFeatures.map((f, i) => (
                      <li key={i} className="text-xs text-[#6B6B6B] font-light leading-relaxed flex items-start">
                        <span className="mt-1.5 mr-2.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: DW_ACCENT }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasValue(system.bestFor) && (
                <div className="border-t border-[#EBE8E2] pt-6">
                  <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-3">
                    Best For
                  </h2>
                  <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">{system.bestFor}</p>
                </div>
              )}
            </div>

            {/* Right: specs + warranty + CTA */}
            <div className="lg:col-span-6 space-y-10">

              {/* Track table — 2-track / 3-track systems only */}
              {hasTrack && (
                <div>
                  <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-6 flex items-center space-x-2">
                    <div className="w-4 h-[2px]" style={{ backgroundColor: DW_ACCENT }} />
                    <span>Track Specification</span>
                  </h2>
                  <div className="overflow-x-auto border border-[#EBE8E2]">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#16232B]">
                          <th className="text-left font-sans font-medium uppercase tracking-[0.1em] text-[10px] text-white px-4 py-3">Specification</th>
                          <th className="text-left font-sans font-medium uppercase tracking-[0.1em] text-[10px] text-white px-4 py-3">2 Track</th>
                          <th className="text-left font-sans font-medium uppercase tracking-[0.1em] text-[10px] text-white px-4 py-3">3 Track</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="px-4 py-3 font-medium text-[#16232B]">Track Width</td>
                          <td className="px-4 py-3 text-[#6B6B6B] font-light">{system.specs.trackWidth?.twoTrack ?? "—"}</td>
                          <td className="px-4 py-3 text-[#6B6B6B] font-light">{system.specs.trackWidth?.threeTrack ?? "—"}</td>
                        </tr>
                        {hasValue(system.specs.frameHeight) && (
                          <tr className="bg-[#F5F0EB]/60">
                            <td className="px-4 py-3 font-medium text-[#16232B]">Frame Height</td>
                            <td className="px-4 py-3 text-[#6B6B6B] font-light">{system.specs.frameHeight}</td>
                            <td className="px-4 py-3 text-[#6B6B6B] font-light">{system.specs.frameHeight}</td>
                          </tr>
                        )}
                        {hasValue(system.specs.interlock) && (
                          <tr className="bg-white">
                            <td className="px-4 py-3 font-medium text-[#16232B]">Interlock</td>
                            <td className="px-4 py-3 text-[#6B6B6B] font-light">{system.specs.interlock}</td>
                            <td className="px-4 py-3 text-[#6B6B6B] font-light">{system.specs.interlock}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Flat spec table */}
              {flatRows.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-6 flex items-center space-x-2">
                    <div className="w-4 h-[2px]" style={{ backgroundColor: DW_ACCENT }} />
                    <span>Technical Specification</span>
                  </h2>
                  <div className="space-y-0 text-xs border-t border-[#EBE8E2]">
                    {flatRows.map((row, i) => (
                      <div
                        key={row.label}
                        className={`grid grid-cols-5 py-3.5 ${i < flatRows.length - 1 ? "border-b border-[#EBE8E2]" : ""}`}
                      >
                        <span className="col-span-2 text-[#6B6B6B] font-light">{row.label}</span>
                        <span className="col-span-3 text-[#16232B] font-medium pl-4 leading-relaxed">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty callout — hasValue-gated, per-product (see doorsWindows.ts correction note) */}
              {hasValue(system.specs.warranty) && (
                <div className="flex items-start space-x-3 bg-[#F5F0EB] border border-[#EBE8E2] p-5">
                  <CheckCircle size={16} style={{ color: DW_ACCENT }} className="shrink-0 mt-0.5" />
                  <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                    {system.specs.warranty} Warranty. Custom RAL powder-coat and anodized finishes available on request.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="border-t border-[#EBE8E2] pt-8 space-y-4">
                <Link
                  to={`/contact?source=doors-windows&system=${system.id}`}
                  className="flex items-center justify-center space-x-2 w-full py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-all duration-300"
                  style={{ backgroundColor: DW_ACCENT }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#3a5233")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = DW_ACCENT)}
                >
                  <span>Request a Quote</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  to="/doors-windows"
                  className="flex items-center justify-center space-x-2 w-full py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-[#EBE8E2] text-[#6B6B6B] hover:border-[#16232B] hover:text-[#16232B] transition-all duration-300"
                >
                  <ArrowLeft size={13} />
                  <span>All Systems</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Related systems strip ── */}
      <section className="border-t border-[#EBE8E2] bg-[#F5F0EB]/40 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-8">
            Other Systems
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dwCategories
              .filter((c) => c.id !== category)
              .slice(0, 3)
              .map((c) => (
                <Link
                  key={c.id}
                  to={`/doors-windows/${c.id}`}
                  className="bg-white border border-[#EBE8E2] p-6 group hover:border-[#D4AF37]/40 transition-all duration-300"
                >
                  <div className="w-6 h-[2px] mb-4 transition-all duration-300 group-hover:w-10" style={{ backgroundColor: DW_ACCENT }} />
                  <span className="text-[9px] uppercase tracking-[0.2em] font-sans font-medium block mb-1" style={{ color: DW_ACCENT }}>
                    {c.isPopulated || getCategoryPhotos(c.id).length > 0 ? "Product System" : "Coming Soon"}
                  </span>
                  <p className="text-sm font-serif font-light text-[#16232B] group-hover:text-[#D4AF37] transition-colors">
                    {c.name}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
};
