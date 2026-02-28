import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { postService } from "../../service/axios";
import { useParams } from "react-router-dom";
import {
  X,
  Send,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Package,
  MessageSquare,
} from "lucide-react";

export default function InquiryForm({ productName, show, onClose }) {
  const { id } = useParams();

  const initialState = {
    customerName: "",
    email: "",
    alternativeEmail: "",
    contact: "",
    alternativeContact: "",
    company: "",
    country: "",
    state: "",
    quantity: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { customerName, email, contact } = formData;

    if (!customerName.trim() || !email.trim() || !contact.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        productId: id,
        productName,
      };

      const apiResponse = await postService(
        "/customer/inquiry/generateInquiry",
        payload
      );

      if (!apiResponse?.ok) {
        alert(apiResponse?.message || "Failed to submit inquiry.");
        return;
      }

      alert("Inquiry Submitted Successfully!");
      setFormData(initialState);
      onClose();
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full bg-white/80 border-2 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 text-sm ${
      focused === name
        ? "border-[#C36A4D] shadow-[0_0_0_4px_rgba(195,106,77,0.12)]"
        : "border-gray-200 hover:border-[#C36A4D]/40"
    }`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#C36A4D] via-[#e28b6f] to-[#C36A4D]" />

          {/* Header */}
          <div className="px-8 pt-7 pb-5 flex justify-between border-b border-gray-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#C36A4D]">
                Send an Inquiry
              </p>
              <h3 className="text-xl font-bold text-gray-900">
                {productName}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#C36A4D]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto flex-1 px-8 py-6"
          >
            {/* Contact Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

              {/* Full Name */}
              <div className="relative">
                <User
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    focused === "customerName"
                      ? "text-[#C36A4D]"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  name="customerName"
                  placeholder="Full Name *"
                  value={formData.customerName}
                  onChange={handleChange}
                  onFocus={() => setFocused("customerName")}
                  onBlur={() => setFocused("")}
                  className={`${inputClass("customerName")} pl-10`}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    focused === "email"
                      ? "text-[#C36A4D]"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  className={`${inputClass("email")} pl-10`}
                />
              </div>

              {/* Contact */}
              <div className="relative">
                <Phone
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    focused === "contact"
                      ? "text-[#C36A4D]"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact Number *"
                  value={formData.contact}
                  onChange={handleChange}
                  onFocus={() => setFocused("contact")}
                  onBlur={() => setFocused("")}
                  className={`${inputClass("contact")} pl-10`}
                />
              </div>

              {/* Company */}
              <div className="relative">
                <Building2
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    focused === "company"
                      ? "text-[#C36A4D]"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  onFocus={() => setFocused("company")}
                  onBlur={() => setFocused("")}
                  className={`${inputClass("company")} pl-10`}
                />
              </div>

            </div>

            {/* Location & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

              <div className="relative">
                <MapPin
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    focused === "country"
                      ? "text-[#C36A4D]"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  onFocus={() => setFocused("country")}
                  onBlur={() => setFocused("")}
                  className={`${inputClass("country")} pl-10`}
                />
              </div>

              <div className="relative">
                <MapPin
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    focused === "state"
                      ? "text-[#C36A4D]"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State / Province"
                  value={formData.state}
                  onChange={handleChange}
                  onFocus={() => setFocused("state")}
                  onBlur={() => setFocused("")}
                  className={`${inputClass("state")} pl-10`}
                />
              </div>

              <div className="relative sm:col-span-2">
                <Package
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    focused === "quantity"
                      ? "text-[#C36A4D]"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Required Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  onFocus={() => setFocused("quantity")}
                  onBlur={() => setFocused("")}
                  className={`${inputClass("quantity")} pl-10`}
                  min="1"
                />
              </div>

            </div>

            {/* Message */}
            <div className="relative mb-6">
              <MessageSquare
                size={15}
                className={`absolute left-3.5 top-3.5 ${
                  focused === "message"
                    ? "text-[#C36A4D]"
                    : "text-gray-400"
                }`}
              />
              <textarea
                name="message"
                rows={3}
                placeholder="Additional message..."
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused("")}
                className={`${inputClass("message")} pl-10 resize-none`}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C36A4D] to-[#e28b6f] text-white font-bold disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Inquiry"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}