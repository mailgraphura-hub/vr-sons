import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  getService,
  postService,
  patchService,
  deleteService,
} from "../../service/axios";
import {
  Package,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Boxes,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function ProductManagement() {
  const PAGE_SIZE = 5;

  const emptyProduct = {
    categoryId: "",
    subCategoryId: "",
    name: "",
    skuId: "",
    description: "",
    specifications: "",
    status: "Available",
    images: [],
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async (page = 1) => {
    try {
      const res = await getService(
        `/admin/product/getAll?page=${page}&limit=${PAGE_SIZE}`
      );

      const result = res?.data?.data;

      setProducts(Array.isArray(result?.data) ? result.data : []);
      setCurrentPage(result?.currentPage || 1);
      setTotalPages(result?.totalPages || 1);
      setTotalItems(result?.totalItems || 0);
    } catch (err) {
      console.log(err);
      setProducts([]);
    }
  };

  /* ================= FETCH CATEGORIES ================= */

  const fetchCategories = async () => {
    try {
      const res = await getService("/admin/category/categoryItems");
      setCategories(Array.isArray(res?.data?.data?.data) ? res.data.data.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH SUBCATEGORIES ================= */

  const fetchSubCategories = async (categoryId) => {
    try {
      const res = await getService(
        `/admin/subcategory/getbyCategoryId/${categoryId}`
      );

      setSubCategories(
        Array.isArray(res?.data?.data?.data) ? res.data.data.data : []
      );
    } catch (err) {
      console.log(err);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= ADD PRODUCT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("categoryId", form.categoryId);
      formData.append("subCategoryId", form.subCategoryId);
      formData.append("name", form.name);
      formData.append("skuId", form.skuId);
      formData.append("description", form.description);
      formData.append("specifications", form.specifications);
      formData.append("status", form.status);

      form.images.forEach((file) => {
        formData.append("productImage", file);
      });

      await postService("/admin/product/addProduct", formData);

      setForm(emptyProduct);
      setSubCategories([]);
      fetchProducts(1);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    try {
      await deleteService(`/admin/product/delete?productId=${id}`);
      fetchProducts(currentPage);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= STATUS ================= */

  const toggleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Available"
        ? "Un-Available"
        : "Available";

    try {
      await patchService("/admin/product/updateStatus", {
        productId: id,
        status: newStatus,
      });

      fetchProducts(currentPage);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= STATS ================= */

  const stats = {
    total: totalItems,
    available: products.filter(
      (p) => p.status === "Available"
    ).length,
    unavailable: products.filter(
      (p) => p.status === "Un-Available"
    ).length,
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">
          Product Management
        </h1>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Boxes} label="Total" value={stats.total} />
        <StatCard icon={CheckCircle} label="Available" value={stats.available} green />
        <StatCard icon={AlertTriangle} label="Un-Available" value={stats.unavailable} red />
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} />
          <h2 className="font-semibold">Add Product</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">

            {/* CATEGORY DROPDOWN */}
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => {
                setForm({
                  ...form,
                  categoryId: e.target.value,
                  subCategoryId: "",
                });
                fetchSubCategories(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* SUBCATEGORY DROPDOWN */}
            <select
              className="input"
              value={form.subCategoryId}
              onChange={(e) =>
                setForm({
                  ...form,
                  subCategoryId: e.target.value,
                })
              }
            >
              <option value="">Select SubCategory</option>
              {subCategories.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <Input
              label="Product Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />

            <Input
              label="SKU ID"
              value={form.skuId}
              onChange={(v) => setForm({ ...form, skuId: v })}
            />

            <textarea
              className="input"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <textarea
              className="input"
              placeholder="Specifications"
              value={form.specifications}
              onChange={(e) =>
                setForm({ ...form, specifications: e.target.value })
              }
            />

            {/* STATUS */}
            <select
              className="input"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="Available">Available</option>
              <option value="Un-Available">Un-Available</option>
            </select>

            {/* IMAGE UPLOAD */}
            <label className="border-dashed border-2 rounded-lg p-4 flex items-center gap-3 cursor-pointer">
              <Upload size={18} />
              <span>Upload Product Images</span>
              <input
                type="file"
                multiple
                hidden
                onChange={(e) =>
                  setForm({
                    ...form,
                    images: Array.from(e.target.files),
                  })
                }
              />
            </label>
          </div>

          <div className="flex justify-end mt-6">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
              <Save size={16} />
              Save Product
            </button>
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.skuId}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => toggleStatus(p._id, p.status)}>
                    {p.status === "Available" ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

/* COMPONENTS */

const StatCard = ({ icon: Icon, label, value, green, red }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
    <Icon className={`${green?"text-green-600":red?"text-red-600":"text-blue-600"}`} />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <input
    className="input"
    placeholder={label}
    value={value}
    onChange={(e)=>onChange(e.target.value)}
  />
);