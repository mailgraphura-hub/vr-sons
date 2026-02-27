import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  Inbox, Clock, CheckCircle, Eye, X, Reply,
  ChevronLeft, ChevronRight, CalendarDays, CheckCircle2,
} from "lucide-react";
import { getService, putService, postService } from "../../service/axios";
import { toast } from "react-hot-toast";

/* ── Brand tokens ───────────────────────────────────────────────────────── */
const T = {
  primary:     "#c36a4d",
  primaryHov:  "#ad5d42",
  primaryDark: "#8f4c35",
  tint10:      "#fdf3f0",
  tint20:      "#fae4dc",
  tint40:      "#f0bfb0",
  border:      "#f2e0da",
};

/* ── Status helpers ─────────────────────────────────────────────────────── */
const statusCfg = {
  Open:       { bg: "#eff6ff", text: "#3b82f6", border: "#bfdbfe" },
  Processing: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  Close:      { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" },
};
const getStatusStyle = (s) => statusCfg[s] || { bg: "#f9fafb", text: "#6b7280", border: "#e5e7eb" };

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a17060", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", wordBreak: "break-word", textAlign: "right" }}>{value || "—"}</span>
    </div>
  );
}

/* ── Fully responsive CSS ───────────────────────────────────────────────── */
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; }

  /* ── Layout shell ── */
  .iq-shell {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px 48px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── Date bar ── */
  .iq-date-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    background: white;
    border-radius: 16px;
    padding: 12px 20px;
    border: 1px solid ${T.border};
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .iq-date-label   { }
  .iq-date-divider { width: 1px; height: 20px; background: ${T.border}; flex-shrink: 0; }
  .iq-date-summary {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 10px;
    background: ${T.tint20};
    border: 1px solid ${T.border};
    white-space: nowrap;
  }
  .iq-date-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .iq-date-pill {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.15s;
    background: ${T.tint10};
    border: 1px solid ${T.border};
  }
  .iq-date-pill:hover { border-color: ${T.primary}; }
  .iq-date-input {
    font-size: 13px;
    font-weight: 600;
    background: transparent;
    outline: none;
    cursor: pointer;
    color: ${T.primaryDark};
    border: none;
    min-width: 0;
  }
  .iq-arrow {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    color: ${T.tint40};
  }

  /* ── Stat grid ── */
  .iq-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  /* ── Main layout: table + sidebar ── */
  .iq-layout {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  .iq-table-card {
    flex: 1;
    min-width: 0;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #ebebeb;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }

  /* ── Detail panel — sidebar on desktop ── */
  .iq-detail-panel {
    width: 300px;
    flex-shrink: 0;
    border-radius: 16px;
    overflow: hidden;
    position: sticky;
    top: 24px;
    border: 1px solid ${T.border};
    background: white;
    box-shadow: 0 4px 24px rgba(195,106,77,0.10);
  }
  .iq-overlay { display: none; }

  /* ── Desktop table columns ── */
  .iq-col-qty      { }
  .iq-col-location { }
  .iq-col-date     { }

  /* ── Desktop: show table, hide mobile cards ── */
  .iq-desktop-table { display: block; }
  .iq-mobile-cards  { display: none; }

  /* ── Scrollable table container ── */
  .iq-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }

  /* ── Table base ── */
  .iq-table { width: 100%; font-size: 13px; border-collapse: collapse; min-width: 380px; }
  .iq-th {
    padding: 12px 16px;
    text-align: left;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${T.primaryDark};
    opacity: 0.7;
    background: ${T.tint10};
    border-bottom: 1px solid ${T.border};
    white-space: nowrap;
  }
  .iq-td { padding: 14px 16px; border-bottom: 1px solid #f7f7f7; }

  /* ── Skeleton shimmer ── */
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .iq-skeleton {
    height: 14px;
    border-radius: 99px;
    background: linear-gradient(90deg, ${T.tint20} 25%, ${T.tint10} 50%, ${T.tint20} 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite;
  }

  /* ── Pagination ── */
  .iq-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid ${T.border};
    background: ${T.tint10};
    flex-wrap: wrap;
    gap: 8px;
  }

  /* ── Action buttons ── */
  .iq-action-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 12px;
    border: 1px solid;
    cursor: pointer;
    transition: background 0.15s;
  }

  /* ── Scroll lock when bottom sheet is open ── */
  body.iq-locked { overflow: hidden; }

  /* ══════════════════════════
     TABLET: ≤ 960px
  ══════════════════════════ */
  @media (max-width: 960px) {
    .iq-layout { flex-direction: column; }
    .iq-table-card { width: 100%; }

    /* Bottom sheet */
    .iq-detail-panel {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      width: 100%;
      max-height: 78vh;
      overflow-y: auto;
      border-radius: 20px 20px 0 0 !important;
      z-index: 50;
      box-shadow: 0 -8px 40px rgba(195,106,77,0.20);
      -webkit-overflow-scrolling: touch;
    }
    .iq-overlay {
      display: block !important;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 49;
    }
    .iq-detail-handle {
      display: flex !important;
    }
  }

  /* ══════════════════════════
     SMALL TABLET: ≤ 768px
  ══════════════════════════ */
  @media (max-width: 768px) {
    .iq-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .iq-col-date  { display: none; }
  }

  /* ══════════════════════════
     MOBILE: ≤ 600px
  ══════════════════════════ */
  @media (max-width: 600px) {
    .iq-shell { padding: 0 10px 80px; gap: 12px; }

    /* Date bar: compact 2-row layout */
    .iq-date-bar { padding: 10px 14px; gap: 8px; }
    .iq-date-label   { display: none; }
    .iq-date-divider { display: none; }
    .iq-date-summary { display: none; }
    .iq-from-label   { display: none; }
    .iq-to-label     { display: none; }
    .iq-date-pill    { padding: 6px 10px; flex: 1; justify-content: center; }
    .iq-date-input   { font-size: 12px; width: 100%; text-align: center; }
    .iq-date-inputs-row {
      display: flex !important;
      align-items: center;
      gap: 6px;
      width: 100%;
    }

    /* Switch to card list on mobile */
    .iq-desktop-table { display: none; }
    .iq-mobile-cards  { display: block; }

    /* Detail bottom sheet taller on mobile */
    .iq-detail-panel { max-height: 85vh; }

    /* Stat grid full 2-col always */
    .iq-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .iq-stat-value { font-size: 20px !important; }
    .iq-stat-icon  { height: 36px !important; width: 36px !important; }

    /* Pagination stack */
    .iq-pagination { flex-direction: column; align-items: flex-start; gap: 8px; }
    .iq-page-btns  { width: 100%; justify-content: space-between; }
  }

  /* ══════════════════════════
     TINY: ≤ 380px
  ══════════════════════════ */
  @media (max-width: 380px) {
    .iq-stat-grid { gap: 6px; }
    .iq-stat-card-inner { padding: 10px 12px !important; gap: 10px !important; }
    .iq-stat-value { font-size: 18px !important; }
  }

  /* ══════════════════════════
     ULTRA-WIDE: ≥ 1400px
  ══════════════════════════ */
  @media (min-width: 1400px) {
    .iq-shell { max-width: 1400px; }
    .iq-detail-panel { width: 340px; }
  }

  /* ── Mobile card styles ── */
  .iq-card-item {
    padding: 14px 16px;
    border-bottom: 1px solid ${T.tint10};
    cursor: pointer;
    transition: background 0.12s;
  }
  .iq-card-item:last-child { border-bottom: none; }
  .iq-card-item:hover { background: ${T.tint10}; }
  .iq-card-item.selected { background: ${T.tint10}; }

  .iq-card-top {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .iq-card-info {
    flex: 1;
    min-width: 0;
  }
  .iq-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
`;

/* ════════════════════════════════════════════════════════════════════════════
   Main component
   ════════════════════════════════════════════════════════════════════════════ */
export default function InquiryManagement() {
  const [inquiries, setInquiries]                           = useState([]);
  const [selectedIdx, setSelectedIdx]                       = useState(null);
  const [loading, setLoading]                               = useState(false);

  const today = new Date();
  const yest  = new Date(); yest.setDate(today.getDate() - 1);
  const fmt   = (d) => d.toISOString().split("T")[0];

  const [startDate, setStartDate]                           = useState(fmt(yest));
  const [endDate, setEndDate]                               = useState(fmt(today));
  const [currentPage, setCurrentPage]                       = useState(1);
  const [totalPage, setTotalPage]                           = useState(1);
  const [totalInquiry, setTotalInquiry]                     = useState(0);
  const [totalOpenInquiry, setTotalOpenInquiry]             = useState(0);
  const [totalCloseInquiry, setTotalCloseInquiry]           = useState(0);
  const [totalProcessingInquiry, setTotalProcessingInquiry] = useState(0);

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

  /* Lock body scroll when bottom sheet open on mobile */
  useEffect(() => {
    const isMobile = window.innerWidth <= 960;
    if (selectedIdx !== null && isMobile) {
      document.body.classList.add("iq-locked");
    } else {
      document.body.classList.remove("iq-locked");
    }
    return () => document.body.classList.remove("iq-locked");
  }, [selectedIdx]);

  const updateStatus = async (id, status) => {
    try {
      await putService("/admin/inquiry/status", { inquiryId: id, status });
      const selectedInquiry = inquiries.find((item) => item._id === id);
      if (!selectedInquiry?.customerId) {
        toast.error("User ID missing. Cannot send notification.");
        return;
      }
      await postService("/notification", {
        userId:  selectedInquiry.customerId,
        title:   `Inquiry ${status}`,
        message: `Hello ${selectedInquiry.customerName}, your inquiry has been marked as ${status}.`,
        type:    status === "Close" ? "success" : "info",
      });
      toast.success("Status Updated & Notification Sent");
      fetchInquiries(currentPage);
      setSelectedIdx(null);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const selected = selectedIdx !== null ? inquiries[selectedIdx] : null;

  return (
    <AdminLayout>
      <style>{STYLES}</style>

      <div className="iq-shell">

        {/* ── Heading ── */}
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Inquiries</h1>
          <p style={{ fontSize: 12, color: "#a0887e", marginTop: 3, margin: "3px 0 0" }}>Filter by date range to view inquiries</p>
        </div>

        {/* ── Date bar ── */}
        <div className="iq-date-bar">
          <CalendarDays size={15} style={{ color: T.primary, flexShrink: 0 }} />

          <span className="iq-date-label" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#b09080", flexShrink: 0 }}>
            Date Range
          </span>

          <div className="iq-date-divider" />

          {/* Inputs row (becomes full-width on mobile) */}
          <div className="iq-date-inputs-row" style={{ display: "contents" }}>
            {/* From */}
            <div className="iq-date-input-wrap">
              <span className="iq-from-label" style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#b09080", flexShrink: 0 }}>From</span>
              <label className="iq-date-pill">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => { setCurrentPage(1); setStartDate(e.target.value); }}
                  className="iq-date-input"
                />
              </label>
            </div>

            {/* Arrow */}
            <div className="iq-arrow">
              <div style={{ width: 10, height: 1, background: T.tint40 }} />
              <ChevronRight size={12} style={{ color: T.primary }} />
              <div style={{ width: 10, height: 1, background: T.tint40 }} />
            </div>

            {/* To */}
            <div className="iq-date-input-wrap">
              <span className="iq-to-label" style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#b09080", flexShrink: 0 }}>To</span>
              <label className="iq-date-pill">
                <input
                  type="date"
                  value={endDate}
                  onChange={e => { setCurrentPage(1); setEndDate(e.target.value); }}
                  className="iq-date-input"
                />
              </label>
            </div>
          </div>

          {/* Summary chip */}
          <div className="iq-date-summary">
            <span style={{ fontSize: 12, fontWeight: 600, color: T.primaryDark }}>{startDate}</span>
            <span style={{ fontSize: 11, color: T.primary }}>→</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.primaryDark }}>{endDate}</span>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="iq-stat-grid">
          <StatCard icon={<Inbox size={16} />}         title="Total"      value={totalInquiry}             primary />
          <StatCard icon={<Clock size={16} />}         title="Open"       value={totalOpenInquiry}         accent="#3b82f6" bg="#eff6ff" ring="#bfdbfe" />
          <StatCard icon={<Reply size={16} />}         title="Processing" value={totalProcessingInquiry}   accent="#d97706" bg="#fffbeb" ring="#fde68a" />
          <StatCard icon={<CheckCircle size={16} />}   title="Closed"     value={totalCloseInquiry}        accent="#059669" bg="#ecfdf5" ring="#a7f3d0" />
        </div>

        {/* ── Table + Detail panel ── */}
        <div className="iq-layout">

          {/* ── Table card ── */}
          <div className="iq-table-card">

            {/* DESKTOP: table */}
            <div className="iq-desktop-table">
              <div className="iq-table-scroll">
                <table className="iq-table">
                  <thead>
                    <tr>
                      <th className="iq-th">Customer</th>
                      <th className="iq-th iq-col-qty">Qty</th>
                      <th className="iq-th iq-col-location">Location</th>
                      <th className="iq-th iq-col-date">Date</th>
                      <th className="iq-th">Status</th>
                      <th className="iq-th">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}><td colSpan="6" className="iq-td"><div className="iq-skeleton" style={{ width: `${55 + (i % 3) * 15}%` }} /></td></tr>
                      ))
                      : inquiries.length === 0
                        ? <tr><td colSpan="6" className="iq-td" style={{ textAlign: "center", padding: "56px 20px", color: "#b09080", fontSize: 13 }}>No inquiries found for this date range</td></tr>
                        : inquiries.map((item, index) => {
                          const isSelected = selectedIdx === index;
                          const sc = getStatusStyle(item.status);
                          return (
                            <tr
                              key={item._id}
                              onClick={() => setSelectedIdx(isSelected ? null : index)}
                              style={{ background: isSelected ? T.tint10 : "white", cursor: "pointer", transition: "background 0.12s" }}
                              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#fdf8f6"; }}
                              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "white"; }}
                            >
                              {/* Customer */}
                              <td className="iq-td">
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div style={{ height: 32, width: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: T.tint20, border: `1px solid ${T.border}`, color: T.primary, fontSize: 12, fontWeight: 700 }}>
                                    {item.customerName?.charAt(0)?.toUpperCase() || "?"}
                                  </div>
                                  <div style={{ minWidth: 0 }}>
                                    <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{item.customerName}</p>
                                    <p style={{ margin: 0, fontSize: 11.5, color: "#a0887e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{item.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="iq-td iq-col-qty" style={{ fontWeight: 600, color: "#374151" }}>{item.quantity}</td>
                              <td className="iq-td iq-col-location" style={{ color: "#7a6058", fontSize: 13, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.country}{item.state ? `, ${item.state}` : ""}
                              </td>
                              <td className="iq-td iq-col-date" style={{ color: "#9ca3af", fontSize: 12, whiteSpace: "nowrap" }}>
                                {new Date().toLocaleDateString("en-GB")}
                              </td>
                              <td className="iq-td">
                                <span style={{ padding: "4px 10px", fontSize: 11.5, fontWeight: 600, borderRadius: 8, border: `1px solid ${sc.border}`, background: sc.bg, color: sc.text, whiteSpace: "nowrap" }}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="iq-td">
                                <button
                                  onClick={e => { e.stopPropagation(); setSelectedIdx(isSelected ? null : index); }}
                                  style={{ padding: 8, borderRadius: 10, border: `1px solid ${isSelected ? T.primary : T.border}`, background: isSelected ? T.tint20 : T.tint10, color: isSelected ? T.primary : T.primaryDark, cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.12s" }}
                                  onMouseEnter={e => { e.currentTarget.style.background = T.tint20; e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = isSelected ? T.tint20 : T.tint10; e.currentTarget.style.borderColor = isSelected ? T.primary : T.border; e.currentTarget.style.color = isSelected ? T.primary : T.primaryDark; }}
                                >
                                  <Eye size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                    }
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE: card list */}
            <div className="iq-mobile-cards">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderBottom: `1px solid ${T.tint10}` }}>
                    <div className="iq-skeleton" style={{ width: "60%", marginBottom: 8 }} />
                    <div className="iq-skeleton" style={{ width: "40%" }} />
                  </div>
                ))
                : inquiries.length === 0
                  ? <div style={{ textAlign: "center", padding: "48px 20px", color: "#b09080", fontSize: 13 }}>No inquiries found for this date range</div>
                  : inquiries.map((item, index) => {
                    const isSelected = selectedIdx === index;
                    const sc = getStatusStyle(item.status);
                    return (
                      <div
                        key={item._id}
                        className={`iq-card-item${isSelected ? " selected" : ""}`}
                        onClick={() => setSelectedIdx(isSelected ? null : index)}
                      >
                        {/* Top row */}
                        <div className="iq-card-top">
                          <div style={{ height: 36, width: 36, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: T.tint20, border: `1px solid ${T.border}`, color: T.primary, fontSize: 13, fontWeight: 700 }}>
                            {item.customerName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="iq-card-info">
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.customerName}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#a0887e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.email}</p>
                          </div>
                          <span style={{ flexShrink: 0, padding: "3px 9px", fontSize: 10.5, fontWeight: 700, borderRadius: 8, border: `1px solid ${sc.border}`, background: sc.bg, color: sc.text }}>
                            {item.status}
                          </span>
                        </div>

                        {/* Meta row */}
                        <div className="iq-card-meta">
                          {(item.country || item.state) && (
                            <span style={{ fontSize: 11.5, color: "#7a6058", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
                              📍 {item.country}{item.state ? `, ${item.state}` : ""}
                            </span>
                          )}
                          {item.quantity && (
                            <span style={{ fontSize: 11.5, color: "#a0887e", fontWeight: 600 }}>Qty: {item.quantity}</span>
                          )}
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedIdx(isSelected ? null : index); }}
                            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 9, border: `1px solid ${isSelected ? T.primary : T.border}`, background: isSelected ? T.tint20 : T.tint10, color: isSelected ? T.primary : T.primaryDark, cursor: "pointer" }}
                          >
                            <Eye size={13} /> {isSelected ? "Close" : "View"}
                          </button>
                        </div>
                      </div>
                    );
                  })
              }
            </div>

            {/* Pagination */}
            <div className="iq-pagination">
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "#a0887e" }}>
                Page <strong style={{ color: T.primaryDark }}>{currentPage}</strong> of <strong style={{ color: T.primaryDark }}>{totalPage}</strong>
                &nbsp;·&nbsp;<strong style={{ color: T.primaryDark }}>{inquiries.length}</strong> records
              </span>
              <div className="iq-page-btns" style={{ display: "flex", gap: 8 }}>
                <PaginationBtn disabled={currentPage === 1}         onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={13} /> Prev</PaginationBtn>
                <PaginationBtn disabled={currentPage === totalPage} onClick={() => setCurrentPage(p => p + 1)}>Next <ChevronRight size={13} /></PaginationBtn>
              </div>
            </div>
          </div>

          {/* ── Detail panel ── */}
          {selected && (() => {
            const sc = getStatusStyle(selected.status);
            return (
              <>
                <div className="iq-overlay" onClick={() => setSelectedIdx(null)} />

                <div className="iq-detail-panel" style={{ borderRadius: 16, overflow: "hidden", background: "#fff" }}>
                  {/* Drag handle (mobile only) */}
                  <div
                    className="iq-detail-handle"
                    style={{ display: "none", justifyContent: "center", paddingTop: 10, paddingBottom: 4 }}
                  >
                    <div style={{ width: 36, height: 4, borderRadius: 99, background: T.tint40 }} />
                  </div>

                  {/* Header */}
                  <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: T.tint10, borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.primaryDark }}>Inquiry Details</h3>
                      <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#b09080" }}>Full inquiry info</p>
                    </div>
                    <button
                      onClick={() => setSelectedIdx(null)}
                      style={{ height: 28, width: 28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "none", background: "transparent", color: "#b09080", cursor: "pointer", transition: "all 0.12s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.tint20; e.currentTarget.style.color = T.primary; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#b09080"; }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Customer */}
                  <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #f5f0ee" }}>
                    <div style={{ height: 40, width: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: T.tint20, border: `1.5px solid ${T.border}`, color: T.primary, fontSize: 14, fontWeight: 700 }}>
                      {selected.customerName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected.customerName}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#a0887e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected.email}</p>
                    </div>
                  </div>

                  {/* Info rows */}
                  <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10, borderBottom: "1px solid #f5f0ee" }}>
                    <DetailRow label="Country"  value={selected.country} />
                    <DetailRow label="State"    value={selected.state} />
                    <DetailRow label="Quantity" value={selected.quantity} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a17060" }}>Status</span>
                      <span style={{ padding: "3px 10px", fontSize: 11, fontWeight: 600, borderRadius: 8, border: `1px solid ${sc.border}`, background: sc.bg, color: sc.text }}>
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f5f0ee" }}>
                    <p style={{ margin: "0 0 8px", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#b09080" }}>Message</p>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#5a4540", background: T.tint10, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 14px", wordBreak: "break-word" }}>
                      {selected.message || "No message provided."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {(selected.status !== "Processing" && selected.status !== "Close") && (
                      <button className="iq-action-btn"
                        onClick={() => updateStatus(selected._id, "Processing")}
                        style={{ background: "#fffbeb", color: "#d97706", borderColor: "#fde68a" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fef3c7"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fffbeb"}
                      >
                        <Reply size={14} /> Mark as Processing
                      </button>
                    )}
                    {selected.status !== "Close" && (
                      <button className="iq-action-btn"
                        onClick={() => updateStatus(selected._id, "Close")}
                        style={{ background: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#d1fae5"}
                        onMouseLeave={e => e.currentTarget.style.background = "#ecfdf5"}
                      >
                        <CheckCircle2 size={14} /> Mark as Closed
                      </button>
                    )}
                    {selected.status === "Close" && (
                      <p style={{ margin: 0, textAlign: "center", fontSize: 12, color: "#059669", fontWeight: 600 }}>✓ Inquiry resolved</p>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </AdminLayout>
  );
}

/* ── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ icon, title, value, primary, accent, bg, ring }) {
  const a = primary ? T.primary : accent;
  const b = primary ? T.tint20  : bg;
  const r = primary ? T.border  : ring;
  return (
    <div
      className="iq-stat-card-inner"
      style={{ background: "white", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${primary ? T.border : "#ebebeb"}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s", cursor: "default" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(195,106,77,0.12)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"}
    >
      <div className="iq-stat-icon" style={{ height: 40, width: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: b, border: `1px solid ${r}`, color: a }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a0887e", whiteSpace: "nowrap" }}>{title}</p>
        <p className="iq-stat-value" style={{ margin: "1px 0 0", fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{value ?? "—"}</p>
      </div>
    </div>
  );
}

/* ── Pagination button ──────────────────────────────────────────────────── */
function PaginationBtn({ children, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 12.5, fontWeight: 600, borderRadius: 8, border: `1px solid ${T.border}`, background: "white", color: T.primaryDark, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, transition: "all 0.15s", flex: 1, justifyContent: "center" }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = T.tint20; e.currentTarget.style.borderColor = T.primary; } }}
      onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = T.border; }}
    >
      {children}
    </button>
  );
}