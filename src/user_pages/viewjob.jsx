import { useState, useEffect } from "react";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import AlertBar from "../components/alertbar";

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

/* ─────────────────────────────────────────────
   JOB DATA
───────────────────────────────────────────── */
const JOB = {
  id: 1,
  title: "Associate Software Engineer",
  role: "Software Engineer – Cloud & Linux Platform",
  company: "Red Hat, Inc.",
  companyParent: "An IBM Company",
  companyIndustry: "Open Source / Cloud",
  companySize: "20,000+ employees",
  companyFounded: "1993, North Carolina",
  companyRating: "4.3",
  logo: "R",
  logoBg: "#e8f4fd",
  logoColor: "#0f4c81",
  badge: "new",
  badgeLabel: "🆕 New",
  verified: true,
  category: "Software / IT",
  jobType: "Full-Time, Permanent",
  experienceLevel: "Entry Level / Fresher",
  experience: "0 – 2 Years (Freshers OK)",
  workMode: "Hybrid",
  workModeDetail: "Hybrid – 3 Days Office",
  location: "Pune, Maharashtra, India",
  salary: "₹8.0 – 12.0 LPA",
  salaryNote: "Annual CTC",
  department: "Engineering – Cloud & Linux",
  openings: 15,
  eligibleBatch: "2023 – 2025 Passout",
  education: "B.E / B.Tech / M.Tech",
  applicants: "2–10 applicants",
  postedAgo: "2 days ago",
  expiryDate: "April 15, 2026",
  expiryDaysLeft: 12,
  jobLink: "https://www.redhat.com/en/jobs/2026/ase-pune-fresher-batch",
  skills: ["Linux", "Python", "Go (Golang)", "Kubernetes", "Docker", "REST APIs", "Git / GitHub", "CI/CD", "Cloud (AWS/GCP)"],
  perks: ["🏥 Health Insurance", "📚 Learning Stipend", "🌴 Paid Leave", "🍽 Meal Allowance", "🎯 Performance Bonus", "💻 Laptop Provided"],
  description: `Red Hat is looking for a passionate Associate Software Engineer to join its Engineering division in Pune. In this role, you will work on open-source cloud infrastructure projects, contributing to products like OpenShift, Ansible, and RHEL. You'll collaborate with globally distributed teams to design, build, and ship enterprise-grade software.`,
  responsibilities: [
    "Design and develop features for Red Hat's open-source software portfolio",
    "Write clean, maintainable code in Python and Go with proper test coverage",
    "Participate in code reviews, standups, and sprint planning",
    "Deploy and manage containerized workloads using Kubernetes and Docker",
    "Collaborate with upstream open-source communities (CNCF, Linux Foundation)",
    "Troubleshoot production issues and contribute to RCA documentation",
  ],
  qualifications: [
    "B.E / B.Tech / M.Tech in CS, IT, ECE, or related field (2023–2025 batch)",
    "Strong foundation in Data Structures, Algorithms, and OS concepts",
    "Hands-on experience with Linux command-line environment",
    "Familiarity with at least one scripting language (Python preferred)",
    "Good written and verbal communication skills",
  ],
};

const SIMILAR_JOBS = [
  { logo: "I", logoBg: "#fff0f0", logoColor: "#e8472a", title: "Systems Engineer",    company: "Infosys", salary: "₹3.6–5.0 LPA" },
  { logo: "W", logoBg: "#ede9fe", logoColor: "#7c3aed", title: "NLTH Elite Engineer", company: "Wipro",   salary: "₹3.5 LPA" },
  { logo: "G", logoBg: "#fef9c3", logoColor: "#a16207", title: "STEP Intern 2026",    company: "Google",  salary: "₹80K/month" },
];

const NAV_LINKS = ["Home", "Freshers Jobs", "Work From Home", "Internships", "Interview Tips", "By Location"];

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
              📢 Post a Job
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
<Navbar 
  bp={{ isMobile: false, isTablet: false, isDesktop: true }}
  onMenuOpen={() => console.log("menu open")}
/>
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

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
function Sidebar({ job }) {
  return (
    <div style={{ width: "100%" }}>

      {/* Company Card */}
      <SidebarWidget title="🏢 About the Company">
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: job.logoBg, color: job.logoColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 20, fontFamily: "'Syne',sans-serif",
            border: `1px solid ${C.border}`, flexShrink: 0,
          }}>
            {job.logo}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{job.company}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{job.companyParent}</div>
          </div>
        </div>
        {[
          ["Industry", job.companyIndustry],
          ["Size",     job.companySize],
          ["Founded",  job.companyFounded],
        ].map(([lbl, val]) => (
          <div key={lbl} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.muted }}>{lbl}</span>
            <span style={{ fontWeight: 500 }}>{val}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "5px 0" }}>
          <span style={{ color: C.muted }}>Rating</span>
          <span style={{ fontWeight: 600, color: C.gold }}>⭐ {job.companyRating} / 5</span>
        </div>
        <a
          href="#"
          style={{
            display: "block", textAlign: "center", marginTop: 12,
            fontSize: 12.5, color: C.primary, fontWeight: 600,
            border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "8px 0",
          }}
        >
          View All Jobs at {job.company.split(",")[0]} →
        </a>
      </SidebarWidget>

      {/* Job Summary */}
      <SidebarWidget title="📋 Job Summary">
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {[
            ["📌", "JOB ROLE",   job.role],
            ["💼", "JOB TYPE",   job.jobType],
            ["🎯", "EXPERIENCE", job.experience],
            ["🏠", "WORK MODE",  job.workModeDetail],
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
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 2 }}>⏰</span>
            <div>
              <SectionLabel>LAST DATE</SectionLabel>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{job.expiryDate}</div>
            </div>
          </div>
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
      <SidebarWidget title="🔍 Similar Jobs">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SIMILAR_JOBS.map((j) => (
            <a
              key={j.title} href="#"
              style={{
                display: "flex", gap: 10, padding: 10,
                borderRadius: 9, border: `1px solid ${C.border}`,
                textDecoration: "none",
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: j.logoBg, color: j.logoColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>
                {j.logo}
              </div>
              <div>
                <strong style={{ fontSize: 13, display: "block", color: C.text }}>{j.title}</strong>
                <span style={{ fontSize: 11.5, color: C.muted }}>{j.company} · {j.salary}</span>
              </div>
            </a>
          ))}
        </div>
        <a href="#" style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 12.5, color: C.primary, fontWeight: 600 }}>
          View All Software Jobs →
        </a>
      </SidebarWidget>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function ViewJob() {
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop, showSidebar, w } = bp;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const job = JOB;

  const gutter = isMobile ? "14px" : isTablet ? "20px" : "24px";

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.light, color: C.text, minHeight: "100vh" }}>
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
      <Navbar bp={bp} onMenuOpen={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ────────────── BREADCRUMB ────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `12px ${gutter} 0` }}>
        <div style={{ fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <a href="#" style={{ color: C.primary }}>Home</a>
          <span>›</span>
          <a href="#" style={{ color: C.primary }}>Software / IT Jobs</a>
          <span>›</span>
          <span style={{ color: C.text }}>{job.title}</span>
        </div>
      </div>

      {/* ────────────── MAIN CONTENT ────────────── */}
      <div style={{
        maxWidth: 1280, margin: "16px auto",
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
              {/* Company logo */}
              <div style={{
                width: isMobile ? 54 : 72, height: isMobile ? 54 : 72,
                borderRadius: 12, background: job.logoBg, color: job.logoColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: isMobile ? 22 : 30,
                fontFamily: "'Syne',sans-serif",
                border: `1px solid ${C.border}`, flexShrink: 0,
              }}>
                {job.logo}
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
                    {job.category}
                  </span>
                </div>

                <h1
                  className="job-title"
                  style={{
                    fontFamily: "'Syne',sans-serif", fontWeight: 800,
                    color: C.text, lineHeight: 1.2, marginBottom: 5,
                  }}
                >
                  {job.title}
                </h1>

                <div style={{ fontSize: isMobile ? 13.5 : 15, fontWeight: 600, color: C.primary, marginBottom: 10 }}>
                  {job.company}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <Tag>📍 {isMobile ? "Pune, MH" : job.location}</Tag>
                  <Tag>🏠 {job.workMode}</Tag>
                  <Tag>📅 {job.postedAgo}</Tag>
                  {!isMobile && <Tag>👥 {job.applicants}</Tag>}
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
              <button className="btn-share">📤 Share</button>
            </div>

            {/* Expiry warning */}
            <div style={{
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
            </div>
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
                ["Job Category",     <Pill bg="#fff0f0"  color={C.accent}>{job.category}</Pill>],
                ["Experience Level", <Pill bg="#dcfce7"  color="#15803d">{job.experienceLevel}</Pill>],
                ["Work Mode",        <div style={{ fontSize: 13.5, fontWeight: 500 }}>🏠 {job.workModeDetail}</div>],
                ["Location",         <div style={{ fontSize: 13.5, fontWeight: 500 }}>📍 {isMobile ? "Pune, MH" : job.location}</div>],
                ["Education",        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{job.education}</div>],
                ["Eligible Batch",   <div style={{ fontSize: 13.5, fontWeight: 500 }}>{job.eligibleBatch}</div>],
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
              {job.skills.map((s) => <SkillTag key={s} label={s} />)}
            </div>
          </Card>

          {/* ── JOB DESCRIPTION ── */}
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle text="Job Description" />

            <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.8, marginBottom: 20 }}>
              {job.description}
            </p>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Key Responsibilities</div>
              <ul>{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Qualifications</div>
              <ul>{job.qualifications.map((q) => <li key={q}>{q}</li>)}</ul>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Perks &amp; Benefits</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {job.perks.map((p) => <Tag key={p}>{p}</Tag>)}
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
                Apply on {job.company.split(",")[0]} →
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
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${gutter} 20px` }}>
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