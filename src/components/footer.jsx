import React from "react";
import Select from "react-select";
import JobAlertSubscribe from "./common_components/job_alert";

// ✅ Default colors (prevents crash if not passed)
const defaultColors = {
  primary: "#0a2540",
  accent: "#ff4d4f",
};

function Footer({ bp = {}, gutter = "16px", C = defaultColors }) {
  const { isMobile = false, isTablet = false, isDesktop = true } = bp;

  return (
    <footer
      style={{
        background: "#0d1b2a",
        color: "#c8d6e5",
        padding: isMobile ? "32px 0 24px" : "48px 0 24px",
      }}
    >
      <div style={{ Width: "100%", margin: "0 auto", padding: `0 ${gutter}` }}>
        
        {/* Top Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "1.5fr 1fr 1fr"
              : "2fr 1fr 1fr 1fr",
            gap: isMobile ? 24 : 28,
            marginBottom: 28,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
            <img
            src="/favicon.svg"
            alt="Logo"
            style={{
              width: isMobile ? 32 : 50,
              height: isMobile ? 32 : 50,
              borderRadius: 9,
            }}
          /> 

              <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>
                Daily<span style={{ color: C.accent }}>Job Openings</span>
              </span>
            </div>

            <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.7, marginBottom: 16 }}>
              India's most trusted job portal for freshers & recent graduates.
              100% verified job postings updated daily.
            </p>

            {/* Email */}
<JobAlertSubscribe />
          </div>

          {/* Desktop & Tablet Links */}
          {!isMobile && (
            <>
              <div>
                <h6 style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                  Fresher Jobs
                </h6>
                {["2026 Batch Jobs", "2025 Batch Jobs", "Software/IT Jobs", "Government Jobs"].map((l) => (
                  <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "#8a9bb5", marginBottom: 7 }}>
                    {l}
                  </a>
                ))}
              </div>

              <div>
                <h6 style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                  Resources
                </h6>
                {["Interview Questions", "Resume Tips", "Off Campus Alerts"].map((l) => (
                  <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "#8a9bb5", marginBottom: 7 }}>
                    {l}
                  </a>
                ))}
              </div>

              {isDesktop && (
                <div>
                  <h6 style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                    Company
                  </h6>
                  {["About Us", "Contact Us", "Privacy Policy"].map((l) => (
                    <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "#8a9bb5", marginBottom: 7 }}>
                      {l}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Mobile */}
          {isMobile && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <h6 style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                  Jobs
                </h6>
                {["2026 Batch", "Software", "Govt Jobs"].map((l) => (
                  <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "#8a9bb5", marginBottom: 6 }}>
                    {l}
                  </a>
                ))}
              </div>

              <div>
                <h6 style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                  Company
                </h6>
                {["About", "Contact", "Privacy"].map((l) => (
                  <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "#8a9bb5", marginBottom: 6 }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid #1e3047",
            paddingTop: 14,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 11.5, opacity: 0.5 }}>
            © 2026 CodeTechniques India. All rights reserved.
          </p>

          <div style={{ display: "flex", gap: 14 }}>
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 11.5, color: "#8a9bb5" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;