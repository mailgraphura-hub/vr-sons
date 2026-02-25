import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  X,
  Eye,
  Edit,
} from "lucide-react";
import {
  getService,
  postService,
  putService,
  deleteService,
} from "../../service/axios";
import { toast } from "react-hot-toast";

const emptyForm = {
  title: "",
  author: "",
  description: "",
  status: true,
  blogMedia: [],
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [previewBlog, setPreviewBlog] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = async () => {
    try {
      const res = await getService("/admin/blog");
      setBlogs(res?.data?.data?.blogList || []);
    } catch (err) {
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = "Title is required";
    if (!form.author.trim()) err.author = "Author is required";
    if (!form.description.trim()) err.description = "Description is required";
    if (!selectedId && form.blogMedia.length === 0)
      err.blogMedia = "At least one image is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("description", form.description);
      formData.append("status", form.status);

      form.blogMedia.forEach((file) => {
        formData.append("blogMedia", file);
      });

      if (selectedId) {
        formData.append("blogId", selectedId);
        await putService("/admin/blog/update", formData);
        toast.success("Blog updated successfully");
      } else {
        await postService("/admin/blog/addBlog", formData);
        toast.success("Blog added successfully");
      }

      setForm(emptyForm);
      setSelectedId(null);
      fetchBlogs();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await deleteService(`/admin/blog/delete?blogId=${id}`);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (blog) => {
    try {
      await putService("/admin/blog/update", {
        blogId: blog._id,
        status: !blog.status,
      });
      fetchBlogs();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      author: blog.author,
      description: blog.description,
      status: blog.status,
      blogMedia: [],
    });
    setSelectedId(blog._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      blogMedia: [...prev.blogMedia, ...files],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      blogMedia: prev.blogMedia.filter((_, i) => i !== index),
    }));
  };

  /* ================= FILTER ================= */
  const filtered = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Blog Management</h1>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">

        {/* ===== LEFT FORM ===== */}
        <div className="xl:col-span-2 bg-white rounded-2xl border p-6 space-y-6">

          <h2 className="text-lg font-semibold">
            {selectedId ? "Update Blog" : "Create New Blog"}
          </h2>

          <div>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-xl px-4 py-2"
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full border rounded-xl px-4 py-2"
            />
            {errors.author && <p className="text-red-500 text-xs">{errors.author}</p>}
          </div>

          <div>
            <textarea
              rows={5}
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-xl px-4 py-2"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>

          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            {errors.blogMedia && (
              <p className="text-red-500 text-xs">{errors.blogMedia}</p>
            )}

            {form.blogMedia.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {form.blogMedia.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 border rounded">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border p-4 rounded-xl">
            <span>Publish</span>
            <button onClick={() => setForm({ ...form, status: !form.status })}>
              {form.status ? (
                <ToggleRight size={28} className="text-green-500" />
              ) : (
                <ToggleLeft size={28} />
              )}
            </button>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setForm(emptyForm);
                setSelectedId(null);
              }}
              className="px-4 py-2 border rounded-xl"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl"
            >
              {loading
                ? "Processing..."
                : selectedId
                ? "Update Blog"
                : "Publish Blog"}
            </button>
          </div>
        </div>

        {/* ===== RIGHT LIST ===== */}
        <div className="bg-white rounded-2xl border">

          <div className="p-4 border-b flex items-center gap-2">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-[600px] overflow-y-auto divide-y">
            {filtered.map((blog) => (
              <div key={blog._id} className="p-4">

                <div className="flex justify-between">
                  <h4 className="text-sm font-semibold">{blog.title}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      blog.status
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {blog.status ? "Live" : "Draft"}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {blog.author}
                </p>

                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => toggleStatus(blog)}>
                    {blog.status ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>

                  <button onClick={() => handleEdit(blog)}>
                    <Edit size={16} />
                  </button>

                  <button onClick={() => setPreviewBlog(blog)}>
                    <Eye size={16} />
                  </button>

                  <button onClick={() => handleDelete(blog._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}