import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getService } from "../../service/axios";
import { useNavigate } from "react-router-dom";

const SECTION_HEADING = "Discover Our\nProduct Categories";

const ProductCard = ({ product, delay }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer w-full h-full"
      onClick={() => navigate(`/productsDetail/${product._id}`)}
    >
      {/* ── Image with zoom ── */}
      <motion.img
        src={product.productImage[0]}
        alt={product.name}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── Base gradient (always visible) ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

      {/* ── Hover overlay — darkens slightly ── */}
      <motion.div
        className="absolute inset-0 bg-black/25"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="absolute top-3 left-3 z-10">
        <span
          className={`text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-lg
      transition-all duration-300
      ${product.status === "Available"
              ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-green-900/40"
              : "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-red-900/40"
            }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.status}
        </span>
      </div>

      {/* ── Arrow button ── */}
      <motion.button
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-black shadow"
        animate={{ scale: hovered ? 1.1 : 1, opacity: hovered ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
        </svg>
      </motion.button>

      {/* ── Bottom info — always shown ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">

        {/* SKU + Category */}
        <p
          className="text-white/70 text-[10px] font-semibold tracking-widest uppercase mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.skuId} · {product.category.name}
        </p>

        {/* Product Name */}
        <p
          className="text-white text-base font-semibold leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {product.name}
        </p>

        {/* ── Specs — reveal on hover ── */}
        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              className="text-white/80 text-[11px] font-medium mt-1 leading-snug"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* {product.specifications} */}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ProductsSection = () => {
   const navigate = useNavigate();

  const [Product, setProduct] = useState([])
  useEffect(() => {
    ; (
      async () => {
        const apiResponse = await getService("/customer/product/product?page=1&limit=16");

        if (!apiResponse.ok) {
          console.log(apiResponse.message);
          return
        }

        setProduct(apiResponse.data.data.productList)
      }
    )()
  }, [])

  return <section
    className="bg-[#f0ede8] pt-6 px-3 md:px-6 pb-6"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <div className="bg-white rounded-3xl px-5 md:px-10 py-16 md:py-24">

      {/* Header */}
      <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-neutral-900 text-3xl md:text-4xl xl:text-5xl font-light leading-[1.1] whitespace-pre-line"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {SECTION_HEADING}
        </motion.h2>

        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/MainCategory")}
          className="flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-900 transition-colors group self-start md:self-end"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-neutral-700 transition-colors"/>
          View All Products
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.a>
      </div>

      {/* ── Masonry — CSS columns ── */}
      <style>{`
        .masonry-grid { columns: 2; column-gap: 12px; }
        @media (min-width: 640px)  { .masonry-grid { columns: 3; } }
        @media (min-width: 1024px) { .masonry-grid { columns: 4; } }
        .masonry-grid .m-item {
          display: inline-block;
          width: 100%;
          break-inside: avoid;
          margin-bottom: 12px;
          border-radius: 16px;
          overflow: hidden;
        }
      `}</style>

      <div className="masonry-grid">
        {Product.map((p, i) => (
          <div
            key={p._id}
            className="m-item"
            style={{
              height: [280, 360, 220, 320, 260, 300, 240, 340, 300, 260, 380, 220, 310, 270, 350, 240][i % 16] + "px",
            }}
          >
            <ProductCard product={p} delay={i * 0.07} />
          </div>
        ))}
      </div>

    </div>
  </section>
};

export default ProductsSection;