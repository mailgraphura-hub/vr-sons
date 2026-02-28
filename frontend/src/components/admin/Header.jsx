import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, UserCircle, Menu, Home } from "lucide-react";
import { getService } from "../../service/axios";

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
};

const HEADER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .hdr-root { font-family: 'DM Sans', sans-serif; }

  .hdr-bar {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background: rgba(255, 251, 249, 0.92);
    backdrop-filter: blur(18px) saturate(1.6);
    -webkit-backdrop-filter: blur(18px) saturate(1.6);
    border-bottom: 1.5px solid rgba(243, 201, 187, 0.55);
    box-shadow: 0 1px 0 rgba(195,106,77,.06), 0 4px 20px rgba(195,106,77,.05);
    position: relative;
  }

  .hdr-bar::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, ${C.tint30} 30%, ${C.primary} 50%, ${C.tint30} 70%, transparent 100%);
    opacity: 0.7;
  }

  .hdr-crumb-last {
    font-size: 15px; font-weight: 800;
    color: ${C.text}; letter-spacing: -0.2px;
    white-space: nowrap;
  }
  .hdr-crumb-parent {
    font-size: 14px; font-weight: 500;
    color: ${C.subtle};
    transition: color 150ms ease;
    white-space: nowrap;
  }
  .hdr-crumb-parent:hover { color: ${C.primary}; }
  .hdr-crumb-sep { color: ${C.tint50}; }

  .hdr-center {
    display: flex; align-items: center;
    gap: 6px; min-width: 0; flex: 1;
  }

  .hdr-avatar-link {
    position: relative;
    width: 38px; height: 38px;
    border-radius: 50%; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    outline: 2.5px solid ${C.tint30};
    outline-offset: 2px;
    transition: outline-color 200ms ease,
                transform 220ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 200ms ease;
    flex-shrink: 0;
  }
  .hdr-avatar-link:hover {
    outline-color: ${C.primary};
    transform: scale(1.1);
    box-shadow: 0 6px 18px rgba(195,106,77,.28);
  }

  .hdr-home-link {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid ${C.tint30};
    background: ${C.tint10};
    color: ${C.primary};
    flex-shrink: 0;
    transition: background 150ms ease, border-color 150ms ease, transform 220ms cubic-bezier(.34,1.56,.64,1), box-shadow 200ms ease;
  }
  .hdr-home-link:hover {
    background: ${C.tint20};
    border-color: ${C.primary};
    transform: scale(1.08);
    box-shadow: 0 4px 14px rgba(195,106,77,.2);
  }

  .hdr-divider {
    width: 1px; height: 32px;
    background: linear-gradient(to bottom, transparent, ${C.tint30} 30%, ${C.tint30} 70%, transparent);
  }

  .hdr-right {
    display: flex; align-items: center;
    gap: 14px; flex-shrink: 0;
  }

  .hdr-admin-block {
    display: flex; flex-direction: column;
    align-items: flex-end; gap: 2px;
  }

  /* Hamburger button — only on mobile */
  .hdr-hamburger {
    display: none;
    align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid ${C.tint30};
    background: ${C.tint10};
    cursor: pointer;
    flex-shrink: 0;
    transition: background 150ms ease;
  }
  .hdr-hamburger:hover { background: ${C.tint20}; }

  @keyframes hdr-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .45; }
  }
  .hdr-skeleton {
    background: ${C.tint20}; border-radius: 6px;
    animation: hdr-pulse 1.5s ease infinite;
  }

  /* ── Mobile overrides ── */
  @media (max-width: 767px) {
    .hdr-bar { padding: 0 16px; }
    .hdr-hamburger { display: flex; }
    .hdr-center { display: none; }       /* hide breadcrumbs on mobile */
    .hdr-admin-block { display: none; }  /* hide name/role on mobile   */
    .hdr-divider { display: none; }      /* hide divider on mobile     */
  }
`;

export default function Header({ onMenuClick }) {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);
  const location              = useLocation();

  const renderBreadcrumbs = () => {
    const path = location.pathname;
    const nameMap = {
      categories:       "Categories",
      "sub-categories": "Categories",
      products:         "Products",
      promotion:        "Promotion",
      settings:         "Settings",
      managPromotion:   "Promotion Manager",
      blogs:            "Blogs",
      profile:          "Profile",
    };

    let breadcrumbs = [];
    if (path.includes("dashboard"))                     breadcrumbs = ["Dashboard"];
    else if (path.includes("sub-categories"))           breadcrumbs = ["Categories", "Sub Categories"];
    else if (path.includes("categories"))               breadcrumbs = ["Categories", "All Categories"];
    else if (path.includes("products"))                 breadcrumbs = ["Products", "Management"];
    else if (path.includes("promotion/blogs"))          breadcrumbs = ["Promotion", "Blogs"];
    else if (path.includes("promotion/managPromotion")) breadcrumbs = ["Promotion", "Manager"];
    else if (path.includes("settings/profile"))         breadcrumbs = ["Settings", "Profile"];
    else {
      const segments = path.split("/").filter((p) => p !== "" && p !== "admin");
      breadcrumbs = segments.map((s) => nameMap[s] || s.charAt(0).toUpperCase() + s.slice(1));
    }

    return (
      <div className="hdr-center">
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className={isLast ? "hdr-crumb-last" : "hdr-crumb-parent"}>{crumb}</span>
              {!isLast && <ChevronRight size={13} className="hdr-crumb-sep" strokeWidth={2.5} />}
            </span>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getService("/admin/auth/myprofile");
        if (response?.data?.data) setAdmin(response.data.data);
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <style>{HEADER_CSS}</style>

      <header className="hdr-root hdr-bar">

        {/* Left: hamburger (mobile) + breadcrumbs (desktop) */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
          <button className="hdr-hamburger" onClick={onMenuClick} aria-label="Open menu">
            <Menu size={17} color={C.primary} />
          </button>
          {renderBreadcrumbs()}
        </div>

        {/* Right: home + name + divider + avatar */}
        <div className="hdr-right">

          {/* Home Button */}
          <Link to="/" className="hdr-home-link" aria-label="Go to Home">
            <Home size={16} />
          </Link>

          {/* Admin name + role */}
          <div className="hdr-admin-block">
            {loading ? (
              <>
                <div className="hdr-skeleton" style={{ height: 12, width: 110 }} />
                <div className="hdr-skeleton" style={{ height: 10, width: 70, marginTop: 3 }} />
              </>
            ) : (
              <>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text, lineHeight: 1, textTransform: "capitalize" }}>
                  {admin?.name || "Guest Admin"}
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, color: C.primary, textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1 }}>
                  {admin ? "Administrator" : "Not Logged In"}
                </span>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="hdr-divider" />

          {/* Avatar */}
          <Link to="/admin/settings/profile" className="hdr-avatar-link">
            {loading ? (
              <div className="hdr-skeleton" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
            ) : admin?.profileImage ? (
              <img src={admin.profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: C.tint10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UserCircle size={22} style={{ color: C.tint50 }} />
              </div>
            )}
          </Link>

        </div>
      </header>
    </>
  );
}