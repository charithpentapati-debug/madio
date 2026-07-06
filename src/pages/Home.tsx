import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { collectionsData } from "../data/collections";
import heroImg from "../assets/products/cimento/8.jpg";
import editorialMain from "../assets/products/exterior-stucco/2.jpeg";
import editorialDetail from "../assets/products/marbre/4.jpg";
import galleryImg1 from "../assets/products/cimento/3.jpg";
import galleryImg2 from "../assets/products/marbre/3.jpg";
import galleryImg3 from "../assets/products/exterior-stucco/3.jpeg";
import { usePageMeta } from "../hooks/usePageMeta";

export const Home: React.FC = () => {
  usePageMeta(
    "MAP | Premium Architectural Finishes & Decorative Surfaces",
    "MAP offers premium decorative surfaces, Venetian plasters, microcement systems, and luxury architectural finishes across India."
  );

  // Select 3 highlight collections for home page
  const highlightCollections = collectionsData.filter((c) =>
    ["cimento", "marbre", "metallics-2d", "oyster"].includes(c.id)
  );

  return (
    <div className="texture-overlay min-h-screen pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative h-[95vh] flex items-center justify-center bg-cream overflow-hidden">
        {/* Background Image with Dark/Warm Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Luxury architectural space with textured finishes"
            className="w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-[#1A1A1A]/35" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center text-white flex flex-col items-center">
          <div className="flex items-center space-x-2 border border-[#B8956A]/60 px-4 py-1.5 mb-8 animate-fade-in">
            <Sparkles size={12} className="text-[#B8956A]" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#EBE8E2]">
              Architectural Surfaces Brand
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-light tracking-wide leading-[1.1] mb-6 animate-fade-in-up">
            Sculpting Space <br />
            <span className="italic font-normal text-[#B8956A]">With Texture</span>
          </h1>

          <p className="text-sm md:text-lg tracking-wider font-light text-[#F5F0EB]/95 max-w-2xl mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Premium acrylic systems, microcements, and lime washes engineered for the discerning architect and luxury designer.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link
              to="/map/products"
              className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium bg-[#B8956A] text-white hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 shadow-md"
            >
              Explore Collections
            </Link>
            <Link
              to="/contact?source=map"
              className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-white text-white hover:bg-white hover:text-[#1A1A1A] transition-all duration-300"
            >
              Request Sample
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/60 animate-bounce">
          <span className="text-[9px] uppercase tracking-[0.25em] mb-2 font-sans font-light">Scroll Down</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* 2. EDITORIAL INTRO SECTION */}
      <section className="py-24 md:py-32 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 reveal-on-scroll">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B8956A] font-sans font-medium block mb-4">
              The MAP Philosophy
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-[#1A1A1A] leading-tight mb-8">
              Moving beyond paint to create <span className="italic font-normal text-[#B8956A]">architectural depth</span>.
            </h2>
            <p className="text-sm text-[#6B6B6B] font-light leading-relaxed mb-6">
              MAP is not a paint shop. We are a luxury architectural finishes brand that curates premium decorative surfaces which become an integral element of structural expression.
            </p>
            <p className="text-sm text-[#6B6B6B] font-light leading-relaxed mb-8">
              We collaborate closely with leading architects and interior designers across India, providing them with bespoke materials that yield seamless walls, monolithic concrete floors, and organic lime washes of unmatched quality.
            </p>
            <Link
              to="/map/about"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#1A1A1A] hover:text-[#B8956A] transition-colors group"
            >
              <span>Our Story</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-12 gap-4 items-center reveal-on-scroll" style={{ transitionDelay: "0.2s" }}>
            <div className="col-span-8 overflow-hidden">
              <img
                src={editorialMain}
                alt="Exterior stucco architectural finish"
                className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-4 overflow-hidden relative -left-8 top-12 shadow-xl border-4 border-[#FAFAF7]">
              <img
                src={editorialDetail}
                alt="Marbre plaster texture detail"
                className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS */}
      <section className="py-24 md:py-32 bg-[#F5F0EB]/60 border-t border-[#EBE8E2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 reveal-on-scroll">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#B8956A] font-sans font-medium block mb-4">
                Curated Materials
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-light text-[#1A1A1A]">
                The Signature Collections
              </h2>
            </div>
            <Link
              to="/map/products"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#1A1A1A] hover:text-[#B8956A] transition-colors mt-6 md:mt-0 group"
            >
              <span>View All Collections</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {/* Grid of Highlighted Collections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {highlightCollections.map((col, index) => (
              <div
                key={col.id}
                className="bg-[#FAFAF7] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#EBE8E2] reveal-on-scroll flex flex-col justify-between group"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div>
                  <div className="h-[280px] overflow-hidden relative">
                    <img
                      src={col.image}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 text-[10px] tracking-widest uppercase font-sans text-[#1A1A1A]">
                      {col.shadesCount}
                    </div>
                  </div>
                  <div className="p-8 md:p-10">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#B8956A] font-sans font-semibold mb-2 block">
                      {col.tagline}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif font-light text-[#1A1A1A] mb-4">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                      {col.description.slice(0, 160)}...
                    </p>
                  </div>
                </div>
                <div className="px-8 pb-8 pt-0">
                  <Link
                    to={`/products?collection=${col.id}`}
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#1A1A1A] hover:text-[#B8956A] transition-colors font-medium border-b border-[#1A1A1A] hover:border-[#B8956A] pb-1"
                  >
                    <span>View Specifications</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TEXTURE GALLERY PEEK */}
      <section className="py-24 md:py-32 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16 reveal-on-scroll">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#B8956A] font-sans font-medium block mb-4">
            Visual Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-[#1A1A1A] max-w-2xl mx-auto leading-tight">
            Seamless Textures in Luxury Settings
          </h2>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="h-[450px] overflow-hidden group relative reveal-on-scroll">
            <img
              src={galleryImg1}
              alt="Cimento microcement finish"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-[#1A1A1A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#B8956A] font-medium">Cimento System</span>
              <p className="text-lg font-serif font-light tracking-wide mt-1">Minimalist Concrete Lounge</p>
            </div>
          </div>

          <div className="h-[450px] overflow-hidden group relative reveal-on-scroll" style={{ transitionDelay: "0.15s" }}>
            <img
              src={galleryImg2}
              alt="Marbre Venetian plaster finish"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-[#1A1A1A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#B8956A] font-medium">Marbre</span>
              <p className="text-lg font-serif font-light tracking-wide mt-1">Venetian Plaster Finish</p>
            </div>
          </div>

          <div className="h-[450px] overflow-hidden group relative reveal-on-scroll" style={{ transitionDelay: "0.3s" }}>
            <img
              src={galleryImg3}
              alt="Exterior stucco facade finish"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-[#1A1A1A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#B8956A] font-medium">Exterior Stucco</span>
              <p className="text-lg font-serif font-light tracking-wide mt-1">Architectural Facade Plaster</p>
            </div>
          </div>
        </div>

        <div className="text-center reveal-on-scroll">
          <Link
            to="/map/gallery"
            className="inline-block border border-[#1A1A1A] px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
          >
            Enter Full Gallery
          </Link>
        </div>
      </section>

      {/* 5. LUXURY QUOTE CTA SECTION */}
      <section className="py-24 md:py-32 bg-[#C4B9A8] text-[#16232B] relative overflow-hidden">
        {/* Abstract Gold Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B8956A]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center reveal-on-scroll">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-sans font-semibold mb-6 block">
            Collaborate With Us
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-8">
            Elevate Your Next <br />
            <span className="italic font-normal text-[#B8956A]">Architectural Narrative</span>
          </h2>
          <p className="text-xs md:text-sm text-[#6B6B6B] font-light leading-relaxed max-w-2xl mx-auto mb-12">
            Are you planning a residential estate, a premium boutique store, or a high-end commercial lobby? Request physical texture boards, custom shade swatches, or schedule a technical consultation with our Hyderabad design advisors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?source=map"
              className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium bg-[#B8956A] text-white hover:bg-[#16232B] hover:text-white transition-all duration-300"
            >
              Request a Quote
            </Link>
            <Link
              to="/contact?source=map"
              className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-[#16232B] text-[#16232B] hover:border-[#B8956A] hover:text-[#B8956A] transition-all duration-300"
            >
              Contact HQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
