import React, { useState } from "react";
import { X } from "lucide-react";

const stencilModules = import.meta.glob<{ default: string }>(
  "../assets/stencils/ASN*.png",
  { eager: true }
);

function resolveImg(code: string): string {
  const key = Object.keys(stencilModules).find((k) =>
    k.endsWith(`/${code}.png`)
  );
  return key ? stencilModules[key].default : "";
}

const STENCIL_CODES: string[] = [
  "ASN1","ASN2","ASN3","ASN4","ASN5","ASN6","ASN7","ASN8","ASN9","ASN10",
  "ASN11","ASN12","ASN13","ASN14","ASN15","ASN16","ASN17","ASN18","ASN19","ASN20",
  "ASN21","ASN22","ASN23","ASN24","ASN25","ASN26","ASN27","ASN28","ASN29","ASN30",
  "ASN31","ASN32","ASN33","ASN34","ASN35","ASN36","ASN37","ASN38","ASN39","ASN40",
  "ASN41","ASN42","ASN43","ASN44","ASN45","ASN46","ASN47","ASN48","ASN49","ASN50",
  "ASN51","ASN52","ASN53","ASN54","ASN55","ASN56","ASN57","ASN58","ASN59","ASN60",
  "ASN61","ASN62","ASN63","ASN64","ASN65","ASN66","ASN67","ASN68","ASN69","ASN70",
  "ASN71","ASN72","ASN73","ASN74","ASN75","ASN76",
  /* ASN77 does not exist — intentionally skipped */
  "ASN78","ASN79","ASN80",
  "ASN81","ASN82","ASN83","ASN84","ASN85","ASN86","ASN87","ASN88","ASN89","ASN90",
  "ASN91","ASN92","ASN93","ASN94","ASN95","ASN96","ASN97","ASN98","ASN99","ASN100",
  "ASN101","ASN102","ASN103","ASN104","ASN105","ASN106","ASN107","ASN108","ASN109",
  "ASN110","ASN111","ASN112",
];

const stencils = STENCIL_CODES.map((code) => ({ code, img: resolveImg(code) }));

export const Stencils: React.FC = () => {
  const [lightbox, setLightbox] = useState<{ code: string; img: string } | null>(null);

  return (
    <div className="texture-overlay min-h-screen pt-36 pb-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="max-w-3xl mb-16 reveal-on-scroll">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-sans font-semibold block mb-4">
            Stencil Library
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] mb-6 leading-tight">
            ASN <span className="italic font-normal text-[#B8956A]">Stencil Designs</span>
          </h1>
          <p className="text-sm md:text-base text-[#6B6B6B] font-light leading-relaxed">
            111 precision-cut stencil patterns available for use with MAP decorative surface systems. Each design is identified by its ASN code and can be specified alongside any MAP collection.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {stencils.map((s, i) => (
            <div
              key={s.code}
              onClick={() => setLightbox(s)}
              className="group cursor-pointer reveal-on-scroll"
              style={{
                transitionDelay: `${(i % 12) * 0.04}s`,
                transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {/* Card */}
              <div
                className="relative overflow-hidden rounded-[6px] border border-[#EBE8E2] bg-white/60 backdrop-blur-sm hover:border-[#B8956A]/50 hover:shadow-lg"
                style={{ transition: "border-color 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)" }}
              >
                <div className="aspect-square overflow-hidden bg-[#F5F0EB]/40">
                  <img
                    src={s.img}
                    alt={s.code}
                    loading="lazy"
                    className="w-full h-full object-contain p-2 group-hover:scale-110"
                    style={{ transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}
                  />
                </div>
                {/* Caption pill */}
                <div className="px-2 py-1.5 text-center">
                  <span className="text-[9px] tracking-[0.2em] uppercase font-sans font-medium text-[#B8956A]">
                    {s.code}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Count footer note */}
        <p className="mt-12 text-center text-[11px] text-[#6B6B6B] uppercase tracking-[0.2em] font-light">
          {stencils.length} designs available
        </p>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1A1A]/95 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative bg-[#FAFAF7] rounded-[8px] p-8 max-w-lg w-full flex flex-col items-center space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ backdropFilter: "blur(12px)" }}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 p-2 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <img
              src={lightbox.img}
              alt={lightbox.code}
              className="w-full max-h-[400px] object-contain"
            />
            <span className="text-sm tracking-[0.25em] uppercase font-sans font-medium text-[#B8956A]">
              {lightbox.code}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
