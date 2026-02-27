import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getService, postService, patchService } from "../../service/axios";
import { toast } from "react-hot-toast";
import { Search, Plus, Pencil, X, Tag } from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  primary:   "#c36a4d",
  primary90: "#b05c40",
  primary80: "#9d4f35",
  tint10:    "#fdf3f0",
  tint20:    "#f9e3db",
  tint30:    "#f3c9bb",
  tint50:    "#e8a38e",
  text:      "#1c1917",
  muted:     "#78716c",
  subtle:    "#a8a29e",
  border:    "#e7e5e4",
  surface:   "#ffffff",
  bg:        "#faf9f8",
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .cat-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

  /* ── Add button ── */
  .cat-add-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 20px;
    background: ${C.primary};
    color: #fff;
    font-size: 13px; font-weight: 700;
    border: none; border-radius: 14px;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 4px 14px rgba(195,106,77,.35);
    transition: background 160ms ease,
                transform 200ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 200ms ease;
    position: relative; overflow: hidden;
    flex-shrink: 0;
  }
  .cat-add-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.15) 0%, transparent 60%);
    pointer-events: none;
  }
  .cat-add-btn:hover {
    background: ${C.primary90};
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 24px rgba(195,106,77,.42);
  }
  .cat-add-btn:active { transform: translateY(0) scale(.98); }

  /* ── Search bar ── */
  .cat-search-wrap {
    display: flex; align-items: center; gap: 10px;
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 14px;
    padding: 10px 15px;
    width: 100%;
    max-width: 288px;
    box-shadow: 0 1px 3px rgba(0,0,0,.04);
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }
  .cat-search-wrap:focus-within {
    border-color: ${C.tint50};
    box-shadow: 0 0 0 3px ${C.tint10};
  }
  .cat-search-input {
    font-size: 13px; font-weight: 500;
    color: ${C.text};
    background: transparent;
    border: none; outline: none;
    width: 100%;
    min-width: 0;
  }
  .cat-search-input::placeholder { color: ${C.subtle}; }

  /* ── Search container — full width on mobile ── */
  .cat-search-container {
    position: relative;
    display: inline-block;
    width: auto;
  }

  /* ── Suggestion dropdown ── */
  .cat-suggestions {
    position: absolute;
    top: calc(100% + 6px); left: 0;
    width: 100%;
    min-width: 220px;
    background: #fff;
    border: 1.5px solid ${C.tint20};
    border-radius: 14px;
    box-shadow: 0 12px 36px rgba(195,106,77,.13);
    z-index: 50; overflow: hidden;
  }
  .cat-suggestion-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 15px;
    font-size: 13px; font-weight: 500;
    color: ${C.text};
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
  }
  .cat-suggestion-item:hover {
    background: ${C.tint10};
    color: ${C.primary};
  }

  /* ── Table row ── */
  .cat-tr {
    transition: background 150ms ease, box-shadow 150ms ease;
    position: relative;
  }
  .cat-tr::after {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, ${C.primary}, ${C.tint30});
    border-radius: 0 2px 2px 0;
    opacity: 0;
    transition: opacity 200ms ease;
  }
  .cat-tr:hover { background: ${C.tint10}; }
  .cat-tr:hover::after { opacity: 1; }

  /* ── Thumbnail ── */
  .cat-thumb {
    width: 42px; height: 42px;
    border-radius: 13px;
    overflow: hidden;
    border: 1.5px solid ${C.border};
    background: ${C.tint10};
    transition: transform 220ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 220ms ease;
    flex-shrink: 0;
  }
  .cat-tr:hover .cat-thumb {
    transform: scale(1.12) rotate(-1.5deg);
    box-shadow: 0 6px 18px rgba(195,106,77,.22);
  }

  /* ── Status badge ── */
  .cat-status-btn {
    display: inline-flex; align-items: center;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 11.5px; font-weight: 700;
    border-width: 1.5px; border-style: solid;
    cursor: pointer;
    white-space: nowrap;
    transition: background 150ms ease, transform 180ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 150ms ease;
  }
  .cat-status-btn:hover {
    transform: scale(1.07);
    box-shadow: 0 4px 10px rgba(0,0,0,.08);
  }
  .cat-status-available   { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
  .cat-status-unavailable { background: ${C.tint10}; color: ${C.primary}; border-color: ${C.tint30}; }

  /* ── Edit button ── */
  .cat-edit-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    font-size: 12px; font-weight: 700;
    color: ${C.primary};
    background: ${C.tint10};
    border: 1.5px solid ${C.tint20};
    border-radius: 9px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 150ms ease, border-color 150ms ease,
                transform 200ms cubic-bezier(.34,1.56,.64,1), box-shadow 180ms ease;
  }
  .cat-edit-btn:hover {
    background: ${C.tint20};
    border-color: ${C.tint50};
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 6px 14px rgba(195,106,77,.18);
  }

  /* ── Hide table columns on mobile ── */
  .cat-col-date { }

  /* ── Pagination ── */
  .cat-page-btn {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12.5px; font-weight: 700;
    border-radius: 9px;
    border: 1.5px solid ${C.border};
    background: #fff;
    color: ${C.muted};
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease,
                transform 180ms cubic-bezier(.34,1.56,.64,1), box-shadow 150ms ease;
  }
  .cat-page-btn:hover:not(.cat-page-active) {
    background: ${C.tint10};
    color: ${C.primary};
    border-color: ${C.tint30};
    transform: translateY(-2px) scale(1.08);
    box-shadow: 0 4px 10px rgba(195,106,77,.14);
  }
  .cat-page-active {
    background: ${C.primary} !important;
    color: #fff !important;
    border-color: ${C.primary} !important;
    box-shadow: 0 4px 12px rgba(195,106,77,.35);
  }

  /* ── Modal ── */
  @keyframes cat-fade-up {
    from { opacity: 0; transform: translateY(16px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes cat-overlay-in {
    from { opacity: 0; } to { opacity: 1; }
  }
  .cat-overlay       { animation: cat-overlay-in 200ms ease both; }
  .cat-modal-panel   { animation: cat-fade-up 240ms cubic-bezier(.22,1,.36,1) both; }
  .cat-modal-close {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 9px;
    border: none; background: transparent;
    color: ${C.subtle};
    cursor: pointer;
    flex-shrink: 0;
    transition: background 150ms ease, color 150ms ease, transform 200ms ease;
  }
  .cat-modal-close:hover {
    background: ${C.tint10};
    color: ${C.primary};
    transform: rotate(90deg) scale(1.1);
  }

  .cat-field {
    width: 100%;
    padding: 10px 16px;
    font-size: 13px; font-weight: 500;
    color: ${C.text};
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 13px;
    outline: none;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }
  .cat-field::placeholder { color: ${C.subtle}; }
  .cat-field:focus {
    border-color: ${C.tint50};
    box-shadow: 0 0 0 3px ${C.tint10};
  }
  .cat-field:disabled {
    background: ${C.tint10};
    color: ${C.subtle};
    cursor: not-allowed;
  }

  .cat-upload-label {
    display: flex; align-items: center; gap: 12px;
    width: 100%;
    padding: 10px 16px;
    border: 2px dashed ${C.tint30};
    border-radius: 13px;
    cursor: pointer;
    transition: border-color 160ms ease, background 160ms ease, transform 200ms ease;
  }
  .cat-upload-label:hover {
    border-color: ${C.primary};
    background: ${C.tint10};
    transform: scale(1.01);
  }

  .cat-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    background: ${C.tint10};
    border: 1.5px solid ${C.tint20};
    border-radius: 13px;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, transform 180ms ease;
  }
  .cat-toggle-row:hover {
    background: ${C.tint20};
    border-color: ${C.tint30};
    transform: scale(1.01);
  }

  .cat-toggle {
    position: relative;
    display: inline-flex;
    height: 22px; width: 42px;
    align-items: center;
    border-radius: 99px;
    transition: background 250ms ease, box-shadow 200ms ease;
    flex-shrink: 0;
  }
  .cat-toggle:hover { box-shadow: 0 0 0 3px ${C.tint20}; }
  .cat-toggle-thumb {
    display: inline-block;
    height: 18px; width: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.18);
    transition: transform 220ms cubic-bezier(.34,1.56,.64,1);
  }

  .cat-save-btn {
    padding: 10px 22px;
    font-size: 13px; font-weight: 700;
    color: #fff;
    background: ${C.primary};
    border: none; border-radius: 13px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(195,106,77,.35);
    transition: background 160ms ease,
                transform 180ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 180ms ease;
  }
  .cat-save-btn:hover {
    background: ${C.primary90};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(195,106,77,.42);
  }
  .cat-save-btn:active { transform: translateY(0); }

  .cat-cancel-btn {
    padding: 10px 18px;
    font-size: 13px; font-weight: 700;
    color: ${C.muted};
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 13px;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease,
                border-color 150ms ease, transform 180ms ease;
  }
  .cat-cancel-btn:hover {
    background: ${C.tint10};
    color: ${C.primary};
    border-color: ${C.tint30};
    transform: translateY(-1px);
  }

  /* ─── RESPONSIVE ─────────────────────────────────────────────────── */

  /* Mobile ≤ 640px */
  @media (max-width: 640px) {
    /* Heading row: stack vertically */
    .cat-heading-row {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }
    .cat-add-btn {
      width: 100%;
      justify-content: center;
    }

    /* Search full width */
    .cat-search-container { width: 100%; }
    .cat-search-wrap { max-width: 100%; }

    /* Hide date column */
    .cat-col-date { display: none; }

    /* Tighten table cells */
    .cat-tr td, thead tr th {
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    /* Smaller thumbnail */
    .cat-thumb { width: 34px; height: 34px; border-radius: 10px; }

    /* Status badge compact */
    .cat-status-btn { padding: 3px 8px; font-size: 10.5px; }

    /* Modal: full screen bottom sheet on mobile */
    .cat-modal-overlay-inner {
      align-items: flex-end !important;
      padding: 0 !important;
    }
    .cat-modal-panel {
      border-radius: 20px 20px 0 0 !important;
      max-height: 92vh;
      overflow-y: auto;
      animation: cat-sheet-up 260ms cubic-bezier(.22,1,.36,1) both !important;
    }

    @keyframes cat-sheet-up {
      from { opacity: 0; transform: translateY(100%); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Modal body padding tighter */
    .cat-modal-body { padding: 16px !important; }
    .cat-modal-header, .cat-modal-footer { padding-left: 16px !important; padding-right: 16px !important; }
  }

  /* Tiny ≤ 400px */
  @media (max-width: 400px) {
    .cat-edit-btn span { display: none; }
    .cat-edit-btn { padding: 6px 10px; }
  }
`;

export default function Categories() {
  const [categories, setCategories]           = useState([]);
  const [search, setSearch]                   = useState("");
  const [suggestions, setSuggestions]         = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [modal, setModal]   = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName]               = useState("");
  const [slug, setSlug]               = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled]         = useState(true);
  const [image, setImage]             = useState(null);

  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  /* ── API calls — untouched ─────────────────────────────────────────── */
  const fetchAllCategories = async () => {
    try {
      const response = await getService(`/admin/category/categoryItems?page=${page}&limit=${limit}`);
      if (response?.ok) {
        setCategories(response?.data?.data?.data || []);
        setTotalPages(response?.data?.data?.totalPages || 1);
      }
    } catch { toast.error("Failed to fetch categories"); }
  };

  const fetchSearchCategories = async () => {
    try {
      const response = await getService(`/admin/search/category?page=${page}&limit=${limit}&keyword=${search}`);
      if (response?.ok) {
        setCategories(response?.data?.data?.categories || []);
        setTotalPages(response?.data?.data?.pagination.totalPages || 1);
      }
    } catch { toast.error("Search failed"); }
  };

  useEffect(() => {
    search.trim() ? fetchSearchCategories() : fetchAllCategories();
  }, [page, search]);

  const fetchSuggestions = async (value) => {
    try {
      if (!value.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
      const response = await getService(`/admin/search/suggestion/category?keyword=${value}`);
      if (response?.ok) { setSuggestions(response?.data?.data || []); setShowSuggestions(true); }
    } catch { console.log("Suggestion error"); }
  };

  useEffect(() => {
    setSlug((name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""));
  }, [name]);

  const handleAddCategory = async () => {
    if (!name?.trim())        return toast.error("Category name required");
    if (!description?.trim()) return toast.error("Description required");
    if (!image)               return toast.error("Category image required");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("skuId", slug);
      formData.append("decription", description);
      formData.append("status", enabled ? "Available" : "Un-Available");
      formData.append("categoryImage", image);
      const response = await postService("/admin/category/addCategory", formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (response?.ok) { toast.success("Category Added Successfully"); fetchAllCategories(); closeModal(); }
    } catch { toast.error("Add Category Failed"); }
  };

  const handleUpdateCategory = async () => {
    if (!name?.trim())        return toast.error("Category name required");
    if (!description?.trim()) return toast.error("Description required");
    try {
      const response = await patchService(`/admin/category/updateStatus`, {
        categoryId: editId, name, skuId: slug,
        decription: description, status: enabled ? "Available" : "Un-Available",
      }, { headers: { "Content-Type": "multipart/form-data" } });
      if (response?.ok) {
        toast.success("Category Updated Successfully");
        search.trim() ? fetchSearchCategories() : fetchAllCategories();
        closeModal();
      }
    } catch { toast.error("Update Failed"); }
  };

  const handleSave = () => { editId ? handleUpdateCategory() : handleAddCategory(); };

  const handleEdit = (category) => {
    setEditId(category._id); setName(category.name || ""); setSlug(category.skuId || "");
    setDescription(category.decription || ""); setEnabled(category.status === "Available");
    setImage(null); setModal(true);
  };

  const toggleStatus = async (category) => {
    try {
      const formData = new FormData();
      formData.append("name", category.name); formData.append("skuId", category.skuId);
      formData.append("decription", category.decription);
      formData.append("status", category.status === "Available" ? "Un-Available" : "Available");
      await postService(`/admin/category/updateCategory/${category._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      search.trim() ? fetchSearchCategories() : fetchAllCategories();
    } catch { toast.error("Status update failed"); }
  };

  const closeModal = () => {
    setModal(false); setEditId(null); setName(""); setSlug("");
    setDescription(""); setEnabled(true); setImage(null);
  };
  /* ─────────────────────────────────────────────────────────────────── */

  return (
    <AdminLayout>
      <style>{GLOBAL_CSS}</style>

      <div className="cat-root" style={{ background: C.bg, minHeight: "100%", padding: "0 0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* ── Heading + Add ─────────────────────────────────────────── */}
          <div
            className="cat-heading-row"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
          >
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.5px", margin: 0 }}>
                Categories
              </h1>
              <p style={{ fontSize: 13, color: C.subtle, marginTop: 3, fontWeight: 500 }}>
                Manage your product categories
              </p>
            </div>
            <button className="cat-add-btn" onClick={() => setModal(true)}>
              <Plus size={15} strokeWidth={2.6} />
              Add Category
            </button>
          </div>

          {/* ── Search ────────────────────────────────────────────────── */}
          <div className="cat-search-container">
            <div className="cat-search-wrap">
              <Search size={15} style={{ color: C.subtle, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search categories…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                  fetchSuggestions(e.target.value);
                }}
                className="cat-search-input"
              />
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="cat-suggestions">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    className="cat-suggestion-item"
                    onClick={() => { setSearch(item.name); setShowSuggestions(false); }}
                  >
                    <Tag size={13} style={{ color: C.subtle }} />
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Table card ────────────────────────────────────────────── */}
          <div style={{
            background: C.surface,
            borderRadius: 20,
            border: `1.5px solid ${C.border}`,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,.04)",
          }}>
            {/* Scrollable wrapper for table */}
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", minWidth: 480, borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.tint10, borderBottom: `1.5px solid ${C.tint20}` }}>
                    {["Image", "Name", "Status", "Created", "Action"].map((h, idx) => (
                      <th
                        key={h}
                        className={idx === 3 ? "cat-col-date" : ""}
                        style={{
                          padding: "10px 22px",
                          textAlign: "left",
                          fontSize: 10.5, fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: C.subtle,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? categories.map((c, i) => (
                    <tr
                      key={c._id}
                      className="cat-tr"
                      style={{ borderTop: i === 0 ? "none" : `1px solid ${C.tint10}` }}
                    >
                      {/* Image */}
                      <td style={{ padding: "13px 22px" }}>
                        <div className="cat-thumb">
                          <img
                            src={c.categoryImage}
                            alt={c.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td style={{ padding: "13px 22px" }}>
                        <span style={{ fontWeight: 700, color: C.text }}>{c.name}</span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "13px 22px" }}>
                        <button
                          onClick={() => toggleStatus(c)}
                          className={`cat-status-btn ${c.status === "Available" ? "cat-status-available" : "cat-status-unavailable"}`}
                        >
                          {c.status}
                        </button>
                      </td>

                      {/* Date — hidden on mobile */}
                      <td className="cat-col-date" style={{ padding: "13px 22px", color: C.subtle, fontWeight: 500, fontSize: 12.5 }}>
                        {new Date(c.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>

                      {/* Edit */}
                      <td style={{ padding: "13px 22px" }}>
                        <button className="cat-edit-btn" onClick={() => handleEdit(c)}>
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          textAlign: "center", padding: "52px 0",
                          fontSize: 13, color: C.subtle, fontWeight: 500,
                        }}
                      >
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                flexWrap: "wrap",
                gap: 6, padding: "12px 22px",
                borderTop: `1.5px solid ${C.tint20}`,
                background: C.tint10,
              }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`cat-page-btn ${page === num ? "cat-page-active" : ""}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      {modal && (
        <div
          className="cat-overlay"
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(28,25,23,0.45)",
            backdropFilter: "blur(3px)",
          }}
        >
          {/* Inner aligner — switches to bottom-sheet on mobile via CSS */}
          <div
            className="cat-modal-overlay-inner"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100%",
              padding: 16,
            }}
          >
            <div
              className="cat-modal-panel"
              style={{
                background: C.surface,
                width: "100%", maxWidth: 460,
                borderRadius: 24,
                boxShadow: "0 24px 64px rgba(195,106,77,.22), 0 4px 12px rgba(0,0,0,.08)",
                overflow: "hidden",
                border: `1.5px solid ${C.tint20}`,
              }}
            >
              {/* Header */}
              <div
                className="cat-modal-header"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 24px",
                  borderBottom: `1.5px solid ${C.tint20}`,
                  background: C.tint10,
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: 0 }}>
                    {editId ? "Edit Category" : "Add New Category"}
                  </h2>
                  <p style={{ fontSize: 12, color: C.subtle, marginTop: 3, fontWeight: 500 }}>
                    {editId ? "Update category details" : "Fill in the details below"}
                  </p>
                </div>
                <button className="cat-modal-close" onClick={closeModal}>
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div
                className="cat-modal-body"
                style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}
              >
                {/* Name */}
                <div>
                  <FieldLabel>Category Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. Electronics"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="cat-field"
                  />
                </div>

                {/* Slug */}
                <div>
                  <FieldLabel>Slug (Auto-generated)</FieldLabel>
                  <input type="text" value={slug} disabled className="cat-field" />
                </div>

                {/* Description */}
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    placeholder="Brief category description…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="cat-field"
                    style={{ resize: "none" }}
                  />
                </div>

                {/* Image */}
                <div>
                  <FieldLabel>Category Image</FieldLabel>
                  <label className="cat-upload-label">
                    <Plus size={14} style={{ color: C.subtle, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.subtle, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {image ? image.name : "Click to upload image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                {/* Toggle */}
                <div className="cat-toggle-row" onClick={() => setEnabled(!enabled)}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                    Mark as Available
                  </span>
                  <div className="cat-toggle" style={{ background: enabled ? C.primary : "#d4ccc8" }}>
                    <span
                      className="cat-toggle-thumb"
                      style={{ transform: enabled ? "translateX(21px)" : "translateX(3px)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="cat-modal-footer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "flex-end",
                  gap: 10, padding: "14px 24px",
                  borderTop: `1.5px solid ${C.tint20}`,
                  background: C.tint10,
                  flexWrap: "wrap",
                }}
              >
                <button className="cat-cancel-btn" onClick={closeModal}>Cancel</button>
                <button className="cat-save-btn" onClick={handleSave}>
                  {editId ? "Update" : "Save Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

/* ── Field label helper ─────────────────────────────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <label style={{
      display: "block",
      fontSize: 11.5, fontWeight: 800,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      color: C.muted,
      marginBottom: 6,
    }}>
      {children}
    </label>
  );
}