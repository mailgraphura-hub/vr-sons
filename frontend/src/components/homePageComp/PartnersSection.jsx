import React from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ██████  DATA — Edit partner names here
// ─────────────────────────────────────────────────────────────────────────────

const PARTNERS = [
  "AGRO INDIA", "SPICE BOARD", "APEDA", "FIEO", "CII", "ASSOCHAM", "NASSCOM", "CCI",
];

const SECTION_LABEL = "Our valued partners & certifications";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const PartnersSection = () => (
  <section className="bg-[#f0ede8] px-6 pt-6">
    <div className="bg-white rounded-3xl overflow-hidden py-10">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-xs text-neutral-400 tracking-widest uppercase mb-8"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {SECTION_LABEL}
      </motion.p>
      <div className="overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <motion.div
          className="inline-flex items-center whitespace-nowrap gap-16"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <motion.span
              key={i}
              className="text-neutral-800 font-semibold tracking-widest text-lg select-none cursor-pointer"
              whileHover={{ color: "#000", scale: 1.05 }}
              style={{
                fontFamily: i % 3 === 0 ? "'DM Sans', sans-serif" : "'Cormorant Garamond', Georgia, serif",
                letterSpacing: "0.15em",
              }}
            >
              {p}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default PartnersSection;
