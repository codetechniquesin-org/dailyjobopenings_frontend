import React, { useState } from "react";

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
  "DSA", "Database", "DevOps", "Interview Prep",
];

const RESOURCES = [
  { id: 1,  title: "Python Complete Handbook",    desc: "Covers basics to advanced: OOP, decorators, generators & more.", type: "PDF", category: "Python",         pages: 320, size: "4.2 MB", color: "#3b82f6", icon: "🐍", level: "Beginner" },
  { id: 2,  title: "Python Data Science Notes",   desc: "NumPy, Pandas, Matplotlib & Scikit-learn cheatsheet.",          type: "DOC", category: "Python",         pages: 80,  size: "1.1 MB", color: "#3b82f6", icon: "🐍", level: "Intermediate" },
  { id: 3,  title: "Python Interview Q&A",        desc: "Top 200 Python interview questions with detailed answers.",      type: "PDF", category: "Python",         pages: 110, size: "2.0 MB", color: "#3b82f6", icon: "🐍", level: "Advanced" },
  { id: 4,  title: "Java Core Concepts",          desc: "OOP, collections, multithreading & exception handling.",        type: "PDF", category: "Java",           pages: 280, size: "3.8 MB", color: "#f59e0b", icon: "☕", level: "Beginner" },
  { id: 5,  title: "Spring Boot Notes",           desc: "REST APIs, dependency injection, JPA & security.",              type: "DOC", category: "Java",           pages: 140, size: "2.3 MB", color: "#f59e0b", icon: "☕", level: "Intermediate" },
  { id: 6,  title: "JavaScript ES6+ Guide",       desc: "Arrow functions, promises, async/await, modules & more.",       type: "PDF", category: "JavaScript",     pages: 190, size: "2.8 MB", color: "#eab308", icon: "⚡", level: "Beginner" },
  { id: 7,  title: "React.js Mastery Notes",      desc: "Hooks, context, Redux, performance & testing.",                 type: "DOC", category: "JavaScript",     pages: 160, size: "2.5 MB", color: "#eab308", icon: "⚡", level: "Intermediate" },
  { id: 8,  title: "HTML & CSS Fundamentals",     desc: "Semantic HTML, Flexbox, Grid & responsive design patterns.",    type: "PDF", category: "Web Dev",        pages: 200, size: "3.1 MB", color: "#ef4444", icon: "🌐", level: "Beginner" },
  { id: 9,  title: "Full Stack Roadmap Doc",      desc: "Structured learning path from HTML to deployment.",             type: "DOC", category: "Web Dev",        pages: 60,  size: "0.9 MB", color: "#ef4444", icon: "🌐", level: "Beginner" },
  { id: 10, title: "DSA Crash Course",            desc: "Arrays, linked lists, trees, graphs, sorting & searching.",     type: "PDF", category: "DSA",            pages: 350, size: "5.1 MB", color: "#8b5cf6", icon: "🧠", level: "Intermediate" },
  { id: 11, title: "LeetCode Patterns Notes",     desc: "Two pointers, sliding window, DP, backtracking patterns.",      type: "DOC", category: "DSA",            pages: 120, size: "1.8 MB", color: "#8b5cf6", icon: "🧠", level: "Advanced" },
  { id: 12, title: "SQL Complete Guide",          desc: "DDL, DML, joins, indexes, transactions & optimization.",        type: "PDF", category: "Database",       pages: 180, size: "2.6 MB", color: "#06b6d4", icon: "🗄️", level: "Beginner" },
  { id: 13, title: "MongoDB Basics",              desc: "Document model, CRUD, aggregation & indexing.",                 type: "DOC", category: "Database",       pages: 90,  size: "1.4 MB", color: "#06b6d4", icon: "🗄️", level: "Beginner" },
  { id: 14, title: "Docker & Kubernetes Notes",   desc: "Containers, images, pods, services & deployments.",             type: "PDF", category: "DevOps",         pages: 170, size: "2.9 MB", color: "#10b981", icon: "⚙️", level: "Intermediate" },
  { id: 15, title: "Linux Command Cheatsheet",    desc: "Essential terminal commands for developers.",                   type: "DOC", category: "DevOps",         pages: 30,  size: "0.5 MB", color: "#10b981", icon: "⚙️", level: "Beginner" },
  { id: 16, title: "System Design Primer",        desc: "Scalability, load balancing, caching, databases & microservices.", type: "PDF", category: "Interview Prep", pages: 240, size: "3.5 MB", color: "#f43f5e", icon: "🎯", level: "Advanced" },
  { id: 17, title: "HR Interview Questions",      desc: "Behavioural, situational & common HR round questions.",         type: "DOC", category: "Interview Prep", pages: 70,  size: "1.0 MB", color: "#f43f5e", icon: "🎯", level: "Beginner" },
];

const LEVEL_COLOR = {
  Beginner:     { bg: "#dcfce7", text: "#16a34a" },
  Intermediate: { bg: "#fef3c7", text: "#d97706" },
  Advanced:     { bg: "#fee2e2", text: "#dc2626" },
};

const TYPE_COLOR = {
  PDF: { bg: "#fee2e2", text: "#dc2626" },
  DOC: { bg: "#dbeafe", text: "#2563eb" },
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

/* ── Resource Card ────────────────────────────────────────── */
function ResourceCard({ res }) {
  const [hovered, setHovered] = useState(false);
  const lvl = LEVEL_COLOR[res.level];
  const typ = TYPE_COLOR[res.type];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        border: `1.5px solid ${hovered ? res.color : C.border}`,
        borderRadius: 14,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color .2s, box-shadow .2s, transform .2s",
        boxShadow: hovered
          ? `0 8px 28px ${res.color}22`
          : "0 1px 4px rgba(0,0,0,.06)",
        transform: hovered ? "translateY(-3px)" : "none",
        cursor: "default",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div
          style={{
            width: 46, height: 46, borderRadius: 12, fontSize: 22,
            background: res.color + "18",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {res.icon}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Badge label={res.type} bg={typ.bg} color={typ.text} />
          <Badge label={res.level} bg={lvl.bg} color={lvl.text} />
        </div>
      </div>

      {/* Title + desc */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.primary, lineHeight: 1.3, marginBottom: 5 }}>
          {res.title}
        </div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{res.desc}</div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 14, fontSize: 11, color: C.muted, marginTop: "auto" }}>
        <span>📄 {res.pages} pages</span>
        <span>💾 {res.size}</span>
      </div>

      {/* Download btn */}
      <button
        style={{
          width: "100%",
          padding: "9px 0",
          borderRadius: 9,
          border: "none",
          background: hovered ? res.color : C.light,
          color: hovered ? "#fff" : C.primary,
          fontWeight: 700,
          fontSize: 12,
          cursor: "pointer",
          transition: "background .2s, color .2s",
          letterSpacing: 0.3,
        }}
      >
        ⬇ Download {res.type}
      </button>
    </div>
  );
}

/* ── Stats Bar ────────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { label: "Total Resources", value: RESOURCES.length,                              icon: "📚" },
    { label: "PDF Files",       value: RESOURCES.filter(r => r.type === "PDF").length, icon: "📕" },
    { label: "DOC Files",       value: RESOURCES.filter(r => r.type === "DOC").length, icon: "📘" },
    { label: "Topics Covered",  value: CATEGORIES.length - 1,                          icon: "🗂️" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: 12,
        marginBottom: 32,
      }}
    >
      {stats.map(s => (
        <div
          key={s.label}
          style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "14px 16px",
            textAlign: "center",
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

/* ── Resources Page ───────────────────────────────────────── */
export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = RESOURCES.filter(r => {
    const matchCat    = activeCategory === "All" || r.category === activeCategory;
    const matchType   = typeFilter === "All"     || r.type === typeFilter;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "sans-serif" }}>

      {/* ── Hero Banner ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.primary} 0%, #0f3460 100%)`,
          padding: "52px 24px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />

        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: C.accent, textTransform: "uppercase", marginBottom: 12 }}>
          Study Materials
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
          Free Learning <span style={{ color: C.accent }}>Resources</span>
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 14, maxWidth: 480, margin: "0 auto 28px" }}>
          Download PDFs & DOCs curated for freshers, developers & interview aspirants. All free.
        </p>

        {/* Search bar */}
        <div style={{ display: "flex", maxWidth: 480, margin: "0 auto", gap: 0 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources..."
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
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 20px" }}>
        <StatsBar />

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

          {/* Type filter */}
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "PDF", "DOC"].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: "6px 14px", borderRadius: 8,
                  border: `1.5px solid ${typeFilter === t ? C.primary : C.border}`,
                  background: typeFilter === t ? C.primary : C.white,
                  color: typeFilter === t ? "#fff" : C.text,
                  fontWeight: 600, fontSize: 12, cursor: "pointer",
                }}
              >
                {t === "All" ? "All Types" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>
          Showing{" "}
          <strong style={{ color: C.primary }}>{filtered.length}</strong>{" "}
          resource{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          {search ? ` matching "${search}"` : ""}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, color: C.primary, marginBottom: 6 }}>No resources found</div>
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
            {filtered.map(res => (
              <ResourceCard key={res.id} res={res} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div
          style={{
            marginTop: 48,
            padding: "20px 24px",
            background: "#fff7ed",
            borderRadius: 12,
            border: "1px solid #fed7aa",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontWeight: 700, color: "#92400e", fontSize: 13, marginBottom: 4 }}>
              Can't find what you need?
            </div>
            <div style={{ fontSize: 12, color: "#a16207" }}>
              More resources are added every week. Bookmark this page or request a specific topic from our team.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
