import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  Inbox, Clock, CheckCircle, Eye, X, Reply,
  ChevronLeft, ChevronRight, CalendarDays, CheckCircle2,
} from "lucide-react";
import { getService, putService, postService } from "../../service/axios";
import { toast } from "react-hot-toast";

/* ── Brand token ────────────────────────────────────────────────────────── */
const T = {
  primary:     "#c36a4d",
  primaryHov:  "#ad5d42",
  primaryDark: "#8f4c35",
  tint10:      "#fdf3f0",  // very light wash
  tint20:      "#fae4dc",  // light
  tint40:      "#f0bfb0",  // medium-light
  border:      "#f2e0da",  // soft brand border
};

/* ── Status helpers ─────────────────────────────────────────────────────── */
const statusCfg = {
  Open:       { bg: "#eff6ff", text: "#3b82f6", border: "#bfdbfe" },
  Processing: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  Close:      { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" },
};
const getStatusStyle = (s) => statusCfg[s] || { bg: "#f9fafb", text: "#6b7280", border: "#e5e7eb" };

/* ── Custom tooltip ─────────────────────────────────────────────────────── */
function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11.5px] font-semibold uppercase tracking-wider" style={{ color: "#a17060" }}>{label}</span>
      <span className="text-[13px] font-semibold text-gray-800">{value || "—"}</span>
    </div>
  );
}

export default function InquiryManagement() {
  const [inquiries, setInquiries]         = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading]             = useState(false);

  const today     = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const formatDate = (d) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formatDate(yesterday));
  const [endDate, setEndDate]     = useState(formatDate(today));

  const [currentPage, setCurrentPage]                   = useState(1);
  const [totalPage, setTotalPage]                       = useState(1);
  const [totalInquiry, setTotalInquiry]                 = useState(0);
  const [totalOpenInquiry, setTotalOpenInquiry]         = useState(0);
  const [totalCloseInquiry, setTotalCloseInquiry]       = useState(0);
  const [totalProcessingInquiry, setTotalProcessingInquiry] = useState(0);

  /* ── API — completely untouched ─────────────────────────────────────── */
  const fetchInquiries = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getService(
        `/admin/inquiry/customerdate?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=10`
      );
      const inquiryList = response?.data?.inquiryList || [];
      setInquiries(Array.isArray(inquiryList) ? inquiryList : []);
      setCurrentPage(response?.data?.currentPage || 1);
      setTotalPage(response?.data?.totalPage || 1);
      setTotalInquiry(response?.data?.totalInquiry || 0);
      setTotalCloseInquiry(response?.data?.close || 0);
      setTotalOpenInquiry(response?.data?.open || 0);
      setTotalProcessingInquiry(response?.data?.processing || 0);
    } catch (error) {
      setInquiries([]);
      toast.error(error?.response?.data?.message || "No Inquiries Found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(currentPage); }, [currentPage, startDate, endDate]);

  const updateStatus = async (id, status) => {
    try {
      await putService("/admin/inquiry/status", { inquiryId: id, status });
      const selectedInquiry = inquiries.find((item) => item._id === id);
      if (!selectedInquiry?.customerId) {
        toast.error("User ID missing. Cannot send notification.");
        return;
      }
      await postService("/notification", {
        userId: selectedInquiry.customerId,
        title: `Inquiry ${status}`,
        message: `Hello ${selectedInquiry.customerName}, your inquiry has been marked as ${status}.`,
        type: status === "Close" ? "success" : "info",
      });
      toast.success("Status Updated & Notification Sent");
      fetchInquiries(currentPage);
      setSelectedIndex(null);
    } catch {
      toast.error("Failed to update status");
    }
  };
  /* ─────────────────────────────────────────────────────────────────── */

  const selected = selectedIndex !== null ? inquiries[selectedIndex] : null;

  return (
    <AdminLayout>
      <div className="max-w-[1200px] mx-auto space-y-5">

        {/* ── Heading ──────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1a1a1a" }}>
            Inquiries
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: "#a0887e" }}>
            Filter by date range to view inquiries
          </p>
        </div>

        {/* ── Date range picker — clean labeled row ─────────────────────── */}
        <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4"
          style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

          <CalendarDays size={15} style={{ color: T.primary }} className="shrink-0" />
          <span className="text-[12px] font-bold uppercase tracking-widest shrink-0" style={{ color: "#b09080" }}>
            Date Range
          </span>

          <div className="w-px h-5 mx-1 shrink-0" style={{ background: T.border }} />

          {/* From */}
          <div className="flex items-center gap-2">
            <span className="text-[11.5px] font-semibold uppercase tracking-wider shrink-0" style={{ color: "#b09080" }}>
              From
            </span>
            <label
              className="flex items-center px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-150"
              style={{ background: T.tint10, border: `1px solid ${T.border}` }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = T.primary}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = T.border}
            >
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setCurrentPage(1); setStartDate(e.target.value); }}
                className="text-[13px] font-semibold bg-transparent outline-none cursor-pointer"
                style={{ color: T.primaryDark }}
              />
            </label>
          </div>

          {/* Arrow separator */}
          <div className="flex items-center gap-1 shrink-0" style={{ color: T.tint40 }}>
            <div className="w-4 h-px" style={{ background: T.tint40 }} />
            <ChevronRight size={12} style={{ color: T.primary }} />
            <div className="w-4 h-px" style={{ background: T.tint40 }} />
          </div>

          {/* To */}
          <div className="flex items-center gap-2">
            <span className="text-[11.5px] font-semibold uppercase tracking-wider shrink-0" style={{ color: "#b09080" }}>
              To
            </span>
            <label
              className="flex items-center px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-150"
              style={{ background: T.tint10, border: `1px solid ${T.border}` }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = T.primary}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = T.border}
            >
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setCurrentPage(1); setEndDate(e.target.value); }}
                className="text-[13px] font-semibold bg-transparent outline-none cursor-pointer"
                style={{ color: T.primaryDark }}
              />
            </label>
          </div>

          {/* Active range summary */}
          <div className="ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: T.tint20, border: `1px solid ${T.border}` }}>
            <span className="text-[12px] font-semibold" style={{ color: T.primaryDark }}>
              {startDate}
            </span>
            <span className="text-[11px]" style={{ color: T.primary }}>→</span>
            <span className="text-[12px] font-semibold" style={{ color: T.primaryDark }}>
              {endDate}
            </span>
          </div>
        </div>

        {/* ── Stat cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Inbox size={17}       />} title="Total"      value={totalInquiry}           primary />
          <StatCard icon={<Clock size={17}       />} title="Open"       value={totalOpenInquiry}       accent="#3b82f6" bg="#eff6ff" ring="#bfdbfe" />
          <StatCard icon={<Reply size={17}       />} title="Processing" value={totalProcessingInquiry} accent="#d97706" bg="#fffbeb" ring="#fde68a" />
          <StatCard icon={<CheckCircle size={17} />} title="Closed"     value={totalCloseInquiry}      accent="#059669" bg="#ecfdf5" ring="#a7f3d0" />
        </div>

        {/* ── Table + Detail ────────────────────────────────────────────── */}
        <div className="flex gap-5 items-start">

          {/* Table card */}
          <div className="flex-1 bg-white rounded-2xl overflow-hidden min-w-0"
            style={{ border: "1px solid #ebebeb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>

            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: T.tint10, borderBottom: `1px solid ${T.border}` }}>
                  {["Customer", "Qty", "Location", "Status", "View"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-widest"
                      style={{ color: T.primaryDark, opacity: 0.7 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f7f7f7" }}>
                      <td colSpan="5" className="px-5 py-4">
                        <div className="h-3.5 rounded-full animate-pulse w-2/3"
                          style={{ background: T.tint20 }} />
                      </td>
                    </tr>
                  ))
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-14 text-center text-[13px]" style={{ color: "#b09080" }}>
                      No inquiries found for this date range
                    </td>
                  </tr>
                ) : inquiries.map((item, index) => {
                  const isSelected = selectedIndex === index;
                  const sc = getStatusStyle(item.status);
                  return (
                    <tr
                      key={item._id}
                      onClick={() => setSelectedIndex(index)}
                      className="cursor-pointer transition-colors duration-150 group"
                      style={{
                        borderBottom: "1px solid #f7f7f7",
                        background: isSelected ? T.tint10 : "white",
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#fdf8f6"; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "white"; }}
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold"
                            style={{ background: T.tint20, border: `1px solid ${T.border}`, color: T.primary }}>
                            {item.customerName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-none">{item.customerName}</p>
                            <p className="text-[11.5px] mt-0.5" style={{ color: "#a0887e" }}>{item.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Qty */}
                      <td className="px-5 py-4 font-semibold text-gray-700">{item.quantity}</td>

                      {/* Location */}
                      <td className="px-5 py-4" style={{ color: "#7a6058" }}>
                        {item.country}{item.state ? `, ${item.state}` : ""}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 text-[11.5px] font-semibold rounded-lg border"
                          style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                          {item.status}
                        </span>
                      </td>

                      {/* View */}
                      <td className="px-5 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                          className="p-2 rounded-xl border transition-all duration-150"
                          style={{
                            background: isSelected ? T.tint20 : T.tint10,
                            borderColor: isSelected ? T.primary : T.border,
                            color: isSelected ? T.primary : T.primaryDark,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background   = T.tint20;
                            e.currentTarget.style.borderColor  = T.primary;
                            e.currentTarget.style.color        = T.primary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background  = isSelected ? T.tint20 : T.tint10;
                            e.currentTarget.style.borderColor = isSelected ? T.primary : T.border;
                            e.currentTarget.style.color       = isSelected ? T.primary : T.primaryDark;
                          }}
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5"
              style={{ borderTop: `1px solid ${T.border}`, background: T.tint10 }}>
              <span className="text-[12.5px] font-medium" style={{ color: "#a0887e" }}>
                Page{" "}
                <span className="font-bold" style={{ color: T.primaryDark }}>{currentPage}</span>
                {" "}of{" "}
                <span className="font-bold" style={{ color: T.primaryDark }}>{totalPage}</span>
              </span>
              <div className="flex items-center gap-2">
                {[
                  { label: <><ChevronLeft size={13} /> Prev</>, disabled: currentPage === 1,      fn: () => setCurrentPage((p) => p - 1) },
                  { label: <>Next <ChevronRight size={13} /></>, disabled: currentPage === totalPage, fn: () => setCurrentPage((p) => p + 1) },
                ].map((btn, i) => (
                  <PaginationBtn key={i} disabled={btn.disabled} onClick={btn.fn}>{btn.label}</PaginationBtn>
                ))}
              </div>
            </div>
          </div>

          {/* ── Detail panel ──────────────────────────────────────────── */}
          {selected && (() => {
            const sc = getStatusStyle(selected.status);
            return (
              <div className="w-[310px] shrink-0 rounded-2xl overflow-hidden sticky top-6"
                style={{ border: `1px solid ${T.border}`, background: "white", boxShadow: `0 4px 24px rgba(195,106,77,0.10)` }}>

                {/* Panel header — brand tint */}
                <div className="px-5 py-4 flex items-center justify-between"
                  style={{ background: T.tint10, borderBottom: `1px solid ${T.border}` }}>
                  <div>
                    <h3 className="text-[14px] font-bold" style={{ color: T.primaryDark }}>Inquiry Details</h3>
                    <p className="text-[11.5px] mt-0.5" style={{ color: "#b09080" }}>Full inquiry info</p>
                  </div>
                  <button
                    className="h-7 w-7 flex items-center justify-center rounded-lg transition-colors duration-150"
                    style={{ color: "#b09080" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = T.tint20; e.currentTarget.style.color = T.primary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#b09080"; }}
                    onClick={() => setSelectedIndex(null)}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Customer row */}
                <div className="px-5 pt-4 pb-3.5 flex items-center gap-3"
                  style={{ borderBottom: `1px solid #f5f0ee` }}>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-[14px] font-bold"
                    style={{ background: T.tint20, border: `1.5px solid ${T.border}`, color: T.primary }}>
                    {selected.customerName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-bold text-gray-900">{selected.customerName}</p>
                    <p className="text-[11.5px]" style={{ color: "#a0887e" }}>{selected.email}</p>
                  </div>
                </div>

                {/* Info rows */}
                <div className="px-5 py-4 space-y-3" style={{ borderBottom: "1px solid #f5f0ee" }}>
                  <DetailRow label="Country"  value={selected.country} />
                  <DetailRow label="State"    value={selected.state} />
                  <DetailRow label="Quantity" value={selected.quantity} />
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11.5px] font-semibold uppercase tracking-wider" style={{ color: "#a17060" }}>Status</span>
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-lg border"
                      style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                      {selected.status}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #f5f0ee" }}>
                  <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: "#b09080" }}>Message</p>
                  <p className="text-[13px] leading-relaxed rounded-xl px-3.5 py-3"
                    style={{ color: "#5a4540", background: T.tint10, border: `1px solid ${T.border}` }}>
                    {selected.message || "No message provided."}
                  </p>
                </div>

                {/* Actions */}
                <div className="px-5 py-4 space-y-2.5">
                  {selected.status !== "Processing" && (
                    <ActionBtn
                      onClick={() => updateStatus(selected._id, "Processing")}
                      icon={<Reply size={14} />}
                      bg="#fffbeb" text="#d97706" border="#fde68a"
                      hoverBg="#fef3c7"
                    >
                      Mark as Processing
                    </ActionBtn>
                  )}
                  {selected.status !== "Close" && (
                    <ActionBtn
                      onClick={() => updateStatus(selected._id, "Close")}
                      icon={<CheckCircle2 size={14} />}
                      bg="#ecfdf5" text="#059669" border="#a7f3d0"
                      hoverBg="#d1fae5"
                    >
                      Mark as Closed
                    </ActionBtn>
                  )}
                </div>

              </div>
            );
          })()}

        </div>
      </div>
    </AdminLayout>
  );
}

/* ── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ icon, title, value, primary, accent, bg, ring }) {
  const a = primary ? T.primary : accent;
  const b = primary ? T.tint20  : bg;
  const r = primary ? T.border  : ring;
  return (
    <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 transition-shadow duration-200"
      style={{ border: `1px solid ${primary ? T.border : "#ebebeb"}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 4px 16px rgba(195,106,77,0.12)`}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"}
    >
      <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: b, border: `1px solid ${r}`, color: a }}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#a0887e" }}>{title}</p>
        <p className="text-[24px] font-bold leading-tight text-gray-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}

/* ── Action button in detail panel ─────────────────────────────────────── */
function ActionBtn({ children, onClick, icon, bg, text, border, hoverBg }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold rounded-xl border transition-colors duration-150"
      style={{ background: bg, color: text, borderColor: border }}
      onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
      onMouseLeave={(e) => e.currentTarget.style.background = bg}
    >
      {icon}{children}
    </button>
  );
}

/* ── Pagination button ──────────────────────────────────────────────────── */
function PaginationBtn({ children, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-semibold rounded-lg border
                 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ color: T.primaryDark, borderColor: T.border, background: "white" }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = T.tint20; e.currentTarget.style.borderColor = T.primary; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = T.border; }}
    >
      {children}
    </button>
  );
}