import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  getService, postService, patchService, deleteService,
} from "../../service/axios";
import {
  Package, Save, Trash2, Eye, EyeOff, Upload,
  Boxes, CheckCircle, AlertTriangle,
  ChevronLeft, ChevronRight as ChevronRightIcon,
} from "lucide-react";

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

/* ── Global CSS ──────────────────────────────────────────────────────────*/
const GLOBAL_CSS = `
  .pm-root * { box-sizing: border-box; }

  /* ── Stat grid ── */
  .pm-stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  /* ── Form grid ── */
  .pm-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 24px;
  }

  /* ── Table: scrollable wrapper ── */
  .pm-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .pm-table { width: 100%; min-width: 480px; border-collapse: collapse; }

  /* ── Pagination row ── */
  .pm-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* ── Mobile product cards (hidden on desktop) ── */
  .pm-mobile-cards { display: none; }
  .pm-desktop-table { display: block; }

  /* ═══════════════════════════
     RESPONSIVE ≤ 768px
  ═══════════════════════════ */
  @media (max-width: 768px) {
    .pm-form-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }
    .pm-stat-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .pm-stat-card:nth-child(3) {
      grid-column: 1 / -1;
    }
    .pm-outer {
      padding-left: 10px !important;
      padding-right: 10px !important;
      padding-bottom: 80px !important;
    }
    .pm-card-pad { padding: 14px !important; }
    .pm-form-header, .pm-table-header {
      padding: 12px 14px !important;
    }
    .pm-pagination {
      padding: 10px 14px;
    }
    /* Switch table to card layout on mobile */
    .pm-desktop-table { display: none; }
    .pm-mobile-cards  { display: block; }
    /* submit btn full width */
    .pm-submit-row {
      justify-content: stretch !important;
    }
    .pm-submit-row button {
      width: 100% !important;
      justify-content: center !important;
    }
    /* stat card tighter */
    .pm-stat-card { padding: 12px 14px !important; }
    .pm-stat-icon { width: 36px !important; height: 36px !important; }
    .pm-stat-value { font-size: 20px !important; }
    .pm-stat-label { font-size: 10px !important; }
  }

  /* ═══════════════════════════
     RESPONSIVE ≤ 480px
  ═══════════════════════════ */
  @media (max-width: 480px) {
    .pm-stat-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .pm-stat-card:nth-child(3) {
      grid-column: auto;
    }
    .pm-pagination {
      flex-direction: column;
      align-items: flex-start;
    }
    .pm-page-btns {
      width: 100%;
      justify-content: space-between;
    }
  }
`;

/* ── Focus helpers ───────────────────────────────────────────────────────*/
const applyFocus  = (e) => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${T.tint20}`; };
const removeFocus = (e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; };
const baseInput   = { width:"100%", padding:"10px 14px", fontSize:13, color:"#1a1a1a", background:"white", border:"1.5px solid #e5e7eb", borderRadius:12, outline:"none", transition:"border 0.15s, box-shadow 0.15s" };
const baseSelect  = { ...baseInput, appearance:"none", paddingRight:36, cursor:"pointer" };

const labelCls = `block text-[11px] font-bold uppercase tracking-widest mb-1.5`;

export default function ProductManagement() {
  const PAGE_SIZE = 5;

  const emptyProduct = {
    categoryId:"", subCategoryId:"", name:"", skuId:"",
    description:"", specifications:"", status:"Available", images:[],
  };

  const [products, setProducts]           = useState([]);
  const [categories, setCategories]       = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [form, setForm]                   = useState(emptyProduct);
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalItems, setTotalItems]       = useState(0);

  /* ── API — completely untouched ─────────────────────────────────────── */
  const fetchProducts = async (page = 1) => {
    try {
      const res = await getService(`/admin/product/getAll?page=${page}&limit=${PAGE_SIZE}`);
      const result = res?.data?.data;
      setProducts(Array.isArray(result?.data) ? result.data : []);
      setCurrentPage(result?.currentPage || 1);
      setTotalPages(result?.totalPages || 1);
      setTotalItems(result?.totalItems || 0);
    } catch (err) { console.log(err); setProducts([]); }
  };

  const fetchCategories = async () => {
    try {
      const res = await getService("/admin/category/categoryItems");
      setCategories(Array.isArray(res?.data?.data?.data) ? res.data.data.data : []);
    } catch (err) { console.log(err); }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const res = await getService(`/admin/subcategory/getbyCategoryId/${categoryId}`);
      setSubCategories(Array.isArray(res?.data?.data?.data) ? res.data.data.data : []);
    } catch (err) { console.log(err); setSubCategories([]); }
  };

  useEffect(() => { fetchProducts(currentPage); }, [currentPage]);
  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("categoryId",     form.categoryId);
      formData.append("subCategoryId",  form.subCategoryId);
      formData.append("name",           form.name);
      formData.append("skuId",          form.skuId);
      formData.append("description",    form.description);
      formData.append("specifications", form.specifications);
      formData.append("status",         form.status);
      form.images.forEach((file) => formData.append("productImage", file));
      await postService("/admin/product/addProduct", formData);
      setForm(emptyProduct); setSubCategories([]); fetchProducts(1);
    } catch (err) { console.log(err); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(`/admin/product/delete?productId=${id}`);
      fetchProducts(currentPage);
    } catch (err) { console.log(err); }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Available" ? "Un-Available" : "Available";
    try {
      await patchService("/admin/product/updateStatus", { productId: id, status: newStatus });
      fetchProducts(currentPage);
    } catch (err) { console.log(err); }
  };
  /* ─────────────────────────────────────────────────────────────────── */

  const stats = {
    total:       totalItems,
    available:   products.filter((p) => p.status === "Available").length,
    unavailable: products.filter((p) => p.status === "Un-Available").length,
  };

  return (
    <AdminLayout>
      <style>{GLOBAL_CSS}</style>

      <div
        className="pm-root pm-outer"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 32px", display: "flex", flexDirection: "column", gap: 20 }}
      >

        {/* ── Heading ──────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-[18px] sm:text-[22px] font-bold tracking-tight" style={{ color: "#1a1a1a" }}>Products</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: T.mutedLight }}>Add and manage your product catalogue</p>
        </div>

        {/* ── Stat cards ───────────────────────────────────────────────── */}
        <div className="pm-stat-grid">
          <StatCard icon={<Boxes size={17} />}         label="Total"        value={stats.total}       accent={T.primary} bg={T.tint20} ring={T.border}  />
          <StatCard icon={<CheckCircle size={17} />}   label="Available"    value={stats.available}   accent="#059669"   bg="#ecfdf5"  ring="#a7f3d0"   />
          <StatCard icon={<AlertTriangle size={17} />} label="Un-Available" value={stats.unavailable} accent="#6b7280"   bg="#f9fafb"  ring="#e5e7eb"   />
        </div>

        {/* ── Add Product form ─────────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden transition-shadow duration-200"
          style={{ background:"white", border:`1px solid ${T.border}`, boxShadow:"0 1px 4px rgba(195,106,77,0.07)" }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 6px 24px rgba(195,106,77,0.11)`}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(195,106,77,0.07)"}
        >
          {/* Form header */}
          <div
            className="pm-form-header flex items-center gap-3 px-6 py-4"
            style={{ borderBottom:`1px solid ${T.border}`, background:T.tint10 }}
          >
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background:T.tint20, border:`1px solid ${T.border}`, color:T.primary }}>
              <Package size={14} />
            </div>
            <div>
              <h2 className="text-[13px] sm:text-[14px] font-bold" style={{ color:T.primaryDark }}>Add New Product</h2>
              <p className="text-[11px] sm:text-[12px]" style={{ color:T.mutedLight }}>Fill in all product details</p>
            </div>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="pm-card-pad px-4 sm:px-6 py-4 sm:py-5">
            <div className="pm-form-grid">

              {/* Category */}
              <BrandField label="Category">
                <div className="relative">
                  <select
                    value={form.categoryId}
                    onChange={(e) => { setForm({ ...form, categoryId:e.target.value, subCategoryId:"" }); fetchSubCategories(e.target.value); }}
                    style={baseSelect} onFocus={applyFocus} onBlur={removeFocus}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <ChevronRightIcon size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color:T.muted }} />
                </div>
              </BrandField>

              {/* Sub-Category */}
              <BrandField label="Sub-Category">
                <div className="relative">
                  <select
                    value={form.subCategoryId}
                    onChange={(e) => setForm({ ...form, subCategoryId:e.target.value })}
                    style={baseSelect} onFocus={applyFocus} onBlur={removeFocus}
                  >
                    <option value="">Select Sub-Category</option>
                    {subCategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <ChevronRightIcon size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color:T.muted }} />
                </div>
              </BrandField>

              {/* Name */}
              <BrandField label="Product Name">
                <input
                  style={baseInput} placeholder="e.g. Wireless Headphones"
                  value={form.name} onChange={(e) => setForm({ ...form, name:e.target.value })}
                  onFocus={applyFocus} onBlur={removeFocus}
                />
              </BrandField>

              {/* SKU */}
              <BrandField label="SKU ID">
                <input
                  style={baseInput} placeholder="e.g. ELEC-WH-001"
                  value={form.skuId} onChange={(e) => setForm({ ...form, skuId:e.target.value })}
                  onFocus={applyFocus} onBlur={removeFocus}
                />
              </BrandField>

              {/* Description */}
              <BrandField label="Description">
                <textarea
                  style={{ ...baseInput, resize:"none" }} rows={3} placeholder="Product description..."
                  value={form.description} onChange={(e) => setForm({ ...form, description:e.target.value })}
                  onFocus={applyFocus} onBlur={removeFocus}
                />
              </BrandField>

              {/* Specifications */}
              <BrandField label="Specifications">
                <textarea
                  style={{ ...baseInput, resize:"none" }} rows={3} placeholder="Key specifications..."
                  value={form.specifications} onChange={(e) => setForm({ ...form, specifications:e.target.value })}
                  onFocus={applyFocus} onBlur={removeFocus}
                />
              </BrandField>

              {/* Status */}
              <BrandField label="Status">
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status:e.target.value })}
                    style={baseSelect} onFocus={applyFocus} onBlur={removeFocus}
                  >
                    <option value="Available">Available</option>
                    <option value="Un-Available">Un-Available</option>
                  </select>
                  <ChevronRightIcon size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color:T.muted }} />
                </div>
              </BrandField>

              {/* Image upload */}
              <BrandField label="Product Images">
                <label
                  className="flex items-center gap-3 w-full px-3 sm:px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
                  style={{ border:`1.5px dashed ${T.tint40}`, background:T.tint10 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.background = T.tint20; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.tint40;  e.currentTarget.style.background = T.tint10; }}
                >
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background:T.tint20, border:`1px solid ${T.border}`, color:T.primary }}>
                    <Upload size={13} />
                  </div>
                  <span className="text-[12px] sm:text-[13px] font-medium truncate" style={{ color:T.primaryDark }}>
                    {form.images.length > 0 ? `${form.images.length} file(s) selected` : "Click to upload images"}
                  </span>
                  <input type="file" multiple hidden onChange={(e) => setForm({ ...form, images:Array.from(e.target.files) })} />
                </label>
              </BrandField>

            </div>

            {/* Submit row */}
            <div
              className="pm-submit-row flex justify-end mt-4 sm:mt-5 pt-4"
              style={{ borderTop:`1px solid ${T.border}` }}
            >
              <PrimaryBtn type="submit" icon={<Save size={14} />}>Save Product</PrimaryBtn>
            </div>
          </form>
        </div>

        {/* ── Products table / cards ────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden transition-shadow duration-200"
          style={{ background:"white", border:`1px solid ${T.border}`, boxShadow:"0 1px 4px rgba(195,106,77,0.07)" }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 6px 24px rgba(195,106,77,0.11)`}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(195,106,77,0.07)"}
        >
          {/* Table header */}
          <div
            className="pm-table-header px-4 sm:px-6 py-3 sm:py-4"
            style={{ borderBottom:`1px solid ${T.border}`, background:T.tint10 }}
          >
            <h2 className="text-[13px] sm:text-[14px] font-bold" style={{ color:T.primaryDark }}>Product List</h2>
            <p className="text-[11px] sm:text-[12px] mt-0.5" style={{ color:T.mutedLight }}>{totalItems} total products</p>
          </div>

          {/* ── DESKTOP: Scrollable table ─────────────────────────────── */}
          <div className="pm-desktop-table">
            <div className="pm-table-wrap">
              <table className="pm-table text-[13px]">
                <thead>
                  <tr style={{ background:T.tint10, borderBottom:`1px solid ${T.border}` }}>
                    <th className="px-6 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-widest" style={{ color:T.muted }}>Product</th>
                    <th className="px-6 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-widest" style={{ color:T.muted }}>SKU</th>
                    <th className="px-6 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-widest" style={{ color:T.muted }}>Status</th>
                    <th className="px-6 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-widest" style={{ color:T.muted }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-[13px]" style={{ color:T.mutedLight }}>
                        No products found
                      </td>
                    </tr>
                  ) : products.map((p) => (
                    <tr
                      key={p._id}
                      style={{ borderBottom:`1px solid #faf7f6`, background:"white" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = T.tint10}
                      onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
                            style={{ background:T.tint20, border:`1px solid ${T.border}`, color:T.primary }}>
                            {p.images?.[0]
                              ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                              : <Package size={15} />
                            }
                          </div>
                          <span className="font-semibold" style={{ color:"#1a1a1a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160, display:"block" }}>
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[12px] px-2.5 py-1 rounded-lg"
                          style={{ background:T.tint10, border:`1px solid ${T.border}`, color:T.primaryDark }}>
                          {p.skuId || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-[11.5px] font-semibold rounded-lg border"
                          style={p.status === "Available"
                            ? { background:"#ecfdf5", color:"#059669", borderColor:"#a7f3d0" }
                            : { background:"#f9fafb", color:"#6b7280", borderColor:"#e5e7eb" }
                          }>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ActionBtn
                            onClick={() => toggleStatus(p._id, p.status)}
                            title={p.status === "Available" ? "Disable" : "Enable"}
                            base={{ background:T.tint10, border:`1px solid ${T.border}`, color:T.muted }}
                            hover={p.status === "Available"
                              ? { background:"#fef2f2", borderColor:"#fecaca", color:"#ef4444" }
                              : { background:"#ecfdf5", borderColor:"#a7f3d0", color:"#059669" }
                            }
                          >
                            {p.status === "Available" ? <EyeOff size={14} /> : <Eye size={14} />}
                          </ActionBtn>
                          <ActionBtn
                            onClick={() => handleDelete(p._id)}
                            base={{ background:T.tint10, border:`1px solid ${T.border}`, color:T.muted }}
                            hover={{ background:"#fef2f2", borderColor:"#fecaca", color:"#ef4444" }}
                          >
                            <Trash2 size={14} />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── MOBILE: Card list ─────────────────────────────────────── */}
          <div className="pm-mobile-cards">
            {products.length === 0 ? (
              <div className="py-10 text-center text-[13px]" style={{ color:T.mutedLight }}>No products found</div>
            ) : products.map((p) => (
              <div
                key={p._id}
                className="px-4 py-3.5"
                style={{ borderBottom:`1px solid ${T.tint10}` }}
              >
                {/* Top row: image + name + status badge */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
                    style={{ background:T.tint20, border:`1px solid ${T.border}`, color:T.primary }}>
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      : <Package size={15} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold leading-tight truncate" style={{ color:"#1a1a1a" }}>
                      {p.name}
                    </p>
                    {p.skuId && (
                      <p className="text-[11px] mt-0.5 font-mono truncate" style={{ color:T.muted }}>
                        {p.skuId}
                      </p>
                    )}
                  </div>
                  <span
                    className="shrink-0 px-2 py-0.5 text-[10.5px] font-semibold rounded-lg border"
                    style={p.status === "Available"
                      ? { background:"#ecfdf5", color:"#059669", borderColor:"#a7f3d0" }
                      : { background:"#f9fafb", color:"#6b7280", borderColor:"#e5e7eb" }
                    }
                  >
                    {p.status === "Available" ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => toggleStatus(p._id, p.status)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-semibold rounded-lg border transition-all duration-150 flex-1 justify-center"
                    style={p.status === "Available"
                      ? { background:"#fef2f2", borderColor:"#fecaca", color:"#ef4444" }
                      : { background:"#ecfdf5", borderColor:"#a7f3d0", color:"#059669" }
                    }
                  >
                    {p.status === "Available" ? <><EyeOff size={13} /> Disable</> : <><Eye size={13} /> Enable</>}
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-semibold rounded-lg border transition-all duration-150 flex-1 justify-center"
                    style={{ background:"#f9fafb", borderColor:"#e5e7eb", color:"#9ca3af" }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div
            className="pm-pagination"
            style={{ borderTop:`1px solid ${T.border}`, background:T.tint10 }}
          >
            <span className="text-[12px] font-medium" style={{ color:T.mutedLight }}>
              Page{" "}
              <span className="font-bold" style={{ color:T.primaryDark }}>{currentPage}</span>
              {" "}of{" "}
              <span className="font-bold" style={{ color:T.primaryDark }}>{totalPages}</span>
              <span className="ml-2" style={{ color:T.mutedLight }}>({totalItems} items)</span>
            </span>
            <div className="pm-page-btns flex items-center gap-2">
              <PaginationBtn disabled={currentPage === 1}          onClick={() => setCurrentPage(currentPage - 1)}>
                <ChevronLeft size={13} /> Prev
              </PaginationBtn>
              <PaginationBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                Next <ChevronRightIcon size={13} />
              </PaginationBtn>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────────*/
function StatCard({ icon, label, value, accent, bg, ring }) {
  return (
    <div
      className="pm-stat-card rounded-2xl px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 transition-shadow duration-200"
      style={{ background:"white", border:`1px solid ${T.border}`, boxShadow:"0 1px 3px rgba(195,106,77,0.05)" }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 6px 20px rgba(195,106,77,0.13)`}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(195,106,77,0.05)"}
    >
      <div className="pm-stat-icon h-9 w-9 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background:bg, border:`1px solid ${ring}`, color:accent }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="pm-stat-label text-[10px] sm:text-[11px] font-bold uppercase tracking-widest truncate" style={{ color:T.muted }}>{label}</p>
        <p className="pm-stat-value text-[20px] sm:text-[24px] font-bold leading-tight" style={{ color:"#1a1a1a" }}>{value ?? "—"}</p>
      </div>
    </div>
  );
}

/* ── Brand field wrapper ─────────────────────────────────────────────────*/
function BrandField({ label, children }) {
  return (
    <div>
      <label className={labelCls} style={{ color:T.muted }}>{label}</label>
      {children}
    </div>
  );
}

/* ── Primary button ──────────────────────────────────────────────────────*/
function PrimaryBtn({ onClick, type = "button", icon, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type} onClick={onClick}
      className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl transition-all duration-150"
      style={{
        background: hov ? T.primaryHov : T.primary,
        boxShadow: hov ? `0 4px 14px rgba(195,106,77,0.38)` : `0 1px 4px rgba(195,106,77,0.18)`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {icon}{children}
    </button>
  );
}

/* ── Action button (table) ───────────────────────────────────────────────*/
function ActionBtn({ onClick, title, base, hover, children }) {
  return (
    <button
      onClick={onClick} title={title}
      className="p-2 rounded-xl border transition-all duration-150"
      style={base}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, hover)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, base)}
    >
      {children}
    </button>
  );
}

/* ── Pagination button ───────────────────────────────────────────────────*/
function PaginationBtn({ disabled, onClick, children }) {
  return (
    <button
      disabled={disabled} onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg border
                 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ color:T.primaryDark, borderColor:T.border, background:"white" }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = T.tint20; e.currentTarget.style.borderColor = T.primary; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = T.border; }}
    >
      {children}
    </button>
  );
}