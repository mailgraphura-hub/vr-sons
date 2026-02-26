import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ArrowUpRight,
} from "lucide-react";

import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

export default function ContactPage() {
  return (
    <div className="relative bg-neutral-950 text-white font-sans overflow-x-hidden">

      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">

        {/* Animated Background Image */}
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6 }}
          src="https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.3)" }}
          alt=""
        />

        {/* Floating Gradient Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#C36A4D]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />

        <div className="relative z-10 max-w-4xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-black leading-tight"
          >
            Let’s Build <span className="text-[#C36A4D]">Global Trade</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-white/70 max-w-2xl mx-auto"
          >
            Connect with VR & Sons for secure, compliant and premium
            international export partnerships.
          </motion.p>
        </div>
      </section>

      {/* ================= GLASS CONTACT CARDS ================= */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { icon: Phone, title: "Call Us", desc: "+91 98765 43210" },
            { icon: Mail, title: "Email Us", desc: "info@vrsons.com" },
            { icon: MapPin, title: "Visit Office", desc: "Nashik, India" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center shadow-2xl hover:border-[#C36A4D]/40 transition"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#C36A4D]/20 flex items-center justify-center mb-6">
                <item.icon size={26} className="text-[#C36A4D]" />
              </div>

              <h3 className="font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="py-24 px-6 bg-gradient-to-b from-neutral-950 to-neutral-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-4xl font-black mb-6">
              Send Us <span className="text-[#C36A4D]">Message</span>
            </h2>

            <p className="text-white/60 leading-relaxed mb-8">
              Our export team responds within 24 hours.
              Let’s discuss pricing, logistics and global supply.
            </p>

            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
              className="rounded-3xl shadow-2xl"
              alt=""
            />
          </div>

          {/* RIGHT FORM */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl space-y-8 shadow-2xl"
          >
            <div className="relative">
              <input
                type="text"
                required
                className="peer w-full bg-transparent border-b border-white/30 py-3 focus:border-[#C36A4D] outline-none"
              />
              <label className="absolute left-0 top-3 text-white/50 text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C36A4D] transition-all">
                Full Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                required
                className="peer w-full bg-transparent border-b border-white/30 py-3 focus:border-[#C36A4D] outline-none"
              />
              <label className="absolute left-0 top-3 text-white/50 text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C36A4D] transition-all">
                Email Address
              </label>
            </div>

            <div className="relative">
              <textarea
                rows="4"
                required
                className="peer w-full bg-transparent border-b border-white/30 py-3 focus:border-[#C36A4D] outline-none"
              />
              <label className="absolute left-0 top-3 text-white/50 text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C36A4D] transition-all">
                Your Message
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 rounded-2xl bg-[#C36A4D] text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_15px_40px_rgba(195,106,77,0.4)] transition"
            >
              Send Inquiry
              <ArrowUpRight size={16} />
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* ================= GLOBAL CTA ================= */}
      <section className="relative py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C36A4D]/20 to-blue-500/20 blur-[150px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Globe className="mx-auto mb-6 text-[#C36A4D]" size={45} />

          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Trade Beyond Borders
          </h2>

          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            VR & Sons ensures structured global supply chains
            and long-term business partnerships.
          </p>

          <a
            href="/MainCategory"
            className="px-12 py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs hover:scale-105 transition"
          >
            Explore Products
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}