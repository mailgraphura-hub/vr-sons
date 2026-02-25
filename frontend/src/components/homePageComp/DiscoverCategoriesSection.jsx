import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const DISCOVER_SECTION = {
  heading: "Discover Our\nProduct Categories",
};

const PRODUCT_TYPES = [
  {
    id: 1,
    label: "Basmati Rice",
    num: "01",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=500&fit=crop",
  },
  {
    id: 2,
    label: "Indian Spices",
    num: "02",
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=700&fit=crop",
  },
  {
    id: 3,
    label: "Turmeric Powder",
    num: "03",
    img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=500&fit=crop",
  },
  {
    id: 4,
    label: "Agricultural Goods",
    num: "04",
    img: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=700&h=500&fit=crop",
  },
  {
    id: 5,
    label: "Premium Bricks",
    num: "05",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop",
  },
  {
    id: 6,
    label: "Sesame Seeds",
    num: "06",
    img: "https://images.unsplash.com/photo-1612257416648-2d5a0e08aa04?w=700&h=400&fit=crop",
  },
  {
    id: 7,
    label: "Groundnuts",
    num: "07",
    img: "https://images.unsplash.com/photo-1567892320421-6a6a4bd0a2ee?w=600&h=400&fit=crop",
  },
  {
    id: 8,
    label: "Food Products",
    num: "08",
    img: "https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?w=600&h=400&fit=crop",
  },
];

const ProductCard = ({ item, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer h-full"
    >
      <motion.img
        src={item.img}
        alt={item.label}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.5 }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <div className="absolute bottom-4 left-5 z-10">
        <p className="text-white/50 text-[10px] tracking-widest uppercase mb-1">
          {item.num}
        </p>
        <p className="text-white text-lg font-light">{item.label}</p>
      </div>
    </motion.div>
  );
};

const DiscoverCategoriesSection = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "start 0.3"],
  });

  // Overlap + slide animation
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 -mt-32 px-6 pb-20"
      style={{ background: "#f0ede8" }}
    >
      <motion.div
        style={{ y, scale, opacity }}
        className="bg-white rounded-t-[48px] px-10 py-16 shadow-[0_-30px_80px_rgba(0,0,0,0.15)]"
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-neutral-900 text-4xl md:text-5xl font-light leading-[1.1] whitespace-pre-line mb-16"
        >
          {DISCOVER_SECTION.heading}
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCT_TYPES.map((item, i) => (
            <div key={item.id} className="aspect-[4/3]">
              <ProductCard item={item} index={i} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default DiscoverCategoriesSection;
