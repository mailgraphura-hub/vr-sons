import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Ship,
  Building2,
  ArrowUpRight,
} from "lucide-react";

import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

export default function ContactPage() {
  return (
    <div className="bg-white text-neutral-900 font-sans overflow-x-hidden">

      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative h-[75vh] flex items-center justify-center text-center overflow-hidden">

        <img
          src="https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.35)" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight"
          >
            Contact <span className="text-[#C36A4D]">VR & Sons</span>
          </motion.h1>

          <p className="mt-6 text-white/80 max-w-2xl mx-auto">
            Connect with our export team for structured global trade
            partnerships and seamless logistics solutions.
          </p>
        </div>
      </section>

      {/* ================= CONTACT INFO ================= */}
      <section className="px-6 py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

          {[
            { icon: Phone, title: "Call Us", desc: "+91 98765 43210" },
            { icon: Mail, title: "Email Address", desc: "info@vrsons.com" },
            { icon: MapPin, title: "Head Office", desc: "Nashik, India" },
          ].map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -8 }}
                className="group bg-white p-10 rounded-3xl border border-neutral-200 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-[#C36A4D]/40 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#C36A4D]/10 flex items-center justify-center mb-6 group-hover:bg-[#C36A4D] transition">
                  <Icon size={26} className="text-[#C36A4D] group-hover:text-white transition" />
                </div>

                <h3 className="text-lg font-black mb-3">
                  {item.title}
                </h3>

                <p className="text-neutral-600 text-sm">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}

        </div>
      </section>

      {/* ================= COMPANY DETAILS ================= */}
      <section className="py-16 md:py-20 px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Our <span className="text-[#C36A4D]">Global Presence</span>
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-6">
              VR & Sons operates with structured international logistics,
              premium quality standards and strategic trade partnerships.
            </p>

            <p className="text-neutral-600 leading-relaxed">
              We ensure compliance, transparency and efficient coordination
              across borders for seamless export-import operations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-8"
          >
            {[
              { icon: Ship, label: "Global Shipping" },
              { icon: Building2, label: "Corporate Trade" },
              { icon: Globe, label: "International Markets" },
              { icon: MapPin, label: "Strategic Locations" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-md border border-neutral-200 text-center hover:shadow-xl transition"
                >
                  <Icon className="mx-auto mb-4 text-[#C36A4D]" size={32} />
                  <p className="text-neutral-600 text-sm">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ================= CTA (MATCH ABOUT STYLE) ================= */}
      <section className="bg-black text-white py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Ready To Trade <span className="text-[#C36A4D]">Globally?</span>
          </h2>

          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Partner with us to explore reliable export opportunities and
            expand your international business network.
          </p>

          <a
            href="/MainCategory"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#C36A4D] text-white font-black uppercase tracking-[0.3em] text-xs hover:shadow-[0_15px_40px_rgba(195,106,77,0.5)] transition-all duration-300"
          >
            Explore Products
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}