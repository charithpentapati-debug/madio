import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
// Note: ampersand in filename is valid for Vite's static import resolver
import dwLogo from "../assets/Final_Doors&Windows_Logo.png";

export const DWHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Light glass header, consistent with the site-wide light theme.

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/doors-windows", label: "Systems",  end: true },
    { path: "/contact?source=doors-windows", label: "Enquire",  end: false },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-4 bg-[#FAFAF7]/92 backdrop-blur-md shadow-sm border-b border-[#EBE8E2]"
            : "py-7 bg-[#FAFAF7]/70 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* D&W logo */}
          <Link to="/doors-windows" className="select-none cursor-pointer shrink-0">
            <img
              src={dwLogo}
              alt="MADIO Doors & Windows"
              className="h-7 md:h-8 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-x-8 lg:gap-x-12 flex-1 justify-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  "text-[11px] font-sans tracking-[0.15em] uppercase font-light transition-all duration-300 relative pb-1 whitespace-nowrap " +
                  "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[#B8956A] after:transition-all after:duration-300 " +
                  (isActive
                    ? "text-[#16232B] after:w-full"
                    : "text-[#6B6B6B] hover:text-[#16232B] after:w-0 hover:after:w-full")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: back to MADIO + mobile toggle */}
          <div className="flex items-center space-x-6 shrink-0">
            <Link
              to="/"
              className="hidden lg:block text-[11px] tracking-[0.15em] uppercase font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors duration-300"
            >
              ← MADIO
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#16232B] hover:text-[#6B6B6B] transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#FAFAF7] transition-all duration-500 md:hidden flex flex-col justify-between ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="pt-28 px-10 flex flex-col space-y-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `text-3xl font-serif tracking-[0.06em] font-light transition-all duration-300 ${
                  isActive ? "text-[#16232B] pl-4 border-l-2 border-[#B8956A]" : "text-[#6B6B6B] hover:text-[#16232B]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/"
            className="text-3xl font-serif tracking-[0.06em] font-light text-[#6B6B6B] hover:text-[#16232B] transition-all duration-300"
          >
            MADIO
          </Link>
        </div>
        <div className="p-10 border-t border-[#EBE8E2]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#B8956A] font-sans mb-2">
            MADIO Doors &amp; Windows
          </p>
          <p className="text-xs text-[#6B6B6B] font-light mt-3">Shilpa Hills, Kondapur, Hyderabad</p>
          <p className="text-xs text-[#6B6B6B] font-light mt-1">info@madio.in</p>
        </div>
      </div>
    </>
  );
};
