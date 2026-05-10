import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import AlertBar from "../components/alertbar";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import WalkInJobCard from "../components/walkin_page_components/walkin_job_card";

const C = {
  primary: "#0a2540",
  accent: "#ff4d4f",
  gold: "#f5a623",
  light: "#f3f4f6",
  green: "#16a34a",
  text: "#374151",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#f4f7fb",
  purple: "#7c3aed",
  purpleLight: "#f3e8ff",
  purpleBorder: "#c4b5fd",
  purpleDark: "#4c1d95",
};

const PAGE = {
  heroGradient: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 60%,#4c1d95 100%)",
  heroColor: "#7c3aed",
  accentColor: "#7c3aed",
  salaryGrad: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
  salaryBorder: "#c4b5fd",
  salaryColor: "#7c3aed",
  skillBg: "#f3e8ff",
  skillColor: "#7c3aed",
  badge: "🚶 No Interview · Walk-In · Spot Offer",
  badgeBg: "rgba(255,255,255,.15)",
  badgeBorder: "rgba(255,255,255,.28)",
  badgeTextColor: "#e9d5ff",
  title: "Walk-In Drives 2026",
  subtitle:
    "No prior interview rounds. Walk in, get assessed, and receive a spot offer on the same day. Verified drives from top MNCs.",
  cta1: "View Today's Drives →",
  cta2: "📋 Walk-In Checklist",
  stats: [
    { n: "180+", l: "Active Drives" },
    { n: "60+", l: "Companies" },
    { n: "14", l: "Drives Today" },
  ],
  ticker:
    "TCS Walk-In Bangalore | Infosys BPM Pune | Wipro Hyderabad | HCL Chennai | Cognizant Mumbai | Accenture Delhi | Capgemini Noida",
  alert:
    "🚶 Walk-In drives happening TODAY — no appointment needed. Carry your resume!",
  alertGrad: "linear-gradient(90deg,#7c3aed,#4c1d95)",
  sortLabel: "walk-in drives found",
  applyBg: "#7c3aed",
  loadMoreBorder: "#7c3aed",
  sortActiveBg: "#7c3aed",
  sidebarLinks: [
    "Today's Walk-Ins",
    "Weekend Drives",
    "BPO/Voice Drives",
    "IT Walk-In Drives",
    "Bangalore Drives",
    "Hyderabad Drives",
    "Pune Walk-Ins",
    "Spot Offer Jobs",
  ],
  tipTitle: "🚶 Walk-In Tips",
  tips: [
    "Carry 5 copies of your resume",
    "Bring all original documents + photocopies",
    "Reach the venue 30 mins early",
    "Dress formally — first impression matters",
  ],
};
const JOBS = [
  {
    id: 1,
    title: "Walk-In Software Engineer",
    company: "TCS",
    location: "Bangalore",
    workMode: "On-site",
    postedAgo: "1 day ago",
    batch: "2024 / 2025",
    salary: "₹4.5 LPA",
    desc: "Walk-in drive for freshers. Basic coding and communication skills required.",
    skills: ["Java", "Python", "SQL", "Communication"],
    badge: "hot",
    badgeLabel: "HOT",
    verified: true,
    logo: "T",
    logoBg: "#e0f2fe",
    logoColor: "#0369a1",
    days: 2,
  },
  {
    id: 2,
    title: "Walk-In Analyst",
    company: "Infosys",
    location: "Hyderabad",
    workMode: "Hybrid",
    postedAgo: "2 days ago",
    batch: "2023 / 2024",
    salary: "₹3.8 LPA",
    desc: "Hiring for analyst role. Good analytical and communication skills needed.",
    skills: ["Excel", "SQL", "Power BI"],
    badge: "new",
    badgeLabel: "NEW",
    verified: true,
    logo: "I",
    logoBg: "#ede9fe",
    logoColor: "#5b21b6",
    days: 3,
  },
  {
    id: 3,
    title: "BPO Walk-In Drive",
    company: "Wipro",
    location: "Chennai",
    workMode: "On-site",
    postedAgo: "Today",
    batch: "Any Graduate",
    salary: "₹2.5 LPA",
    desc: "Walk-in for voice process. Immediate joiners preferred.",
    skills: ["Communication", "English", "Customer Support"],
    badge: "featured",
    badgeLabel: "FEATURED",
    verified: false,
    logo: "W",
    logoBg: "#fef3c7",
    logoColor: "#92400e",
    days: 1,
  },
  {
    id: 4,
    title: "Walk-In Developer Role",
    company: "HCL",
    location: "Pune",
    workMode: "Hybrid",
    postedAgo: "3 days ago",
    batch: "2024 / 2025",
    salary: "₹4.2 LPA",
    desc: "Looking for developers with basic coding knowledge.",
    skills: ["JavaScript", "React", "Node.js"],
    badge: "hot",
    badgeLabel: "HOT",
    verified: true,
    logo: "H",
    logoBg: "#dcfce7",
    logoColor: "#166534",
    days: 4,
  },
];

const BADGE_STYLES = {
  featured: { background: "#fff8e1", color: "#b45309" },
  hot: { background: "#fee2e2", color: "#b91c1c" },
  new: { background: "#f3e8ff", color: "#5b21b6" },
};

/* ── BREAKPOINT HOOK ── */
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
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

/* ── JOB CARD ── */
// function JobCard({ job, saved, onSave, isMobile }) {
//   const bc =
//     job.badge === "hot" ? C.accent : job.badge === "new" ? C.purple : C.gold;
//   return (
//     <div
//       style={{
//         background: "#fff",
//         borderRadius: 14,
//         border: `1px solid ${C.border}`,
//         padding: isMobile ? 14 : 20,
//         marginBottom: 14,
//         borderLeft: `4px solid ${bc}`,
//         transition: "box-shadow .2s, transform .18s",
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,.12)";
//         e.currentTarget.style.transform = "translateY(-2px)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.boxShadow = "none";
//         e.currentTarget.style.transform = "translateY(0)";
//       }}
//     >
//       {/* Top row */}
//       <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
//         <div
//           style={{
//             width: isMobile ? 46 : 58,
//             height: isMobile ? 46 : 58,
//             borderRadius: 12,
//             background: job.logoBg,
//             color: job.logoColor,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: 800,
//             fontSize: isMobile ? 20 : 26,
//             border: `1px solid ${C.border}`,
//             flexShrink: 0,
//           }}
//         >
//           {job.logo}
//         </div>

//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 7 }}>
//             <span
//               style={{
//                 ...BADGE_STYLES[job.badge],
//                 fontSize: 10.5,
//                 fontWeight: 700,
//                 padding: "2px 9px",
//                 borderRadius: 4,
//               }}
//             >
//               {job.badgeLabel}
//             </span>
//             {job.verified && (
//               <span
//                 style={{
//                   background: "#dcfce7",
//                   color: "#15803d",
//                   fontSize: 10.5,
//                   fontWeight: 700,
//                   padding: "2px 9px",
//                   borderRadius: 4,
//                 }}
//               >
//                 ✅ Verified
//               </span>
//             )}
//           </div>

//           <h3
//             style={{
//               fontSize: isMobile ? 15 : 17,
//               fontWeight: 700,
//               color: C.primary,
//               marginBottom: 4,
//               lineHeight: 1.3,
//             }}
//           >
//             {job.title}
//           </h3>
//           <div style={{ fontSize: 13.5, fontWeight: 600, color: C.purple, marginBottom: 9 }}>
//             {job.company}
//           </div>

//           <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//             {[
//               { icon: "📍", val: job.location },
//               { icon: "🏠", val: job.workMode },
//               { icon: "📅", val: job.postedAgo },
//               ...(!isMobile ? [{ icon: "🎓", val: job.batch }] : []),
//             ].map((t) => (
//               <span
//                 key={t.val}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 4,
//                   fontSize: 11.5,
//                   color: C.muted,
//                   background: C.light,
//                   padding: "4px 10px",
//                   borderRadius: 6,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {t.icon} {t.val}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Salary box — desktop */}
//         {!isMobile && (
//           <div
//             style={{
//               background: PAGE.salaryGrad,
//               border: `1.5px solid ${PAGE.salaryBorder}`,
//               borderRadius: 12,
//               padding: "13px 18px",
//               textAlign: "center",
//               flexShrink: 0,
//             }}
//           >
//             <div style={{ fontSize: 9.5, color: C.muted, marginBottom: 3, fontWeight: 700 }}>SALARY</div>
//             <div style={{ fontSize: 16, fontWeight: 800, color: PAGE.salaryColor }}>{job.salary}</div>
//           </div>
//         )}
//       </div>

//       {/* Salary — mobile */}
//       {isMobile && (
//         <div
//           style={{
//             marginTop: 10,
//             background: PAGE.salaryGrad,
//             border: `1.5px solid ${PAGE.salaryBorder}`,
//             borderRadius: 9,
//             padding: "9px 13px",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <span style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>SALARY</span>
//           <span style={{ fontSize: 15, fontWeight: 800, color: PAGE.salaryColor }}>{job.salary}</span>
//         </div>
//       )}

//       <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: "13px 0 12px" }}>{job.desc}</p>

//       {/* Skills */}
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
//         {job.skills.slice(0, isMobile ? 3 : 5).map((s) => (
//           <span
//             key={s}
//             style={{
//               background: PAGE.skillBg,
//               color: PAGE.skillColor,
//               fontSize: 11.5,
//               padding: "4px 10px",
//               borderRadius: 5,
//               fontWeight: 500,
//               whiteSpace: "nowrap",
//             }}
//           >
//             {s}
//           </span>
//         ))}
//         {job.skills.length > (isMobile ? 3 : 5) && (
//           <span style={{ fontSize: 11.5, color: C.muted, alignSelf: "center" }}>
//             +{job.skills.length - (isMobile ? 3 : 5)} more
//           </span>
//         )}
//       </div>

//       {/* Footer */}
//     </div>
//   );
// }

/* ── SIDEBAR ── */
function Sidebar() {
  return (
    <div>
      {/* Quick links */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: `1px solid ${C.border}`,
          padding: 18,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 14,
            color: C.primary,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 4,
              height: 18,
              background: C.purple,
              borderRadius: 3,
              display: "inline-block",
            }}
          />
          Quick Links
        </div>
        {PAGE.sidebarLinks.map((l) => (
          <a
            key={l}
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              fontSize: 12.5,
              color: C.text,
              borderBottom: `1px solid ${C.border}`,
              textDecoration: "none",
            }}
          >
            <span>{l}</span>
            <span style={{ color: C.purple, fontSize: 12 }}>→</span>
          </a>
        ))}
      </div>

      {/* Alert widget */}
      <div
        style={{
          background: `linear-gradient(135deg,${C.purple},${C.purpleDark})`,
          color: "#fff",
          borderRadius: 14,
          padding: 20,
          textAlign: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Get Notified</div>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>🔔 Free Job Alerts</div>
        <p style={{ fontSize: 12, opacity: 0.82, marginBottom: 14 }}>
          Get daily alerts for new walk-in drives in your inbox.
        </p>
        <div style={{ display: "flex" }}>
          <input
            type="email"
            placeholder="Your email"
            style={{
              flex: 1,
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.2)",
              color: "#fff",
              fontSize: 12,
              borderRadius: "7px 0 0 7px",
              padding: "9px 10px",
              outline: "none",
            }}
          />
          <button
            style={{
              background: C.accent,
              color: "#fff",
              border: "none",
              padding: "9px 14px",
              borderRadius: "0 7px 7px 0",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Go
          </button>
        </div>
      </div>

      {/* Tips */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: `1px solid ${C.border}`,
          padding: 18,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 12,
            color: C.primary,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 4,
              height: 18,
              background: C.gold,
              borderRadius: 3,
              display: "inline-block",
            }}
          />
          {PAGE.tipTitle}
        </div>
        {PAGE.tips.map((t, i) => (
          <div
            key={t}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              marginBottom: 10,
              fontSize: 12.5,
              color: C.text,
            }}
          >
            <span
              style={{
                background: C.purpleLight,
                color: C.purple,
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════ */
export default function WalkInDrivesPage() {
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop } = bp;

  const [savedJobs, setSavedJobs] = useState({});
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [sort, setSort] = useState("Newest");

  const gutter = isMobile ? "14px" : isTablet ? "20px" : "24px";

  const toggleSave = (id) =>
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));

  let jobs = JOBS.filter((j) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !j.title.toLowerCase().includes(q) &&
        !j.company.toLowerCase().includes(q) &&
        !j.skills.some((s) => s.toLowerCase().includes(q))
      )
        return false;
    }
    if (filterMode && j.workMode !== filterMode) return false;
    return true;
  });

  if (sort === "Deadline") jobs = [...jobs].sort((a, b) => a.days - b.days);
  if (sort === "Salary") jobs = [...jobs].sort((a, b) => b.salary.localeCompare(a.salary));

  return (
    <>
      <Helmet>

      <title>
        Latest Walk-In Drives 2026 | Freshers & Experienced Hiring
      </title>

      <meta
        name="description"
        content="Explore latest walk-in drives, direct interview jobs, mass hiring opportunities, fresher walk-ins, and IT hiring drives across India."
      />

      <meta
        name="keywords"
        content="walkin jobs, walkin drives 2026, fresher walkins, direct interview jobs, mass hiring, IT walkins, software walkins"
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <link
        rel="canonical"
        href={`${window.location.origin}/walk-in-drive`}
      />

      {/* OpenGraph */}
      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content="Latest Walk-In Drives 2026"
      />

      <meta
        property="og:description"
        content="Find latest walk-in jobs, fresher hiring drives, direct interview opportunities and mass hiring across India."
      />

      <meta
        property="og:url"
        content={`${window.location.origin}/walk-in-drive`}
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content="Latest Walk-In Drives 2026"
      />

      <meta
        name="twitter:description"
        content="Explore latest walk-in jobs and direct interview opportunities across India."
      />

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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        input, select, button { font-family: inherit; }
        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }
        @keyframes dropFade {
          from { opacity: 0; transform: translateX(-50%) translateY(-5px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes ticker {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-120%); }
        }
        .ticker-overflow { overflow: hidden; flex: 1; min-width: 0; }
        .ticker-inner { display: inline-block; animation: ticker 38s linear infinite; white-space: nowrap; opacity: .85; }
        input::placeholder { color: #9ca3af; }
      `}</style>

      {/* ── ALERT BAR ── */}
      <AlertBar isMobile={isMobile} C={{ accent: "#ff4d4f" }} />

      {/* ── TOP TICKER ── */}
      <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={C} gutter={gutter} />

      {/* ── NAVBAR ── */}
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
    marginBottom: 40,
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
      maxWidth: 1280,
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
        gap: isMobile ? 45 : 70,
        alignItems: "center",
      }}
    >
      {/* LEFT CONTENT */}
      <div>
        {/* Breadcrumb */}
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 22,
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
            Walk-In Drives
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
              background: "#2563eb",
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
            {PAGE.badge}
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: isMobile ? "2.7rem" : "5rem",
            lineHeight: 0.98,
            color: "#111827",
            marginBottom: 24,
            letterSpacing: "-0.05em",
            maxWidth: 700,
          }}
        >
          Walk-In <br />
          <span
            style={{
              color: "#2563eb",
            }}
          >
            Drives
          </span>{" "}
          Across India
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: isMobile ? 15 : 17,
            lineHeight: 1.9,
            color: "#4b5563",
            maxWidth: 620,
            marginBottom: 38,
          }}
        >
          {PAGE.subtitle}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 46,
          }}
        >
          <a
            href="#"
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
            {PAGE.cta1}
          </a>

          <a
            href="#"
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
            {PAGE.cta2}
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? 22 : 40,
          }}
        >
          {PAGE.stats.map((s) => (
            <div key={s.l}>
              <div
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: 800,
                  color: "#111827",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {s.n}
              </div>

              <div
                style={{
                  marginTop: 4,
                  color: "#6b7280",
                  fontSize: 13,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE CARD */}
      {/* RIGHT SIDE VISUAL DESIGN */}
<div
  style={{
    position: "relative",
    minHeight: isMobile ? 320 : 560,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  {/* Main Gradient Orb */}
  <div
    style={{
      width: isMobile ? 240 : 420,
      height: isMobile ? 240 : 420,
      borderRadius: "50%",
      background:
        "linear-gradient(135deg,#2563eb 0%,#7c3aed 50%,#06b6d4 100%)",
      filter: "blur(10px)",
      opacity: 0.95,
      position: "relative",
      animation: "floatOrb 6s ease-in-out infinite",
      boxShadow: "0 30px 80px rgba(37,99,235,.35)",
    }}
  />

  {/* Ring 1 */}
  <div
    style={{
      position: "absolute",
      width: isMobile ? 260 : 470,
      height: isMobile ? 260 : 470,
      borderRadius: "50%",
      border: "1px solid rgba(37,99,235,.18)",
      animation: "spinSlow 18s linear infinite",
    }}
  />

  {/* Ring 2 */}
  <div
    style={{
      position: "absolute",
      width: isMobile ? 310 : 560,
      height: isMobile ? 310 : 560,
      borderRadius: "50%",
      border: "1px dashed rgba(124,58,237,.18)",
      animation: "spinReverse 24s linear infinite",
    }}
  />

  {/* Floating Mini Elements */}
  {[
    {
      top: "12%",
      left: "8%",
      bg: "#ffffff",
      text: "🚀",
    },
    {
      top: "18%",
      right: "12%",
      bg: "#dbeafe",
      text: "💼",
    },
    {
      bottom: "14%",
      left: "10%",
      bg: "#ede9fe",
      text: "📈",
    },
    {
      bottom: "18%",
      right: "8%",
      bg: "#fef3c7",
      text: "🏢",
    },
  ].map((item, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        ...item,
        width: isMobile ? 54 : 72,
        height: isMobile ? 54 : 72,
        borderRadius: 22,
        background: item.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isMobile ? 22 : 30,
        boxShadow: "0 20px 40px rgba(0,0,0,.08)",
        backdropFilter: "blur(10px)",
        animation: `floatMini ${4 + i}s ease-in-out infinite`,
      }}
    >
      {item.text}
    </div>
  ))}

  {/* Center Text */}
  <div
    style={{
      position: "absolute",
      textAlign: "center",
      color: "#fff",
    }}
  >
    <div
      style={{
        fontSize: isMobile ? 42 : 82,
        fontWeight: 800,
        fontFamily: "'Syne', sans-serif",
        lineHeight: 1,
      }}
    >
      180+
    </div>

    <div
      style={{
        marginTop: 8,
        fontSize: isMobile ? 13 : 18,
        fontWeight: 600,
        letterSpacing: "0.08em",
        opacity: 0.92,
      }}
    >
      ACTIVE WALK-IN DRIVES
    </div>
  </div>
</div>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      > */}
        {/* <div
          style={{
            width: "100%",
            maxWidth: 470,
            background: "#ffffff",
            borderRadius: 30,
            padding: isMobile ? 24 : 34,
            boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
          }}
        > */}
          {/* Top Header */}
          {/* <div
            style={{
              background: "#f9fafb",
              borderRadius: 20,
              padding: 22,
              marginBottom: 24,
              border: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                background: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                marginBottom: 18,
              }}
            >
              🚀
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 24,
                color: "#111827",
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              Latest Walk-In Drives
            </h3>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
                lineHeight: 1.7,
                fontSize: 14,
              }}
            >
              Explore company walk-ins, direct interviews, and fresher hiring
              events updated daily.
            </p>
          </div> */}

          {/* Drive Cards */}
          {/* {[
            {
              role: "Software Engineer",
              company: "Infosys • Bangalore",
              color: "#dbeafe",
            },
            {
              role: "Graduate Trainee",
              company: "TCS • Hyderabad",
              color: "#ede9fe",
            },
            {
              role: "Data Analyst",
              company: "Wipro • Pune",
              color: "#fef3c7",
            },
          ].map((job, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px",
                borderRadius: 18,
                background: "#fafafa",
                marginBottom: 16,
                border: "1px solid #f3f4f6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: job.color,
                  }}
                />

                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 15,
                      color: "#111827",
                      fontWeight: 700,
                    }}
                  >
                    {job.role}
                  </h3>

                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 13,
                      color: "#6b7280",
                    }}
                  >
                    {job.company}
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "#111827",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: 999,
                }}
              >
                Apply
              </div>
            </div>
          ))} */}
        {/* </div> */}
      {/* </div> */}
    </div>
  </div>
</section>
      {/* ── MAIN CONTENT ── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: `0 ${gutter} 60px`,
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        {/* ── LEFT: Job Listings ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Walk-In Checklist Banner */}
          <div
            style={{
              background: C.purpleLight,
              border: `1.5px solid ${C.purpleBorder}`,
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 16,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>📋</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.purpleDark, marginBottom: 4 }}>
                Walk-In Checklist
              </div>
              <p style={{ fontSize: 12, color: C.purple, lineHeight: 1.7 }}>
                Carry 5 copies of your resume · Original + photocopies of all documents · Reach 30 mins early · Dress formally
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: isMobile ? 14 : 20,
              marginBottom: 16,
              boxShadow: "0 1px 6px rgba(10,37,64,.05)",
            }}
          >
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 14,
                    color: C.muted,
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search walk-in drives…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 34px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 9,
                    fontSize: 13,
                    background: C.light,
                    outline: "none",
                  }}
                />
              </div>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                style={{
                  padding: "10px 12px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 9,
                  fontSize: 13,
                  background: "#fff",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">🏠 Work Mode</option>
                {["On-site", "Hybrid"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              {(search || filterMode) && (
                <button
                  onClick={() => { setSearch(""); setFilterMode(""); }}
                  style={{
                    padding: "10px 14px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 9,
                    fontSize: 12.5,
                    color: C.accent,
                    background: "#fff5f5",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Sort Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 13.5, color: C.muted }}>
              <strong style={{ color: C.text }}>{jobs.length}</strong> {PAGE.sortLabel}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Newest", "Salary", "Deadline"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 7,
                    border: `1.5px solid ${sort === s ? PAGE.sortActiveBg : C.border}`,
                    background: sort === s ? PAGE.sortActiveBg : "#fff",
                    color: sort === s ? "#fff" : C.muted,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards */}
          {jobs.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: `1px solid ${C.border}`,
                padding: 56,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 19, fontWeight: 700, color: C.primary, marginBottom: 8 }}>
                No results found
              </div>
              <div style={{ fontSize: 13.5, color: C.muted }}>
                Try adjusting your filters.
              </div>
            </div>
          ) : 
          <WalkInJobCard isMobile={isMobile} />}

          {jobs.length > 0 && (
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <button
                style={{
                  background: "#fff",
                  border: `2px solid ${PAGE.loadMoreBorder}`,
                  color: PAGE.loadMoreBorder,
                  padding: "13px 40px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Load More →
              </button>
            </div>
          )}

          {/* Sidebar below cards on non-desktop */}
          {!isDesktop && (
            <div style={{ marginTop: 32 }}>
              <Sidebar />
            </div>
          )}
        </div>

        {/* ── RIGHT: Sidebar ── */}
        {isDesktop && (
          <div style={{ width: 286, flexShrink: 0, position: "sticky", top: 80 }}>
            <Sidebar />
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <Footer bp={bp} gutter={gutter} />
    </div>
    </>
  );
}