import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Shield, Truck, Handshake, Package, Globe, FileCheck,
  ArrowUpRight
} from "lucide-react";

import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

// ═══════════════════════════════════════════════════════════════
//  CONTENT DATA
// ═══════════════════════════════════════════════════════════════

const COMPANY = {
  name: "VR & Sons",
  tagline: "Import Export",
  heroImage: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1800&q=85",
};

const STATS = [
  { value: 13, suffix: "+", label: "Countries Exported" },
  { value: 6,  suffix: "+", label: "Variety of Products" },
  { value: 93, suffix: "%", label: "Customer Satisfaction" },
];

const ABOUT_PARAGRAPHS = [
  "VR & Sons Import Export is a professionally managed trading company dedicated to exporting high-quality products to international markets. With a strong commitment to reliability, transparency, and long-term business relationships, we aim to bridge the gap between trusted manufacturers and global buyers.",
  "We specialize in sourcing and exporting premium-grade products that meet international quality standards. Every product undergoes careful selection and quality inspection to ensure consistency, durability, and customer satisfaction.",
  "Our company operates with a structured product hierarchy and efficient supply chain system, enabling smooth coordination from procurement to final delivery. We focus on building sustainable global partnerships by ensuring timely shipments, secure packaging, and competitive trade practices.",
];

const MISSION =
  "Our mission is to deliver high-quality export products to global markets while upholding the highest standards of integrity, transparency, and professionalism. We are committed to building long-term trade partnerships by ensuring consistent product quality, reliable supply chains, and smooth international transactions.";

const VISION =
  "Our vision is to become a globally recognized and trusted export company known for premium-quality products, dependable logistics, and strong international business relationships. We aspire to expand our global presence by continuously improving our sourcing standards, strengthening supplier networks, and adapting to evolving international market demands.";

const WHY_CHOOSE = [
  {
    icon: Shield,
    title: "Quality",
    desc: "We maintain strict quality control at every stage of sourcing and export to ensure all products meet international standards and customer expectations.",
  },
  {
    icon: Truck,
    title: "Logistics",
    desc: "Our well-managed supply chain and reliable shipping partners ensure timely delivery, secure handling, and smooth global transportation of goods.",
  },
  {
    icon: Handshake,
    title: "Trust",
    desc: "We build long-term international relationships through ethical trade practices, transparent communication, and consistent product reliability.",
  },
  {
    icon: Package,
    title: "Packaging",
    desc: "All products are carefully packed using export-grade materials to ensure safety, durability, and protection during international transit.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "We connect trusted manufacturers with buyers worldwide, expanding trade opportunities across multiple international markets.",
  },
  {
    icon: FileCheck,
    title: "Compliance",
    desc: "Our export processes follow proper documentation, regulatory guidelines, and international trade standards to ensure smooth cross-border transactions.",
  },
];

// ═══════════════════════════════════════════════════════════════

// ── Animated Counter ──────────────────────────────────────────
const Counter = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ── Section Header ─────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-6 h-0.5 bg-[#C36A4D]" />
    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#C36A4D]">{children}</span>
  </div>
);

// ── Fade-up wrapper ───────────────────────────────────────────
const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 35 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ── Main Component ────────────────────────────────────────────
export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <div className="bg-white text-neutral-900 font-sans overflow-x-hidden min-h-screen">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[90vh] flex flex-col justify-end px-6 md:px-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={COMPANY.heroImage}
            alt="VR & Sons"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.3) saturate(0.7)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#C36A4D]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel>About Us</SectionLabel>
            <h1
              className="font-black uppercase tracking-tighter leading-[0.82] mb-8 text-white"
              style={{ fontSize: "clamp(3.5rem, 10vw, 9.5rem)" }}
            >
              {COMPANY.name}<br />
              <span className="text-[#C36A4D]">{COMPANY.tagline}</span>
            </h1>
            <p className="text-white/80 text-lg max-w-xl border-l-2 border-[#C36A4D]/50 pl-6 leading-relaxed">
              Trusted exporters of high-quality products for global trade.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#C36A4D]/80" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/50 rotate-90 mt-2">Scroll</span>
        </motion.div>
      </section>

      {/* ── WHO WE ARE ─────────────────────────────────────────── */}
      <section className="py-28 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left text */}
          <div>
            <FadeUp>
              <SectionLabel>Who We Are</SectionLabel>
              <h2 className="text-neutral-900 font-black uppercase tracking-tighter leading-[0.85] mb-10"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
                Bridging Trusted<br />
                <span className="text-[#C36A4D]">Manufacturers</span><br />
                With Global Buyers
              </h2>
            </FadeUp>

            <div className="space-y-5">
              {ABOUT_PARAGRAPHS.map((para, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <p className="text-neutral-600 font-medium text-[15px] leading-[1.85]">{para}</p>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.3} className="mt-10">
              <a href="/MainCategory" className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-[#C36A4D] text-white text-[11px] font-black uppercase tracking-[0.35em] hover:bg-[#d4785a] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(195,106,77,0.35)] group">
                Explore Products
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </FadeUp>
          </div>

          {/* Right — photo grid */}
          <FadeUp delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                  <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="" />
                </div>
                <div className="h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                  <img src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="" />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="h-40 rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                  <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="" />
                </div>
                <div className="h-64 rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                  <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="" />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────── */}
      <section className="py-6 border-y border-neutral-200 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-3 divide-x divide-neutral-200">
            {STATS.map((stat, i) => (
              <FadeUp key={i} delay={i * 0.12} className="px-8 py-12 text-center">
                <p className="font-black text-neutral-900 leading-none mb-3"
                  style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">{stat.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ───────────────────────────────────── */}
      <section className="py-28 px-6 md:px-20 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp className="text-center mb-16">
            <SectionLabel>Our Direction</SectionLabel>
            <h2 className="text-neutral-900 font-black uppercase tracking-tighter"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              Mission &amp; Vision
            </h2>
          </FadeUp>

          {/* Tab toggle */}
          <FadeUp delay={0.1} className="flex justify-center mb-12">
            <div className="flex bg-neutral-50 border border-neutral-200 p-1 rounded-full gap-1 shadow-sm">
              {["mission", "vision"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.35em] transition-all duration-300
                    ${activeTab === tab
                      ? "bg-[#C36A4D] text-white shadow-[0_4px_20px_rgba(195,106,77,0.35)]"
                      : "text-neutral-500 hover:text-neutral-900"
                    }`}
                >
                  Our {tab}
                </button>
              ))}
            </div>
          </FadeUp>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="max-w-3xl mx-auto text-center"
            >
              <p className="text-neutral-600 text-xl leading-[1.9] font-medium">
                {activeTab === "mission" ? MISSION : VISION}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── WHY CHOOSE US ──────────────────────────────────────── */}
      <section className="py-28 px-6 md:px-20 border-t border-neutral-200 bg-neutral-50/30">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-16">
            <SectionLabel>Why Choose Us</SectionLabel>
            <h2 className="text-neutral-900 font-black uppercase tracking-tighter"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              Built on <span className="text-[#C36A4D]">Excellence</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CHOOSE.map((item, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="group relative bg-white border border-neutral-200 shadow-sm rounded-3xl p-8
                  hover:border-[#C36A4D]/30 hover:shadow-[0_20px_60px_-20px_rgba(195,106,77,0.15)]
                  transition-all duration-500 cursor-default h-full">

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#C36A4D]/10 border border-[#C36A4D]/20 flex items-center justify-center mb-6
                    group-hover:bg-[#C36A4D] group-hover:border-[#C36A4D] transition-all duration-300">
                    <item.icon size={20} className="text-[#C36A4D] group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-neutral-900 text-xl font-black uppercase tracking-tight mb-3
                    group-hover:text-[#C36A4D] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 font-medium text-sm leading-relaxed">{item.desc}</p>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C36A4D]/40 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="py-28 px-6 md:px-20 border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="relative bg-neutral-50 border border-neutral-200 shadow-sm rounded-3xl p-14 md:p-20 text-center overflow-hidden">
              <div className="relative z-10">
                <p className="text-[#C36A4D] text-[9px] font-black uppercase tracking-[0.5em] mb-5">Join Our Network</p>
                <h2 className="text-neutral-900 font-black uppercase tracking-tighter leading-[0.88] mb-8"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
                  Ready to Trade<br />With the World?
                </h2>
                <p className="text-neutral-600 font-medium text-base max-w-lg mx-auto mb-10 leading-relaxed">
                  Create an account to browse our comprehensive product catalog and request customized quotes directly from your dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/login" className="px-8 py-4 rounded-2xl bg-black text-white text-[11px] font-black uppercase tracking-[0.35em]
                    hover:bg-neutral-800 transition-all duration-300 shadow-md">
                    Login / Register
                  </a>
                  <a href="/MainCategory" className="px-8 py-4 rounded-2xl bg-white border border-neutral-200 text-neutral-700 text-[11px] font-black uppercase tracking-[0.35em]
                    hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-300 shadow-sm">
                    Browse Products
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <Footer />

    </div>
  );
}