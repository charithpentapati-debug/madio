import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import madioLogo from "../assets/madio-logo.png";

export const MadioHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMapDrawerOpen, setIsMapDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMapDrawerOpen(false);
  }, [location]);

  const isMapPage = location.pathname.startsWith("/map");

  const navLinks = [
    { path: "/",              label: "MADIO Furniture" },
    { path: "/map",           label: "MAP" },
    { path: "/doors-windows", label: "MADIO Doors & Windows" },
    { path: "/contact?source=general",       label: "Contact" },
  ];

  // MAP vertical subpages
  const mapSubLinks = [
    { path: "/map/about",    label: "About" },
    { path: "/map/products", label: "Collections" },
    { path: "/map/gallery",  label: "Texture Gallery" },
    { path: "/map/stencils", label: "Stencils" },
    { path: "/map/colors",   label: "Color Library" },
    { path: "/contact?source=map",  label: "Contact" },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    const base =
      "text-[11px] font-sans tracking-[0.15em] uppercase font-light transition-all duration-300 relative pb-1 whitespace-nowrap " +
      "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[#B8956A] after:transition-all after:duration-300 ";
    return base + (isActive
      ? "text-[#B8956A] after:w-full"
      : "text-[#1A1A1A] hover:text-[#B8956A] after:w-0 hover:after:w-full");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "py-4 bg-[#FAFAF7]/95 backdrop-blur-md shadow-sm border-b border-[#EBE8E2]"
            : "py-6 bg-[#FAFAF7]/85 backdrop-blur-md border-b border-[#EBE8E2]/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo — dark wordmark on light contexts */}
          <Link to="/" className="select-none cursor-pointer shrink-0">
            <img
              src={madioLogo}
              alt="MADIO"
              className="h-6 md:h-7 w-auto transition-all duration-500"
            />
          </Link>

          {/* Desktop nav — standard way to choose vertical on every page */}
          <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-10 flex-1 justify-center">
            {navLinks.map((link) =>
              link.path === "/map" ? (
                <div key={link.path} className="relative group py-2 -my-2">
                  <NavLink to={link.path} end className={navLinkClass}>
                    {link.label}
                  </NavLink>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-[#FAFAF7] border border-[#EBE8E2] shadow-lg py-2 min-w-[180px]">
                      {mapSubLinks.map((sub) => (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          className={({ isActive }) =>
                            `block px-5 py-2.5 text-[11px] font-sans tracking-[0.1em] uppercase font-light transition-colors duration-200 ${
                              isActive ? "text-[#B8956A]" : "text-[#1A1A1A] hover:text-[#B8956A] hover:bg-[#F5F0EB]"
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={link.path} className="relative py-2 -my-2">
                  <NavLink to={link.path} end={link.path === "/"} className={navLinkClass}>
                    {link.label}
                  </NavLink>
                </div>
              )
            )}
          </nav>

          {/* Right slot: email (lg) + Map Hamburger + mobile toggle */}
          <div className="flex items-center space-x-6 shrink-0">
            <a
              href="mailto:info@madio.in"
              className="hidden xl:block text-[11px] tracking-[0.15em] uppercase font-sans transition-colors duration-300 text-[#6B6B6B] hover:text-[#B8956A]"
            >
              info@madio.in
            </a>

            {/* Desktop MAP Hamburger Button (only on MAP pages) */}
            {isMapPage && (
              <button
                onClick={() => setIsMapDrawerOpen(!isMapDrawerOpen)}
                className="hidden md:block transition-colors focus:outline-none text-[#1A1A1A] hover:text-[#B8956A] p-1"
                aria-label="Toggle MAP sub-menu"
                title="MAP Navigation"
              >
                <Menu size={22} />
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden transition-colors focus:outline-none text-[#1A1A1A] hover:text-[#B8956A]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu — always light cream */}
      <div
        className={`fixed inset-0 z-40 bg-[#FAFAF7] transition-all duration-500 ease-in-out md:hidden flex flex-col pt-20 ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-10 py-8 flex flex-col space-y-6">
          {navLinks.map((link) => (
            <div key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `text-3xl font-serif tracking-[0.06em] font-light transition-all duration-300 ${
                    isActive
                      ? "text-[#B8956A] pl-4 border-l-2 border-[#B8956A]"
                      : "text-[#1A1A1A] hover:text-[#B8956A]"
                  }`
                }
              >
                {link.label}
              </NavLink>
              {link.path === "/map" && (
                <div className="mt-4 ml-4 flex flex-col space-y-3">
                  {mapSubLinks.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={({ isActive }) =>
                        `text-sm font-sans uppercase tracking-[0.1em] font-light transition-colors duration-300 ${
                          isActive ? "text-[#B8956A]" : "text-[#6B6B6B] hover:text-[#B8956A]"
                        }`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-10 border-t border-[#EBE8E2] bg-[#F5F0EB]/60 shrink-0">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#B8956A] font-sans mb-2">
            MADIO Furniture | MAP | MADIO Doors &amp; Windows
          </p>
          <p className="text-xs text-[#6B6B6B] font-light mt-3">Kondapur, Hyderabad, India</p>
          <p className="text-xs text-[#6B6B6B] font-light mt-1">info@madio.in</p>
        </div>
      </div>

      {/* MAP Desktop Side Drawer (Slide-out menu for MAP subpages) */}
      <div 
        className={`fixed inset-0 z-50 overflow-hidden md:flex justify-end hidden transition-all duration-500 ${
          isMapDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrim */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={() => setIsMapDrawerOpen(false)}
        />
        {/* Drawer content */}
        <div 
          className={`relative w-[380px] h-full bg-[#FAFAF7] border-l border-[#EBE8E2] shadow-2xl p-12 flex flex-col justify-between z-10 transition-transform duration-500 ease-out ${
            isMapDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-16">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#B8956A] font-sans font-semibold">
                MAP Finishes
              </span>
              <button 
                onClick={() => setIsMapDrawerOpen(false)}
                className="text-[#1A1A1A] hover:text-[#B8956A] transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col space-y-6">
              {mapSubLinks.map((sub) => (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  className={({ isActive }) =>
                    `text-2xl font-serif tracking-wide font-light transition-all duration-300 ${
                      isActive ? "text-[#B8956A] pl-4 border-l-2 border-[#B8956A]" : "text-[#1A1A1A] hover:text-[#B8956A]"
                    }`
                  }
                >
                  {sub.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="border-t border-[#EBE8E2] pt-8">
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#B8956A] font-sans font-medium mb-1">
              Kondapur, Hyderabad
            </p>
            <p className="text-xs text-[#6B6B6B] font-light mt-2">info@madio.in</p>
            <p className="text-xs text-[#6B6B6B] font-light mt-1">+91 99486 01899</p>
          </div>
        </div>
      </div>
    </>
  );
};
