import { useState, useEffect, use } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AlertBar from "./components/alertbar";
import Navbar from "./components/navbar";
import TopTicker from "./components/topticker";
import Footer from "./components/footer";
import JobCardList from "./components/home_page_components/Job_card_component";
import QuickCategories from "./components/home_page_components/quick_categories";
import TopCompanies from "./components/home_page_components/topcompanies";
import JobsByLocation from "./components/home_page_components/job_by_location";
import API_BASE_URL from "./config/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WalkInDrivesPage from "./user_pages/walk_in_jobs";


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

const CATS = [
  { label: "All Jobs", count: "12.4K" }, { label: "Software/IT", count: "4.2K" },
  { label: "Govt Jobs", count: "1.8K" }, { label: "Work From Home", count: "3.1K" },
  { label: "MBA Jobs", count: "890" }, { label: "Internships", count: "2.3K" },
  { label: "Data Analyst", count: "670" }, { label: "Walk-in", count: "340" },
  { label: "Non-Engineering", count: "1.2K" }, { label: "Other Categories", count: "2.1K" },
  { label: "Fresher Jobs", count: "8.5K" }, { label: "2026 Batch", count: "3.2K" },
  { label: "2025 Batch", count: "4.1K" }, { label: "2024 Batch", count: "2.3K" },
  { label: "Bangalore", count: "3.2K" }, { label: "Hyderabad", count: "2.4K" },
  { label: "Pune", count: "1.9K" }, { label: "Mumbai", count: "1.6K" },
  { label: "Chennai", count: "1.1K" }, { label: "Delhi NCR", count: "980" },
];

const LOCATIONS = [
  ["Bangalore", "3,200"], ["Hyderabad", "2,400"], ["Pune", "1,900"],
  ["Mumbai", "1,600"], ["Chennai", "1,100"], ["Delhi NCR", "980"], ["Noida", "760"],
];

const S = {
  primary: "#0f4c81", accent: "#e8472a", gold: "#f5a623",
  light: "#f4f7fb", green: "#16a34a", text: "#1a1a2e", muted: "#6b7280", border: "#e2e8f0",
};

// const badgeStyle = {
//   featured: { background: "#fff8e1", color: "#b45309" },
//   hot: { background: "#fee2e2", color: "#b91c1c" },
//   new: { background: "#dcfce7", color: "#15803d" },
//   remote: { background: "#ede9fe", color: "#6d28d9" },
// };

// const borderAccent = {
//   featured: `3px solid ${S.gold}`,
//   hot: `3px solid ${S.accent}`,
//   remote: `3px solid #7c3aed`,
//   new: `1px solid ${S.border}`,
// };

function AdBanner({ icon, title, sub, btnText, btnColor = "#e8472a", bg = "linear-gradient(90deg,#fff9e6,#fffde7)", borderColor = "#f5a623" }) {
  return (
    <div style={{ background: bg, border: `1.5px dashed ${borderColor}`, borderRadius: 10, padding: "10px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{ fontSize: 10, color: "#999", border: "1px solid #ddd", padding: "1px 5px", borderRadius: 3 }}>Advertisement</span>
      <div style={{ width: 42, height: 42, borderRadius: 8, background: `linear-gradient(135deg,${S.gold},${S.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <strong style={{ fontSize: 14, display: "block" }}>{title}</strong>
        <span style={{ fontSize: 12, color: S.muted }}>{sub}</span>
      </div>
      <a href="#" style={{ background: btnColor, color: "#fff", padding: "7px 16px", borderRadius: 7, fontWeight: 600, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>{btnText}</a>
    </div>
  );
}

// function MetaTag({ icon, label }) {
//   return (
//     <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: S.muted, background: S.light, padding: "3px 9px", borderRadius: 5 }}>
//       <span>{icon}</span> {label}
//     </span>
//   );
// }

// function SkillTag({ label }) {
//   return <span style={{ background: "#e8f4fd", color: S.primary, fontSize: 11, padding: "2px 9px", borderRadius: 4, fontWeight: 500 }}>{label}</span>;
// }


// function InlineAd({ icon, title, sub, btnText, btnColor = S.primary, bg = "linear-gradient(90deg,#e8f4fd,#f0f7ff)", borderColor = "#bdd6f0" }) {
//   return (
//     <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: "13px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
//       <span style={{ fontSize: 10, color: "#999", border: "1px solid #ddd", padding: "1px 5px", borderRadius: 3 }}>AD</span>
//       <span style={{ fontSize: 26 }}>{icon}</span>
//       <div style={{ flex: 1, minWidth: 140 }}>
//         <strong style={{ fontSize: 13.5, display: "block" }}>{title}</strong>
//         <span style={{ fontSize: 12, color: S.muted }}>{sub}</span>
//       </div>
//       <a href="#" style={{ background: btnColor, color: "#fff", padding: "7px 16px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>{btnText}</a>
//     </div>
//   );
// }

function SidebarWidget({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, padding: 18, marginBottom: 16 }}>
      <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13.5, fontWeight: 700, marginBottom: 14, color: S.text }}>{title}</div>
      {children}
    </div>
  );
}

function QuickLink({ label, count }) {
  return (
    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${S.border}`, fontSize: 13, color: S.text, textDecoration: "none" }}>
      {label}
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ background: S.light, color: S.muted, fontSize: 11, padding: "1px 7px", borderRadius: 10 }}>{count}</span>
        <span style={{ color: S.muted, fontSize: 12 }}>›</span>
      </span>
    </a>
  );
}

export default function App() {
  const [activeCat, setActiveCat] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotal] = useState(0);
  const totalPages = Math.ceil(totalJobs / 15);
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop, showSidebar } = bp;
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    setSearchTriggered(true);
    setTimeout(() => setSearchTriggered(false), 1400);
  };
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/get-stats`);
 
        // convert response to JSON
        const data = await res.json();

        // console.log("Stats response:", data);

        // set state
        setStats(data.data);

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    /* ── ROOT: must be 100% width, no max-width here ── */
    <div style={{
      width: "100%",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      background: S.light,
      color: S.text,
      fontSize: 15,
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        /* ── HARD RESET — prevents black side gaps ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; background: #f4f7fb !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }

        a { text-decoration: none; color: inherit; }
        ul { list-style: disc; padding-left: 20px; }
        li { margin-bottom: 6px; font-size: 13.5px; line-height: 1.8; color: ${C.text}; }

        .syne { font-family: 'Syne', sans-serif; }

        @keyframes ticker {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-120%); }
        }
        .ticker-outer { overflow: hidden; flex: 1; min-width: 0; }
        .ticker-inner { display: inline-block; animation: ticker 40s linear infinite; white-space: nowrap; opacity: .85; }

        /* ── Category pills horizontal scroll on mobile ── */
        .cat-pill-wrap {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 6px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .cat-pill-wrap::-webkit-scrollbar { display: none; }

        /* ── Job grid: 2 cols on ≥768, 1 col on mobile ── */
.job-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 1023px) {
  .job-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 639px) {
  .job-grid { grid-template-columns: 1fr; }
}

        /* ── Sidebar: hidden on <1024px ── */
        .sidebar-col { display: block; }
        @media (max-width: 1023px) {
          .sidebar-col { display: none; }
        }

        /* ── Main layout ── */
        .main-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          width: 100%;
        }
        .main-content { flex: 1; min-width: 0; }

        /* ── Hero search card stacks on mobile ── */
        .hero-flex {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .hero-left  { flex: 1; min-width: 260px; }
        .hero-card  { flex: 0 0 340px; min-width: 260px; }

        /* ── Buttons ── */
        .btn-apply {
          background: ${C.primary}; color: #fff; border: none;
          padding: 12px 28px; border-radius: 9px; font-weight: 700;
          font-size: 14px; font-family: 'Syne', sans-serif;
          display: inline-block; cursor: pointer; transition: background .2s;
        }
        .btn-apply:hover { background: #0a3a65; }
        .btn-save {
          background: #fff; color: ${C.primary}; border: 1.5px solid ${C.primary};
          padding: 11px 22px; border-radius: 9px; font-weight: 600;
          font-size: 13.5px; cursor: pointer;
        }
        .btn-save:hover { background: ${C.light}; }

        /* ── Hero stats wrap on small screens ── */
        .hero-stats { display: flex; gap: 16px; flex-wrap: wrap; }
        .stat-box { background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); border-radius: 10px; padding: 12px 20px; text-align: center; }

        /* ── Pagination ── */
        .page-btn {
          width: 36px; height: 36px; border-radius: 7px;
          border: 1.5px solid ${S.border};
          background: #fff; color: ${S.text};
          font-weight: 600; font-size: 14px; cursor: pointer;
        }
        .page-btn.active { border-color: ${S.primary}; background: ${S.primary}; color: #fff; }

        @media (hover: hover) {
          .nav-link:hover { background: ${C.light} !important; color: ${C.primary} !important; }
        }

        /* ── Full-width sections ── */
        .section-full { width: 100%; }
.section-inner { width: 100%; padding: 0 24px; box-sizing: border-box; }

        @media (max-width: 479px) {
          .hero-card { flex: 0 0 100%; }
          .stat-box  { flex: 1 1 calc(50% - 8px); }
        }
      `}</style>

      {/* ── AlertBar: full width ── */}
      <div className="section-full">
        <AlertBar isMobile={isMobile} C={{ accent: "#ff4d4f" }} />
      </div>

      {/* ── TopTicker: full width ── */}
      <div className="section-full">
        <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={C} gutter="16px" />
      </div>

      {/* ── Navbar: full width ── */}
<Navbar
  bp={bp}
  onMenuOpen={() => {}}
  onNavigate={(page) => navigate(`/${page}`)}
  activePage={location.pathname.split("/")[1]}
/>
{/* 
<Routes>

  <Route
    path="/"
    element={
      <>
        Hero
        Top Ad
        Main Content
        Bottom Ad
        Footer
      </>
    }
  />

  <Route
    path="/home"
    element={
      <>
        SAME UI
      </>
    }
  />

  <Route path="/walk-in-drive" element={<WalkInDrivesPage />} />

</Routes>
*/}

      {/* ── Hero: full width ── */}
      <div className="section-full" style={{ background: "linear-gradient(135deg,#0f4c81 0%,#1565c0 60%,#0d47a1 100%)", color: "#fff", padding: "48px 0 40px" }}>
        <div className="section-inner">
          <div className="hero-flex">
            {/* Left */}
            <div className="hero-left">
              <h1 className="syne" style={{ fontSize: "clamp(1.5rem,4vw,2.4rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>
                Find Your Dream Job<br />As a <span style={{ color: S.gold }}>Fresher in India</span>
              </h1>
              <p style={{ fontSize: 14.5, opacity: .88, marginBottom: 24, maxWidth: 480 }}>
                100% verified job postings from top IT, government &amp; startup companies. Updated daily for 2025 &amp; 2026 batch graduates.
              </p>
              {/* <div className="hero-stats">
                {[["12,400+", "Active Jobs"], ["850+", "Companies"], ["2.3L+", "Hired"]].map(([n, l]) => (
                  <div key={l} className="stat-box">
                    <strong className="syne" style={{ display: "block", fontSize: "1.3rem", fontWeight: 800 }}>{n}</strong>
                    <small style={{ fontSize: 11.5, opacity: .8 }}>{l}</small>
                  </div>
                ))}
              </div> */}
{/* 🔥 HERO STATS SECTION */}
<div className="hero-stats">
  {[
    [stats?.activeJobs, "Active Jobs"],
    [stats?.companies, "Companies"],
    [stats?.newJobs, "New This Week"]
  ].map(([value, label]) => (
    <div key={label} className="stat-box">
      {value == null ? (
  <span
    style={{
      display: "block",
      width: "60px",
      height: "22px",
      borderRadius: "6px",
      background: "linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      marginBottom: "6px"
    }}
  />
) : (
  <strong
    className="syne"
    style={{
      display: "block",
      fontSize: "1.3rem",
      fontWeight: 800
    }}
  >
    {value}+
  </strong>
)}
      <small style={{ fontSize: 11.5, opacity: 0.8 }}>{label}</small>
    </div>
  ))}
</div>
            </div>
            {/* Search Card */}
            <div className="hero-card" style={{ background: "rgba(255,255,255,.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 14, padding: 22 }}>
              <h6 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>🔍 Quick Job Search</h6>
              <input
                value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Job title or company name"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", background: "rgba(255,255,255,.95)", fontSize: 13.5, fontFamily: "'DM Sans',sans-serif", color: S.text, marginBottom: 10, outline: "none" }}
              />
              <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", background: "rgba(255,255,255,.95)", fontSize: 13.5, fontFamily: "'DM Sans',sans-serif", color: S.text, marginBottom: 10, outline: "none" }}>
                <option>All Locations</option>
                {["Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Work From Home"].map(l => <option key={l}>{l}</option>)}
              </select>
              <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", background: "rgba(255,255,255,.95)", fontSize: 13.5, fontFamily: "'DM Sans',sans-serif", color: S.text, marginBottom: 12, outline: "none" }}>
                <option>All Categories</option>
                {["Software / IT", "Government Jobs", "MBA Jobs", "Internships", "Data Analyst"].map(c => <option key={c}>{c}</option>)}
              </select>
              <button onClick={handleSearch} style={{ width: "100%", background: S.accent, color: "#fff", border: "none", padding: 11, borderRadius: 8, fontWeight: 700, fontSize: 14, fontFamily: "'Syne',sans-serif", cursor: "pointer" }}>
                {searchTriggered ? "Searching..." : "Search Jobs →"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Ad ── */}
      <div className="section-full" style={{ background: S.light }}>
        <div className="section-inner" style={{ paddingTop: 16, paddingBottom: 0 }}>
          <AdBanner icon="🎓" title="Upskill & Get Hired Faster — GreatLearning Free Courses" sub="Python, Data Science, Cloud, AI/ML — 100% Free Certifications" btnText="Enroll Free →" />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div id="jobs" className="section-full" style={{ background: S.light }}>
        <div className="section-inner" style={{ paddingTop: 0, paddingBottom: 48 }}>
          <div className="main-layout">

            {/* Content column */}
            <div className="main-content">
              {/* Category Pills */}
              <div style={{ marginTop: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <h2 className="syne" style={{ fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, color: S.text }}>
                    <span style={{ width: 4, height: 20, background: S.accent, borderRadius: 3, display: "inline-block" }} />
                    Browse by Category
                  </h2>
                </div>
                <div className="cat-pill-wrap">
                  {CATS.map((c, i) => (
                    <span key={c.label} onClick={() => setActiveCat(i)} style={{
                      background: activeCat === i ? S.primary : "#fff",
                      color: activeCat === i ? "#fff" : S.text,
                      border: `1.5px solid ${activeCat === i ? S.primary : S.border}`,
                      borderRadius: 20, padding: "5px 15px", fontSize: 12.5, fontWeight: 500,
                      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
                      whiteSpace: "nowrap", flexShrink: 0, transition: "all .2s",
                    }}>
                      {c.label}
                      <span style={{ background: activeCat === i ? "rgba(255,255,255,.2)" : "#e8f4fd", color: activeCat === i ? "#fff" : S.primary, padding: "1px 6px", borderRadius: 10, fontSize: 10.5, fontWeight: 700 }}>{c.count}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Section Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 className="syne" style={{ fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, color: S.text }}>
                  <span style={{ width: 4, height: 20, background: S.accent, borderRadius: 3, display: "inline-block" }} />
                  Latest Jobs 2026
                </h2>
                <a href="#" style={{ fontSize: 12.5, color: S.primary, fontWeight: 600 }}>View All →</a>
              </div>


              <div className="job-grid">
                <JobCardList page={page} onTotal={setTotal} />
              </div>
              {/* {console.log("DEBUG →", { totalJobs, totalPages, page })} */}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", gap: 8, marginTop: 28, justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    className={`page-btn ${page === 1 ? "disabled" : ""}`}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >‹</button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      className={`page-btn ${page === n ? "active" : ""}`}
                      onClick={() => setPage(n)}
                    >{n}</button>
                  ))}

                  <button
                    className={`page-btn ${page === totalPages ? "disabled" : ""}`}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >›</button>
                </div>
              )}

            </div>

            {/* Sidebar — hidden on tablet/mobile via CSS */}
            <div className="sidebar-col" style={{ width: 280, flexShrink: 0 }}>
              {/* Sidebar Ad */}
              <div style={{ background: "linear-gradient(135deg,#0f4c81,#1565c0)", color: "#fff", borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)", display: "block", marginBottom: 8 }}>Advertisement</span>
                <h5 className="syne" style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>🚀 Launch Your Tech Career</h5>
                <p style={{ fontSize: 12, opacity: .85, marginBottom: 14 }}>Bootcamp by GeeksforGeeks – Job Guarantee for 2026 Batch</p>
                <a href="#" style={{ background: S.gold, color: "#000", padding: "8px 18px", borderRadius: 7, fontWeight: 700, fontSize: 12.5, display: "inline-block" }}>Join Now →</a>
              </div>

<QuickCategories 
  SidebarWidget={SidebarWidget} 
  QuickLink={QuickLink} 
/>

<TopCompanies SidebarWidget={SidebarWidget} S={S} />

              {/* WhatsApp Ad */}
              <div style={{ background: "linear-gradient(160deg,#1a1a2e,#16213e)", color: "#fff", borderRadius: 12, padding: 18, textAlign: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)", display: "block", marginBottom: 8 }}>Advertisement</span>
                <div style={{ fontSize: 36, marginBottom: 6 }}>📱</div>
                <h6 className="syne" style={{ fontSize: 14, fontWeight: 800, marginBottom: 6, color: "#fff" }}>Get Job Alerts on WhatsApp</h6>
                <p style={{ fontSize: 12, opacity: .75, marginBottom: 14 }}>Join 5 Lakh+ freshers getting daily updates</p>
                <a href="#" style={{ background: "linear-gradient(90deg,#e8472a,#f5a623)", color: "#fff", padding: "8px 18px", borderRadius: 7, fontWeight: 700, fontSize: 12.5, display: "inline-block" }}>Join Free Group →</a>
              </div>

<JobsByLocation 
  SidebarWidget={SidebarWidget} 
  QuickLink={QuickLink} 
/>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom Ad ── */}
      <div className="section-full" style={{ background: S.light }}>
        <div className="section-inner" style={{ paddingBottom: 20 }}>
          <AdBanner icon="💰" title="Earn While You Learn — Referral Bonus up to ₹5,000" sub="Refer a friend to CodeTechniques Premium & earn per successful referral" btnText="Learn More →" btnColor={S.green} bg="linear-gradient(90deg,#f0fff4,#e8f5e9)" borderColor="#86efac" />
        </div>
      </div>

      {/* ── Footer: full width ── */}
      <div className="section-full">
        <Footer bp={bp} gutter="16px" />
      </div>

    </div>
  );
}