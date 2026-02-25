import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ================= FOOD IMAGES ================= */
const foodImages = [
  { name: "Basmati Rice", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c" },
  { name: "Edible Oils", img: "https://images.unsplash.com/photo-1474979266404-7eaacbad8a0f" },
  { name: "Pulses & Lentils", img: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515" },
  { name: "Wheat & Flour", img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec" },
  { name: "Packaged Foods", img: "https://images.unsplash.com/photo-1585238342024-78d387f4a707" },
  { name: "Fresh Produce", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" },
  { name: "Healthy Meals", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" },
  { name: "Dry Fruits", img: "https://images.unsplash.com/photo-1604908176997-431c7f1f20a5" },
  { name: "Grain Storage", img: "https://images.unsplash.com/photo-1526318472351-bc6c1a2f4a8f" },
  { name: "Food Processing", img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc" },
  { name: "Organic Salad", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
  { name: "Global Cuisine", img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0" }
].map(item => ({
  ...item,
  img: item.img + "?auto=format&fit=crop&w=900&q=80"
}));

/* ================= COMPONENT ================= */
const FoodCarousel = () => {
  const scrollRef = useRef();
  const [index, setIndex] = useState(0);
  const cardWidth = 340;

  /* ===== AUTO SLIDE ===== */
  useEffect(() => {
    const timer = setInterval(() => slideNext(), 3000);
    return () => clearInterval(timer);
  }, [index]);

  const slideNext = () => {
    if (!scrollRef.current) return;
    const next = (index + 1) % foodImages.length;
    setIndex(next);
    scrollRef.current.scrollTo({
      left: next * cardWidth,
      behavior: "smooth"
    });
  };

  const slidePrev = () => {
    if (!scrollRef.current) return;
    const prev = index === 0 ? foodImages.length - 1 : index - 1;
    setIndex(prev);
    scrollRef.current.scrollTo({
      left: prev * cardWidth,
      behavior: "smooth"
    });
  };

  return (
    <section className="py-24 bg-[#F2F0EB] relative overflow-hidden w-full">

      {/* ===== SECTION HEADER ===== */}
      <div className="text-center mb-14 px-6">
        <p className="text-[#C36A4D] font-black tracking-[0.4em] text-xs uppercase mb-4">
          Premium Export Quality
        </p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Food Product Gallery
        </h2>
        <p className="text-black/50 max-w-2xl mx-auto text-lg">
          Explore our global food supply portfolio. Premium grade products
          sourced, processed and delivered worldwide.
        </p>
      </div>

      {/* ===== ARROWS ===== */}
      <button
        onClick={slidePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={slideNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition"
      >
        <ChevronRight />
      </button>

      {/* ===== SLIDER ===== */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-hidden px-16 relative"
      >
        {foodImages.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="min-w-[320px] h-[420px] rounded-3xl overflow-hidden relative shadow-xl group"
          >
            <img
              src={item.img}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* label */}
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs uppercase tracking-widest opacity-70 mb-1">
                Export Quality
              </p>
              <h3 className="text-2xl font-bold">{item.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===== DOTS ===== */}
      <div className="flex justify-center gap-3 mt-12">
        {foodImages.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              index === i ? "w-8 bg-black" : "w-2 bg-black/30"
            }`}
          />
        ))}
      </div>

    </section>
  );
};

export default FoodCarousel;