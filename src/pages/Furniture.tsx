import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const Furniture: React.FC = () => (
  <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-start justify-center px-6 md:px-12 pt-36 pb-24 max-w-7xl mx-auto">
    <Link
      to="/"
      className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors mb-16"
    >
      <ArrowLeft size={13} />
      <span>Back to MADIO</span>
    </Link>
    <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium block mb-4" style={{ color: "var(--accent-furniture)" }}>
      Coming Soon
    </span>
    <h1 className="text-5xl md:text-7xl font-serif font-light text-[#16232B] leading-tight mb-6">
      MADIO Furniture
    </h1>
    <p className="text-sm text-[#6B6B6B] font-light leading-relaxed max-w-md">
      Design-led furniture for residential and hospitality projects. This vertical is currently in development.
    </p>
  </div>
);
