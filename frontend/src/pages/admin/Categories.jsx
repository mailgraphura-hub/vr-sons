import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getService, postService, patchService } from "../../service/axios";
import { toast } from "react-hot-toast";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [image, setImage] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

 

  const fetchAllCategories = async () => {
    try {
      const response = await getService(
        `/admin/category/categoryItems?page=${page}&limit=${limit}`
      );

      if (response?.ok) {
        const categoryArray = response?.data?.data?.data || [];
        setCategories(categoryArray);
        setTotalPages(response?.data?.data?.totalPages || 1);
      }
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };



  const fetchSearchCategories = async () => {
    try {
      const response = await getService(
        `/admin/search/category?page=${page}&limit=${limit}&keyword=${search}`
      );

      console.log(response.data.data)

      if (response?.ok) {
        const categoryArray = response?.data?.data?.categories || [];
        setCategories(categoryArray);
        setTotalPages(response?.data?.data?.pagination.totalPages || 1);
      }
    } catch (err) {
      toast.error("Search failed");
    }
  };



  useEffect(() => {
    if (search.trim()) {
      fetchSearchCategories();
    } else {
      fetchAllCategories();
    }
  }, [page, search]);

 

  const fetchSuggestions = async (value) => {
    try {
      if (!value.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const response = await getService(
        `/admin/search/suggestion/category?keyword=${value}`
      );

      if (response?.ok) {
        setSuggestions(response?.data?.data || []);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.log("Suggestion error");
    }
  };



  useEffect(() => {
    const generated = (name || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    setSlug(generated);
  }, [name]);



  const handleAddCategory = async () => {
    if (!name?.trim()) return toast.error("Category name required");
    if (!description?.trim()) return toast.error("Description required");
    if (!image) return toast.error("Category image required");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("skuId", slug);
      formData.append("decription", description);
      formData.append("status", enabled ? "Available" : "Un-Available");
      formData.append("categoryImage", image);

      const response = await postService(
        "/admin/category/addCategory",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.ok) {
        toast.success("Category Added Successfully");
        fetchAllCategories();
        closeModal();
      }
    } catch (err) {
      toast.error("Add Category Failed");
    }
  };



  const handleUpdateCategory = async () => {
    if (!name?.trim()) return toast.error("Category name required");
    if (!description?.trim()) return toast.error("Description required");

    try {
      const response = await patchService(
        `/admin/category/updateStatus`,
        {
          categoryId: editId,
          name,
          skuId: slug,
          decription: description,
          status: enabled ? "Available" : "Un-Available",
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.ok) {
        toast.success("Category Updated Successfully");
        if (search.trim()) {
          fetchSearchCategories();
        } else {
          fetchAllCategories();
        }
        closeModal();
      }
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  const handleSave = () => {
    editId ? handleUpdateCategory() : handleAddCategory();
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setName(category.name || "");
    setSlug(category.skuId || "");
    setDescription(category.decription || "");
    setEnabled(category.status === "Available");
    setImage(null);
    setModal(true);
  };

  /* ================= TOGGLE STATUS ================= */

  const toggleStatus = async (category) => {
    try {
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("skuId", category.skuId);
      formData.append("decription", category.decription);
      formData.append(
        "status",
        category.status === "Available"
          ? "Un-Available"
          : "Available"
      );

      await postService(
        `/admin/category/updateCategory/${category._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (search.trim()) {
        fetchSearchCategories();
      } else {
        fetchAllCategories();
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  /* ================= CLOSE MODAL ================= */

  const closeModal = () => {
    setModal(false);
    setEditId(null);
    setName("");
    setSlug("");
    setDescription("");
    setEnabled(true);
    setImage(null);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <button
          onClick={() => setModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Category
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            setPage(1);
            fetchSuggestions(value);
          }}
          className="border px-4 py-2 rounded-lg w-80"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute bg-white border w-80 rounded-lg shadow mt-1 z-50">
            {suggestions.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  setSearch(item.name);
                  setShowSuggestions(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((c) => (
                <tr key={c._id} className="border-b">
                  <td className="p-4">
                    <img
                      src={c.categoryImage}
                      alt={c.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(c)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        c.status === "Available"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </button>
                  </td>
                  <td className="p-4">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No Categories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 p-4 border-t">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 border rounded ${
                  page === num ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {num}
              </button>
            )
          )}
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Category" : "Add New Category"}
            </h2>

            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded mb-4"
            />

            <input
              type="text"
              value={slug}
              disabled
              className="w-full border p-3 rounded mb-4 bg-gray-100"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-3 rounded mb-4"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border p-3 rounded mb-4"
            />

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => setEnabled(!enabled)}
                className="mr-2"
              />
              Available Category
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}