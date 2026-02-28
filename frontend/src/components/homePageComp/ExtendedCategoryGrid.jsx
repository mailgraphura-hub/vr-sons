import React, { useState } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ██████  DATA — Edit all extended category content here
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 1, num: "01", label: "Food Products",
    img: "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=500&h=400&fit=crop",
  },
  {
    id: 2, num: "02", label: "Spices",
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=600&fit=crop",
  },
  {
    id: 3, num: "03", label: "Agricultural Goods",
    img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&h=600&fit=crop",
  },
  {
    id: 4, num: "04", label: "Bricks",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=400&fit=crop",
  },
  {
    id: 5, num: "05", label: "Eco-Friendly Products",
    img: "https://images.unsplash.com/photo-1542601906897-ecd77a9fc1c9?w=500&h=400&fit=crop",
  },
  {
    id: 6, num: "06", label: "Export Packaging",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&h=400&fit=crop",
  },
  {
    id: 7, num: "07", label: "Premium Pulses",
    img: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=500&h=400&fit=crop",
  },
];

const EXTRA_CATEGORY = {
  id: 8, num: "08", label: "Global Trade Goods",
  img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=500&h=900&fit=crop",
};

const PROMO_CARD_TEXT = {
  body: "Explore Our Diverse\nRange of Export Categories\nand Find Your Products",
  ctaLabel: "Catalog Download",
};

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const ArrowUpRight = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

const PromoCard = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.93 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center justify-center p-6 gap-4 h-full"
  >
    <div className="flex items-end gap-1 h-12">
      {[0.4, 0.65, 0.5, 0.8, 0.6, 0.9, 0.7].map((h, i) => (
        <motion.div
          key={i}
          className="w-3 rounded-sm bg-neutral-800"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: `${h * 48}px`, transformOrigin: "bottom" }}
        />
      ))}
    </div>
    <p className="text-neutral-500 text-xs text-center leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {PROMO_CARD_TEXT.body.split("\n").map((line, i) => (
        <span key={i}>{line}{i < 2 && <br />}</span>
      ))}
    </p>
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: "#111" }}
      className="flex items-center gap-2 bg-neutral-900 text-white rounded-full px-4 py-2 text-xs transition-colors"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {PROMO_CARD_TEXT.ctaLabel}
    </motion.button>
  </motion.div>
);

const MiniCard = ({ card, delay }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer w-full h-full"
    >
      <motion.img
        src={card.img} alt={card.label}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <motion.button
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black shadow"
        animate={{ scale: hovered ? 1.12 : 1 }}
      >
        <ArrowUpRight size={11} />
      </motion.button>
      <div className="absolute bottom-3 left-4 z-10">
        <p className="text-white/50 text-[9px] tracking-widest uppercase mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{card.num}</p>
        <p className="text-white text-sm font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{card.label}</p>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ExtendedCategoryGrid = () => (
  <section className="bg-[#f0ede8] px-6 pb-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
    <div className="bg-white rounded-b-3xl overflow-hidden px-10 pb-12">

      {/* Mobile: 2-col grid */}
      <div className="grid grid-cols-2 gap-3 md:hidden py-6">
        {CATEGORIES.map((cat, i) => (
          <div key={cat.id} style={{ height: "160px" }}>
            <MiniCard card={cat} delay={i * 0.07} />
          </div>
        ))}
        <div style={{ height: "160px" }}><PromoCard /></div>
      </div>

      {/* Desktop: 5-col asymmetric layout */}
      <div className="hidden md:grid grid-cols-5 gap-3" style={{ height: "500px" }}>
        <div style={{ gridColumn: 1, gridRow: "1 / 2" }} className="h-full"><MiniCard card={CATEGORIES[0]} delay={0.05} /></div>
        <div style={{ gridColumn: 1, gridRow: "2 / 3" }} className="h-full"><MiniCard card={CATEGORIES[4]} delay={0.2} /></div>
        <div style={{ gridColumn: 2, gridRow: "1 / 3" }} className="h-full"><MiniCard card={CATEGORIES[1]} delay={0.1} /></div>
        <div style={{ gridColumn: 3, gridRow: "1 / 2" }} className="h-full"><MiniCard card={CATEGORIES[2]} delay={0.15} /></div>
        <div style={{ gridColumn: 3, gridRow: "2 / 3" }} className="h-full"><PromoCard /></div>
        <div style={{ gridColumn: 4, gridRow: "1 / 2" }} className="h-full"><MiniCard card={CATEGORIES[3]} delay={0.2} /></div>
        <div style={{ gridColumn: 4, gridRow: "2 / 3" }} className="h-full"><MiniCard card={CATEGORIES[6]} delay={0.3} /></div>
        <div style={{ gridColumn: 5, gridRow: "1 / 2" }} className="h-full"><MiniCard card={CATEGORIES[5]} delay={0.22} /></div>
        <div style={{ gridColumn: 5, gridRow: "2 / 3" }} className="h-full"><MiniCard card={EXTRA_CATEGORY} delay={0.32} /></div>
      </div>

    </div>
  </section>
);

export default ExtendedCategoryGrid;
