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

import {
  Download,
  Plus,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

import { getService } from "../../service/axios";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const fetchDashboard = async () => {
    try {
      const res = await getService("/admin/inquiry?page=1");

      const inquiryList =
        res?.data?.data?.inquiryList || [];

      const total =
        res?.data?.data?.totalInquiry || 0;

      const open = res?.data?.data?.open

      const close = res?.data?.data?.close;

      setStats([
        { title: "Total", value: total },
        { title: "Open", value: open },
        { title: "Closed", value: close },
      ]);

      setRecentInquiries(inquiryList.slice(0, 5));

      const monthMap = {};
      inquiryList.forEach((item) => {
        const month = new Date(
          item.createdAt
        ).toLocaleString("default", {
          month: "short",
        });
        monthMap[month] = (monthMap[month] || 0) + 1;
      });

      const chartData = Object.keys(monthMap).map(
        (key) => ({
          month: key,
          inquiries: monthMap[key],
        })
      );

      setMonthlyData(chartData);

    } catch (error) {
      toast.error("Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Business performance overview
          </p>
        </div>

        {/* <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 border rounded-xl bg-white shadow hover:shadow-md transition">
            <Download size={16} />
            Export
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition">
            <Plus size={16} />
            Add Product
          </button>
        </div> */}
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-8 mb-14">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-8 shadow-xl border hover:shadow-2xl transition relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>

            <p className="text-sm uppercase tracking-wide text-slate-500">
              {stat.title}
            </p>

            <h2 className="text-4xl font-bold mt-3 text-slate-800">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* RECENT INQUIRIES */}
      <div className="bg-white rounded-3xl shadow-xl border mb-14 overflow-hidden">
        <div className="px-8 py-6 border-b font-semibold text-lg bg-slate-50">
          Recent Inquiries
        </div>

        <div className="divide-y">
          {recentInquiries.map((item) => (
            <div
              key={item._id}
              className="px-8 py-5 flex justify-between items-center hover:bg-slate-50 transition"
            >
              <div>
                <p className="font-semibold">
                  {item.customerName}
                </p>
                <p className="text-sm text-slate-500">
                  {item.country}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  item.status === "Open"
                    ? "bg-blue-100 text-blue-600"
                    : item.status === "Processing"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {item.status}
              </span>

              <div className="text-sm text-slate-400">
                {new Date(
                  item.createdAt
                ).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BEAUTIFUL LARGE GRAPH AT BOTTOM */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-2xl border p-10">
        <h3 className="text-2xl font-bold mb-8 text-slate-800">
          📊 Monthly Inquiry Analytics
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.1)",
              }}
            />

            <Area
              type="monotone"
              dataKey="inquiries"
              stroke="#2563eb"
              strokeWidth={4}
              fill="url(#colorData)"
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </AdminLayout>
  );
}