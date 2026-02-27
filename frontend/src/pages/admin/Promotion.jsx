import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Send, CheckCircle, Loader2, Megaphone, Eye, X } from "lucide-react";
import { postService } from "../../service/axios";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  primary:   "#c36a4d",
  primary90: "#b05c40",
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

const PROMO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .promo-root * { font-family: 'DM Sans', sans-serif; }

  /* ── Field ── */
  .promo-field {
    width: 100%;
    padding: 11px 16px;
    font-size: 13.5px;
    font-weight: 500;
    color: ${C.text};
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 13px;
    outline: none;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }
  .promo-field::placeholder { color: ${C.subtle}; }
  .promo-field:focus {
    border-color: ${C.tint50};
    box-shadow: 0 0 0 3px ${C.tint10};
  }
  .promo-field.promo-error {
    border-color: #fca5a5;
    box-shadow: 0 0 0 3px #fef2f2;
  }

  /* ── Preview button ── */
  .promo-preview-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px;
    font-size: 13px; font-weight: 700;
    color: ${C.muted};
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 13px;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease,
                border-color 150ms ease,
                transform 180ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 150ms ease;
  }
  .promo-preview-btn:hover {
    background: ${C.tint10};
    color: ${C.primary};
    border-color: ${C.tint30};
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 12px rgba(195,106,77,.12);
  }

  /* ── Clear button ── */
  .promo-clear-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px;
    font-size: 13px; font-weight: 700;
    color: ${C.muted};
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 13px;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease,
                border-color 150ms ease, transform 180ms ease;
  }
  .promo-clear-btn:hover {
    background: ${C.tint10};
    color: ${C.text};
    border-color: ${C.tint30};
    transform: translateY(-1px);
  }

  /* ── Send button ── */
  .promo-send-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 26px;
    font-size: 13px; font-weight: 700;
    color: #fff;
    background: ${C.primary};
    border: none;
    border-radius: 13px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(195,106,77,.35);
    transition: background 160ms ease,
                transform 200ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 200ms ease;
    position: relative; overflow: hidden;
  }
  .promo-send-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.15) 0%, transparent 60%);
    pointer-events: none;
  }
  .promo-send-btn:hover:not(:disabled) {
    background: ${C.primary90};
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 22px rgba(195,106,77,.42);
  }
  .promo-send-btn:active:not(:disabled) { transform: translateY(0) scale(.98); }
  .promo-send-btn:disabled { opacity: .65; cursor: not-allowed; }

  /* ── Modal close ── */
  .promo-modal-close {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 9px;
    border: none; background: transparent;
    color: ${C.subtle};
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, transform 200ms ease;
  }
  .promo-modal-close:hover {
    background: ${C.tint10};
    color: ${C.primary};
    transform: rotate(90deg) scale(1.1);
  }

  /* ── Form card ── */
  .promo-card {
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    transition: box-shadow 200ms ease, border-color 200ms ease;
  }
  .promo-card:hover {
    box-shadow: 0 6px 24px rgba(195,106,77,.08);
    border-color: ${C.tint20};
  }

  /* ── Modal overlay ── */
  @keyframes promo-overlay-in {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes promo-panel-in {
    from { opacity: 0; transform: translateY(16px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .promo-overlay { animation: promo-overlay-in 200ms ease both; }
  .promo-panel   { animation: promo-panel-in 240ms cubic-bezier(.22,1,.36,1) both; }
`;

const emptyForm = { subject: "", offerTitle: "", offerDescription: "" };

export default function Promotion() {
  const [form, setForm]       = useState(emptyForm);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [preview, setPreview] = useState(false);

  const validate = () => {
    const err = {};
    if (!form.subject.trim())          err.subject          = "Subject is required";
    if (!form.offerTitle.trim())       err.offerTitle       = "Offer title is required";
    if (!form.offerDescription.trim()) err.offerDescription = "Offer description is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setApiError(null);
      const response = await postService("/admin/promotion", {
        subject: form.subject,
        offerTitle: form.offerTitle,
        offerDescription: form.offerDescription,
      });
      if (!response?.data) throw new Error("Failed to send promotion");
      setSuccess(true);
      setForm(emptyForm);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to send promotion");
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => {
      setForm({ ...form, [key]: e.target.value });
      if (errors[key]) setErrors({ ...errors, [key]: null });
    },
  });

  return (
    <AdminLayout>
      <style>{PROMO_CSS}</style>

      <div className="promo-root" style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* ── Page heading ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 13,
              background: C.tint10, border: `1.5px solid ${C.tint30}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Megaphone size={20} style={{ color: C.primary }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.4px" }}>
              Send Promotion
            </h1>
          </div>
          <p style={{ fontSize: 13, color: C.subtle, marginLeft: 54, fontWeight: 500 }}>
            Send promotional email to all subscribers.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── Success banner ──────────────────────────────────────────── */}
          {success && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#ecfdf5", border: "1.5px solid #a7f3d0",
              borderRadius: 13, padding: "12px 18px",
            }}>
              <CheckCircle size={17} style={{ color: "#059669", flexShrink: 0 }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: "#059669", margin: 0 }}>
                Promotion sent successfully!
              </p>
            </div>
          )}

          {/* ── Error banner ────────────────────────────────────────────── */}
          {apiError && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#fef2f2", border: "1.5px solid #fecaca",
              borderRadius: 13, padding: "12px 18px",
            }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#dc2626", margin: 0 }}>{apiError}</p>
              <button className="promo-modal-close" onClick={() => setApiError(null)}>
                <X size={15} />
              </button>
            </div>
          )}

          {/* ── Form card ───────────────────────────────────────────────── */}
          <div className="promo-card">

            {/* Subject */}
            <div>
              <FieldLabel>Email Subject *</FieldLabel>
              <input
                type="text"
                placeholder="Enter subject"
                className={`promo-field${errors.subject ? " promo-error" : ""}`}
                {...field("subject")}
              />
              {errors.subject && <ErrMsg>{errors.subject}</ErrMsg>}
            </div>

            {/* Offer Title */}
            <div>
              <FieldLabel>Offer Title *</FieldLabel>
              <input
                type="text"
                placeholder="Enter offer title"
                className={`promo-field${errors.offerTitle ? " promo-error" : ""}`}
                {...field("offerTitle")}
              />
              {errors.offerTitle && <ErrMsg>{errors.offerTitle}</ErrMsg>}
            </div>

            {/* Offer Description */}
            <div>
              <FieldLabel>Offer Description *</FieldLabel>
              <textarea
                rows={6}
                placeholder="Write offer description…"
                className={`promo-field${errors.offerDescription ? " promo-error" : ""}`}
                style={{ resize: "none" }}
                {...field("offerDescription")}
              />
              {errors.offerDescription && <ErrMsg>{errors.offerDescription}</ErrMsg>}
            </div>

            {/* ── Action bar ──────────────────────────────────────────── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button className="promo-preview-btn" onClick={() => setPreview(true)}>
                <Eye size={15} /> Preview
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="promo-clear-btn"
                  onClick={() => { setForm(emptyForm); setErrors({}); setApiError(null); }}
                >
                  Clear
                </button>
                <button className="promo-send-btn" onClick={handleSend} disabled={loading}>
                  {loading ? (
                    <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
                  ) : (
                    <><Send size={15} /> Send Now</>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Preview Modal ─────────────────────────────────────────────────── */}
      {preview && (
        <div
          className="promo-overlay"
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
            background: "rgba(28,25,23,.45)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            className="promo-panel"
            style={{
              background: C.surface,
              width: "100%", maxWidth: 500,
              borderRadius: 24,
              border: `1.5px solid ${C.tint20}`,
              boxShadow: "0 24px 64px rgba(195,106,77,.2), 0 4px 12px rgba(0,0,0,.08)",
              overflow: "hidden",
            }}
          >
            {/* Modal header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px",
              borderBottom: `1.5px solid ${C.tint20}`,
              background: C.tint10,
            }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: 0 }}>
                  Email Preview
                </h3>
                <p style={{ fontSize: 12, color: C.subtle, margin: "3px 0 0", fontWeight: 500 }}>
                  How it looks to subscribers
                </p>
              </div>
              <button className="promo-modal-close" onClick={() => setPreview(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px" }}>
              {/* Subject line */}
              <p style={{
                fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
                textTransform: "uppercase", color: C.subtle, margin: "0 0 6px",
              }}>
                Subject
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 20px" }}>
                {form.subject || <span style={{ color: C.subtle }}>—</span>}
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: C.tint20, margin: "0 0 20px" }} />

              {/* Offer title */}
              <p style={{
                fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
                textTransform: "uppercase", color: C.subtle, margin: "0 0 6px",
              }}>
                Offer Title
              </p>
              <p style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: "0 0 14px" }}>
                {form.offerTitle || <span style={{ color: C.subtle, fontSize: 14 }}>—</span>}
              </p>

              {/* Offer description */}
              <p style={{
                fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
                textTransform: "uppercase", color: C.subtle, margin: "0 0 6px",
              }}>
                Description
              </p>
              <p style={{
                fontSize: 13.5, color: C.muted, lineHeight: 1.65,
                margin: 0, whiteSpace: "pre-wrap",
              }}>
                {form.offerDescription || <span style={{ color: C.subtle }}>—</span>}
              </p>
            </div>

            {/* Modal footer */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              gap: 10, padding: "14px 24px",
              borderTop: `1.5px solid ${C.tint20}`,
              background: C.tint10,
            }}>
              <button
                className="promo-clear-btn"
                onClick={() => setPreview(false)}
              >
                Cancel
              </button>
              <button
                className="promo-send-btn"
                onClick={() => { setPreview(false); handleSend(); }}
              >
                <Send size={14} /> Send Now
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <label style={{
      display: "block",
      fontSize: 11.5, fontWeight: 800,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      color: "#78716c",
      marginBottom: 7,
    }}>
      {children}
    </label>
  );
}

function ErrMsg({ children }) {
  return (
    <p style={{ fontSize: 12, color: "#dc2626", marginTop: 5, fontWeight: 500 }}>
      {children}
    </p>
  );
}