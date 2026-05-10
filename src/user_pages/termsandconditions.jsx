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
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
     window.scrollTo(0, 0);
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
    id: "acceptance",
    icon: "📄",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          By using Daily Job Openings (“Platform”, “Website”, “we”, or “our”), you agree to follow these Terms & Conditions.
        </p>
        <p>
          These Terms apply to all users who visit, browse, apply for jobs, or use any services on our platform.
        </p>
        <div className="tnc-highlight">
          We may update these Terms anytime without prior notice. Continued use of the Platform after changes means you accept the updated Terms.
        </div>
      </>
    ),
  },
//   {
//     num: "02",
//     id: "use",
//     icon: "💻",
//     title: "Use of Platform",
//     content: (
//       <>
//         <p>
//           You agree to use Daily Job Openings only for legal and genuine purposes.
//           The following activities are strictly prohibited:
//                   </p>
//         <ul className="tnc-list">
//           {[
//             "Posting false, misleading, or fraudulent job listings or applications",
//             "Harvesting or scraping user data, email addresses, or contact information without consent",
//             "Attempting to gain unauthorised access to any part of the Platform or its infrastructure",
//             "Using automated bots, crawlers, or scripts to access the Platform",
//             "Impersonating any person, company, or organisation",
//             "Transmitting viruses, malware, or any other harmful or disruptive code",
//           ].map((item) => (
//             <li key={item}>
//               <span className="tnc-dot" />
//               {item}
//             </li>
//           ))}
//         </ul>
//       </>
//     ),
//   },
//   {
//     num: "03",
//     id: "accounts",
//     icon: "👤",
//     title: "User Accounts",
//     content: (
//       <>
//         <p>
//           Some features may require account registration.
//         </p>
//         <p>
//           You agree to provide accurate, current, and complete information during registration and to update
//           such information as necessary. CodeTechniques reserves the right to suspend or terminate accounts
//           that contain false or misleading information.
//         </p>
//         <ul className="tnc-list">
//           {[
//             "One account per user — creating multiple accounts is not permitted",
//             "Account credentials must not be shared with third parties",
//             "You must notify us immediately of any unauthorised use of your account",
//             "CodeTechniques is not liable for any loss arising from unauthorised account access",
//           ].map((item) => (
//             <li key={item}>
//               <span className="tnc-dot" />
//               {item}
//             </li>
//           ))}
//         </ul>
//       </>
//     ),
//   },
  {
    num: "02",
    id: "listings",
    icon: "💼",
    title: "Job Listings & Walk-In Drives",
    content: (
      <>
        <p>
          Daily Job Openings acts as an aggregator and publisher of job listings, walk-in drives, and internship
          opportunities. While we make every effort to verify listings, we do not guarantee the accuracy,
          completeness, or legitimacy of any job posting submitted by third-party employers.
        </p>
        <div className="tnc-highlight">
          Daily Job Openings does not charge job seekers any fee to apply for positions. If any employer or third
          party asks you to pay money as part of an application process, please report it to us immediately at{" "}
          <strong>codetechniques.in@gmail.com</strong>
        </div>
      </>
    ),
  },
  {
    num: "03",
    id: "ip",
    icon: "©️",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          All content on the Platform — including but not limited to text, graphics, logos, icons, images,
          audio clips, and software — is the property of Daily Job Openings India or its content suppliers and is
          protected under applicable intellectual property laws.
        </p>
        <ul className="tnc-list">
          {[
            "You may not copy, reproduce, or redistribute Platform content without express written permission",
            "The Daily Job Openings name and logo are registered trademarks and may not be used without authorisation",
            "User-submitted content (resumes, profiles) remains your property; you grant us a limited licence to display it",
            "Any feedback or suggestions you provide may be used by us without compensation to you",
          ].map((item) => (
            <li key={item}>
              <span className="tnc-dot" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "04",
    id: "privacy",
    icon: "🔒",
    title: "Privacy Policy",
    content: (
      <>
        <p>
          Your privacy is important to us. Our Privacy Policy explains how we collect, use, store, and protect
          your personal information when you use the Platform. By using Daily Job Openings, you consent to the data
          practices described in our Privacy Policy.
        </p>
        <p>
          We collect information such as usage analytics to improve
          our services and match you with relevant opportunities. We do not sell your personal data to third
          parties.
        </p>
      </>
    ),
  },
  {
    num: "05",
    id: "disclaimers",
    icon: "⚠️",
    title: "Disclaimers",
    content: (
      <>
        <p>
          The Platform and all content therein is provided on an "as is" and "as available" basis without
          warranties of any kind, either express or implied. Daily Job Openings does not warrant that the Platform
          will be uninterrupted, error-free, or free of viruses or other harmful components.
        </p>
        <p>
          Daily Job Openings makes no representations or warranties regarding the accuracy of job listings, employer
          information, salary data, or any other third-party content displayed on the Platform. Employment
          outcomes depend entirely on the hiring decisions of third-party employers.
        </p>
      </>
    ),
  },
//   {
//     num: "07",
//     id: "liability",
//     icon: "⚖️",
//     title: "Limitation of Liability",
//     content: (
//       <>
//         <p>
//           To the fullest extent permitted by applicable law, Daily Job Openings India shall not be liable for any
//           indirect, incidental, special, consequential, or punitive damages, including but not limited to loss
//           of profits, data, or goodwill arising from your use of the Platform.
//         </p>
//         <div className="tnc-highlight">
//           In no event shall Daily Job Openings' total liability to you for all claims arising out of or relating to
//           these Terms or the Platform exceed the amount paid by you, if any, to Daily Job Openings in the twelve (12)
//           months preceding the claim.
//         </div>
//         <p>
//           These limitations apply regardless of the legal theory on which the claim is based and even if
//           Daily Job Openings has been advised of the possibility of such damages.
//         </p>
//       </>
//     ),
//   },
//   {
//     num: "09",
//     id: "termination",
//     icon: "🚫",
//     title: "Termination",
//     content: (
//       <>
//         <p>
//           CodeTechniques reserves the right to suspend or permanently terminate your access to the Platform at
//           its sole discretion, without notice, for conduct that it believes violates these Terms or is harmful
//           to other users, third parties, or the business interests of CodeTechniques.
//         </p>
//         <ul className="tnc-list">
//           {[
//             "Upon termination, your right to use the Platform ceases immediately",
//             "Sections relating to intellectual property, disclaimers, and liability survive termination",
//             "You may request account deletion by contacting support@codetechniques.in",
//             "Data retention following deletion is governed by our Privacy Policy",
//           ].map((item) => (
//             <li key={item}>
//               <span className="tnc-dot" />
//               {item}
//             </li>
//           ))}
//         </ul>
//         <p>
//           These Terms are governed by and construed in accordance with the laws of India. Any disputes arising
//           out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in
//           Hyderabad, Telangana.
//         </p>
//       </>
//     ),
//   },
  {
    num: "06",
    id: "contact",
    icon: "✉️",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests regarding these Terms, our Privacy Policy, or your
          personal data, please reach out to us. We aim to respond to all enquiries within 2 business days.
        </p>
        <ul className="tnc-list">
          {[
            "Email: codetechniques.in@gmail.com",
          ].map((item) => (
            <li key={item}>
              <span className="tnc-dot" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
];

export default function TermsAndConditionsPage() {
  const bp = useBreakpoint();
  const { isMobile, isDesktop } = bp;
  const [activeSection, setActiveSection] = useState("acceptance");
  const gutter = isMobile ? "14px" : "24px";

  return (
    <>
      <Helmet>

      <title>
        Terms & Conditions | Daily Job Openings
      </title>

      <meta
        name="description"
        content="Read the Terms & Conditions of Daily Job Openings to understand platform usage policies, user responsibilities, limitations, and legal agreements."
      />

      <meta
        name="keywords"
        content="terms and conditions, Daily Job Openings terms, legal policies, user agreement, platform rules"
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <link
        rel="canonical"
        href={`${window.location.origin}/terms-and-conditions`}
      />

      {/* OpenGraph */}
      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content="Terms & Conditions | Daily Job Openings"
      />

      <meta
        property="og:description"
        content="Understand the legal terms, policies, and usage conditions for accessing Daily Job Openings."
      />

      <meta
        property="og:url"
        content={`${window.location.origin}/terms-and-conditions`}
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content="Terms & Conditions | Daily Job Openings"
      />

      <meta
        name="twitter:description"
        content="Review the official Terms & Conditions governing the use of Daily Job Openings."
      />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",

          name: "Terms & Conditions",

          description:
            "Official Terms & Conditions page for Daily Job Openings.",

          url: `${window.location.origin}/terms-and-conditions`,

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
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        input, select, button { font-family: inherit; }
        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }

        .tnc-highlight {
          background: ${C.purpleLight};
          border-left: 3px solid ${C.purple};
          border-radius: 0 8px 8px 0;
          padding: 12px 16px;
          margin: 14px 0;
          font-size: 13.5px;
          color: ${C.purpleDark};
          line-height: 1.75;
        }
        .tnc-highlight strong { color: ${C.purpleDark}; }

        .tnc-list {
          list-style: none;
          padding: 0;
          margin: 12px 0 0;
        }
        .tnc-list li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 13.5px;
          color: ${C.muted};
          line-height: 1.75;
          padding: 7px 0;
          border-bottom: 1px solid ${C.border};
        }
        .tnc-list li:last-child { border-bottom: none; }
        .tnc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${C.purple};
          flex-shrink: 0;
          margin-top: 8px;
        }

        .tnc-section p {
          font-size: 13.5px;
          color: ${C.muted};
          line-height: 1.85;
          margin-bottom: 12px;
        }
        .tnc-section p:last-child { margin-bottom: 0; }

        .toc-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          color: ${C.muted};
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .toc-link:hover { background: ${C.light}; color: ${C.text}; }
        .toc-link.active { background: ${C.purpleLight}; color: ${C.purple}; font-weight: 600; }
        .toc-num { font-size: 10.5px; font-weight: 700; color: #a78bfa; min-width: 20px; }
        .toc-link.active .toc-num { color: ${C.purple}; }
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
            Terms & Conditions
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
              background: "#f59e0b",
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
            LEGAL INFORMATION
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
          Terms & <br />
          <span
            style={{
              color: "#f59e0b",
            }}
          >
            Conditions
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
          Please review these terms carefully before using Daily Job Openings.
          By accessing or browsing our platform, you agree to follow the
          policies, guidelines, and conditions mentioned here.
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
            href="/privacy"
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
            Privacy Policy
          </a>

          <a
            href="/contact-us"
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
            ["24/7", "Platform Access"],
            ["100%", "Transparent Policies"],
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
          {/* Top Highlight */}
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
                background: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                marginBottom: 18,
              }}
            >
              📜
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
              Usage Guidelines
            </h3>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
                lineHeight: 1.7,
                fontSize: 14,
              }}
            >
              These terms define how users can safely access and interact with
              our platform and services.
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
              title: "Coverage",
              value: "All Website Services",
              bg: "#ede9fe",
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
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "24px 16px 48px" : "40px 24px 60px",
          display: "flex",
          gap: 28,
          alignItems: "flex-start",
        }}
      >
        {/* ── TABLE OF CONTENTS (desktop only) ── */}
        {isDesktop && (
          <aside
            style={{
              width: 240,
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
                marginBottom: 14,
              }}
            >
              Contents
            </div>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                className={`toc-link ${activeSection === sec.id ? "active" : ""}`}
                onClick={() => {
                  setActiveSection(sec.id);
                  document.getElementById(`sec-${sec.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
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
              background: "#fffbeb",
              border: `1px solid #fde68a`,
              borderRadius: 12,
              padding: "14px 18px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#78350f" }}>Important:</strong> These Terms constitute a legally
              binding agreement between you and Daily Job Openings India. If you do not agree to these terms,
              please discontinue use of the platform immediately.
            </p>
          </div>

          {/* Sections */}
          {SECTIONS.map((sec) => (
            <div
              key={sec.id}
              id={`sec-${sec.id}`}
              className="tnc-section"
              style={{
                background: "#fff",
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: isMobile ? "20px 16px" : "28px 30px",
                marginBottom: 16,
                scrollMarginTop: 90,
              }}
            >
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 18,
                  paddingBottom: 16,
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
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "#a78bfa",
                      marginBottom: 3,
                    }}
                  >
                    SECTION {sec.num}
                  </div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: C.primary, margin: 0 }}>
                    {sec.title}
                  </h2>
                </div>
              </div>

              {/* Section body */}
              {sec.content}
            </div>
          ))}

          {/* Contact CTA banner */}
          <div
            style={{
              background: C.primary,
              borderRadius: 14,
              padding: isMobile ? "22px 18px" : "28px 30px",
              display: "flex",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                Questions about these Terms?
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.65, margin: 0 }}>
                Our legal team is happy to clarify anything. Reach us at{" "}
                <strong style={{ color: "#a78bfa" }}>codetechniques.in@gmail.com</strong>
              </p>
            </div>
            <a
              href="/contact-us"
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
              Contact Us →
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