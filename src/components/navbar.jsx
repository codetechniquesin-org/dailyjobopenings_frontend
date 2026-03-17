import React from "react";

// ✅ Default values (prevents crashes)
const C = {
  primary: "#0a2540",
  accent: "#ff4d4f",
  border: "#e5e7eb",
  text: "#374151",
  light: "#f3f4f6",
};

const NAV_LINKS = ["Home", "Jobs", "Internships", "About", "Contact"];

// ✅ Simple Hamburger Button
function HamburgerBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ fontSize: 20, cursor: "pointer", background: "none", border: "none" }}>
      ☰
    </button>
  );
}

function Navbar({ bp = {}, onMenuOpen = () => {} }) {
  const { isMobile = false, isTablet = false, isDesktop = true } = bp;

  return (
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
          <div
            style={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              borderRadius: 9,
              background: C.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: isMobile ? 13 : 15,
              color: "#fff",
            }}
          >
            CT
          </div>

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
            {NAV_LINKS.map((item, i) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: 13,
                  padding: "7px 11px",
                  borderRadius: 7,
                  color: i === 0 ? C.primary : C.text,
                  background: i === 0 ? C.light : "transparent",
                }}
              >
                {item}
              </a>
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
  );
}

export default Navbar;