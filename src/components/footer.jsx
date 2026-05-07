import React from "react";
import Select from "react-select";
import {Link} from "react-router-dom";
import JobAlertSubscribe from "./common_components/job_alert";
import About from "../user_pages/about";
import Contact from "../user_pages/contactus";
import Privacy from "../user_pages/privacy";

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
      <div style={{ width: "100%", margin: "0 auto", padding: `0 ${gutter}` }}>

        {/* Top Section: Left = Brand + Links, Right = Job Alert */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: isMobile ? 24 : 48,
            marginBottom: 28,
            alignItems: "start",
          }}
        >
          {/* LEFT: Brand + Links */}
          <div>
            {/* Brand */}
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

            <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.7, marginBottom: 20 }}>
              India's most trusted job portal for freshers & recent graduates.
              100% verified job postings updated daily.
            </p>

            {/* Desktop & Tablet: 3-column links below brand */}
            {!isMobile && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", columnGap: 20, rowGap: 0 }}>
                <div>
                  <h6 style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8, marginTop: 0 }}>
                    Fresher Jobs
                  </h6>
                  {["2026 Batch Jobs", "2025 Batch Jobs", "Software/IT Jobs", "Government Jobs"].map((l) => (
                    <a key={l} href="#" style={{ display: "block", fontSize: 11.5, color: "#8a9bb5", marginBottom: 4 }}>
                      {l}
                    </a>
                  ))}
                </div>

                <div>
                  <h6 style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8, marginTop: 0 }}>
                    Resources
                  </h6>
                  {["Interview Questions", "Resume Tips", "Off Campus Alerts"].map((l) => (
                    <a key={l} href="#" style={{ display: "block", fontSize: 11.5, color: "#8a9bb5", marginBottom: 4 }}>
                      {l}
                    </a>
                  ))}
                </div>

                <div>
                  <h6 style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8, marginTop: 0 }}>
                    Company
                  </h6>
                                <Link
                  to="/about-us"
                  style={{
                    display: "block",
                    fontSize: 11.5,
                    color: "#8a9bb5",
                    marginBottom: 4,
                  }}
                >
                  About Us
                </Link>

                <Link
                  to="/contact-us"
                  style={{
                    display: "block",
                    fontSize: 11.5,
                    color: "#8a9bb5",
                    marginBottom: 4,
                  }}
                >
                  Contact Us
                </Link>

                <Link
                  to="/privacy"
                  style={{
                    display: "block",
                    fontSize: 11.5,
                    color: "#8a9bb5",
                    marginBottom: 4,
                  }}
                >
                Privacy Policy
              </Link>
                </div>
              </div>
            )}

            {/* Mobile: 2-column condensed links */}
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
                <Link
                to="/about"
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#8a9bb5",
                  marginBottom: 6,
                }}
              >
                About
              </Link>

              <Link
                to="/contact"
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#8a9bb5",
                  marginBottom: 6,
                }}
              >
                Contact
              </Link>

              <Link
                to="/privacy-policy"
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#8a9bb5",
                  marginBottom: 6,
                }}
              >
                Privacy
              </Link>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Job Alert Subscribe */}
          <div style={{ minWidth: isMobile ? "unset" : 300 }}>
            <JobAlertSubscribe />
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid #1e3047",
            paddingTop: 14,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 11.5, opacity: 0.5 }}>
            © 2026 CodeTechniques India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;