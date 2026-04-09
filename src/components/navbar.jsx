import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const C = {
  primary: "#0a2540",
  accent: "#ff4d4f",
  border: "#e5e7eb",
  text: "#374151",
  light: "#f3f4f6",
};

const NAV_ITEMS = [
  { label: "Home" },
  {
    label: "Jobs",
    dropdown: [
      { icon: "🎓", label: "Fresher Jobs", key: "fresher", desc: "0–1 year experience" },
      { icon: "💼", label: "Experienced Jobs", key: "experienced", desc: "2+ years experience" },
      { icon: "🏠", label: "Work From Home", key: "remote", desc: "Remote opportunities" },
      { icon: "⏰", label: "Part-Time Jobs", key: "part-time", desc: "Flexible hours" },
      { icon: "🚀", label: "Urgent Hiring", key: "urgent", desc: "Immediate joiners" },
      { icon: "🌍", label: "Abroad Jobs", key: "abroad", desc: "International roles" },
    ],
  },
  { label: "Walk in Drive" },
  {
    label: "Internships",
    dropdown: [
      { icon: "💰", label: "IT Internships", key: "it-internship", desc: "Earn while you learn" },
      { icon: "📚", label: "GOVT Internships", key: "govt-internship", desc: "Build experience" },
    ],
  },
  { label: "interview Questions" , page: "interview-questions" },
  { label: "Resources", page: "resources" },
  { label: "Resume Builder", page: "resume", external: "https://resumecraft.site" },
];

/* ── Desktop Dropdown ─────────────────────────────────────── */

function DropdownMenu({ items }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,.10)",
        padding: "6px",
        minWidth: 240,
        zIndex: 999,
      }}
    >
      {items.map((item) => (
        <Link
          key={item.key}
          to={`/jobs/categories/${item.key}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 7,
            textDecoration: "none",
            color: C.text,
            fontSize: 13,
          }}
        >
          <span>{item.icon}</span>

          <div>
            <div style={{ fontWeight: 600, color: C.primary }}>
              {item.label}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>
              {item.desc}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Desktop Nav Link ─────────────────────────────────────── */
function NavLink({ item, index, onNavigate, activePage }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const hasDropdown = !!item.dropdown;
  const isActive = item.page && activePage === item.page;

  const show = () => { clearTimeout(timerRef.current); setOpen(true); };
  const hide = () => { timerRef.current = setTimeout(() => setOpen(false), 150); };

  const handleClick = (e) => {
    if (item.page) {
      e.preventDefault();
      if (item.external) {
        window.open(item.external, "_blank", "noopener,noreferrer");
      } else if (onNavigate) {
        onNavigate(item.page);
      }
    }
  };

  return (
    <div style={{ position: "relative" }} onMouseEnter={show} onMouseLeave={hide}>
      <a
        href={item.external || "#"}
        onClick={handleClick}
        style={{
          fontSize: 13,
          padding: "7px 11px",
          borderRadius: 7,
          color: isActive ? C.accent : index === 0 ? C.primary : C.text,
          background: isActive ? "#fff0f0" : index === 0 ? C.light : "transparent",
          display: "flex",
          alignItems: "center",
          gap: 4,
          textDecoration: "none",
          fontWeight: isActive ? 700 : 500,
          borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
          transition: "color .15s",
        }}
      >
        {item.label}
        {hasDropdown && <span style={{ fontSize: 8 }}>▼</span>}
      </a>
      {hasDropdown && open && <DropdownMenu items={item.dropdown} />}
    </div>
  );
}

/* ── Apply with AI Button ─────────────────────────────────── */
function ApplyWithAIButton({ fullWidth = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          marginLeft: fullWidth ? 0 : 8,
          padding: fullWidth ? "13px 0" : "8px 18px",
          width: fullWidth ? "100%" : "auto",
          borderRadius: 50,
          border: "none",
          fontSize: fullWidth ? 14 : 12,
          fontWeight: 800,
          cursor: "pointer",
          letterSpacing: 0.4,
          color: "#fff",
          background: hovered
            ? "linear-gradient(135deg, #ff4d4f 0%, #ff8c00 30%, #a855f7 60%, #3b82f6 100%)"
            : "#1e293b",
          boxShadow: hovered
            ? "0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(255,77,79,0.25)"
            : "0 2px 8px rgba(0,0,0,.15)",
          transform: hovered ? "scale(1.03)" : "scale(1)",
          transition: "background 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease",
          position: "relative",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {hovered && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
              animation: "shimmer 1.2s infinite",
            }}
          />
        )}
        <span style={{ position: "relative", zIndex: 1000 }}>✨ Apply with AI</span>
      </button>
    </>
  );
}

/* ── Mobile Accordion Item ────────────────────────────────── */
function MobileNavItem({ item, onNavigate, closeMenu }) {
  const [expanded, setExpanded] = useState(false);
  const hasDropdown = !!item.dropdown;

  const handleClick = (e) => {
    e.preventDefault();
    if (hasDropdown) {
      setExpanded((v) => !v);
    } else if (item.external) {
      window.open(item.external, "_blank", "noopener,noreferrer");
      closeMenu();
    } else if (item.page && onNavigate) {
      onNavigate(item.page);
      closeMenu();
    } else {
      closeMenu();
    }
  };

  return (
    <div>
      <a
        href="#"
        onClick={handleClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 20px",
          fontSize: 14,
          fontWeight: 600,
          color: C.primary,
          textDecoration: "none",
          borderBottom: `1px solid ${C.border}`,
          background: "#fff",
        }}
      >
        {item.label}
        {hasDropdown && (
          <span
            style={{
              fontSize: 10,
              display: "inline-block",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .2s",
            }}
          >
            ▼
          </span>
        )}
      </a>

{hasDropdown && expanded && (
  <div style={{ background: "#f9fafb", borderBottom: `1px solid ${C.border}` }}>
    {item.dropdown.map((sub) => (
      <Link
        key={sub.key}
        to={`/jobs/categories/${sub.key}`}
        onClick={closeMenu}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 32px",
            cursor: "pointer",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <span style={{ fontSize: 18 }}>{sub.icon}</span>

          <div>
            <div
              style={{
                fontWeight: 600,
                color: C.primary,
                fontSize: 13,
              }}
            >
              {sub.label}
            </div>

            <div style={{ fontSize: 11, color: "#9ca3af" }}>
              {sub.desc}
            </div>
          </div>
        </div>
      </Link>
    ))}
  </div>
)}
    </div>
  );
}

/* ── Navbar ───────────────────────────────────────────────── */
function Navbar({ onNavigate = () => {}, activePage = "" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close on outside click
  const drawerRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
      <style>{`
        .ct-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.25);
          z-index: 198;
          backdrop-filter: blur(2px);
        }
        .ct-drawer {
          position: absolute;
          top: 100%; left: 0; right: 0;
          background: #fff;
          border-top: 1px solid ${C.border};
          box-shadow: 0 16px 40px rgba(0,0,0,.13);
          z-index: 199;
          max-height: calc(100vh - 64px);
          overflow-y: auto;
          animation: slideDown .22s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {menuOpen && (
        <div className="ct-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <nav
        style={{
          background: "#fff",
          borderBottom: `2px solid ${C.border}`,
          position: "sticky",
          top: 0,
          zIndex: 200,
        }}
      >
        <div
          style={{
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {/* Brand */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate("home"); setMenuOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}
          >
            <img
              src="https://res.cloudinary.com/dd3niyhrb/image/upload/v1773481829/WhatsApp_Image_2026-03-14_at_3.18.14_PM_o5drwx.jpg"
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: 9 }}
            />
            <span style={{ fontWeight: 800, color: C.primary, fontSize: 15 }}>
              Daily<span style={{ color: C.accent }}>Job Openings</span>
            </span>
          </a>

          {/* Desktop Links */}
          {isDesktop && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {NAV_ITEMS.map((item, i) => (
                <NavLink
                  key={item.label}
                  item={item}
                  index={i}
                  onNavigate={onNavigate}
                  activePage={activePage}
                />
              ))}
              <ApplyWithAIButton />
            </div>
          )}

          {/* Hamburger Button */}
          {!isDesktop && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{
                width: 42,
                height: 42,
                borderRadius: 9,
                background: menuOpen ? C.light : "transparent",
                border: `1.5px solid ${menuOpen ? C.border : "transparent"}`,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: 0,
                transition: "background .2s, border-color .2s",
              }}
            >
              <span
                style={{
                  display: "block", width: 20, height: 2.5,
                  background: C.primary, borderRadius: 2,
                  transition: "transform .25s ease",
                  transform: menuOpen ? "translateY(7.5px) rotate(45deg)" : "none",
                }}
              />
              <span
                style={{
                  display: "block", width: 20, height: 2.5,
                  background: C.primary, borderRadius: 2,
                  transition: "opacity .2s ease",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block", width: 20, height: 2.5,
                  background: C.primary, borderRadius: 2,
                  transition: "transform .25s ease",
                  transform: menuOpen ? "translateY(-7.5px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          )}
        </div>

        {/* Mobile Drawer */}
        {!isDesktop && menuOpen && (
          <div className="ct-drawer" ref={drawerRef}>
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.label}
                item={item}
                onNavigate={onNavigate}
                closeMenu={() => setMenuOpen(false)}
              />
            ))}
            <div style={{ padding: "16px 20px", borderTop: `2px solid ${C.border}` }}>
              <ApplyWithAIButton fullWidth />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;