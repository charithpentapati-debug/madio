import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import madioLogo from "../assets/madio-logo.png";

const FURNITURE_ACCENT = "#3D4A2E";

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

  // All furniture pages have a dark hero/banner at the top
  // Unscrolled: transparent over dark bg → white text + inverted logo
  // Scrolled: navy glass → same treatment
  const scrolledBg = isScrolled
    ? "bg-[#16232B]/92 backdrop-blur-md border-b border-[#243040]/60 shadow-sm"
    : "bg-transparent";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolledBg}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

          {/* Compound wordmark: MADIO / Furniture */}
          <Link to="/furniture" className="flex flex-col leading-none group">
            <img
              src={madioLogo}
              alt="MADIO Furniture"
              className="h-4 w-auto transition-opacity duration-300 group-hover:opacity-80"
              style={{ filter: "brightness(0) invert(1)" }}
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
              { to: "/furniture",         label: "All Furniture" },
              { to: "/contact",           label: "Enquire"       },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-[10px] uppercase tracking-[0.2em] font-sans text-white/75 hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            ))}

            {/* Back to MADIO */}
            <Link
              to="/"
              className="text-[9px] uppercase tracking-[0.2em] font-sans font-medium border border-white/20 text-white/60 hover:border-white/60 hover:text-white px-3 py-1.5 transition-all duration-200"
            >
              ← MADIO
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#16232B]/98 backdrop-blur-md flex flex-col pt-20 px-8 pb-12">
          <div className="flex flex-col space-y-8 mt-4">
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-medium" style={{ color: FURNITURE_ACCENT }}>
              MADIO Furniture
            </span>
            {[
              { to: "/furniture",  label: "All Furniture" },
              { to: "/contact",    label: "Enquire"       },
              { to: "/",           label: "← MADIO"      },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-3xl font-serif font-light text-white hover:text-[#3D4A2E] transition-colors duration-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
