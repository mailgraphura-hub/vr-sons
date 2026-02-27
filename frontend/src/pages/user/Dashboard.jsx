import Sidebar from "../../components/user/sidebar";
import Header from "../../components/user/Header";
import { useState, useEffect } from "react";
import {
  ClipboardList,
  Clock,
  Loader,
  CheckCircle,
} from "lucide-react";

import { userProfile } from "../../context/profileContext";
import { getService } from "../../service/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  // ✅ ALL STATES FIRST
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    processing: 0,
    close: 0,
  });

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = userProfile();

  useEffect(() => {
      const access = localStorage.getItem("access")
      if (!access) {
        navigate("/login");
      }
    }, [navigate]);


  useEffect(() => {
    if (!user) return; 

    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const apiResponse = await getService(
        "/customer/inquiry/getMyInquiries?page=1&limit=100"
      );

      if (!apiResponse?.ok) {
        setLoading(false);
        return;
      }

      const data = apiResponse.data.data;
      const inquiries = data.inquiryList || [];

      const total = data.totalItems;
      const open = data?.stats?.open?.length || 0;
      const processing = data?.stats?.processing?.length || 0;
      const close = data?.stats?.close?.length || 0;

      setStats({ total, open, processing, close });
      setRecent(inquiries.slice(0, 5));

      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "Open") return "bg-blue-50 text-blue-500 border border-blue-200";
    if (status === "Processing") return "bg-amber-50 text-amber-600 border border-amber-200";
    if (status === "Close") return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    return "bg-stone-100 text-stone-500";
  };

  // if (!user) return <div className="p-10">Loading...</div>;
  // if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#fdf6f0" }}>

      <Sidebar />

      <div className="flex-1 md:ml-64 pt-20 px-4 md:px-8 pb-10">

        <Header />

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm flex justify-between items-center" style={{ borderLeft: "4px solid #c97b5a" }}>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800">
              Welcome, {user?.name} 👋
            </h1>
            <p className="text-stone-400 mt-2">
              Here's a summary of your inquiries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          <Card title="Total Inquiries" value={stats.total} icon={<ClipboardList style={{ color: "#c97b5a" }} />} accent="#fef0e8" />
          <Card title="Open" value={stats.open} icon={<Clock className="text-blue-400" />} accent="#eff6ff" />
          <Card title="Processing" value={stats.processing} icon={<Loader className="text-amber-500" />} accent="#fffbeb" />
          <Card title="Closed" value={stats.close} icon={<CheckCircle className="text-emerald-500" />} accent="#ecfdf5" />
        </div>

        <div className="bg-white mt-8 p-6 rounded-3xl shadow-sm overflow-x-auto">
          <h2 className="text-lg font-semibold mb-6 text-stone-800">
            Recent Inquiries
          </h2>

          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-stone-400 border-b border-stone-100">
                <th className="pb-4 text-left">Company</th>
                <th className="pb-4 text-left">Quantity</th>
                <th className="pb-4 text-left">Date</th>
                <th className="pb-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-stone-400">
                    No Recent Inquiries
                  </td>
                </tr>
              ) : (
                recent.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-stone-50 last:border-none hover:bg-orange-50 transition"
                  >
                    <td className="py-4 font-medium text-stone-700">
                      {item.company}
                    </td>
                    <td className="text-stone-500">
                      {item.quantity}
                    </td>
                    <td className="text-stone-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function Card({ title, value, icon, accent }) {
  return (
    <div
      className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center"
    >
      <div>
        <p className="text-stone-400 text-sm">{title}</p>
        <h2 className="text-3xl font-bold mt-1 text-stone-800">
          {value}
        </h2>
      </div>
      <div
        className="text-3xl p-3 rounded-2xl"
        style={{ backgroundColor: accent }}
      >
        {icon}
      </div>
    </div>
  );
}