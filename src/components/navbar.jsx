import React, { useState, useRef } from "react";

// ✅ Default values (prevents crashes)
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
      { icon: "🎓", label: "Fresher Jobs", desc: "0–1 year experience" },
      { icon: "💼", label: "Experienced Jobs", desc: "2+ years experience" },
      { icon: "🏠", label: "Work From Home", desc: "Remote opportunities" },
      { icon: "⏰", label: "Part-Time Jobs", desc: "Flexible hours" },
      { icon: "🚀", label: "Urgent Hiring", desc: "Immediate joiners" },
      { icon: "🌍", label: "Abroad Jobs", desc: "International roles" },
    ],
  },
  {
    label: "Internships",
    dropdown: [
      { icon: "💰", label: "Paid Internships", desc: "Earn while you learn" },
      { icon: "📚", label: "Unpaid Internships", desc: "Build experience" },
      { icon: "🏠", label: "Remote Internships", desc: "Work from anywhere" },
      { icon: "🏢", label: "On-Site Internships", desc: "In-office roles" },
      { icon: "🎓", label: "Summer Internships", desc: "Short-term projects" },
      { icon: "📝", label: "Part-Time Internships", desc: "Alongside studies" },
    ],
  },
  { label: "About" },
  { label: "Contact" },
];

// ✅ Simple Hamburger Button
function HamburgerBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ fontSize: 20, cursor: "pointer", background: "none", border: "none" }}>
      ☰
    </button>
  );
}

// Dropdown panel
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
        animation: "dropFade .15s ease",
      }}
    >
      {/* small arrow */}
      <div
        style={{
          position: "absolute",
          top: -6,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: 12,
          height: 12,
          background: "#fff",
          borderTop: `1px solid ${C.border}`,
          borderLeft: `1px solid ${C.border}`,
          borderRadius: "2px 0 0 0",
        }}
      />
      {items.map((item) => (
        <a
          key={item.label}
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 7,
            textDecoration: "none",
            color: C.text,
            fontSize: 13,
            transition: "background .12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.light)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          <div>
            <div style={{ fontWeight: 600, color: C.primary, lineHeight: 1.3 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.desc}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

// Nav link with optional dropdown
function NavLink({ item, index }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const hasDropdown = !!item.dropdown;

  const show = () => { clearTimeout(timerRef.current); setOpen(true); };
  const hide = () => { timerRef.current = setTimeout(() => setOpen(false), 150); };

  return (
    <div style={{ position: "relative" }} onMouseEnter={show} onMouseLeave={hide}>
      <a
        href="#"
        style={{
          fontSize: 13,
          padding: "7px 11px",
          borderRadius: 7,
          color: index === 0 ? C.primary : C.text,
          background: index === 0 ? C.light : "transparent",
          display: "flex",
          alignItems: "center",
          gap: 4,
          textDecoration: "none",
        }}
      >
        {item.label}
        {hasDropdown && (
          <span
            style={{
              fontSize: 8,
              color: "#9ca3af",
              display: "inline-block",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .18s",
              marginTop: 1,
            }}
          >
            ▼
          </span>
        )}
      </a>
      {hasDropdown && open && <DropdownMenu items={item.dropdown} />}
    </div>
  );
}

function Navbar({ bp = {}, onMenuOpen = () => {} }) {
  const { isMobile = false, isTablet = false, isDesktop = true } = bp;

  return (
    <>
      <style>{`
        @keyframes dropFade {
          from { opacity: 0; transform: translateX(-50%) translateY(-5px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <nav
        style={{
          background: "#fff",
          borderBottom: `2px solid ${C.border}`,
          position: "sticky",
          top: 0,
          zIndex: 200,
          boxShadow: "0 2px 12px rgba(0,0,0,.07)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: isMobile ? "0 14px" : "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: isMobile ? 56 : 64,
          }}
        >
          {/* Brand */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <img src="https://res.cloudinary.com/dd3niyhrb/image/upload/v1773481829/WhatsApp_Image_2026-03-14_at_3.18.14_PM_o5drwx.jpg"
              alt="CodeTechniques Logo"
              style={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              borderRadius: 9,
              objectFit: "cover",
            }}
            />
            <span
              style={{
                fontWeight: 800,
                fontSize: isMobile ? 16 : isTablet ? 19 : 21,
                color: C.primary,
              }}
            >
              Code<span style={{ color: C.accent }}>Techniques</span>
            </span>
          </a>

          {/* Desktop */}
          {isDesktop && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {NAV_ITEMS.map((item, i) => (
                <NavLink key={item.label} item={item} index={i} />
              ))}
              <a
                href="#"
                style={{
                  background: C.accent,
                  color: "#fff",
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontWeight: 700,
                  marginLeft: 8,
                  textDecoration: "none",
                  fontSize: 13,
                }}
              >
                Post a Job
              </a>
            </div>
          )}

          {/* Tablet */}
          {isTablet && (
            <div style={{ display: "flex", gap: 10 }}>
              <a
                href="#"
                style={{
                  background: C.accent,
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Post a Job
              </a>
              <HamburgerBtn onClick={onMenuOpen} />
            </div>
          )}

          {/* Mobile */}
          {isMobile && <HamburgerBtn onClick={onMenuOpen} />}
        </div>
      </nav>
    </>
  );
}

export default Navbar;