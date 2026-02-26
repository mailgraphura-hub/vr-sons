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
    <div className="overflow-x-hidden font-sans bg-white text-neutral-900">

      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">

        {/* Animated Background Image */}
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6 }}
          src="https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg"
          className="absolute inset-0 object-cover w-full h-full"
          style={{ filter: "brightness(0.3)" }}
          alt=""
        />

        {/* Floating Gradient Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#C36A4D]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-white-500/20 blur-[120px] rounded-full animate-pulse" />

        <div className="relative z-10 max-w-4xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-black leading-tight md:text-7xl"
          >
            Let’s Build <span className="text-[#C36A4D]">Global Trade</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto mt-6 text-white/70"
          >
            Connect with VR & Sons for secure, compliant and premium
            international export partnerships.
          </motion.p>
        </div>
      </section>

      {/* ================= GLASS CONTACT CARDS ================= */}
      <section className="px-6 py-20">
        <div className="grid gap-10 mx-auto max-w-7xl md:grid-cols-3">
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

              <h3 className="mb-3 text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-black/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="px-6 py-24 bg-gradient-to-b from-[#C36A4D]/10 to-blue-500/10">
        <div className="grid items-center max-w-6xl gap-16 mx-auto md:grid-cols-2">

          {/* LEFT CONTENT */}
          <div>
            <h2 className="mb-6 text-4xl font-black">
              Send Us <span className="text-[#C36A4D]">Message</span>
            </h2>

            <p className="mb-8 leading-relaxed text-black/60">
              Our export team responds within 24 hours.
              Let’s discuss pricing, logistics and global supply.
            </p>

            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
              className="shadow-2xl rounded-3xl"
              alt=""
            />
          </div>

          {/* RIGHT FORM */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="p-10 space-y-8 border shadow-2xl bg-black/5 backdrop-blur-xl border-black/10 rounded-3xl"
          >
            <div className="relative">
              <input
                type="text"
                required
                className="peer w-full bg-transparent border-b border-black/30 py-3 focus:border-[#C36A4D] outline-none"
              />
              <label className="absolute left-0 top-3 text-black/50 text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C36A4D] transition-all">
                Full Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                required
                className="peer w-full bg-transparent border-b border-black/30 py-3 focus:border-[#C36A4D] outline-none"
              />
              <label className="absolute left-0 top-3 text-black/50 text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C36A4D] transition-all">
                Email Address
              </label>
            </div>

            <div className="relative">
              <textarea
                rows="4"
                required
                className="peer w-full bg-transparent border-b border-black/30 py-3 focus:border-[#C36A4D] outline-none"
              />
              <label className="absolute left-0 top-3 text-black/50 text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C36A4D] transition-all">
                Your Message
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 rounded-2xl bg-[#C36A4D] text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-[0_15px_40px_rgba(195,106,77,0.4)] transition"
            >
              Send Inquiry
              <ArrowUpRight size={16} />
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* ================= GLOBAL CTA ================= */}
      <section className="relative overflow-hidden text-center py-28">
        <div className="overflow-x-hidden font-sans bg-white text-neutral-900" />

        <div className="relative z-10 max-w-4xl px-6 mx-auto">
          <Globe className="mx-auto mb-6 text-[#C36A4D]" size={45} />

          <h2 className="mb-6 text-4xl font-black md:text-6xl">
            Trade Beyond Borders
          </h2>

          <p className="max-w-2xl mx-auto mb-8 text-black/60">
            VR & Sons ensures structured global supply chains
            and long-term business partnerships.
          </p>

          <a
            href="/MainCategory"
            className="px-12 py-4 text-xs font-bold tracking-widest text-white transition bg-black upperwhitecase rounded-2xl hover:scale-105"
          >
            Explore Products
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}