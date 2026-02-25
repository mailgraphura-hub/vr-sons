import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  ArrowUpRight,
  LayoutGrid,
  List,
  ChevronRight,
  Tag,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getService } from "../../service/axios";



const SubcategoryCard = ({ sub, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    onClick={() => sub.status === "Available" && onClick(sub)}
    className={`group relative overflow-hidden rounded-3xl cursor-pointer border transition-all duration-500
      ${sub.status === "Available"
        ? "border-white/10 hover:border-[#C36A4D]/40 hover:shadow-[0_30px_60px_-15px_rgba(195,106,77,0.25)]"
        : "border-white/5 opacity-50 cursor-not-allowed"
      }`}
  >
    {/* Background Image */}
    <div className="absolute inset-0">
      <img
        src={sub.subcategoryImage}
        alt={sub.name}
        className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent" />
    </div>

    <div className="relative z-10 p-7 flex flex-col h-64 justify-between">
      <div className="flex items-start justify-between">
        <span className={`text-[9px] font-black tracking-[0.3em] uppercase px-3 py-1.5 rounded-full border
          ${sub.status === "Available"
            ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
            : "text-red-400 border-red-400/30 bg-red-400/10"
          }`}>
          {sub.status}
        </span>
        <span className="text-white/20 text-[9px] font-mono tracking-widest">{sub.skuId}</span>
      </div>

      <div>
        <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-[#C36A4D] transition-colors duration-300">
          {sub.name}
        </h3>
        <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{sub.decription}</p>
      </div>

      <div className="flex items-center justify-between">
        {/* <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">
          {(MOCK_PRODUCTS[sub._id] || []).length} Products
        </span> */}
        <div
          className="ml-auto w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#C36A4D] group-hover:border-[#C36A4D] transition-all duration-300"
        >
          <ChevronRight
            size={14}
            className="text-white/40 group-hover:text-white transition-colors"
          />
        </div>
      </div>
    </div>
  </motion.div>
);


export default function CategoryDetail() {

  const navigate = useNavigate()

  const { id } = useParams();

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

    (async () => {
      const apiResponse = await getService(`/customer/product/category/${id}`);
      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        return
      };
      setCategory(apiResponse.data.data);
    })();
  }, [id]);


  useEffect(() => {
    if (!id || searchQuery) return;

    (async () => {
      const apiResponse = await getService(
        `/customer/product/subcategorybycategoryId?categoryId=${id}&page=${currentPage}&limit=12`
      );

      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        return
      };

      const data = apiResponse.data.data;

      setSubCateogory(data.subcategoryList);
      setSubCategoryCount(data.totalItems);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPage);
    })();

  }, [id, currentPage, searchQuery]);


  useEffect(() => {
    if (!searchQuery) return;

    const delayDebounce = setTimeout(async () => {
      const apiResponse = await getService(
        `/customer/search/subcategory?keyword=${searchQuery}&categoryId=${id}&page=${currentPage}&limit=12`
      );

      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        return
      };

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
        `/customer/search/suggestion/subcategory?keyword=${searchQuery}&categoryId=${id}`
      );

      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        return
      };

      setSuggestions(apiResponse.data.data.subcategories);
    }, 300);

    return () => clearTimeout(delayDebounce);

  }, [searchQuery]);

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white font-sans">

      {/* HERO SAME AS BEFORE */}
      <section className="relative h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 overflow-hidden">

        <div className="absolute inset-0">
          <img
            src={category?.categoryImage}
            alt={category?.name}
            className="w-full h-full object-cover transition-all duration-1000"
            style={{ filter: "brightness(0.25) saturate(0.6)" }}
          />

          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/30">

            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 transition-colors ${"hover:text-[#C36A4D] cursor-pointer"
                }`}
            >
              <ArrowLeft size={11} onClick={() => navigate(-1)} />
              {category?.name}
            </button>

          </div>

          {/* Title & Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={category?._id || "category"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className="text-white font-black uppercase tracking-tighter leading-[0.8] mb-6"
                style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
              >
                {category?.name}
              </h1>

            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* TOOLBAR */}
      <div className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">

          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25">
            {subCategoryCount} Subcategories
          </span>

          <div className="relative w-full sm:w-80">
            <Search size={13} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="SEARCH SUBCATEGORIES..."
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full bg-white/5 border border-white/8 rounded-full px-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none text-white"
            />

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-[#111111] border border-white/10 rounded-xl overflow-hidden z-50">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setIsSuggestionClick(true);
                      setSearchQuery(item.name);
                      setSuggestions([]);
                    }}
                    className="px-4 py-3 text-sm text-white/70 hover:bg-white/5 cursor-pointer"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto py-16 px-6">


        {subCategory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <Search size={32} className="text-[#C36A4D]" />
            </div>

            <h2
              className="text-white font-black uppercase tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              No Subcategories Found
            </h2>

            <p className="text-white/40 text-lg max-w-md leading-relaxed">
              We couldn’t find any matching results. Try adjusting your search or explore other categories.
            </p>
          </motion.div>
        )}


        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border
                ${currentPage === 1
                  ? "border-white/5 text-white/20 cursor-not-allowed"
                  : "border-white/10 hover:border-[#C36A4D]/40 hover:text-[#C36A4D]"
                }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-9 h-9 rounded-full text-xs font-black border
                    ${currentPage === pageNumber
                      ? "bg-[#C36A4D] border-[#C36A4D] text-white"
                      : "border-white/10 text-white/30 hover:border-[#C36A4D]/40 hover:text-[#C36A4D]"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border
                ${currentPage === totalPages
                  ? "border-white/5 text-white/20 cursor-not-allowed"
                  : "border-white/10 hover:border-[#C36A4D]/40 hover:text-[#C36A4D]"
                }`}
            >
              Next
            </button>

          </div>
        )}
      </main>
    </div>
  );
}