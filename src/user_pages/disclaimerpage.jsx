import { useState, useEffect } from "react";
import AlertBar from "../components/alertbar";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Helmet } from "react-helmet-async";

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
    <>
    <Helmet>

      <title>
        Disclaimer | Daily Job Openings
      </title>

      <meta
        name="description"
        content="Read the official Disclaimer of Daily Job Openings regarding job listings, third-party information, external links, and platform usage responsibilities."
      />

      <meta
        name="keywords"
        content="disclaimer, Daily Job Openings disclaimer, job portal disclaimer, external links policy, informational purpose"
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <link
        rel="canonical"
        href={`${window.location.origin}/disclaimer`}
      />

      {/* OpenGraph */}
      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content="Disclaimer | Daily Job Openings"
      />

      <meta
        property="og:description"
        content="Understand the limitations, responsibilities and informational nature of the content published on Daily Job Openings."
      />

      <meta
        property="og:url"
        content={`${window.location.origin}/disclaimer`}
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content="Disclaimer | Daily Job Openings"
      />

      <meta
        name="twitter:description"
        content="Official Disclaimer page for Daily Job Openings platform and published content."
      />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",

          name: "Disclaimer",

          description:
            "Official Disclaimer page of Daily Job Openings.",

          url: `${window.location.origin}/disclaimer`,

          publisher: {
            "@type": "Organization",
            name: "Daily Job Openings",
            url: window.location.origin,
          },
        })}
      </script>

    </Helmet>

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
     <section
  style={{
    width: "100%",
    position: "relative",
    overflow: "hidden",
    background: "#f7f8fc",
    padding: isMobile ? "60px 16px 50px" : "90px 24px 80px",
  }}
>
  {/* Background Shapes */}
  <div
    style={{
      position: "absolute",
      top: -120,
      right: -100,
      width: 340,
      height: 340,
      borderRadius: "40%",
      background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
      transform: "rotate(25deg)",
      opacity: 0.6,
    }}
  />

  <div
    style={{
      position: "absolute",
      bottom: -100,
      left: -80,
      width: 280,
      height: 280,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#fde68a,#fca5a5)",
      opacity: 0.45,
      filter: "blur(20px)",
    }}
  />

  <div
    style={{
      width: "100%",
      maxWidth: 1250,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? 40 : 70,
      alignItems: "center",
      position: "relative",
      zIndex: 2,
    }}
  >
    {/* LEFT CONTENT */}
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          fontSize: 12,
          color: "#6b7280",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <a
          href="/"
          style={{
            color: "#6b7280",
            textDecoration: "none",
          }}
        >
          Home
        </a>

        <span>›</span>

        <span
          style={{
            color: "#111827",
            fontWeight: 600,
          }}
        >
          Disclaimer
        </span>
      </div>

      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          padding: "8px 16px",
          borderRadius: 999,
          marginBottom: 28,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ef4444",
          }}
        />

        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "0.05em",
          }}
        >
          IMPORTANT INFORMATION
        </span>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: isMobile ? "2.5rem" : "4.7rem",
          lineHeight: 1,
          color: "#111827",
          marginBottom: 24,
          letterSpacing: "-0.05em",
        }}
      >
        Legal <br />
        <span
          style={{
            color: "#ef4444",
          }}
        >
          Disclaimer
        </span>
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: isMobile ? 15 : 17,
          lineHeight: 1.9,
          color: "#4b5563",
          maxWidth: 580,
          marginBottom: 36,
        }}
      >
        The information shared on Daily Job Openings is published in good
        faith for general informational purposes only. Users are encouraged
        to verify all job details directly from official company websites
        before applying.
      </p>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 45,
        }}
      >
        <a
          href="/terms"
          style={{
            background: "#111827",
            color: "#fff",
            padding: isMobile ? "12px 24px" : "15px 34px",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            boxShadow: "0 10px 30px rgba(17,24,39,0.18)",
          }}
        >
          Terms & Conditions
        </a>

        <a
          href="/contact"
          style={{
            background: "#fff",
            border: "1px solid #d1d5db",
            color: "#111827",
            padding: isMobile ? "12px 24px" : "15px 34px",
            borderRadius: 14,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Contact Us
        </a>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? 20 : 40,
        }}
      >
        {[
          ["2026", "Effective Since"],
          ["100%", "Informational Purpose"],
          ["24/7", "Content Monitoring"],
        ].map(([num, label]) => (
          <div key={label}>
            <div
              style={{
                fontSize: isMobile ? 26 : 34,
                fontWeight: 800,
                color: "#111827",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {num}
            </div>

            <div
              style={{
                marginTop: 4,
                color: "#6b7280",
                fontSize: 13,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT SIDE CARD */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#ffffff",
          borderRadius: 30,
          padding: isMobile ? 24 : 34,
          boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
        }}
      >
        {/* Highlight */}
        <div
          style={{
            background: "#f9fafb",
            borderRadius: 20,
            padding: 22,
            marginBottom: 22,
            border: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              marginBottom: 18,
            }}
          >
            ⚠️
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: 22,
              color: "#111827",
              fontWeight: 800,
              marginBottom: 10,
            }}
          >
            Important Notice
          </h3>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            Daily Job Openings does not guarantee job availability,
            recruitment outcomes, or company authenticity beyond publicly
            available information.
          </p>
        </div>

        {/* Info Blocks */}
        {[
          {
            title: "Effective Date",
            value: "January 1, 2026",
            bg: "#dbeafe",
          },
          {
            title: "Last Updated",
            value: "May 7, 2026",
            bg: "#fef3c7",
          },
          {
            title: "Purpose",
            value: "General Information Only",
            bg: "#fee2e2",
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px",
              borderRadius: 18,
              background: "#fafafa",
              marginBottom: 16,
              border: "1px solid #f3f4f6",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                background: item.bg,
              }}
            />

            <div>
              <div
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  marginBottom: 4,
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  fontSize: 15,
                  color: "#111827",
                  fontWeight: 700,
                }}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

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
    </>
  );
}