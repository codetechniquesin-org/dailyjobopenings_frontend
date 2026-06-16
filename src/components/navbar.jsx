import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

const C = {
  primary: "#0a2540",
  accent: "#ff4d4f",
  border: "#e5e7eb",
  text: "#374151",
  light: "#f3f4f6",
};

// ── Exact Devin.ai frosted glass values ──────────────────────
const GLASS_BG = "#ffffff";
const GLASS_BLUR = "blur(28px)";
const GLASS_BORDER = "1px solid #e5e7eb";
const GLASS_SHADOW = "0 1px 3px rgba(0,0,0,0.06)";

// Dropdown slightly stronger for readability
const DROPDOWN_BG = "rgba(255,255,255,0.88)";

const NAV_ITEMS = [
  { label: "Home", page: "home" },
  {
    label: "Jobs",
    dropdown: [
      { label: "Fresher Jobs", key: "fresher" },
      { label: "Experienced Jobs", key: "experienced" },
      { label: "Work From Home", key: "remote" },
      { label: "Part-Time Jobs", key: "part-time" },
      { label: "Urgent Hiring", key: "urgent" },
      { label: "Abroad Jobs", key: "abroad" },
    ],
  },
  { label: "Walk in Drive", page: "walk-in-drive" },
  {
    label: "Internships",
    dropdown: [
      { label: "IT Internships", key: "it-internship" },
      { label: "GOVT Internships", key: "govt-internship" },
    ],
  },
  { label: "Exams", page: "user/view-exams" },
  { label: "Courses", page: "users/view-courses" },
  { label: "Resources", page: "resources" },
  { label: "Resume Builder", page: "resume", external: "https://resumes-by-hirely.onrender.com/" },
];

/* ── Desktop Dropdown ─────────────────────────────────────── */
function DropdownMenu({ items, position }) {
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",

        background: "rgba(255, 255, 255, 0.16)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",

        borderRadius: 18,
        padding: "6px 8px",
        minWidth: 180,
        zIndex: 9999,
        overflow: "hidden",
        alginItems: "center"
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
            borderRadius: 12,
            textDecoration: "none",
            color: C.primary,
            fontWeight: 500,
            fontSize: 13,

            transition:
              "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: "translateY(0px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "rgba(255,255,255,0.12)";
            e.currentTarget.style.transform =
              "translateX(4px)";
            e.currentTarget.style.backdropFilter =
              "blur(10px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "transparent";
            e.currentTarget.style.transform =
              "translateX(0px)";
          }}
        >
          {item.label}
        </Link>
      ))}
    </div>,
    document.body
  );
}
/* ── Desktop Nav Link ─────────────────────────────────────── */
function NavLink({ item, index, activePage }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const hasDropdown = !!item.dropdown;
  const isActive = item.page && activePage === item.page;
  const triggerRef = useRef(null);
  const [position, setPosition] = useState(null);

  const show = () => {
    clearTimeout(timerRef.current);

    const rect = triggerRef.current.getBoundingClientRect();

    setPosition({
      left: rect.left + rect.width / 2,
      top: rect.bottom + 15,
    });

    setOpen(true);
  };
  const hide = () => { timerRef.current = setTimeout(() => setOpen(false), 150); };

  const linkStyle = {
    fontSize: 14,
    padding: "7px 11px",
    borderRadius: 7,
    color: isActive ? C.accent : index === 0 ? C.primary : C.text,
    background: isActive
      ? "rgba(255,77,79,0.10)"
      : index === 0
        ? "rgba(243,244,246,0.60)"
        : "transparent",
    display: "flex",
    alignItems: "center",
    gap: 6,
    textDecoration: "none",
    fontWeight: isActive ? 700 : 500,
    transition: "background 0.15s ease",
  };

  return (
    <div
      ref={triggerRef}
      style={{ position: "relative" }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {item.external ? (
        <a href={item.external} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          {item.label}
        </a>
      ) : (
        <Link
          to={item.page ? (item.page === "home" ? "/" : `/${item.page}`) : "#"}
          style={linkStyle}
        >
          {item.label}
          {hasDropdown && (
            <span style={{
              fontSize: 8,
              color: "#000",
              marginTop: 1,
              display: "inline-block",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}>▼</span>
          )}
        </Link>
      )}
      {hasDropdown && open && <DropdownMenu items={item.dropdown} position={position} />}
    </div>
  );
}

/* ── Apply with AI Button (kept as-is, currently empty) ──── */
function ApplyWithAIButton({ fullWidth = false }) {
  return (
    <style>{`
      @keyframes shimmer {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
@keyframes dropdownIn {
  from {
    opacity: 0;
    transform:
      translateX(-50%)
      translateY(-10px)
      scale(0.96);
  }

  to {
    opacity: 1;
    transform:
      translateX(-50%)
      translateY(0)
      scale(1);
  }
}
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}

/* ── Mobile Accordion Item ────────────────────────────────── */
function MobileNavItem({ item, closeMenu }) {
  const [expanded, setExpanded] = useState(false);
  const hasDropdown = !!item.dropdown;

  // Each mobile row also gets glass so the whole drawer is frosted
const rowStyle = {
  display: "flex",
  padding: "13px 20px",
  color: C.primary,
  borderBottom: "1px solid rgba(0,0,0,0.07)",
  background: "transparent",
  textDecoration: "none",
  fontSize: 15,
  fontWeight: 500,
};

  return (
    <div>
      {hasDropdown ? (
        <div
          onClick={() => setExpanded((v) => !v)}
          style={{ ...rowStyle, alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        >
          {item.label}
          <span style={{
            fontSize: 10,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s",
          }}>▼</span>
        </div>
      ) : item.external ? (
        <a href={item.external} target="_blank" rel="noopener noreferrer" onClick={() => {
          closeMenu();
        }} style={rowStyle}>
          {item.label}
        </a>
      ) : (
        <Link to={item.page === "home" ? "/" : `/${item.page}`} onClick={closeMenu} style={rowStyle}>
          {item.label}
        </Link>
      )}

      {hasDropdown && expanded && (
        // Sub-items: slightly darker frosted layer for depth
<div style={{
  background: "rgba(255,255,255,0.12)",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
}}>
          {item.dropdown.map((sub) => (
            <Link
              key={sub.key}
              to={`/jobs/categories/${sub.key}`}
              onClick={closeMenu}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 32px",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(229,231,235,0.40)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: C.primary,
                    fontSize: 13,
                  }}
                >
                  {sub.label}
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
function Navbar({
  bp,
  onNavigate = () => { },
  activePage = "",
  sticky: isSticky = false,
  navOffset = 0
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const drawerRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target) &&
        !e.target.closest("button")
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
      {/* Keyframe animations injected once */}
      <ApplyWithAIButton />

      <style>{`
        .ct-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.15);
          z-index: 90;
        }
        /* Mobile drawer — same frosted glass as the navbar */
       // REPLACE WITH:
.ct-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-top: ${GLASS_BORDER};
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
  z-index: 998;
  max-height: 100vh;
  overflow-y: auto;
  animation: slideDown .22s ease;
  padding-top: 64px;
}
      `}</style>

      {menuOpen && (
        <div className="ct-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <nav
        style={{
          // ── Devin.ai frosted glass — semi-transparent + heavy blur ──
background: menuOpen ? "rgba(255,255,255,0.18)" : isSticky ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.95)",
backdropFilter: GLASS_BLUR,
WebkitBackdropFilter: GLASS_BLUR,
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          // ─────────────────────────────────────────────────────────────
position: isSticky ? "fixed" : "relative",
top: isSticky ? 0 : "auto",
left: 0,
right: 0,
zIndex: menuOpen ? 999 : 1000,
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
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}
          >
            <img src="/favicon.svg" alt="Logo" style={{ width: 65, height: 65, borderRadius: 9 }} />
            <span style={{ fontWeight: 800, color: C.primary, fontSize: 15 }}>
              Daily<span style={{ color: C.accent }}>Job Openings</span>
            </span>
          </Link>

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
            </div>
          )}

          {/* Hamburger */}
          {!isDesktop && (
            <button className="hamburger-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{
                width: 42,
                height: 42,
                borderRadius: 9,
                background: menuOpen ? "rgba(243,244,246,0.70)" : "transparent",
                border: `1.5px solid ${menuOpen ? "rgba(229,231,235,0.80)" : "transparent"}`,
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
              <span style={{
                display: "block", width: 20, height: 2.5,
                background: C.primary, borderRadius: 2,
                transition: "transform .25s ease",
                transform: menuOpen ? "translateY(7.5px) rotate(45deg)" : "none",
              }} />
              <span style={{
                display: "block", width: 20, height: 2.5,
                background: C.primary, borderRadius: 2,
                transition: "opacity .2s ease",
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                display: "block", width: 20, height: 2.5,
                background: C.primary, borderRadius: 2,
                transition: "transform .25s ease",
                transform: menuOpen ? "translateY(-7.5px) rotate(-45deg)" : "none",
              }} />
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
            <div style={{
              padding: "16px 20px",
              borderTop: "1px solid rgba(229,231,235,0.50)",
            }} />
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
