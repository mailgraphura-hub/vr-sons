import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const STATS = [
  { target: 13, suffix: "+", label: "Countries Exported" },
  { target: 6, suffix: "+", label: "Variety of Products" },
  { target: 93, suffix: "%", label: "Customer Satisfaction" },
];

// ─────────────────────────────────────────
// CountUp
// ─────────────────────────────────────────

const CountUp = ({ target, suffix = "", duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out
      const eased = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────

const StatsSection = () => {
  return (
    <section className="bg-[#f0ede8] px-6 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="bg-neutral-900 rounded-3xl px-10 md:px-14 py-14"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group"
            >
              {/* Number */}
              <motion.p
                className="text-white text-5xl md:text-6xl font-light mb-3 tabular-nums"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.25 }}
              >
                <CountUp
                  target={stat.target}
                  suffix={stat.suffix}
                  duration={1.4 + i * 0.2}
                />
              </motion.p>

              {/* Label */}
              <motion.p
                className="text-neutral-400 text-xs tracking-widest uppercase transition-colors duration-300"
                whileHover={{ color: "#ffffff" }}
              >
                {stat.label}
              </motion.p>

              {/* Minimal underline animation */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "40%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                className="h-[1px] bg-neutral-700 mx-auto mt-4"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StatsSection;
