import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { postService } from "../../service/axios";
import { useParams } from "react-router-dom";

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


    const {id} = useParams();
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.customerName || !formData.email || !formData.contact) {
            console.log("Please fill required fields");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                productId: id,
                productName
            };

            const apiResponse = await postService(
                "/customer/inquiry/generateInquiry",
                payload
            );

            if (!apiResponse.ok && !apiResponse.fetchMessage) {
                alert("Failed")
                console.log(apiResponse.message );
                return;
            }


            if (!apiResponse.ok && apiResponse.fetchMessage) {
                alert.log(apiResponse.message || "Failed");
                return;
            }
            

            alert("Inquiry Submitted");

            // Reset form after success
            setFormData(initialState);

            onClose();
        } catch (error) {
            console.log("Error submitting inquiry:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 bg-[#111111] border border-white/10 rounded-3xl p-8"
                >
                    <h3 className="text-white font-black uppercase tracking-[0.35em] text-[11px] mb-8">
                        Inquiry Form
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <input
                            name="customerName"
                            placeholder="Full Name"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none caret-white"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none caret-white"
                        />

                        <input
                            type="email"
                            name="alternativeEmail"
                            placeholder="Alternative Email"
                            value={formData.alternativeEmail}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none caret-white"
                        />

                        <input
                            type="tel"
                            name="contact"
                            placeholder="Contact Number"
                            value={formData.contact}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none caret-white"
                        />

                        <input
                            type="tel"
                            name="alternativeContact"
                            placeholder="Alternative Contact"
                            value={formData.alternativeContact}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none caret-white"
                        />

                        <input
                            name="company"
                            placeholder="Company Name"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none caret-white"
                        />

                        <input
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none caret-white"
                        />

                        <input
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none caret-white"
                        />

                        <input
                            type="number"
                            name="quantity"
                            placeholder="Required Quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none caret-white"
                        />
                    </div>

                    <textarea
                        name="message"
                        rows={4}
                        placeholder="Additional Message"
                        value={formData.message}
                        onChange={handleChange}
                        className="mt-6 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                    />

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-6 py-4 rounded-2xl bg-[#C36A4D] text-white text-[11px] font-black uppercase tracking-[0.35em] hover:bg-[#d4785a] transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Submit Inquiry"}
                        </button>

                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-[11px] font-black uppercase tracking-[0.35em] hover:bg-white/10"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}