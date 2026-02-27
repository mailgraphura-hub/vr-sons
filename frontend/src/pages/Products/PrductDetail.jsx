import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Layers,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getService } from "../../service/axios";
import InquiryForm from "../../components/user/InquiryForm";
import { userProfile } from "../../context/profileContext";

/* ---------- UTIL ---------- */

const parseSpecifications = (specStr = "") => {
  return specStr
    .split(/[|,]/)
    .map((item) => {
      const [key, ...rest] = item.split(":");
      return {
        key: key?.trim(),
        value: rest.join(":").trim(),
      };
    })
    .filter((item) => item.key); // remove empty items
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "";

/* ---------- COMPONENT ---------- */

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = userProfile();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await getService(`/customer/product/product/${id}`);
      if (!res.ok) return;
      setProduct(res.data.data);
    })();
  }, [id]);

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-400">
        Loading Product...
      </div>
    );

  const specs = parseSpecifications(product.specifications);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-[#faf7f5] to-[#f5ede9] text-gray-800 overflow-hidden">

      {/* Soft background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C36A4D]/10 blur-[120px] rounded-full"></div>

      {/* Breadcrumb */}
      <div className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-[#C36A4D] transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <ChevronRight size={16} />
          <span>{product?.categoryId?.name}</span>
          <ChevronRight size={16} />
          <span className="text-gray-700 font-medium">
            {product?.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-20 relative z-10">

        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-white"
          >
            <img
              src={product?.productImage?.[activeImage]}
              alt={product.name}
              className="w-full h-[450px] object-cover"
            />

            {/* Stock Badge */}
            <div className="absolute top-6 left-6">
              {product.status === "Available" ? (
                <span className="flex items-center gap-2 bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium shadow">
                  <CheckCircle2 size={16} /> In Stock
                </span>
              ) : (
                <span className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow">
                  <XCircle size={16} /> Out of Stock
                </span>
              )}
            </div>
          </motion.div>

          {/* Thumbnails */}
          <div className="flex gap-4">
            {product?.productImage?.map((img, i) => (
              <motion.button
                whileHover={{ y: -5 }}
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${activeImage === i
                  ? "border-[#C36A4D]"
                  : "border-gray-200"
                  }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-4 text-gray-900">
              {product.name}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* SPECIFICATIONS */}
          <div>
            <h2 className="flex items-center gap-2 text-sm uppercase tracking-widest text-[#C36A4D] mb-5">
              <Layers size={18} /> Specifications
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              {specs.map((spec, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-5 border border-gray-100"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">
                    {spec.key}
                  </p>
                  <p className="text-sm text-gray-900 font-bold mt-1">
                    {spec.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* META INFO */}
          <div className="flex gap-12 text-sm text-gray-500">
            <div>
              <p>Listed</p>
              <p>{formatDate(product.createdAt)}</p>
            </div>
            <div>
              <p>Updated</p>
              <p>{formatDate(product.updatedAt)}</p>
            </div>
          </div>

          {/* CTA BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (!user) return navigate("/login", {state:{data: id}});
              setShowInquiry(true);
            }}
            className="mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C36A4D] to-[#e28b6f] text-white font-semibold tracking-wider shadow-lg hover:shadow-xl transition"
          >
            Send Inquiry
          </motion.button>

          <AnimatePresence>
            {showInquiry && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-16"
                onClick={() => setShowInquiry(false)}
              >
                {/* Blurred backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                {/* Modal content — centered */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 30 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative z-10 w-full max-w-lg mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <InquiryForm
                    productName={product.name}
                    show={showInquiry}
                    onClose={() => setShowInquiry(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}