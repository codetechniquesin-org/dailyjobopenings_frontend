import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AlertBar from "../components/alertbar";
import Navbar from "../components/navbar";
import TopTicker from "../components/topticker";
import Footer from "../components/footer";
import QuickCategories from "../components/home_page_components/quick_categories";
import TopCompanies from "../components/home_page_components/topcompanies";
import JobsByLocation from "../components/home_page_components/job_by_location";
import ExamCard from "../components/Exam_page_components/Exam_card";
import ViewExam from "./viewexam";

const S = {
  primary: "#0f4c81",
  accent: "#e8472a",
  gold: "#f5a623",
  light: "#f4f7fb",
  green: "#16a34a",
  text: "#1a1a2e",
  muted: "#6b7280",
  border: "#e2e8f0",
  white: "#ffffff",
};

function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { w, isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

function SidebarWidget({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, padding: 18, marginBottom: 16 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 14, color: S.text }}>{title}</div>
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

const EXAM_CATEGORIES = [
  { label: "All Exams", icon: "📋" },
  { label: "Government", icon: "🏛️" },
  { label: "Banking", icon: "🏦" },
  { label: "Engineering", icon: "⚙️" },
  { label: "MBA Entrance", icon: "📊" },
  { label: "State PSC", icon: "🗺️" },
  { label: "IT/Tech", icon: "💻" },
  { label: "Defence", icon: "🎖️" },
  { label: "Railways", icon: "🚂" },
];

const EXAMS = [
  {
    id: 1,
    name: "UPSC Civil Services 2025",
    shortName: "UPSC CSE",
    body: "Union Public Service Commission",
    category: "Government",
    status: "Open",
    notificationDate: "2025-02-14",
    examDate: "2025-05-25",
    lastDate: "2025-03-05",
    eligibility: "Any Graduate",
    ageLimit: "21–32 years",
    fee: "₹100",
    vacancies: "979",
    officialUrl: "https://upsc.gov.in",
    logo: "🏛️",
    color: "#0f4c81",
    tags: ["IAS", "IPS", "IFS"],
    isBookmarked: false,
  },
  {
    id: 2,
    name: "SSC CGL 2025",
    shortName: "SSC CGL",
    body: "Staff Selection Commission",
    category: "Government",
    status: "Upcoming",
    notificationDate: "2025-06-01",
    examDate: "2025-09-01",
    lastDate: "2025-06-30",
    eligibility: "Any Graduate",
    ageLimit: "18–32 years",
    fee: "₹100",
    vacancies: "17000+",
    officialUrl: "https://ssc.gov.in",
    logo: "📋",
    color: "#1565c0",
    tags: ["Group B", "Group C"],
    isBookmarked: false,
  },
  {
    id: 3,
    name: "IBPS PO 2025",
    shortName: "IBPS PO",
    body: "Institute of Banking Personnel Selection",
    category: "Banking",
    status: "Open",
    notificationDate: "2025-08-01",
    examDate: "2025-10-05",
    lastDate: "2025-08-21",
    eligibility: "Any Graduate",
    ageLimit: "20–30 years",
    fee: "₹850",
    vacancies: "3500",
    officialUrl: "https://ibps.in",
    logo: "🏦",
    color: "#0e7490",
    tags: ["Probationary Officer", "PSU Bank"],
    isBookmarked: false,
  },
  {
    id: 4,
    name: "SBI PO 2025",
    shortName: "SBI PO",
    body: "State Bank of India",
    category: "Banking",
    status: "Open",
    notificationDate: "2025-04-15",
    examDate: "2025-06-22",
    lastDate: "2025-05-05",
    eligibility: "Any Graduate",
    ageLimit: "21–30 years",
    fee: "₹750",
    vacancies: "2000",
    officialUrl: "https://sbi.co.in/careers",
    logo: "🏦",
    color: "#0e7490",
    tags: ["PO", "Management Trainee"],
    isBookmarked: false,
  },
  {
    id: 5,
    name: "JEE Advanced 2025",
    shortName: "JEE Advanced",
    body: "IIT Kanpur (Joint Admission Board)",
    category: "Engineering",
    status: "Closed",
    notificationDate: "2025-01-10",
    examDate: "2025-05-18",
    lastDate: "2025-04-30",
    eligibility: "12th (PCM) + JEE Mains qualified",
    ageLimit: "Max 25 years",
    fee: "₹3200",
    vacancies: "16000+",
    officialUrl: "https://jeeadv.ac.in",
    logo: "⚙️",
    color: "#7c3aed",
    tags: ["IIT", "B.Tech"],
    isBookmarked: false,
  },
  {
    id: 6,
    name: "GATE 2026",
    shortName: "GATE",
    body: "IIT Roorkee",
    category: "Engineering",
    status: "Upcoming",
    notificationDate: "2025-09-01",
    examDate: "2026-02-01",
    lastDate: "2025-10-07",
    eligibility: "B.E/B.Tech/B.Sc (Research)",
    ageLimit: "No Age Limit",
    fee: "₹1800",
    vacancies: "N/A (Qualifying)",
    officialUrl: "https://gate2026.iitr.ac.in",
    logo: "🎓",
    color: "#7c3aed",
    tags: ["M.Tech", "PSU Jobs", "PhD"],
    isBookmarked: false,
  },
  {
    id: 7,
    name: "CAT 2025",
    shortName: "CAT",
    body: "IIM Calcutta",
    category: "MBA Entrance",
    status: "Upcoming",
    notificationDate: "2025-07-15",
    examDate: "2025-11-23",
    lastDate: "2025-09-20",
    eligibility: "Any Graduate (50%+)",
    ageLimit: "No Age Limit",
    fee: "₹2400",
    vacancies: "N/A (Merit based)",
    officialUrl: "https://iimcat.ac.in",
    logo: "📊",
    color: "#b45309",
    tags: ["IIM", "MBA", "PGDM"],
    isBookmarked: false,
  },
  {
    id: 8,
    name: "XAT 2026",
    shortName: "XAT",
    body: "Xavier School of Management (XLRI)",
    category: "MBA Entrance",
    status: "Upcoming",
    notificationDate: "2025-07-01",
    examDate: "2026-01-05",
    lastDate: "2025-11-30",
    eligibility: "Any Graduate",
    ageLimit: "No Age Limit",
    fee: "₹2100",
    vacancies: "N/A",
    officialUrl: "https://xatonline.in",
    logo: "📊",
    color: "#b45309",
    tags: ["XLRI", "Top B-School"],
    isBookmarked: false,
  },
  {
    id: 9,
    name: "TSPSC Group 1 2025",
    shortName: "TSPSC Gr 1",
    body: "Telangana State PSC",
    category: "State PSC",
    status: "Open",
    notificationDate: "2025-03-12",
    examDate: "2025-07-20",
    lastDate: "2025-04-12",
    eligibility: "Any Graduate",
    ageLimit: "18–44 years",
    fee: "₹200",
    vacancies: "503",
    officialUrl: "https://tspsc.gov.in",
    logo: "🗺️",
    color: "#0f766e",
    tags: ["State Service", "Gazetted Officer"],
    isBookmarked: false,
  },
  {
    id: 10,
    name: "AWS Solutions Architect",
    shortName: "AWS SAA-C03",
    body: "Amazon Web Services",
    category: "IT/Tech",
    status: "Open",
    notificationDate: "2024-01-01",
    examDate: "Anytime (Proctored)",
    lastDate: "No Deadline",
    eligibility: "Any Graduate / Working Professional",
    ageLimit: "No Age Limit",
    fee: "$150",
    vacancies: "N/A",
    officialUrl: "https://aws.amazon.com/certification",
    logo: "☁️",
    color: "#e8472a",
    tags: ["Cloud", "Associate Level"],
    isBookmarked: false,
  },
  {
    id: 11,
    name: "NDA 2025 (I)",
    shortName: "NDA I",
    body: "Union Public Service Commission",
    category: "Defence",
    status: "Closed",
    notificationDate: "2025-01-08",
    examDate: "2025-04-13",
    lastDate: "2025-01-28",
    eligibility: "12th Pass (PCM for Army/Air Force)",
    ageLimit: "16.5–19.5 years",
    fee: "₹100",
    vacancies: "400",
    officialUrl: "https://upsc.gov.in",
    logo: "🎖️",
    color: "#4d7c0f",
    tags: ["Army", "Navy", "Air Force"],
    isBookmarked: false,
  },
  {
    id: 12,
    name: "CDS 2025 (II)",
    shortName: "CDS II",
    body: "Union Public Service Commission",
    category: "Defence",
    status: "Upcoming",
    notificationDate: "2025-05-28",
    examDate: "2025-09-14",
    lastDate: "2025-06-17",
    eligibility: "Any Graduate (varies by wing)",
    ageLimit: "19–25 years",
    fee: "₹200",
    vacancies: "459",
    officialUrl: "https://upsc.gov.in",
    logo: "🎖️",
    color: "#4d7c0f",
    tags: ["Officer", "Army", "Navy", "Air Force"],
    isBookmarked: false,
  },
  {
    id: 13,
    name: "RRB NTPC 2025",
    shortName: "RRB NTPC",
    body: "Railway Recruitment Board",
    category: "Railways",
    status: "Open",
    notificationDate: "2025-09-18",
    examDate: "2025-12-10",
    lastDate: "2025-10-17",
    eligibility: "12th Pass / Any Graduate",
    ageLimit: "18–33 years",
    fee: "₹500",
    vacancies: "11558",
    officialUrl: "https://indianrailways.gov.in",
    logo: "🚂",
    color: "#dc2626",
    tags: ["Non-Technical", "Group C"],
    isBookmarked: false,
  },
  {
    id: 14,
    name: "RBI Grade B 2025",
    shortName: "RBI Grade B",
    body: "Reserve Bank of India",
    category: "Banking",
    status: "Upcoming",
    notificationDate: "2025-06-20",
    examDate: "2025-09-07",
    lastDate: "2025-07-15",
    eligibility: "Any Graduate (60%+)",
    ageLimit: "21–30 years",
    fee: "₹850",
    vacancies: "291",
    officialUrl: "https://rbi.org.in",
    logo: "🏦",
    color: "#0e7490",
    tags: ["Officer Grade", "Phase I + II"],
    isBookmarked: false,
  },
  {
    id: 15,
    name: "APSC CCE 2025",
    shortName: "APSC CCE",
    body: "Assam Public Service Commission",
    category: "State PSC",
    status: "Open",
    notificationDate: "2025-02-01",
    examDate: "2025-07-10",
    lastDate: "2025-03-15",
    eligibility: "Any Graduate",
    ageLimit: "21–38 years",
    fee: "₹297.20",
    vacancies: "200+",
    officialUrl: "https://apsc.nic.in",
    logo: "🗺️",
    color: "#0f766e",
    tags: ["State Service", "CCE"],
    isBookmarked: false,
  },
];

const statusConfig = {
  Open: { bg: "#dcfce7", color: "#15803d", dot: "#16a34a", label: "● Open" },
  Closed: { bg: "#fee2e2", color: "#b91c1c", dot: "#dc2626", label: "● Closed" },
  Upcoming: { bg: "#fff8e1", color: "#b45309", dot: "#d97706", label: "● Upcoming" },
};

const ELIGIBILITY_FILTERS = ["All", "10th Pass", "12th Pass", "Any Graduate", "B.E/B.Tech"];
const SORT_OPTIONS = ["Default", "Deadline (Earliest)", "Deadline (Latest)", "Vacancies (High to Low)"];



export default function ExamsPage() {
  const [exams, setExams] = useState(EXAMS);
  const [activeCategory, setActiveCategory] = useState("All Exams");
  const [searchVal, setSearchVal] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [eligibilityFilter, setEligibilityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Default");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop } = bp;
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookmark = (id) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, isBookmarked: !e.isBookmarked } : e));
  };

  const filtered = exams
    .filter(e => activeCategory === "All Exams" || e.category === activeCategory)
    .filter(e => statusFilter === "All" || e.status === statusFilter)
    .filter(e => eligibilityFilter === "All" || e.eligibility.toLowerCase().includes(eligibilityFilter.toLowerCase()))
    .filter(e => !searchVal || e.name.toLowerCase().includes(searchVal.toLowerCase()) || e.body.toLowerCase().includes(searchVal.toLowerCase()) || e.shortName.toLowerCase().includes(searchVal.toLowerCase()))
    .filter(e => !showBookmarksOnly || e.isBookmarked)
    .sort((a, b) => {
      if (sortBy === "Deadline (Earliest)") return new Date(a.lastDate) - new Date(b.lastDate);
      if (sortBy === "Deadline (Latest)") return new Date(b.lastDate) - new Date(a.lastDate);
      if (sortBy === "Vacancies (High to Low)") return parseInt(b.vacancies) - parseInt(a.vacancies);
      return 0;
    });

  const stats = {
    open: exams.filter(e => e.status === "Open").length,
    bookmarked: exams.filter(e => e.isBookmarked).length,
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: S.light, color: S.text, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; background: #f4f7fb !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }
        a { text-decoration: none; color: inherit; }

        .cat-pill { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 20px; font-size: 12.5px; font-weight: 500; cursor: pointer; white-space: nowrap; border: 1.5px solid; transition: all .18s; flex-shrink: 0; }
        .cat-pill.active { background: #0f4c81; color: #fff; border-color: #0f4c81; }
        .cat-pill.inactive { background: #fff; color: #1a1a2e; border-color: #e2e8f0; }
        .cat-pill.inactive:hover { border-color: #0f4c81; color: #0f4c81; }
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .filter-select { padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #1a1a2e; background: #fff; cursor: pointer; outline: none; }
        .filter-select:focus { border-color: #0f4c81; }
        .main-layout { display: flex; gap: 28px; align-items: flex-start; width: 100%; }
        .main-content { flex: 1; min-width: 0; }
        .sidebar-col { display: block; width: 280px; flex-shrink: 0; }
        @media (max-width: 1023px) { .sidebar-col { display: none; } }

        .exams-grid { display: grid; gap: 20px; grid-template-columns: repeat(2, 1fr); padding: 0 2px; }
        @media (max-width: 639px) { .exams-grid { grid-template-columns: 1fr; } }

        .section-full { width: 100%; }
        .section-inner { width: 100%; padding: 0 32px; box-sizing: border-box; }
        @media (max-width: 639px) { .section-inner { padding: 0 16px; } .filter-row { flex-direction: column; } }
      `}</style>

      {/* AlertBar */}
      <div className="section-full">
        <AlertBar isMobile={isMobile} C={{ accent: "#ff4d4f" }} />
      </div>

      {/* TopTicker */}
      <div className="section-full">
        <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={{ primary: S.primary, accent: S.accent, gold: S.gold, light: S.light, text: S.text }} gutter="16px" />
      </div>

      {/* Navbar */}
      <Navbar
        bp={bp}
        onMenuOpen={() => {}}
        onNavigate={(page) => navigate(`/${page}`)}
        activePage={location.pathname.split("/")[1]}
      />

      {/* Hero Banner */}
      <div className="section-full" style={{ background: "linear-gradient(135deg,#0f4c81 0%,#1565c0 60%,#0d47a1 100%)", color: "#fff", padding: isMobile ? "32px 0 28px" : "44px 0 36px" }}>
        <div className="section-inner">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12, marginBottom: 14 }}>
                📋 <span>Exam Alerts 2025–26</span>
              </div>
              <h1 style={{ fontSize: isMobile ? "1.6rem" : "2.2rem", fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>
                All Competitive Exams<br />
                <span style={{ color: "#f5a623" }}>in One Place</span>
              </h1>
              <p style={{ fontSize: 14, opacity: 0.88, maxWidth: 480 }}>
                Stay ahead with real-time exam notifications — UPSC, Banking, Engineering, State PSC, Railways & more. Never miss a deadline.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[["📋", EXAMS.length + "+", "Total Exams"], ["✅", stats.open, "Open Now"]].map(([icon, val, label]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "12px 18px", textAlign: "center", minWidth: 90 }}>
                  <div style={{ fontSize: 20 }}>{icon}</div>
                  <strong style={{ display: "block", fontSize: "1.3rem", fontWeight: 800 }}>{val}</strong>
                  <small style={{ fontSize: 11, opacity: 0.8 }}>{label}</small>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search by exam name, body or keyword..."
                style={{ width: "100%", padding: "11px 14px 11px 38px", borderRadius: 9, border: "none", background: "rgba(255,255,255,0.95)", fontSize: 13.5, fontFamily: "'DM Sans',sans-serif", color: "#1a1a2e", outline: "none" }} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: "11px 14px", borderRadius: 9, border: "none", background: "rgba(255,255,255,0.95)", fontSize: 13.5, fontFamily: "'DM Sans',sans-serif", color: "#1a1a2e", outline: "none", minWidth: 130 }}>
              {["All", "Open", "Upcoming", "Closed"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="section-full" style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="section-inner" style={{ paddingTop: 12, paddingBottom: 12 }}>
          <div className="cat-scroll">
            {EXAM_CATEGORIES.map(cat => (
              <span key={cat.label} className={`cat-pill ${activeCategory === cat.label ? "active" : "inactive"}`}
                onClick={() => setActiveCategory(cat.label)}>
                {cat.icon} {cat.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="section-full" style={{ background: S.light }}>
        <div className="section-inner" style={{ paddingTop: 20, paddingBottom: 48 }}>
          <div className="main-layout">

            {/* Left: Exam Cards */}
            <div className="main-content">
              {/* Filter Bar */}
              <div className="filter-row" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap" }}>
                  <select className="filter-select" value={eligibilityFilter} onChange={e => setEligibilityFilter(e.target.value)}>
                    {ELIGIBILITY_FILTERS.map(f => <option key={f}>{f}</option>)}
                  </select>
                  <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <button onClick={() => setShowBookmarksOnly(b => !b)}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: showBookmarksOnly ? "#fff8e1" : "#fff", color: showBookmarksOnly ? "#b45309" : S.muted, border: `1.5px solid ${showBookmarksOnly ? "#f5a623" : S.border}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  ★ Saved ({stats.bookmarked})
                </button>
                <div style={{ fontSize: 13, color: S.muted }}>
                  <strong style={{ color: S.text }}>{filtered.length}</strong> exam{filtered.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Section Header + Status Pills */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, color: S.text }}>
                  <span style={{ width: 4, height: 20, background: S.accent, borderRadius: 3, display: "inline-block" }} />
                  Latest Exams 2025–26
                </h2>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["All", "Open", "Upcoming", "Closed"].map(s => (
                    <span key={s} onClick={() => setStatusFilter(s)} style={{
                      fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, cursor: "pointer",
                      background: statusFilter === s ? (s === "Open" ? "#dcfce7" : s === "Upcoming" ? "#fff8e1" : s === "Closed" ? "#fee2e2" : S.primary) : S.white,
                      color: statusFilter === s ? (s === "Open" ? "#15803d" : s === "Upcoming" ? "#b45309" : s === "Closed" ? "#b91c1c" : "#fff") : S.muted,
                      border: `1.5px solid ${statusFilter === s ? "transparent" : S.border}`,
                    }}>
                      {s === "All" ? "All" : `● ${s}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exam Grid */}
              {filtered.length > 0 ? (
<ExamCard />
              ) : (
                <div style={{ textAlign: "center", padding: "60px 20px", color: S.muted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: S.text, marginBottom: 8 }}>No exams found</h3>
                  <p style={{ fontSize: 14 }}>Try adjusting your search or filters.</p>
                  <button onClick={() => { setSearchVal(""); setActiveCategory("All Exams"); setStatusFilter("All"); setEligibilityFilter("All"); setShowBookmarksOnly(false); }}
                    style={{ marginTop: 16, background: S.primary, color: "#fff", border: "none", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Bottom Banner */}
              <div style={{ marginTop: 28, background: "linear-gradient(90deg,#e8f4fd,#f0f7ff)", border: "1.5px dashed #bdd6f0", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 10, color: "#999", border: "1px solid #ddd", padding: "1px 5px", borderRadius: 3 }}>Tip</span>
                <span style={{ fontSize: 22 }}>🔔</span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <strong style={{ fontSize: 14, display: "block" }}>Never miss an exam deadline!</strong>
                  <span style={{ fontSize: 12, color: S.muted }}>Join our WhatsApp group for instant exam alerts, admit cards & results.</span>
                </div>
                <a href="#" style={{ background: "#16a34a", color: "#fff", padding: "9px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
                  Join WhatsApp →
                </a>
              </div>
            </div>

            {/* Right Sidebar — hidden on tablet/mobile */}
            <div className="sidebar-col">
              {/* Promo Ad */}
              <div style={{ background: "linear-gradient(135deg,#0f4c81,#1565c0)", color: "#fff", borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)", display: "block", marginBottom: 8 }}>Advertisement</span>
                <h5 style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>🚀 Crack Any Exam Faster</h5>
                <p style={{ fontSize: 12, opacity: .85, marginBottom: 14 }}>Mock Tests & PYQs by Testbook — Trusted by 2 Crore+ Students</p>
                <a href="#" style={{ background: S.gold, color: "#000", padding: "8px 18px", borderRadius: 7, fontWeight: 700, fontSize: 12.5, display: "inline-block" }}>Try Free →</a>
              </div>

              <QuickCategories SidebarWidget={SidebarWidget} QuickLink={QuickLink} />
              <TopCompanies SidebarWidget={SidebarWidget} S={S} />

              {/* WhatsApp Ad */}
              <div style={{ background: "linear-gradient(160deg,#1a1a2e,#16213e)", color: "#fff", borderRadius: 12, padding: 18, textAlign: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)", display: "block", marginBottom: 8 }}>Advertisement</span>
                <div style={{ fontSize: 36, marginBottom: 6 }}>📱</div>
                <h6 style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>Get Exam Alerts on WhatsApp</h6>
                <p style={{ fontSize: 12, opacity: .75, marginBottom: 14 }}>Join 5 Lakh+ students getting daily exam updates</p>
                <a href="https://whatsapp.com/channel/0029Vb7fjzJK0IBayWJ7mv0I" style={{ background: "linear-gradient(90deg,#e8472a,#f5a623)", color: "#fff", padding: "8px 18px", borderRadius: 7, fontWeight: 700, fontSize: 12.5, display: "inline-block" }}>Join Free Group →</a>
              </div>

              <JobsByLocation SidebarWidget={SidebarWidget} QuickLink={QuickLink} />
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="section-full">
        <Footer bp={bp} gutter="16px" />
      </div>
    </div>
  );
}