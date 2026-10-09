import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../components/footer";
import axios from "axios";
import VITE_API_BASE_URL from "../config/api";
import MainLayout from "../components/common_components/MainLayout";

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const C = {
  primary: "#0a2540",
  accent:  "#ff4d4f",
  border:  "#e5e7eb",
  text:    "#374151",
  light:   "#f3f4f6",
  muted:   "#9ca3af",
  white:   "#ffffff",
};

const S = {
  primary: "#0a2540",
  accent:  "#ff4d4f",
  border:  "#e5e7eb",
  text:    "#374151",
  light:   "#f3f4f6",
  muted:   "#9ca3af",
  white:   "#ffffff",
};

const CATEGORIES = [
  { label: "All",           icon: "📚" },
  { label: "Python",        icon: "🐍" },
  { label: "Java",          icon: "☕" },
  { label: "JavaScript",    icon: "⚡" },
  { label: "Web Dev",       icon: "🌐" },
  { label: "DSA",           icon: "🧠" },
  { label: "Database",      icon: "🗄️" },
  { label: "DevOps",        icon: "⚙️" },
  { label: "System Design", icon: "🏗️" },
  { label: "HR & Behavioral", icon: "💼" },
];

const DIFF_COLOR = {
  Beginner:     { bg: "#dcfce7", color: "#16a34a" },
  Intermediate: { bg: "#fef3c7", color: "#d97706" },
  Advanced:     { bg: "#fee2e2", color: "#dc2626" },
  Mixed:        { bg: "#ede9fe", color: "#7c3aed" },
};

/* ─────────────────────────────────────────────
   Hooks
───────────────────────────────────────────── */
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { w, isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

/* ─────────────────────────────────────────────
   Question Item (inside Modal)
───────────────────────────────────────────── */
function QuestionItem({ q, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${S.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
        Q{index + 1}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: S.primary, lineHeight: 1.45, marginBottom: 6 }}>
        {q.q}
      </div>
      <button
        onClick={() => setOpen(!open)}
        style={{ fontSize: 11, fontWeight: 700, color: S.accent, background: "none", border: "none", padding: 0, cursor: "pointer", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}
      >
        {open ? "▼ Hide Answer" : "▶ Show Answer"}
      </button>
      {open && (
        <div style={{ fontSize: 12, color: S.muted, lineHeight: 1.6, marginTop: 8 }}>{q.a}</div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Modal
───────────────────────────────────────────── */
function Modal({ set, onClose }) {
  const dc = DIFF_COLOR[set.difficulty] || DIFF_COLOR["Beginner"];

  // BUG FIX: prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}
    >
      <div style={{ background: S.white, borderRadius: 16, width: "100%", maxWidth: 600, maxHeight: "80vh", overflowY: "auto", padding: 28 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              {set.category}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: S.primary, lineHeight: 1.3 }}>{set.title}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: dc.bg, color: dc.color, letterSpacing: 0.4, textTransform: "uppercase" }}>
                {set.difficulty}
              </span>
              <span style={{ fontSize: 12, color: S.muted }}>
                Showing {set.questions?.length || 0} of {set.count} questions
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: S.muted, lineHeight: 1, fontFamily: "'DM Sans', sans-serif" }}>✕</button>
        </div>

        {/* Questions */}
        {(set.questions || []).map((q, i) => (
          <QuestionItem key={i} q={q} index={i} />
        ))}

        {/* Practice Tip */}
        <div style={{ marginTop: 16, padding: 14, background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 3 }}>Practice Tip</div>
          <div style={{ fontSize: 12, color: "#15803d" }}>
            Try answering each question out loud before revealing the answer. This mirrors real interview conditions.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Question Set Card
───────────────────────────────────────────── */
function QuestionCard({ set, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const dc = DIFF_COLOR[set.difficulty] || DIFF_COLOR["Beginner"];
  const lc = DIFF_COLOR[set.level]      || DIFF_COLOR["Beginner"];
  const col = set.color || "#6b7280";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: S.white,
        border: `1.5px solid ${hovered ? col : S.border}`,
        borderRadius: 14, padding: 20,
        display: "flex", flexDirection: "column", gap: 12,
        transition: "border-color .2s, box-shadow .2s, transform .2s",
        boxShadow: hovered ? `0 8px 28px ${col}22` : "0 1px 4px rgba(0,0,0,.06)",
        transform: hovered ? "translateY(-3px)" : "none",
        cursor: "default",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, fontSize: 22, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {set.icon}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: dc.bg, color: dc.color, letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {set.difficulty}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: lc.bg, color: lc.color, letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {set.level}
          </span>
        </div>
      </div>

      {/* Title + desc */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: S.primary, lineHeight: 1.3, marginBottom: 5 }}>{set.title}</div>
        <div style={{ fontSize: 12, color: S.muted, lineHeight: 1.5 }}>{set.desc}</div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 14, fontSize: 11, color: S.muted, marginTop: "auto" }}>
        <span>❓ {set.count} questions</span>
        <span>🗂️ {set.category}</span>
      </div>

      {/* View btn */}
      <button
        onClick={() => onOpen(set)}
        style={{
          width: "100%", padding: "9px 0", borderRadius: 9, border: "none",
          background: hovered ? col : S.light,
          color: hovered ? "#fff" : S.primary,
          fontWeight: 700, fontSize: 12, cursor: "pointer",
          transition: "background .2s, color .2s", letterSpacing: 0.3,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        👁 View Questions
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function InterviewQuestionsPage() {
  const bp = useBreakpoint();
  // BUG FIX: single source of truth from useBreakpoint — removed duplicate
  // useState + useEffect resize listeners that conflicted with each other
  const { isMobile, isDesktop } = bp;

  const [sets,           setSets]           = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search,         setSearch]         = useState("");
  const [diffFilter,     setDiffFilter]     = useState("All");
  const [activeModal,    setActiveModal]    = useState(null);

  useEffect(() => {
    let cancelled = false;
    // BUG FIX: added cancellation flag so stale fetch can't update unmounted component
    axios.get(`${VITE_API_BASE_URL}/api/interview-ques/get-all-interview-ques`)
      .then(res => {
        if (!cancelled) {
          setSets(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || "Failed to load");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // BUG FIX: defensive string checks to prevent crash when API fields are undefined
  const filtered = sets.filter(s => {
    const matchCat  = activeCategory === "All" || s.category === activeCategory;
    const matchDiff = diffFilter === "All"     || s.difficulty === diffFilter || s.level === diffFilter;
    const q         = search.toLowerCase();
    return matchCat && matchDiff &&
      ((s.title    || "").toLowerCase().includes(q) ||
       (s.desc     || "").toLowerCase().includes(q) ||
       (s.category || "").toLowerCase().includes(q));
  });

  const totalQ = sets.reduce((a, s) => a + (s.count || 0), 0);

  return (
    // BUG FIX: MainLayout now always renders — loading/error states live INSIDE it
    // so the navbar/footer never disappear during load (was a bare early return before)
    <MainLayout C={C} isMobile={isMobile} isDesktop={isDesktop}>
      <>
        <Helmet>
          <title>Interview Questions 2025 | Topic-wise Q&A for Freshers & Developers</title>
          <meta name="description" content="Practice topic-wise interview questions for Python, Java, JavaScript, DSA, System Design, HR and more. Curated for freshers and experienced developers." />
          <meta name="keywords" content="interview questions, coding interview, Java interview, Python interview, DSA questions, HR interview, system design interview" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={`${window.location.origin}/user/interview-questions`} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Interview Questions 2025" />
          <meta property="og:description" content="Topic-wise interview Q&A for freshers and developers. Practice smarter, build confidence." />
          <meta property="og:url" content={`${window.location.origin}/user/interview-questions`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Interview Questions 2025" />
          <meta name="twitter:description" content="Practice topic-wise interview questions for Python, Java, DSA, System Design and more." />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Interview Questions 2025",
            description: "Topic-wise interview questions for freshers and developers.",
            url: `${window.location.origin}/user/interview-questions`,
            keywords: ["interview questions", "coding interview", "Java", "Python", "DSA", "HR"],
          })}</script>
        </Helmet>

        <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: S.light, color: S.text, overflowX: "hidden" }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; background: #f3f4f6 !important; }
            #root { width: 100% !important; overflow-x: hidden !important; }
            a { text-decoration: none; color: inherit; }

            .cat-pill { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 20px; font-size: 12.5px; font-weight: 500; cursor: pointer; white-space: nowrap; border: 1.5px solid; transition: all .18s; flex-shrink: 0; }
            .cat-pill.active   { background: #0a2540; color: #fff; border-color: #0a2540; }
            .cat-pill.inactive { background: #fff; color: #374151; border-color: #e5e7eb; }
            .cat-pill.inactive:hover { border-color: #0a2540; color: #0a2540; }
            .cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
            .cat-scroll::-webkit-scrollbar { display: none; }

            .filter-select { padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #374151; background: #fff; cursor: pointer; outline: none; }
            .filter-select:focus { border-color: #0a2540; }

            .iq-grid { display: grid; gap: 18px; grid-template-columns: repeat(3, 1fr); }
            @media (max-width: 1023px) { .iq-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 639px)  { .iq-grid { grid-template-columns: 1fr; } }

            .section-full  { width: 100%; }
            .section-inner { width: 100%; padding: 0 32px; box-sizing: border-box; }
            @media (max-width: 639px) { .section-inner { padding: 0 16px; } }

            @keyframes shimmer {
              0%   { background-position: -600px 0; }
              100% { background-position:  600px 0; }
            }
            .skeleton-box {
              border-radius: 12px;
              background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
              background-size: 600px 100%;
              animation: shimmer 1.4s ease-in-out infinite;
            }
          `}</style>

          {/* ── Hero Banner ── */}
          <div
            className="section-full"
            style={{
              position: "relative", overflow: "hidden",
              background: "linear-gradient(135deg,#f8fbff 0%,#eef4ff 45%,#f5f9ff 100%)",
              padding: isMobile ? "56px 0 46px" : "84px 0 70px",
            }}
          >
            {/* BG shapes */}
            <div style={{ position: "absolute", top: -100, right: -80, width: 300, height: 300, borderRadius: "40%", background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", opacity: 0.7, transform: "rotate(22deg)" }} />
            <div style={{ position: "absolute", bottom: -120, left: -100, width: 340, height: 340, borderRadius: "50%", background: "linear-gradient(135deg,#fca5a5,#fde68a)", opacity: 0.45, filter: "blur(18px)" }} />
            {/* Grid overlay */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(37,99,235,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.04) 1px,transparent 1px)", backgroundSize: "42px 42px", pointerEvents: "none" }} />

            <div className="section-inner" style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 36 }}>

                {/* LEFT */}
                <div style={{ flex: 1, minWidth: 260 }}>
                  {/* Badge */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #dbeafe", borderRadius: 999, padding: "8px 16px", marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563eb" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", letterSpacing: "0.04em" }}>🎯 Interview Prep</span>
                  </div>

                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "2.3rem" : "4.2rem", fontWeight: 800, lineHeight: 0.98, color: "#111827", marginBottom: 20, letterSpacing: "-0.05em", maxWidth: 700 }}>
                    Crack Your Next <br />
                    <span style={{ color: "#2563eb" }}>Interview</span>
                  </h1>

                  <p style={{ fontSize: isMobile ? 14 : 16, lineHeight: 1.9, color: "#4b5563", maxWidth: 620, marginBottom: 34 }}>
                    Topic-wise interview questions curated for freshers &amp; experienced
                    developers. Practice smarter, build confidence, and land your dream role faster.
                  </p>

                  {/* Search + Difficulty filter */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
                      <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search interview questions or topics..."
                        style={{ width: "100%", padding: "14px 16px 14px 42px", borderRadius: 14, border: "1px solid #dbeafe", background: "#fff", fontSize: 14, color: "#111827", outline: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", fontFamily: "'DM Sans',sans-serif" }}
                      />
                    </div>
                    <select
                      value={diffFilter}
                      onChange={e => setDiffFilter(e.target.value)}
                      style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #dbeafe", background: "#fff", fontSize: 14, color: "#111827", outline: "none", minWidth: 160, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", fontFamily: "'DM Sans',sans-serif" }}
                    >
                      {["All", "Beginner", "Intermediate", "Advanced"].map(d => (
                        <option key={d}>{d === "All" ? "All Levels" : d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* RIGHT STATS */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "center" }}>
                  {[
                    ["📚", sets.length + "+", "Question Sets"],
                    ["❓", totalQ + "+",      "Total Questions"],
                    ["🗂️", CATEGORIES.length - 1, "Topics Covered"],
                  ].map(([icon, val, label]) => (
                    <div key={label} style={{ minWidth: 140, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid #dbeafe", borderRadius: 24, padding: isMobile ? "20px 18px" : "24px 22px", textAlign: "center", boxShadow: "0 18px 45px rgba(37,99,235,0.08)" }}>
                      <div style={{ width: 52, height: 52, borderRadius: 16, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 14px" }}>
                        {icon}
                      </div>
                      <div style={{ fontSize: isMobile ? "1.6rem" : "2rem", fontWeight: 800, color: "#111827", fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
                        {val}
                      </div>
                      <div style={{ marginTop: 8, color: "#6b7280", fontSize: 12, fontWeight: 500 }}>{label}</div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* ── Category Pills Bar ── */}
          <div className="section-full" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
            <div className="section-inner" style={{ paddingTop: 12, paddingBottom: 12 }}>
              <div className="cat-scroll">
                {CATEGORIES.map(cat => (
                  <span
                    key={cat.label}
                    className={`cat-pill ${activeCategory === cat.label ? "active" : "inactive"}`}
                    onClick={() => setActiveCategory(cat.label)}
                  >
                    {cat.icon} {cat.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Main Body ── */}
          <div className="section-full" style={{ background: S.light }}>
            <div className="section-inner" style={{ paddingTop: 24, paddingBottom: 48 }}>

              {/* Filter row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
                  {["All", "Beginner", "Intermediate", "Advanced"].map(d => (
                    <span
                      key={d}
                      onClick={() => setDiffFilter(d)}
                      style={{
                        fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                        background: diffFilter === d ? (d === "Beginner" ? "#dcfce7" : d === "Intermediate" ? "#fef3c7" : d === "Advanced" ? "#fee2e2" : S.primary) : S.white,
                        color:      diffFilter === d ? (d === "Beginner" ? "#16a34a" : d === "Intermediate" ? "#d97706" : d === "Advanced" ? "#dc2626" : "#fff")    : S.muted,
                        border:     `1.5px solid ${diffFilter === d ? "transparent" : S.border}`,
                      }}
                    >
                      {d === "All" ? "All Levels" : `● ${d}`}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: S.muted }}>
                  <strong style={{ color: S.text }}>{filtered.length}</strong> set{filtered.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, color: S.text }}>
                  <span style={{ width: 4, height: 20, background: S.accent, borderRadius: 3, display: "inline-block" }} />
                  Interview Question Sets
                </h2>
                {activeCategory !== "All" && (
                  <span style={{ fontSize: 12, color: S.muted }}>
                    Showing: <strong style={{ color: S.primary }}>{activeCategory}</strong>
                  </span>
                )}
              </div>

              {/* Loading skeleton */}
              {loading && (
                <div className="iq-grid">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="skeleton-box" style={{ height: 240 }} />
                  ))}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: S.muted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: S.text, marginBottom: 8 }}>Failed to load question sets</h3>
                  <p style={{ fontSize: 14 }}>{error}</p>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: S.muted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: S.text, marginBottom: 8 }}>No question sets found</h3>
                  <p style={{ fontSize: 14 }}>Try adjusting your search or filters.</p>
                  <button
                    onClick={() => { setSearch(""); setActiveCategory("All"); setDiffFilter("All"); }}
                    style={{ marginTop: 16, background: S.primary, color: "#fff", border: "none", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Cards Grid */}
              {!loading && !error && filtered.length > 0 && (
                <div className="iq-grid">
                  {filtered.map((set, idx) => (
                    <QuestionCard key={set._id || set.id || idx} set={set} onOpen={setActiveModal} />
                  ))}
                </div>
              )}

              {/* Bottom Banner */}
              <div style={{ marginTop: 28, background: "linear-gradient(90deg,#e8f4fd,#f0f7ff)", border: "1.5px dashed #bdd6f0", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 10, color: "#999", border: "1px solid #ddd", padding: "1px 5px", borderRadius: 3 }}>Tip</span>
                <span style={{ fontSize: 22 }}>💡</span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <strong style={{ fontSize: 14, display: "block" }}>Click "View Questions" to practice</strong>
                  <span style={{ fontSize: 12, color: S.muted }}>New question sets are added weekly. Bookmark this page and revisit before your next interview.</span>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="section-full">
            <Footer bp={bp} gutter="16px" />
          </div>

        </div>

        {/* Modal — rendered outside main div so it overlays everything */}
        {activeModal && (
          <Modal set={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </>
    </MainLayout>
  );
}