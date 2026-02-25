import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/user/sidebar";
import Header from "../../components/user/Header";

export default function InquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const inquiries = [
    {
      id: "1",
      product: "Industrial Drill Machine",
      quantity: 10,
      message: "Need bulk order pricing details.",
      date: "20 Feb 2026",
      status: "New",
      image:
        "https://images.unsplash.com/photo-1581092918484-8313f22a0fbb?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "2",
      product: "Steel Pipes",
      quantity: 200,
      message: "Looking for export quality pipes.",
      date: "18 Feb 2026",
      status: "In Progress",
      image:
        "https://images.unsplash.com/photo-1581093458791-9d2f1a9e6b8b?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "3",
      product: "Safety Helmets",
      quantity: 150,
      message: "Need ISI certified helmets.",
      date: "15 Feb 2026",
      status: "Contacted",
      image:
        "https://images.unsplash.com/photo-1581091012184-5c59d8f3c1e4?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "4",
      product: "Hydraulic Pump",
      quantity: 5,
      message: "Urgent requirement for export.",
      date: "10 Feb 2026",
      status: "Closed",
      image:
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const inquiry = inquiries.find((item) => item.id === id);

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-yellow-100 text-yellow-600";
      case "Contacted":
        return "bg-blue-100 text-blue-600";
      case "In Progress":
        return "bg-purple-100 text-purple-600";
      case "Closed":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (!inquiry) {
    return (
      <div className="flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 pt-20 md:pt-8 px-4 md:px-8 min-h-screen">
          <Header />
          <h2 className="text-lg font-medium text-gray-700 mt-10">
            Inquiry Not Found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 md:ml-64 pt-20 md:pt-8 px-4 md:px-8 min-h-screen">
        <Header />

        {/* Back Button */}
        <button
          onClick={() => navigate("/user/inquiries")}
          className="mb-6 px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 grid md:grid-cols-2 gap-8">

          {/* Image */}
          <div>
            <img
              src={inquiry.image}
              alt={inquiry.product}
              className="w-full h-64 md:h-96 object-cover rounded-xl"
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/600x400?text=No+Image")
              }
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              {inquiry.product}
            </h2>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Quantity
              </p>
              <p className="text-gray-800">
                {inquiry.quantity}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Message Sent
              </p>
              <p className="text-gray-700">
                {inquiry.message}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Inquiry Date
              </p>
              <p className="text-gray-800">
                {inquiry.date}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">
                Current Status
              </p>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
                  inquiry.status
                )}`}
              >
                {inquiry.status}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}