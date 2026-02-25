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

const ProductCard = ({ product, index, layout, onClick }) => {
    const isGrid = layout === "grid";

    return (
        <motion.div
            onClick={onClick}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.06, duration: 0.45 }}
            className={`group cursor-pointer bg-[#111111] border border-white/5 overflow-hidden transition-all duration-500
        hover:border-[#C36A4D]/30 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]
        ${isGrid ? "flex flex-col rounded-3xl" : "flex flex-row items-stretch rounded-2xl"}
      `}
        >
            {/* Image */}
            <div className={`overflow-hidden flex-shrink-0 relative
        ${isGrid ? "h-56 w-full" : "h-36 w-36"}
      `}>
                <img
                    src={product.productImage?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                {/* Status badge */}
                <div className="absolute top-3 left-3">
                    {product.status === "Available"
                        ? <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-black/60 backdrop-blur px-2 py-1 rounded-full border border-emerald-400/20">
                            <CheckCircle2 size={9} /> In Stock
                        </span>
                        : <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-red-400 bg-black/60 backdrop-blur px-2 py-1 rounded-full border border-red-400/20">
                            <XCircle size={9} /> Out of Stock
                        </span>
                    }
                </div>
            </div>

            {/* Content */}
            <div className={`flex flex-col justify-between flex-1 ${isGrid ? "p-6" : "p-6"}`}>
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-mono text-white/25 tracking-widest">{product.skuId}</span>
                        <Tag size={11} className="text-white/15" />
                    </div>

                    <h3 className="text-white text-xl font-black uppercase tracking-tight mb-3 group-hover:text-[#C36A4D] transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-white/35 text-sm leading-relaxed line-clamp-2 mb-4">
                        {product.description}
                    </p>
                </div>

                {/* Specifications */}
                <div className="bg-white/3 border border-white/5 rounded-xl p-3 mb-4">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1.5 flex items-center gap-1.5">
                        <Layers size={9} /> Specifications
                    </p>
                    <p className="text-white/50 text-[11px] font-mono leading-relaxed">
                        {product.specifications}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">View Details</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center
            group-hover:bg-[#C36A4D] transition-all duration-300">
                        <ArrowUpRight size={14} className="text-white/40 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

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


    useEffect(() => {
        if (!id) return;

        (async () => {
            const apiResponse = await getService(`/customer/product/subcategory/${id}`);
            if (!apiResponse.ok) {
                console.log(apiResponse.message);
                return
            };
            setSubCateogory(apiResponse.data.data);
        })();
    }, [id]);


    useEffect(() => {
        if (!id || searchQuery) return;

        (async () => {
            const apiResponse = await getService(
                `/customer/product/productbyparentId?subCategoryId=${id}&page=${currentPage}&limit=12`
            );

            if (!apiResponse.ok) {
                console.log(apiResponse.message);
                return
            };

            const data = apiResponse.data.data;

            setProduct(data.productList);
            setProductCount(data.totalItems);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPage);
        })();

    }, [id, currentPage, searchQuery]);


    useEffect(() => {
        if (!searchQuery) return;

        const delayDebounce = setTimeout(async () => {
            const apiResponse = await getService(
                `/customer/search/product?keyword=${searchQuery}&subCategoryId=${id}&page=${currentPage}&limit=12`
            );

            if (!apiResponse.ok) {
                console.log(apiResponse.message);
                return
            };

            const data = apiResponse.data.data;

            setProduct(data.products);
            setProductCount(data.products.length);
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
                `/customer/search/suggestion/product?keyword=${searchQuery}&subCategoryId=${id}`
            );

            if (!apiResponse.ok) {
                console.log(apiResponse.message);
                return
            };

            console.log(apiResponse.data.data.products)
            setSuggestions(apiResponse.data.data.products);
        }, 300);

        return () => clearTimeout(delayDebounce);

    }, [searchQuery]);

    return (
        <div className="bg-[#0D0D0D] min-h-screen text-white font-sans">

            {/* HERO SAME AS BEFORE */}
            <section className="relative h-[70vh] flex flex-col justify-end px-6 md:px-16 pb-16 overflow-hidden">

                <div className="absolute inset-0">
                    <img
                        src={subcategory?.subcategoryImage}
                        alt={subcategory?.name}
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
                            {subcategory?.name}
                        </button>

                    </div>

                    {/* Title & Description */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={subcategory?._id || "subcategory"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1
                                className="text-white font-black uppercase tracking-tighter leading-[0.8] mb-6"
                                style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
                            >
                                {subcategory?.name}
                            </h1>

                        </motion.div>
                    </AnimatePresence>

                </div>
            </section>

            {/* TOOLBAR */}
            <div className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">

                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25">
                        {productCount} Product
                    </span>

                    <div className="relative w-full sm:w-80">
                        <Search size={13} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                            type="text"
                            placeholder="SEARCH PRODUCTS..."
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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