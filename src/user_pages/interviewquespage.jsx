import React, { useState,useEffect } from "react";
import AlertBar from "../components/alertbar";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import VITE_API_BASE_URL from "../config/api";

const C = {
  primary: "#0a2540",
  accent: "#ff4d4f",
  border: "#e5e7eb",
  text: "#374151",
  light: "#f3f4f6",
  muted: "#9ca3af",
  white: "#ffffff",
};

const CATEGORIES = [
  "All", "Python", "Java", "JavaScript", "Web Dev",
  "DSA", "Database", "DevOps", "System Design", "HR & Behavioral",
];

const DIFF_COLOR = {
  Beginner:     { bg: "#dcfce7", text: "#16a34a" },
  Intermediate: { bg: "#fef3c7", text: "#d97706" },
  Advanced:     { bg: "#fee2e2", text: "#dc2626" },
  Mixed:        { bg: "#ede9fe", text: "#7c3aed" },
};



/* ── Badge ────────────────────────────────────────────────── */
function Badge({ label, bg, color }) {
  return (
    <span
      style={{
        fontSize: 10, fontWeight: 700, padding: "2px 8px",
        borderRadius: 20, background: bg, color,
        letterSpacing: 0.4, textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

/* ── Question Item ────────────────────────────────────────── */
function QuestionItem({ q, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 10,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
        Q{index + 1}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, lineHeight: 1.45, marginBottom: 6 }}>
        {q.q}
      </div>
      <button
        onClick={() => setOpen(!open)}
        style={{ fontSize: 11, fontWeight: 700, color: C.accent, background: "none", border: "none", padding: 0, cursor: "pointer", marginTop: 4 }}
      >
        {open ? "▼ Hide Answer" : "▶ Show Answer"}
      </button>
      {open && (
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginTop: 8 }}>
          {q.a}
        </div>
      )}
    </div>
  );
}

/* ── Modal ────────────────────────────────────────────────── */
function Modal({ set, onClose }) {
  const dc = DIFF_COLOR[set.difficulty] || DIFF_COLOR["Beginner"];
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 999, padding: 20,
      }}
    >
      <div
        style={{
          background: C.white, borderRadius: 16,
          width: "100%", maxWidth: 600, maxHeight: "80vh",
          overflowY: "auto", padding: 28,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              {set.category}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.primary, lineHeight: 1.3 }}>
              {set.title}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
              <Badge label={set.difficulty} bg={dc.bg} color={dc.text} />
              <span style={{ fontSize: 12, color: C.muted }}>
                Showing {set.questions.length} of {set.count} questions
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.muted, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Questions */}
        {set.questions.map((q, i) => (
          <QuestionItem key={i} q={q} index={i} />
        ))}

        {/* Practice Tip */}
        <div
          style={{
            marginTop: 16, padding: 14, background: "#f0fdf4",
            borderRadius: 10, border: "1px solid #bbf7d0",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 3 }}>Practice Tip</div>
          <div style={{ fontSize: 12, color: "#15803d" }}>
            Try answering each question out loud before revealing the answer. This mirrors real interview conditions.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Question Set Card ────────────────────────────────────── */
function QuestionCard({ set, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const dc = DIFF_COLOR[set.difficulty] || DIFF_COLOR["Beginner"];
  const lc = DIFF_COLOR[set.level]       || DIFF_COLOR["Beginner"];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        border: `1.5px solid ${hovered ? set.color : C.border}`,
        borderRadius: 14, padding: 20,
        display: "flex", flexDirection: "column", gap: 12,
        transition: "border-color .2s, box-shadow .2s, transform .2s",
        boxShadow: hovered ? `0 8px 28px ${set.color}22` : "0 1px 4px rgba(0,0,0,.06)",
        transform: hovered ? "translateY(-3px)" : "none",
        cursor: "default",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div
          style={{
            width: 46, height: 46, borderRadius: 12, fontSize: 22,
            background: set.color + "18",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          {set.icon}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Badge label={set.difficulty} bg={dc.bg} color={dc.text} />
          <Badge label={set.level}      bg={lc.bg} color={lc.text} />
        </div>
      </div>

      {/* Title + desc */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.primary, lineHeight: 1.3, marginBottom: 5 }}>
          {set.title}
        </div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{set.desc}</div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 14, fontSize: 11, color: C.muted, marginTop: "auto" }}>
        <span>❓ {set.count} questions</span>
        <span>🗂️ {set.category}</span>
      </div>

      {/* View btn */}
      <button
        onClick={() => onOpen(set)}
        style={{
          width: "100%", padding: "9px 0", borderRadius: 9,
          border: "none",
          background: hovered ? set.color : C.light,
          color: hovered ? "#fff" : C.primary,
          fontWeight: 700, fontSize: 12, cursor: "pointer",
          transition: "background .2s, color .2s", letterSpacing: 0.3,
        }}
      >
        👁 View Questions
      </button>
    </div>
  );
}

/* ── Stats Bar ────────────────────────────────────────────── */
function StatsBar({sets}) {
  const totalQ = sets.reduce((a, s) => a + s.count, 0);
  const stats = [
    { label: "Question Sets",  value: sets.length,                                    icon: "📚" },
    { label: "Total Questions", value: totalQ,                                         icon: "❓" },
    { label: "Topics Covered", value: CATEGORIES.length - 1,                          icon: "🗂️" },
    { label: "Advanced Sets",  value: sets.filter(s => s.difficulty === "Advanced").length, icon: "🏆" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: 12, marginBottom: 32,
      }}
    >
      {stats.map(s => (
        <div
          key={s.label}
          style={{
            background: C.white, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "14px 16px", textAlign: "center",
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: C.primary }}>{s.value}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Interview Questions Page ─────────────────────────────── */
export default function InterviewQuestionsPage() {
    
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]                 = useState("");
  const [diffFilter, setDiffFilter]         = useState("All");
  const [activeModal, setActiveModal]       = useState(null);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
    setIsDesktop(window.innerWidth >= 1024);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  useEffect(() => {
  const fetchSets = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/api/interview-ques/get-all-interview-ques`); 
      // 👉 change this if your backend URL is different

      setSets(res.data);
    } catch (error) {
      console.error("Error fetching interview sets:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSets();
}, []);

  const filtered = sets.filter(s => {
    const matchCat    = activeCategory === "All" || s.category === activeCategory;
    const matchDiff   = diffFilter === "All"     || s.difficulty === diffFilter || s.level === diffFilter;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase())  ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDiff && matchSearch;
  });
if (loading) {
  return <div style={{ textAlign: "center", padding: 50 }}>Loading...</div>;
}
if (!loading && sets.length === 0) {
  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      No data found from backend 😢
    </div>
  );
}
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.light, color: C.text, minHeight: "100vh" , width: "100%" , overflowX: "hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
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
        onNavigate={(page) => navigate(`/${page}`)}
        activePage={location.pathname.replace("/", "")}
      />

      {/* ── Hero Banner ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.primary} 0%, #0f3460 100%)`,
          padding: "52px 24px 48px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />

        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: C.accent, textTransform: "uppercase", marginBottom: 12 }}>
          Interview Prep
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
          Crack Your Next <span style={{ color: C.accent }}>Interview</span>
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 14, maxWidth: 480, margin: "0 auto 28px" }}>
          Topic-wise interview questions curated for freshers & experienced developers. Practice, learn, and land the job.
        </p>

        {/* Search */}
        <div style={{ display: "flex", maxWidth: 480, margin: "0 auto", gap: 0 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions or topics..."
            style={{
              flex: 1, padding: "12px 16px", border: "none",
              borderRadius: "10px 0 0 10px", fontSize: 13,
              outline: "none", background: "#fff", color: C.primary,
            }}
          />
          <button
            style={{
              padding: "12px 20px", background: C.accent, color: "#fff",
              border: "none", borderRadius: "0 10px 10px 0",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            🔍
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "36px 20px" }}>
        <StatsBar sets={sets} />

        {/* Filters Row */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 24 }}>

          {/* Category pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, flex: 1 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "6px 14px", borderRadius: 20,
                  border: `1.5px solid ${activeCategory === cat ? C.accent : C.border}`,
                  background: activeCategory === cat ? C.accent : C.white,
                  color: activeCategory === cat ? "#fff" : C.text,
                  fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all .15s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Beginner", "Intermediate", "Advanced"].map(d => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                style={{
                  padding: "6px 14px", borderRadius: 8,
                  border: `1.5px solid ${diffFilter === d ? C.primary : C.border}`,
                  background: diffFilter === d ? C.primary : C.white,
                  color: diffFilter === d ? "#fff" : C.text,
                  fontWeight: 600, fontSize: 12, cursor: "pointer",
                }}
              >
                {d === "All" ? "All Levels" : d}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>
          Showing{" "}
          <strong style={{ color: C.primary }}>{filtered.length}</strong>{" "}
          set{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          {search ? ` matching "${search}"` : ""}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, color: C.primary, marginBottom: 6 }}>No question sets found</div>
            <div style={{ fontSize: 13 }}>Try a different search or category.</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            {filtered.map(set => (
              <QuestionCard key={set.id} set={set} onOpen={setActiveModal} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div
          style={{
            marginTop: 48, padding: "20px 24px",
            background: "#fff7ed", borderRadius: 12,
            border: "1px solid #fed7aa",
            display: "flex", alignItems: "flex-start", gap: 12,width: "100%",
          }}
        >
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontWeight: 700, color: "#92400e", fontSize: 13, marginBottom: 4 }}>
              Tip: click "View Questions" on any card to practice
            </div>
            <div style={{ fontSize: 12, color: "#a16207" }}>
              New question sets are added weekly. Bookmark this page and revisit before your next interview.
            </div>
          </div>
        </div>

        <Footer style={{ marginTop: 60, padding: "24px 20px", textAlign: "center", fontSize: 12, color: C.muted, width: "100%" }}>
          &copy; 2026 Daily Job Openings. All rights reserved.
        </Footer>
      </div>

      {/* ── Modal ── */}
      {activeModal && (
        <Modal set={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}