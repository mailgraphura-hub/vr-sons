import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  Search,
  Download,
  Users,
  UserCheck,
  UserX,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Eye,
} from "lucide-react";

export default function Customer() {

  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Global Logistics Ltd",
      email: "contact@global.com",
      company: "Global Logistics Ltd",
      country: "Germany",
      inquiries: 142,
      status: "Active",
      lastLogin: "Oct 24, 2023",
      volume: "$2.4M",
      shipments: 12,
    },
    {
      id: 2,
      name: "Pacific Trading Co.",
      email: "info@pacific.com",
      company: "Pacific Trading Co.",
      country: "Japan",
      inquiries: 89,
      status: "Active",
      lastLogin: "Oct 23, 2023",
      volume: "$1.2M",
      shipments: 8,
    },
    {
      id: 3,
      name: "Atlas Import Export",
      email: "atlas@mail.com",
      company: "Atlas Import Export",
      country: "Morocco",
      inquiries: 210,
      status: "Inactive",
      lastLogin: "Sep 12, 2023",
      volume: "$800K",
      shipments: 5,
    },
    {
      id: 4,
      name: "TransGlobal Inc.",
      email: "info@transglobal.com",
      company: "TransGlobal Inc.",
      country: "USA",
      inquiries: 95,
      status: "Active",
      lastLogin: "Oct 24, 2023",
      volume: "$1.8M",
      shipments: 7,
    },
    {
      id: 5,
      name: "EuroTrade Partners",
      email: "info@eurotrade.com",
      company: "EuroTrade Partners",
      country: "France",
      inquiries: 178,
      status: "Active",
      lastLogin: "Oct 22, 2023",
      volume: "$3.1M",
      shipments: 15,
    },
    {
      id: 6,
      name: "Sahara Exports",
      email: "info@saharaexports.com",
      company: "Sahara Exports",
      country: "Morocco",
      inquiries: 120,
      status: "Inactive",
      lastLogin: "Sep 30, 2023",
      volume: "$950K",
      shipments: 6,
    }
  ]);

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 5;

  /* ---------------- FILTER ---------------- */

  const countries = ["All", ...new Set(customers.map(c => c.country))];

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const searchMatch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase());

      const countryMatch =
        countryFilter === "All" || customer.country === countryFilter;

      const statusMatch =
        statusFilter === "All" || customer.status === statusFilter;

      return searchMatch && countryMatch && statusMatch;
    });
  }, [customers, search, countryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredCustomers.length / perPage);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [customers, totalPages]);

  /* ---------------- STATS ---------------- */

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "Active").length;
  const inactiveCustomers = customers.filter(c => c.status === "Inactive").length;

  /* ---------------- ACTIONS ---------------- */

  const openPopup = (customer) => {
    setSelectedCustomer(customer);
    setPopupOpen(true);
  };

  const deleteCustomer = (id) => {
    if (!window.confirm("Delete customer?")) return;
    setCustomers(prev => prev.filter(c => c.id !== id));
    setDropdownOpen(null);
  };

  const editCustomer = (customer) => {
    const newName = prompt("Enter new name", customer.name);
    if (!newName) return;
    setCustomers(prev =>
      prev.map(c =>
        c.id === customer.id ? { ...c, name: newName } : c
      )
    );
    setDropdownOpen(null);
  };

  /* ---------------- UI ---------------- */

  return (
    <AdminLayout>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Customer Management
            </h1>
            <p className="text-slate-500">
              Manage global buyers efficiently
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl shadow-sm hover:bg-slate-100 text-sm font-medium">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Stat title="Total Customers" value={totalCustomers} icon={Users} color="blue" />
          <Stat title="Active Customers" value={activeCustomers} icon={UserCheck} color="green" />
          <Stat title="Inactive Customers" value={inactiveCustomers} icon={UserX} color="red" />
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={countryFilter}
            onChange={(e)=>setCountryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200"
          >
            {countries.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e)=>setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-center">Country</th>
                <th className="p-4 text-center">Inquiries</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Last Login</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCustomers.map(customer => (
                <tr key={customer.id} className="border-t border-slate-100 hover:bg-slate-50 transition">

                  <td className="p-4 cursor-pointer" onClick={()=>openPopup(customer)}>
                    <div className="font-semibold text-slate-800">
                      {customer.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {customer.email}
                    </div>
                  </td>

                  <td className="p-4">{customer.company}</td>
                  <td className="p-4 text-center">{customer.country}</td>
                  <td className="p-4 text-center font-medium">{customer.inquiries}</td>

                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {customer.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">{customer.lastLogin}</td>

                  <td className="p-4 text-center relative">
                    <button
                      onClick={()=>setDropdownOpen(
                        dropdownOpen === customer.id ? null : customer.id
                      )}
                    >
                      <MoreVertical size={18}/>
                    </button>

                    {dropdownOpen === customer.id && (
                      <div className="absolute right-6 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg w-36 text-sm z-10">

                        <button
                          onClick={()=>{
                            navigate(`/admin/customers/${customer.id}`);
                            setDropdownOpen(null);
                          }}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 w-full"
                        >
                          <Eye size={14}/> View
                        </button>

                        <button
                          onClick={()=>editCustomer(customer)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 w-full"
                        >
                          <Pencil size={14}/> Edit
                        </button>

                        <button
                          onClick={()=>deleteCustomer(customer.id)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-red-600 w-full"
                        >
                          <Trash2 size={14}/> Delete
                        </button>

                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={()=>setCurrentPage(i+1)}
              className={`px-3 py-1 rounded-lg border text-sm ${
                currentPage === i+1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200"
              }`}
            >
              {i+1}
            </button>
          ))}
        </div>

        {/* POPUP */}
        {popupOpen && selectedCustomer && (
          <Popup
            customer={selectedCustomer}
            close={()=>setPopupOpen(false)}
          />
        )}
    </AdminLayout>
  );
}

/* STAT CARD */
function Stat({title,value,icon:Icon,color}){

  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600"
  };

  return(
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
      <div>
        <div className="text-slate-500 text-sm">{title}</div>
        <div className="text-3xl font-bold text-slate-800 mt-1">{value}</div>
      </div>
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon size={22}/>
      </div>
    </div>
  );
}

/* POPUP */
function Popup({customer,close}){
  return(
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl relative">
        <button onClick={close} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">
          <X size={18}/>
        </button>
        <h2 className="text-xl font-bold mb-4 text-slate-800">
          {customer.name}
        </h2>

        <div className="space-y-2 text-sm text-slate-600">
          <div><strong>Email:</strong> {customer.email}</div>
          <div><strong>Company:</strong> {customer.company}</div>
          <div><strong>Country:</strong> {customer.country}</div>
          <div><strong>Volume:</strong> {customer.volume}</div>
          <div><strong>Shipments:</strong> {customer.shipments}</div>
        </div>
      </div>
    </div>
  );
}