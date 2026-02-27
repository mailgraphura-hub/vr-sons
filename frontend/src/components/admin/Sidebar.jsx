import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { postService } from "../../service/axios";
import { Toaster, toast } from "react-hot-toast";

import {
  LayoutDashboard,
  Folder,
  FolderTree,
  Package,
  MessageSquare,
  Settings,
  ChevronDown,
  Megaphone,
  BookOpen,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";

import logo from "../../assets/logo/NavLogo.svg";

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

const SIDEBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
  .sb-root * { font-family: 'DM Sans', sans-serif; }

  /* ── Desktop: natural flex child — fills layout height ── */
  .sb-aside {
    width: 268px;
    min-width: 268px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${C.surface};
    border-right: 1.5px solid ${C.border};
    position: relative;
    flex-shrink: 0;
    z-index: 1;
  }
  .sb-aside::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(253,243,240,.6) 0%, transparent 45%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Mobile: hidden off-screen, overlays as fixed drawer ── */
  @media (max-width: 767px) {
    .sb-aside {
      position: fixed;
      top: 0; left: 0;
      width: 268px; min-width: unset;
      height: 100dvh;            /* full viewport height */
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 300ms cubic-bezier(.4, 0, .2, 1);
      box-shadow: 6px 0 32px rgba(0,0,0,.13);
    }
    .sb-aside.sb-open {
      transform: translateX(0);
    }
  }

  /* ── Backdrop — only visible on mobile when drawer is open ── */
  .sb-backdrop {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0);
    z-index: 99;
    pointer-events: none;
    transition: background 300ms ease;
  }
  @media (max-width: 767px) {
    .sb-backdrop.sb-open {
      display: block;
      background: rgba(0,0,0,.28);
      pointer-events: all;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }
  }

  /* ── Logo bar — 64px to align with header ── */
  .sb-logo-bar {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 0 24px;
    flex-shrink: 0;
    position: relative; z-index: 1;
    border-bottom: 1.5px solid ${C.border};
    background: rgba(253,243,240,.55);
  }

  /* Close button — only visible on mobile */
  .sb-close-btn {
    display: none;
    align-items: center; justify-content: center;
    width: 30px; height: 30px;
    border-radius: 8px;
    border: 1.5px solid ${C.tint30};
    background: ${C.tint10};
    cursor: pointer;
    color: ${C.muted};
    flex-shrink: 0;
    transition: background 150ms ease, color 150ms ease;
  }
  .sb-close-btn:hover { background: ${C.tint20}; color: ${C.primary}; }
  @media (max-width: 767px) { .sb-close-btn { display: flex; } }

  .sb-nav {
    flex: 1;
    padding: 20px 12px 12px;
    display: flex; flex-direction: column;
    gap: 4px;
    position: relative; z-index: 1;
    overflow-y: auto;
  }

  .sb-section-label {
    padding: 0 14px 12px;
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: ${C.subtle};
  }

  .sb-nav-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 12px 14px;
    border-radius: 13px;
    font-size: 14px; font-weight: 600;
    color: ${C.muted};
    background: transparent; border: none;
    cursor: pointer; text-align: left; text-decoration: none;
    transition: background 150ms ease, color 150ms ease,
                transform 180ms cubic-bezier(.34,1.56,.64,1), box-shadow 150ms ease;
    position: relative; overflow: hidden;
    user-select: none;
  }
  .sb-nav-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.18) 0%, transparent 60%);
    pointer-events: none; opacity: 0;
    transition: opacity 200ms ease;
  }
  .sb-nav-btn:hover { background: ${C.tint10}; color: ${C.text}; transform: translateX(2px); }
  .sb-nav-btn:hover::after { opacity: 1; }
  .sb-nav-btn.sb-active {
    background: ${C.tint20}; color: ${C.text};
    box-shadow: inset 0 0 0 1.5px ${C.tint30}, 0 2px 8px rgba(195,106,77,.1);
  }
  .sb-nav-btn.sb-active::after { opacity: 1; }

  .sb-icon {
    color: ${C.subtle}; flex-shrink: 0;
    transition: color 150ms ease, transform 200ms cubic-bezier(.34,1.56,.64,1);
  }
  .sb-nav-btn:hover .sb-icon { color: ${C.primary}; transform: scale(1.15); }
  .sb-active .sb-icon { color: ${C.primary}; }

  .sb-active-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${C.primary}; flex-shrink: 0;
    box-shadow: 0 0 0 3px ${C.tint20};
  }

  .sb-chevron {
    color: ${C.subtle}; flex-shrink: 0;
    transition: transform 220ms cubic-bezier(.34,1.56,.64,1), color 150ms ease;
  }
  .sb-chevron.open { transform: rotate(180deg); }
  .sb-nav-btn:hover .sb-chevron { color: ${C.primary}; }
  .sb-active .sb-chevron { color: ${C.primary}; }

  .sb-sub-wrap {
    margin: 4px 0 6px 16px;
    padding-left: 14px;
    border-left: 2px solid ${C.tint20};
    display: flex; flex-direction: column; gap: 3px;
  }

  .sb-sub-btn {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 9px 12px;
    border-radius: 10px;
    font-size: 13.5px; font-weight: 500;
    color: ${C.muted}; text-decoration: none;
    transition: background 140ms ease, color 140ms ease,
                transform 180ms cubic-bezier(.34,1.56,.64,1);
    cursor: pointer; user-select: none;
  }
  .sb-sub-btn:hover { background: ${C.tint10}; color: ${C.text}; transform: translateX(3px); }
  .sb-sub-btn.sb-sub-active {
    background: ${C.tint20}; color: ${C.primary};
    font-weight: 700;
    box-shadow: inset 0 0 0 1.5px ${C.tint30};
  }

  .sb-sub-icon {
    color: ${C.subtle}; flex-shrink: 0;
    transition: color 140ms ease, transform 180ms ease;
  }
  .sb-sub-btn:hover .sb-sub-icon { color: ${C.primary}; transform: scale(1.12); }
  .sb-sub-active .sb-sub-icon    { color: ${C.primary}; }

  .sb-logout-wrap {
    padding: 12px 12px 18px; flex-shrink: 0;
    position: relative; z-index: 1;
    border-top: 1.5px solid ${C.border};
  }
  .sb-logout-btn {
    display: flex; align-items: center; gap: 11px;
    width: 100%; padding: 12px 14px;
    border-radius: 13px;
    font-size: 14px; font-weight: 600;
    color: ${C.muted};
    background: transparent; border: none; cursor: pointer;
    transition: background 150ms ease, color 150ms ease,
                transform 180ms cubic-bezier(.34,1.56,.64,1), box-shadow 150ms ease;
  }
  .sb-logout-btn:hover {
    background: #fff1f2; color: #dc2626;
    transform: translateX(2px);
    box-shadow: inset 0 0 0 1.5px #fecaca;
  }
  .sb-logout-icon { transition: transform 200ms cubic-bezier(.34,1.56,.64,1), color 150ms ease; }
  .sb-logout-btn:hover .sb-logout-icon { transform: translateX(-3px) scale(1.1); color: #dc2626; }
`;

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [openCategory,  setOpenCategory]  = useState(false);
  const [openProducts,  setOpenProducts]  = useState(false);
  const [openPromotion, setOpenPromotion] = useState(false);

  const signout = async () => {
    const apiResponse = await postService("/signout");
    if (!apiResponse.ok) { toast.error("Signout Failed"); return; }
    toast.success("Signout Successfull");
    localStorage.clear();
    setTimeout(() => navigate("/"), 1000);
  };

  useEffect(() => {
    setOpenCategory(
      location.pathname.startsWith("/admin/categories") ||
      location.pathname.startsWith("/admin/sub-categories")
    );
    setOpenProducts(
      location.pathname.startsWith("/admin/products") ||
      location.pathname.startsWith("/admin/product-images")
    );
    setOpenPromotion(location.pathname.startsWith("/admin/promotion"));
  }, [location.pathname]);

  // Auto-close drawer when navigating (mobile)
  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  const isActive       = (path)  => location.pathname === path;
  const isParentActive = (paths) => paths.some((p) => location.pathname.startsWith(p));

  const navCls  = (active) => `sb-nav-btn${active ? " sb-active" : ""}`;
  const subCls  = (active) => `sb-sub-btn${active ? " sb-sub-active" : ""}`;
  const chevCls = (o)      => `sb-chevron${o ? " open" : ""}`;

  return (
    <>
      <style>{SIDEBAR_CSS}</style>
      <Toaster position="top-right" />

      {/* Backdrop — mobile only, rendered outside aside so it covers full screen */}
      <div
        className={`sb-backdrop${open ? " sb-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sb-root sb-aside${open ? " sb-open" : ""}`}>

        {/* Logo bar */}
        <div className="sb-logo-bar">
          <img src={logo} alt="Logo" style={{ height: 44, width: "auto", objectFit: "contain" }} />
          <button className="sb-close-btn" onClick={onClose} aria-label="Close menu">
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sb-nav">
          {/* <span className="sb-section-label">Main Menu</span> */}

          {/* Dashboard */}
          <Link to="/admin/dashboard" className={navCls(isActive("/admin/dashboard"))}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <LayoutDashboard size={18} className="sb-icon" />
              Dashboard
            </span>
            {isActive("/admin/dashboard") && <span className="sb-active-dot" />}
          </Link>

          {/* Categories */}
          <div>
            <button
              onClick={() => setOpenCategory(!openCategory)}
              className={navCls(isParentActive(["/admin/categories", "/admin/sub-categories"]))}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Folder size={18} className="sb-icon" />
                Categories
              </span>
              <ChevronDown size={13} className={chevCls(openCategory)} />
            </button>
            {openCategory && (
              <div className="sb-sub-wrap">
                <Link to="/admin/categories" className={subCls(isActive("/admin/categories"))}>
                  <FolderTree size={14} className="sb-sub-icon" /> All Categories
                </Link>
                <Link to="/admin/sub-categories" className={subCls(isActive("/admin/sub-categories"))}>
                  <FolderTree size={14} className="sb-sub-icon" /> Sub Categories
                </Link>
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <button
              onClick={() => setOpenProducts(!openProducts)}
              className={navCls(isParentActive(["/admin/products"]))}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Package size={18} className="sb-icon" />
                Products
              </span>
              <ChevronDown size={13} className={chevCls(openProducts)} />
            </button>
            {openProducts && (
              <div className="sb-sub-wrap">
                <Link to="/admin/products" className={subCls(isActive("/admin/products"))}>
                  <Package size={14} className="sb-sub-icon" /> Product Management
                </Link>
              </div>
            )}
          </div>

          {/* Inquiries */}
          <Link to="/admin/inquiries" className={navCls(isActive("/admin/inquiries"))}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MessageSquare size={18} className="sb-icon" />
              Inquiries
            </span>
            {isActive("/admin/inquiries") && <span className="sb-active-dot" />}
          </Link>

          {/* Promotion */}
          <div>
            <button
              onClick={() => setOpenPromotion(!openPromotion)}
              className={navCls(isParentActive(["/admin/promotion"]))}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Megaphone size={18} className="sb-icon" />
                Promotion
              </span>
              <ChevronDown size={13} className={chevCls(openPromotion)} />
            </button>
            {openPromotion && (
              <div className="sb-sub-wrap">
                <Link to="/admin/promotion/blogs" className={subCls(isActive("/admin/promotion/blogs"))}>
                  <BookOpen size={14} className="sb-sub-icon" /> Blogs
                </Link>
                <Link to="/admin/promotion/managPromotion" className={subCls(isActive("/admin/promotion/managPromotion"))}>
                  <Sparkles size={14} className="sb-sub-icon" /> Promotion Manager
                </Link>
              </div>
            )}
          </div>

          {/* Settings */}
          <Link to="/admin/settings/profile" className={navCls(isParentActive(["/admin/settings"]))}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Settings size={18} className="sb-icon" />
              Settings
            </span>
            {isParentActive(["/admin/settings"]) && <span className="sb-active-dot" />}
          </Link>
        </nav>

        {/* Logout */}
        <div className="sb-logout-wrap">
          <button className="sb-logout-btn" onClick={signout}>
            <LogOut size={17} className="sb-logout-icon" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}