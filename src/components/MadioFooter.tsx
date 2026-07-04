import React from "react";
import { Link } from "react-router-dom";
import madioLogoFull from "../assets/madio-logo-full.png";

export const MadioFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#16232B] text-[#FAFAF7] pt-16 pb-8 border-t border-[#243040]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">

        {/* Brand */}
        <div className="md:col-span-4 space-y-5">
          <Link to="/">
            <img
              src={madioLogoFull}
              alt="MADIO"
              className="h-8 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
          <p className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#3D4A2E] font-medium">
            MADIO Furniture | MAP | MADIO Doors &amp; Windows
          </p>
          <p className="text-xs text-[#8FA3B1] font-light leading-relaxed max-w-xs mt-2">
            A design-led house of brands developing premium furniture, architectural finishes, and building products.
          </p>
        </div>

        {/* Verticals */}
        <div className="md:col-span-3">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#3D4A2E] mb-5">
            Our Brands
          </h4>
          <ul className="space-y-3 text-xs text-[#8FA3B1] font-light">
            <li>
              <Link to="/furniture" className="hover:text-white transition-colors duration-300">
                MADIO Furniture
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-white transition-colors duration-300">
                MAP — Architectural Finishes
              </Link>
            </li>
            <li>
              <Link to="/doors-windows" className="hover:text-white transition-colors duration-300">
                MADIO Doors &amp; Windows
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-3 md:col-start-9">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#3D4A2E] mb-5">
            Contact
          </h4>
          <ul className="space-y-3 text-xs text-[#8FA3B1] font-light">
            <li>
              <a href="mailto:info@madio.in" className="hover:text-white transition-colors">
                info@madio.in
              </a>
            </li>
            <li>
              <a href="tel:+919948601899" className="hover:text-white transition-colors">
                +91 99486 01899
              </a>
            </li>
            <li>
              <a href="tel:+919948601599" className="hover:text-white transition-colors">
                +91 99486 01599
              </a>
            </li>
            <li className="pt-1 leading-relaxed">
              Shilpa Hills, Kondapur<br />Hyderabad, India
            </li>
          </ul>
          <Link
            to="/contact"
            className="inline-block mt-6 text-[10px] uppercase tracking-[0.2em] font-sans border border-[#3D4A2E] text-[#3D4A2E] px-4 py-2 hover:bg-[#3D4A2E] hover:text-white transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-[#243040] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#4A6070] font-light gap-3">
        <span>&copy; {currentYear} MADIO. All rights reserved.</span>
        <div className="flex items-center space-x-6">
          <span>Hyderabad, India</span>
          <a
            href="https://wa.me/919948601899"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#8FA3B1] transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
};
