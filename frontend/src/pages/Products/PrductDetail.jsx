import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Tag,
  Layers,
  ImageIcon,
  Package,
  Calendar,
  Hash,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getService } from "../../service/axios";
import InquiryForm from "../../components/user/InquiryForm";
import { userProfile } from "../../context/profileContext";

// Parse specifications safely
const parseSpecifications = (specStr = "") => {
  return specStr.split("|").map((item) => {
    const [key, ...rest] = item.split(":");
    return { key: key?.trim(), value: rest.join(":").trim() };
  });
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "";

export default function ProductDetail() {
  const { id } = useParams();

  const { user } = userProfile();

  const navigate= useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const apiResponse = await getService(
        `/customer/product/product/${id}`
      );

      if (!apiResponse.ok) {
        console.log(apiResponse.message);
        return;
      }

      setProduct(apiResponse.data.data);
    })();
  }, [id]);

  // Prevent crash before data loads
  if (!product) return null;

  const specs = parseSpecifications(product.specifications);

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white font-sans">

      {/* ── BREADCRUMB NAV ───────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.35em] text-white/25">
          <button className="flex items-center gap-1.5 hover:text-[#C36A4D] transition-colors">
            <ArrowLeft size={10} />
            {product?.categoryId?.name || ""}
          </button>
          <ChevronRight size={9} className="text-white/10" />
          <button className="hover:text-[#C36A4D] transition-colors">
            {product?.subCategoryId?.name || ""}
          </button>
          <ChevronRight size={9} className="text-white/10" />
          <span className="text-white/50">{product?.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4">

          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#111]"
          >
            {product?.productImage?.length > 0 ? (
              <img
                src={product.productImage[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={40} className="text-white/10" />
              </div>
            )}

            <div className="absolute top-4 left-4">
              {product.status === "Available" ? (
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 bg-black/70 backdrop-blur px-3 py-1.5 rounded-full border border-emerald-400/25">
                  <CheckCircle2 size={10} /> In Stock
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.3em] text-red-400 bg-black/70 backdrop-blur px-3 py-1.5 rounded-full border border-red-400/25">
                  <XCircle size={10} /> Out of Stock
                </span>
              )}
            </div>

            {product?.productImage?.length > 1 && (
              <div className="absolute bottom-4 right-4 text-[9px] font-black text-white/30 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
                {activeImage + 1} / {product.productImage.length}
              </div>
            )}
          </motion.div>

          {product?.productImage?.length > 1 && (
            <div className="flex gap-3">
              {product.productImage.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300
                    ${activeImage === i
                      ? "border-[#C36A4D] shadow-[0_0_20px_rgba(195,106,77,0.3)]"
                      : "border-white/5 opacity-40 hover:opacity-70"
                    }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-8">

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="flex items-center gap-1.5 text-[9px] font-mono text-white/30 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">
                <Hash size={9} /> {product.skuId}
              </span>

              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#C36A4D] bg-[#C36A4D]/10 border border-[#C36A4D]/20 px-3 py-1.5 rounded-full">
                <Tag size={9} /> {product?.categoryId?.name || ""}
              </span>

              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">
                <Package size={9} /> {product?.subCategoryId?.name || ""}
              </span>
            </div>

            <h1 className="text-white font-black uppercase tracking-tighter leading-[0.85] mb-5"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              {product.name}
            </h1>

            <p className="text-white/45 text-[15px] leading-[1.8] font-light">
              {product.description}
            </p>
          </div>

          <div className="h-px bg-white/5" />

          {/* Specifications */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Layers size={14} className="text-[#C36A4D]" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                Specifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 bg-white/3 border border-white/5 rounded-xl px-4 py-3"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">
                    {spec.key}
                  </span>
                  <span className="text-[11px] font-mono text-white/65 text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Meta */}
          <div className="flex flex-wrap gap-5">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.35em] text-white/20 mb-1">
                Listed
              </p>
              <p className="text-[11px] font-mono text-white/40">
                {formatDate(product.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.35em] text-white/20 mb-1">
                Updated
              </p>
              <p className="text-[11px] font-mono text-white/40">
                {formatDate(product.updatedAt)}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                }
                setShowInquiry(true)
              }}
              className="flex-1 px-6 py-4 rounded-2xl bg-[#C36A4D] text-white text-[11px] font-black uppercase tracking-[0.35em] hover:bg-[#d4785a] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(195,106,77,0.35)]">
              Send Inquiry
            </button>

            <button className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-[11px] font-black uppercase tracking-[0.35em] hover:bg-white/10 hover:text-white transition-all duration-300">
              Download Spec Sheet
            </button>
          </motion.div>

          {showInquiry && <InquiryForm
            productName={product.name}
            show={showInquiry}
            onClose={() => setShowInquiry(false)}
          />}
        </div>
      </div>
    </div>
  );
}