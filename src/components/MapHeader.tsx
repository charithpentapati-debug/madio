import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import mapLogo from "../assets/map-logo.png";

export const MapHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/map",          label: "Home" },
    { path: "/map/about",    label: "About" },
    { path: "/map/products", label: "Collections" },
    { path: "/map/gallery",  label: "Texture Gallery" },
    { path: "/map/stencils", label: "Stencils" },
    { path: "/map/colors",   label: "Color Library" },
    { path: "/contact?source=map",  label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled || isMobileMenuOpen
            ? "py-4 bg-[#FAFAF7]/95 backdrop-blur-md shadow-sm border-b border-[#EBE8E2]"
            : "py-7 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/map" className="select-none cursor-pointer shrink-0">
            <img src={mapLogo} alt="MAP" className="h-7 md:h-[34px] w-auto" />
          </Link>

          {/* Right Slot: Switcher, CTA, and Menu Toggle */}
          <div className="flex items-center space-x-6 md:space-x-8 shrink-0">
            {/* Switch Vertical dropdown */}
            <div className="hidden md:block relative group py-2 -my-2">
              <span className="text-[11px] tracking-[0.15em] uppercase font-sans text-[#6B6B6B] hover:text-[#B8956A] transition-colors cursor-pointer select-none">
                Switch Vertical
              </span>
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#FAFAF7] border border-[#EBE8E2] shadow-lg py-2 min-w-[200px] text-left">
                  <Link to="/" className="block px-5 py-2.5 text-[11px] font-sans tracking-[0.1em] uppercase font-light text-[#1A1A1A] hover:text-[#B8956A] hover:bg-[#F5F0EB]">
                    MADIO Furniture
                  </Link>
                  <Link to="/doors-windows" className="block px-5 py-2.5 text-[11px] font-sans tracking-[0.1em] uppercase font-light text-[#1A1A1A] hover:text-[#B8956A] hover:bg-[#F5F0EB]">
                    Doors &amp; Windows
                  </Link>
                </div>
              </div>
            </div>

            {/* Request Quote button */}
            <Link
              to="/contact?source=map"
              className="hidden md:flex items-center space-x-2 border border-[#B8956A]/60 px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-sans text-[#1A1A1A] hover:bg-[#B8956A] hover:text-white hover:border-[#B8956A] transition-all duration-300"
            >
              <span>Request Quote</span>
              <ArrowRight size={14} />
            </Link>

            {/* Hamburger Button (Always Visible) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1A1A1A] hover:text-[#B8956A] transition-colors focus:outline-none p-2 -mr-2"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Overlay Menu (Always Used) */}
      <div
        className={`fixed inset-0 z-40 bg-[#FAFAF7] transition-all duration-500 ease-in-out flex flex-col pt-24 md:pt-28 ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-6 md:px-20 py-8 flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 max-h-[80vh]">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/map"}
              className={({ isActive }) =>
                `text-2xl md:text-4xl font-serif tracking-[0.05em] font-light transition-all duration-300 ${
                  isActive ? "text-[#B8956A] border-b border-[#B8956A] pb-1" : "text-[#1A1A1A] hover:text-[#B8956A]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          
          <div className="pt-6 border-t border-[#EBE8E2] w-full max-w-xs flex flex-col space-y-3">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8956A] font-sans font-semibold">
              Other Verticals
            </span>
            <Link
              to="/"
              className="text-lg font-serif font-light text-[#1A1A1A] hover:text-[#B8956A] transition-colors"
            >
              MADIO Furniture
            </Link>
            <Link
              to="/doors-windows"
              className="text-lg font-serif font-light text-[#1A1A1A] hover:text-[#B8956A] transition-colors"
            >
              Doors &amp; Windows
            </Link>
          </div>
        </div>
        <div className="p-8 md:p-12 border-t border-[#EBE8E2] bg-[#F5F0EB]/60 shrink-0 text-center">
          <p className="text-xs text-[#1A1A1A] font-light">Kondapur, Hyderabad, India</p>
          <p className="text-xs text-[#1A1A1A] font-light mt-1">+91 99486 01899</p>
        </div>
      </div>
    </>
  );
};
