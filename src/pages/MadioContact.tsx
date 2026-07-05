import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

export const MadioContact: React.FC = () => (
  <div className="min-h-screen bg-[#FAFAF7] pt-36 pb-24 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">

      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans text-[#6B6B6B] hover:text-[#16232B] transition-colors mb-16"
      >
        <ArrowLeft size={13} />
        <span>Back to MADIO</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Left: headline + detail */}
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-sans font-medium block mb-5">
            Contact
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-[#16232B] leading-tight mb-8">
            Get in <span className="italic font-normal">touch</span>.
          </h1>
          <p className="text-sm text-[#6B6B6B] font-light leading-relaxed max-w-md mb-12">
            Whether you're specifying finishes, enquiring about furniture, or exploring a building products project — reach out and our team will connect you with the right vertical.
          </p>

          <div className="space-y-6 border-t border-[#EBE8E2] pt-10">
            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-[#F5F0EB] border border-[#EBE8E2] shrink-0">
                <Mail size={15} className="text-[#B8956A]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] font-sans block mb-0.5">
                  Email
                </span>
                <a
                  href="mailto:info@madio.in"
                  className="text-sm text-[#16232B] font-light hover:text-[#B8956A] transition-colors"
                >
                  info@madio.in
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-[#F5F0EB] border border-[#EBE8E2] shrink-0">
                <Phone size={15} className="text-[#B8956A]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] font-sans block mb-0.5">
                  Phone
                </span>
                <a href="tel:+919948601899" className="text-sm text-[#16232B] font-light hover:text-[#B8956A] transition-colors block">
                  +91 99486 01899
                </a>
                <a href="tel:+919948601599" className="text-sm text-[#16232B] font-light hover:text-[#B8956A] transition-colors block mt-0.5">
                  +91 99486 01599
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-[#F5F0EB] border border-[#EBE8E2] shrink-0">
                <MapPin size={15} className="text-[#B8956A]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] font-sans block mb-0.5">
                  Studio
                </span>
                <span className="text-sm text-[#16232B] font-light leading-relaxed block">
                  Shilpa Hills, Kondapur<br />
                  Hyderabad, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: vertical links */}
        <div className="bg-white border border-[#EBE8E2] p-8 md:p-12 shadow-sm">
          <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#16232B] mb-8">
            Enquire by vertical
          </h3>
          <div className="space-y-4">
            {[
              { path: "/",              label: "MADIO Furniture",          accent: "#B8956A", sub: "Design-led furniture" },
              { path: "/map/quote",     label: "MAP Finishes",             accent: "#B8956A", sub: "Architectural surface finishes" },
              { path: "/doors-windows", label: "MADIO Doors & Windows",    accent: "#B8956A", sub: "Fenestration systems" },
            ].map((v) => (
              <Link
                key={v.path}
                to={v.path}
                className="flex items-center justify-between p-5 border border-[#EBE8E2] hover:border-[#16232B] group transition-all duration-300"
              >
                <div>
                  <span
                    className="text-[9px] uppercase tracking-[0.2em] font-sans font-medium block mb-0.5"
                    style={{ color: v.accent }}
                  >
                    {v.sub}
                  </span>
                  <span className="text-sm font-serif font-light text-[#16232B] group-hover:text-[#B8956A] transition-colors">
                    {v.label}
                  </span>
                </div>
                <div
                  className="p-2 border transition-colors duration-300 group-hover:text-white"
                  style={{ borderColor: v.accent, color: v.accent }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-[10px] text-[#6B6B6B] font-light mt-8 leading-relaxed">
            For general enquiries, email <a href="mailto:info@madio.in" className="underline hover:text-[#B8956A] transition-colors">info@madio.in</a> and we'll route your message to the right team.
          </p>
        </div>

      </div>
    </div>
  </div>
);
