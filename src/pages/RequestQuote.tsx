import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, CheckCircle, MapPin, Building } from "lucide-react";
import { collectionsData } from "../data/collections";

export const RequestQuote: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCollection = searchParams.get("collection") || "";
  const initialShade = searchParams.get("shade") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Architect", // Default
    projectType: "Residential",
    area: "",
    collection: initialCollection,
    shadeCode: initialShade,
    details: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync state if query parameters change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      collection: searchParams.get("collection") || prev.collection,
      shadeCode: searchParams.get("shade") || prev.shadeCode,
    }));
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log form data for debugging
    console.log("MAP Quote Request Submitted:", formData);

    /*
     * TODO: Integrate with Google Apps Script Webhook
     * URL: https://script.google.com/macros/s/PLACEHOLDER_GAS_SHEETS_URL/exec
     * Method: POST
     * Body: JSON.stringify(formData)
     * This will save entries in a Google Sheet and trigger an email notification via MailApp.
     */

    setIsSubmitted(true);
  };

  return (
    <div className="texture-overlay min-h-screen pt-36 pb-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Info Column (Left) */}
          <div className="lg:col-span-5 reveal-on-scroll">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8956A] font-sans font-semibold block mb-4">
              Procurement & Specification
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-light text-[#1A1A1A] mb-8 leading-tight">
              Request a <br />
              <span className="italic font-normal text-[#B8956A]">Specification Quote</span>
            </h1>
            <p className="text-sm text-[#6B6B6B] font-light leading-relaxed mb-8">
              We collaborate with architects, designers, and project managers to provide customized costing, material estimates, and sample boards. Fill out this form and our technical advisors in Hyderabad will contact you.
            </p>

            <div className="space-y-6 pt-8 border-t border-[#EBE8E2] text-xs">
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-[#F5F0EB] border border-[#EBE8E2]">
                  <Building size={16} className="text-[#B8956A]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#6B6B6B] block">Sample Dispatch</span>
                  <span className="text-[#1A1A1A] font-medium leading-relaxed block mt-0.5">
                    We ship physical A4 plaster mock-ups across India.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-[#F5F0EB] border border-[#EBE8E2]">
                  <MapPin size={16} className="text-[#B8956A]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#6B6B6B] block">Hyderabad Advisory</span>
                  <span className="text-[#1A1A1A] font-medium leading-relaxed block mt-0.5">
                    1st Floor, Road No.1, Shilpa Hills, Kondapur, Hyderabad
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column (Right) */}
          <div className="lg:col-span-7 bg-white border border-[#EBE8E2] p-8 md:p-12 shadow-sm reveal-on-scroll" style={{ transitionDelay: "0.15s" }}>
            {isSubmitted ? (
              /* Success Screen */
              <div className="text-center py-8 flex flex-col items-center space-y-6">
                <CheckCircle size={56} className="text-[#B8956A] animate-pulse" />
                <h2 className="text-3xl font-serif font-light text-[#1A1A1A]">
                  Specification Received
                </h2>
                <p className="text-sm text-[#6B6B6B] font-light max-w-md mx-auto leading-relaxed">
                  Thank you for specifying MAP finishes. A material specialist from our Hyderabad advisory unit will review your project details and get back to you within 24 hours.
                </p>
                <div className="border-t border-[#EBE8E2] pt-6 w-full max-w-sm text-left text-xs space-y-2 text-[#6B6B6B] font-light">
                  <div className="flex justify-between">
                    <span>Requested Collection:</span>
                    <strong className="text-[#1A1A1A]">{formData.collection ? formData.collection.toUpperCase() : "General"}</strong>
                  </div>
                  {formData.shadeCode && (
                    <div className="flex justify-between">
                      <span>Requested Shade:</span>
                      <strong className="text-[#1A1A1A]">{formData.shadeCode}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Contact Person:</span>
                    <strong className="text-[#1A1A1A]">{formData.name}</strong>
                  </div>
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 px-8 py-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-sans font-medium hover:bg-[#B8956A] transition-colors duration-300"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              /* Quote Request Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                      Your Name *
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

                  {/* Phone */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="phone" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7]"
                    />
                  </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="role" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                      Your Professional Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7]"
                    >
                      <option value="Architect">Architect</option>
                      <option value="Interior Designer">Interior Designer</option>
                      <option value="Homeowner">Homeowner (Owner)</option>
                      <option value="Builder">Builder / Developer</option>
                      <option value="Contractor">Applicator / Contractor</option>
                      <option value="Dealer">Distributor / Dealer</option>
                    </select>
                  </div>

                  {/* Project Type */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="projectType" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                      Project Classification *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7]"
                    >
                      <option value="Residential">Private Residential Villa / Apt</option>
                      <option value="Commercial">Commercial Office / HQ</option>
                      <option value="Hospitality">Hotel, Spa, or Restaurant</option>
                      <option value="Retail">Premium Retail Store / Showroom</option>
                      <option value="Other">Other Architectural Surfaces</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Est. Area */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="area" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                      Estimated Area (Sq.Ft.)
                    </label>
                    <input
                      type="text"
                      id="area"
                      name="area"
                      placeholder="e.g. 2,500 sq ft"
                      value={formData.area}
                      onChange={handleChange}
                      className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7]"
                    />
                  </div>

                  {/* Preferred Finish System */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="collection" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                      MAP System Collection
                    </label>
                    <select
                      id="collection"
                      name="collection"
                      value={formData.collection}
                      onChange={handleChange}
                      className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7]"
                    >
                      <option value="">-- Select Finish System --</option>
                      {collectionsData.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.tagline})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Specific Shade Code */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="shadeCode" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                    Specific Shade Code (if known, e.g. AMD-24)
                  </label>
                  <input
                    type="text"
                    id="shadeCode"
                    name="shadeCode"
                    placeholder="e.g. AMD-22"
                    value={formData.shadeCode}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7]"
                  />
                </div>

                {/* Project Details */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="details" className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-sans">
                    Project Requirements / Substrate Details
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    rows={4}
                    placeholder="Specify substrate condition, location, timeline, or requests for physical catalog boards..."
                    value={formData.details}
                    onChange={handleChange}
                    className="border border-[#EBE8E2] px-4 py-3 text-sm focus:outline-none focus:border-[#B8956A] focus:ring-1 focus:ring-[#B8956A] bg-[#FAFAF7] resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#1A1A1A] text-white py-4 text-xs uppercase tracking-[0.25em] font-sans font-semibold hover:bg-[#B8956A] transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <span>Submit Specification Request</span>
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
