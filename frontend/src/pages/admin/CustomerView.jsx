import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  BarChart3,
  History,
  Bookmark,
  StickyNote,
  Send,
  KeyRound,
  UserX,
} from "lucide-react";

export default function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">

        {/* Breadcrumb + Back */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Customers <span className="mx-1">›</span>
            <span className="text-slate-900 font-semibold">
              John Doe Profile
            </span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary"
          >
            <ArrowLeft size={16} /> Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ================= LEFT CONTENT ================= */}
          <div className="lg:col-span-3 space-y-8">

            {/* Profile Card */}
            <div className="bg-white rounded-xl border p-6 relative">
              <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700 border">
                ⭐ VIP MEMBER
              </span>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-24 h-24 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">John Doe</h1>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 border">
                      ACTIVE
                    </span>
                  </div>

                  <p className="text-slate-600 font-medium">
                    VP of Logistics,
                    <span className="text-primary ml-1">
                      VR & Sons Import-Export
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Mail size={16} /> j.doe@company.com
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={16} /> +44 20 7946 0958
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> London, UK
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Total Inquiries"
                value="128"
                icon={<BarChart3 />}
                extra="+12% vs LY"
              />
              <StatCard
                title="Requested Category"
                value="Industrial Valves"
              />
              <StatCard
                title="Account Age"
                value="4.2 Years"
                icon={<Calendar />}
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="flex border-b bg-slate-50">
                <Tab active icon={<History size={18} />} label="Inquiry History" />
                <Tab icon={<Bookmark size={18} />} label="Saved Products" />
                <Tab icon={<StickyNote size={18} />} label="Internal Notes" />
              </div>

              {/* Inquiry Table */}
              <div className="overflow-x-auto relative">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 text-left">Inquiry ID</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Qty</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <InquiryRow id="#IV-99234" cat="Pressure Relief Valves" qty="500" date="Oct 12, 2023" status="Pending" />
                    <InquiryRow id="#HP-88120" cat="Hydraulic Pumps" qty="12" date="Sep 28, 2023" status="Fulfilled" />
                    <InquiryRow id="#MC-77211" cat="Metric Couplings" qty="1200" date="Sep 15, 2023" status="Fulfilled" />
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= ADMIN NOTES ================= */}
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <StickyNote size={18} className="text-primary" />
                Admin Notes (Internal)
              </h3>

              <textarea
                className="w-full h-32 rounded-lg border p-4 text-sm"
                placeholder="Add a private note about this client..."
              />

              <div className="bg-blue-50 border rounded p-3">
                <p className="text-xs font-bold text-primary">
                  OCT 05, 2023 • MARK R.
                </p>
                <p className="text-sm">
                  Client is looking to expand their valve order by 20% in Q4.
                </p>
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-6">

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">
                Quick Actions
              </h4>

              <ActionBtn icon={<Send />} text="Send Direct Email" primary />
              <ActionBtn icon={<KeyRound />} text="Reset Password" />
              <div className="h-px bg-slate-200 my-4" />
              <ActionBtn icon={<UserX />} text="Suspend Account" danger />
            </div>

            {/* Recent Activity */}
            <div className="bg-primary/5 rounded-xl border p-5">
              <h4 className="text-xs font-bold text-primary uppercase mb-4">
                Recent Activity
              </h4>

              <ul className="space-y-3 text-xs">
                <li>Requested Quote #IV-99234 • 2h ago</li>
                <li>Bookmarked Hydraulic Pump • Yesterday</li>
                <li>Updated Shipping Address • 3 days ago</li>
              </ul>
            </div>

          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, icon, extra }) => (
  <div className="bg-white rounded-xl border p-6">
    <div className="flex justify-between text-slate-500 text-sm">
      {title} {icon}
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-bold">{value}</h3>
      {extra && <span className="text-green-500 text-sm">{extra}</span>}
    </div>
  </div>
);

const Tab = ({ icon, label, active }) => (
  <button
    className={`px-6 py-4 flex items-center gap-2 text-sm font-bold
      ${active ? "border-b-2 border-primary text-primary" : "text-slate-500"}`}
  >
    {icon} {label}
  </button>
);

const InquiryRow = ({ id, cat, qty, date, status }) => (
  <tr className="hover:bg-slate-50">
    <td className="px-6 py-4 font-mono text-primary">{id}</td>
    <td className="px-6 py-4">{cat}</td>
    <td className="px-6 py-4">{qty}</td>
    <td className="px-6 py-4 text-slate-500">{date}</td>
    <td className="px-6 py-4 text-right">
      <span className="px-2 py-0.5 rounded text-xs border">
        {status}
      </span>
    </td>
  </tr>
);

const ActionBtn = ({ icon, text, primary, danger }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold
      ${primary && "bg-primary text-white"}
      ${danger && "bg-red-50 text-red-600 border"}
      ${!primary && !danger && "bg-slate-100"}`}
  >
    {icon} {text}
  </button>
);