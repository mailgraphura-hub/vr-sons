import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ██████  DATA — Edit all About Us content here
// ─────────────────────────────────────────────────────────────────────────────

const ABOUT_DATA = {
  badge: "About Us",
  heading: "A Trusted Name\nin Global Trade",
  para1:
    "VR & Sons Import Export is a professionally managed trading company dedicated to exporting high-quality products to international markets. With a strong commitment to reliability, transparency, and long-term business relationships, we aim to bridge the gap between trusted manufacturers and global buyers.",
  para2:
    "We specialize in sourcing and exporting premium-grade products that meet international quality standards. Every product undergoes careful selection and quality inspection to ensure consistency, durability, and customer satisfaction.",
  para3:
    "Our company operates with a structured product hierarchy and efficient supply chain system, enabling smooth coordination from procurement to final delivery. We focus on building sustainable global partnerships by ensuring timely shipments, secure packaging, and competitive trade practices.",

  mission: {
    label: "Our Mission",
    text: "To deliver high-quality export products to global markets while upholding the highest standards of integrity, transparency, and professionalism — building long-term trade partnerships through consistent quality and smooth international transactions.",
  },
  vision: {
    label: "Our Vision",
    text: "To become a globally recognized and trusted export company known for premium-quality products, dependable logistics, and strong international business relationships — establishing VR & Sons as a symbol of reliability and excellence in global trade.",
  },

  images: [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&h=800&fit=crop",
  ],
};

const ABOUT_FAQS = [
  { q: "What products do you export?",        a: "Food Products, Spices, Agricultural Goods, and Bricks — all quality-checked to meet international standards." },
  { q: "What is the minimum order quantity?",  a: "MOQ varies by product, starting from 500 kg. Each product page shows the specific MOQ." },
  { q: "Which countries do you export to?",    a: "We export to 13+ countries across the Middle East, Southeast Asia, Europe, and Africa." },
  { q: "Do you provide product samples?",      a: "Yes. Mention your interest in samples in the inquiry form and our team will guide you." },
];

// ─────────────────────────────────────────────────────────────────────────────
// Compact FAQ Item
// ─────────────────────────────────────────────────────────────────────────────

const MiniFAQ = ({ faq, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border-b border-neutral-100 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-left group"
      >
        <span
          className="text-sm text-neutral-700 group-hover:text-neutral-400 transition-colors pr-6 leading-snug"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          className="text-neutral-300 flex-shrink-0 text-lg leading-none"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p
              className="pb-4 text-xs text-neutral-400 leading-relaxed pr-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const AboutUsSection = () => {
  return (
    <section
      className="bg-[#f0ede8] pt-6 px-3 md:px-6 pb-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="bg-white rounded-3xl overflow-hidden">

        {/* ══════════════════════════════════════════════
            TOP — Heading + Para + Stats grid
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Left — text + FAQ, natural flow, no justify-between */}
          <div className="px-6 md:px-12 py-10 md:py-14 flex flex-col border-b md:border-b-0 md:border-r border-neutral-100">

            {/* Badge */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-xs text-neutral-400 tracking-widest uppercase mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              {ABOUT_DATA.badge}
            </motion.p>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-neutral-900 text-3xl md:text-4xl xl:text-5xl font-light leading-[1.05] whitespace-pre-line mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {ABOUT_DATA.heading}
            </motion.h2>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-10 h-px bg-neutral-200 origin-left mb-6"
            />

            {/* Paragraphs */}
            {[ABOUT_DATA.para1, ABOUT_DATA.para2, ABOUT_DATA.para3].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs text-neutral-500 leading-relaxed mb-4 last:mb-0"
              >
                {para}
              </motion.p>
            ))}

            {/* FAQ — flows naturally after paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-8 pt-7 border-t border-neutral-100"
            >
              <p
                className="text-[10px] text-neutral-300 tracking-widest uppercase mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Quick Answers
              </p>
              {ABOUT_FAQS.map((faq, i) => (
                <MiniFAQ key={i} faq={faq} index={i} />
              ))}
            </motion.div>

          </div>

          {/* Right — 4 images, 2x2 grid, hero-style animation */}
          <div className="bg-neutral-50 p-4 grid grid-cols-2 gap-3">
            {ABOUT_DATA.images.map((src, i) => {
              const isTop = i < 2;
              return (
                <motion.div
                  key={i}
                  initial={{ y: isTop ? -120 : 120, opacity: 0, rotate: i % 2 === 0 ? -6 : 6 }}
                  whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.05 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: isTop ? -6 : 6, transition: { duration: 0.3 } }}
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{ height: "200px" }}
                >
                  <img
                    src={src}
                    alt={`VR & Sons export product ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            MISSION & VISION — dark card
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-100 border-t border-neutral-100">
          {[ABOUT_DATA.mission, ABOUT_DATA.vision].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#1c1c1c] px-8 md:px-12 py-10 md:py-14 flex flex-col gap-5"
            >
              <span
                className="text-white/30 text-xs tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.label}
              </span>
              <p
                className="text-white/80 text-sm md:text-base font-light leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}
              >
                {item.text}
              </p>
              {/* Decorative dots */}
              <div className="flex gap-1.5 mt-2">
                {[...Array(3)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="w-1 h-1 rounded-full bg-white/20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.15 + j * 0.05, type: "spring" }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutUsSection;