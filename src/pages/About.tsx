import React from "react";
import { Link } from "react-router-dom";
import { Shield, Sparkles, Compass, MapPin } from "lucide-react";
import aboutHero from "../assets/products/exterior-stucco/4.jpeg";
import { usePageMeta } from "../hooks/usePageMeta";

export const About: React.FC = () => {
  usePageMeta(
    "About MAP | Premium Architectural Finishes & Decorative Surfaces",
    "Learn about MAP — India's premium decorative surfaces and architectural finishes brand."
  );

  return (
    <div className="texture-overlay min-h-screen pt-36 pb-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Title */}
        <div className="max-w-3xl mb-20 reveal-on-scroll">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-sans font-semibold block mb-4">
            Our Identity
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] leading-tight mb-8">
            Moving Beyond Coatings <br />
            To Create <span className="italic font-normal text-[#B8956A]">Architectural Surfaces</span>.
          </h1>
          <p className="text-base md:text-lg text-[#6B6B6B] font-light leading-relaxed">
            MAP (Premium Acrylic Paints) is an elite decorative surfaces brand. We do not sell paint buckets. We formulate high-performance plaster systems, microcements, and mineral washes designed to serve as organic extensions of architectural structures.
          </p>
        </div>

        {/* Large Brand Visual & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-28">
          <div className="lg:col-span-7 overflow-hidden reveal-on-scroll">
            <img
              src={aboutHero}
              alt="Exterior stucco architectural finish on a building facade"
              className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700 shadow-sm"
            />
          </div>
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll" style={{ transitionDelay: "0.2s" }}>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-[#1A1A1A]">
              Crafted in Hyderabad, <br />
              Spec'd <span className="italic font-normal text-[#B8956A]">Pan-India</span>.
            </h2>
            <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">
              Based in Hyderabad, MAP operates out of our state-of-the-art laboratory where chemical engineers and plaster artisans test raw minerals, limestone hydrates, and acrylic polymer emulsions. 
            </p>
            <p className="text-sm text-[#6B6B6B] font-light leading-relaxed">
              We supply our comprehensive systems nationwide, supporting luxury residential builds, commercial lobbies, and boutique hotels in Mumbai, Bangalore, Delhi, Chennai, and beyond.
            </p>
            <div className="pt-4 border-t border-[#EBE8E2] flex items-center space-x-3 text-[#1A1A1A]">
              <MapPin size={18} className="text-[#B8956A]" />
              <span className="text-xs uppercase tracking-widest font-sans font-medium">
                HQ: Shilpa Hills, Kondapur, Hyderabad
              </span>
            </div>
          </div>
        </div>

        {/* The Pillars / Strengths */}
        <div className="mb-28">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B8956A] font-sans font-medium block mb-3">
              Standard of Excellence
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A]">
              The Core Pillars of MAP
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pillar 1 */}
            <div className="bg-[#F5F0EB]/60 p-10 border border-[#EBE8E2] reveal-on-scroll flex flex-col items-start space-y-6">
              <div className="p-3 bg-white border border-[#EBE8E2]">
                <Shield size={20} className="text-[#B8956A]" />
              </div>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A]">
                Earthy Durability
              </h3>
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                By infusing quartz sand, crushed sea shell carbonates, and slaked lime hydrates, our finishes form chemical and physical bonds with the substrate, guaranteeing decades of crack-resistance and stability.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#F5F0EB]/60 p-10 border border-[#EBE8E2] reveal-on-scroll flex flex-col items-start space-y-6" style={{ transitionDelay: "0.15s" }}>
              <div className="p-3 bg-white border border-[#EBE8E2]">
                <Sparkles size={20} className="text-[#B8956A]" />
              </div>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A]">
                Bespoke Textures
              </h3>
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                We develop unique customized texture solutions for architecture firms. Whether a project calls for a raw, weathered volcanic crust or a highly polished, translucent gloss, our artisans formulate to spec.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#F5F0EB]/60 p-10 border border-[#EBE8E2] reveal-on-scroll flex flex-col items-start space-y-6" style={{ transitionDelay: "0.3s" }}>
              <div className="p-3 bg-white border border-[#EBE8E2]">
                <Compass size={20} className="text-[#B8956A]" />
              </div>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A]">
                Architect-Centric Support
              </h3>
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                We supply physical A4 texture boards, dwg/bim substrate specifications, and dispatch expert application consultants to site, ensuring final application matches the rendering perfectly.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-24 reveal-on-scroll">
          <span className="text-xs uppercase tracking-[0.2em] text-[#6B6B6B] block mb-4">Ready to specify MAP?</span>
          <Link
            to="/contact?source=map"
            className="inline-block px-12 py-4 bg-[#B8956A] text-white text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-[#1A1A1A] transition-colors duration-300"
          >
            Request Architectural Samples
          </Link>
        </div>

      </div>
    </div>
  );
};
