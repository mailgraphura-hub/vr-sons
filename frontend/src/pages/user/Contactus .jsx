import React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  ShieldCheck,
  Truck,
  Award,
  Target,
  Eye,
  BarChart3
} from "lucide-react";

import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

// ─────────────────────────────
// Animation Wrapper
// ─────────────────────────────
const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function AboutUs() {
  return (
    <div className="bg-white text-neutral-900 overflow-x-hidden">

      <Navbar />

      {/* ───────── HERO SECTION ───────── */}
      <section className="relative h-[85vh] flex items-end px-6 md:px-20 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1494415859740-21e878dd929d?w=1800&q=80"
            alt="Global Trade"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.35)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <FadeUp>
            <p className="text-[#C36A4D] uppercase tracking-[0.5em] text-xs font-bold mb-6">
              About VR & Sons
            </p>

            <h1
              className="text-white font-black uppercase leading-[0.85]"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              Delivering Quality <br />
              <span className="text-[#C36A4D]">Across Borders</span>
            </h1>

            <p className="text-white/70 max-w-xl mt-6 border-l-2 border-[#C36A4D]/40 pl-5">
              We build long-term international trade partnerships
              through reliability, transparency, and uncompromised quality.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ───────── COMPANY INTRO ───────── */}
      <section className="py-28 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          <FadeUp>
            <img
              src="https://images.unsplash.com/photo-1581090700227-1e8f4d9cda3f?w=900&q=80"
              alt="Factory"
              className="rounded-3xl shadow-2xl border border-neutral-200"
            />
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="text-[#C36A4D] uppercase tracking-[0.4em] text-xs font-bold mb-4">
              Who We Are
            </p>

            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 leading-tight">
              A Trusted Export Partner
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-6">
              VR & Sons specializes in exporting premium spices,
              agricultural products, and industrial goods to global markets.
              Our operations focus on strict quality control,
              efficient logistics, and transparent business practices.
            </p>

            <p className="text-neutral-600 leading-relaxed mb-8">
              With years of experience in international trade,
              we have established reliable distribution networks
              across multiple countries.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "13+", label: "Export Countries" },
                { number: "500+", label: "Satisfied Clients" },
                { number: "10+", label: "Years Experience" },
                { number: "24h", label: "Response Time" }
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="text-3xl font-black text-[#C36A4D]">
                    {item.number}
                  </h3>
                  <p className="text-neutral-600 text-sm font-medium">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>

        </div>
      </section>

      {/* ───────── MISSION & VISION ───────── */}
      <section className="py-28 px-6 md:px-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

          {[{
            icon: Target,
            title: "Our Mission",
            text: "To deliver consistent quality products worldwide while maintaining ethical standards and competitive pricing."
          },
          {
            icon: Eye,
            title: "Our Vision",
            text: "To become a globally recognized export brand known for excellence, trust, and sustainable trade growth."
          }].map((item, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="bg-white rounded-3xl p-12 border border-neutral-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <item.icon size={32} className="text-[#C36A4D] mb-6" />
                <h3 className="text-2xl font-black uppercase mb-4">
                  {item.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            </FadeUp>
          ))}

        </div>
      </section>

      {/* ───────── WHY CHOOSE US ───────── */}
      <section className="py-28 px-6 md:px-20">
        <div className="max-w-7xl mx-auto text-center">

          <FadeUp>
            <p className="text-[#C36A4D] uppercase tracking-[0.4em] text-xs font-bold mb-4">
              Why Choose Us
            </p>

            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-16">
              Trusted By Global Buyers
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, text: "Strict Quality Control" },
              { icon: Truck, text: "On-Time Global Delivery" },
              { icon: Globe, text: "International Trade Network" },
              { icon: Award, text: "Competitive Manufacturer Pricing" }
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="group border border-neutral-200 rounded-3xl p-10 transition-all duration-500 hover:border-[#C36A4D]/40 hover:shadow-xl">
                  <item.icon size={30} className="text-[#C36A4D] mx-auto mb-6 transition-transform duration-300 group-hover:scale-110" />
                  <p className="font-semibold text-neutral-800">
                    {item.text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── GLOBAL SECTION (Luxury Touch) ───────── */}
      <section className="py-28 px-6 md:px-20 bg-black text-white text-center">
        <FadeUp>
          <BarChart3 size={36} className="text-[#C36A4D] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">
            Expanding Across Continents
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our products reach international markets through reliable
            logistics partners and strong global trade relationships.
          </p>
        </FadeUp>
      </section>

      <Footer />
    </div>
  );
}