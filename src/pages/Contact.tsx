import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle, Sparkles, ChevronDown } from "lucide-react";
import { usePageMeta } from "../hooks/usePageMeta";

export const Contact: React.FC = () => {
  usePageMeta(
    "Contact MADIO | Furniture, Architectural Finishes & Doors",
    "Get in touch with MADIO — reach our Furniture, MAP Finishes, or Doors & Windows teams."
  );

  const [searchParams] = useSearchParams();
  const sourceParam = searchParams.get("source") || "";
  const categoryParam = searchParams.get("category") || "";
  const productParam = searchParams.get("product") || "";
  const collectionParam = searchParams.get("collection") || "";
  const systemParam = searchParams.get("system") || "";

  // Map source parameter to default interestedIn value
  let defaultInterest = "General";
  if (sourceParam === "furniture") defaultInterest = "Furniture";
  else if (sourceParam === "map") defaultInterest = "MAP Finishes";
  else if (sourceParam === "doors-windows") defaultInterest = "Doors & Windows";

  // Pre-filled message context
  let initialMessage = "";
  if (sourceParam === "furniture") {
    initialMessage = "Enquiry regarding MADIO Furniture";
    if (categoryParam) initialMessage += ` (Category: ${categoryParam})`;
    if (productParam) initialMessage += `, Product Code: ${productParam}`;
    initialMessage += ".\n\n";
  } else if (sourceParam === "map") {
    initialMessage = "Enquiry regarding MAP Finishes";
    if (collectionParam) initialMessage += ` (Collection: ${collectionParam})`;
    initialMessage += ".\n\n";
  } else if (sourceParam === "doors-windows") {
    initialMessage = "Enquiry regarding MADIO Doors & Windows";
    if (systemParam) initialMessage += ` (System: ${systemParam})`;
    initialMessage += ".\n\n";
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Architectural Consultation",
    interestedIn: defaultInterest,
    message: initialMessage,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("MADIO Contact Form Inquiry Submitted:", formData);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      {/* ── Dark Overlay Hero Section ── */}
      <section className="relative h-[60vh] flex items-center justify-center bg-[#1A1A1A] overflow-hidden">
        {/* Background/Texture Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #B8956A 0, #B8956A 1px, transparent 0, transparent 50%)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-[#1A1A1A]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center text-white flex flex-col items-center">
          <div className="flex items-center space-x-2 border border-[#B8956A]/60 px-4 py-1.5 mb-6 animate-fade-in">
            <Sparkles size={12} className="text-[#B8956A]" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#EBE8E2]">
              Contact HQ
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-wide leading-tight mb-6 animate-fade-in-up">
            Get in <span className="italic font-normal text-[#B8956A]">touch</span>
          </h1>

          <p className="text-sm md:text-base tracking-wider font-light text-[#F5F0EB]/90 max-w-2xl mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Have questions about furniture customisations, architectural finishes, window systems, or specifications? Complete our contact form or reach out directly to our Hyderabad showroom unit.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a
              href="#form-section"
              className="w-full sm:w-auto px-10 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium bg-[#B8956A] text-white hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 shadow-md text-center"
            >
              Enquire Now
            </a>
            <a
              href="https://wa.me/919948601899"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium border border-white text-white hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 text-center"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/50 animate-bounce">
          <span className="text-[9px] uppercase tracking-[0.25em] mb-2 font-sans font-light">Scroll Down</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* ── Form Section ── */}
      <section id="form-section" className="max-w-7xl mx-auto px-6 md:px-12 py-24 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Details Column (Left) */}
          <div className="lg:col-span-5 space-y-12 reveal-on-scroll">
            
            {/* Direct Details */}
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-light text-[#1A1A1A] border-b border-[#EBE8E2] pb-4">
                Office Information
              </h2>
              
              <div className="space-y-6 text-sm font-light">
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <MapPin size={20} className="text-[#B8956A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-[#6B6B6B] tracking-wider block font-sans font-semibold mb-1">
                      HQ Address
                    </span>
                    <p className="text-[#1A1A1A] leading-relaxed">
                      1st Floor, Road No.1, Plot No.25, Shilpa Hills, Kondapur, Hyderabad, Telangana 500084
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <Phone size={18} className="text-[#B8956A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-[#6B6B6B] tracking-wider block font-sans font-semibold mb-1">
                      Contact Numbers
                    </span>
                    <div className="flex flex-col text-[#1A1A1A] font-medium">
                      <a href="tel:+919948601899" className="hover:text-[#B8956A] transition-colors">
                        +91 99486 01899
                      </a>
                      <a href="tel:+919948601599" className="hover:text-[#B8956A] transition-colors mt-0.5">
                        +91 99486 01599
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email & Web */}
                <div className="flex items-start space-x-4">
                  <Mail size={18} className="text-[#B8956A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-[#6B6B6B] tracking-wider block font-sans font-semibold mb-1">
                      Online Channels
                    </span>
                    <div className="flex flex-col text-[#1A1A1A]">
                      <a href="mailto:info@madio.in" className="hover:text-[#B8956A] transition-colors font-medium">
                        info@madio.in
                      </a>
                      <a href="http://www.madio.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#B8956A] transition-colors mt-0.5">
                        www.madio.in
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-[#F5F0EB]/60 p-8 border border-[#EBE8E2] space-y-4">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#B8956A] font-sans font-bold block">
                Instant Chat
              </span>
              <h3 className="text-xl font-serif font-light text-[#1A1A1A]">
                Connect via WhatsApp
              </h3>
              <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">
                Need quick product specifications, catalogue PDFs, or shade pricing sent straight to your device? 
              </p>
              <a
                href="https://wa.me/919948601899"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#25D366] text-white px-6 py-3 text-xs uppercase tracking-widest font-sans font-semibold hover:bg-[#128C7E] transition-colors shadow-sm"
              >
                <MessageCircle size={16} />
                <span>Chat with Advisor</span>
              </a>
            </div>

          </div>

          {/* Form Column (Right) */}
          <div className="lg:col-span-7 bg-white border border-[#EBE8E2] p-8 md:p-12 shadow-sm reveal-on-scroll" style={{ transitionDelay: "0.15s" }}>
            {isSubmitted ? (
              <div className="text-center py-12 flex flex-col items-center space-y-6">
                <CheckCircle size={48} className="text-[#B8956A] animate-pulse" />
                <h2 className="text-2xl font-serif font-light text-[#1A1A1A]">
                  Inquiry Transmitted
                </h2>
                <p className="text-xs text-[#6B6B6B] font-light leading-relaxed max-w-sm">
                  Your inquiry has been logged. A customer representative from our showroom unit will get in touch shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-8 py-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-sans font-medium hover:bg-[#B8956A] transition-colors duration-300 rounded-[4px]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-serif font-light text-[#1A1A1A] border-b border-[#EBE8E2] pb-4 mb-6">
                  Inquiry Form
                </h2>
                
                {/* Name */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7] rounded-[4px] transition-colors duration-300 font-light text-[#16232B] placeholder-[#6B6B6B]/60 focus:bg-white"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7] rounded-[4px] transition-colors duration-300 font-light text-[#16232B] placeholder-[#6B6B6B]/60 focus:bg-white"
                  />
                </div>

                {/* Interest Area */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="interestedIn" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans font-semibold">
                    Interested In
                  </label>
                  <select
                    id="interestedIn"
                    name="interestedIn"
                    value={formData.interestedIn}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7] rounded-[4px] transition-colors duration-300 font-light text-[#16232B] appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23B8956A%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[right_1rem_center] bg-[length:1.25em_1.25em] bg-no-repeat focus:bg-white"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Furniture">MADIO Furniture</option>
                    <option value="MAP Finishes">MAP (Premium Architectural Finishes)</option>
                    <option value="Doors & Windows">MADIO Doors &amp; Windows</option>
                  </select>
                </div>

                {/* Subject */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="subject" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans font-semibold">
                    Topic of Inquiry
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7] rounded-[4px] transition-colors duration-300 font-light text-[#16232B] appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23B8956A%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[right_1rem_center] bg-[length:1.25em_1.25em] bg-no-repeat focus:bg-white"
                  >
                    <option value="Architectural Consultation">Architectural Consultation</option>
                    <option value="Dealer / Distribution Inquiry">Dealer / Distribution Inquiry</option>
                    <option value="Product Technical Support">Product Technical Support</option>
                    <option value="Career Opportunities">Career / Applicator Training</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans font-semibold">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Describe your inquiry details..."
                    value={formData.message}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7] rounded-[4px] transition-colors duration-300 font-light text-[#16232B] placeholder-[#6B6B6B]/60 focus:bg-white resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#B8956A] text-white py-4 text-xs uppercase tracking-[0.25em] font-sans font-semibold hover:bg-[#1A1A1A] transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-sm rounded-[4px]"
                >
                  <span>Transmit Message</span>
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
