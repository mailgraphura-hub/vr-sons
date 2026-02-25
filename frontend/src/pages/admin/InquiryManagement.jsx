import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  Inbox,
  Clock,
  CheckCircle,
  Eye,
  X,
  Reply,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getService, putService } from "../../service/axios";
import { toast } from "react-hot-toast";

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= DEFAULT DATE (YESTERDAY → TODAY) ================= */

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date) =>
    date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(
    formatDate(yesterday)
  );
  const [endDate, setEndDate] = useState(
    formatDate(today)
  );

  /* ================= PAGINATION ================= */

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalInquiry, setTotalInquiry] = useState(0);
  const [totalOpenInquiry, setTotalOpenInquiry] = useState(0);
  const [totalCloseInquiry, setTotalCloseInquiry] = useState(0);
  const [totalProcessingInquiry, setTotalProcessingInquiry] = useState(0);

  /* ================= FETCH ================= */

  const fetchInquiries = async (page = 1) => {
    try {
      setLoading(true);

      const response = await getService(
        `/admin/inquiry/customerdate?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=10`
      );

      console.log(response.data)

      const inquiryList = response?.data?.inquiryList || [];

      setInquiries(
        Array.isArray(inquiryList) ? inquiryList : []
      );

      setCurrentPage(response?.data?.currentPage || 1);
      setTotalPage(response?.data?.totalPage || 1);
      setTotalInquiry(response?.data?.totalInquiry || 0);
      setTotalCloseInquiry(response.data.close);
      setTotalOpenInquiry(response.data.open);
      setTotalProcessingInquiry(response.data.processing)

    } catch (error) {
      setInquiries([]);
      toast.error(
        error?.response?.data?.message || "No Inquiries Found"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries(currentPage);
  }, [currentPage, startDate, endDate]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id, status) => {
    try {
      await putService("/admin/inquiry/status", {
        inquiryId: id,
        status,
      });

      toast.success("Status Updated");
      fetchInquiries(currentPage);
      setSelectedIndex(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const selected =
    selectedIndex !== null ? inquiries[selectedIndex] : null;

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold">
            Inquiry Management
          </h1>
          <p className="text-gray-500 text-sm">
            Showing inquiries from {startDate} to {endDate}
          </p>
        </div>

        {/* DATE FILTER */}
        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setCurrentPage(1);
              setStartDate(e.target.value);
            }}
            className="border px-3 py-2 rounded-lg"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setCurrentPage(1);
              setEndDate(e.target.value);
            }}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Inbox size={22} />}
            title="Total"
            value={totalInquiry}
          />

          <StatCard
            icon={<Clock size={22} />}
            title="Open"
            value={totalOpenInquiry}
          />

          <StatCard
            icon={<CheckCircle size={22} />}
            title="Processing"
            value={totalProcessingInquiry}
          />

          <StatCard
            icon={<CheckCircle size={22} />}
            title="Closed"
            value={totalCloseInquiry}
          />

        </div>

        {/* TABLE */}
        <div className="flex gap-6">

          <div className="flex-1 bg-white rounded-xl shadow border overflow-hidden">

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-400 uppercase text-xs border-b">
                  <tr>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Quantity</th>
                    <th className="p-4 text-left">Country</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((item, index) => (
                      <tr key={item._id} className="border-b hover:bg-blue-50">
                        <td className="p-4">
                          <div className="font-semibold">
                            {item.customerName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.email}
                          </div>
                        </td>

                        <td className="p-4">{item.quantity}</td>

                        <td className="p-4">
                          {item.country}, {item.state}
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-1 text-xs rounded-full font-semibold bg-blue-100 text-blue-600">
                            {item.status}
                          </span>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => setSelectedIndex(index)}
                            className="text-blue-600"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t text-sm">
              <p>
                Page {currentPage} of {totalPage}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                  className="border rounded px-3 py-1 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  disabled={currentPage === totalPage}
                  onClick={() =>
                    setCurrentPage((prev) => prev + 1)
                  }
                  className="border rounded px-3 py-1 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* DETAIL PANEL */}
          {selected && (
            <div className="w-[380px] bg-white rounded-xl shadow-xl border p-6 space-y-6 sticky top-6 h-fit">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">
                  Inquiry Details
                </h3>
                <button onClick={() => setSelectedIndex(null)}>
                  <X size={18} />
                </button>
              </div>

              <p className="font-semibold">
                {selected.customerName}
              </p>
              <p className="text-sm text-gray-500">
                {selected.email}
              </p>

              <div className="bg-gray-50 p-3 rounded text-sm italic">
                {selected.message}
              </div>

              {selected.status !== "Processing" && (
                <button
                  onClick={() =>
                    updateStatus(selected._id, "Processing")
                  }
                  className="w-full bg-yellow-500 text-white py-2 rounded-lg flex justify-center gap-2"
                >
                  <Reply size={16} />
                  Mark as Processing
                </button>
              )}

              {selected.status !== "Close" && (
                <button
                  onClick={() =>
                    updateStatus(selected._id, "Close")
                  }
                  className="w-full bg-green-600 text-white py-2 rounded-lg flex justify-center gap-2"
                >
                  <Reply size={16} />
                  Mark as Closed
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-4">
      <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}