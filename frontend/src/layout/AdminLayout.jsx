import { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

const RESET_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root      { height: 100%; width: 100%; overflow: hidden; }
  body                   { margin: 0; padding: 0; }
`;

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style>{RESET_CSS}</style>

      <div style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background: "#faf9f8",
        overflow: "hidden",
        position: "fixed",
        inset: 0,
      }}>

        {/* Sidebar — on desktop: flex column; on mobile: fixed drawer overlay */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Right column */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
          height: "100%",
        }}>

          <div style={{ flexShrink: 0 }}>
            <Header onMenuClick={() => setSidebarOpen(true)} />
          </div>

          <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {children}
          </main>

        </div>
      </div>
    </>
  );
}