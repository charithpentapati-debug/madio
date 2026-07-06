import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Settings } from "lucide-react";
import { collectionsData } from "../data/collections";
import { usePageMeta } from "../hooks/usePageMeta";

const hasValue = (v: string) => v.trim() !== "" && v.trim().toLowerCase() !== "todo";

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCollectionId = searchParams.get("collection");

  // If a collection is selected, find its data
  const activeCollection = collectionsData.find(
    (c) => c.id === activeCollectionId
  );

  usePageMeta(
    activeCollection
      ? `${activeCollection.name} | MAP Collections`
      : "MAP Collections | Premium Architectural Finishes & Decorative Surfaces",
    activeCollection?.description ??
      "Explore MAP's collections of premium decorative surfaces, Venetian plasters, and microcement systems."
  );

  // Scroll to top when active collection changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCollectionId]);

  const selectCollection = (id: string | null) => {
    if (id) {
      setSearchParams({ collection: id });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="texture-overlay min-h-screen pt-36 pb-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {activeCollection ? (
          /* ==========================================
             COLLECTION DETAIL VIEW (SUB-PAGE)
             ========================================== */
          <div className="reveal-on-scroll">
            {/* Back Button */}
            <button
              onClick={() => selectCollection(null)}
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-12 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to All Collections</span>
            </button>

            {/* Title Block */}
            <div className="max-w-3xl mb-16">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-sans font-semibold block mb-4">
                Collection Profile
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] mb-4">
                {activeCollection.name}
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] text-[#B8956A] font-sans font-medium border-b border-[#EBE8E2] pb-6">
                {activeCollection.tagline}{hasValue(activeCollection.shadesCount) ? ` — ${activeCollection.shadesCount}` : ""}
              </p>
            </div>

            {/* Gallery + Tech Specs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 items-start">
              {/* Product Visual */}
              <div className="lg:col-span-6 flex flex-col space-y-6">
                <div className="h-[480px] overflow-hidden">
                  <img
                    src={activeCollection.image}
                    alt={activeCollection.name}
                    className="w-full h-full object-cover shadow-sm hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-[180px] overflow-hidden">
                    <img
                      src={activeCollection.textureImage}
                      alt={`${activeCollection.name} texture closeup`}
                      className="w-full h-full object-cover grayscale brightness-95"
                    />
                  </div>
                  <div className="bg-[#F5F0EB]/60 p-6 flex flex-col justify-between border border-[#EBE8E2]">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#6B6B6B] font-medium block">
                      Need custom boards?
                    </span>
                    <p className="text-xs text-[#6B6B6B] font-light mt-1">
                      We courier customized physical mock-up boards to architecture offices nationwide.
                    </p>
                    <Link
                      to={`/contact?source=map&collection=${activeCollection.id}`}
                      className="text-xs font-semibold text-[#B8956A] hover:underline uppercase tracking-wider mt-3 inline-block"
                    >
                      Order Samples &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Description & Technical Specifications */}
              <div className="lg:col-span-6 space-y-10">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#1A1A1A] mb-4">
                    Overview
                  </h3>
                  <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">
                    {activeCollection.description}
                  </p>
                </div>

                {(() => {
                  const s = activeCollection.specs;
                  const rows = [
                    { label: "Application",           value: s.application },
                    { label: "Application Thickness", value: s.thickness },
                    { label: "Compatible Substrate",  value: s.substrate },
                    { label: "Average Coverage",      value: s.coverage },
                    { label: "VOC Rating",            value: s.voc },
                    { label: "Package Sizes",         value: s.packageSizes },
                    { label: "Recommended Tools",     value: s.recommendedTools },
                  ].filter((r) => hasValue(r.value));
                  if (rows.length === 0) return null;
                  return (
                    <div className="border-t border-[#EBE8E2] pt-8">
                      <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#1A1A1A] mb-6 flex items-center space-x-2">
                        <Settings size={14} className="text-[#B8956A]" />
                        <span>Technical Specification</span>
                      </h3>
                      <div className="space-y-4 text-xs">
                        {rows.map((row, i) => (
                          <div
                            key={row.label}
                            className={`grid grid-cols-3 pb-3.5 ${i < rows.length - 1 ? "border-b border-[#EBE8E2]" : ""}`}
                          >
                            <span className="text-[#6B6B6B] font-light">{row.label}</span>
                            <span className="col-span-2 text-[#1A1A1A] font-medium pl-4 leading-relaxed">
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {/* Commerce extension point: when e-commerce is enabled, replace this Link
                      with an "Add to Cart" button (onAddToCart handler + activeCollection.price).
                      The price field is already typed on Collection; label/action swap only. */}
                  <Link
                    to={`/contact?source=map&collection=${activeCollection.id}`}
                    className="flex-1 bg-[#1A1A1A] text-white text-center py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-[#B8956A] transition-all duration-300"
                  >
                    Request Quote for {activeCollection.name}
                  </Link>
                  <Link
                    to="/map/colors"
                    className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] text-center py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
                  >
                    View Color Swatches
                  </Link>
                </div>
              </div>
            </div>

            {/* Colors Peek Section */}
            <div className="border-t border-[#EBE8E2] pt-16">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-light text-[#1A1A1A]">
                    Shade Library Preview
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-1 font-light">
                    Range of colors available for the {activeCollection.name} collection.
                  </p>
                </div>
                <Link
                  to="/map/colors"
                  className="text-xs uppercase tracking-[0.15em] font-sans text-[#B8956A] hover:underline font-medium"
                >
                  View Full Library &rarr;
                </Link>
              </div>

              {/* Swatch grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {activeCollection.shades.slice(0, 12).map((shade) => (
                  <div
                    key={shade.code}
                    className="bg-white p-3 border border-[#EBE8E2] flex flex-col space-y-3 shadow-sm"
                  >
                    <div
                      className="h-28 w-full border border-black/5"
                      style={{ backgroundColor: shade.hex }}
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-mono text-[#B8956A] block">
                        {shade.code}
                      </span>
                      <span className="text-xs text-[#1A1A1A] font-medium block truncate mt-0.5">
                        {shade.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ==========================================
             COLLECTIONS GRID VIEW (MAIN PRODUCTS LIST)
             ========================================== */
          <div className="reveal-on-scroll">
            {/* Header Text */}
            <div className="max-w-3xl mb-16">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-sans font-semibold block mb-4">
                Architectural Finishes
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] mb-6 leading-tight">
                The MAP <span className="italic font-normal text-[#B8956A]">Collections</span>
              </h1>
              <p className="text-sm md:text-base text-[#6B6B6B] font-light leading-relaxed">
                Explore our official architectural coating systems — premium interiors, facade treatments, concrete installations, and luxury metallic reflections.
              </p>
            </div>

            {/* Grid of 10 Collections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collectionsData.map((col) => (
                <div
                  key={col.id}
                  className="bg-white border border-[#EBE8E2] hover:border-[#B8956A]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Collection Image */}
                    <div className="h-60 overflow-hidden relative">
                      <img
                        src={col.image}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-3 right-3 bg-[#1A1A1A]/95 text-white text-[9px] tracking-widest uppercase font-sans px-3 py-1 font-light">
                        {col.shadesCount}
                      </div>
                    </div>

                    {/* Collection Info */}
                    <div className="p-8">
                      <span className="text-[9px] tracking-[0.25em] uppercase text-[#B8956A] font-sans font-semibold mb-2 block">
                        {col.tagline}
                      </span>
                      <h3 className="text-2xl font-serif font-light text-[#1A1A1A] mb-3 group-hover:text-[#B8956A] transition-colors duration-300">
                        {col.name}
                      </h3>
                      <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                        {col.description.slice(0, 130)}...
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-8 pb-8 pt-0 flex items-center justify-between border-t border-[#FAFAF7] mt-2">
                    <span className="text-[10px] font-mono text-[#6B6B6B] tracking-wider">
                      {col.shadePrefix}
                    </span>
                    <button
                      onClick={() => selectCollection(col.id)}
                      className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#1A1A1A] hover:text-[#B8956A] transition-colors group/btn cursor-pointer"
                    >
                      <span>Details</span>
                      <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
