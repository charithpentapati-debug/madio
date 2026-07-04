import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  furnitureCategories,
  getProductsByCategory,
  getProductById,
  isFurnitureCategoryId,
} from "../data/furniture";
import type { FurnitureProductSpec } from "../data/furniture";

const FURNITURE_ACCENT = "#3D4A2E";

// Guard: hides empty / placeholder spec fields in the UI
const hasValue = (v: string | undefined): v is string =>
  !!v && v.trim() !== "" && v.trim().toLowerCase() !== "todo";

const SPEC_LABELS: Partial<Record<keyof FurnitureProductSpec, string>> = {
  construction:   "Construction",
  material:       "Material",
  dimensions:     "Dimensions",
  finish:         "Finish",
  upholstery:     "Upholstery",
  seatingHeight:  "Seating Height",
  tableTop:       "Table Top",
  warranty:       "Warranty",
};

export const FurnitureProductDetail: React.FC = () => {
  const { category, productId } = useParams<{ category: string; productId: string }>();

  // Validate route params
  if (!category || !isFurnitureCategoryId(category)) {
    return <Navigate to="/furniture" replace />;
  }
  const product = productId ? getProductById(productId) : undefined;
  if (!product || product.category !== category) {
    return <Navigate to={`/furniture/${category}`} replace />;
  }

  const categoryMeta = furnitureCategories.find((c) => c.id === category);

  // Only render spec rows where real data exists
  const specRows = (
    Object.entries(product.specs) as [keyof FurnitureProductSpec, string | undefined][]
  )
    .filter(([, v]) => hasValue(v))
    .map(([key, value]) => ({ label: SPEC_LABELS[key] ?? key, value: value as string }));

  // Adjacent products for prev/next navigation
  const siblings = getProductsByCategory(category);
  const currentIdx = siblings.findIndex((p) => p.id === product.id);
  const prevProduct = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextProduct = currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

  return (
    <div className="bg-[#FAFAF7]">

      {/* ── Dark product header banner ── */}
      <section className="relative bg-[#16232B] pt-32 pb-16 px-6 md:px-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #3D4A2E 0, #3D4A2E 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Link
            to={`/furniture/${category}`}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#8FA3B1] hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={13} />
            <span>{categoryMeta?.name ?? "Back"}</span>
          </Link>

          <div className="max-w-3xl">
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4"
              style={{ color: FURNITURE_ACCENT }}
            >
              {categoryMeta?.name ?? "MADIO Furniture"}
            </span>
            {/* Product name — currently the SKU code until client provides real names */}
            <h1 className="text-4xl md:text-6xl font-serif font-light text-white leading-tight mb-2">
              {product.name}
            </h1>
            {product.subcategory && (
              <span className="text-xs text-[#8FA3B1] font-sans font-light uppercase tracking-widest">
                {product.subcategory}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Main content grid ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* Left: image placeholder + description */}
        <div className="lg:col-span-6 space-y-6">

          {/* Primary image — real photo when available, placeholder otherwise */}
          <div
            className="relative h-[420px] flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: "#1E2F3C" }}
          >
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <>
                {/* TODO: client to provide licensed furniture photography */}
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #3D4A2E 0, #3D4A2E 1px, transparent 0, transparent 50%)",
                    backgroundSize: "18px 18px",
                  }}
                />
                <div className="relative z-10 text-center px-8">
                  <div
                    className="w-10 h-[2px] mb-6 mx-auto"
                    style={{ backgroundColor: FURNITURE_ACCENT }}
                  />
                  <p className="text-[9px] uppercase tracking-[0.25em] font-sans text-[#4A6070]">
                    Photography coming soon
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Description — empty until client provides product copy */}
          {hasValue(product.description) && (
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-3">
                Overview
              </h2>
              <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

        </div>

        {/* Right: SKU, specs, CTA */}
        <div className="lg:col-span-6 space-y-10">

          {/* SKU / Reference */}
          <div className="border-b border-[#EBE8E2] pb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-sans block mb-1">
              Reference
            </span>
            <span className="font-mono text-xl text-[#16232B] tracking-wider">
              {product.sku}
            </span>
          </div>

          {/* Technical specs — only fields with real data from the PDF */}
          {specRows.length > 0 ? (
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-6 flex items-center space-x-2">
                <div className="w-4 h-[2px]" style={{ backgroundColor: FURNITURE_ACCENT }} />
                <span>Specification</span>
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
          ) : (
            // No specs yet — honest placeholder
            <div className="border border-[#EBE8E2] p-5">
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                Detailed specifications are available on request. Our team can provide material
                samples, finish options, and dimension sheets for any piece in the collection.
              </p>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="border-t border-[#EBE8E2] pt-6">
              <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-4">
                Available Options
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <span
                    key={v.name}
                    className="text-[10px] font-sans uppercase tracking-wider px-3 py-1.5 border border-[#EBE8E2] text-[#16232B] bg-white"
                  >
                    {v.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {/* Commerce extension point: when e-commerce is enabled, replace this Link with
              an "Add to Cart" / "Configure & Order" button + price display.
              product.price is already typed — just populate it and render here when ready. */}
          <div className="border-t border-[#EBE8E2] pt-8 space-y-4">
            <Link
              to={`/contact?product=${product.id}&category=${category}`}
              className="flex items-center justify-center space-x-2 w-full py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: FURNITURE_ACCENT }}
            >
              <span>Request a Quote</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              to={`/furniture/${category}`}
              className="flex items-center justify-center space-x-2 w-full py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-[#EBE8E2] text-[#6B6B6B] hover:border-[#16232B] hover:text-[#16232B] transition-all duration-300"
            >
              <ArrowLeft size={13} />
              <span>Back to {categoryMeta?.name}</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ── Prev / Next navigation ── */}
      {(prevProduct || nextProduct) && (
        <section className="border-t border-[#EBE8E2] bg-[#F5F0EB]/40 py-10 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {prevProduct ? (
              <Link
                to={`/furniture/${category}/${prevProduct.id}`}
                className="group flex items-center space-x-3 text-xs font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors duration-200"
              >
                <ArrowLeft
                  size={13}
                  className="group-hover:-translate-x-0.5 transition-transform duration-200"
                />
                <div>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#C4B9A8] block">Previous</span>
                  <span className="font-mono text-sm text-[#16232B]">{prevProduct.sku}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextProduct && (
              <Link
                to={`/furniture/${category}/${nextProduct.id}`}
                className="group flex items-center space-x-3 text-xs font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors duration-200 text-right"
              >
                <div>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#C4B9A8] block">Next</span>
                  <span className="font-mono text-sm text-[#16232B]">{nextProduct.sku}</span>
                </div>
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </Link>
            )}
          </div>
        </section>
      )}

    </div>
  );
};
