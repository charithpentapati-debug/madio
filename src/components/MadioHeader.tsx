import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import madioLogo from "../assets/madio-logo.png";

export const MadioHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Home page hero has a dark navy overlay — header must render white even when transparent.
  // All other MADIO pages (Furniture, DoorsWindows, Contact) have a light background.
  const isHome = location.pathname === "/";

  // Header visually "dark" when: on home before scroll (transparent over dark hero) OR when
  // the glassmorphic navy bar has kicked in on any page.
  const onDark = (isHome && !isScrolled) || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/furniture",     label: "MADIO Furniture" },
    { path: "/map",           label: "MAP" },
    { path: "/doors-windows", label: "MADIO Doors & Windows" },
    { path: "/contact",       label: "Contact" },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    const base =
      "text-[11px] font-sans tracking-[0.15em] uppercase font-light transition-all duration-300 relative pb-1 whitespace-nowrap " +
      "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[#3D4A2E] after:transition-all after:duration-300 ";
    if (onDark) {
      return base + (isActive
        ? "text-white after:w-full"
        : "text-[#8FA3B1] hover:text-white after:w-0 hover:after:w-full");
    }
    return base + (isActive
      ? "text-[#16232B] after:w-full"
      : "text-[#6B6B6B] hover:text-[#16232B] after:w-0 hover:after:w-full");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "py-4 bg-[#16232B]/92 backdrop-blur-md shadow-sm border-b border-[#243040]"
            : "py-7 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo — dark wordmark, inverted to white on dark contexts */}
          <Link to="/" className="select-none cursor-pointer shrink-0">
            <img
              src={madioLogo}
              alt="MADIO"
              className="h-6 md:h-7 w-auto transition-all duration-500"
              style={{ filter: onDark ? "brightness(0) invert(1)" : "none" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-10 flex-1 justify-center">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} end={link.path === "/"} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right slot: email (lg) + mobile toggle */}
          <div className="flex items-center space-x-6 shrink-0">
            <a
              href="mailto:info@madio.in"
              className={`hidden xl:block text-[11px] tracking-[0.15em] uppercase font-sans transition-colors duration-300 ${
                onDark ? "text-[#8FA3B1] hover:text-white" : "text-[#6B6B6B] hover:text-[#16232B]"
              }`}
            >
              info@madio.in
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden transition-colors focus:outline-none ${
                onDark ? "text-white hover:text-[#8FA3B1]" : "text-[#16232B] hover:text-[#6B6B6B]"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu — always dark navy */}
      <div
        className={`fixed inset-0 z-40 bg-[#16232B] transition-all duration-500 ease-in-out md:hidden flex flex-col justify-between ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="pt-28 px-10 flex flex-col space-y-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-3xl font-serif tracking-[0.06em] font-light transition-all duration-300 ${
                  isActive
                    ? "text-white pl-4 border-l-2 border-[#3D4A2E]"
                    : "text-[#8FA3B1] hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="p-10 border-t border-[#243040]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#3D4A2E] font-sans mb-2">
            MADIO Furniture | MAP | MADIO Doors &amp; Windows
          </p>
          <p className="text-xs text-[#8FA3B1] font-light mt-3">Kondapur, Hyderabad, India</p>
          <p className="text-xs text-[#8FA3B1] font-light mt-1">info@madio.in</p>
        </div>
      </div>
    </>
  );
};
