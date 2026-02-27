import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { getService } from "../../service/axios"
import { useNavigate } from "react-router-dom";


const SERVICES_HEADING = {
  title: "Tailored Export\nSolutions for\nYour Business",
  exploreLabel: "Explore More",
};

// const SERVICES = [
//   {
//     id: 1,
//     title: "Product Sourcing",
//     img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
//   },
//   {
//     id: 2,
//     title: "Quality Inspection",
//     img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop",
//   },
//   {
//     id: 3,
//     title: "Export Documentation",
//     img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&h=200&fit=crop",
//   },
//   {
//     id: 4,
//     title: "Logistics & Shipping",
//     img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=200&h=200&fit=crop",
//   },
// ];

const MARQUEE_ITEMS = [
  "EXPORT FROM GUJARAT, INDIA",
  "WEBP IMAGE OPTIMIZATION",
  "INTEREST-FREE INQUIRY PROCESS",
  "REMOTE ORDER PLACEMENT",
  "TRUSTED BY 13+ COUNTRIES",
];

const VENN_DATA = {
  heading: "Path to Smart Export Partnership",
  circle1: { line1: "Premium Quality", line2: "Products" },
  circle2: { line1: "Competitive MOQ", line2: "from 500 kg" },
  circle3: { line1: "On-time Export", line2: "Delivery" },
  merged: { line1: "Global", line2: "Trade Success" },
  ctaLabel: "Download Product Catalog",
};


const DarkMarquee = () => {
  const text = MARQUEE_ITEMS.join("  •  ");
  return (
    <div className="overflow-hidden w-full py-5 border-t border-b border-white/10">
      <motion.div
        className="inline-flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      >
        {[...Array(2)].map((_, i) => (
          <span key={i} className="text-white/30 text-sm font-medium tracking-[0.18em] pr-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {text}&nbsp;&nbsp;•&nbsp;&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ── CountUp — number counts up when it enters viewport ───────────────────────
const CountUp = ({ target, suffix = "", duration = 1.8 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(target);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ── Original ServicePill — image + heading, NO dropdown ──────────────────────
const ServicePill = ({ service, index }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-full overflow-hidden cursor-pointer"
      style={{ background: "rgba(255,255,255,0.93)" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
    >
      <div
        onClick={() => navigate(`/CategoryProducts/${service._id}`)}
        className="group flex items-center gap-3 md:gap-4 px-3 py-2 pr-5 rounded-xl cursor-pointer 
             transition-all duration-300 ease-in-out 
             hover:bg-neutral-100 hover:shadow-md hover:scale-[1.02]"
      >
        <div className="relative w-11 h-11 md:w-13 md:h-13 rounded-full overflow-hidden flex-shrink-0 
                  border border-neutral-200 shadow-sm 
                  transition-all duration-300 group-hover:shadow-md">
          <img
            src={service.categoryImage}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-neutral-800 text-sm md:text-base font-semibold tracking-wide 
                 transition-colors duration-300 group-hover:text-black"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {service.name}
          </span>

          {index >= 0 && (
            <span className="text-[10px] px-2 py-[2px] rounded-full bg-neutral-200 
                       text-neutral-600 font-medium">
              0{index + 1}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const VennDiagram = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center 40%"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [p, setP] = useState(0);

  useEffect(() => {
    const unsub = progress.on("change", setP);
    return unsub;
  }, [progress]);

  const spread = 70;
  const cx = 360; const cy = 200; const r = 120;
  const topY = cy - spread * (1 - p);
  const leftX = cx - spread * (1 - p);
  const rightX = cx + spread * (1 - p);
  const bottomY = cy + spread * (1 - p) * 0.6;
  const showLabels = p < 0.7;
  const showMerged = p > 0.85;

  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-10 md:py-20 relative px-4">
      <div className="w-full overflow-x-auto flex justify-center relative">
        <svg width="720" height="400" viewBox="0 0 720 400" className="overflow-visible max-w-full" style={{ maxWidth: "100%", height: "auto" }}>
          <motion.circle cx={cx} cy={topY} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <motion.circle cx={leftX} cy={bottomY} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <motion.circle cx={rightX} cy={bottomY} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          {showLabels && (
            <>
              <text x={cx} y={topY - 10} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="DM Sans, sans-serif">{VENN_DATA.circle1.line1}</text>
              <text x={cx} y={topY + 8} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="DM Sans, sans-serif">{VENN_DATA.circle1.line2}</text>
              <text x={leftX - 5} y={bottomY - 4} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="DM Sans, sans-serif">{VENN_DATA.circle2.line1}</text>
              <text x={leftX - 5} y={bottomY + 12} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="DM Sans, sans-serif">{VENN_DATA.circle2.line2}</text>
              <text x={rightX + 5} y={bottomY + 4} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="DM Sans, sans-serif">{VENN_DATA.circle3.line1}</text>
            </>
          )}
          {showMerged && (
            <>
              <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="DM Sans, sans-serif">{VENN_DATA.merged.line1}</text>
              <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="DM Sans, sans-serif">{VENN_DATA.merged.line2}</text>
            </>
          )}
        </svg>
      </div>

    </div>
  );
};

const ServicesSection = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [160, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  const [categoryProduct, setcategoryProduct] = useState([])
  useEffect(() => {
    ; (
      async () => {
        const apiResponse = await getService("/customer/product/category?page=1&limit=4");

        if (!apiResponse.ok) {
          console.log(apiResponse.message);
          return
        }

        setcategoryProduct(apiResponse.data.data.categoryList)
      }
    )()
  }, [])

  return (
    <section
      ref={ref}
      className="relative z-30 -mt-24 px-3 md:px-6 pb-20"
      style={{ background: "#f0ede8", fontFamily: "'DM Sans', sans-serif" }}
    >
      <motion.div
        style={{ y, scale, opacity }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl overflow-hidden shadow-[0_-40px_120px_rgba(0,0,0,0.35)]"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "#1c1c1c" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
            {/* Left — heading + stats */}
            <div className="p-6 md:p-12 flex flex-col justify-between">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white text-3xl md:text-4xl xl:text-5xl font-light leading-[1.15] mb-6 md:mb-8 whitespace-pre-line"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {SERVICES_HEADING.title}
                </motion.h2>

                <motion.a
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  href="#"
                  className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/70 transition-colors" />
                  {SERVICES_HEADING.exploreLabel}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.a>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="hidden md:flex items-end gap-8 mt-10"
              >
                {[
                  { target: 13, suffix: "+", sub: "Countries" },
                  { target: 93, suffix: "%", sub: "Satisfied" },
                  { target: 6, suffix: "+", sub: "Products" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.sub}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.65 + i * 0.12, duration: 0.5 }}
                    className="flex flex-col"
                  >
                    <span
                      className="text-white text-2xl font-light tabular-nums"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      <CountUp
                        target={stat.target}
                        suffix={stat.suffix}
                        duration={1.5 + i * 0.2}
                      />
                    </span>
                    <span className="text-white/30 text-xs tracking-widest uppercase mt-0.5">
                      {stat.sub}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right — service pills */}
            <div className="p-4 md:p-8 flex flex-col justify-center gap-3">
              {categoryProduct.map((s, i) => (
                <ServicePill key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>

          <DarkMarquee />

          {/* Venn heading */}
          <div className="px-4 md:px-8 pt-8 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white text-xl md:text-2xl font-light"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {VENN_DATA.heading}
            </motion.h3>
          </div>

          <VennDiagram />
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;