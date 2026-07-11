import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import madioLogo from "../assets/madio-logo.png";

const FURNITURE_ACCENT = "#B8956A";

export const FurnitureHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Light glass header, consistent with the site-wide light theme.
  const scrolledBg = isScrolled
    ? "bg-[#FAFAF7]/92 backdrop-blur-md border-b border-[#EBE8E2] shadow-sm"
    : "bg-[#FAFAF7]/70 backdrop-blur-sm";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolledBg}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

          {/* Compound wordmark: MADIO / Furniture */}
          <Link to="/" className="flex flex-col leading-none group">
            <img
              src={madioLogo}
              alt="MADIO Furniture"
              className="h-4 w-auto transition-opacity duration-300 group-hover:opacity-80"
            />
            <span
              className="text-[8px] tracking-[0.35em] uppercase font-sans font-medium mt-[3px]"
              style={{ color: FURNITURE_ACCENT }}
            >
              Furniture
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { to: "/",                  label: "All Furniture" },
              { to: "/contact?source=furniture", label: "Enquire"       },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#16232B]/75 hover:text-[#16232B] transition-colors duration-200"
              >
                {label}
              </Link>
            ))}

            {/* Switch Vertical dropdown */}
            <div className="relative group py-2 -my-2">
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#16232B]/75 hover:text-[#16232B] transition-colors cursor-pointer select-none">
                Switch Vertical
              </span>
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#FAFAF7] border border-[#EBE8E2] shadow-lg py-2 min-w-[200px] text-left">
                  <Link to="/map" className="block px-5 py-2.5 text-[11px] font-sans tracking-[0.1em] uppercase font-light text-[#1A1A1A] hover:text-[#B8956A] hover:bg-[#F5F0EB]">
                    MAP Finishes
                  </Link>
                  <Link to="/doors-windows" className="block px-5 py-2.5 text-[11px] font-sans tracking-[0.1em] uppercase font-light text-[#1A1A1A] hover:text-[#B8956A] hover:bg-[#F5F0EB]">
                    Doors &amp; Windows
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[#16232B]/80 hover:text-[#16232B] transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAFAF7]/98 backdrop-blur-md flex flex-col justify-between pt-24 px-10 pb-12">
          <div className="flex flex-col space-y-6 overflow-y-auto max-h-[75vh]">
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-medium" style={{ color: FURNITURE_ACCENT }}>
              MADIO Furniture
            </span>
            {[
              { to: "/",           label: "All Furniture" },
              { to: "/contact?source=furniture", label: "Enquire"       },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-2xl font-serif font-light text-[#16232B] hover:text-[#B8956A] transition-colors duration-300"
              >
                {label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-[#EBE8E2] flex flex-col space-y-3">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8956A] font-sans font-semibold">
                Other Verticals
              </span>
              <Link
                to="/map"
                className="text-lg font-serif font-light text-[#1A1A1A] hover:text-[#B8956A] transition-colors"
              >
                MAP Finishes
              </Link>
              <Link
                to="/doors-windows"
                className="text-lg font-serif font-light text-[#1A1A1A] hover:text-[#B8956A] transition-colors"
              >
                Doors &amp; Windows
              </Link>
            </div>
          </div>
          <div className="border-t border-[#EBE8E2] pt-6 bg-[#F5F0EB]/60 -mx-10 -mb-12 p-10">
            <p className="text-xs text-[#1A1A1A] font-light">Kondapur, Hyderabad, India</p>
            <p className="text-xs text-[#1A1A1A] font-light mt-1">info@madio.in</p>
          </div>
        </div>
      )}
    </>
  );
};
