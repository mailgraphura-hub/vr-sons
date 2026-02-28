import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ██████  DATA — Edit CTA banner content here
// ─────────────────────────────────────────────────────────────────────────────

const CTA_DATA = {
  heading: "Trade Beyond\nBoundaries With Us",
  ctaLabel: "Send an Inquiry",
  backgroundImg: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1400&h=800&fit=crop",
  backgroundAlt: "Global Trade",
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const CTABanner = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section ref={ref} className="bg-[#f0ede8] px-6 pt-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="rounded-3xl overflow-hidden relative" style={{ height: "480px" }}>
        <motion.img
          src={CTA_DATA.backgroundImg}
          alt={CTA_DATA.backgroundAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale: imgScale }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-4xl md:text-5xl xl:text-6xl font-light leading-[1.05] mb-6 whitespace-pre-line"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {CTA_DATA.heading}
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.98)" }}
            whileTap={{ scale: 0.97 }}
            className="self-start flex items-center gap-3 bg-white/90 backdrop-blur text-neutral-900 rounded-full px-6 py-3 text-sm font-medium shadow-xl"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 22 12 12 22 2 12" />
            </svg>
            {CTA_DATA.ctaLabel}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
