import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ABOUT_DATA = {
  badge: "About Us",
  heading: "A Trusted Name\nin Global Trade",
  para1:
    "VR & Sons Import Export is a professionally managed trading company dedicated to exporting high-quality products to international markets. With a strong commitment to reliability, transparency, and long-term business relationships, we aim to bridge the gap between trusted manufacturers and global buyers.",
  mission: {
    label: "Our Mission",
    text: "To deliver high-quality export products to global markets while upholding the highest standards of integrity, transparency, and professionalism — building long-term trade partnerships through consistent quality and smooth international transactions.",
  },
  vision: {
    label: "Our Vision",
    text: "To become a globally recognized and trusted export company known for premium-quality products, dependable logistics, and strong international business relationships — establishing VR & Sons as a symbol of reliability and excellence in global trade.",
  },
};

const ABOUT_FAQS = [
  {
    q: "What products do you export?",
    a: "Food Products, Spices, Agricultural Goods, and Bricks — all quality-checked to meet international standards.",
  },
  {
    q: "What is the minimum order quantity?",
    a: "MOQ varies by product, starting from 500 kg. Each product page shows the specific MOQ.",
  },
  {
    q: "Which countries do you export to?",
    a: "We export to 13+ countries across the Middle East, Southeast Asia, Europe, and Africa.",
  },
  {
    q: "Do you provide product samples?",
    a: "Yes. Mention your interest in samples in the inquiry form and our team will guide you.",
  },
];

const IMAGE_CARDS = [
  {
    label: "Spices & Agri",
    icon: "🌾",
    bg: "linear-gradient(145deg, #c8a84b 0%, #8B6914 40%, #5c4008 100%)",
    pattern: `radial-gradient(circle at 20% 80%, rgba(255,210,100,0.25) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,180,50,0.2) 0%, transparent 40%)`,
    accent: "#f5d07a",
    dots: ["20%,30%", "60%,20%", "40%,60%", "75%,70%", "15%,65%", "85%,45%"],
  },
  {
    label: "Fresh Produce",
    icon: "🥬",
    bg: "linear-gradient(145deg, #4a7c59 0%, #2d5a3d 40%, #1a3826 100%)",
    pattern: `radial-gradient(circle at 30% 70%, rgba(100,200,120,0.2) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(80,180,100,0.15) 0%, transparent 40%)`,
    accent: "#7ecf95",
    dots: ["25%,25%", "65%,35%", "35%,65%", "70%,75%", "50%,45%", "15%,80%"],
  },
  {
    label: "Natural Goods",
    icon: "🫙",
    bg: "linear-gradient(145deg, #a0714f 0%, #6b4226 40%, #3d2210 100%)",
    pattern: `radial-gradient(circle at 25% 75%, rgba(210,160,100,0.2) 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, rgba(190,140,80,0.15) 0%, transparent 40%)`,
    accent: "#d4a876",
    dots: ["30%,20%", "70%,40%", "20%,70%", "65%,70%", "45%,50%", "80%,20%"],
  },
  {
    label: "Export Packaging",
    icon: "📦",
    bg: "linear-gradient(145deg, #4a5568 0%, #2d3748 40%, #1a202c 100%)",
    pattern: `radial-gradient(circle at 20% 80%, rgba(120,140,180,0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(100,120,160,0.15) 0%, transparent 40%)`,
    accent: "#90a0c0",
    dots: ["20%,40%", "60%,25%", "40%,70%", "75%,60%", "55%,40%", "25%,75%"],
  },
];

const CardArtwork = ({ card }) => (
  <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    viewBox="0 0 200 250"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="160" cy="40" r="80" fill={card.accent} fillOpacity="0.08" />
    <circle cx="30" cy="200" r="60" fill={card.accent} fillOpacity="0.06" />
    <circle cx="100" cy="125" r="40" fill="white" fillOpacity="0.04" />
    {[0, 40, 80, 120, 160, 200].map((x) => (
      <line
        key={x}
        x1={x}
        y1="0"
        x2={x}
        y2="250"
        stroke={card.accent}
        strokeOpacity="0.08"
        strokeWidth="0.5"
      />
    ))}
    {[0, 50, 100, 150, 200, 250].map((y) => (
      <line
        key={y}
        x1="0"
        y1={y}
        x2="200"
        y2={y}
        stroke={card.accent}
        strokeOpacity="0.08"
        strokeWidth="0.5"
      />
    ))}
    {[
      [30, 60],
      [100, 45],
      [160, 80],
      [50, 150],
      [140, 160],
      [80, 200],
    ].map(([cx, cy], i) => (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r="2.5"
        fill={card.accent}
        fillOpacity="0.35"
      />
    ))}
    <line
      x1="0"
      y1="250"
      x2="200"
      y2="0"
      stroke={card.accent}
      strokeOpacity="0.1"
      strokeWidth="1"
    />
    <rect
      x="0"
      y="0"
      width="40"
      height="3"
      fill={card.accent}
      fillOpacity="0.4"
      rx="1"
    />
    <rect
      x="0"
      y="0"
      width="3"
      height="40"
      fill={card.accent}
      fillOpacity="0.4"
      rx="1"
    />
  </svg>
);

const ImageCard = ({ card, index }) => {
  const isTop = index < 2;
  const enterFrom = {
    0: { x: -40, y: -40, rotate: -3 },
    1: { x: 40, y: -40, rotate: 3 },
    2: { x: -40, y: 40, rotate: 2 },
    3: { x: 40, y: 40, rotate: -2 },
  }[index];

  return (
    <motion.div
      initial={{ ...enterFrom, opacity: 0, scale: 0.85 }}
      whileInView={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 1.1,
        delay: 0.1 + index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: isTop ? -10 : 10, scale: 1.05, zIndex: 10 }}
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        minHeight: 160,
        background: card.bg,
        boxShadow: "0 14px 40px rgba(0,0,0,0.2)",
        cursor: "default",
      }}
    >
      <CardArtwork card={card} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          fontSize: 52,
          opacity: 0.85,
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
          lineHeight: 1,
        }}
      >
        {card.icon}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 14,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
          borderRadius: 99,
          padding: "4px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: card.accent,
          }}
        />
        <span
          style={{
            color: "white",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {card.label}
        </span>
      </div>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)",
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
};

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
          className="text-sm font-semibold text-neutral-800 group-hover:text-black transition-colors pr-6 leading-snug"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          className="text-neutral-600 flex-shrink-0 text-lg leading-none"
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

const AboutUsSection = () => (
  <section
    className="bg-[#f0ede8] pt-6 px-3 md:px-6 pb-6"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <div className="bg-white rounded-3xl overflow-hidden">
      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* LEFT */}
        <div className="px-6 md:px-12 py-10 md:py-14 flex flex-col border-b md:border-b-0 md:border-r border-neutral-100">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs text-neutral-400 tracking-widest uppercase mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            {ABOUT_DATA.badge}
          </motion.p>

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

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-10 h-px bg-neutral-200 origin-left mb-6"
          />

          {/* ── FIXED PARAGRAPH ── */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-sm text-neutral-700 leading-relaxed mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {ABOUT_DATA.para1}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-8 pt-7 border-t border-neutral-100"
          >
            <p
              className="text-xs text-neutral-700 font-semibold tracking-widest uppercase mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Quick Answers
            </p>
            {ABOUT_FAQS.map((faq, i) => (
              <MiniFAQ key={i} faq={faq} index={i} />
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Art Cards */}
        <div
          className="relative p-6 overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #f8f5f0 0%, #ece8e2 100%)",
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #1a1a2e 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              opacity: 0.025,
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-5"
          >
            <span
              className="text-[10px] tracking-[0.3em] uppercase text-neutral-400"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              VR & Sons · Export Portfolio
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              flex: 1,
            }}
          >
            {IMAGE_CARDS.map((card, i) => (
              <ImageCard key={i} card={card} index={i} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center text-[10px] text-neutral-300 mt-5 tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Quality Products · Global Reach
          </motion.p>
        </div>
      </div>

      {/* MISSION & VISION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-neutral-200 pt-14 mt-6">
        {[ABOUT_DATA.mission, ABOUT_DATA.vision].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -6 }}
            className="relative bg-[#1c1c1c] rounded-2xl px-10 md:px-14 py-12 md:py-16 overflow-hidden transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
          >
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-white/60 to-white/10 origin-top"
            />
            <span
              className="text-white/40 text-xs tracking-[0.25em] uppercase mb-6 block"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.label}
            </span>
            <p
              className="text-white/85 font-light leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              }}
            >
              {item.text}
            </p>
            <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutUsSection;
