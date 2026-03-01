import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  ArrowUpRight,
  ChevronRight,
  Tag,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getService } from "../../service/axios";

/* ─── PRODUCT CARD ──────────────────────────────────────────────────────── */
const ProductCard = ({ product, index, onClick }) => {
  const available = product.status === "Available";

  return (
    <motion.div
      onClick={onClick}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: index * 0.06,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="pl-card"
    >
      {/* Image */}
      <div className="pl-card__img-wrap">
        {product.productImage?.[0] ? (
          <img
            className="pl-card__img"
            src={product.productImage[0]}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="pl-card__img-placeholder">
            <Tag size={28} color="#ccc" />
          </div>
        )}
        <span
          className={`pl-card__badge ${available ? "pl-card__badge--green" : "pl-card__badge--red"}`}
        >
          {available ? <CheckCircle2 size={9} /> : <XCircle size={9} />}
          {available ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Content */}
      <div className="pl-card__body">
        <div className="pl-card__sku-row">
          <span className="pl-card__sku">{product.skuId}</span>
        </div>

        <h3 className="pl-card__name">{product.name}</h3>
        <p className="pl-card__desc">{product.description}</p>

        {/* Specs snippet */}
        {product.specifications && (
          <div className="pl-card__specs">
            <p className="pl-card__specs-label">
              <Layers size={9} /> Specifications
            </p>
            <p className="pl-card__specs-val">{product.specifications}</p>
          </div>
        )}

        <div className="pl-card__foot">
          <span className="pl-card__view">View Details</span>
          <div className="pl-card__arrow">
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [subcategory, setSubCateogory] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSuggestionClick, setIsSuggestionClick] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ── API calls (unchanged) ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!id) return;
    (async () => {
      const apiResponse = await getService(
        `/customer/product/subcategory/${id}`,
      );
      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        setLoading(false);
        return;
      }
      setSubCateogory(apiResponse.data.data);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!id || searchQuery) return;
    (async () => {
      const apiResponse = await getService(
        `/customer/product/productbyparentId?subCategoryId=${id}&page=${currentPage}&limit=12`,
      );
      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        setLoading(false);
        return;
      }
      const data = apiResponse.data.data;
      setProduct(data.productList);
      setProductCount(data.totalItems);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPage);
      setLoading(false);
    })();
  }, [id, currentPage, searchQuery]);

  useEffect(() => {
    if (!searchQuery) return;
    const delayDebounce = setTimeout(async () => {
      const apiResponse = await getService(
        `/customer/search/product?keyword=${searchQuery}&subCategoryId=${id}&page=${currentPage}&limit=12`,
      );
      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        setLoading(false);
        return;
      }
      const data = apiResponse.data.data;
      setProduct(data.products);
      setProductCount(data.products.length);
      setTotalPages(data.pagination.totalPage);
      setLoading(false);
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
        `/customer/search/suggestion/product?keyword=${searchQuery}&subCategoryId=${id}`,
      );
      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        return;
      }
      console.log(apiResponse.data.data.products);
      setSuggestions(apiResponse.data.data.products);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  /* ── RENDER ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Sora:wght@700;800&display=swap');

        .pl { font-family: 'Inter', sans-serif; background: #fff; color: #111; min-height: 100vh; overflow-x: hidden; }

        /* ── HERO ── */
        .pl-hero {
          position: relative; height: 52vh; min-height: 340px;
          display: flex; flex-direction: column; justify-content: flex-end;
          overflow: hidden; background: #0a0f1a;
        }
        .pl-hero__img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover; opacity: 0.28;
          transition: opacity 0.8s;
        }
        .pl-hero__fade {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(10,15,26,0.1) 0%, #0a0f1a 100%);
        }
        .pl-hero__content {
          position: relative; z-index: 5;
          max-width: 1160px; margin: 0 auto;
          width: 100%; padding: 0 24px 44px;
        }
        .pl-breadcrumb {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); background: none; border: none; cursor: pointer;
          margin-bottom: 18px; transition: color 0.2s; padding: 0;
          font-family: 'Inter', sans-serif;
        }
        .pl-breadcrumb:hover { color: #C36A4D; }
        .pl-hero h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(34px, 6.5vw, 68px);
          font-weight: 800; color: #fff;
          letter-spacing: -0.03em; line-height: 1; margin: 0;
        }

        /* ── TOOLBAR ── */
        .pl-toolbar {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8e8e8;
        }
        .pl-toolbar__inner {
          max-width: 1160px; margin: 0 auto;
          padding: 14px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .pl-count {
          font-size: 11px; font-weight: 500; letter-spacing: 0.16em;
          text-transform: uppercase; color: #999; white-space: nowrap;
        }
        .pl-search-wrap { position: relative; width: 100%; max-width: 320px; }
        .pl-search {
          width: 100%; background: #f4f5f7; border: 1.5px solid #e8e8e8;
          border-radius: 10px; padding: 10px 40px 10px 16px;
          font-size: 13px; font-family: 'Inter', sans-serif;
          color: #111; outline: none; transition: border-color 0.2s;
        }
        .pl-search::placeholder { color: #aaa; }
        .pl-search:focus { border-color: #C36A4D; background: #fff; }
        .pl-search-icon {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          color: #bbb; pointer-events: none;
        }
        .pl-suggestions {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0;
          background: #fff; border: 1px solid #e8e8e8; border-radius: 12px;
          overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.10); z-index: 100;
        }
        .pl-suggestion-item {
          padding: 12px 16px; font-size: 13px; color: #444;
          cursor: pointer; transition: background 0.15s;
        }
        .pl-suggestion-item:hover { background: #f4f5f7; }

        /* ── MAIN ── */
        .pl-main { max-width: 1160px; margin: 0 auto; padding: 52px 24px 96px; }

        /* ── GRID ── */
        .pl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        /* ── CARD ── */
        .pl-card {
          background: #fff; border: 1.5px solid #eaeaea;
          border-radius: 16px; overflow: hidden; cursor: pointer;
          display: flex; flex-direction: column;
          transition: transform 0.26s ease, box-shadow 0.26s ease, border-color 0.26s;
        }
        .pl-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 48px rgba(0,0,0,0.10);
          border-color: #c5d8f7;
        }

        /* card image */
        .pl-card__img-wrap {
          position: relative; width: 100%; height: 200px;
          background: #f3f5f8; overflow: hidden; flex-shrink: 0;
        }
        .pl-card__img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
          filter: grayscale(20%);
        }
        .pl-card:hover .pl-card__img { transform: scale(1.05); filter: grayscale(0); }
        .pl-card__img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
        }

        /* status badge */
        .pl-card__badge {
          position: absolute; top: 12px; left: 12px;
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 100px; border: 1px solid;
          backdrop-filter: blur(6px);
        }
        .pl-card__badge--green { color: #059669; border-color: rgba(5,150,105,0.3); background: rgba(255,255,255,0.85); }
        .pl-card__badge--red   { color: #dc2626; border-color: rgba(220,38,38,0.3);  background: rgba(255,255,255,0.85); }

        /* card body */
        .pl-card__body { padding: 20px; display: flex; flex-direction: column; flex: 1; gap: 10px; }

        .pl-card__sku-row { display: flex; justify-content: space-between; align-items: center; }
        .pl-card__sku { font-size: 10px; font-family: monospace; color: #bbb; letter-spacing: 0.08em; }

        .pl-card__name {
          font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700;
          color: #111; margin: 0; line-height: 1.2;
          transition: color 0.22s;
        }
        .pl-card:hover .pl-card__name { color: #C36A4D; }

        .pl-card__desc {
          font-size: 13px; font-weight: 300; color: #666; line-height: 1.6; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        /* specs snippet */
        .pl-card__specs {
          background: #f8f9fb; border: 1px solid #eaeaea; border-radius: 10px;
          padding: 10px 12px;
        }
        .pl-card__specs-label {
          display: flex; align-items: center; gap: 5px;
          font-size: 9px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #bbb; margin-bottom: 5px;
        }
        .pl-card__specs-val {
          font-size: 11px; font-family: monospace; color: #777; line-height: 1.5;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* card footer */
        .pl-card__foot {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 12px; border-top: 1px solid #eaeaea; margin-top: auto;
        }
        .pl-card__view { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; color: #aaa; }
        .pl-card__arrow {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #e0e0e0; color: #aaa;
          transition: all 0.22s;
        }
        .pl-card:hover .pl-card__arrow { background: #C36A4D; border-color: #C36A4D; color: #fff; transform: translate(2px,-2px); }

        /* ── EMPTY STATE ── */
        .pl-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 96px 0; text-align: center;
        }
        .pl-empty__icon {
          width: 72px; height: 72px; border-radius: 18px;
          background: #f4f5f7; border: 1.5px solid #e8e8e8;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px; color: #C36A4D;
        }
        .pl-empty h2 {
          font-family: 'Sora', sans-serif; font-size: clamp(22px,4vw,30px);
          font-weight: 700; color: #111; margin: 0 0 10px;
        }
        .pl-empty p { font-size: 15px; color: #888; max-width: 380px; line-height: 1.6; }

        /* ── PAGINATION ── */
        .pl-pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 52px; }
        .pl-page-btn {
          padding: 9px 20px; border-radius: 8px; font-size: 12px; font-weight: 500;
          border: 1.5px solid #e8e8e8; background: #fff; color: #555;
          cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .pl-page-btn:hover:not(:disabled) { border-color: #C36A4D; color: #C36A4D; }
        .pl-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .pl-page-num {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 500; border: 1.5px solid #e8e8e8;
          background: #fff; color: #555; cursor: pointer; transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .pl-page-num:hover { border-color: #C36A4D; color: #C36A4D; }
        .pl-page-num--active { background: #C36A4D; border-color: #C36A4D; color: #fff; }

        /* loading dots */
        .pl-loading { display: flex; justify-content: center; gap: 6px; padding: 80px 0; }
        .pl-dot { width: 7px; height: 7px; border-radius: 50%; background: #C36A4D; animation: pldot 1.2s ease-in-out infinite; }
        .pl-dot:nth-child(2) { animation-delay: 0.2s; }
        .pl-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pldot { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-8px);opacity:1} }

        @media (max-width: 600px) {
          .pl-grid { grid-template-columns: 1fr; }
          .pl-toolbar__inner { flex-direction: column; align-items: flex-start; }
          .pl-search-wrap { max-width: 100%; }
        }
      `}</style>

      <div className="pl">
        {/* ── HERO ── */}
        <section className="pl-hero">
          {subcategory?.subcategoryImage && (
            <img
              className="pl-hero__img"
              src={subcategory.subcategoryImage}
              alt={subcategory?.name}
            />
          )}
          <div className="pl-hero__fade" />
          <div className="pl-hero__content">
            <AnimatePresence mode="wait">
              <motion.div
                key={subcategory?._id || "sub"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <button className="pl-breadcrumb" onClick={() => navigate(-1)}>
                  <ArrowLeft size={12} /> Back
                </button>
                <h1>{subcategory?.name}</h1>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── TOOLBAR ── */}
        <div className="pl-toolbar">
          <div className="pl-toolbar__inner">
            <span className="pl-count">{productCount} Products</span>
            <div className="pl-search-wrap">
              <input
                type="text"
                className="pl-search"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchQuery(e.target.value);
                }}
              />
              <Search size={14} className="pl-search-icon" />
              {suggestions.length > 0 && (
                <div className="pl-suggestions">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      className="pl-suggestion-item"
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
        <main className="pl-main">
          {loading ? (
            <div className="pl-loading">
              <div className="pl-dot" />
              <div className="pl-dot" />
              <div className="pl-dot" />
            </div>
          ) : product.length > 0 ? (
            <div className="pl-grid">
              {product.map((item, i) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  index={i}
                  layout="grid"
                  onClick={() => navigate(`/productsDetail/${item._id}`)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="pl-empty"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="pl-empty__icon">
                <Search size={28} />
              </div>
              <h2>No Products Found</h2>
              <p>
                We couldn't find any matching products. Try adjusting your
                search or explore other subcategories.
              </p>
            </motion.div>
          )}

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="pl-pagination">
              <button
                className="pl-page-btn"
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
                    className={`pl-page-num${currentPage === p ? " pl-page-num--active" : ""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                className="pl-page-btn"
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
