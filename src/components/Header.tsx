import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import mapLogo from "../assets/map-logo.png";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll listener fallback for height/style transitions
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/map", label: "Home" },
    { path: "/map/about", label: "About" },
    { path: "/map/products", label: "Collections" },
    { path: "/map/gallery", label: "Texture Gallery" },
    { path: "/map/stencils", label: "Stencils" },
    { path: "/map/colors", label: "Color Library" },
    { path: "/map/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "py-4 bg-[#FAFAF7]/90 backdrop-blur-md shadow-sm border-b border-[#EBE8E2]"
            : "py-7 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/map" className="select-none cursor-pointer shrink-0">
            <img
              src={mapLogo}
              alt="MAP"
              className="h-7 md:h-[34px] w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-[11px] font-sans tracking-[0.12em] uppercase font-light transition-all duration-300 hover:text-[#B8956A] relative pb-1 whitespace-nowrap ${
                    isActive
                      ? "text-[#B8956A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#B8956A]"
                      : "text-[#1A1A1A] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#B8956A] hover:after:w-full after:transition-all after:duration-300"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center space-x-6">
            <Link
              to="/map/quote"
              className="hidden lg:flex items-center space-x-2 border border-[#B8956A]/60 px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-sans text-[#1A1A1A] hover:bg-[#B8956A] hover:text-white hover:border-[#B8956A] transition-all duration-300"
            >
              <span>Request Quote</span>
              <ArrowRight size={14} />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#1A1A1A] hover:text-[#B8956A] transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#FAFAF7] transition-all duration-500 ease-in-out md:hidden flex flex-col justify-between ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="pt-32 px-10 flex flex-col space-y-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-2xl font-serif tracking-[0.1em] font-light transition-all duration-300 ${
                  isActive ? "text-[#B8956A] pl-4 border-l-2 border-[#B8956A]" : "text-[#1A1A1A]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/map/quote"
            className="inline-flex items-center justify-between border-b border-[#B8956A]/40 pb-2 text-base tracking-[0.2em] uppercase font-sans text-[#B8956A] pt-4"
          >
            <span>Request a Quote</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Mobile menu footer */}
        <div className="p-10 border-t border-[#EBE8E2] bg-[#F5F0EB]/60">
          <p className="text-xs text-[#1A1A1A] font-light">
            Kondapur, Hyderabad, India
          </p>
          <p className="text-xs text-[#1A1A1A] font-light mt-1">
            +91 99486 01899
          </p>
        </div>
      </div>
    </>
  );
};
