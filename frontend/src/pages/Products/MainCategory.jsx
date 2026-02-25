import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, MoveRight } from 'lucide-react';
import { getService } from '../../service/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/homePageComp/Navbar';
import Footer from '../../components/homePageComp/Footer';

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
// Replace this with your API response when going live.
// Shape mirrors: apiResponse.data.data.categoryList
// const MOCK_CATEGORIES = [
//   {
//     _id: "cat_001",
//     name: "Food Products",
//     decription: "Processed & packaged export-quality food products meeting international hygiene and labelling standards.",
//     categoryImage: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
//     markets: "25 Countries",
//   },
//   {
//     _id: "cat_002",
//     name: "Pure Spices",
//     decription: "Authentic farm-sourced spices with verified origin certificates and high global demand.",
//     categoryImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
//     markets: "18 Countries",
//   },
//   {
//     _id: "cat_003",
//     name: "Agri Goods",
//     decription: "Bulk agricultural commodities for global supply chains, available year-round with flexible MOQs.",
//     categoryImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
//     markets: "30 Countries",
//   },
//   {
//     _id: "cat_004",
//     name: "Industrial",
//     decription: "Industrial raw materials meeting strict export grading standards with ISO documentation.",
//     categoryImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
//     markets: "12 Countries",
//   },
// ];

// ─── HERO CONFIG ─────────────────────────────────────────────────────────────
const HERO_IMAGE = "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&q=80&w=2000";
const TYPING_TEXT = "Optimizing the flow of international trade with precision.";
// ─────────────────────────────────────────────────────────────────────────────

const GlobalPortal = () => {
  const [categories, setCategory] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [displayText, setDisplayText] = useState('');

  const navigate = useNavigate();

  // Swap this block with the real API call when going live:
  useEffect(() => {
    (async () => {
      const apiResponse = await getService("/customer/product/category");
      if (!apiResponse.ok) { console.log(apiResponse.message); return; }
      setCategory(apiResponse.data.data.categoryList);
    })();
  }, []);

  // Typing Effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(TYPING_TEXT.slice(0, i));
      i++;
      if (i > TYPING_TEXT.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // Animation Variants
  const heroContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };

  const titleVariant = {
    hidden: { opacity: 0, scale: 2.5, filter: "blur(20px)", y: 50 },
    visible: {
      opacity: 1, scale: 1, filter: "blur(0px)", y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const cardContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] font-sans overflow-x-hidden">
         <Navbar/>
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center px-6 text-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            className="w-full h-full object-cover opacity-50 scale-105"
            alt="Logistics"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent opacity-30" />
        </div>

        <motion.div
          className="relative z-20 max-w-7xl"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={titleVariant}
            className="text-[#C36A4D] font-black tracking-[0.5em] text-[10px] uppercase block mb-6"
          >
            Established Enterprise
          </motion.span>

          <motion.h1
            variants={titleVariant}
            className="text-white text-[70px] md:text-[90px] font-black leading-[0.8] tracking-tighter"
          >
            DIRECT.<br />
            <span className="text-[#C36A4D]">GLOBAL.</span><br />
            RELIABLE.
          </motion.h1>

          <motion.p variants={titleVariant} className="text-gray-300 text-lg mt-8 font-mono min-h-[1.5em]">
            {displayText}
            <span className="animate-pulse ml-1 text-[#C36A4D]">|</span>
          </motion.p>

          <motion.div variants={titleVariant} className="mt-12 flex justify-center gap-6">
            <button className="bg-[#C36A4D] px-10 py-5 rounded-xl text-white font-bold flex items-center gap-3 hover:bg-white hover:text-black transition-all duration-300 shadow-2xl">
              Inquiry <MoveRight size={16} />
            </button>
            <button className="border border-white/20 px-10 py-5 rounded-xl text-white backdrop-blur-md hover:bg-white/10 transition-all">
              Network
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* TRADE UNITS */}
      <section className="py-24 px-6 relative">
        <div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')` }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black mb-14 uppercase italic border-l-4 border-[#C36A4D] pl-6"
          >
            Trade Units
          </motion.h2>

          <motion.div
            variants={cardContainer}
            initial="hidden"
            whileInView="show"
            animate="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map(cat => (
              <motion.div
                key={cat._id}
                variants={cardItem}
                onMouseEnter={() => setHoveredId(cat._id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: -15 }}
                className="relative h-[420px] rounded-[2rem] overflow-hidden bg-white shadow-2xl border border-slate-100 cursor-pointer group"
              >
                {/* Image Reveal on Hover */}
                <AnimatePresence>
                  {hoveredId === cat._id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="absolute inset-0 z-0"
                    >
                      <img src={cat.categoryImage} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-10 h-full p-8 flex flex-col justify-between" onClick={() => navigate(`/CategoryProducts/${cat._id}`)}>
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 ${
                      hoveredId === cat._id ? 'bg-[#C36A4D] text-white rotate-12 scale-110' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <img
                        src="https://cdn.prod.website-files.com/6209ea9aee1f965d7fce7c19/6549e52943c26955e3fb9516_xpo%20logistics.jpg"
                        alt="Shipment"
                        className="w-12 h-12 rounded-xl"
                      />
                    </div>

                    <h3 className={`text-2xl font-black mt-2 transition-colors duration-300 ${
                      hoveredId === cat._id ? 'text-white' : ''
                    }`}>
                      {cat.name}
                    </h3>

                    <p className={`text-sm mt-3 leading-relaxed transition-colors duration-300 ${
                      hoveredId === cat._id ? "text-white/70" : "text-slate-500"
                    }`}>
                      {hoveredId === cat._id
                        ? "Explore premium quality products in this category."
                        : cat.decription}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className={`flex justify-between text-[10px] font-black uppercase tracking-widest mb-4 transition-colors ${
                      hoveredId === cat._id ? 'text-white/60' : 'text-slate-400'
                    }`}>
                      <span>13+ Countries</span>
                    </div>

                    <div className={`flex justify-between items-center pt-4 border-t transition-all duration-300 ${
                      hoveredId === cat._id ? 'text-white border-white/20' : 'text-slate-300 border-slate-100'
                    }`}>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Explore Unit</span>
                      <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default GlobalPortal;