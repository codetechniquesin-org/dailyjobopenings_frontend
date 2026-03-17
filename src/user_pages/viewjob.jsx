import { useState, useEffect } from "react";

/* ── THEME ─────────────────────────────────────────────────────── */
const C = {
  primary: "#0f4c81",
  accent: "#e8472a",
  gold: "#f5a623",
  light: "#f4f7fb",
  green: "#16a34a",
  text: "#1a1a2e",
  muted: "#6b7280",
  border: "#e2e8f0",
};

/* ── SAMPLE JOB DATA ────────────────────────────────────────────── */
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
  { logo: "I", logoBg: "#fff0f0", logoColor: "#e8472a", title: "Systems Engineer", company: "Infosys", salary: "₹3.6–5.0 LPA" },
  { logo: "W", logoBg: "#ede9fe", logoColor: "#7c3aed", title: "NLTH Elite Engineer", company: "Wipro", salary: "₹3.5 LPA" },
  { logo: "G", logoBg: "#fef9c3", logoColor: "#a16207", title: "STEP Intern 2026", company: "Google", salary: "₹80K/month" },
];

const NAV_LINKS = ["Home", "Freshers Jobs", "Work From Home", "Internships", "Interview Tips", "By Location"];

const BADGE_STYLE = {
  featured: { bg: "#fff8e1", color: "#b45309" },
  hot: { bg: "#fee2e2", color: "#b91c1c" },
  new: { bg: "#dcfce7", color: "#15803d" },
  remote: { bg: "#ede9fe", color: "#6d28d9" },
};

/* ── HOOK ───────────────────────────────────────────────────────── */
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ── SMALL COMPONENTS ───────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.muted, background: C.light, padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function SkillTag({ label }) {
  return (
    <span style={{ background: "#e8f4fd", color: C.primary, fontSize: 12, padding: "4px 10px", borderRadius: 5, fontWeight: 500, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function SectionTitle({ text }) {
  return (
    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, margin: "0 0 18px" }}>
      <span style={{ width: 4, height: 20, background: C.accent, borderRadius: 3, display: "inline-block", flexShrink: 0 }} />
      {text}
    </h2>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, ...style }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "18px 0" }} />;
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>
      {children}
    </div>
  );
}

/* ── MOBILE DRAWER ──────────────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 300 }} />
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 280, background: "#fff", zIndex: 400, overflowY: "auto", boxShadow: "4px 0 24px rgba(0,0,0,.15)" }}>
        <div style={{ background: C.primary, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#fff" }}>
            Code<span style={{ color: C.gold }}>Techniques</span>
          </span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: 7, width: 30, height: 30, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: 12 }}>
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" onClick={onClose} style={{ display: "block", padding: "11px 12px", borderRadius: 7, fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 2 }}>{link}</a>
          ))}
          <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
          <a href="#" style={{ display: "block", background: C.accent, color: "#fff", padding: "11px 12px", borderRadius: 8, fontWeight: 700, fontSize: 14, textAlign: "center" }}>📢 Post a Job</a>
        </div>
      </div>
    </>
  );
}

/* ── NAVBAR ─────────────────────────────────────────────────────── */
function Navbar({ isMobile, isTablet, isDesktop, onMenuOpen }) {
  return (
    <nav style={{ background: "#fff", borderBottom: `2px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 12px" : "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: isMobile ? 56 : 64 }}>
        {/* Brand */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: isMobile ? 34 : 40, height: isMobile ? 34 : 40, borderRadius: 9, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff", fontFamily: "'Syne', sans-serif" }}>CT</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: isMobile ? 17 : 21, color: C.primary, whiteSpace: "nowrap" }}>
            Code<span style={{ color: C.accent }}>Techniques</span>
          </span>
        </a>

        {/* Desktop nav */}
        {isDesktop && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {NAV_LINKS.map((item, i) => (
              <a key={item} href="#" style={{ fontSize: 13, fontWeight: 500, padding: "7px 11px", borderRadius: 6, color: i === 0 ? C.primary : C.text, background: i === 0 ? C.light : "transparent", whiteSpace: "nowrap" }}>{item}</a>
            ))}
            <a href="#" style={{ background: C.accent, color: "#fff", padding: "7px 16px", borderRadius: 7, fontWeight: 600, fontSize: 13, marginLeft: 6, fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap" }}>Post a Job</a>
          </div>
        )}

        {/* Tablet */}
        {isTablet && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="#" style={{ background: C.accent, color: "#fff", padding: "7px 14px", borderRadius: 7, fontWeight: 600, fontSize: 12.5 }}>Post a Job</a>
            <button onClick={onMenuOpen} style={{ background: "none", border: `1.5px solid ${C.border}`, borderRadius: 8, width: 38, height: 38, cursor: "pointer", fontSize: 20 }}>☰</button>
          </div>
        )}

        {/* Mobile */}
        {isMobile && (
          <button onClick={onMenuOpen} style={{ background: "none", border: `1.5px solid ${C.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>☰</button>
        )}
      </div>
    </nav>
  );
}

/* ── SIDEBAR ────────────────────────────────────────────────────── */
function Sidebar({ job }) {
  return (
    <div style={{ width: 290, flexShrink: 0 }}>
      {/* Company Card */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 14, color: C.text }}>🏢 About the Company</div>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: job.logoBg, color: job.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, fontFamily: "'Syne', sans-serif", border: `1px solid ${C.border}`, flexShrink: 0 }}>{job.logo}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{job.company}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{job.companyParent}</div>
          </div>
        </div>
        {[
          ["Industry", job.companyIndustry],
          ["Size", job.companySize],
          ["Founded", job.companyFounded],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.muted }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{val}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0" }}>
          <span style={{ color: C.muted }}>Rating</span>
          <span style={{ fontWeight: 600, color: C.gold }}>⭐ {job.companyRating} / 5</span>
        </div>
        <a href="#" style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 12.5, color: C.primary, fontWeight: 600, border: `1.5px solid ${C.border}`, borderRadius: 7, padding: 7 }}>
          View All Jobs at {job.company.split(",")[0]} →
        </a>
      </Card>

      {/* Job Summary */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 14, color: C.text }}>📋 Job Summary</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["📌", "JOB ROLE", job.role],
            ["💼", "JOB TYPE", job.jobType],
            ["🎯", "EXPERIENCE", job.experience],
            ["🏠", "WORK MODE", job.workModeDetail],
            ["📍", "LOCATION", job.location],
          ].map(([icon, label, val]) => (
            <div key={label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{val}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>💰</span>
            <div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>SALARY</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{job.salary}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>⏰</span>
            <div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>LAST DATE</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{job.expiryDate}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Ad */}
      <div style={{ background: "linear-gradient(135deg,#0f4c81,#1565c0)", color: "#fff", borderRadius: 12, padding: 18, textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", marginBottom: 7 }}>Advertisement</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>🚀 Launch Your Tech Career</div>
        <p style={{ fontSize: 12, opacity: 0.85, marginBottom: 14 }}>GeeksforGeeks Bootcamp – Job Guarantee for 2026 Batch</p>
        <a href="#" style={{ background: C.gold, color: "#000", padding: "8px 18px", borderRadius: 7, fontWeight: 700, fontSize: 13, display: "inline-block", fontFamily: "'Syne', sans-serif" }}>Join Now →</a>
      </div>

      {/* Similar Jobs */}
      <Card>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12, color: C.text }}>🔍 Similar Jobs</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SIMILAR_JOBS.map((j) => (
            <a key={j.title} href="#" style={{ display: "flex", gap: 9, padding: 9, borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", textDecoration: "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 7, background: j.logoBg, color: j.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{j.logo}</div>
              <div>
                <strong style={{ fontSize: 12.5, display: "block", color: C.text }}>{j.title}</strong>
                <span style={{ fontSize: 11.5, color: C.muted }}>{j.company} · {j.salary}</span>
              </div>
            </a>
          ))}
        </div>
        <a href="#" style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 12.5, color: C.primary, fontWeight: 600 }}>View All Software Jobs →</a>
      </Card>
    </div>
  );
}

/* ── MAIN APP ───────────────────────────────────────────────────── */
export default function JobPostingPage() {
  const w = useWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const job = JOB;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.light, color: C.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        a{text-decoration:none;color:inherit;}
        ul{list-style:disc;padding-left:20px;}
        li{margin-bottom:6px;font-size:13.5px;line-height:1.75;color:${C.text};}
        @keyframes ticker{0%{transform:translateX(100%)}100%{transform:translateX(-120%)}}
        .ticker{display:inline-block;animation:ticker 38s linear infinite;white-space:nowrap;}
        .apply-btn{background:${C.primary};color:#fff;padding:12px 28px;border-radius:9px;font-weight:700;font-size:14.5px;font-family:'Syne',sans-serif;display:inline-block;cursor:pointer;transition:background .2s;}
        .apply-btn:hover{background:#0a3a65;}
        .save-btn{background:#fff;color:${C.primary};border:1.5px solid ${C.primary};padding:11px 22px;border-radius:9px;font-weight:600;font-size:14px;display:inline-block;cursor:pointer;transition:all .2s;}
        .save-btn:hover{background:${C.light};}
        .share-btn{font-size:13px;color:${C.muted};padding:11px 14px;border-radius:9px;border:1px solid ${C.border};background:#fff;cursor:pointer;transition:background .2s;}
        .share-btn:hover{background:${C.light};}
        .nav-a:hover{background:${C.light};color:${C.primary};}
        .similar-card:hover{border-color:${C.primary} !important;}
      `}</style>

      {/* ALERT BAR */}
      <div style={{ background: `linear-gradient(90deg,${C.accent},#c0392b)`, color: "#fff", textAlign: "center", padding: isMobile ? "8px 12px" : "9px 16px", fontSize: isMobile ? 12 : 13 }}>
        🎉 New jobs added today from Amazon, TCS, Infosys &amp; more!&nbsp;
        <a href="#" style={{ color: "#fff", textDecoration: "underline" }}>View Latest →</a>
      </div>

      {/* TOP BAR */}
      {!isMobile && (
        <div style={{ background: C.primary, color: "#fff", fontSize: 11.5, padding: "5px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", flex: 1 }}>
              <span style={{ background: C.accent, color: "#fff", borderRadius: 3, padding: "1px 8px", fontWeight: 700, fontSize: 10, whiteSpace: "nowrap" }}>🔥 HOT</span>
              <div style={{ overflow: "hidden" }}>
                <span className="ticker" style={{ opacity: 0.85 }}>
                  TCS BPS Hiring 2026 &nbsp;|&nbsp; Amazon WFH &nbsp;|&nbsp; Wipro NLTH 2026 &nbsp;|&nbsp; Infosys Systems Engineer &nbsp;|&nbsp; Google Internship 2026 &nbsp;|&nbsp; Deloitte Fresher Drive
                </span>
              </div>
            </div>
            {isDesktop && (
              <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
                {["About", "Contact", "Privacy"].map((l) => <a key={l} href="#" style={{ color: "#c8d8ea" }}>{l}</a>)}
                <a href="#" style={{ color: C.gold, fontWeight: 600 }}>Advertise With Us</a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <Navbar isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} onMenuOpen={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* BREADCRUMB */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "12px 12px 0" : "14px 20px 0" }}>
        <div style={{ fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <a href="#" style={{ color: C.primary }}>Home</a>
          <span>›</span>
          <a href="#" style={{ color: C.primary }}>Software / IT Jobs</a>
          <span>›</span>
          <span>{job.title} – {job.company}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1200, margin: "16px auto", padding: isMobile ? "0 12px 40px" : "0 20px 48px", display: "flex", gap: 22, alignItems: "flex-start" }}>

        {/* ── LEFT / FULL ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* COMPANY HEADER CARD */}
          <Card style={{ marginBottom: 14, borderLeft: `4px solid ${C.primary}` }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Logo */}
              <div style={{ width: isMobile ? 56 : 72, height: isMobile ? 56 : 72, borderRadius: 12, background: job.logoBg, color: job.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: isMobile ? 22 : 28, fontFamily: "'Syne', sans-serif", border: `1px solid ${C.border}`, flexShrink: 0 }}>
                {job.logo}
              </div>

              <div style={{ flex: 1, minWidth: 180 }}>
                {/* Badges */}
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ ...BADGE_STYLE[job.badge], display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 5 }}>{job.badgeLabel}</span>
                  {job.verified && <span style={{ background: "#dcfce7", color: "#15803d", display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 5 }}>✅ Verified</span>}
                  <span style={{ background: "#fff7ed", color: "#c2410c", display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 5 }}>{job.category}</span>
                </div>
                {/* Title */}
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 18 : 22, fontWeight: 800, color: C.text, lineHeight: 1.25, marginBottom: 5 }}>{job.title}</h1>
                {/* Company */}
                <div style={{ fontSize: 15, fontWeight: 600, color: C.primary, marginBottom: 10 }}>{job.company}</div>
                {/* Meta tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  <Tag>📍 {isMobile ? "Pune" : job.location}</Tag>
                  <Tag>🏠 {job.workMode}</Tag>
                  <Tag>📅 Posted {job.postedAgo}</Tag>
                  {!isMobile && <Tag>👥 {job.applicants}</Tag>}
                </div>
              </div>

              {/* Salary highlight */}
              {!isMobile && (
                <div style={{ background: "linear-gradient(135deg,#f0fff4,#e8f5e9)", border: "1.5px solid #86efac", borderRadius: 10, padding: "14px 18px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 3, fontWeight: 500 }}>SALARY RANGE</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: C.green }}>{job.salary}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{job.salaryNote}</div>
                </div>
              )}
            </div>

            {/* Mobile salary */}
            {isMobile && (
              <div style={{ marginTop: 12, background: "linear-gradient(135deg,#f0fff4,#e8f5e9)", border: "1.5px solid #86efac", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>SALARY RANGE</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: C.green }}>{job.salary}</div>
                </div>
                <div style={{ fontSize: 11.5, color: C.muted }}>{job.salaryNote}</div>
              </div>
            )}

            <Divider />

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <a href={job.jobLink} target="_blank" rel="noreferrer" className="apply-btn">Apply Now →</a>
              <button className="save-btn" onClick={() => setSaved(!saved)}>
                {saved ? "✅ Saved" : "🔖 Save Job"}
              </button>
              <button className="share-btn">📤 Share</button>
            </div>

            {/* Expiry warning */}
            <div style={{ background: "#fff8e1", border: `1.5px solid ${C.gold}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#b45309", marginTop: 14 }}>
              <span>⏰</span>
              <div>
                <strong>Application Deadline:</strong> {job.expiryDate} &nbsp;|&nbsp;
                <span style={{ color: C.accent, fontWeight: 600 }}>{job.expiryDaysLeft} days remaining</span>
              </div>
            </div>
          </Card>

          {/* JOB DETAILS CARD */}
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle text="Job Details" />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 20 }}>
              {[
                ["Job Type", <span style={{ background: "#e8f4fd", color: C.primary, padding: "4px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{job.jobType}</span>],
                ["Job Category", <span style={{ background: "#fff0f0", color: C.accent, padding: "4px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{job.category}</span>],
                ["Experience Level", <span style={{ background: "#dcfce7", color: "#15803d", padding: "4px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{job.experienceLevel}</span>],
                ["Work Mode", <div style={{ fontSize: 14, fontWeight: 500 }}>🏠 {job.workModeDetail}</div>],
                ["Location", <div style={{ fontSize: 14, fontWeight: 500 }}>📍 {isMobile ? "Pune, MH" : job.location}</div>],
                ["Education", <div style={{ fontSize: 14, fontWeight: 500 }}>{job.education}</div>],
                ["Eligible Batch", <div style={{ fontSize: 14, fontWeight: 500 }}>{job.eligibleBatch}</div>],
                ["Department", <div style={{ fontSize: 14, fontWeight: 500 }}>{job.department}</div>],
                ["Openings", <div style={{ fontSize: 14, fontWeight: 500 }}>{job.openings} positions</div>],
              ].map(([label, val]) => (
                <div key={label}>
                  <SectionLabel>{label}</SectionLabel>
                  {val}
                </div>
              ))}
            </div>

            <Divider />

            <div>
              <SectionLabel style={{ marginBottom: 10 }}>Required Skills</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
                {job.skills.map((s) => <SkillTag key={s} label={s} />)}
              </div>
            </div>
          </Card>

          {/* JOB DESCRIPTION CARD */}
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle text="Job Description" />

            <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.75, marginBottom: 20 }}>{job.description}</p>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, marginBottom: 10 }}>Key Responsibilities</div>
              <ul>
                {job.responsibilities.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, marginBottom: 10 }}>Qualifications</div>
              <ul>
                {job.qualifications.map((q) => <li key={q}>{q}</li>)}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, marginBottom: 10 }}>Perks &amp; Benefits</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {job.perks.map((p) => <Tag key={p}>{p}</Tag>)}
              </div>
            </div>
          </Card>

          {/* HOW TO APPLY CARD */}
          <Card style={{ marginBottom: 14, background: "linear-gradient(135deg,#f0f7ff,#e8f4fd)", borderColor: "#bdd6f0" }}>
            <SectionTitle text="How to Apply" />
            <p style={{ fontSize: 13.5, color: C.muted, marginBottom: 14 }}>
              Click the button below to visit the official {job.company} careers page and complete your application. Make sure your resume is updated before applying.
            </p>
            <div style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 9, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 2, fontWeight: 600 }}>OFFICIAL JOB LINK</div>
                <div style={{ fontSize: 13, color: C.primary, wordBreak: "break-all" }}>{job.jobLink}</div>
              </div>
              <a href={job.jobLink} target="_blank" rel="noreferrer" className="apply-btn" style={{ flexShrink: 0 }}>
                Apply on {job.company.split(",")[0]} →
              </a>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
              <span>⚠️</span> CodeTechniques does not charge any fee for applying. This is a free listing.
            </div>
          </Card>

          {/* Mobile sidebar content */}
          {(isMobile || isTablet) && (
            <div style={{ marginTop: 8 }}>
              <Sidebar job={job} />
            </div>
          )}
        </div>

        {/* ── SIDEBAR (desktop only) ── */}
        {isDesktop && <Sidebar job={job} />}
      </div>

      {/* BOTTOM AD STRIP */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 12px 16px" : "0 20px 20px" }}>
        <div style={{ background: "linear-gradient(90deg,#f0fff4,#e8f5e9)", border: "1.5px dashed #86efac", borderRadius: 10, padding: "11px 14px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 9.5, color: "#999", border: "1px solid #ddd", padding: "1px 5px", borderRadius: 3 }}>AD</span>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: `linear-gradient(135deg,${C.gold},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, flexShrink: 0 }}>💰</div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <strong style={{ fontSize: 13.5, display: "block" }}>Earn While You Learn — Referral Bonus up to ₹5,000</strong>
            <span style={{ fontSize: 12, color: C.muted }}>Refer a friend to CodeTechniques Premium &amp; earn per referral</span>
          </div>
          <a href="#" style={{ background: C.green, color: "#fff", padding: "7px 14px", borderRadius: 7, fontWeight: 600, fontSize: 12.5, marginLeft: "auto" }}>Learn More →</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0d1b2a", color: "#c8d6e5", padding: isMobile ? "32px 0 20px" : "48px 0 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 14px" : "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 24 : 28, marginBottom: 28 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff", fontFamily: "'Syne', sans-serif" }}>CT</div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}>Code<span style={{ color: C.accent }}>Techniques</span></span>
              </div>
              <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.7, marginBottom: 16 }}>
                India's most trusted job portal for freshers & recent graduates. 100% verified job postings updated daily.
              </p>
              <div style={{ display: "flex", maxWidth: 300 }}>
                <input type="email" placeholder="Email for job alerts" style={{ flex: 1, background: "#1a2e44", border: "1px solid #2a3f5a", color: "#fff", fontSize: 12, borderRadius: "7px 0 0 7px", padding: "9px 11px", outline: "none" }} />
                <button style={{ background: C.accent, color: "#fff", border: "none", padding: "9px 13px", borderRadius: "0 7px 7px 0", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Subscribe</button>
              </div>
            </div>

            {!isMobile && (
              <>
                <div>
                  <h6 style={{ fontFamily: "'Syne', sans-serif", fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Fresher Jobs</h6>
                  {["2026 Batch Jobs", "2025 Batch Jobs", "Software/IT Jobs", "Government Jobs", "MBA/BBA Jobs", "Walk-in Jobs"].map((l) => (
                    <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "#8a9bb5", marginBottom: 7 }}>{l}</a>
                  ))}
                </div>
                <div>
                  <h6 style={{ fontFamily: "'Syne', sans-serif", fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Resources</h6>
                  {["Interview Questions", "Resume Tips", "Off Campus Alerts", "Salary Guide 2026", "Course Reviews"].map((l) => (
                    <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "#8a9bb5", marginBottom: 7 }}>{l}</a>
                  ))}
                </div>
                <div>
                  <h6 style={{ fontFamily: "'Syne', sans-serif", fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Company</h6>
                  {["About Us", "Contact Us", "Advertise With Us", "Privacy Policy", "Disclaimer", "Sitemap"].map((l) => (
                    <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "#8a9bb5", marginBottom: 7 }}>{l}</a>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ borderTop: "1px solid #1e3047", paddingTop: 14, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <p style={{ fontSize: 11.5, opacity: 0.5 }}>© 2026 CodeTechniques India. All rights reserved.</p>
            <div style={{ display: "flex", gap: 14 }}>
              {["Privacy", "Terms", "Cookies"].map((l) => (
                <a key={l} href="#" style={{ fontSize: 11.5, color: "#8a9bb5" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}