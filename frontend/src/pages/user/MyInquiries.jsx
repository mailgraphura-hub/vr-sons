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
      const access = localStorage.getItem("access")
      if (!access) {
        navigate("/login");
      }
    }, [navigate]);


  const { id } = useParams();

  // 🔥 Fetch inquiries
  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, currentPage]);

  // 🔥 Fetch single inquiry if ID exists
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

      if (statusFilter !== "All") {
        url += `&status=${statusFilter}`;
      }

      const apiResponse = await getService(url);

      if (!apiResponse?.ok) {
        setInquiries([]);
        setLoading(false);
        return;
      }

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
      case "Open":
        return "bg-yellow-100 text-yellow-600";
      case "Processing":
        return "bg-purple-100 text-purple-600";
      case "Close":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Client-side search
  const filteredInquiries = inquiries.filter((item) =>
    item.company?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  // if (!user) {
  //   return <div className="p-10">Loading...</div>;
  // }

  return (
    <div className="flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 md:ml-64 pt-24 px-4 md:px-8 min-h-screen pb-16">
        <Header />

        {/* SINGLE INQUIRY VIEW */}
        {id ? (
          selectedInquiry ? (
            <>
              <button
                onClick={() => navigate("/user/inquiries")}
                className="mb-6 px-4 py-2 bg-gray-100 rounded-lg"
              >
                ← Back
              </button>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">
                  {selectedInquiry.company}
                </h2>

                <div className="space-y-3 text-gray-700">
                  <p><strong>Quantity:</strong> {selectedInquiry.quantity}</p>
                  <p><strong>Message:</strong> {selectedInquiry.message}</p>
                  <p><strong>Country:</strong> {selectedInquiry.country}</p>
                  <p><strong>State:</strong> {selectedInquiry.state}</p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`inline-block mt-4 px-4 py-2 rounded-full text-sm ${getStatusStyle(
                    selectedInquiry.status
                  )}`}
                >
                  {selectedInquiry.status}
                </span>
              </div>
            </>
          ) : (
            <h2 className="mt-10 text-lg">Inquiry Not Found</h2>
          )
        ) : (
          <>
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <h1 className="text-2xl font-semibold">My Inquiries</h1>

              <div className="bg-white px-4 py-2 rounded-xl">
                Total: {filteredInquiries.length}
              </div>
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* <input
                type="text"
                placeholder="Search company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-xl border"
              /> */}

              <select
                value={statusFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setStatusFilter(e.target.value);
                }}
                className="px-4 py-2 rounded-xl border"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Processing">Processing</option>
                <option value="Close">Close</option>
              </select>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="p-4">Company</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-500">
                        No Inquiries Found
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="p-4">{item.company}</td>
                        <td className="p-4">{item.quantity}</td>
                        <td className="p-4">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() =>
                              navigate(`/user/inquiries/inquiry-Detial`, {state: {data: item}})
                            }
                            className="px-4 py-2 bg-black text-white rounded-lg"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>}
          </>
        )}
      </div>
    </div>
  );
}