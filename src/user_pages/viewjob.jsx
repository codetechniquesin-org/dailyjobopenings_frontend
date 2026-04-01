import { useState, useEffect } from "react";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import AlertBar from "../components/alertbar";
import { useParams } from "react-router-dom";
import SimilarJobs from "../components/viewjob_page_components/similar_jobs";
import API_BASE_URL from "../config/api";


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
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999
};

const modalStyle = {
  background: "#ffffff",
  padding: "24px",
  borderRadius: "16px",
  width: "320px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

const iconBtn = (bg) => ({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  textDecoration: "none"
});


// const NAV_LINKS = ["Home", "Freshers Jobs", "Work From Home", "Internships", "Interview Tips", "By Location"];

const BADGE_STYLE = {
  featured: { background: "#fff8e1", color: "#b45309" },
  hot:      { background: "#fee2e2", color: "#b91c1c" },
  new:      { background: "#dcfce7", color: "#15803d" },
  remote:   { background: "#ede9fe", color: "#6d28d9" },
};

/* ─────────────────────────────────────────────
   BREAKPOINT HOOK
   xs  <480      small phones
   sm  480-639   large phones
   md  640-767   small tablets / landscape phones
   lg  768-1023  tablets
   xl  1024-1279 laptops
   2xl 1280+     desktops
───────────────────────────────────────────── */
  //this is related to toptocler
function useBreakpoint() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : "100%"
  );
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
   PRIMITIVES
───────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11.5, color: C.muted, background: C.light,
      padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function SkillTag({ label }) {
  return (
    <span style={{
      background: "#e8f4fd", color: C.primary, fontSize: 12,
      padding: "4px 10px", borderRadius: 5, fontWeight: 500, whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function SectionTitle({ text }) {
  return (
    <h2 style={{
      fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700,
      display: "flex", alignItems: "center", gap: 8, margin: "0 0 18px",
    }}>
      <span style={{ width: 4, height: 20, background: C.accent, borderRadius: 3, display: "inline-block", flexShrink: 0 }} />
      {text}
    </h2>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: `1px solid ${C.border}`, padding: 20, ...style,
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "18px 0" }} />;
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 700, color: C.muted,
      textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 5,
    }}>
      {children}
    </div>
  );
}

function Pill({ children, bg, color }) {
  return (
    <span style={{
      background: bg, color, padding: "4px 11px",
      borderRadius: 20, fontSize: 12, fontWeight: 500,
    }}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   HAMBURGER BUTTON
───────────────────────────────────────────── */
function HamburgerBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open menu"
      style={{
        background: "none", border: `1.5px solid ${C.border}`,
        borderRadius: 9, width: 40, height: 40, cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 5, padding: 0, flexShrink: 0,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 20, height: 2, background: C.text, borderRadius: 2, display: "block" }} />
      ))}
    </button>
  );
}

/* ─────────────────────────────────────────────
   MOBILE / TABLET DRAWER
───────────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 400 }}
      />
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 300,
        background: "#fff", zIndex: 500, overflowY: "auto",
        boxShadow: "6px 0 32px rgba(0,0,0,.18)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          background: C.primary, padding: "16px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}>
            Code<span style={{ color: C.gold }}>Techniques</span>
          </span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.15)", border: "none", color: "#fff",
              borderRadius: 8, width: 32, height: 32, cursor: "pointer",
              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* Links */}
        <div style={{ padding: "12px 14px", flex: 1 }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link} href="#" onClick={onClose}
              style={{
                display: "block", padding: "12px 14px",
                borderRadius: 8, fontSize: 14.5, fontWeight: 500, color: C.text,
                marginBottom: 2, borderBottom: `1px solid ${C.border}`,
              }}
            >
              {link}
            </a>
          ))}
          <div style={{ margin: "16px 0 8px" }}>
            <a
              href="#"
              style={{
                display: "block", background: C.accent, color: "#fff",
                padding: "13px 14px", borderRadius: 10, fontWeight: 700,
                fontSize: 14, textAlign: "center", fontFamily: "'Syne',sans-serif",
              }}
            >
              📢 Post a Job ggg
            </a>
          </div>
          <div style={{ background: C.light, borderRadius: 10, padding: 14, marginTop: 12 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 700 }}>📍 Browse by Location</div>
            {["Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Delhi NCR"].map((loc) => (
              <a
                key={loc} href="#"
                style={{ display: "block", fontSize: 13.5, padding: "7px 0", color: C.primary, borderBottom: `1px solid ${C.border}` }}
              >
                {loc}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR WIDGET WRAPPER
───────────────────────────────────────────── */
function SidebarWidget({ title, children }) {
  return (
    <Card style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 14, color: C.text }}>
        {title}
      </div>
      {children}
    </Card>
  );
}
//--------------------------------------------------------------------------------------------------------------------------------------//
/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
function Sidebar({ job }) {
  return (
    <div style={{ width: "100%" }}>

      {/* Company Card */}
      <SidebarWidget title="🏢 About the Company">
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
<div
  style={{
    width: 48,
    height: 48,
    borderRadius: 10,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${C.border}`,
    flexShrink: 0,
    overflow: "hidden"
  }}
>
  <img
    src={job.companyLogo}
    alt={job.companyName}
    style={{
      width: "80%",
      height: "80%",
      objectFit: "contain"
    }}
  />
</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{job.JobTitle}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{job.companyName}</div>
          </div>
        </div>
        {[
          ["Industry", 'IT'],
          ["Size",     "BIG"],
          ["Founded",  "Today"],
        ].map(([lbl, val]) => (
          <div key={lbl} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.muted }}>{lbl}</span>
            <span style={{ fontWeight: 500 }}>{val}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "5px 0" }}>
          <span style={{ color: C.muted }}>Rating</span>
          <span style={{ fontWeight: 600, color: C.gold }}>5⭐ {job.companyRating} / 5</span>
        </div>
        <a
          href="#"
          style={{
            display: "block", textAlign: "center", marginTop: 12,
            fontSize: 12.5, color: C.primary, fontWeight: 600,
            border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "8px 0",
          }}
        >
          View All Jobs at {job.companyCareersLink?.split(",")[0]} →
        </a>
      </SidebarWidget>

      {/* Job Summary */}
      <SidebarWidget title="📋 Job Summary">
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {[
            ["📌", "JOB ROLE",   job.jobRole],
            ["💼", "JOB TYPE",   job.jobType],
            ["🎯", "EXPERIENCE", job.experienceLevel],
            ["🏠", "WORK MODE",  job.workMode],
            ["📍", "LOCATION",   job.location],
          ].map(([icon, lbl, val]) => (
            <div key={lbl} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, flexShrink: 0, marginTop: 2 }}>{icon}</span>
              <div>
                <SectionLabel>{lbl}</SectionLabel>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{val}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 2 }}>💰</span>
            <div>
              <SectionLabel>SALARY</SectionLabel>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{job.salary}</div>
            </div>
          </div>
          {/* <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 2 }}>⏰</span>
            <div>
              <SectionLabel>LAST DATE</SectionLabel>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{job.expiryDate}</div>
            </div>
          </div> */}
        </div>
      </SidebarWidget>

      {/* Ad */}
      <div style={{
        background: "linear-gradient(135deg,#0f4c81,#1565c0)",
        color: "#fff", borderRadius: 12, padding: 18,
        textAlign: "center", marginBottom: 14,
      }}>
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Advertisement</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>🚀 Launch Your Tech Career</div>
        <p style={{ fontSize: 12, opacity: 0.85, marginBottom: 14 }}>GeeksforGeeks Bootcamp – Job Guarantee for 2026 Batch</p>
        <a
          href="#"
          style={{
            background: C.gold, color: "#000", padding: "9px 20px",
            borderRadius: 8, fontWeight: 700, fontSize: 13,
            display: "inline-block", fontFamily: "'Syne',sans-serif",
          }}
        >
          Join Now →
        </a>
      </div>

      {/* Similar Jobs */}
        {job?._id && <SimilarJobs jobId={job._id} />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function ViewJob() {
    //this is related to toptocler
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop, showSidebar, w } = bp;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const gutter = isMobile ? "14px" : isTablet ? "20px" : "24px";
  const [showShare, setShowShare] = useState(false);
  const { slug } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const fetchJob = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/view-job/${slug}`);
    const data = await res.json();

    console.log("FULL RESPONSE:", data); // 🔥 MUST DO

    setJob(data.data); // keep this for now
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

    fetchJob();
  }, [slug]);

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (!job) return <p style={{ padding: "20px" }}>No job found</p>;

  

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.light, color: C.text, minHeight: "100vh" , width: "100%" , overflowX: "hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        ul { list-style: disc; padding-left: 20px; }
        li { margin-bottom: 6px; font-size: 13.5px; line-height: 1.8; color: ${C.text}; }
        @keyframes ticker {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-120%); }
        }
        .ticker-outer { overflow: hidden; flex: 1; min-width: 0; }
        .ticker-inner { display: inline-block; animation: ticker 40s linear infinite; white-space: nowrap; opacity: .85; }

        /* Buttons */
        .btn-apply {
          background: ${C.primary}; color: #fff; border: none;
          padding: 12px 28px; border-radius: 9px; font-weight: 700;
          font-size: 14px; font-family: 'Syne',sans-serif;
          display: inline-block; cursor: pointer; transition: background .2s;
          white-space: nowrap;
        }
        .btn-apply:hover { background: #0a3a65; }
        .btn-save {
          background: #fff; color: ${C.primary}; border: 1.5px solid ${C.primary};
          padding: 11px 22px; border-radius: 9px; font-weight: 600;
          font-size: 13.5px; cursor: pointer; transition: background .2s;
          white-space: nowrap;
        }
        .btn-save:hover { background: ${C.light}; }
        .btn-share {
          font-size: 13px; color: ${C.muted}; padding: 11px 14px;
          border-radius: 9px; border: 1px solid ${C.border};
          background: #fff; cursor: pointer; transition: background .2s;
          white-space: nowrap;
        }
        .btn-share:hover { background: ${C.light}; }

        /* Nav hover */
        .nav-link { transition: all .18s; }
        @media (hover: hover) {
          .nav-link:hover { background: ${C.light} !important; color: ${C.primary} !important; }
          .similar-card:hover { border-color: ${C.primary} !important; }
        }

        /* Responsive font helpers */
        @media (max-width: 639px) {
          .job-title { font-size: 19px !important; }
          .detail-grid { grid-template-columns: 1fr 1fr !important; }
          .action-row { flex-direction: column; align-items: stretch !important; }
          .action-row .btn-apply,
          .action-row .btn-save,
          .action-row .btn-share { width: 100%; text-align: center; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .job-title { font-size: 21px !important; }
          .detail-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .job-title { font-size: 24px !important; }
          .detail-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
          html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }
#root { width: 100% !important; overflow-x: hidden !important; }
      `}</style>
      

      <AlertBar 
  isMobile={false}
  C={{ accent: "#ff4d4f" }}
/>

      <TopTicker 
        isMobile={isMobile}
        isDesktop={isDesktop}
        C={C}
        gutter="16px"
        />
      {/* ────────────── NAVBAR ────────────── */}
      {/* <Navbar bp={bp} onMenuOpen={() => setDrawerOpen(true)} /> */}
      <Navbar 
  bp={{ isMobile: false, isTablet: false, isDesktop: true }}
  onMenuOpen={() => console.log("menu open")}
/>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ────────────── BREADCRUMB ────────────── */}
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: `12px ${gutter} 0` }}>
        <div style={{ fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <a href="http://localhost:5173" style={{ color: C.primary }}>Home</a>
          <span>›</span>
          <a href="#" style={{ color: C.primary }}>Software / IT Jobs</a>
          <span>›</span>
          <span style={{ color: C.text }}>{job.title}</span>
        </div>
      </div>

      {/* ────────────── MAIN CONTENT ────────────── */}
      <div style={{
        maxWidth: "100%",
        margin: "16px auto",
        padding: `0 ${gutter} 56px`,
        display: "flex",
        flexDirection: showSidebar ? "row" : "column",
        gap: 22,
        alignItems: "flex-start",
      }}>

        {/* ═════════════════════════════
            LEFT / FULL COLUMN
        ═════════════════════════════ */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── HERO JOB CARD ── */}
          <Card style={{ marginBottom: 14, borderLeft: `4px solid ${C.primary}` }}>

            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
<div
  style={{
    width: isMobile ? 54 : 72,
    height: isMobile ? 54 : 72,
    borderRadius: 12,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${C.border}`,
    flexShrink: 0,
    overflow: "hidden"
  }}
>
  <img
    src={job.companyLogo}
    alt={job.companyName}
    style={{
      width: "80%",
      height: "80%",
      objectFit: "contain"
    }}
  />
</div>

              {/* Title / company / meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ ...BADGE_STYLE[job.badge], fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>
                    {job.badgeLabel}
                  </span>
                  {job.verified && (
                    <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>
                      ✅ Verified
                    </span>
                  )}
                  <span style={{ background: "#fff7ed", color: "#c2410c", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>
                    {job.jobCategory}
                  </span>
                </div>

                <h1
                  className="job-title"
                  style={{
                    fontFamily: "'Syne',sans-serif", fontWeight: 800,
                    color: C.text, lineHeight: 1.2, marginBottom: 5,
                  }}
                >
                  {job.jobTitle}
                </h1>

                <div style={{ fontSize: isMobile ? 13.5 : 15, fontWeight: 600, color: C.primary, marginBottom: 10 }}>
                  {job.companyName}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <Tag>📍 {isMobile ? "Pune, MH" : job.location}</Tag>
                  <Tag>🏠 {job.workMode}</Tag>
<Tag>
  📅 {job.createdAt ? new Date(job.createdAt).toDateString() : "N/A"}
</Tag>
{!isMobile && job?.applicantsCount !== undefined && (
  <Tag>
    👥 {job.applicantsCount} applicants
  </Tag>
)}
                </div>
              </div>

              {/* Salary chip (tablet landscape+) */}
              {w >= 768 && (
                <div style={{
                  background: "linear-gradient(135deg,#f0fff4,#e8f5e9)",
                  border: "1.5px solid #86efac", borderRadius: 10,
                  padding: "14px 18px", textAlign: "center", flexShrink: 0,
                }}>
                  <div style={{ fontSize: 10.5, color: C.muted, marginBottom: 3, fontWeight: 600 }}>SALARY</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: C.green }}>
                    {job.salary}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{job.salaryNote}</div>
                </div>
              )}
            </div>

            {/* Salary strip for xs/sm (< 768) */}
            {w < 768 && (
              <div style={{
                marginTop: 12,
                background: "linear-gradient(135deg,#f0fff4,#e8f5e9)",
                border: "1.5px solid #86efac", borderRadius: 10,
                padding: "11px 14px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>SALARY RANGE</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: C.green }}>{job.salary}</div>
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>{job.salaryNote}</div>
              </div>
            )}

            <Divider />

            {/* Action buttons */}
            <div className="action-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <a href={job.jobLink} target="_blank" rel="noreferrer" className="btn-apply">
                Apply Now →
              </a>
              <button className="btn-save" onClick={() => setSaved(!saved)}>
                {saved ? "✅ Saved" : "🔖 Save Job"}
              </button>
<button className="btn-share" onClick={() => setShowShare(true)}>
  📤 Share
</button>
{showShare && (
  <div style={overlayStyle}>
    <div style={modalStyle}>
      
      <h3 style={{ marginBottom: "10px" }}>Share Job</h3>

      {/* Link Box */}
      <input
        type="text"
        value={`${window.location.origin}/view-job/${job.slug}`}
        readOnly
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "12px"
        }}
      />

      {/* Copy Button */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/view-job/${job.slug}`);
          alert("Link copied!");
        }}
        style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: "none",
          background: "#0f4c81",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Copy Link
      </button>

      <div style={{ marginTop: "18px", display: "flex", justifyContent: "center", gap: "12px" }}>

  {/* WhatsApp */}
  <a
    href={`https://wa.me/?text=${window.location.origin}/view-job/${job.slug}`}
    target="_blank"
    style={iconBtn("#25D366")}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M20.52 3.48A11.94 11.94 0 0012.02 0C5.39 0 .02 5.37.02 12c0 2.12.55 4.18 1.6 6L0 24l6.17-1.62A11.96 11.96 0 0012.02 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.5-8.52zM12.02 22c-1.82 0-3.6-.48-5.17-1.38l-.37-.22-3.66.96.98-3.57-.24-.37A9.93 9.93 0 012.02 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.49-7.32c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
    </svg>
  </a>

  {/* Twitter */}
  <a
    href={`https://twitter.com/intent/tweet?url=${window.location.origin}/view-job/${job.slug}`}
    target="_blank"
    style={iconBtn("#1DA1F2")}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.6 8.6 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9 12.14 12.14 0 01-8.82-4.47 4.28 4.28 0 001.32 5.7 4.24 4.24 0 01-1.94-.54v.05c0 2.06 1.46 3.78 3.4 4.17-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.72 2.14 2.97 4.02 3a8.58 8.58 0 01-5.3 1.83c-.34 0-.68-.02-1.01-.06A12.1 12.1 0 006.56 21c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.72 8.72 0 0022.46 6z"/>
    </svg>
  </a>

  {/* LinkedIn */}
  <a
    href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/view-job/${job.slug}`}
    target="_blank"
    style={iconBtn("#0077B5")}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M4.98 3.5C4.98 5 3.88 6 2.49 6S0 5 0 3.5 1.1 1 2.49 1 4.98 2 4.98 3.5zM.24 8.98h4.5V24H.24V8.98zM8.98 8.98h4.31v2.05h.06c.6-1.14 2.07-2.34 4.27-2.34 4.56 0 5.4 3 5.4 6.89V24h-4.5v-7.53c0-1.8-.03-4.12-2.51-4.12-2.51 0-2.89 1.96-2.89 3.98V24h-4.5V8.98z"/>
    </svg>
  </a>

  {/* Copy */}
  <div
    onClick={() => {
      navigator.clipboard.writeText(`${window.location.origin}/view-job/${job.slug}`);
      alert("Copied!");
    }}
    style={iconBtn("#6b7280")}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M16 1H4C2.9 1 2 1.9 2 3v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
  </div>


      </div>

      {/* Close */}
      <button
        onClick={() => setShowShare(false)}
        style={{
          marginTop: "20px",
          background: "transparent",
          border: "none",
          color: "#666",
          cursor: "pointer"
        }}
      >
        Close
      </button>

    </div>
  </div>
)}
            </div>

            {/* Expiry warning */}
            {/* <div style={{
              background: "#fff8e1", border: `1.5px solid ${C.gold}`,
              borderRadius: 9, padding: "10px 14px",
              display: "flex", alignItems: "flex-start",
              gap: 8, fontSize: 13, color: "#b45309", marginTop: 14,
              flexWrap: "wrap",
            }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>⏰</span>
              <div>
                <strong>Application Deadline:</strong> {job.expiryDate}&nbsp;|&nbsp;
                <span style={{ color: C.accent, fontWeight: 700 }}>{job.expiryDaysLeft} days remaining</span>
              </div>
            </div> */}
          </Card>

          {/* ── JOB DETAILS GRID ── */}
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle text="Job Details" />

            <div
              className="detail-grid"
              style={{ display: "grid", gap: isMobile ? 16 : 20 }}
            >
              {[
                ["Job Type",         <Pill bg="#e8f4fd"  color={C.primary}>{job.jobType}</Pill>],
                ["Job Category",     <Pill bg="#fff0f0"  color={C.accent}>{job.jobCategory}</Pill>],
                ["Experience Level", <Pill bg="#dcfce7"  color="#15803d">{job.experienceLevel}</Pill>],
                ["Work Mode",        <div style={{ fontSize: 13.5, fontWeight: 500 }}>🏠 {job.workMode}</div>],
                ["Location",         <div style={{ fontSize: 13.5, fontWeight: 500 }}>📍 {isMobile ? "Pune, MH" : job.location}</div>],
                ["Education",        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{job.education}</div>],
                ["Eligible Batch",   <div style={{ fontSize: 13.5, fontWeight: 500 }}>{job.eligibleBatches}</div>],
                ["Department",       <div style={{ fontSize: 13.5, fontWeight: 500 }}>{job.department}</div>],
                ["Openings",         <div style={{ fontSize: 13.5, fontWeight: 500 }}>{job.openings} positions</div>],
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <SectionLabel>{lbl}</SectionLabel>
                  {val}
                </div>
              ))}
            </div>

            <Divider />

            <SectionLabel>Required Skills</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
              {job.skills?.map((s) => <SkillTag key={s} label={s} />)}
            </div>
          </Card>

          {/* ── JOB DESCRIPTION ── */}
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle text="Job Description" />

            <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.8, marginBottom: 20 }}>
              {job.jobDescription || "No description available."}
            </p>

<div style={{ marginBottom: 20 }}>
  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>
    Key Responsibilities
  </div>

  {Array.isArray(job?.responsibilities) && job.responsibilities.length > 0 ? (
    <ul>
      {job.responsibilities.map((r, i) => (
        <li key={i}>{r}</li>
      ))}
    </ul>
  ) : (
    <p style={{ color: "#6b7280" }}>Not specified</p>
  )}
</div>

<div style={{ marginBottom: 20 }}>
  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>
    Qualifications
  </div>

  {Array.isArray(job?.qualifications) && job.qualifications.length > 0 ? (
    <ul>
      {job.qualifications.map((q, i) => (
        <li key={i}>{q}</li>
      ))}
    </ul>
  ) : (
    <p style={{ color: "#6b7280" }}>Not specified</p>
  )}
</div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Perks &amp; Benefits</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {job.perks?.map((p) => <Tag key={p}>{p}</Tag>)}
              </div>
            </div>
          </Card>

          {/* ── HOW TO APPLY ── */}
          <Card style={{ marginBottom: 14, background: "linear-gradient(135deg,#f0f7ff,#e8f4fd)", borderColor: "#bdd6f0" }}>
            <SectionTitle text="How to Apply" />
            <p style={{ fontSize: 13.5, color: C.muted, marginBottom: 14 }}>
              Click the button below to visit the official {job.company} careers page. Make sure your resume is updated before applying.
            </p>
            <div style={{
              background: "#fff", border: `1.5px solid ${C.border}`,
              borderRadius: 9, padding: "12px 16px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between", gap: 12,
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <SectionLabel>OFFICIAL JOB LINK</SectionLabel>
                <div style={{ fontSize: 13, color: C.primary, wordBreak: "break-all", marginTop: 3 }}>
                  {job.jobLink}
                </div>
              </div>
              <a
                href={job.jobLink} target="_blank" rel="noreferrer"
                className="btn-apply"
                style={{ flexShrink: 0 }}
              >
                Apply on {job.company?.split(",")[0]} →
              </a>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
              ⚠️ CodeTechniques does not charge any fee for applying. This is a free listing.
            </div>
          </Card>

          {/* Sidebar shown BELOW content on mobile/tablet */}
          {!showSidebar && (
            <div style={{ marginTop: 8 }}>
              <Sidebar job={job} />
            </div>
          )}
        </div>

        {/* ═════════════════════════════
            RIGHT SIDEBAR (desktop ≥1024)
        ═════════════════════════════ */}
        {showSidebar && (
          <div style={{ width: w >= 1280 ? 300 : 260, flexShrink: 0 }}>
            <Sidebar job={job} />
          </div>
        )}
      </div>

      {/* ────────────── BOTTOM AD STRIP ────────────── */}
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: `0 ${gutter} 20px` }}>
        <div style={{
          background: "linear-gradient(90deg,#f0fff4,#e8f5e9)",
          border: "1.5px dashed #86efac", borderRadius: 10,
          padding: "12px 16px", display: "flex",
          flexWrap: "wrap", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 9.5, color: "#999", border: "1px solid #ddd", padding: "1px 5px", borderRadius: 3 }}>AD</span>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: `linear-gradient(135deg,${C.gold},${C.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 18, flexShrink: 0,
          }}>💰</div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <strong style={{ fontSize: isMobile ? 12.5 : 13.5, display: "block" }}>
              Earn While You Learn — Referral Bonus up to ₹5,000
            </strong>
            <span style={{ fontSize: isMobile ? 11 : 12, color: C.muted }}>
              Refer a friend to CodeTechniques Premium &amp; earn per referral
            </span>
          </div>
          <a
            href="#"
            style={{
              background: C.green, color: "#fff", padding: "8px 16px",
              borderRadius: 7, fontWeight: 600, fontSize: 12.5, whiteSpace: "nowrap",
            }}
          >
            Learn More →
          </a>
        </div>
      </div>
<Footer 
  bp={{ isMobile: false, isTablet: false, isDesktop: true }}
  gutter="16px"
/>
        </div>

  );
}