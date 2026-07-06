import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Globe, ArrowRight } from "lucide-react";
import mapLogo from "../assets/map-logo.png";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2C2C2C] text-[#FAFAF7] pt-20 pb-8 border-t border-[#3D3D3D]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        {/* Brand Column */}
        <div className="flex flex-col space-y-6">
          <div>
            <Link to="/">
              <img
                src={mapLogo}
                alt="MAP"
                className="h-[30px] w-auto brightness-0 invert"
              />
            </Link>
          </div>
          <p className="text-xs text-[#C4B9A8] font-light leading-relaxed max-w-sm">
            A luxury decorative surfaces and architectural finishes brand. Formulating elite mineral plasters, microcements, and textured paints designed to elevate architectural spaces.
          </p>
        </div>

        {/* Collections Quick Links */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#B8956A] mb-6">
            Key Collections
          </h4>
          <ul className="space-y-3 text-xs text-[#C4B9A8] font-light">
            <li>
              <Link to="/map/products?collection=cimento" className="hover:text-white transition-colors duration-300">
                Cimento (Microcement)
              </Link>
            </li>
            <li>
              <Link to="/map/products?collection=marbre" className="hover:text-white transition-colors duration-300">
                Marbre (Venetian Plaster)
              </Link>
            </li>
            <li>
              <Link to="/map/products?collection=matt-decor" className="hover:text-white transition-colors duration-300">
                Matt Decor (Colour Wash)
              </Link>
            </li>
            <li>
              <Link to="/map/products?collection=pearl-burst" className="hover:text-white transition-colors duration-300">
                Pearl Burst (Metallic Pearl)
              </Link>
            </li>
            <li>
              <Link to="/map/products?collection=metallics-2d" className="hover:text-white transition-colors duration-300">
                2D Metallics (Pearl Gloss)
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#B8956A] mb-6">
            Hyderabad HQ
          </h4>
          <ul className="space-y-3.5 text-xs text-[#C4B9A8] font-light">
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-[#B8956A] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                1st Floor, Road No.1, Plot No.25, Shilpa Hills, Kondapur, Hyderabad, Telangana 500084
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={14} className="text-[#B8956A] shrink-0" />
              <div className="flex flex-col">
                <a href="tel:+919948601899" className="hover:text-white transition-colors">
                  +91 99486 01899
                </a>
                <a href="tel:+919948601599" className="hover:text-white transition-colors">
                  +91 99486 01599
                </a>
              </div>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={14} className="text-[#B8956A] shrink-0" />
              <a href="mailto:info@madio.in" className="hover:text-white transition-colors">
                info@madio.in
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <Globe size={14} className="text-[#B8956A] shrink-0" />
              <a href="http://www.madio.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                www.madio.in
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter / Architect Updates */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#B8956A]">
            Architectural Updates
          </h4>
          <p className="text-xs text-[#C4B9A8] font-light leading-relaxed">
            Subscribe for catalog updates, texture releases, and technical documentation updates for architects & designers.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing. We will send updates to your inbox.");
            }}
            className="flex border-b border-[#3D3D3D] focus-within:border-[#B8956A] transition-colors duration-300 pb-2"
          >
            <input
              type="email"
              placeholder="Email address"
              required
              className="bg-transparent border-none text-xs text-white placeholder-[#6B6B6B] focus:ring-0 w-full focus:outline-none pr-3"
            />
            <button type="submit" className="text-[#B8956A] hover:text-white transition-colors" aria-label="Subscribe">
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-[#3D3D3D] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#6B6B6B] font-light">
        <div className="mb-4 md:mb-0">
          &copy; {currentYear} MAP (Premium Acrylic Paints). All rights reserved.
        </div>
        <div className="flex space-x-6">
          <span>Pan-India Supply</span>
          <span>HQ: Hyderabad</span>
          <a
            href="https://wa.me/919948601899"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B8956A] hover:underline"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </footer>
  );
};
