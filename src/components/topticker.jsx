import React from "react";

function TopTicker({ isMobile, isDesktop, C, gutter }) {
  if (isMobile) return null;

  return (
    <div style={{ background: C.primary, color: "#fff", fontSize: 11.5, padding: "5px 0" }}>
      <div
        style={{
          maxWidth: 1280,
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
            {["About", "Contact", "Privacy"].map((l) => (
              <a key={l} href="#" style={{ color: "#c8d8ea" }}>
                {l}
              </a>
            ))}
            <a href="#" style={{ color: C.gold, fontWeight: 600 }}>
              Advertise With Us
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopTicker;