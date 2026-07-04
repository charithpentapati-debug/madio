import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  furnitureCategories,
  getProductsByCategory,
  isFurnitureCategoryId,
} from "../data/furniture";
import type { FurnitureProduct } from "../data/furniture";

const FURNITURE_ACCENT = "#3D4A2E";

// Product card for the listing grid
const ProductCard: React.FC<{ product: FurnitureProduct; categoryId: string }> = ({
  product,
  categoryId,
}) => {
  const imgSrc = product.images[0];
  return (
  <Link
    to={`/furniture/${categoryId}/${product.id}`}
    className="group flex flex-col overflow-hidden border border-[#EBE8E2] bg-white hover:border-[#3D4A2E]/30 transition-all duration-400 reveal-on-scroll"
  >
    {/* Image — real photo when available, placeholder otherwise */}
    <div
      className="relative h-44 overflow-hidden shrink-0"
      style={{ backgroundColor: "#16232B" }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
          <span className="absolute bottom-3 left-3 text-[9px] font-mono text-[#4A6070] tracking-wider">
            {product.sku}
          </span>
        </>
      )}
      <div className="absolute inset-0 bg-[#3D4A2E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </div>

    {/* Card body */}
    <div className="p-4 flex flex-col flex-grow">
      {product.subcategory && (
        <span
          className="text-[8px] uppercase tracking-[0.25em] font-sans font-medium mb-1"
          style={{ color: FURNITURE_ACCENT }}
        >
          {product.subcategory}
        </span>
      )}
      <p className="text-sm font-serif font-light text-[#16232B] group-hover:text-[#3D4A2E] transition-colors duration-300 mb-auto">
        {product.name}
      </p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#EBE8E2]">
        <span className="text-[8px] uppercase tracking-[0.2em] font-sans text-[#6B6B6B]">
          View Details
        </span>
        <ArrowRight
          size={11}
          className="text-[#3D4A2E] group-hover:translate-x-0.5 transition-transform duration-300"
        />
      </div>
    </div>
  </Link>
  );
};

// Coming soon state for un-populated categories
const ComingSoonState: React.FC<{ name: string }> = ({ name }) => (
  <div className="py-32 text-center">
    <div
      className="w-8 h-[2px] mx-auto mb-8"
      style={{ backgroundColor: FURNITURE_ACCENT }}
    />
    <h2 className="text-3xl font-serif font-light text-[#16232B] mb-4">
      {name}
    </h2>
    <p className="text-sm text-[#6B6B6B] font-light max-w-xs mx-auto mb-10 leading-relaxed">
      This collection is being prepared. Enquire below and we'll get in touch when it's available.
    </p>
    <Link
      to="/contact"
      className="inline-flex items-center space-x-2 px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: FURNITURE_ACCENT }}
    >
      <span>Enquire</span>
      <ArrowRight size={12} />
    </Link>
  </div>
);

export const FurnitureCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  // Unknown slug → redirect to landing
  if (!category || !isFurnitureCategoryId(category)) {
    return <Navigate to="/furniture" replace />;
  }

  const meta = furnitureCategories.find((c) => c.id === category);
  const products = getProductsByCategory(category);

  // Group beds by subcategory for clearer listing
  const beds = products.filter((p) => p.subcategory === "bed");
  const bedsides = products.filter((p) => p.subcategory === "bedside");
  const ungrouped = products.filter((p) => !p.subcategory);

  return (
    <div className="bg-[#FAFAF7]">

      {/* ── Dark header banner ── */}
      <section className="relative bg-[#16232B] pt-32 pb-14 px-6 md:px-12 overflow-hidden">
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
            to="/furniture"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#8FA3B1] hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={13} />
            <span>All Furniture</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-3"
                style={{ color: FURNITURE_ACCENT }}
              >
                MADIO Furniture
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-light text-white leading-tight">
                {meta?.name}
              </h1>
            </div>
            {meta?.isPopulated && (
              <span className="text-xs font-sans text-[#8FA3B1] font-light pb-1">
                {products.length} piece{products.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {meta?.description && (
            <p className="text-sm text-[#8FA3B1] font-light leading-relaxed max-w-xl mt-4">
              {meta.description}
            </p>
          )}
        </div>
      </section>

      {/* ── Content area ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">

        {!meta?.isPopulated ? (
          // Un-populated category: coming soon
          <ComingSoonState name={meta?.name ?? ""} />
        ) : (
          <>
            {/* Catalogue note — explains placeholder state honestly */}
            <div className="bg-[#F5F0EB] border border-[#EBE8E2] px-6 py-4 mb-10 flex items-start space-x-3">
              <div
                className="w-[2px] h-10 shrink-0 mt-0.5"
                style={{ backgroundColor: FURNITURE_ACCENT }}
              />
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                Product photography and full specifications are being finalised. Browse reference codes below — our team can share detailed lookbooks and samples on request.
              </p>
            </div>

            {/* Bed frames */}
            {beds.length > 0 && (
              <section className="mb-14">
                <h2
                  className="text-xs uppercase tracking-[0.25em] font-sans font-medium mb-6 flex items-center space-x-3"
                  style={{ color: FURNITURE_ACCENT }}
                >
                  <span>Bed Frames</span>
                  <span className="text-[#C4B9A8]">— {beds.length}</span>
                </h2>
                {/* TODO: add pagination when product count warrants it */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {beds.map((p) => (
                    <ProductCard key={p.id} product={p} categoryId={category} />
                  ))}
                </div>
              </section>
            )}

            {/* Bedside tables */}
            {bedsides.length > 0 && (
              <section className="mb-14 pt-8 border-t border-[#EBE8E2]">
                <h2
                  className="text-xs uppercase tracking-[0.25em] font-sans font-medium mb-6 flex items-center space-x-3"
                  style={{ color: FURNITURE_ACCENT }}
                >
                  <span>Bedside Tables</span>
                  <span className="text-[#C4B9A8]">— {bedsides.length}</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {bedsides.map((p) => (
                    <ProductCard key={p.id} product={p} categoryId={category} />
                  ))}
                </div>
              </section>
            )}

            {/* Ungrouped products (future categories) */}
            {ungrouped.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ungrouped.map((p) => (
                  <ProductCard key={p.id} product={p} categoryId={category} />
                ))}
              </div>
            )}

            {/* CTA strip */}
            <div className="border-t border-[#EBE8E2] mt-16 pt-10 flex flex-col sm:flex-row gap-4 items-start">
              <Link
                to={`/contact?category=${category}`}
                className="inline-flex items-center space-x-2 px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: FURNITURE_ACCENT }}
              >
                {/* Commerce extension point: when e-commerce is enabled, add "Shop Now" /
                    cart action here. product.price is already typed — just populate when ready. */}
                <span>Request a Quote</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                to="/furniture"
                className="inline-flex items-center space-x-2 px-8 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-[#EBE8E2] text-[#6B6B6B] hover:border-[#16232B] hover:text-[#16232B] transition-all duration-300"
              >
                <ArrowLeft size={13} />
                <span>All Categories</span>
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
