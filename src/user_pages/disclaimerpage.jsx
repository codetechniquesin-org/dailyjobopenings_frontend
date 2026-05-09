import { useState, useEffect } from "react";
import AlertBar from "../components/alertbar";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const C = {
  primary: "#0a2540",
  accent: "#ff4d4f",
  gold: "#f5a623",
  light: "#f3f4f6",
  text: "#374151",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#f4f7fb",
  purple: "#7c3aed",
  purpleLight: "#f3e8ff",
  purpleBorder: "#c4b5fd",
  purpleDark: "#4c1d95",
};

function useBreakpoint() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return {
    w,
    isMobile: w < 640,
    isTablet: w >= 640 && w < 1024,
    isDesktop: w >= 1024,
    showSidebar: w >= 1024,
  };
}

const SECTIONS = [
  {
    num: "01",
    id: "general",
    icon: "📋",
    title: "General Disclaimer",
    content: (
      <>
        <p>
          Daily Job Openings is a job and career information platform. We share job updates, internships, walk-in drives, 
          exam notifications, and career resources for informational purposes only.
        </p>
        <p>
          We try our best to provide accurate and updated information, 
          but we cannot guarantee that all information on the Platform is always complete, correct, or up to date.
        </p>
        <div className="d-highlight">
          Users should verify all details from official company or organization websites before taking any action.
        </div>
      </>
    ),
  },
  {
    num: "02",
    id: "accuracy",
    icon: "🎯",
    title: "Accuracy of Information",
    content: (
      <>
        <p>
          We regularly update job and career information, but details may change without notice.
        </p>
        <ul className="d-list">
          {[
            "Job openings ",
            "Eligibility criteria",
            "Application deadlines",
            "Salary information",
            "Hiring status",
            "Company details",
          ].map((item) => (
            <li key={item}>
              <span className="d-dot" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "03",
    id: "jobs",
    icon: "💼",
    title: "Job Listings & Walk-In Drives",
    content: (
      <>
        <p>
          Daily Job Openings acts only as a job information provider and aggregator.
        </p>
        <div className="d-highlight">
          We collect job information from:
        </div>
        <ul className="d-list">
          {[
            "Official company career pages",
            "Public sources",
            "Recruitment announcements",
          ].map((item) => (
            <li key={item}>
              <span className="d-dot" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "04",
    id: "salary",
    icon: "💰",
    title: "Salary & Compensation Data",
    content: (
      <>
        <p>
        Salary or CTC details shown on the Platform are approximate estimates based on available information.
        </p>
      </>
    ),
  },
  {
    num: "05",
    id: "external",
    icon: "🔗",
    title: "External Links & Third-Party Sites",
    content: (
      <>
        <p>
          Our Platform may contain links to external websites and company career portals.
        </p>
        <ul className="d-list">
          {[
            "Content on third-party websites",
            "Privacy policies of external sites",
            "Accuracy of external information",
            "Any loss caused by using external websites",
          ].map((item) => (
            <li key={item}>
              <span className="d-dot" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "06",
    id: "professional",
    icon: "👨‍💼",
    title: "No Professional Advice",
    content: (
      <>
        <p>
         Career tips, interview guidance, resume advice, 
         and educational content shared on Daily Job Openings are for general informational purposes only.
        </p>
        <div className="d-highlight">
         We do not provide:

            Legal advice
            Financial advice
            Professional career counselling

            Users should consult qualified professionals for personalized guidance.
                    </div>
      </>
    ),
  },
  {
    num: "07",
    id: "liability",
    icon: "⚖️",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          Daily Job Openings is not responsible for:
        </p>
        <ul className="d-list">
          {[
            "Job application outcomes",
            "Hiring decisions",
            "Financial losses",
            "Website downtime",
            "Technical errors",
            "Third-party fraud or scams",
            "Incorrect or outdated information",
          ].map((item) => (
            <li key={item}>
              <span className="d-dot" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "08",
    id: "changes",
    icon: "🔄",
    title: "Changes to This Disclaimer",
    content: (
      <>
        <p>
          We may update or modify this Disclaimer at any time without prior notice.

            Users are encouraged to review this page regularly for updates.

        By continuing to use the Platform after changes are made, you agree to the updated Disclaimer.

        These terms are governed by the laws of India.
        </p>
      </>
    ),
  },
  {
    num: "09",
    id: "contact",
    icon: "✉️",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you find any incorrect, misleading, or suspicious content on our Platform, please contact us.
        </p>
        <ul className="d-list">
          {[
            "Email: codetechniques.in@gmail.com",
          ].map((item) => (
            <li key={item}>
              <span className="d-dot" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
];

export default function DisclaimerPage() {
  const bp = useBreakpoint();
  const { isMobile, isDesktop } = bp;
  const [activeSection, setActiveSection] = useState("general");
  const gutter = isMobile ? "14px" : "24px";

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(`sec-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div
      style={{
        fontFamily:
          "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        input, select, button { font-family: inherit; }
        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }

        .d-highlight {
          background: ${C.purpleLight};
          border-left: 3px solid ${C.purple};
          border-radius: 0 8px 8px 0;
          padding: 12px 16px;
          margin: 14px 0;
          font-size: 13.5px;
          color: ${C.purpleDark};
          line-height: 1.75;
        }
        .d-highlight strong { color: ${C.purpleDark}; }

        .d-list {
          list-style: none;
          padding: 0;
          margin: 12px 0 0;
        }
        .d-list li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 13.5px;
          color: ${C.muted};
          line-height: 1.75;
          padding: 7px 0;
          border-bottom: 1px solid ${C.border};
        }
        .d-list li:last-child { border-bottom: none; }

        .d-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${C.purple};
          flex-shrink: 0;
          margin-top: 8px;
        }

        .d-section p {
          font-size: 13.5px;
          color: ${C.muted};
          line-height: 1.85;
          margin-bottom: 12px;
        }
        .d-section p:last-child { margin-bottom: 0; }

        .toc-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          color: ${C.muted};
          cursor: pointer;
          transition: background 0.14s, color 0.14s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        .toc-btn:hover { background: ${C.light}; color: ${C.text}; }
        .toc-btn.active { background: ${C.purpleLight}; color: ${C.purple}; font-weight: 600; }
        .toc-num { font-size: 10px; font-weight: 700; color: #a78bfa; min-width: 20px; }
        .toc-btn.active .toc-num { color: ${C.purple}; }
      `}</style>

      {/* ── SHARED COMPONENTS ── */}
      <AlertBar isMobile={isMobile} C={{ accent: C.accent }} />
      {/* <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={C} gutter={gutter} /> */}
      <Navbar
        bp={bp}
        onMenuOpen={() => {}}
        onNavigate={(page) => navigate(`/${page}`)}
        activePage={location.pathname.replace("/", "")}
      />

      {/* ── HERO ── */}
      <div
        style={{
          background: C.primary,
          padding: isMobile ? "36px 16px 32px" : "56px 24px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(45deg,rgba(124,58,237,.04) 0px,rgba(124,58,237,.04) 1px,transparent 1px,transparent 40px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "#c4b5fd",
            marginBottom: 14,
            position: "relative",
          }}
        >
          Legal
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? 28 : 40,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 14px",
            lineHeight: 1.15,
            position: "relative",
          }}
        >
          Dis<span style={{ color: "#ffffff" }}>claimer</span>
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,.55)",
            fontSize: isMobile ? 13 : 15,
            margin: "0 auto",
            maxWidth: 500,
            lineHeight: 1.75,
            position: "relative",
          }}
        >
          The information on Daily Job Openings is provided in good faith for general informational
          purposes only. Please read this disclaimer carefully before relying on any content.
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 22,
            position: "relative",
          }}
        >
          {[
            "📅 Effective: January 1, 2026",
            "🔄 Last updated: May 7, 2026",
          ].map((pill) => (
            <span
              key={pill}
              style={{
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: 12,
                color: "rgba(255,255,255,.7)",
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          padding: isMobile ? "24px 16px 48px" : "36px 24px 56px",
          display: "flex",
          gap: 28,
          alignItems: "flex-start",
        }}
      >
        {/* ── TABLE OF CONTENTS ── */}
        {isDesktop && (
          <aside
            style={{
              width: 230,
              flexShrink: 0,
              position: "sticky",
              top: 80,
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: C.muted,
                marginBottom: 12,
              }}
            >
              Contents
            </div>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                className={`toc-btn ${activeSection === sec.id ? "active" : ""}`}
                onClick={() => scrollToSection(sec.id)}
              >
                <span className="toc-num">{sec.num}</span>
                {sec.title}
              </button>
            ))}
          </aside>
        )}

        {/* ── CONTENT ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Important notice */}
          <div
            style={{
              background: "#fff7ed",
              border: `1px solid #fde68a`,
              borderRadius: 12,
              padding: "14px 18px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginBottom: 22,
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#78350f" }}>Important notice:</strong> By using
              Daily Job Openings, you accept the terms of this disclaimer in full. If you disagree
              with any part of this disclaimer, you must not use our platform.
            </p>
          </div>

          {/* Sections */}
          {SECTIONS.map((sec) => (
            <div
              key={sec.id}
              id={`sec-${sec.id}`}
              className="d-section"
              style={{
                background: "#fff",
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: isMobile ? "20px 16px" : "26px 28px",
                marginBottom: 14,
                scrollMarginTop: 90,
              }}
            >
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 16,
                  paddingBottom: 14,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: C.purpleLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {sec.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "#a78bfa",
                      marginBottom: 3,
                    }}
                  >
                    SECTION {sec.num}
                  </div>
                  <h2
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.primary,
                      margin: 0,
                    }}
                  >
                    {sec.title}
                  </h2>
                </div>
              </div>

              {/* Section body */}
              {sec.content}
            </div>
          ))}

          {/* Report CTA */}
          <div
            style={{
              background: C.primary,
              borderRadius: 14,
              padding: isMobile ? "22px 18px" : "26px 28px",
              display: "flex",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 6,
                }}
              >
                Something look inaccurate?
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,.6)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Help us keep the Platform accurate. Report incorrect listings or misleading
                content to{" "}
                <strong style={{ color: "#a78bfa" }}>codetechniques.in@gmail.com</strong>
              </p>
            </div>
            <a
              href="mailto:codetechniques.in@gmail.com"
              style={{
                background: C.purple,
                color: "#fff",
                padding: "12px 26px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13.5,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Report an Issue →
            </a>
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <Footer bp={bp} gutter={gutter} />
    </div>
  );
}