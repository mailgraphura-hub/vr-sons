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
    if (status === "Open") return "bg-yellow-100 text-yellow-600";
    if (status === "Processing") return "bg-purple-100 text-purple-600";
    if (status === "Close") return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  // if (!user) return <div className="p-10">Loading...</div>;
  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar />

      <div className="flex-1 md:ml-64 pt-20 px-4 md:px-8 pb-10">

        <Header />

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome, {user?.name} 👋
            </h1>
            <p className="text-gray-500 mt-2">
              Here's a summary of your inquiries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          <Card title="Total Inquiries" value={stats.total} icon={<ClipboardList className="text-blue-500" />} />
          <Card title="Open" value={stats.open} icon={<Clock className="text-yellow-500" />} />
          <Card title="Processing" value={stats.processing} icon={<Loader className="text-purple-500" />} />
          <Card title="Closed" value={stats.close} icon={<CheckCircle className="text-green-500" />} />
        </div>

        <div className="bg-white mt-8 p-6 rounded-3xl shadow-sm overflow-x-auto">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Recent Inquiries
          </h2>

          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b">
                <th className="pb-4 text-left">Company</th>
                <th className="pb-4 text-left">Quantity</th>
                <th className="pb-4 text-left">Date</th>
                <th className="pb-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    No Recent Inquiries
                  </td>
                </tr>
              ) : (
                recent.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                  >
                    <td className="py-4 font-medium text-gray-700">
                      {item.company}
                    </td>
                    <td className="text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="text-gray-500">
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

function Card({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-3xl font-bold mt-1 text-gray-800">
          {value}
        </h2>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}