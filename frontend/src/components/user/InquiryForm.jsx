import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { postService } from "../../service/axios";
import { useParams } from "react-router-dom";
import { X, Send, User, Mail, Phone, Building2, MapPin, Package, MessageSquare } from "lucide-react";

export default function InquiryForm({ productName, show, onClose }) {
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

  const { id } = useParams();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.customerName || !formData.email || !formData.contact) {
      console.log("Please fill required fields");
      return;
    }
    try {
      setLoading(true);
      const payload = { ...formData, productId: id, productName };
      const apiResponse = await postService("/customer/inquiry/generateInquiry", payload);
      if (!apiResponse.ok && !apiResponse.fetchMessage) {
        alert("Failed");
        return;
      }
      if (!apiResponse.ok && apiResponse.fetchMessage) {
        alert(apiResponse.message || "Failed");
        return;
      }
      alert("Inquiry Submitted");
      setFormData(initialState);
      onClose();
    } catch (error) {
      console.log("Error submitting inquiry:", error);
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

  const Field = ({ icon: Icon, name, placeholder, type = "text", children }) => (
    <div className="relative">
      <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === name ? "text-[#C36A4D]" : "text-gray-400"}`}>
        <Icon size={15} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        onFocus={() => setFocused(name)}
        onBlur={() => setFocused("")}
        className={`${inputClass(name)} pl-10`}
      />
    </div>
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          style={{ boxShadow: "0 32px 80px rgba(195,106,77,0.18), 0 8px 32px rgba(0,0,0,0.12)" }}
        >
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#C36A4D] via-[#e28b6f] to-[#C36A4D]" />

          {/* Header */}
          <div className="px-8 pt-7 pb-5 flex items-start justify-between border-b border-gray-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C36A4D] mb-1">
                Send an Inquiry
              </p>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {productName}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Fields marked <span className="text-[#C36A4D]">*</span> are required
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-[#C36A4D]/10 flex items-center justify-center text-gray-400 hover:text-[#C36A4D] transition-colors duration-200 mt-1"
            >
              <X size={16} />
            </motion.button>
          </div>

          {/* Scrollable form body */}
          <div className="overflow-y-auto flex-1 px-8 py-6">
            {/* Section: Contact Info */}
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-gray-400 mb-4">
              Contact Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Field icon={User} name="customerName" placeholder="Full Name *" />
              <Field icon={Mail} name="email" placeholder="Email Address *" type="email" />
              <Field icon={Mail} name="alternativeEmail" placeholder="Alternative Email" type="email" />
              <Field icon={Phone} name="contact" placeholder="Contact Number *" type="tel" />
              <Field icon={Phone} name="alternativeContact" placeholder="Alternative Contact" type="tel" />
              <Field icon={Building2} name="company" placeholder="Company Name" />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-gray-400 whitespace-nowrap">
                Location & Order
              </p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Field icon={MapPin} name="country" placeholder="Country" />
              <Field icon={MapPin} name="state" placeholder="State / Province" />
              <div className="relative sm:col-span-2">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === "quantity" ? "text-[#C36A4D]" : "text-gray-400"}`}>
                  <Package size={15} />
                </div>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Required Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  onFocus={() => setFocused("quantity")}
                  onBlur={() => setFocused("")}
                  className={`${inputClass("quantity")} pl-10`}
                />
              </div>
            </div>

            {/* Message */}
            <div className="relative">
              <div className={`absolute left-3.5 top-3.5 transition-colors duration-200 ${focused === "message" ? "text-[#C36A4D]" : "text-gray-400"}`}>
                <MessageSquare size={15} />
              </div>
              <textarea
                name="message"
                rows={3}
                placeholder="Additional message or requirements..."
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused("")}
                className={`${inputClass("message")} pl-10 resize-none`}
              />
            </div>
          </div>

          {/* Footer / Actions */}
          <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/60 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C36A4D] to-[#e28b6f] text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#C36A4D]/30 hover:shadow-xl hover:shadow-[#C36A4D]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Submit Inquiry
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] hover:border-[#C36A4D]/40 hover:text-[#C36A4D] hover:bg-[#C36A4D]/5 transition-all duration-200"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}