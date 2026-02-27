import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getService } from "../../service/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&q=80&w=2000";
const TYPING_TEXT =
  "Optimizing the flow of international trade with precision.";

const GlobalPortal = () => {
  const [categories, setCategory] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const navigate = useNavigate();

  // ── API (unchanged) ───────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const apiResponse = await getService("/customer/product/category");
      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        return;
      }
      setCategory(apiResponse.data.data.categoryList);
    })();
  }, []);

  // ── TYPING EFFECT (unchanged) ─────────────────────────────────────────────
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(TYPING_TEXT.slice(0, i));
      i++;
      if (i > TYPING_TEXT.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const heroContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const cardContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const cardItem = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const Counter = ({ value, suffix }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 1500;
      const step = Math.ceil(value / (duration / 16));

      const timer = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <span>
        {count}
        {suffix}
      </span>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Sora:wght@700;800&display=swap');

        .gp { font-family: 'Inter', sans-serif; background: #fff; color: #111; overflow-x: hidden; }

        /* ── HERO ── */
        .gp-hero {
          position: relative; height: 88vh; min-height: 520px;
          display: flex; align-items: center; justify-content: center;
          text-align: center; overflow: hidden; background: #0a0f1a;
        }
        .gp-hero__bg {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover; opacity: 0.22;
        }
        .gp-hero__fade {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(10,15,26,0.3) 0%, #0a0f1a 100%);
        }
        .gp-hero__content { position: relative; z-index: 5; max-width: 700px; padding: 0 24px; }

        .gp-hero__tag {
          display: inline-block; font-size: 11px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #C36A4D; margin-bottom: 20px;
        }
        .gp-hero h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(38px, 7vw, 74px);
          font-weight: 800; line-height: 1.05;
          color: #fff; letter-spacing: -0.03em; margin: 0 0 18px;
        }
        .gp-hero h1 span { color: #C36A4D; }
        .gp-hero__sub { font-size: 15px; font-weight: 300; color: #6d849e; min-height: 1.5em; }
        .gp-cursor { color: #C36A4D; animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        /* ── STATS ── */
        .gp-stats { background: #f8f9fb; border-bottom: 1px solid #e8e8e8; }
        .gp-stats__row { max-width: 860px; margin: 0 auto; display: flex; flex-wrap: wrap; }
        .gp-stat {
          flex: 1 1 150px; padding: 26px 20px; text-align: center;
          border-right: 1px solid #e8e8e8;
        }
        .gp-stat:last-child { border-right: none; }
        .gp-stat__n {
          font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 800;
          color: #111; letter-spacing: -0.03em; line-height: 1;
        }
        .gp-stat__l { font-size: 10px; font-weight: 500; color: #999; letter-spacing: 0.14em; text-transform: uppercase; margin-top: 5px; }

        /* ── CATEGORIES SECTION ── */
        .gp-cats { padding: 72px 24px 96px; }
        .gp-cats__inner { max-width: 1160px; margin: 0 auto; }

        .gp-sec-label { font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #C36A4D; margin-bottom: 8px; }
        .gp-sec-title {
          font-family: 'Sora', sans-serif; font-size: clamp(24px, 4vw, 36px);
          font-weight: 700; color: #111; letter-spacing: -0.02em; margin: 0 0 40px;
        }

        /* ── GRID ── */
        .gp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }

        /* ── CARD ── always shows image ── */
        .gp-card {
          position: relative; border-radius: 16px; overflow: hidden;
          height: 340px; cursor: pointer;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .gp-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.16); }

        /* image always visible */
        .gp-card__img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gp-card:hover .gp-card__img { transform: scale(1.05); }

        /* gradient scrim — always present, deepens on hover */
        .gp-card__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(5,10,20,0.08) 0%, rgba(5,10,20,0.72) 60%, rgba(5,10,20,0.90) 100%);
          transition: background 0.3s;
        }
        .gp-card:hover .gp-card__scrim {
          background: linear-gradient(180deg, rgba(5,10,20,0.18) 0%, rgba(5,10,20,0.82) 55%, rgba(5,10,20,0.96) 100%);
        }

        /* fallback bg when image not loaded */
        .gp-card__fallback {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #1a2a40 0%, #0e1828 100%);
        }

        /* card body */
        .gp-card__body {
          position: relative; z-index: 5; height: 100%; padding: 22px;
          display: flex; flex-direction: column; justify-content: flex-end;
        }

        .gp-card__name {
          font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 700;
          color: #fff; margin: 0 0 7px; line-height: 1.2;
        }
        .gp-card__desc {
          font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.65);
          line-height: 1.6; margin: 0 0 16px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .gp-card__foot {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.15);
        }
        .gp-card__badge { font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.5); }

        .gp-card__arrow {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid rgba(255,255,255,0.25); color: #fff;
          transition: all 0.25s;
        }
        .gp-card:hover .gp-card__arrow { background: #C36A4D; border-color: #C36A4D; transform: translate(2px, -2px); }

        /* ── LOADING ── */
        .gp-loading { grid-column: 1/-1; padding: 60px 0; display: flex; justify-content: center; gap: 6px; }
        .gp-dot { width: 7px; height: 7px; border-radius: 50%; background: #C36A4D; animation: bdot 1.2s ease-in-out infinite; }
        .gp-dot:nth-child(2) { animation-delay: 0.2s; }
        .gp-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bdot { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-8px);opacity:1} }

        @media (max-width: 600px) {
          .gp-stat { border-right: none; border-bottom: 1px solid #e8e8e8; }
          .gp-stat:last-child { border-bottom: none; }
          .gp-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="gp">
        <Navbar />

        {/* ── HERO ── */}
        <section className="gp-hero">
          <img
            className="gp-hero__bg"
            src={HERO_IMAGE}
            alt="Global Trade"
            loading="lazy"
          />
          <div className="gp-hero__fade" />
          <motion.div
            className="gp-hero__content"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={fadeUp} className="gp-hero__tag">
              VR &amp; Sons Import Export
            </motion.span>
            <motion.h1 variants={fadeUp}>
              Direct. <span className="text-[#C36A4D]">Global.</span>
              <br />
              Reliable.
            </motion.h1>
            <motion.p variants={fadeUp} className="gp-hero__sub">
              {displayText}
              <span className="gp-cursor">|</span>
            </motion.p>
          </motion.div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-black py-20 mt-16 md:mt-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
              {[
                { value: 13, suffix: "+", label: "Countries" },
                { value: 6, suffix: "+", label: "Categories" },
                { value: 93, suffix: "%", label: "Satisfaction" },
                { value: 10, suffix: "+", label: "Years Active" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex flex-col items-center justify-center py-10"
                >
                  <h3
                    className="text-4xl md:text-5xl font-extrabold tracking-tight 
                         bg-gradient-to-b from-[#e58c6a] to-[#b85c3e] 
                         bg-clip-text text-transparent"
                  >
                    <Counter value={s.value} suffix={s.suffix} />
                  </h3>

                  <p
                    className="mt-3 text-xs md:text-sm tracking-[0.25em] 
                        uppercase text-neutral-400"
                  >
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>c
        {/* ── CATEGORIES ── */}
        <section className="gp-cats">
          <div className="gp-cats__inner">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="gp-sec-label">Product Categories</p>
              <h2 className="gp-sec-title">Our Trade Units</h2>
            </motion.div>

            <motion.div
              className="gp-grid"
              variants={cardContainer}
              initial="hidden"
              animate="show"
            >
              {categories.length === 0 ? (
                <div className="gp-loading">
                  <div className="gp-dot" />
                  <div className="gp-dot" />
                  <div className="gp-dot" />
                </div>
              ) : (
                categories.map((cat) => (
                  <motion.div
                    key={cat._id}
                    className="gp-card"
                    variants={cardItem}
                    onMouseEnter={() => setHoveredId(cat._id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => navigate(`/CategoryProducts/${cat._id}`)}
                  >
                    {/* fallback bg */}
                    <div className="gp-card__fallback" />

                    {/* always-visible image */}
                    {cat.categoryImage && (
                      <img
                        className="gp-card__img"
                        src={cat.categoryImage}
                        alt={cat.name}
                        loading="lazy"
                      />
                    )}

                    {/* always-visible scrim */}
                    <div className="gp-card__scrim" />

                    <div className="gp-card__body">
                      <h3 className="gp-card__name">{cat.name}</h3>
                      <p className="gp-card__desc">{cat.decription}</p>
                      <div className="gp-card__foot">
                        <span className="gp-card__badge">13+ Countries</span>
                        <div className="gp-card__arrow">
                          <ArrowUpRight size={13} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default GlobalPortal;
