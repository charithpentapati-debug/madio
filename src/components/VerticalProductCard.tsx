import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

/**
 * Shared product card for vertical listing pages (Furniture, Doors & Windows, etc.).
 *
 * Commerce extension points are baked in but dormant in Phase 1:
 *   - `price`            → hidden when undefined; renders in the actions row when set
 *   - `primaryAction`    → "enquire" (default) renders a Link to enquireHref
 *                          "add-to-cart" renders a button that calls onPrimaryAction
 *   - `primaryActionLabel` → overrides the default label for either mode
 *
 * To enable commerce for a card: set primaryAction="add-to-cart", supply onPrimaryAction,
 * and set price. No JSX restructuring required.
 */

export type PrimaryAction = "enquire" | "add-to-cart";

export interface VerticalProductCardProps {
  /** Product image URL */
  image: string;
  imageAlt?: string;
  /** Small category/tag label above the name */
  category?: string;
  name: string;
  description: string;
  /** CSS color value for accent elements; defaults to MADIO olive */
  accent?: string;

  // ── Commerce extension (Phase 1: leave all undefined) ──────────────
  /** When set, renders in the card actions row. Undefined = no price shown. */
  price?: string;
  /** Drives the primary CTA. Default: "enquire". Switch to "add-to-cart" when ready. */
  primaryAction?: PrimaryAction;
  /** Overrides default label ("Enquire" or "Add to Cart") */
  primaryActionLabel?: string;
  /** Required when primaryAction="add-to-cart" */
  onPrimaryAction?: () => void;
  /** Required when primaryAction="enquire". Defaults to "/contact". */
  enquireHref?: string;
  // ───────────────────────────────────────────────────────────────────

  /** Optional secondary text link (e.g. "View Details") */
  detailHref?: string;
  detailLabel?: string;
}

export const VerticalProductCard: React.FC<VerticalProductCardProps> = ({
  image,
  imageAlt,
  category,
  name,
  description,
  accent = "var(--accent-madio)",
  price,
  primaryAction = "enquire",
  primaryActionLabel,
  onPrimaryAction,
  enquireHref = "/contact",
  detailHref,
  detailLabel = "View Details",
}) => {
  const ctaLabel =
    primaryActionLabel ?? (primaryAction === "add-to-cart" ? "Add to Cart" : "Enquire");

  return (
    <div className="bg-white border border-[#EBE8E2] hover:border-[#16232B]/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">

      {/* Image — if no src provided, render a branded placeholder */}
      <div className="h-64 overflow-hidden relative flex items-center justify-center" style={{ backgroundColor: image ? undefined : "#EBE8E2" }}>
        {image ? (
          <img
            src={image}
            alt={imageAlt ?? name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <>
            {/* TODO: client to provide licensed product photography */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, #B8956A 0, #B8956A 1px, transparent 0, transparent 50%)",
                backgroundSize: "20px 20px",
              }}
            />
            <p className="relative z-10 text-[9px] uppercase tracking-[0.2em] font-sans text-[#6B6B6B]">
              Photography coming soon
            </p>
          </>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-grow">
        {category && (
          <span
            className="text-[9px] tracking-[0.25em] uppercase font-sans font-medium block mb-2"
            style={{ color: accent }}
          >
            {category}
          </span>
        )}
        <h3 className="text-xl font-serif font-light text-[#16232B] mb-2 group-hover:text-[#B8956A] transition-colors duration-300">
          {name}
        </h3>
        <p className="text-xs text-[#6B6B6B] font-light leading-relaxed flex-grow">
          {description}
        </p>

        {/* Actions row */}
        <div className="mt-6 pt-4 border-t border-[#EBE8E2] flex items-center justify-between gap-4">
          {/* Price slot — hidden until commerce is enabled */}
          {price ? (
            <span className="text-sm font-serif text-[#16232B]">{price}</span>
          ) : (
            <span /> /* spacer keeps CTA right-aligned */
          )}

          <div className="flex items-center gap-3 shrink-0">
            {/* Secondary: detail link */}
            {detailHref && (
              <Link
                to={detailHref}
                className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors whitespace-nowrap"
              >
                {detailLabel}
              </Link>
            )}

            {/* Primary CTA — enquire (default) or add-to-cart */}
            {primaryAction === "add-to-cart" ? (
              <button
                type="button"
                onClick={onPrimaryAction}
                className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-white px-4 py-2.5 transition-all duration-300"
                style={{ backgroundColor: accent }}
              >
                <ShoppingBag size={11} />
                <span>{ctaLabel}</span>
              </button>
            ) : (
              <Link
                to={enquireHref}
                className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.2em] font-sans font-medium border px-4 py-2.5 transition-all duration-300 hover:text-white whitespace-nowrap"
                style={{
                  borderColor: accent,
                  color: accent,
                  // hover handled via group or inline — JS workaround not needed; Tailwind
                  // arbitrary group-hover won't work with CSS vars, so keep border+text only
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = accent as string;
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = accent as string;
                }}
              >
                <ArrowRight size={11} />
                <span>{ctaLabel}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
