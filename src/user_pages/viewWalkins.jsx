import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import AlertBar from "../components/alertbar";
import Navbar from "../components/navbar";
// import TopTicker from "../components/topticker";
import Footer from "../components/footer";

/* ─────────────────────────────────────────────
   THEME
───────────────────────────────────────────── */
const C = {
  primary: "#0f4c81",
  accent:  "#e8472a",
  gold:    "#f5a623",
  light:   "#f4f7fb",
  green:   "#16a34a",
  text:    "#1a1a2e",
  muted:   "#6b7280",
  border:  "#e2e8f0",
  purple:  "#7c3aed",
  purpleLight:  "#f3e8ff",
  purpleBorder: "#c4b5fd",
  purpleDark:   "#4c1d95",
};

/* ─────────────────────────────────────────────
   BREAKPOINT HOOK
───────────────────────────────────────────── */
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return {
    w,
    isMobile:    w < 640,
    isTablet:    w >= 640 && w < 1024,
    isDesktop:   w >= 1024,
    showSidebar: w >= 1024,
  };
}

/* ─────────────────────────────────────────────
   SMALL PRIMITIVES
───────────────────────────────────────────── */
function SideWidget({ title, children }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: `1px solid ${C.border}`, padding: 18, marginBottom: 16,
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 13.5,
        fontWeight: 700, marginBottom: 14, color: C.text,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function SideLink({ label, meta }) {
  return (
    <a href="#" style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 0", borderBottom: `1px solid ${C.border}`,
      fontSize: 13, color: C.text, textDecoration: "none",
    }}>
      {label}
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ background: C.light, color: C.muted, fontSize: 11, padding: "1px 7px", borderRadius: 10 }}>{meta}</span>
        <span style={{ color: C.muted, fontSize: 12 }}>›</span>
      </span>
    </a>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR — static walk-in specific widgets
───────────────────────────────────────────── */
const WALK_IN_CATEGORIES = [
  { label: "IT / Software",   count: "142" },
  { label: "BPO / Support",   count: "98"  },
  { label: "Finance / Banking",count: "54" },
  { label: "Sales / Marketing",count: "76" },
  { label: "Testing / QA",    count: "38"  },
  { label: "Internships",     count: "61"  },
  { label: "Hardware / Networking", count: "29" },
];

const WALK_IN_CITIES = [
  { label: "Bangalore",  count: "86"  },
  { label: "Hyderabad",  count: "72"  },
  { label: "Pune",       count: "54"  },
  { label: "Mumbai",     count: "48"  },
  { label: "Chennai",    count: "39"  },
  { label: "Delhi NCR",  count: "33"  },
  { label: "Noida",      count: "21"  },
];

const UPCOMING_DRIVES = [
  { company: "Infosys",     role: "Systems Engineer",    date: "May 3, 2026",  loc: "Bangalore" },
  { company: "Wipro",       role: "Process Executive",   date: "May 5, 2026",  loc: "Hyderabad" },
  { company: "Cognizant",   role: "Associate Analyst",   date: "May 7, 2026",  loc: "Chennai"   },
  { company: "TCS",         role: "Customer Support",    date: "May 10, 2026", loc: "Pune"      },
];

function WalkInSidebar() {
  return (
    <div style={{ width: "100%" }}>

      {/* ── Promo Ad ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f4c81, #1565c0)",
        color: "#fff", borderRadius: 12, padding: 20,
        textAlign: "center", marginBottom: 16,
      }}>
        <span style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", display: "block", marginBottom: 8 }}>Advertisement</span>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, marginBottom: 6 }}>
          🚀 Crack Your Next Walk-In
        </div>
        <p style={{ fontSize: 12, opacity: .85, marginBottom: 14 }}>
          Mock Interviews + Resume Review — Free for 2026 Batch
        </p>
        <a href="#" style={{
          background: C.gold, color: "#000", padding: "8px 18px",
          borderRadius: 7, fontWeight: 700, fontSize: 12.5, display: "inline-block",
        }}>
          Start Free →
        </a>
      </div>

      {/* ── Browse by Category ── */}
      <SideWidget title="📂 Browse by Category">
        {WALK_IN_CATEGORIES.map(({ label, count }) => (
          <SideLink key={label} label={label} meta={count} />
        ))}
      </SideWidget>

      {/* ── Upcoming Drives ── */}
      <SideWidget title="📅 Upcoming Walk-In Drives">
        {UPCOMING_DRIVES.map(({ company, role, date, loc }, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            paddingBottom: 12, marginBottom: 12,
            borderBottom: i < UPCOMING_DRIVES.length - 1 ? `1px solid ${C.border}` : "none",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: C.light, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: 13, color: C.primary,
            }}>
              {company.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>{company}</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>{role}</div>
              <div style={{ display: "flex", gap: 8, fontSize: 11, color: C.muted, flexWrap: "wrap" }}>
                <span>📅 {date}</span>
                <span>📍 {loc}</span>
              </div>
            </div>
          </div>
        ))}
        <a href="/walk-in-drive" style={{
          display: "block", textAlign: "center", fontSize: 12.5,
          color: C.primary, fontWeight: 600, marginTop: 4,
          border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "7px",
        }}>
          View All Drives →
        </a>
      </SideWidget>

      {/* ── By City ── */}
      <SideWidget title="📍 Walk-Ins by City">
        {WALK_IN_CITIES.map(({ label, count }) => (
          <SideLink key={label} label={label} meta={count} />
        ))}
      </SideWidget>

      {/* ── Job Alerts WhatsApp ── */}
      <div style={{
        background: "linear-gradient(160deg, #1a1a2e, #16213e)",
        color: "#fff", borderRadius: 12, padding: 18,
        textAlign: "center", marginBottom: 16,
      }}>
        <span style={{ fontSize: 9.5, color: "rgba(255,255,255,.35)", display: "block", marginBottom: 8 }}>Advertisement</span>
        <div style={{ fontSize: 32, marginBottom: 6 }}>📱</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
          Walk-In Alerts on WhatsApp
        </div>
        <p style={{ fontSize: 12, opacity: .75, marginBottom: 14 }}>
          Get notified the moment a new drive is posted near you
        </p>
        <a href="#" style={{
          background: "linear-gradient(90deg, #e8472a, #f5a623)",
          color: "#fff", padding: "8px 18px", borderRadius: 7,
          fontWeight: 700, fontSize: 12.5, display: "inline-block",
        }}>
          Join Free Group →
        </a>
      </div>

      {/* ── Preparation Tips ── */}
      <SideWidget title="💡 Walk-In Preparation Tips">
        {[
          "Carry 3–5 copies of your updated resume",
          "Bring original + photocopies of all documents",
          "Reach the venue 30 min before reporting time",
          "Dress formally — first impressions matter",
          "Research the company before you walk in",
        ].map((tip, i) => (
          <div key={i} style={{
            display: "flex", gap: 9, alignItems: "flex-start",
            paddingBottom: 8, marginBottom: 8,
            borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
            fontSize: 12.5, color: C.text, lineHeight: 1.5,
          }}>
            <span style={{
              background: C.purpleLight, color: C.purpleDark,
              width: 20, height: 20, borderRadius: "50%",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 1,
            }}>
              {i + 1}
            </span>
            {tip}
          </div>
        ))}
      </SideWidget>

    </div>
  );
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : null;

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function WalkInJobDetail() {
  const { walkinslug } = useParams();
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop, showSidebar, w } = bp;
  const gutter = isMobile ? "14px" : isTablet ? "20px" : "24px";

  const [job,     setJob]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, [walkinslug]);

  useEffect(() => {
    if (!walkinslug || walkinslug === "undefined") {
      setError("Invalid Walk-In Slug"); setLoading(false); return;
    }
    const fetchJob = async () => {
      try {
        setLoading(true); setJob(null); setError(null);
        const res = await axios.get(`${API_BASE_URL}/api/walkins/get-walkin-by-slug/${walkinslug}`);
        const d = res.data?.walkIn;
        if (!d) setError("Walk-In not found"); else setJob(d);
      } catch { setError("Failed to load walk-in"); }
      finally   { setLoading(false); }
    };
    fetchJob();
  }, [walkinslug]);

  /* ── inline card style factory ── */
  const card = (extra = {}) => ({
    background: "#fff", borderRadius: 12,
    border: `1px solid ${C.border}`, padding: isMobile ? 18 : 24,
    marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", ...extra,
  });

  const secTitle = {
    fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
    color: C.text, borderBottom: `2px solid ${C.purple}`,
    display: "inline-block", paddingBottom: 3, marginBottom: 16,
  };

  const labelStyle = { fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 };
  const valueStyle = { fontSize: 13.5, fontWeight: 600, color: C.text };

  const listRow = {
    display: "flex", gap: 9, alignItems: "flex-start",
    padding: "8px 0", fontSize: 13.5, color: "#374151", lineHeight: 1.6,
  };

  /* ── states ── */
  if (loading) return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.light, minHeight: "100vh" }}>
      <AlertBar isMobile={false} C={{ accent: "#ff4d4f" }} />
      {/* <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={C} gutter="16px" /> */}
      <Navbar bp={bp} onMenuOpen={() => {}} />
      <h2 style={{ textAlign: "center", marginTop: 100, color: C.muted }}>Loading...</h2>
    </div>
  );

  if (error || !job) return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.light, minHeight: "100vh" }}>
      <AlertBar isMobile={false} C={{ accent: "#ff4d4f" }} />
      {/* <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={C} gutter="16px" /> */}
      <Navbar bp={bp} onMenuOpen={() => {}} />
      <h2 style={{ textAlign: "center", marginTop: 100, color: C.accent }}>{error || "No walk-in data"}</h2>
      <Footer bp={bp} gutter="16px" />
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.light, color: C.text, minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; background: #f4f7fb !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }
        a { text-decoration: none; color: inherit; }

        /* hero */
        .wi-hero {
          width: 100%; padding: 44px 20px 52px;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 55%, #4c1d95 100%);
          color: #fff; text-align: center;
        }
        .wi-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(20px, 4vw, 32px); font-weight: 800;
          line-height: 1.2; margin-bottom: 8px;
        }
        .wi-hero p { font-size: clamp(13px, 1.8vw, 16px); opacity: .88; font-weight: 500; }

        /* badges */
        .badge { padding: 3px 9px; border-radius: 5px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; display: inline-block; }
        .b-feat  { background: #fff8e1; color: #b45309; }
        .b-ok    { background: #dcfce7; color: #15803d; }
        .b-type  { background: #dbeafe; color: #1d4ed8; }
        .b-role  { background: #fef9c3; color: #854d0e; }

        /* chips */
        .chip      { background: #f1f5f9; color: ${C.text}; padding: 4px 13px; border-radius: 7px; font-size: 12.5px; font-weight: 600; border: 1px solid ${C.border}; display: inline-block; }
        .chip-p    { background: ${C.purpleLight}; color: ${C.purpleDark}; padding: 4px 13px; border-radius: 7px; font-size: 12px; font-weight: 600; border: 1px solid ${C.purpleBorder}; display: inline-block; }

        /* apply button */
        .apply-btn {
          background: ${C.primary}; color: #fff; padding: 12px 34px;
          border-radius: 9px; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 14.5px; border: none; cursor: pointer;
          box-shadow: 0 4px 12px rgba(15,76,129,0.3);
          transition: transform .18s, box-shadow .18s; display: inline-block;
        }
        .apply-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(15,76,129,0.38); }

        /* date range box */
        .date-box {
          display: flex; gap: 20px; flex-wrap: wrap; align-items: center;
          background: ${C.purpleLight}; border: 1px solid ${C.purpleBorder};
          border-radius: 11px; padding: 14px 18px;
        }

        /* step pill */
        .step-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: ${C.purpleLight}; border: 1.5px solid ${C.purpleBorder};
          border-radius: 9px; padding: 7px 14px;
          font-size: 13px; font-weight: 600; color: ${C.purpleDark};
        }

        /* sidebar hidden on ≤1023 */
        .sidebar-col { display: block; }
        @media (max-width: 1023px) { .sidebar-col { display: none; } }

        /* main layout */
        .page-layout {
          display: flex; gap: 22px; align-items: flex-start;
          width: 100%; padding: 0 ${isMobile ? "14px" : isTablet ? "20px" : "24px"} 56px;
        }
        .page-main { flex: 1; min-width: 0; }

        /* section divider */
        .hr { height: 1px; background: ${C.border}; margin: 18px 0; }

        /* salary card on small screens */
        @media (max-width: 639px) {
          .hero-top { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .sal-chip { margin-top: 12px; width: 100%; }
        }
      `}</style>

      {/* ── GLOBAL BARS ── */}
      <AlertBar isMobile={false} C={{ accent: "#ff4d4f" }} />
      {/* <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={C} gutter="16px" /> */}
      <Navbar bp={bp} onMenuOpen={() => {}} />

      {/* ── HERO ── */}
      <div className="wi-hero">
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ fontSize: 12, opacity: .65, marginBottom: 14 }}>
            <Link to="/" style={{ color: "#fff" }}>Home</Link>
            &nbsp;›&nbsp;
            <Link to="/walk-in-drive" style={{ color: "#fff" }}>Walk-In Drives</Link>
            &nbsp;›&nbsp;
            <span style={{ opacity: .8 }}>{job.walkintitle}</span>
          </div>
          <h1>{job.walkintitle}</h1>
          <p>{job.companyName} &nbsp;•&nbsp; {job.location}</p>
        </div>
      </div>

      {/* ── BREADCRUMB ── */}
      <div style={{ padding: `12px ${gutter} 0`, fontSize: 12, color: C.muted, display: "flex", gap: 5, flexWrap: "wrap" }}>
        <Link to="/" style={{ color: C.primary }}>Home</Link> <span>›</span>
        <Link to="/walk-in-drive" style={{ color: C.primary }}>Walk-In Drives</Link> <span>›</span>
        <span style={{ color: C.text }}>{job.walkintitle}</span>
      </div>

      {/* ── LAYOUT ── */}
      <div style={{ marginTop: 16 }} className="page-layout">

        {/* ══ MAIN CONTENT ══ */}
        <div className="page-main">

          {/* ── HEADER CARD ── */}
          <div style={card({ borderLeft: `4px solid ${C.purple}` })}>
            <div className="hero-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>

              {/* logo + meta */}
              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{
                  width: isMobile ? 54 : 76, height: isMobile ? 54 : 76,
                  borderRadius: 12, background: "#f8fafc", flexShrink: 0,
                  border: `1px solid ${C.border}`, display: "flex",
                  alignItems: "center", justifyContent: "center", overflow: "hidden",
                }}>
                  {job.companyLogo
                    ? <img src={job.companyLogo} alt={job.companyName} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                    : <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: C.primary }}>{job.companyName?.charAt(0)}</span>
                  }
                </div>

                <div>
                  {/* <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 7 }}>
                    {job.highlight_type_label     && <span className="badge b-feat">⭐ Featured</span>}
                    <span className="badge b-ok">✅ Verified</span>
                    {job.employmentType && <span className="badge b-type">{job.employmentType}</span>}
                    {job.roleCategory   && <span className="badge b-role">{job.roleCategory}</span>}
                  </div> */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 7 }}>

  {/* 🔹 Highlight Label */}
  {job.highlight_type_label && (
    <span className="badge b-feat">
      {job.highlight_type_label === "featured" && "⭐ Featured"}
      {job.highlight_type_label === "hot" && "🔥 Hot Job"}
      {job.highlight_type_label === "trending" && "📈 Trending"}
    </span>
  )}

  {/* 🔹 Walk-in Label */}
  {job.walkin_type_label && (
    <span className="badge b-walkin">
      {job.walkin_type_label === "urgent" && "🚨 Urgent Walk-in"}
      {job.walkin_type_label === "walkin" && "📍 Walk-in Drive"}
      {job.walkin_type_label === "mass_hiring" && "👥 Mass Hiring"}
      {job.walkin_type_label === "fresher" && "🎓 Fresher Friendly"}
    </span>
  )}

  {/* 🔹 Other badges (unchanged) */}
  {job.employmentType && (
    <span className="badge b-type">{job.employmentType}</span>
  )}

  {job.roleCategory && (
    <span className="badge b-role">{job.roleCategory}</span>
  )}

</div>
                  <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: isMobile ? 19 : 22, fontWeight: 800, color: C.text, marginBottom: 3, lineHeight: 1.2 }}>
                    {job.walkintitle}
                  </h1>
                  <div style={{ fontSize: 14, color: C.purple, fontWeight: 600, marginBottom: 4 }}>
                    {job.companyWebsite
                      ? <a href={job.companyWebsite} target="_blank" rel="noreferrer" style={{ color: C.purple }}>{job.companyName} ↗</a>
                      : job.companyName
                    }
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12.5, color: C.muted }}>
                    <span>📍 {job.location}</span>
                    {job.mode       && <span>• 🏢 {job.mode}</span>}
                    {job.experience && <span>• 🧑‍💼 {job.experience}</span>}
                  </div>
                </div>
              </div>

              {/* salary chip */}
              {w >= 640 && (
                <div className="sal-chip" style={{
                  background: C.purpleLight, border: `1.5px solid ${C.purpleBorder}`,
                  borderRadius: 11, padding: "12px 20px", textAlign: "center", flexShrink: 0,
                }}>
                  <div style={{ ...labelStyle, marginBottom: 5 }}>Estimated Salary</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 800, color: C.purple }}>
                    {job.salary || "Not Specified"}
                  </div>
                </div>
              )}
            </div>

            {/* mobile salary strip */}
            {w < 640 && (
              <div style={{ marginTop: 12, background: C.purpleLight, border: `1px solid ${C.purpleBorder}`, borderRadius: 9, padding: "10px 14px" }}>
                <div style={labelStyle}>Estimated Salary</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: C.purple }}>{job.salary || "Not Specified"}</div>
              </div>
            )}

            <div className="hr" />

            {/* apply CTA */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              {job.applyLink
                ? <a href={job.applyLink} target="_blank" rel="noreferrer"><button className="apply-btn">Register for Walk-In →</button></a>
                : <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "11px 18px", borderRadius: 9, fontWeight: 600, fontSize: 13.5 }}>
                    ⚠️ No registration link provided
                  </div>
              }
            </div>
          </div>

          {/* ── QUICK STATS GRID ── */}
          <div style={card()}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: isMobile ? 16 : 20 }}>
              {[
                ["📍", "Interview Location",  job.location],
                ["🏢", "Mode",                job.mode || "Walk-In"],
                ["💼", "Employment Type",     job.employmentType || "Full Time"],
                ["🧑‍💼", "Experience",         job.experience || "Freshers"],
                ["🎓", "Eligible Batches",    Array.isArray(job.batch) && job.batch.length ? job.batch.join(", ") : "Any Graduate"],
                ["📚", "Qualification",       Array.isArray(job.qualification) && job.qualification.length ? job.qualification.join(", ") : "Any Graduate"],
              ].map(([icon, lbl, val]) => (
                <div key={lbl}>
                  <div style={labelStyle}>{icon} {lbl}</div>
                  <div style={valueStyle}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── WALK-IN SCHEDULE ── */}
          <div style={card({ background: "#fdfcfe", border: `1px solid ${C.purpleBorder}` })}>
            <h3 style={secTitle}>📅 Walk-In Schedule</h3>
            <div className="date-box">
              <div>
                <div style={labelStyle}>Start Date</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14.5, fontWeight: 700, color: C.purpleDark }}>
                  {formatDate(job.walkInDetails?.startDate) || "TBA"}
                </div>
              </div>
              <span style={{ fontSize: 18, color: C.purpleBorder, fontWeight: 300 }}>→</span>
              <div>
                <div style={labelStyle}>End Date</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14.5, fontWeight: 700, color: C.purpleDark }}>
                  {formatDate(job.walkInDetails?.endDate) || "TBA"}
                </div>
              </div>
              {job.walkInDetails?.reportingTime && (
                <>
                  <span style={{ fontSize: 18, color: C.purpleBorder, fontWeight: 300 }}>|</span>
                  <div>
                    <div style={labelStyle}>Reporting Time</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14.5, fontWeight: 700, color: C.purpleDark }}>
                      🕐 {job.walkInDetails.reportingTime}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── JOB DESCRIPTION ── */}
          <div style={card()}>
            <h3 style={secTitle}>Job Description</h3>
            <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.85, whiteSpace: "pre-line", marginBottom: job.responsibilities?.length ? 24 : 0 }}>
              {job.description || "No description available."}
            </p>

            {/* responsibilities */}
            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <>
                <h3 style={{ ...secTitle, marginTop: 8 }}>📋 Key Responsibilities</h3>
                {job.responsibilities.map((r, i) => (
                  <div key={i} style={{ ...listRow, borderBottom: i < job.responsibilities.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <span style={{ color: C.purple, fontSize: 15, flexShrink: 0 }}>›</span>
                    <span>{r}</span>
                  </div>
                ))}
              </>
            )}

            {/* skills */}
            <h3 style={{ ...secTitle, marginTop: 24 }}>🛠️ Skills & Requirements</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Array.isArray(job.skills) && job.skills.length
                ? job.skills.map((s, i) => <span key={i} className="chip">{s}</span>)
                : <span style={{ fontSize: 13, color: C.muted }}>N/A</span>
              }
            </div>
          </div>

          {/* ── ELIGIBILITY ── */}
          {Array.isArray(job.eligibility) && job.eligibility.length > 0 && (
            <div style={card()}>
              <h3 style={secTitle}>✅ Eligibility Criteria</h3>
              {job.eligibility.map((e, i) => (
                <div key={i} style={{ ...listRow, borderBottom: i < job.eligibility.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ color: C.green, fontSize: 14, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── SELECTION PROCESS ── */}
          {Array.isArray(job.selectionProcess) && job.selectionProcess.length > 0 && (
            <div style={card()}>
              <h3 style={secTitle}>🔄 Selection Process</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                {job.selectionProcess.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="step-pill">
                      <span style={{
                        background: C.purple, color: "#fff", borderRadius: "50%",
                        width: 20, height: 20, display: "inline-flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 10.5, fontWeight: 800, flexShrink: 0,
                      }}>{i + 1}</span>
                      {step}
                    </div>
                    {i < job.selectionProcess.length - 1 && (
                      <span style={{ color: C.purpleBorder, fontSize: 17 }}>›</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DOCUMENTS REQUIRED ── */}
          {Array.isArray(job.documentsRequired) && job.documentsRequired.length > 0 && (
            <div style={card()}>
              <h3 style={secTitle}>📄 Documents Required</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10 }}>
                {job.documentsRequired.map((doc, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 9, alignItems: "center",
                    background: "#f8fafc", padding: "9px 13px", borderRadius: 9,
                    border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 500,
                  }}>
                    <span style={{ fontSize: 15 }}>📎</span>{doc}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── VENUE ── */}
          <div style={card({ background: "#fdfcfe", border: `1px solid ${C.purpleBorder}` })}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>📍</span>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: C.purpleDark }}>Walk-In Venue</h3>
            </div>
            <div style={{
              background: "#fff", border: `1px solid ${C.border}`,
              borderRadius: 9, padding: "13px 15px", fontSize: 14,
              fontWeight: 500, lineHeight: 1.7, color: C.text, marginBottom: 14,
            }}>
              {job.walkInDetails?.venue || job.address || "Venue not specified."}
            </div>
            {job.address && job.walkInDetails?.venue && job.address !== job.walkInDetails.venue && (
              <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 12 }}>🏢 Full Address: {job.address}</p>
            )}
            {job.googleMapsLink && (
              <a href={job.googleMapsLink} target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "#fff", border: `1.5px solid ${C.purpleBorder}`,
                  color: C.purpleDark, padding: "8px 16px", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, marginBottom: 14,
                }}>
                🗺️ View on Google Maps
              </a>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5 }}>
              {job.contactEmail && <div><strong>Email:</strong>{" "}<a href={`mailto:${job.contactEmail}`} style={{ color: C.purple }}>{job.contactEmail}</a></div>}
              {job.contactPhone && <div><strong>Phone:</strong>{" "}<a href={`tel:${job.contactPhone}`}  style={{ color: C.purple }}>{job.contactPhone}</a></div>}
              {job.companyWebsite && <div><strong>Website:</strong>{" "}<a href={job.companyWebsite} target="_blank" rel="noreferrer" style={{ color: C.purple }}>{job.companyWebsite}</a></div>}
            </div>
          </div>

          {/* ── TAGS ── */}
          {Array.isArray(job.tags) && job.tags.length > 0 && (
            <div style={card()}>
              <h3 style={secTitle}>🏷️ Tags</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {job.tags.map((t, i) => <span key={i} className="chip-p">#{t}</span>)}
              </div>
            </div>
          )}

          {/* ── BOTTOM APPLY ── */}
          <div style={{ textAlign: "center", marginTop: 28, marginBottom: 20 }}>
            {job.applyLink ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <p style={{ fontSize: 12.5, color: C.muted }}>Click below to register officially for this walk-in drive</p>
                <a href={job.applyLink} target="_blank" rel="noreferrer">
                  <button className="apply-btn">Register for Walk-In →</button>
                </a>
              </div>
            ) : (
              <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "13px 20px", borderRadius: 10, display: "inline-block", fontWeight: 600, fontSize: 13.5 }}>
                ⚠️ No registration link provided.
              </div>
            )}
          </div>

          {/* mobile sidebar widgets */}
          {!showSidebar && (
            <div style={{ marginTop: 8 }}>
              <WalkInSidebar />
            </div>
          )}
        </div>

        {/* ══ RIGHT SIDEBAR (desktop ≥1024) ══ */}
        <div className="sidebar-col" style={{ width: w >= 1280 ? 290 : 260, flexShrink: 0 }}>
          <WalkInSidebar />
        </div>

      </div>

      {/* ── BOTTOM AD STRIP ── */}
      <div style={{ padding: `0 ${gutter} 20px` }}>
        <div style={{
          background: "linear-gradient(90deg, #f0fff4, #e8f5e9)",
          border: "1.5px dashed #86efac", borderRadius: 10,
          padding: "12px 16px", display: "flex",
          flexWrap: "wrap", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 9.5, color: "#999", border: "1px solid #ddd", padding: "1px 5px", borderRadius: 3 }}>AD</span>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: `linear-gradient(135deg,${C.gold},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, flexShrink: 0 }}>💰</div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <strong style={{ fontSize: isMobile ? 12.5 : 13.5, display: "block" }}>Earn While You Learn — Referral Bonus up to ₹5,000</strong>
            <span style={{ fontSize: isMobile ? 11 : 12, color: C.muted }}>Refer a friend to CodeTechniques Premium &amp; earn per referral</span>
          </div>
          <a href="#" style={{ background: C.green, color: "#fff", padding: "7px 14px", borderRadius: 7, fontWeight: 600, fontSize: 12.5, whiteSpace: "nowrap" }}>Learn More →</a>
        </div>
      </div>

      <Footer bp={bp} gutter="16px" />
    </div>
  );
}