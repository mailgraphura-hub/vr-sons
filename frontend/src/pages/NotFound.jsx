import bgImage from "../assets/notFound.jpeg";

function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      color: "#fff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .btn-404 {
          width: 240px;
          padding: 18px 0;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          border: 2px solid #fff;
          transition: background 0.25s, color 0.25s;
        }
        .btn-filled {
          background: #111;
          color: #fff;
        }
        .btn-filled:hover { background: #fff; color: #111; }

        .btn-outline {
          background: #fff;
          color: #111;
        }
        .btn-outline:hover { background: transparent; color: #fff; }
      `}</style>

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.65) 100%)",
        zIndex: 0,
      }} />

      {/* ── HEADER — VR & SONS ── */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", textAlign: "center", paddingTop: "36px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "16px" }}>
          <div style={{ height: "1px", width: "60px", background: "rgba(255,255,255,0.4)" }} />
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(25px, 2.2vw, 22px)",
            letterSpacing: "0.4em",
            color: "#fff",
            textTransform: "uppercase",
          }}>
            VR &amp; Sons
          </h1>
          <div style={{ height: "1px", width: "60px", background: "rgba(255,255,255,0.4)" }} />
        </div>
        {/* Underline */}
        <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", marginTop: "16px" }} />
      </div>

      {/* ── CENTER CONTENT ── */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 20px" }}>

        {/* Big 404 */}
        <div style={{
          fontWeight: 700,
          fontSize: "clamp(130px, 22vw, 220px)",
          lineHeight: 0.9,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          userSelect: "none",
        }}>
          404
        </div>

        {/* Divider */}
        <div style={{
          width: "120px", height: "1px",
          background: "rgba(255,255,255,0.4)",
          margin: "20px auto 22px",
        }} />

        {/* Description */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "clamp(13px, 1.5vw, 16px)",
          color: "rgba(255,255,255,0.82)",
          lineHeight: 1.85,
          maxWidth: "500px",
          margin: "0 auto 44px",
          fontWeight: 400,
        }}>
          The page you are looking for does not exist.<br />
          It might have been moved or removed.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-404 btn-filled" onClick={() => window.location.href = "/"}>
            Back to Home
          </button>
          <button className="btn-404 btn-outline" onClick={() => window.location.href = "/contact"}>
            Contact Support
          </button>
        </div>
      </div>

      {/* Bottom spacer */}
      <div style={{ height: "60px", position: "relative", zIndex: 10 }} />
    </div>
  );
}

export default NotFound;