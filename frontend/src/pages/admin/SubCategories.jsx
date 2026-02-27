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
  Search,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

const PAGE_SIZE = 5;

// ─── Inline style helpers (kept outside component to avoid recreation) ────────
const styles = {
  root: {
    fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
    background: C.bg,
    minHeight: "100%",
  },
  // Keyframes injected once via a <style> tag
};

// ─── Global CSS injected once ─────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  .sc-stat-card {
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 20px;
    padding: 18px 22px;
    display: flex;
    align-items: center;
    gap: 18px;
    box-shadow: 0 1px 3px rgba(0,0,0,.04);
    transition: transform 180ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 180ms ease,
                border-color 180ms ease;
    cursor: default;
  }
  .sc-stat-card:hover {
    transform: translateY(-4px) scale(1.015);
    box-shadow: 0 12px 32px rgba(195,106,77,.14);
    border-color: ${C.tint30};
  }

  .sc-row {
    display: grid;
    grid-template-columns: 52px 1fr auto auto auto;
    gap: 18px;
    align-items: center;
    padding: 14px 26px;
    background: ${C.surface};
    transition: background 150ms ease, box-shadow 150ms ease;
    position: relative;
  }
  .sc-row::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, ${C.primary}, ${C.tint30});
    border-radius: 0 2px 2px 0;
    opacity: 0;
    transition: opacity 200ms ease;
  }
  .sc-row:hover {
    background: ${C.tint10};
    box-shadow: inset 0 0 0 1px ${C.tint20};
  }
  .sc-row:hover::before { opacity: 1; }

  .sc-thumb {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    overflow: hidden;
    border: 1.5px solid ${C.border};
    background: ${C.tint10};
    transition: transform 220ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 220ms ease;
    flex-shrink: 0;
  }
  .sc-row:hover .sc-thumb {
    transform: scale(1.12) rotate(-1deg);
    box-shadow: 0 6px 18px rgba(195,106,77,.22);
  }

  .sc-delete-btn {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 10px;
    border: 1.5px solid transparent;
    color: ${C.subtle};
    background: transparent;
    cursor: pointer;
    transition: color 180ms ease, background 180ms ease, border-color 180ms ease,
                transform 200ms cubic-bezier(.34,1.56,.64,1);
  }
  .sc-delete-btn:hover {
    color: #dc2626;
    background: #fef2f2;
    border-color: #fecaca;
    transform: scale(1.15) rotate(-4deg);
  }

  .sc-add-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 20px;
    background: ${C.primary};
    color: #fff;
    font-size: 13px; font-weight: 700;
    border: none; border-radius: 14px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(195,106,77,.35);
    transition: background 160ms ease,
                transform 200ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 200ms ease;
    position: relative;
    overflow: hidden;
  }
  .sc-add-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.15) 0%, transparent 60%);
    pointer-events: none;
  }
  .sc-add-btn:hover {
    background: ${C.primary90};
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 24px rgba(195,106,77,.42);
  }
  .sc-add-btn:active {
    transform: translateY(0) scale(.98);
  }

  .sc-toggle {
    position: relative;
    display: inline-flex;
    height: 24px; width: 44px;
    align-items: center;
    border-radius: 99px;
    border: none; cursor: pointer;
    transition: background 250ms ease, box-shadow 200ms ease;
  }
  .sc-toggle:hover {
    box-shadow: 0 0 0 3px ${C.tint20};
  }
  .sc-toggle-thumb {
    display: inline-block;
    height: 18px; width: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.18);
    transition: transform 220ms cubic-bezier(.34,1.56,.64,1);
  }

  .sc-filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 20px;
    padding: 14px 22px;
    box-shadow: 0 1px 3px rgba(0,0,0,.03);
  }

  .sc-select-wrap {
    position: relative;
  }
  .sc-select {
    appearance: none;
    background: ${C.tint10};
    border: 1.5px solid ${C.tint20};
    color: ${C.text};
    font-size: 13px; font-weight: 500;
    padding: 9px 34px 9px 14px;
    border-radius: 12px;
    min-width: 180px;
    cursor: pointer;
    transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
    outline: none;
  }
  .sc-select:hover, .sc-select:focus {
    border-color: ${C.tint50};
    background: #fff;
    box-shadow: 0 0 0 3px ${C.tint10};
  }

  .sc-search-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${C.tint10};
    border: 1.5px solid ${C.tint20};
    border-radius: 12px;
    padding: 9px 14px;
    transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
  }
  .sc-search-wrap:focus-within {
    border-color: ${C.tint50};
    background: #fff;
    box-shadow: 0 0 0 3px ${C.tint10};
  }
  .sc-search-input {
    font-size: 13px; font-weight: 500;
    color: ${C.text};
    background: transparent;
    border: none; outline: none;
    width: 190px;
  }
  .sc-search-input::placeholder { color: ${C.subtle}; }

  .sc-suggestions {
    position: absolute;
    top: calc(100% + 6px);
    left: 0; right: 0;
    background: #fff;
    border: 1.5px solid ${C.tint20};
    border-radius: 14px;
    box-shadow: 0 12px 36px rgba(195,106,77,.13);
    z-index: 50;
    overflow: hidden;
  }
  .sc-suggestion-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    font-size: 13px; font-weight: 500;
    color: ${C.text};
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
  }
  .sc-suggestion-item:hover {
    background: ${C.tint10};
    color: ${C.primary};
  }

  .sc-clear-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    font-size: 12.5px; font-weight: 700;
    color: ${C.muted};
    background: ${C.tint10};
    border: 1.5px solid ${C.tint20};
    border-radius: 10px;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, transform 180ms ease;
  }
  .sc-clear-btn:hover {
    background: ${C.tint20};
    color: ${C.primary};
    transform: scale(1.04);
  }

  .sc-sku-badge {
    font-size: 12px;
    font-family: 'DM Mono', 'Courier New', monospace;
    color: ${C.muted};
    background: ${C.tint10};
    border: 1.5px solid ${C.tint20};
    padding: 4px 10px;
    border-radius: 8px;
    transition: background 150ms ease, border-color 150ms ease;
  }
  .sc-row:hover .sc-sku-badge {
    background: ${C.tint20};
    border-color: ${C.tint30};
  }

  /* Pagination buttons */
  .sc-page-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px;
    font-size: 12.5px; font-weight: 700;
    color: ${C.muted};
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 10px;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease,
                transform 180ms cubic-bezier(.34,1.56,.64,1), box-shadow 150ms ease;
  }
  .sc-page-btn:not(:disabled):hover {
    background: ${C.tint10};
    color: ${C.primary};
    border-color: ${C.tint30};
    transform: translateY(-1px) scale(1.04);
    box-shadow: 0 4px 12px rgba(195,106,77,.12);
  }
  .sc-page-btn:disabled { opacity: .38; cursor: not-allowed; }

  /* Modal save button */
  .sc-save-btn {
    padding: 10px 22px;
    font-size: 13px; font-weight: 700;
    color: #fff;
    background: ${C.primary};
    border: none; border-radius: 13px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(195,106,77,.35);
    transition: background 160ms ease, transform 180ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 180ms ease;
  }
  .sc-save-btn:hover {
    background: ${C.primary90};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(195,106,77,.42);
  }
  .sc-save-btn:active { transform: translateY(0); }

  /* Modal cancel button */
  .sc-cancel-btn {
    padding: 10px 18px;
    font-size: 13px; font-weight: 700;
    color: ${C.muted};
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 13px;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease,
                transform 180ms ease;
  }
  .sc-cancel-btn:hover {
    background: ${C.tint10};
    color: ${C.primary};
    border-color: ${C.tint30};
    transform: translateY(-1px);
  }

  /* Modal close icon */
  .sc-modal-close {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 9px;
    border: none; background: transparent;
    color: ${C.subtle};
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, transform 200ms ease;
  }
  .sc-modal-close:hover {
    background: ${C.tint10};
    color: ${C.primary};
    transform: rotate(90deg) scale(1.1);
  }

  /* Input / select / textarea focus ring */
  .sc-field {
    width: 100%;
    padding: 10px 16px;
    font-size: 13px;
    color: ${C.text};
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 13px;
    outline: none;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }
  .sc-field::placeholder { color: ${C.subtle}; }
  .sc-field:focus {
    border-color: ${C.tint50};
    box-shadow: 0 0 0 3px ${C.tint10};
  }

  .sc-upload-label {
    display: flex; align-items: center; gap: 12px;
    width: 100%;
    padding: 10px 16px;
    border: 2px dashed ${C.tint30};
    border-radius: 13px;
    cursor: pointer;
    transition: border-color 160ms ease, background 160ms ease, transform 200ms ease;
  }
  .sc-upload-label:hover {
    border-color: ${C.primary};
    background: ${C.tint10};
    transform: scale(1.01);
  }

  /* Dividers */
  .sc-divider { border: none; border-top: 1.5px solid ${C.border}; margin: 0; }

  @keyframes sc-fade-up {
    from { opacity: 0; transform: translateY(16px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .sc-modal-panel {
    animation: sc-fade-up 240ms cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes sc-overlay-in {
    from { opacity: 0; } to { opacity: 1; }
  }
  .sc-overlay { animation: sc-overlay-in 200ms ease both; }
`;

export default function SubCategories() {
  const [categories, setCategories]       = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [search, setSearch]               = useState("");
  const [suggestions, setSuggestions]     = useState([]);
  const [parentFilter, setParentFilter]   = useState("");
  const [page, setPage]                   = useState(1);

  const [totalItems, setTotalItems]   = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [active, setActive]           = useState(0);
  const [inactive, setInactive]       = useState(0);

  const [modal, setModal] = useState(false);

  const [name, setName]               = useState("");
  const [parentId, setParentId]       = useState("");
  const [skuId, setSkuId]             = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage]             = useState(null);

  /* ── API calls — completely untouched ─────────────────────────────── */
  const fetchCategories = async () => {
    try {
      const res = await getService("/admin/category/categoryItems");
      setCategories(res.data?.data?.data || []);
    } catch (err) { console.log(err); }
  };

  const fetchSubCategories = async (pageNumber = 1) => {
    try {
      const res = await getService(`/admin/subcategory/getAll?page=${pageNumber}&limit=${PAGE_SIZE}`);
      const result = res.data?.data || {};
      setSubCategories(Array.isArray(result.data) ? result.data : []);
      setTotalItems(result.totalItems || 0);
      setTotalPages(result.totalPages || 1);
      setActive(result.available || 0);
      setInactive(result.unavailable || 0);
      setPage(result.currentPage || 1);
    } catch (err) { console.log(err); setSubCategories([]); }
  };

  const handleSearch = async (keyword, pageNumber = 1) => {
    try {
      setSearch(keyword); setParentFilter(""); setPage(pageNumber);
      if (!keyword) return fetchSubCategories(pageNumber);
      const res = await getService(`/admin/search/subcategory?keyword=${keyword}&page=${pageNumber}&limit=${PAGE_SIZE}`);
      const result = res.data?.data || {};
      setSubCategories(Array.isArray(result.subcategories) ? result.subcategories : []);
      setTotalItems(result.pagination?.totalItems || 0);
      setTotalPages(result.pagination?.totalPages || 1);
      setPage(result.pagination?.currentPage || 1);
    } catch (err) { console.log(err); }
  };

  const fetchSuggestions = async (keyword) => {
    try {
      if (!keyword) { setSuggestions([]); return; }
      const res = await getService(`/admin/search/suggestion/subcategory?keyword=${keyword}`);
      setSuggestions(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) { console.log(err); }
  };

  const handleCategoryFilter = async (id, pageNumber = 1) => {
    try {
      setParentFilter(id); setSearch(""); setSuggestions([]); setPage(pageNumber);
      if (!id) return fetchSubCategories(pageNumber);
      const res = await getService(`/admin/subcategory/getbyCategoryId/${id}?page=${pageNumber}&limit=${PAGE_SIZE}`);
      const result = res.data?.data || {};
      setSubCategories(Array.isArray(result.data) ? result.data : []);
      setTotalItems(result.totalItems || 0);
      setTotalPages(result.totalPages || 1);
      setPage(result.currentPage || 1);
    } catch (err) { console.log(err); }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Available" ? "Un-Available" : "Available";
    try {
      await patchService("/admin/subcategory/updateStatus", { subCategoryId: id, status: newStatus });
      setSubCategories((prev) => prev.map((item) => item._id === id ? { ...item, status: newStatus } : item));
    } catch (err) { console.log(err); }
  };

  const deleteSub = async (id) => {
    if (!window.confirm("Delete this sub-category?")) return;
    try {
      await deleteService(`/admin/subcategory/delete?subCategoryId=${id}`);
      fetchSubCategories(page);
    } catch (err) { console.log(err); }
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name); formData.append("categoryId", parentId);
      formData.append("skuId", skuId); formData.append("decription", description);
      if (image) formData.append("subcategoryImage", image);
      await postService("/admin/subcategory/addSubcategory", formData);
      setModal(false); setName(""); setParentId(""); setSkuId(""); setDescription(""); setImage(null);
      fetchSubCategories(1);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    if (search) handleSearch(search, page);
    else if (parentFilter) handleCategoryFilter(parentFilter, page);
    else fetchSubCategories(page);
  }, [page]);

  useEffect(() => { fetchCategories(); }, []);
  /* ─────────────────────────────────────────────────────────────────── */

  return (
    <AdminLayout>
      {/* Inject global CSS once */}
      <style>{GLOBAL_CSS}</style>

      <div style={{ ...styles.root, padding: "0 0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* ── Stats row ────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            <StatCard
              icon={<BarChart3 size={18} />}
              label="Total"
              value={totalItems}
              accent={C.primary}
              bg={C.tint10}
              ring={C.tint30}
            />
            <StatCard
              icon={<CheckCircle2 size={18} />}
              label="Available"
              value={active}
              accent="#059669"
              bg="#ecfdf5"
              ring="#a7f3d0"
            />
            <StatCard
              icon={<AlertTriangle size={18} />}
              label="Un-Available"
              value={inactive}
              accent="#92400e"
              bg="#fffbeb"
              ring="#fde68a"
            />
          </div>

          {/* ── Heading + Add ─────────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{
                fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.5px", margin: 0,
                fontFamily: "'DM Sans', sans-serif"
              }}>
                Sub‑Categories
              </h1>
              <p style={{ fontSize: 13, color: C.subtle, marginTop: 3, fontWeight: 500 }}>
                Manage sub-categories under each parent
              </p>
            </div>
            <button className="sc-add-btn" onClick={() => setModal(true)}>
              <Plus size={15} strokeWidth={2.6} />
              Add Sub‑Category
            </button>
          </div>

          {/* ── Filters bar ───────────────────────────────────────────── */}
          <div className="sc-filter-bar">
            {/* Parent select */}
            <div className="sc-select-wrap">
              <select
                value={parentFilter}
                onChange={(e) => handleCategoryFilter(e.target.value, 1)}
                className="sc-select"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <ChevronRight size={13} style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%) rotate(90deg)",
                color: C.subtle, pointerEvents: "none"
              }} />
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <div className="sc-search-wrap">
                <Search size={14} style={{ color: C.subtle, flexShrink: 0 }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSearch(v);
                    fetchSuggestions(v);
                    handleSearch(v, 1);
                  }}
                  placeholder="Search sub-category…"
                  className="sc-search-input"
                />
              </div>
              {suggestions.length > 0 && (
                <div className="sc-suggestions">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      className="sc-suggestion-item"
                      onClick={() => {
                        setSearch(item.name);
                        setSuggestions([]);
                        handleSearch(item.name, 1);
                      }}
                    >
                      <Tag size={12} style={{ color: C.subtle }} />
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clear */}
            {(search || parentFilter) && (
              <button
                className="sc-clear-btn"
                onClick={() => {
                  setSearch(""); setParentFilter(""); setSuggestions([]);
                  fetchSubCategories(1);
                }}
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>

          {/* ── List card ─────────────────────────────────────────────── */}
          <div style={{
            background: C.surface,
            borderRadius: 20,
            border: `1.5px solid ${C.border}`,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,.04)",
          }}>
            {/* Column headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "52px 1fr auto auto auto",
              gap: 18,
              padding: "10px 26px",
              background: C.tint10,
              borderBottom: `1.5px solid ${C.tint20}`,
            }}>
              {["Image", "Name", "SKU", "Status", "Action"].map((h) => (
                <span key={h} style={{
                  fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: C.subtle,
                }}>
                  {h}
                </span>
              ))}
            </div>

            {subCategories.length === 0 ? (
              <div style={{
                padding: "56px 0", textAlign: "center",
                fontSize: 13, color: C.subtle, fontWeight: 500,
              }}>
                No sub‑categories found
              </div>
            ) : (
              <div style={{ borderTop: "none" }}>
                {subCategories.map((s, i) => (
                  <div
                    key={s._id}
                    className="sc-row"
                    style={{ borderTop: i === 0 ? "none" : `1px solid ${C.tint10}` }}
                  >
                    {/* Thumb */}
                    <div className="sc-thumb">
                      {s.subcategoryImage ? (
                        <img
                          src={s.subcategoryImage}
                          alt={s.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, color: C.subtle,
                        }}>N/A</div>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: C.text, margin: 0 }}>{s.name}</p>
                      <p style={{ fontSize: 12, color: C.subtle, margin: "3px 0 0", fontWeight: 400 }}>
                        {s.decription?.slice(0, 50)}{s.decription?.length > 50 ? "…" : ""}
                      </p>
                    </div>

                    {/* SKU */}
                    <span className="sc-sku-badge">{s.skuId || "—"}</span>

                    {/* Toggle */}
                    <button
                      className="sc-toggle"
                      onClick={() => toggleStatus(s._id, s.status)}
                      style={{
                        background: s.status === "Available" ? C.primary : "#d4ccc8",
                      }}
                    >
                      <span
                        className="sc-toggle-thumb"
                        style={{
                          transform: s.status === "Available" ? "translateX(22px)" : "translateX(3px)",
                        }}
                      />
                    </button>

                    {/* Delete */}
                    <button className="sc-delete-btn" onClick={() => deleteSub(s._id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 26px",
              borderTop: `1.5px solid ${C.tint20}`,
              background: C.tint10,
            }}>
              <span style={{ fontSize: 12.5, color: C.subtle, fontWeight: 500 }}>
                Page{" "}
                <strong style={{ color: C.text, fontWeight: 700 }}>{page}</strong>
                {" "}of{" "}
                <strong style={{ color: C.text, fontWeight: 700 }}>{totalPages}</strong>
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="sc-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <button
                  className="sc-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Add Modal ─────────────────────────────────────────────────────── */}
      {modal && (
        <div
          className="sc-overlay"
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
            background: "rgba(28,25,23,0.45)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            className="sc-modal-panel"
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
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px",
              borderBottom: `1.5px solid ${C.tint20}`,
              background: C.tint10,
            }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: 0 }}>
                  Add New Sub‑Category
                </h2>
                <p style={{ fontSize: 12, color: C.subtle, marginTop: 3, fontWeight: 500 }}>
                  Fill in the details below
                </p>
              </div>
              <button className="sc-modal-close" onClick={() => setModal(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Parent */}
              <div>
                <FieldLabel>Parent Category</FieldLabel>
                <div style={{ position: "relative" }}>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="sc-field sc-select"
                    style={{ width: "100%", minWidth: "unset" }}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronRight size={13} style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%) rotate(90deg)",
                    color: C.subtle, pointerEvents: "none",
                  }} />
                </div>
              </div>

              {/* Name */}
              <div>
                <FieldLabel>Sub‑Category Name</FieldLabel>
                <input
                  type="text"
                  placeholder="e.g. Smartphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="sc-field"
                />
              </div>

              {/* SKU */}
              <div>
                <FieldLabel>SKU ID</FieldLabel>
                <input
                  type="text"
                  placeholder="e.g. ELEC-PHONE-01"
                  value={skuId}
                  onChange={(e) => setSkuId(e.target.value)}
                  className="sc-field"
                />
              </div>

              {/* Description */}
              <div>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  placeholder="Brief description…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="sc-field"
                  style={{ resize: "none" }}
                />
              </div>

              {/* Image */}
              <div>
                <FieldLabel>Image</FieldLabel>
                <label className="sc-upload-label">
                  <Plus size={14} style={{ color: C.subtle, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.subtle, fontWeight: 500 }}>
                    {image ? image.name : "Click to upload image"}
                  </span>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
              padding: "14px 24px",
              borderTop: `1.5px solid ${C.tint20}`,
              background: C.tint10,
            }}>
              <button className="sc-cancel-btn" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button className="sc-save-btn" onClick={handleAdd}>
                Save Sub‑Category
              </button>
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

/* ── Stat card ──────────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, accent, bg, ring }) {
  return (
    <div className="sc-stat-card">
      <div style={{
        height: 46, width: 46, borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        background: bg,
        border: `1.5px solid ${ring}`,
        color: accent,
      }}>
        {icon}
      </div>
      <div>
        <p style={{
          fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
          textTransform: "uppercase", color: C.subtle, margin: 0,
        }}>
          {label}
        </p>
        <p style={{
          fontSize: 26, fontWeight: 800,
          color: C.text, margin: "2px 0 0", lineHeight: 1.1,
        }}>
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}