import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/admin/dashboard",                   label: "Dashboard"           },
  { to: "/admin/manage-jobs",                 label: "Manage Jobs"         },
  { to: "/admin/manage-admins",               label: "Manage Admins",       superOnly: true },
  { to: "/admin/manage-resources",            label: "Resources"           },
  { to: "/admin/manage-interview-questions",  label: "Courses"        },
];

export default function AdminNavbar() {
  const navigate       = useNavigate();
  const location       = useLocation();
  const admin          = JSON.parse(localStorage.getItem("adminInfo") || "{}");
  const [open, setOpen] = useState(false);
  const drawerRef      = useRef(null);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  /* close drawer on route change */
  useEffect(() => { setOpen(false); }, [location.pathname]);

  /* close on outside click */
  useEffect(() => {
    const handler = e => {
      if (open && drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isSuperAdmin = admin?.role === "super_admin";
  const visibleLinks = LINKS.filter(l => !l.superOnly || isSuperAdmin);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes navIn   { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drawerIn{ from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }

        /* ── Desktop pill nav ── */
        .an-pill {
          pointer-events: all;
          display: flex; align-items: center; gap: 2px;
          background: rgba(30,13,38,.72);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
          border: 1px solid rgba(237,226,208,.12);
          border-radius: 9999px;
          padding: 6px 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,.28), inset 0 1px 0 rgba(237,226,208,.07);
          animation: navIn .4s cubic-bezier(.16,1,.3,1);
        }

        .an-link {
          position: relative; padding: 7px 15px; border-radius: 9999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 500;
          color: rgba(237,226,208,.6); text-decoration: none;
          transition: color .2s, background .2s; white-space: nowrap;
        }
        .an-link:hover  { color: #EDE2D0; background: rgba(237,226,208,.1); }
        .an-link.active { color: #EDE2D0; background: rgba(237,226,208,.14); box-shadow: inset 0 0 0 1px rgba(237,226,208,.18); }

        .an-sep { width: 1px; height: 20px; background: rgba(237,226,208,.12); margin: 0 4px; flex-shrink: 0; }

        .an-badge {
          font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 9999px;
          letter-spacing: .08em; white-space: nowrap;
        }
        .an-badge.super { background: rgba(194,175,151,.2); color: #C2AF97; border: 1px solid rgba(194,175,151,.3); }
        .an-badge.admin { background: rgba(123,74,139,.2);  color: #B89AC8; border: 1px solid rgba(123,74,139,.3); }

        .an-logout {
          padding: 7px 18px; border-radius: 9999px;
          border: 1px solid rgba(237,226,208,.18);
          background: rgba(237,226,208,.07);
          color: rgba(237,226,208,.65);
          font-size: 12.5px; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all .2s;
        }
        .an-logout:hover { background: rgba(220,38,38,.2); border-color: rgba(220,38,38,.35); color: #fca5a5; }

        /* ── Hamburger button ── */
        .an-burger {
          display: none; flex-direction: column; justify-content: center;
          gap: 5px; width: 40px; height: 40px; border-radius: 10px;
          background: rgba(30,13,38,.72); border: 1px solid rgba(237,226,208,.15);
          cursor: pointer; padding: 10px; flex-shrink: 0;
          backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
        }
        .an-burger span {
          display: block; height: 1.5px; background: rgba(237,226,208,.8);
          border-radius: 2px; transition: all .25s cubic-bezier(.4,0,.2,1);
          transform-origin: center;
        }
        .an-burger.open span:nth-child(1){ transform: translateY(6.5px) rotate(45deg); }
        .an-burger.open span:nth-child(2){ opacity: 0; transform: scaleX(0); }
        .an-burger.open span:nth-child(3){ transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile top bar ── */
        .an-mobile-bar {
          display: none; pointer-events: all;
          align-items: center; justify-content: space-between;
          background: rgba(30,13,38,.78);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
          border: 1px solid rgba(237,226,208,.12);
          border-radius: 14px;
          padding: 8px 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,.28);
          animation: navIn .4s cubic-bezier(.16,1,.3,1);
          width: 100%;
        }

        /* ── Drawer overlay ── */
        .an-overlay {
          position: fixed; inset: 0; background: rgba(30,13,38,.55);
          z-index: 149; animation: fadeIn .22s ease;
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
        }

        /* ── Drawer panel ── */
        .an-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(300px, 85vw); z-index: 150;
          background: #2A1033;
          border-left: 1px solid rgba(237,226,208,.1);
          display: flex; flex-direction: column;
          animation: drawerIn .3s cubic-bezier(.16,1,.3,1);
          box-shadow: -12px 0 40px rgba(0,0,0,.35);
        }
        .an-drawer-hdr {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(237,226,208,.08);
        }
        .an-drawer-link {
          display: flex; align-items: center;
          padding: 13px 20px; font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          color: rgba(237,226,208,.6); text-decoration: none;
          border-left: 3px solid transparent;
          transition: color .2s, background .2s, border-color .2s;
        }
        .an-drawer-link:hover  { color: #EDE2D0; background: rgba(237,226,208,.06); }
        .an-drawer-link.active { color: #EDE2D0; background: rgba(237,226,208,.09); border-left-color: #7B4A8B; }

        .an-close-btn {
          width: 32px; height: 32px; border-radius: 8px; border: none;
          background: rgba(237,226,208,.08); color: rgba(237,226,208,.6);
          font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background .2s;
        }
        .an-close-btn:hover { background: rgba(237,226,208,.14); color: #EDE2D0; }

        /* ── Responsive breakpoints ── */
        @media (max-width: 900px) {
          .an-pill        { display: none !important; }
          .an-mobile-bar  { display: flex !important; }
          .an-burger      { display: flex !important; }
        }
        @media (min-width: 901px) {
          .an-mobile-bar  { display: none !important; }
          .an-burger      { display: none !important; }
          .an-overlay     { display: none !important; }
          .an-drawer      { display: none !important; }
        }
      `}</style>

      {/* ── Fixed wrapper ── */}
      <div style={{ position: "fixed", top: 14, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center", padding: "0 16px", pointerEvents: "none" }}>

        {/* ── Desktop pill nav ── */}
        <nav className="an-pill">
          {/* Brand */}
          <span style={{ fontFamily: "'Cormorant Garamond',serif", color: "#EDE2D0", fontWeight: 500, fontSize: 16, padding: "4px 14px", marginRight: 2, letterSpacing: "1px", whiteSpace: "nowrap" }}>
            Apex <em style={{ fontWeight: 300, fontStyle: "italic", color: "#C2AF97" }}>Admin</em>
          </span>

          <span className="an-sep" />

          {visibleLinks.map(l => (
            <Link key={l.to} to={l.to} className={`an-link ${location.pathname === l.to ? "active" : ""}`}>
              {l.label}
            </Link>
          ))}

          <span className="an-sep" />

          <span className={`an-badge ${isSuperAdmin ? "super" : "admin"}`}>
            {isSuperAdmin ? "SUPER" : "ADMIN"}
          </span>

          <button className="an-logout" onClick={logout} style={{ marginLeft: 4 }}>Logout</button>
        </nav>

        {/* ── Mobile top bar ── */}
        <div className="an-mobile-bar">
          <span style={{ fontFamily: "'Cormorant Garamond',serif", color: "#EDE2D0", fontWeight: 500, fontSize: 17, letterSpacing: "1px" }}>
            Apex <em style={{ fontWeight: 300, fontStyle: "italic", color: "#C2AF97" }}>Admin</em>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className={`an-badge ${isSuperAdmin ? "super" : "admin"}`}>
              {isSuperAdmin ? "SUPER" : "ADMIN"}
            </span>
            <button className={`an-burger ${open ? "open" : ""}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 72 }} />

      {/* ── Drawer overlay ── */}
      {open && <div className="an-overlay" onClick={() => setOpen(false)} />}

      {/* ── Drawer panel ── */}
      {open && (
        <div className="an-drawer" ref={drawerRef}>
          <div className="an-drawer-hdr">
            <span style={{ fontFamily: "'Cormorant Garamond',serif", color: "#EDE2D0", fontWeight: 500, fontSize: 18, letterSpacing: "1px" }}>
              Apex <em style={{ fontWeight: 300, fontStyle: "italic", color: "#C2AF97" }}>Admin</em>
            </span>
            <button className="an-close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Links */}
          <nav style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
            {visibleLinks.map(l => (
              <Link key={l.to} to={l.to} className={`an-drawer-link ${location.pathname === l.to ? "active" : ""}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(237,226,208,.08)" }}>
            <div style={{ fontSize: 12, color: "rgba(237,226,208,.4)", marginBottom: 12, letterSpacing: "0.5px" }}>
              {admin?.email || "admin"}
            </div>
            <button onClick={logout}
              style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "1px solid rgba(237,226,208,.15)", background: "rgba(237,226,208,.07)", color: "rgba(237,226,208,.7)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .2s", letterSpacing: "0.3px" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,.18)"; e.currentTarget.style.color = "#fca5a5"; e.currentTarget.style.borderColor = "rgba(220,38,38,.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(237,226,208,.07)"; e.currentTarget.style.color = "rgba(237,226,208,.7)"; e.currentTarget.style.borderColor = "rgba(237,226,208,.15)"; }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}