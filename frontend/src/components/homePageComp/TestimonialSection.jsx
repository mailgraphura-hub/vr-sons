import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Michael Johnson",
    company: "Global Harvest Inc.",
    country: "USA",
    rating: 5,
    review:
      "Very reliable export partner. Transparent communication and consistent product quality.",
  },
  {
    name: "Carlos Rivera",
    company: "Rivera Imports",
    country: "Spain",
    rating: 4,
    review:
      "The spices quality exceeded expectations. Excellent compliance and shipment handling.",
  },
  {
    name: "David Lee",
    company: "Asia Trade Hub",
    country: "Singapore",
    rating: 4,
    review:
      "Smooth documentation process and professional support throughout the shipment cycle.",
  },
  {
    name: "Omar Hassan",
    company: "Desert Foods Co.",
    country: "Qatar",
    rating: 5,
    review: "High packaging standards and dependable supply chain management.",
  },
  {
    name: "James Wilson",
    company: "Wilson Imports Ltd.",
    country: "UK",
    rating: 5,
    review:
      "Trustworthy supplier with strong export compliance and product consistency.",
  },
];

const getInitials = (name) => {
  const parts = name.split(" ");
  return parts[0][0] + (parts[1] ? parts[1][0] : "");
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/* ── Mobile: 1 card, auto-advances every 3s ── */
const MobileCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((i) => (i + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const goTo = (next) => {
    setDirection(next > current ? 1 : -1);
    setCurrent((next + testimonials.length) % testimonials.length);
  };

  const item = testimonials[current];

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="px-4">
      {/* Fixed-height container so cards don't jump */}
      <div className="relative overflow-hidden" style={{ height: 290 }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 flex flex-col justify-between h-full">
              {/* Profile */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-lg shadow-md flex-shrink-0">
                  {getInitials(item.name)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.company}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex mb-3">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400 mr-1"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                "{item.review}"
              </p>

              {/* Country */}
              <div className="mt-4">
                <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {item.country}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? "#4f46e5" : "#d1d5db",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* 3s progress bar */}
      <div
        className="mt-3 rounded-full overflow-hidden"
        style={{ height: 2, background: "#e5e7eb" }}
      >
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "linear" }}
          style={{ height: "100%", background: "#4f46e5", borderRadius: 99 }}
        />
      </div>
    </div>
  );
};

/* ── Desktop: original horizontal marquee ── */
const DesktopMarquee = () => {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        animate={{ x: paused ? undefined : ["0%", "-100%"] }}
        transition={{ x: { repeat: Infinity, duration: 35, ease: "linear" } }}
      >
        {[...testimonials, ...testimonials].map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="min-w-[360px] bg-white rounded-3xl p-8 shadow-lg border border-gray-200 flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-lg shadow-md">
                {getInitials(item.name)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.company}</p>
              </div>
            </div>

            <div className="flex mb-4">
              {[...Array(item.rating)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="text-yellow-400 fill-yellow-400 mr-1"
                />
              ))}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
              "{item.review}"
            </p>

            <div>
              <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                {item.country}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
};

/* ── Main Export ── */
const TestimonialSection = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="py-28 bg-gradient-to-b from-white to-gray-100 overflow-hidden relative"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800">
          Trusted By Global Importers
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Building long-term international trade partnerships through quality,
          compliance and reliability.
        </p>
      </div>

      {isMobile ? <MobileCarousel /> : <DesktopMarquee />}
    </motion.section>
  );
};

export default TestimonialSection;
