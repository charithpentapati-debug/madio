import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { dwProductsData } from "../data/doorsWindows";
import type { DWSpec } from "../data/doorsWindows";
import { usePageMeta } from "../hooks/usePageMeta";

const DW_ACCENT = "#B8956A";

const hasValue = (v: string | undefined): v is string =>
  !!v && v.trim() !== "" && v.trim().toLowerCase() !== "todo";

// Human-readable labels for each spec key
const SPEC_LABELS: Partial<Record<keyof DWSpec, string>> = {
  profileDepth:  "Profile Depth",
  trackConfig:   "Track Configuration",
  hardware:      "Hardware",
  finish:        "Finish Options",
  acoustic:      "Acoustic Performance",
  thermal:       "Thermal Performance",
  windLoad:      "Wind Load Rating",
  locking:       "Locking System",
  glazing:       "Glazing Options",
  application:   "Application",
  automation:    "Automation",
  warranty:      "Warranty",
};

export const DoorsWindowsDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = dwProductsData.find((p) => p.id === productId);

  usePageMeta(
    product ? `${product.name} | MADIO Doors & Windows` : "MADIO Doors & Windows",
    product?.description ?? "Premium architectural fenestration systems from MADIO Doors & Windows."
  );

  // Unknown slug → redirect to listing
  if (!product) return <Navigate to="/doors-windows" replace />;

  // Build filtered spec rows (only fields with real values from the PDF)
  const specRows = (Object.entries(product.specs) as [keyof DWSpec, string | undefined][])
    .filter(([, v]) => hasValue(v))
    .map(([key, value]) => ({ label: SPEC_LABELS[key] ?? key, value: value as string }));

  return (
    <div className="bg-[#FAFAF7]">

      {/* ── Product header banner ── */}
      <section className="relative bg-[#F5F0EB] pt-32 pb-16 px-6 md:px-12 overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #B8956A 0, #B8956A 1px, transparent 0, transparent 50%)",
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
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4"
              style={{ color: DW_ACCENT }}
            >
              {product.categoryLabel}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-light text-[#16232B] leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-sm text-[#6B6B6B] font-light leading-relaxed max-w-xl">
              {product.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* ── Main content grid ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* Left: image placeholder + description */}
        <div className="lg:col-span-6 space-y-6">
          {/* Product image */}
          <div
            className="relative h-[420px] flex flex-col items-center justify-center overflow-hidden bg-[#EBE8E2]"
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #B8956A 0, #B8956A 1px, transparent 0, transparent 50%)",
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

          {/* Long description */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-4">
              Overview
            </h2>
            <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">
              {product.longDescription}
            </p>
          </div>

          {/* Variants (Slim Sliding only) */}
          {product.variants && product.variants.length > 0 && (
            <div className="border-t border-[#EBE8E2] pt-6">
              <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-4">
                Available Profiles
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <span
                    key={v.code}
                    className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 border text-[#16232B] border-[#EBE8E2] bg-white"
                  >
                    {v.code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: specs + CTA */}
        <div className="lg:col-span-6 space-y-10">

          {/* Technical specs — only populated fields shown */}
          {specRows.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-6 flex items-center space-x-2">
                <div className="w-4 h-[2px]" style={{ backgroundColor: DW_ACCENT }} />
                <span>Technical Specification</span>
              </h2>
              <div className="space-y-0 text-xs border-t border-[#EBE8E2]">
                {specRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-5 py-3.5 ${
                      i < specRows.length - 1 ? "border-b border-[#EBE8E2]" : ""
                    }`}
                  >
                    <span className="col-span-2 text-[#6B6B6B] font-light">{row.label}</span>
                    <span className="col-span-3 text-[#16232B] font-medium pl-4 leading-relaxed">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warranty callout */}
          {hasValue(product.specs.warranty) && (
            <div className="flex items-start space-x-3 bg-[#F5F0EB] border border-[#EBE8E2] p-5">
              <CheckCircle size={16} style={{ color: DW_ACCENT }} className="shrink-0 mt-0.5" />
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                {product.specs.warranty}. Custom RAL powder-coat and anodized finishes available on request.
              </p>
            </div>
          )}

          {/* CTA */}
          {/* Commerce extension point: when e-commerce is enabled, replace this Link with
              an "Add to Cart" or "Configure & Order" button + price display.
              product.price is already typed — just populate it when ready. */}
          <div className="border-t border-[#EBE8E2] pt-8 space-y-4">
            <Link
              to={`/contact?source=doors-windows&system=${product.id}`}
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
      </section>

      {/* ── Related systems strip ── */}
      <section className="border-t border-[#EBE8E2] bg-[#F5F0EB]/40 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-8">
            Other Systems
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dwProductsData
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((p) => (
                <Link
                  key={p.id}
                  to={`/doors-windows/${p.id}`}
                  className="bg-white border border-[#EBE8E2] p-6 group hover:border-[#B8956A]/40 transition-all duration-300"
                >
                  <div className="w-6 h-[2px] mb-4 transition-all duration-300 group-hover:w-10" style={{ backgroundColor: DW_ACCENT }} />
                  <span className="text-[9px] uppercase tracking-[0.2em] font-sans font-medium block mb-1" style={{ color: DW_ACCENT }}>
                    {p.categoryLabel}
                  </span>
                  <p className="text-sm font-serif font-light text-[#16232B] group-hover:text-[#B8956A] transition-colors">
                    {p.name}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
};
