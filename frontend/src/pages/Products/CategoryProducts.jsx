import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getService } from "../../service/axios";

/* ─── SUB-CATEGORY CARD ─────────────────────────────────────────────────── */
const SubcategoryCard = ({ sub, index, onClick }) => {
  const available = sub.status === "Available";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.07,
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        onClick={() => available && onClick(sub)}
        className={`cd-card ${available ? "cd-card--available" : "cd-card--unavailable"
          }`}
        style={{
          cursor: available ? "pointer" : "not-allowed",
        }}
      >
        {/* always-visible image */}
        {sub.subcategoryImage && (
          <img
            className="cd-card__img"
            src={sub.subcategoryImage}
            alt={sub.name}
            loading="lazy"
          />
        )}

        <div className="cd-card__scrim" />

        <div className="cd-card__body">
          {/* top row */}
          <div className="cd-card__top">
            <span
              className={`cd-badge ${available ? "cd-badge--green" : "cd-badge--red"
                }`}
            >
              {sub.status}
            </span>

            {sub.skuId && (
              <span className="cd-sku">{sub.skuId}</span>
            )}
          </div>

          {/* bottom */}
          <div>
            <h3 className="cd-card__name">{sub.name}</h3>
            <p className="cd-card__desc">{sub.decription}</p>

            <div className="cd-card__foot">
              <div className="cd-card__arrow">
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== DARK PREMIUM STATUS STYLES ===== */}
      <style>{`
        /* Available Card Border */
        .cd-card--available {
          border-color: rgba(16,185,129,0.25);
        }

        /* Unavailable Card Effect */
        .cd-card--unavailable {
          border-color: rgba(239,68,68,0.25);
          filter: grayscale(40%);
          opacity: 0.85;
        }

        /* Dark Available Badge */
        .cd-badge--green {
          background: linear-gradient(135deg, #064e3b, #065f46);
          color: #d1fae5;
          border: 1px solid #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        }

        /* Dark Unavailable Badge */
        .cd-badge--red {
          background: linear-gradient(135deg, #7f1d1d, #991b1b);
          color: #fee2e2;
          border: 1px solid #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
        }
      `}</style>
    </>
  );
};

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────── */
export default function CategoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [subCategory, setSubCateogory] = useState([]);
  const [category, setCategory] = useState(null);
  const [subCategoryCount, setSubCategoryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSuggestionClick, setIsSuggestionClick] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      setLoading(true);

      const start = Date.now(); // track time

      const apiResponse = await getService(
        `/customer/product/category/${id}`
      );

      const end = Date.now();
      const elapsed = end - start;

      // ensure minimum 2 seconds loading
      const remaining = 2000 - elapsed;

      if (remaining > 0) {
        await new Promise((res) => setTimeout(res, remaining));
      }

      if (apiResponse.ok) {
        setCategory(apiResponse.data.data);
      }

      setLoading(false);
    };

    fetchCategory();
  }, [id]);

  useEffect(() => {
    if (!id || searchQuery) return;

    const fetchSubcategories = async () => {
      setLoading(true);

      const start = Date.now();

      const apiResponse = await getService(
        `/customer/product/subcategorybycategoryId?categoryId=${id}&page=${currentPage}&limit=12`
      );

      const end = Date.now();
      const elapsed = end - start;
      const remaining = 2000 - elapsed;

      if (remaining > 0) {
        await new Promise((res) => setTimeout(res, remaining));
      }

      if (apiResponse.ok) {
        const data = apiResponse.data.data;
        setSubCateogory(data.subcategoryList);
        setSubCategoryCount(data.totalItems);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPage);
      }

      setLoading(false);
    };

    fetchSubcategories();
  }, [id, currentPage, searchQuery]);

  useEffect(() => {
    if (!searchQuery) return;
    const delayDebounce = setTimeout(async () => {
      const apiResponse = await getService(
        `/customer/search/subcategory?keyword=${searchQuery}&categoryId=${id}&page=${currentPage}&limit=12`,
      );
      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        return;
      }
      const data = apiResponse.data.data;
      setSubCateogory(data.subcategories);
      setSubCategoryCount(data.subcategories.length);
      setTotalPages(data.pagination.totalPage);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (!searchQuery || isSuggestionClick) {
      setSuggestions([]);
      setIsSuggestionClick(false);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      const apiResponse = await getService(
        `/customer/search/suggestion/subcategory?keyword=${searchQuery}&categoryId=${id}`,
      );
      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        return;
      }
      setSuggestions(apiResponse.data.data.subcategories);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  /* ── RENDER ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Sora:wght@700;800&display=swap');

        .cd-page {
          font-family: 'Inter', sans-serif;
          background: #fff;
          color: #111;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .cd-hero {
          position: relative;
          height: 56vh;
          min-height: 380px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          background: #0a0f1a;
        }
        .cd-hero__img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          opacity: 0.28;
          transition: opacity 0.8s;
        }
        .cd-hero__fade {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(10,15,26,0.1) 0%, #0a0f1a 100%);
        }
        .cd-hero__content {
          position: relative; z-index: 5;
          max-width: 1160px; margin: 0 auto;
          width: 100%; padding: 0 24px 48px;
        }
        .cd-breadcrumb {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          margin-bottom: 20px; background: none; border: none; cursor: pointer;
          transition: color 0.2s;
        }
        .cd-breadcrumb:hover { color: #C36A4D; }
        .cd-hero h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(36px, 7vw, 72px);
          font-weight: 800; color: #fff;
          letter-spacing: -0.03em; line-height: 1;
          margin: 0;
        }

        /* ── TOOLBAR ── */
        .cd-toolbar {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8e8e8;
        }
        .cd-toolbar__inner {
          max-width: 1160px; margin: 0 auto;
          padding: 16px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .cd-count {
          font-size: 11px; font-weight: 500; letter-spacing: 0.16em;
          text-transform: uppercase; color: #999;
          white-space: nowrap;
        }
        .cd-search-wrap { position: relative; width: 100%; max-width: 320px; }
        .cd-search {
          width: 100%;
          background: #f4f5f7;
          border: 1.5px solid #e8e8e8;
          border-radius: 10px;
          padding: 10px 40px 10px 16px;
          font-size: 13px; font-family: 'Inter', sans-serif;
          color: #111; outline: none;
          transition: border-color 0.2s;
        }
        .cd-search::placeholder { color: #aaa; }
        .cd-search:focus { border-color: #C36A4D; background: #fff; }
        .cd-search-icon {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          color: #bbb; pointer-events: none;
        }
        .cd-suggestions {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0;
          background: #fff; border: 1px solid #e8e8e8;
          border-radius: 12px; overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10); z-index: 100;
        }
        .cd-suggestion-item {
          padding: 12px 16px; font-size: 13px; color: #444; cursor: pointer;
          transition: background 0.15s;
        }
        .cd-suggestion-item:hover { background: #f4f5f7; }

        /* ── MAIN ── */
        .cd-main {
          max-width: 1160px; margin: 0 auto;
          padding: 56px 24px 96px;
        }

        /* ── GRID ── */
        .cd-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        /* ── CARD ── */
        .cd-card {
          position: relative; border-radius: 16px; overflow: hidden;
          height: 300px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          border: 1.5px solid #eaeaea;
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s;
        }
        .cd-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.13);
          border-color: #c5d8f7;
        }
        .cd-card__img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
        }
        .cd-card:hover .cd-card__img { transform: scale(1.05); }
        .cd-card__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(5,10,20,0.06) 0%, rgba(5,10,20,0.70) 55%, rgba(5,10,20,0.92) 100%);
          transition: background 0.3s;
        }
        .cd-card:hover .cd-card__scrim {
          background: linear-gradient(180deg, rgba(5,10,20,0.14) 0%, rgba(5,10,20,0.80) 55%, rgba(5,10,20,0.96) 100%);
        }
        .cd-card__body {
          position: relative; z-index: 5; height: 100%; padding: 20px;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .cd-card__top { display: flex; align-items: center; justify-content: space-between; }

        /* badge */
        .cd-badge {
          font-size: 9px; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; padding: 4px 10px;
          border-radius: 100px; border: 1px solid;
        }
        .cd-badge--green { color: #34d399; border-color: rgba(52,211,153,0.35); background: rgba(52,211,153,0.1); }
        .cd-badge--red   { color: #f87171; border-color: rgba(248,113,113,0.35); background: rgba(248,113,113,0.1); }

        .cd-sku { font-size: 9px; color: rgba(255,255,255,0.3); font-family: monospace; letter-spacing: 0.1em; }

        .cd-card__name {
          font-family: 'Sora', sans-serif;
          font-size: 20px; font-weight: 700; color: #fff;
          margin: 0 0 6px; line-height: 1.2;
          transition: color 0.25s;
        }
        .cd-card:hover .cd-card__name { color: #C36A4D; }

        .cd-card__desc {
          font-size: 12px; font-weight: 300; color: rgba(255,255,255,0.55);
          line-height: 1.6; margin: 0 0 14px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .cd-card__foot { display: flex; justify-content: flex-end; }
        .cd-card__arrow {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid rgba(255,255,255,0.2); color: #fff;
          transition: all 0.25s;
        }
        .cd-card:hover .cd-card__arrow { background: #C36A4D; border-color: #C36A4D; transform: translateX(2px); }

        /* ── EMPTY STATE ── */
        .cd-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 96px 0; text-align: center;
        }
        .cd-empty__icon {
          width: 72px; height: 72px; border-radius: 18px;
          background: #f4f5f7; border: 1.5px solid #e8e8e8;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px; color: #C36A4D;
        }
        .cd-empty h2 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(22px, 4vw, 32px); font-weight: 700;
          color: #111; margin: 0 0 12px;
        }
        .cd-empty p { font-size: 15px; color: #888; max-width: 400px; line-height: 1.6; }

        /* ── PAGINATION ── */
        .cd-pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 56px; }
        .cd-page-btn {
          padding: 9px 20px; border-radius: 8px; font-size: 12px; font-weight: 500;
          border: 1.5px solid #e8e8e8; background: #fff; color: #444; cursor: pointer;
          transition: all 0.2s;
        }
        .cd-page-btn:hover:not(:disabled) { border-color: #C36A4D; color: #C36A4D; }
        .cd-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .cd-page-num {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 500; border: 1.5px solid #e8e8e8;
          background: #fff; color: #555; cursor: pointer; transition: all 0.2s;
        }
        .cd-page-num:hover { border-color: #C36A4D; color: #C36A4D; }
        .cd-page-num--active { background: #C36A4D; border-color: #C36A4D; color: #fff; }

        /* loading dots */
        .cd-loading { display: flex; justify-content: center; gap: 6px; padding: 80px 0; }
        .cd-dot { width: 7px; height: 7px; border-radius: 50%; background: #C36A4D; animation: bdot 1.2s ease-in-out infinite; }
        .cd-dot:nth-child(2) { animation-delay: 0.2s; }
        .cd-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bdot { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-8px);opacity:1} }

        @media (max-width: 600px) {
          .cd-grid { grid-template-columns: 1fr; }
          .cd-toolbar__inner { flex-direction: column; align-items: flex-start; }
          .cd-search-wrap { max-width: 100%; }
        }
      `}</style>

      <div className="cd-page">
        {/* ── HERO ── */}
        <section className="cd-hero">
          {category?.categoryImage && (
            <img
              className="cd-hero__img"
              src={category.categoryImage}
              alt={category?.name}
            />
          )}
          <div className="cd-hero__fade" />
          <div className="cd-hero__content">
            <AnimatePresence mode="wait">
              <motion.div
                key={category?._id || "cat"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <button className="cd-breadcrumb" onClick={() => navigate(-1)}>
                  <ArrowLeft size={12} />
                  Back
                </button>
                <h1>{category?.name}</h1>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── TOOLBAR ── */}
        <div className="cd-toolbar">
          <div className="cd-toolbar__inner">
            <span className="cd-count">{subCategoryCount} Subcategories</span>
            <div className="cd-search-wrap">
              <input
                type="text"
                className="cd-search"
                placeholder="Search subcategories…"
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchQuery(e.target.value);
                }}
              />
              <Search size={14} className="cd-search-icon" />
              {suggestions.length > 0 && (
                <div className="cd-suggestions">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      className="cd-suggestion-item"
                      onClick={() => {
                        setIsSuggestionClick(true);
                        setSearchQuery(item.name);
                        setSuggestions([]);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <main className="cd-main">
          {loading ? (
            <div className="cd-loading">
              <div className="cd-dot" />
              <div className="cd-dot" />
              <div className="cd-dot" />
            </div>
          ) : subCategory.length > 0 ? (
            <div className="cd-grid">
              {subCategory.map((sub, i) => (
                <SubcategoryCard
                  key={sub._id}
                  sub={sub}
                  index={i}
                  onClick={(sub) => navigate(`/products/${sub._id}`)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="cd-empty"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="cd-empty__icon">
                <Search size={28} />
              </div>
              <h2>No Subcategories Found</h2>
              <p>
                We couldn't find any matching results. Try adjusting your search
                or explore other categories.
              </p>
            </motion.div>
          )}

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="cd-pagination">
              <button
                className="cd-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={`cd-page-num${currentPage === p ? " cd-page-num--active" : ""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                className="cd-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
