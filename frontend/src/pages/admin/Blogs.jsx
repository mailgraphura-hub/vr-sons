import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  Trash2, ToggleLeft, ToggleRight, Search,
  X, Eye, Edit, Upload, BookOpen, Plus, ChevronDown, ChevronUp,
  List,
} from "lucide-react";
import {
  getService, postService, putService, deleteService,
} from "../../service/axios";
import { toast } from "react-hot-toast";

/* ── Brand tokens ────────────────────────────────────────────────────────*/
const T = {
  primary:     "#c36a4d",
  primaryHov:  "#ad5d42",
  primaryDark: "#8f4c35",
  tint10:      "#fdf3f0",
  tint20:      "#fae4dc",
  tint40:      "#f0bfb0",
  border:      "#f2e0da",
  muted:       "#a17060",
  mutedLight:  "#b09080",
};

const emptyForm = {
  title: "", author: "", description: "", status: true, blogMedia: [],
};

const labelCls = `block text-[11px] font-bold uppercase tracking-widest mb-1.5`;

/* ── View states for mobile ──────────────────────────────────────────────*/
// "form" = show the create/edit form
// "list" = show the blog list full screen
const MOBILE_VIEW = { FORM: "form", LIST: "list" };

export default function Blogs() {
  const [blogs, setBlogs]             = useState([]);
  const [form, setForm]               = useState(emptyForm);
  const [search, setSearch]           = useState("");
  const [previewBlog, setPreviewBlog] = useState(null);
  const [errors, setErrors]           = useState({});
  const [selectedId, setSelectedId]   = useState(null);
  const [loading, setLoading]         = useState(false);
  const [mobileView, setMobileView]   = useState(MOBILE_VIEW.FORM); // mobile tab state

  /* ── API — completely untouched ─────────────────────────────────────── */
  const fetchBlogs = async () => {
    try {
      const res = await getService("/admin/blog");
      setBlogs(res?.data?.data?.blogList || []);
    } catch { toast.error("Failed to fetch blogs"); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const validate = () => {
    const err = {};
    if (!form.title.trim())       err.title       = "Title is required";
    if (!form.author.trim())      err.author      = "Author is required";
    if (!form.description.trim()) err.description = "Description is required";
    if (!selectedId && form.blogMedia.length === 0) err.blogMedia = "At least one image is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("description", form.description);
      formData.append("status", form.status);
      form.blogMedia.forEach((file) => formData.append("blogMedia", file));
      if (selectedId) {
        formData.append("blogId", selectedId);
        await putService("/admin/blog/update", formData);
        toast.success("Blog updated successfully");
      } else {
        await postService("/admin/blog/addBlog", formData);
        toast.success("Blog added successfully");
      }
      setForm(emptyForm); setSelectedId(null); fetchBlogs();
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await deleteService(`/admin/blog/delete?blogId=${id}`);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch { toast.error("Delete failed"); }
  };

  const toggleStatus = async (blog) => {
    try {
      await putService("/admin/blog/update", { blogId: blog._id, status: !blog.status });
      fetchBlogs();
    } catch { toast.error("Status update failed"); }
  };

  const handleEdit = (blog) => {
    setForm({ title: blog.title, author: blog.author, description: blog.description, status: blog.status, blogMedia: [] });
    setSelectedId(blog._id);
    setMobileView(MOBILE_VIEW.FORM); // switch to form on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, blogMedia: [...prev.blogMedia, ...files] }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, blogMedia: prev.blogMedia.filter((_, i) => i !== index) }));
  };

  const filtered = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );
  /* ─────────────────────────────────────────────────────────────────── */

  return (
    <AdminLayout>
      <div className="max-w-[1200px] mx-auto space-y-0 px-0 pb-20 xl:pb-0">

        {/* ── Page heading ──────────────────────────────────────────────── */}
        <div className="mb-4 sm:mb-5">
          <h1 className="text-[18px] sm:text-[22px] font-bold tracking-tight" style={{ color: "#1a1a1a" }}>Blog Management</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: T.mutedLight }}>Create, edit and manage your blog posts</p>
        </div>

        {/* ── MOBILE: Tab switcher ──────────────────────────────────────── */}
        <div className="xl:hidden flex mb-4 rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-all duration-150"
            style={{
              background: mobileView === MOBILE_VIEW.FORM ? T.primary : "white",
              color: mobileView === MOBILE_VIEW.FORM ? "white" : T.muted,
            }}
            onClick={() => setMobileView(MOBILE_VIEW.FORM)}
          >
            <Plus size={14} />
            {selectedId ? "Edit Blog" : "Create Blog"}
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-all duration-150"
            style={{
              background: mobileView === MOBILE_VIEW.LIST ? T.primary : "white",
              color: mobileView === MOBILE_VIEW.LIST ? "white" : T.muted,
              borderLeft: `1px solid ${T.border}`,
            }}
            onClick={() => setMobileView(MOBILE_VIEW.LIST)}
          >
            <List size={14} />
            All Blogs
            {blogs.length > 0 && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: mobileView === MOBILE_VIEW.LIST ? "rgba(255,255,255,0.3)" : T.tint20,
                  color: mobileView === MOBILE_VIEW.LIST ? "white" : T.primary,
                }}
              >
                {blogs.length}
              </span>
            )}
          </button>
        </div>

        <div className="grid xl:grid-cols-3 gap-4 sm:gap-5">

          {/* ── LEFT: Form (hidden on mobile when list tab active) ────────── */}
          <div
            className={`xl:col-span-2 xl:block rounded-2xl overflow-hidden transition-shadow duration-200 ${mobileView === MOBILE_VIEW.LIST ? "hidden xl:block" : "block"}`}
            style={{
              background: "white",
              border: `1px solid ${T.border}`,
              boxShadow: "0 1px 4px rgba(195,106,77,0.07)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 6px 24px rgba(195,106,77,0.11)`}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(195,106,77,0.07)"}
          >
            {/* Form header */}
            <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4"
              style={{ borderBottom: `1px solid ${T.border}`, background: T.tint10 }}>
              <div
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: T.tint20, border: `1px solid ${T.border}`, color: T.primary }}
              >
                {selectedId ? <Edit size={13} /> : <Plus size={13} />}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[13px] sm:text-[14px] font-bold truncate" style={{ color: T.primaryDark }}>
                  {selectedId ? "Update Blog Post" : "Create New Blog Post"}
                </h2>
                <p className="text-[11px] sm:text-[12px]" style={{ color: T.mutedLight }}>
                  {selectedId ? "Edit the details below" : "Fill in all the details below"}
                </p>
              </div>
              {selectedId && (
                <ClearBtn onClick={() => { setForm(emptyForm); setSelectedId(null); }} />
              )}
            </div>

            {/* Fields */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">

              <BrandField label="Title" error={errors.title}>
                <input
                  type="text"
                  placeholder="Enter blog title..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full"
                  style={inputStyle()}
                  onFocus={(e) => applyFocus(e)}
                  onBlur={(e) => removeFocus(e)}
                />
              </BrandField>

              <BrandField label="Author" error={errors.author}>
                <input
                  type="text"
                  placeholder="Author name..."
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  style={inputStyle()}
                  onFocus={(e) => applyFocus(e)}
                  onBlur={(e) => removeFocus(e)}
                />
              </BrandField>

              <BrandField label="Description" error={errors.description}>
                <textarea
                  rows={4}
                  placeholder="Write blog content here..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ ...inputStyle(), resize: "none" }}
                  onFocus={(e) => applyFocus(e)}
                  onBlur={(e) => removeFocus(e)}
                />
              </BrandField>

              {/* Image upload */}
              <div>
                <label className={labelCls} style={{ color: T.muted }}>Media / Images</label>
                <label
                  className="flex items-center gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl cursor-pointer transition-all duration-150"
                  style={{ border: `1.5px dashed ${T.tint40}`, background: T.tint10 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.background = T.tint20; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.tint40; e.currentTarget.style.background = T.tint10; }}
                >
                  <div
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: T.tint20, border: `1px solid ${T.border}`, color: T.primary }}
                  >
                    <Upload size={13} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] sm:text-[13px] font-semibold truncate" style={{ color: T.primaryDark }}>
                      {form.blogMedia.length > 0 ? `${form.blogMedia.length} file(s) selected` : "Click to upload images"}
                    </p>
                    <p className="text-[11px] sm:text-[11.5px]" style={{ color: T.mutedLight }}>PNG, JPG, WEBP supported</p>
                  </div>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {errors.blogMedia && <p className="text-[11.5px] text-red-500 mt-1 font-medium">{errors.blogMedia}</p>}

                {form.blogMedia.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {form.blogMedia.map((file, i) => (
                      <div key={i} className="relative group/thumb w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-sm"
                        style={{ border: `1px solid ${T.border}` }}>
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/25 transition-all duration-150 rounded-xl" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 h-5 w-5 bg-red-500 hover:bg-red-600 text-white
                                     rounded-full flex items-center justify-center opacity-0
                                     group-hover/thumb:opacity-100 transition-all duration-150 shadow"
                        >
                          <X size={9} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Publish toggle */}
              <div
                className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl cursor-pointer transition-all duration-150"
                style={{ border: `1px solid ${T.border}`, background: T.tint10 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = T.tint20; e.currentTarget.style.borderColor = T.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = T.tint10; e.currentTarget.style.borderColor = T.border; }}
                onClick={() => setForm({ ...form, status: !form.status })}
              >
                <div className="min-w-0 pr-3">
                  <p className="text-[12px] sm:text-[13px] font-semibold" style={{ color: T.primaryDark }}>Publish Status</p>
                  <p className="text-[11px] sm:text-[11.5px] mt-0.5" style={{ color: T.mutedLight }}>
                    {form.status ? "This post will be live and visible" : "Saved as draft, not visible"}
                  </p>
                </div>
                <div
                  className="relative shrink-0 rounded-full transition-colors duration-200"
                  style={{ width: 40, height: 22, background: form.status ? T.primary : "#e5e7eb" }}
                >
                  <div
                    className="absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: form.status ? "translateX(20px)" : "translateX(2px)" }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-end gap-2 sm:gap-2.5 px-4 sm:px-6 py-3 sm:py-4"
              style={{ borderTop: `1px solid ${T.border}`, background: T.tint10 }}
            >
              <GhostBtn onClick={() => { setForm(emptyForm); setSelectedId(null); }}>Clear</GhostBtn>
              <PrimaryBtn onClick={handleSubmit} disabled={loading} icon={<BookOpen size={13} />}>
                {loading ? "Processing..." : selectedId ? "Update Blog" : "Publish Blog"}
              </PrimaryBtn>
            </div>
          </div>

          {/* ── RIGHT: Blog list ──────────────────────────────────────────── */}
          {/* On mobile: shown when mobileView === LIST. On desktop: always shown */}
          <div
            className={`xl:flex rounded-2xl overflow-hidden flex-col transition-shadow duration-200 ${mobileView === MOBILE_VIEW.LIST ? "flex" : "hidden xl:flex"}`}
            style={{
              background: "white",
              border: `1px solid ${T.border}`,
              boxShadow: "0 1px 4px rgba(195,106,77,0.07)",
              /* On mobile list view, let it be as tall as needed */
              minHeight: mobileView === MOBILE_VIEW.LIST ? "auto" : undefined,
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 6px 24px rgba(195,106,77,0.11)`}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(195,106,77,0.07)"}
          >
            {/* Search */}
            <div
              className="flex items-center gap-2.5 px-4 py-3 sm:py-3.5 shrink-0"
              style={{ borderBottom: `1px solid ${T.border}`, background: T.tint10 }}
            >
              <Search size={13} style={{ color: T.muted }} className="shrink-0" />
              <input
                type="text"
                placeholder="Search by title or author..."
                className="flex-1 text-[12px] sm:text-[13px] placeholder-gray-400 outline-none bg-transparent"
                style={{ color: T.primaryDark }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ color: T.muted }}
                  onMouseEnter={(e) => e.currentTarget.style.color = T.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = T.muted}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Count bar */}
            <div className="px-4 py-2 shrink-0 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.border}` }}>
              <span className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>
                {filtered.length} Post{filtered.length !== 1 ? "s" : ""}
                {search && ` for "${search}"`}
              </span>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[11px] font-semibold"
                  style={{ color: T.primary }}
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Blog cards — scrollable on desktop, full height on mobile */}
            <div
              className="overflow-y-auto"
              style={{
                /* Desktop: fixed height to keep sidebar scrollable */
                maxHeight: "calc(100vh - 260px)",
              }}
            >
              {filtered.length === 0 ? (
                <div className="py-12 text-center" style={{ color: T.mutedLight }}>
                  <BookOpen size={28} className="mx-auto mb-2 opacity-30" style={{ color: T.muted }} />
                  <p className="text-[13px] font-medium">
                    {search ? `No results for "${search}"` : "No blogs yet"}
                  </p>
                  {search && (
                    <button onClick={() => setSearch("")} className="mt-2 text-[12px] font-semibold" style={{ color: T.primary }}>
                      Clear search
                    </button>
                  )}
                </div>
              ) : filtered.map((blog) => {
                const isSelected = selectedId === blog._id;
                return (
                  <div
                    key={blog._id}
                    className="p-3 sm:p-4 transition-colors duration-150 cursor-default"
                    style={{
                      background: isSelected ? T.tint20 : "white",
                      borderBottom: `1px solid ${T.tint10}`,
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = T.tint10; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "white"; }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shrink-0 mt-0.5"
                          style={{ background: T.tint20, border: `1px solid ${T.border}` }}
                        >
                          {blog.blogMedia?.[0] ? (
                            <img src={blog.blogMedia[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen size={12} style={{ color: T.primary }} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] sm:text-[13px] font-semibold leading-tight line-clamp-1" style={{ color: "#1a1a1a" }}>
                            {blog.title}
                          </p>
                          <p className="text-[11px] sm:text-[11.5px] mt-0.5 truncate" style={{ color: T.mutedLight }}>
                            {blog.author}
                          </p>
                        </div>
                      </div>
                      <span
                        className="shrink-0 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[10.5px] font-semibold rounded-lg border"
                        style={blog.status
                          ? { background: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0" }
                          : { background: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }
                        }
                      >
                        {blog.status ? "Live" : "Draft"}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="text-[11px] sm:text-[12px] mt-1.5 line-clamp-2 leading-relaxed" style={{ color: T.muted }}>
                      {blog.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <IconBtn
                        onClick={() => toggleStatus(blog)}
                        title={blog.status ? "Unpublish" : "Publish"}
                        active={blog.status}
                        activeStyle={{ background: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0" }}
                        hoverStyle={{ background: "#d1fae5", color: "#059669", borderColor: "#6ee7b7" }}
                        inactiveStyle={{ background: "#f9fafb", color: "#9ca3af", borderColor: "#e5e7eb" }}
                        inactiveHover={{ background: "#f3f4f6", color: "#6b7280", borderColor: "#d1d5db" }}
                      >
                        {blog.status ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                      </IconBtn>
                      <IconBtn onClick={() => handleEdit(blog)}
                        inactiveStyle={{ background: T.tint10, color: T.muted, borderColor: T.border }}
                        inactiveHover={{ background: T.tint20, color: T.primary, borderColor: T.primary }}
                      >
                        <Edit size={12} />
                      </IconBtn>
                      <IconBtn onClick={() => setPreviewBlog(blog)}
                        inactiveStyle={{ background: "#eff6ff", color: "#3b82f6", borderColor: "#bfdbfe" }}
                        inactiveHover={{ background: "#dbeafe", color: "#2563eb", borderColor: "#93c5fd" }}
                      >
                        <Eye size={12} />
                      </IconBtn>
                      <IconBtn onClick={() => handleDelete(blog._id)}
                        inactiveStyle={{ background: "#f9fafb", color: "#9ca3af", borderColor: "#e5e7eb" }}
                        inactiveHover={{ background: "#fef2f2", color: "#ef4444", borderColor: "#fecaca" }}
                        className="ml-auto"
                      >
                        <Trash2 size={12} />
                      </IconBtn>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer: total count when many blogs */}
            {filtered.length > 5 && (
              <div className="px-4 py-2.5 shrink-0 text-center" style={{ borderTop: `1px solid ${T.border}`, background: T.tint10 }}>
                <span className="text-[11px] font-semibold" style={{ color: T.muted }}>
                  Showing all {filtered.length} posts · Scroll to see more
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Preview modal ─────────────────────────────────────────────────── */}
      {previewBlog && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
          onClick={() => setPreviewBlog(null)}
        >
          <div
            className="bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden
                        max-h-[92vh] sm:max-h-[85vh] flex flex-col"
            style={{ border: `1px solid ${T.border}`, boxShadow: `0 24px 60px rgba(195,106,77,0.18)` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar on mobile */}
            <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: T.tint40 }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shrink-0"
              style={{ borderBottom: `1px solid ${T.border}`, background: T.tint10 }}
            >
              <div className="min-w-0">
                <h3 className="text-[13px] sm:text-[14px] font-bold" style={{ color: T.primaryDark }}>Blog Preview</h3>
                <p className="text-[11px] sm:text-[12px] mt-0.5 truncate" style={{ color: T.mutedLight }}>
                  {previewBlog.title}
                </p>
              </div>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-150 shrink-0 ml-3"
                style={{ color: T.muted }}
                onMouseEnter={(e) => { e.currentTarget.style.background = T.tint20; e.currentTarget.style.color = T.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.muted; }}
                onClick={() => setPreviewBlog(null)}
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 sm:py-5 space-y-4">
              {previewBlog.blogMedia?.[0] && (
                <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                  <img src={previewBlog.blogMedia[0]} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[15px] sm:text-[17px] font-bold leading-snug" style={{ color: "#1a1a1a" }}>
                    {previewBlog.title}
                  </h2>
                  <p className="text-[12px] sm:text-[12.5px] mt-1" style={{ color: T.mutedLight }}>
                    By <span className="font-semibold" style={{ color: T.primaryDark }}>{previewBlog.author}</span>
                  </p>
                </div>
                <span
                  className="shrink-0 px-2 sm:px-2.5 py-1 text-[10.5px] sm:text-[11px] font-semibold rounded-lg border"
                  style={previewBlog.status
                    ? { background: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0" }
                    : { background: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }
                  }
                >
                  {previewBlog.status ? "Live" : "Draft"}
                </span>
              </div>

              <p className="text-[13px] sm:text-[13.5px] leading-relaxed whitespace-pre-wrap" style={{ color: "#4a3530" }}>
                {previewBlog.description}
              </p>

              {previewBlog.blogMedia?.length > 1 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: T.muted }}>
                    More Images ({previewBlog.blogMedia.length - 1})
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {previewBlog.blogMedia.slice(1).map((src, i) => (
                      <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden"
                        style={{ border: `1px solid ${T.border}` }}>
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────*/
function inputStyle() {
  return {
    width: "100%", padding: "9px 12px", fontSize: 13, color: "#1a1a1a",
    background: "white", border: `1.5px solid #e5e7eb`, borderRadius: 12,
    outline: "none", transition: "border 0.15s, box-shadow 0.15s",
  };
}
function applyFocus(e) {
  e.currentTarget.style.borderColor = T.primary;
  e.currentTarget.style.boxShadow   = `0 0 0 3px ${T.tint20}`;
}
function removeFocus(e) {
  e.currentTarget.style.borderColor = "#e5e7eb";
  e.currentTarget.style.boxShadow   = "none";
}

function BrandField({ label, error, children }) {
  return (
    <div>
      <label className={labelCls} style={{ color: T.muted }}>{label}</label>
      {children}
      {error && <p className="text-[11.5px] text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-semibold rounded-xl transition-all duration-150"
      style={{ color: T.muted, background: "white", border: `1px solid ${T.border}` }}
      onMouseEnter={(e) => { e.currentTarget.style.background = T.tint20; e.currentTarget.style.color = T.primaryDark; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = T.muted; }}
    >
      {children}
    </button>
  );
}

function PrimaryBtn({ onClick, disabled, icon, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-semibold text-white rounded-xl
                 transition-all duration-150 disabled:opacity-60"
      style={{
        background: disabled ? T.tint40 : hov ? T.primaryHov : T.primary,
        boxShadow: hov && !disabled ? `0 4px 14px rgba(195,106,77,0.38)` : `0 1px 4px rgba(195,106,77,0.18)`,
        color: disabled ? T.primaryDark : "white",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {icon}{children}
    </button>
  );
}

function ClearBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="ml-auto flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-[12px] font-semibold rounded-lg transition-all duration-150"
      style={{ color: T.muted, background: T.tint20, border: `1px solid ${T.border}` }}
      onMouseEnter={(e) => { e.currentTarget.style.background = T.tint40; e.currentTarget.style.color = T.primaryDark; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = T.tint20; e.currentTarget.style.color = T.muted; }}
    >
      <X size={11} /> Clear
    </button>
  );
}

function IconBtn({ onClick, title, children, className = "", active, activeStyle, hoverStyle, inactiveStyle, inactiveHover }) {
  const base = active ? activeStyle : inactiveStyle;
  const hov  = active ? hoverStyle  : inactiveHover;
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg border transition-all duration-150 ${className}`}
      style={base}
      onMouseEnter={(e) => { if (hov) Object.assign(e.currentTarget.style, hov); }}
      onMouseLeave={(e) => { Object.assign(e.currentTarget.style, base); }}
    >
      {children}
    </button>
  );
}