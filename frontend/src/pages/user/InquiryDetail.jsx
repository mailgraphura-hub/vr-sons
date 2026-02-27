import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../../components/user/sidebar";
import Header from "../../components/user/Header";
import {
  ArrowLeft,
  Package,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Hash,
  MessageSquare,
  User,
  Clock,
  Tag,
} from "lucide-react";

/* ---------- HELPERS ---------- */

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const STAGES = ["Open", "Processing", "Closed"];

const getStatusConfig = (status) => {
  switch (status) {
    case "Open":
      return {
        dot: "bg-amber-400",
        badge: "bg-amber-50 text-amber-600 border border-amber-200",
        color: "bg-amber-400",
        step: 0,
      };
    case "Processing":
      return {
        dot: "bg-purple-400",
        badge: "bg-purple-50 text-purple-600 border border-purple-200",
        color: "bg-gradient-to-r from-amber-400 to-purple-400",
        step: 1,
      };
    case "Close":
      return {
        dot: "bg-emerald-400",
        badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        color: "bg-gradient-to-r from-amber-400 via-purple-400 to-emerald-400",
        step: 2,
      };
    default:
      return {
        dot: "bg-gray-300",
        badge: "bg-gray-50 text-gray-500 border border-gray-200",
        color: "bg-gray-300",
        step: 0,
      };
  }
};

/* ---------- SUB-COMPONENTS ---------- */

const InfoCard = ({ icon: Icon, label, value, accent = false }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-start gap-3">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          accent
            ? "bg-[#C36A4D]/10 text-[#C36A4D]"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  </motion.div>
);

/* ---------- MAIN COMPONENT ---------- */

export default function InquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  if (!data) {
    return (
      <div className="flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 pt-20 md:pt-8 px-4 md:px-8 min-h-screen">
          <Header />
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
            <Package size={48} strokeWidth={1} />
            <p className="font-medium">Inquiry not found</p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(data.status);

  return (
    <div className="flex bg-gradient-to-br from-gray-50 via-[#faf7f5] to-[#f5ede9] min-h-screen">
      <Sidebar />

      <div className="flex-1 md:ml-64 pt-20 md:pt-8 px-4 md:px-8 min-h-screen">
        <Header />

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/user/inquiries")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#C36A4D] transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back to Inquiries
        </motion.button>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#C36A4D] mb-1">
            Inquiry Details
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {data.productName}
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-mono">
            #{data._id?.slice(-8).toUpperCase()}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Inquiry Status
                </p>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                  {data.status}
                </span>
              </div>

              {/* Step Indicators */}
              <div className="relative flex items-center justify-between">
                {/* Track */}
                <div className="absolute top-4 left-4 right-4 h-1.5 bg-gray-100 rounded-full -z-0" />

                {/* Filled track */}
                <motion.div
                  className={`absolute top-4 left-4 h-1.5 rounded-full ${statusConfig.color}`}
                  style={{ right: statusConfig.step === 0 ? "calc(66% + 4px)" : statusConfig.step === 1 ? "calc(33% - 4px)" : "16px" }}
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {STAGES.map((stage, i) => {
                  const isCompleted = i < statusConfig.step;
                  const isActive = i === statusConfig.step;
                  return (
                    <div key={stage} className="flex flex-col items-center gap-2 z-10">
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive
                            ? "border-[#C36A4D] bg-[#C36A4D] shadow-lg shadow-[#C36A4D]/30"
                            : isCompleted
                            ? "border-emerald-400 bg-emerald-400"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : isActive ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-white" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                        )}
                      </motion.div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                        isActive ? "text-[#C36A4D]" : isCompleted ? "text-emerald-500" : "text-gray-300"
                      }`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#C36A4D]/10 flex items-center justify-center text-[#C36A4D]">
                  <MessageSquare size={15} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Message
                </p>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100 italic">
                "{data.message || "No message provided."}"
              </p>
            </motion.div>

            {/* Contact Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
                Contact Information
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <InfoCard icon={User} label="Customer Name" value={data.customerName} accent />
                <InfoCard icon={Building2} label="Company" value={data.company} accent />
                <InfoCard icon={Mail} label="Email" value={data.email} />
                <InfoCard icon={Mail} label="Alternative Email" value={data.alternativeEmail} />
                <InfoCard icon={Phone} label="Contact" value={data.contact} />
                <InfoCard icon={Phone} label="Alternative Contact" value={data.alternativeContact} />
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
                Location
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <InfoCard icon={MapPin} label="Country" value={data.country} accent />
                <InfoCard icon={MapPin} label="State" value={data.state} accent />
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#C36A4D] to-[#e28b6f] rounded-2xl p-6 text-white shadow-xl shadow-[#C36A4D]/30"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4">
                Order Summary
              </p>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-xs text-white/60">Product</p>
                  <p className="font-bold text-sm leading-tight">{data.productName}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-xs text-white/60 mb-1">Required Quantity</p>
                <p className="text-3xl font-black">{data.quantity}</p>
                <p className="text-xs text-white/50">units</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Product ID</span>
                  <span className="font-mono text-white/80">{data.productId?.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Customer ID</span>
                  <span className="font-mono text-white/80">{data.customerId?.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-5">
                Timeline
              </p>

              <div className="relative pl-5">
                {/* Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-100" />

                <div className="flex flex-col gap-5">
                  <div className="relative flex items-start gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#C36A4D] border-2 border-white shadow-sm flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Inquiry Created</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(data.inquiry_date)}</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-200 border-2 border-white shadow-sm flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-500">Last Updated</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(data.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Inquiry ID */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Hash size={14} className="text-gray-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Reference ID
                </p>
              </div>
              <p className="font-mono text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 break-all">
                {data._id}
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}