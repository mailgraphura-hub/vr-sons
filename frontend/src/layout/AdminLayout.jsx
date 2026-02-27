import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

// ── Global reset: removes browser default body/html margin & padding ──────────
const RESET_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root      { height: 100%; width: 100%; overflow: hidden; }
  body                   { margin: 0; padding: 0; }
`;

export default function AdminLayout({ children }) {
  return (
    <>
      <style>{RESET_CSS}</style>

      <div style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background: "#faf9f8",
        overflow: "hidden",
        position: "fixed",  /* anchors flush to viewport — eliminates any scroll-offset gap */
        inset: 0,
      }}>

        {/* Sidebar — fixed width, full height, never shrinks */}
        <Sidebar />

        {/* Right column — header pinned + scrollable content below */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
          height: "100%",
        }}>

          {/* flexShrink:0 pins the header — NO sticky needed here */}
          <div style={{ flexShrink: 0 }}>
            <Header />
          </div>

          {/* Only this area scrolls */}
          <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {children}
          </main>

        </div>
      </div>
    </>
  );
}