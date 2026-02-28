import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HERO_DATA = {
  companyName: "VR & Sons",
  companySubtitle: "Import Export",
};

const SLIDE_IMAGES = [
  {
    label: "Banana Powder",
    img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=600&fit=crop",
  },
  {
    label: "Onion Powder",
    img: "https://images.unsplash.com/photo-1695653422259-8a74ffe90401?w=400&h=600&fit=crop",
  },
  {
    label: "Onions",
    img: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=600&fit=crop",
  },
  {
    label: "Banana",
    img: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&h=600&fit=crop",
  },
  {
    label: "Jaggery",
    img: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400&h=600&fit=crop",
  },
  {
    label: "Cumin",
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=600&fit=crop",
  },
  {
    label: "Bagasse Composite Dishes & Bowls",
    img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=600&fit=crop",
  },
];

const VerticalColumn = ({ direction = "up" }) => {
  return (
    <div className="overflow-hidden h-full w-full">
      <motion.div
        className="flex flex-col gap-4"
        animate={{
          y: direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...SLIDE_IMAGES, ...SLIDE_IMAGES].map((card, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden opacity-70"
            style={{ aspectRatio: "2/3" }}
          >
            <img src={card.img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  return (
    <div
      ref={containerRef}
      className="relative pt-[90px]"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      <section className="sticky top-[90px] min-h-[calc(100vh-90px)]  flex items-center justify-center px-3 sm:px-6 overflow-hidden">
        <motion.div
          className="relative w-full max-w-[1600px] shadow-2xl overflow-hidden"
          style={{
            scale,
            y,
            borderRadius: 24,
            height: "calc(100vh - 110px)",
            minHeight: 500,
          }}
        >
          {/* MOVING GRID — 2 cols on mobile, 4 on desktop */}
          <div
            className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 p-4 sm:p-10"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          >
            <VerticalColumn direction="up" />
            <VerticalColumn direction="down" />
            {/* Hide extra columns on mobile */}
            <div className="hidden md:block">
              <VerticalColumn direction="up" />
            </div>
            <div className="hidden md:block">
              <VerticalColumn direction="down" />
            </div>
          </div>

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

          {/* CENTER TEXT */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-4">
            <div className="text-center w-full">
              {/* Main Logo — single line on all screens */}
              <h1 className="relative leading-none whitespace-nowrap flex items-baseline justify-center gap-2 sm:gap-4">
                {/* VR */}
                <span
                  className="font-semibold tracking-[-0.02em] bg-gradient-to-b from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent drop-shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
                  style={{ fontSize: "clamp(3.5rem, 14vw, 9rem)" }}
                >
                  VR
                </span>

                {/* & Sons */}
                <span
                  className="font-light tracking-wide text-neutral-800"
                  style={{ fontSize: "clamp(2.5rem, 10vw, 6rem)" }}
                >
                  &amp; Sons
                </span>
              </h1>

              {/* Elegant underline accent */}
              <div className="flex justify-center mt-3 sm:mt-5">
                <div className="w-24 sm:w-32 h-[1.5px] bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-60" />
              </div>

              {/* Subtitle */}
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-6">
                <div className="w-8 sm:w-16 h-[1px] bg-neutral-500 opacity-50" />
                <p
                  className="uppercase tracking-[0.3em] sm:tracking-[0.5em] text-neutral-700 font-medium"
                  style={{ fontSize: "clamp(0.55rem, 2.2vw, 0.75rem)" }}
                >
                  Global Import • Export
                </p>
                <div className="w-8 sm:w-16 h-[1px] bg-neutral-500 opacity-50" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HeroSection;
