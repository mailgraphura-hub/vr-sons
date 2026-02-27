import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MessageSquare, Inbox, CheckCircle2 } from "lucide-react";
import { getService } from "../../service/axios";
import { toast } from "react-hot-toast";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  primary:   "#c36a4d",
  primary90: "#b05c40",
  tint10:    "#fdf3f0",
  tint20:    "#f9e3db",
  tint30:    "#f3c9bb",
  tint50:    "#e8a38e",
  text:      "#1c1917",
  muted:     "#78716c",
  subtle:    "#a8a29e",
  border:    "#e7e5e4",
  surface:   "#ffffff",
  bg:        "#faf9f8",
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .dash-root * { font-family: 'DM Sans', sans-serif; }

  /* ── KPI card ── */
  .dash-kpi-card {
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 20px;
    padding: 22px 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,.04);
    transition: transform 200ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 200ms ease,
                border-color 200ms ease;
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .dash-kpi-card::before {
    content: '';
    position: absolute;
    bottom: -30px; right: -30px;
    width: 90px; height: 90px;
    border-radius: 50%;
    background: ${C.tint10};
    transition: transform 300ms ease, opacity 300ms ease;
    opacity: 0;
  }
  .dash-kpi-card:hover {
    transform: translateY(-5px) scale(1.015);
    box-shadow: 0 14px 36px rgba(195,106,77,.15);
    border-color: ${C.tint30};
  }
  .dash-kpi-card:hover::before {
    transform: scale(2.2);
    opacity: 1;
  }

  /* KPI icon pulse on hover */
  .dash-kpi-icon {
    height: 52px; width: 52px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 220ms cubic-bezier(.34,1.56,.64,1), box-shadow 200ms ease;
  }
  .dash-kpi-card:hover .dash-kpi-icon {
    transform: scale(1.12) rotate(-4deg);
    box-shadow: 0 8px 20px rgba(195,106,77,.2);
  }

  /* ── Inquiry row ── */
  .dash-inquiry-row {
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background 150ms ease;
    position: relative;
  }
  .dash-inquiry-row::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, ${C.primary}, ${C.tint30});
    border-radius: 0 2px 2px 0;
    opacity: 0;
    transition: opacity 200ms ease;
  }
  .dash-inquiry-row:hover { background: ${C.tint10}; }
  .dash-inquiry-row:hover::before { opacity: 1; }

  /* Avatar */
  .dash-avatar {
    height: 34px; width: 34px;
    border-radius: 50%;
    background: ${C.tint10};
    border: 1.5px solid ${C.tint30};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 220ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 200ms ease;
  }
  .dash-inquiry-row:hover .dash-avatar {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(195,106,77,.2);
  }

  /* Status badges */
  .dash-badge {
    font-size: 11px; font-weight: 700;
    padding: 4px 11px;
    border-radius: 8px;
    border-width: 1.5px; border-style: solid;
    white-space: nowrap;
    flex-shrink: 0;
    transition: transform 180ms cubic-bezier(.34,1.56,.64,1), box-shadow 150ms ease;
  }
  .dash-badge:hover {
    transform: scale(1.07);
    box-shadow: 0 3px 8px rgba(0,0,0,.08);
  }
  .dash-badge-open        { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
  .dash-badge-processing  { background: #fffbeb; color: #d97706; border-color: #fde68a; }
  .dash-badge-closed      { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }

  /* Live pill */
  .dash-live-pill {
    font-size: 11px; font-weight: 700;
    color: ${C.primary};
    background: ${C.tint10};
    border: 1.5px solid ${C.tint20};
    padding: 4px 11px;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  }
  .dash-live-pill::before {
    content: '';
    position: absolute;
    top: 50%; left: 10px;
    transform: translateY(-50%);
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${C.primary};
    animation: dash-pulse 1.6s infinite;
  }

  @keyframes dash-pulse {
    0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
    50%       { opacity: .4; transform: translateY(-50%) scale(1.5); }
  }

  /* Panel cards */
  .dash-panel {
    background: ${C.surface};
    border-radius: 20px;
    border: 1.5px solid ${C.border};
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    transition: box-shadow 200ms ease, border-color 200ms ease;
  }
  .dash-panel:hover {
    box-shadow: 0 8px 28px rgba(195,106,77,.1);
    border-color: ${C.tint20};
  }

  /* Custom tooltip */
  .dash-tooltip {
    background: #fff;
    border: 1.5px solid ${C.tint20};
    border-radius: 13px;
    padding: 10px 16px;
    box-shadow: 0 8px 24px rgba(195,106,77,.15);
  }
`;

/* ── Stat card config ─────────────────────────────────────────────────────── */
const cardConfig = [
  { icon: MessageSquare, accent: C.primary,  bg: "#fdf3f0", ring: "#f3c9bb" },
  { icon: Inbox,         accent: "#2563eb",  bg: "#eff6ff",  ring: "#bfdbfe" },
  { icon: CheckCircle2,  accent: "#059669",  bg: "#ecfdf5",  ring: "#a7f3d0" },
];

/* ── Custom tooltip ──────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dash-tooltip">
        <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 3px" }}>{label}</p>
        <p style={{ fontSize: 12.5, fontWeight: 700, color: C.primary, margin: 0 }}>
          {payload[0].value} inquiries
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats]                     = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [monthlyData, setMonthlyData]         = useState([]);

  /* ── Data fetch — untouched ────────────────────────────────────────── */
  const fetchDashboard = async () => {
    try {
      const res = await getService("/admin/inquiry?page=1");

      const inquiryList = res?.data?.data?.inquiryList || [];
      const total       = res?.data?.data?.totalInquiry || 0;
      const open        = res?.data?.data?.open;
      const close       = res?.data?.data?.close;

      setStats([
        { title: "Total Inquiries", value: total },
        { title: "Open",            value: open  },
        { title: "Closed",          value: close },
      ]);

      setRecentInquiries(inquiryList.slice(0, 5));

      const monthMap = {};
      inquiryList.forEach((item) => {
        const month = new Date(item.createdAt).toLocaleString("default", { month: "short" });
        monthMap[month] = (monthMap[month] || 0) + 1;
      });
      setMonthlyData(Object.keys(monthMap).map((key) => ({ month: key, inquiries: monthMap[key] })));

    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  useEffect(() => { fetchDashboard(); }, []);
  /* ─────────────────────────────────────────────────────────────────── */

  const badgeClass = (status) => {
    if (status === "Open")       return "dash-badge dash-badge-open";
    if (status === "Processing") return "dash-badge dash-badge-processing";
    return "dash-badge dash-badge-closed";
  };

  return (
    <AdminLayout>
      <style>{GLOBAL_CSS}</style>

      <div className="dash-root" style={{ background: C.bg, minHeight: "100%", padding: "0 0 36px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── Heading ───────────────────────────────────────────────── */}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.5px", margin: 0 }}>
              Overview
            </h1>
            <p style={{ fontSize: 13, color: C.subtle, marginTop: 3, fontWeight: 500 }}>
              Business performance at a glance
            </p>
          </div>

          {/* ── KPI Cards ─────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {stats.map((stat, i) => {
              const cfg  = cardConfig[i] || cardConfig[0];
              const Icon = cfg.icon;
              return (
                <div key={i} className="dash-kpi-card">
                  <div
                    className="dash-kpi-icon"
                    style={{
                      background: cfg.bg,
                      border: `1.5px solid ${cfg.ring}`,
                    }}
                  >
                    <Icon size={22} style={{ color: cfg.accent }} />
                  </div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <p style={{
                      fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
                      textTransform: "uppercase", color: C.subtle, margin: 0,
                    }}>
                      {stat.title}
                    </p>
                    <p style={{
                      fontSize: 30, fontWeight: 800, color: C.text,
                      lineHeight: 1.1, margin: "3px 0 0",
                    }}>
                      {stat.value ?? "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Bottom row ────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 18 }}>

            {/* Recent Inquiries */}
            <div className="dash-panel">
              {/* Panel header */}
              <div style={{
                padding: "16px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: `1.5px solid ${C.tint20}`,
                background: C.tint10,
              }}>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: C.text, margin: 0 }}>
                    Recent Inquiries
                  </h2>
                  <p style={{ fontSize: 12, color: C.subtle, marginTop: 2, fontWeight: 500 }}>
                    Latest 5 entries
                  </p>
                </div>
                <span className="dash-live-pill" style={{ paddingLeft: 22 }}>Live</span>
              </div>

              {/* Rows */}
              <div>
                {recentInquiries.length === 0 ? (
                  <div style={{
                    padding: "44px 24px", textAlign: "center",
                    fontSize: 13, color: C.subtle, fontWeight: 500,
                  }}>
                    No inquiries yet
                  </div>
                ) : recentInquiries.map((item, i) => (
                  <div
                    key={item._id}
                    className="dash-inquiry-row"
                    style={{ borderTop: i === 0 ? "none" : `1px solid ${C.tint10}` }}
                  >
                    {/* Customer */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      <div className="dash-avatar">
                        <span style={{ fontSize: 12, fontWeight: 800, color: C.primary }}>
                          {item.customerName?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontSize: 13, fontWeight: 700, color: C.text,
                          margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {item.customerName}
                        </p>
                        <p style={{
                          fontSize: 11.5, color: C.subtle, margin: "2px 0 0",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {item.country}
                        </p>
                      </div>
                    </div>

                    {/* Badge */}
                    <span className={badgeClass(item.status)}>{item.status}</span>

                    {/* Date */}
                    <span style={{ fontSize: 12, color: C.subtle, flexShrink: 0 }}>
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div
              className="dash-panel"
              style={{ padding: 24, display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: C.text, margin: 0 }}>
                  Monthly Inquiries
                </h2>
                <p style={{ fontSize: 12, color: C.subtle, marginTop: 2, fontWeight: 500 }}>
                  Trend by month
                </p>
              </div>

              <div style={{ flex: 1, minHeight: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <defs>
                      <linearGradient id="terracottaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={C.primary} stopOpacity={0.22} />
                        <stop offset="100%" stopColor={C.primary} stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.tint20} vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: C.subtle, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: C.subtle, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="inquiries"
                      stroke={C.primary}
                      strokeWidth={2.5}
                      fill="url(#terracottaGrad)"
                      dot={{ r: 3.5, fill: C.primary, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: C.primary, strokeWidth: 2.5, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}