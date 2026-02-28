import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function StatsSection() {
  const STATS = [
    { target: 13, suffix: "+", label: "Countries Exported" },
    { target: 6, suffix: "+", label: "Variety of Products" },
    { target: 93, suffix: "%", label: "Customer Satisfaction" },
  ];

  const CountUp = ({ target, suffix = "", duration = 1.5 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const [value, setValue] = useState(0);

    useEffect(() => {
      if (!inView) return;

      let start = null;

      const step = (timestamp) => {
        if (!start) start = timestamp;

        const progress = Math.min((timestamp - start) / (duration * 1000), 1);

        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));

        if (progress < 1) requestAnimationFrame(step);
        else setValue(target);
      };

      requestAnimationFrame(step);
    }, [inView, target, duration]);

    return (
      <span ref={ref} className="tabular-nums">
        {value}
        {suffix}
      </span>
    );
  };

  return (
    <section className="bg-[#f5f3ef] py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            whileHover={{
              y: -6,
              scale: 1.03,
            }}
            className="
              group
              bg-white
              rounded-2xl
              p-8
              text-center
              transition-all
              duration-300
              shadow-[0_8px_25px_rgba(0,0,0,0.06)]
              hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]
              border border-neutral-100
            "
          >
            {/* Number */}
            <h3
              className="text-4xl md:text-5xl font-light text-neutral-900 mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <CountUp
                target={stat.target}
                suffix={stat.suffix}
                duration={1.4 + i * 0.2}
              />
            </h3>

            {/* Label */}
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 group-hover:text-neutral-800 transition-colors duration-300">
              {stat.label}
            </p>

            {/* Premium subtle accent line */}
            <div className="mt-5 h-[2px] w-8 mx-auto bg-neutral-200 group-hover:w-16 group-hover:bg-neutral-400 transition-all duration-300 rounded-full" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
