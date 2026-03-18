import React from "react";
import { Link } from "react-router-dom";

function TopTicker({ isMobile, isDesktop, C, gutter }) {
  if (isMobile) return null;

  return (
    <div style={{ background: C.primary, color: "#fff", fontSize: 11.5, padding: "5px 0" }}>
      <div
        style={{
          Width: "100%",
          margin: "0 auto",
          padding: `0 ${gutter}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Left Section */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", flex: 1 }}>
          <span
            style={{
              background: C.accent,
              color: "#fff",
              borderRadius: 3,
              padding: "1px 8px",
              fontWeight: 700,
              fontSize: 10,
              whiteSpace: "nowrap",
            }}
          >
            🔥 HOT
          </span>

          <div className="ticker-outer">
            <span className="ticker-inner">
              TCS BPS Hiring 2026 &nbsp;|&nbsp; Amazon WFH &nbsp;|&nbsp; Wipro NLTH 2026 &nbsp;|&nbsp;
              Infosys Systems Engineer &nbsp;|&nbsp; Google Internship 2026 &nbsp;|&nbsp;
              Deloitte Fresher Drive &nbsp;|&nbsp; Accenture Off Campus &nbsp;|&nbsp; Red Hat ASE 2026
            </span>
          </div>
        </div>

        {/* Right Section */}
{isDesktop && (
  <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
    {[
      { label: "About", path: "/about-us" },
      { label: "Contact", path: "/contact-us" },
      { label: "Privacy", path: "/privacy" }
    ].map((item) => (
      <Link
        key={item.label}
        to={item.path}
        style={{ color: "#c8d8ea", textDecoration: "none" }}
      >
        {item.label}
      </Link>
    ))}

    <Link
      to="/advertise-with-us"
      style={{ color: C.gold, fontWeight: 600, textDecoration: "none" }}
    >
      Advertise With Us
    </Link>
  </div>
)}
      </div>
    </div>
  );
}

export default TopTicker;