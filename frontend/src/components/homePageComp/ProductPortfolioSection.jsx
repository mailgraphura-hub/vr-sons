import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ██████  DATA — Edit all product/category content here
// ─────────────────────────────────────────────────────────────────────────────

const COMPANY = {
  name: "VR & Sons Import Export",
  mapCity: "Surat, Gujarat",
  sectionTitle: "Explore Our Product Portfolio",
  allProductsLabel: "All Products",
  socialCTA1: "Don't Miss Out on New Products!",
  socialCTA2: "Follow Us on Social Media",
};

// Filter tabs — add/remove categories here
const TABS = ["Food Products", "Spices", "Agricultural Goods", "Bricks"];

// Products list — add/edit/remove products here
const PRODUCTS = [
  {
    id: 1,
    title: "Premium Basmati Rice",
    category: "Food Products",
    origin: "Punjab, India",
    moq: "1 Metric Ton",
    packaging: "25 kg PP Bags",
    status: "Available",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Organic Red Chilli Powder",
    category: "Spices",
    origin: "Rajasthan, India",
    moq: "500 kg",
    packaging: "1 kg Vacuum Packs",
    status: "Available",
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Turmeric Finger & Powder",
    category: "Spices",
    origin: "Maharashtra, India",
    moq: "500 kg",
    packaging: "50 kg Jute Bags",
    status: "Available",
    img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Fresh Groundnuts",
    category: "Agricultural Goods",
    origin: "Gujarat, India",
    moq: "2 Metric Tons",
    packaging: "50 kg Jute Bags",
    status: "Seasonal",
    img: "https://images.unsplash.com/photo-1567892320421-6a6a4bd0a2ee?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    title: "Premium Clay Bricks",
    category: "Bricks",
    origin: "Gujarat, India",
    moq: "10,000 Units",
    packaging: "Palletized",
    status: "Available",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    title: "Sesame Seeds (White)",
    category: "Agricultural Goods",
    origin: "Gujarat, India",
    moq: "1 Metric Ton",
    packaging: "25 kg PP Bags",
    status: "Available",
    img: "https://images.unsplash.com/photo-1612257416648-2d5a0e08aa04?w=800&h=600&fit=crop",
  },
];

// Featured card shown in the bottom row
const FEATURED_PRODUCT = {
  title: "Premium Indian Agricultural Exports",
  img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&h=600&fit=crop",
};

// Map pin positions (decorative) — adjust freely
const MAP_PINS = [
  { top: "28%", left: "38%" },
  { top: "34%", left: "52%" },
  { top: "40%", left: "44%" },
  { top: "22%", left: "60%" },
  { top: "55%", left: "32%" },
  { top: "48%", left: "58%" },
  { top: "62%", left: "48%" },
  { top: "30%", left: "30%" },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const MapPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ArrowUpRight = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const ProductCard = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: "4/3" }}
    >
      <motion.img
        src={product.img}
        alt={product.title}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: hovered ? 0.45 : 0.15 }}
        transition={{ duration: 0.4 }}
      />

      <motion.button
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-black shadow-lg z-20"
        whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,1)" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.12 + 0.3 }}
      >
        <ArrowUpRight size={13} />
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3"
            >
              <div className="flex items-center gap-1.5 text-white/80 text-xs mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <MapPin />
                <span>{product.origin}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "MOQ", value: product.moq },
                  { label: "Packaging", value: product.packaging },
                  { label: "Origin", value: product.origin },
                  { label: "Status", value: product.status },
                ].map((spec) => (
                  <div key={spec.label} className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-wide leading-tight">{spec.label}</p>
                    <p className="text-xs font-semibold text-neutral-900 leading-tight mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-white text-sm font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {product.title}
        </p>
      </div>
    </motion.div>
  );
};

const DecorativeMap = () => (
  <div className="relative w-full h-full bg-[#e8e0d4] overflow-hidden rounded-2xl">
    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.25 }}>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#888" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
      <path d="M 0,200 Q 150,150 300,200 T 600,200" stroke="#aaa" strokeWidth="3" fill="none" />
      <path d="M 100,0 Q 200,100 180,250 T 200,500" stroke="#aaa" strokeWidth="2" fill="none" />
      <path d="M 0,100 L 600,130" stroke="#aaa" strokeWidth="2" fill="none" />
      <path d="M 250,0 L 230,500" stroke="#aaa" strokeWidth="1.5" fill="none" />
      <path d="M 400,0 Q 380,200 420,400" stroke="#aaa" strokeWidth="2" fill="none" />
    </svg>
    <div className="absolute top-1/3 left-1/3 text-neutral-600 font-light text-lg" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {COMPANY.mapCity}
    </div>
    {MAP_PINS.map((pin, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{ top: pin.top, left: pin.left }}
        initial={{ opacity: 0, y: -10, scale: 0 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 + i * 0.07, type: "spring", stiffness: 300 }}
      >
        <svg width="22" height="28" viewBox="0 0 24 30" fill="none">
          <path d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 21 9 21s9-14.25 9-21c0-4.97-4.03-9-9-9z" fill="#111" />
          <circle cx="12" cy="9" r="3.5" fill="white" />
        </svg>
      </motion.div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ProductPortfolioSection = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const sectionRef = useRef(null);

  const filteredProducts = activeTab === TABS[0] ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeTab);
  const displayProducts = filteredProducts.length >= 2 ? filteredProducts : PRODUCTS.slice(0, 4);
  const topGrid = displayProducts.slice(0, 4);

  return (
    <section ref={sectionRef} className="relative bg-[#f0ede8] pb-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <motion.div
        className="mx-2 md:mx-6 rounded-3xl overflow-hidden"
        style={{ background: "#111111" }}
        initial={{ borderRadius: 40 }}
        whileInView={{ borderRadius: 24 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Section header */}
        <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-2xl md:text-3xl xl:text-4xl font-light"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {COMPANY.sectionTitle}
          </motion.h2>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-2 bg-white/10 p-1 rounded-full self-start"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-3 md:px-4 py-1.5 text-xs rounded-full transition-colors duration-200"
                style={{ color: activeTab === tab ? "#111" : "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Product grid (top 4) */}
        <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 md:pb-6">
          {topGrid.map((product, i) => (
            <ProductCard key={product.id + activeTab} product={product} index={i} />
          ))}
        </div>

        {/* Featured card + Map */}
        <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{ aspectRatio: "4/3" }}
          >
            <motion.img
              src={FEATURED_PRODUCT.img}
              alt={FEATURED_PRODUCT.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <motion.button
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-black shadow-lg z-20"
              whileHover={{ scale: 1.15 }}
            >
              <ArrowUpRight size={13} />
            </motion.button>
            <p className="absolute bottom-4 left-4 text-white text-sm font-light z-10" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {FEATURED_PRODUCT.title}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden"
            style={{ aspectRatio: "4/3" }}
          >
            <DecorativeMap />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow text-sm font-medium text-neutral-800"
            >
              Find Our Exporters
            </motion.div>
            <motion.button
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-black shadow-lg"
              whileHover={{ scale: 1.15 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <ArrowUpRight size={13} />
            </motion.button>
          </motion.div>
        </div>

        {/* Footer bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="px-4 md:px-8 py-4 md:py-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 border border-white/30 text-white/80 text-sm rounded-full px-6 py-2.5 transition-colors"
          >
            {COMPANY.allProductsLabel}
          </motion.button>

          <div className="flex items-center gap-6 md:gap-8">
            <div className="text-right">
              <p className="text-white/50 text-xs tracking-wide">{COMPANY.socialCTA1}</p>
              <p className="text-white/70 text-xs tracking-wide">{COMPANY.socialCTA2}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* YouTube */}
              <motion.button whileHover={{ scale: 1.15 }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </motion.button>
              {/* Instagram */}
              <motion.button whileHover={{ scale: 1.15 }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </motion.button>
              {/* WhatsApp */}
              <motion.button whileHover={{ scale: 1.15 }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductPortfolioSection;
