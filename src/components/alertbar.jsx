import React from "react";

// ✅ Default colors (safe fallback)
const defaultColors = {
  accent: "#ff4d4f",
};

function AlertBar({ isMobile = false, C = defaultColors }) {
  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${C.accent}, #c0392b)`,
        color: "#fff",
        textAlign: "center",
        padding: isMobile ? "8px 12px" : "9px 16px",
        fontSize: isMobile ? 11.5 : 13,
      }}
    >
      🎉 New jobs added today from Amazon, TCS, Infosys & more!&nbsp;
      
      <a
        href="#"
        style={{
          color: "#fff",
          textDecoration: "underline",
          fontWeight: 600,
        }}
      >
        View Latest →
      </a>
    </div>
  );
}

export default AlertBar;