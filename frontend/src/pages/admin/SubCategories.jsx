import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  getService,
  postService,
  patchService,
  deleteService,
} from "../../service/axios";
import {
  Trash2,
  Plus,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";

const PAGE_SIZE = 5;

export default function SubCategories() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [parentFilter, setParentFilter] = useState("");
  const [page, setPage] = useState(1);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);

  const [modal, setModal] = useState(false);

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [skuId, setSkuId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  /* ================= FETCH CATEGORIES ================= */

  const fetchCategories = async () => {
    try {
      const res = await getService("/admin/category/categoryItems");
      setCategories(res.data?.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= GET ALL ================= */

  const fetchSubCategories = async (pageNumber = 1) => {
    try {
      const res = await getService(
        `/admin/subcategory/getAll?page=${pageNumber}&limit=${PAGE_SIZE}`
      );

      const result = res.data?.data || {};

      setSubCategories(Array.isArray(result.data) ? result.data : []);
      setTotalItems(result.totalItems || 0);
      setTotalPages(result.totalPages || 1);
      setActive(result.available || 0);
      setInactive(result.unavailable || 0);
      setPage(result.currentPage || 1);
    } catch (err) {
      console.log(err);
      setSubCategories([]);
    }
  };

  /* ================= SEARCH ================= */

  const handleSearch = async (keyword, pageNumber = 1) => {
    try {
      setSearch(keyword);
      setParentFilter("");
      setPage(pageNumber);

      if (!keyword) return fetchSubCategories(pageNumber);

      const res = await getService(
        `/admin/search/subcategory?keyword=${keyword}&page=${pageNumber}&limit=${PAGE_SIZE}`
      );

      const result = res.data?.data || {};

      setSubCategories(
        Array.isArray(result.subcategories) ? result.subcategories : []
      );
      setTotalItems(result.pagination?.totalItems || 0);
      setTotalPages(result.pagination?.totalPages || 1);
      setPage(result.pagination?.currentPage || 1);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= SUGGESTION ================= */

  const fetchSuggestions = async (keyword) => {
    try {
      if (!keyword) {
        setSuggestions([]);
        return;
      }

      const res = await getService(
        `/admin/search/suggestion/subcategory?keyword=${keyword}`
      );

      setSuggestions(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= CATEGORY FILTER ================= */

  const handleCategoryFilter = async (id, pageNumber = 1) => {
    try {
      setParentFilter(id);
      setSearch("");
      setSuggestions([]);
      setPage(pageNumber);

      if (!id) return fetchSubCategories(pageNumber);

      const res = await getService(
        `/admin/subcategory/getbyCategoryId/${id}?page=${pageNumber}&limit=${PAGE_SIZE}`
      );

      const result = res.data?.data || {};

      setSubCategories(Array.isArray(result.data) ? result.data : []);
      setTotalItems(result.totalItems || 0);
      setTotalPages(result.totalPages || 1);
      setPage(result.currentPage || 1);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= STATUS ================= */

  const toggleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Available" ? "Un-Available" : "Available";

    try {
      await patchService("/admin/subcategory/updateStatus", {
        subCategoryId: id,
        status: newStatus,
      });

      setSubCategories((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE ================= */

  const deleteSub = async (id) => {
    if (!window.confirm("Delete this sub-category?")) return;

    try {
      const apiResponse = await deleteService(`/admin/subcategory/delete?subCategoryId=${id}`);

      fetchSubCategories(page);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= ADD ================= */

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("categoryId", parentId);
      formData.append("skuId", skuId);
      formData.append("decription", description);
      if (image) formData.append("subcategoryImage", image);

      await postService("/admin/subcategory/addSubcategory", formData);

      setModal(false);
      setName("");
      setParentId("");
      setSkuId("");
      setDescription("");
      setImage(null);

      fetchSubCategories(1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (search) handleSearch(search, page);
    else if (parentFilter) handleCategoryFilter(parentFilter, page);
    else fetchSubCategories(page);
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-extrabold">
          Sub-Category Management
        </h1>

        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold"
        >
          <Plus size={18} />
          Add Sub-Category
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-xl border shadow-sm mb-6 p-5 flex gap-6">
        <select
          value={parentFilter}
          onChange={(e) => handleCategoryFilter(e.target.value, 1)}
          className="border rounded-lg px-4 py-2 text-sm w-60"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              fetchSuggestions(value);
              handleSearch(value, 1);
            }}
            placeholder="Search SubCategory..."
            className="border rounded-lg px-4 py-2 text-sm w-60"
          />

          {suggestions.length > 0 && (
            <div className="absolute bg-white border mt-1 w-full shadow rounded-lg z-10 max-h-52 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearch(item.name);
                    setSuggestions([]);
                    handleSearch(item.name, 1);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setSearch("");
            setParentFilter("");
            setSuggestions([]);
            fetchSubCategories(1);
          }}
          className="flex items-center gap-1 text-sm text-blue-600"
        >
          <X size={14} /> Clear
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="divide-y">

          {subCategories.map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
            >

              {/* LEFT SIDE */}
              <div className="flex items-center gap-5">

                {/* IMAGE */}
                <div className="w-16 h-16 rounded-xl overflow-hidden border">
                  {s.subcategoryImage ? (
                    <img
                      src={s.subcategoryImage}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* NAME + SKU */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {s.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    SKU: {s.skuId}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-6">

                {/* STATUS TOGGLE */}
                <button
                  onClick={() => toggleStatus(s._id, s.status)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${s.status === "Available"
                      ? "bg-blue-600 shadow-md shadow-blue-300"
                      : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-300 ${s.status === "Available"
                        ? "translate-x-7"
                        : "translate-x-1"
                      }`}
                  />
                </button>

                {/* DELETE */}
                <button
                  onClick={() => deleteSub(s._id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 size={18} className="text-gray-500 hover:text-red-600 transition" />
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative shadow-lg">
            <button
              onClick={() => setModal(false)}
              className="absolute top-4 right-4"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Add New Sub-Category
            </h2>

            <div className="space-y-4">
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="SubCategory Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="text"
                placeholder="SKU ID"
                value={skuId}
                onChange={(e) => setSkuId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full"
              />

              <button
                onClick={handleAdd}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold"
              >
                Add Sub-Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatCard icon={<BarChart3 size={22} />} label="Total" value={totalItems} color="blue" />
        <StatCard icon={<CheckCircle2 size={22} />} label="Available" value={active} color="green" />
        <StatCard icon={<AlertTriangle size={22} />} label="Un-Available" value={inactive} color="orange" />
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        {icon}
      </div>
      <h4 className="text-2xl font-extrabold mt-3">{value}</h4>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}