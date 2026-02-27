import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../components/user/sidebar";
import Header from "../../components/user/Header";
import { getService } from "../../service/axios";
import { userProfile } from "../../context/profileContext";

export default function MyInquiries() {

  const navigate = useNavigate();
  const { user } = userProfile();

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) navigate("/login");
  }, [navigate]);

  const { id } = useParams();

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, currentPage]);

  useEffect(() => {
    if (id && inquiries.length > 0) {
      const found = inquiries.find((item) => item._id === id);
      setSelectedInquiry(found || null);
    }
  }, [id, inquiries]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      let url = `/customer/inquiry/getMyInquiries?page=${currentPage}&limit=10`;
      if (statusFilter !== "All") url += `&status=${statusFilter}`;
      const apiResponse = await getService(url);
      if (!apiResponse?.ok) { setInquiries([]); setLoading(false); return; }
      const data = apiResponse.data.data;
      setInquiries(data.inquiryList || []);
      setTotalPages(data.totalPage || 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":       return { pill: "bg-sky-50 text-sky-500 border border-sky-200",           dot: "bg-sky-400" };
      case "Processing": return { pill: "bg-amber-50 text-amber-600 border border-amber-200",     dot: "bg-amber-400" };
      case "Close":      return { pill: "bg-emerald-50 text-emerald-600 border border-emerald-200", dot: "bg-emerald-400" };
      default:           return { pill: "bg-stone-100 text-stone-500",                            dot: "bg-stone-400" };
    }
  };

  const getAvatar = (name = "") => {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colors = ["#c97b5a", "#7b9ec9", "#7bc99e", "#c9a87b", "#9e7bc9"];
    const idx = name.charCodeAt(0) % colors.length;
    return { initials, color: colors[idx] };
  };

  const filteredInquiries = inquiries.filter((item) =>
    item.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex" style={{ backgroundColor: "#f5ede4" }}>
      <Sidebar />

      <div className="flex-1 md:ml-64 pt-24 px-4 md:px-8 min-h-screen pb-16">
        <Header />

        {/* SINGLE INQUIRY VIEW */}
        {id ? (
          selectedInquiry ? (
            <>
              <button
                onClick={() => navigate("/user/inquiries")}
                className="mb-6 px-5 py-2 bg-white text-stone-600 rounded-xl border border-stone-200 hover:bg-stone-50 transition font-medium text-sm shadow-sm"
              >
                ← Back
              </button>

              <div className="bg-white rounded-3xl p-8 shadow-sm" style={{ borderLeft: "4px solid #c97b5a" }}>
                <h2 className="text-2xl font-bold mb-6 text-stone-800">{selectedInquiry.company}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ["Quantity", selectedInquiry.quantity],
                    ["Country", selectedInquiry.country],
                    ["State", selectedInquiry.state],
                    ["Date", new Date(selectedInquiry.createdAt).toLocaleDateString()],
                  ].map(([label, val]) => (
                    <div key={label} className="rounded-2xl p-4" style={{ backgroundColor: "#fdf6f0" }}>
                      <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">{label}</p>
                      <p className="text-stone-700 font-semibold">{val}</p>
                    </div>
                  ))}
                  <div className="rounded-2xl p-4 sm:col-span-2" style={{ backgroundColor: "#fdf6f0" }}>
                    <p className="text-xs uppercase tracking-wider text-stone-400 mb-1">Message</p>
                    <p className="text-stone-700">{selectedInquiry.message}</p>
                  </div>
                </div>
                <div className="mt-6">
                  {(() => {
                    const s = getStatusStyle(selectedInquiry.status);
                    return (
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${s.pill}`}>
                        <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                        {selectedInquiry.status}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </>
          ) : (
            <h2 className="mt-10 text-lg text-stone-500">Inquiry Not Found</h2>
          )
        ) : (
          <>
            {/* HEADER ROW */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-stone-800">My Inquiries</h1>
                <p className="text-stone-400 text-sm mt-1">Track and manage all your submitted inquiries</p>
              </div>
              <div
                className="px-5 py-2 rounded-2xl font-semibold text-sm shadow-sm"
                style={{ backgroundColor: "#c97b5a", color: "#fff" }}
              >
                Total: {filteredInquiries.length}
              </div>
            </div>

            {/* FILTER */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <select
                value={statusFilter}
                onChange={(e) => { setCurrentPage(1); setStatusFilter(e.target.value); }}
                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-600 text-sm font-medium shadow-sm focus:outline-none"
                style={{ minWidth: "160px" }}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Processing">Processing</option>
                <option value="Close">Close</option>
              </select>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm">

              {/* Table Head */}
              <div
                className="grid text-xs font-semibold uppercase tracking-widest text-stone-400 px-6 py-4 border-b border-stone-100"
                style={{ gridTemplateColumns: "2.5fr 1fr 1.2fr 1fr 0.8fr", backgroundColor: "#fdf6f0" }}
              >
                <span>Company</span>
                <span>Quantity</span>
                <span>Date</span>
                <span>Status</span>
                <span className="text-center">Action</span>
              </div>

              {/* Rows */}
              {filteredInquiries.length === 0 ? (
                <div className="py-16 text-center text-stone-400 text-sm">
                  No Inquiries Found
                </div>
              ) : (
                filteredInquiries.map((item) => {
                  const { initials, color } = getAvatar(item.company);
                  const s = getStatusStyle(item.status);
                  return (
                    <div
                      key={item._id}
                      className="grid items-center px-6 py-4 border-b border-stone-50 hover:bg-orange-50 transition-colors duration-150"
                      style={{ gridTemplateColumns: "2.5fr 1fr 1.2fr 1fr 0.8fr" }}
                    >
                      {/* Company with Avatar */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: color }}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 text-sm leading-tight">{item.company}</p>
                          {item.country && (
                            <p className="text-stone-400 text-xs mt-0.5">{item.country}</p>
                          )}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div>
                        <span className="font-semibold text-stone-700 text-sm">{Number(item.quantity)?.toLocaleString()}</span>
                        <span className="text-stone-400 text-xs ml-1">units</span>
                      </div>

                      {/* Date */}
                      <div className="text-stone-500 text-sm">
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </div>

                      {/* Status */}
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                          {item.status}
                        </span>
                      </div>

                      {/* Action */}
                      <div className="text-center">
                        <button
                          onClick={() => navigate(`/user/inquiries/inquiry-Detial`, { state: { data: item } })}
                          className="px-4 py-1.5 text-white rounded-xl text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
                          style={{ backgroundColor: "#c97b5a" }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-5 py-2 border border-stone-200 rounded-xl bg-white text-stone-600 text-sm font-medium hover:bg-stone-50 disabled:opacity-40 transition shadow-sm"
                >
                  ← Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="w-9 h-9 rounded-xl text-sm font-semibold transition"
                      style={
                        page === currentPage
                          ? { backgroundColor: "#c97b5a", color: "#fff" }
                          : { backgroundColor: "#fff", color: "#78716c", border: "1px solid #e7e5e4" }
                      }
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-5 py-2 border border-stone-200 rounded-xl bg-white text-stone-600 text-sm font-medium hover:bg-stone-50 disabled:opacity-40 transition shadow-sm"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}