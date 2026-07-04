import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from "lucide-react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Architectural Consultation",
    message: "",
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
    console.log("MAP Contact General Inquiry Submitted:", formData);
    setIsSubmitted(true);
  };

  return (
    <div className="texture-overlay min-h-screen pt-36 pb-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title */}
        <div className="max-w-3xl mb-20 reveal-on-scroll">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-sans font-semibold block mb-4">
            Connect
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] mb-6 leading-tight">
            Contact Our <span className="italic font-normal text-[#B8956A]">Hyderabad HQ</span>
          </h1>
          <p className="text-sm md:text-base text-[#6B6B6B] font-light leading-relaxed">
            Have questions about specification sheets, dealer locations, or bespoke color development? Reach out directly via phone, WhatsApp, email, or complete our contact form.
          </p>
        </div>

        {/* Info Grid */}
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
                  Your general inquiry has been logged. A customer representative from our Kondapur showroom unit will get in touch shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-8 py-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-sans font-medium hover:bg-[#B8956A] transition-colors duration-300"
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
                  <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7]"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7]"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="subject" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                    Topic of Inquiry
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7]"
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
                  <label htmlFor="message" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
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
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7] resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#1A1A1A] text-white py-4 text-xs uppercase tracking-[0.25em] font-sans font-semibold hover:bg-[#B8956A] transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <span>Transmit Message</span>
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
