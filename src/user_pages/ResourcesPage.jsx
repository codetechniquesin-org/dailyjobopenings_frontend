import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../components/footer";
import MainLayout from "../components/common_components/MainLayout";
import API_BASE_URL from "../config/api";

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
  { label: "All",            icon: "📚" },
  { label: "Python",         icon: "🐍" },
  { label: "Java",           icon: "☕" },
  { label: "JavaScript",     icon: "⚡" },
  { label: "Web Dev",        icon: "🌐" },
  { label: "DSA",            icon: "🧠" },
  { label: "Database",       icon: "🗄️" },
  { label: "DevOps",         icon: "⚙️" },
  { label: "Interview Prep", icon: "🎯" },
];

const LEVEL_COLOR = {
  Beginner:     { bg: "#dcfce7", color: "#16a34a" },
  Intermediate: { bg: "#fef3c7", color: "#d97706" },
  Advanced:     { bg: "#fee2e2", color: "#dc2626" },
};

const TYPE_COLOR = {
  PDF: { bg: "#fee2e2", color: "#dc2626" },
  DOC: { bg: "#dbeafe", color: "#2563eb" },
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

function ResourceCard({ res }) {
  const [hovered, setHovered] = useState(false);
  const lvl = LEVEL_COLOR[res.level] || { bg: "#f3f4f6", color: "#374151" };
  const typ = TYPE_COLOR[res.type]   || { bg: "#f3f4f6", color: "#374151" };
  const col = res.color || "#6b7280";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? col : S.border}`,
        borderRadius: 14,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 12,
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
        <div style={{
          width: 46, height: 46, borderRadius: 12, fontSize: 22,
          background: col + "18",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {res.icon}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: typ.bg, color: typ.color, letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {res.type}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: lvl.bg, color: lvl.color, letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {res.level}
          </span>
        </div>
      </div>

      {/* Title + desc */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: S.primary, lineHeight: 1.3, marginBottom: 5 }}>
          {res.title}
        </div>
        <div style={{ fontSize: 12, color: S.muted, lineHeight: 1.5 }}>{res.desc}</div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 14, fontSize: 11, color: S.muted, marginTop: "auto" }}>
        <span>📄 {res.pages} pages</span>
        <span>💾 {res.size}</span>
      </div>

      {/* Download btn */}
      <button
        onClick={() => res.fileUrl && window.open(res.fileUrl, "_blank")}
        style={{
          width: "100%", padding: "9px 0", borderRadius: 9, border: "none",
          background: hovered ? col : S.light,
          color: hovered ? "#fff" : S.primary,
          fontWeight: 700, fontSize: 12, cursor: "pointer",
          transition: "background .2s, color .2s", letterSpacing: 0.3,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        ⬇ Download {res.type}
      </button>
    </div>
  );
}

export default function ResourcesPage() {
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop } = bp;

  const [resources,      setResources]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search,         setSearch]         = useState("");
  const [typeFilter,     setTypeFilter]     = useState("All");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/resources/get-all-resources`)
      .then(res => { if (!res.ok) throw new Error(`Server error ${res.status}`); return res.json(); })
      .then(data => { if (!cancelled) { setResources(Array.isArray(data) ? data : []); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const filtered = resources.filter(r => {
    const matchCat  = activeCategory === "All" || r.category === activeCategory;
    const matchType = typeFilter === "All"     || r.type === typeFilter;
    const q         = search.toLowerCase();
    return matchCat && matchType &&
      ((r.title || "").toLowerCase().includes(q) || (r.desc || "").toLowerCase().includes(q));
  });

  const stats = {
    total: resources.length,
    pdfs:  resources.filter(r => r.type === "PDF").length,
    docs:  resources.filter(r => r.type === "DOC").length,
  };

  return (
    <MainLayout C={C} isMobile={isMobile} isDesktop={isDesktop}>
      <>
        <Helmet>
          <title>Free Learning Resources 2025 | PDFs, Notes & Interview Guides</title>
          <meta name="description" content="Download free PDFs, interview notes, coding sheets, aptitude materials and study guides for freshers, developers and job seekers." />
          <meta name="keywords" content="free study materials, PDF notes, interview preparation, DSA notes, Python PDF, Java notes, coding resources" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={`${window.location.origin}/user/resources`} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Free Learning Resources 2025" />
          <meta property="og:description" content="Download curated PDFs, notes and guides for freshers, developers and job seekers — completely free." />
          <meta property="og:url" content={`${window.location.origin}/user/resources`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Free Learning Resources 2025" />
          <meta name="twitter:description" content="Free PDFs, interview notes, coding sheets & study guides." />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Free Learning Resources 2025",
            description: "Download free PDFs, interview notes, coding sheets and study guides.",
            url: `${window.location.origin}/user/resources`,
            keywords: ["free PDFs", "study material", "interview prep", "coding notes", "DSA"],
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

            .res-grid { display: grid; gap: 18px; grid-template-columns: repeat(3, 1fr); }
            @media (max-width: 1023px) { .res-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 639px)  { .res-grid { grid-template-columns: 1fr; } }

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
            <div style={{ position: "absolute", bottom: -120, left: -100, width: 340, height: 340, borderRadius: "50%", background: "linear-gradient(135deg,#fde68a,#fca5a5)", opacity: 0.45, filter: "blur(18px)" }} />
            {/* Grid overlay */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(37,99,235,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.04) 1px,transparent 1px)", backgroundSize: "42px 42px", pointerEvents: "none" }} />

            <div className="section-inner" style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 36 }}>

                {/* LEFT */}
                <div style={{ flex: 1, minWidth: 260 }}>
                  {/* Badge */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #dbeafe", borderRadius: 999, padding: "8px 16px", marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563eb" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", letterSpacing: "0.04em" }}>📚 Study Materials</span>
                  </div>

                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "2.3rem" : "4.2rem", fontWeight: 800, lineHeight: 0.98, color: "#111827", marginBottom: 20, letterSpacing: "-0.05em", maxWidth: 700 }}>
                    Free Learning <br />
                    <span style={{ color: "#2563eb" }}>Resources</span>
                  </h1>

                  <p style={{ fontSize: isMobile ? 14 : 16, lineHeight: 1.9, color: "#4b5563", maxWidth: 620, marginBottom: 34 }}>
                    Download curated PDFs, interview notes, aptitude materials,
                    coding sheets &amp; learning guides for freshers, developers
                    and job seekers — completely free.
                  </p>

                  {/* Search + Type filter */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
                      <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search resources, PDFs or notes..."
                        style={{ width: "100%", padding: "14px 16px 14px 42px", borderRadius: 14, border: "1px solid #dbeafe", background: "#fff", fontSize: 14, color: "#111827", outline: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", fontFamily: "'DM Sans',sans-serif" }}
                      />
                    </div>
                    <select
                      value={typeFilter}
                      onChange={e => setTypeFilter(e.target.value)}
                      style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #dbeafe", background: "#fff", fontSize: 14, color: "#111827", outline: "none", minWidth: 150, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", fontFamily: "'DM Sans',sans-serif" }}
                    >
                      {["All", "PDF", "DOC"].map(t => <option key={t}>{t === "All" ? "All Types" : t}</option>)}
                    </select>
                  </div>
                </div>

                {/* RIGHT STATS */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "center" }}>
                  {[
                    ["📚", resources.length + "+", "Total Resources"],
                    ["📕", stats.pdfs,              "PDF Files"],
                    ["📘", stats.docs,              "DOC Files"],
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
                <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap" }}>
                  {/* Type pills (same pattern as ExamsPage status pills) */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["All", "PDF", "DOC"].map(t => (
                      <span
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        style={{
                          fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                          background: typeFilter === t ? (t === "PDF" ? "#fee2e2" : t === "DOC" ? "#dbeafe" : S.primary) : S.white,
                          color:      typeFilter === t ? (t === "PDF" ? "#dc2626" : t === "DOC" ? "#2563eb" : "#fff")   : S.muted,
                          border:     `1.5px solid ${typeFilter === t ? "transparent" : S.border}`,
                        }}
                      >
                        {t === "All" ? "All Types" : t}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: S.muted }}>
                  <strong style={{ color: S.text }}>{filtered.length}</strong> resource{filtered.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, color: S.text }}>
                  <span style={{ width: 4, height: 20, background: S.accent, borderRadius: 3, display: "inline-block" }} />
                  Free Study Materials
                </h2>
                {activeCategory !== "All" && (
                  <span style={{ fontSize: 12, color: S.muted }}>
                    Showing: <strong style={{ color: S.primary }}>{activeCategory}</strong>
                  </span>
                )}
              </div>

              {/* Loading */}
              {loading && (
                <div className="res-grid">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="skeleton-box" style={{ height: 240 }} />
                  ))}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: S.muted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: S.text, marginBottom: 8 }}>Failed to load resources</h3>
                  <p style={{ fontSize: 14 }}>{error}</p>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: S.muted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: S.text, marginBottom: 8 }}>No resources found</h3>
                  <p style={{ fontSize: 14 }}>Try adjusting your search or filters.</p>
                  <button
                    onClick={() => { setSearch(""); setActiveCategory("All"); setTypeFilter("All"); }}
                    style={{ marginTop: 16, background: S.primary, color: "#fff", border: "none", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Cards Grid */}
              {!loading && !error && filtered.length > 0 && (
                <div className="res-grid">
                  {filtered.map((res, idx) => (
                    <ResourceCard key={res._id || res.id || idx} res={res} />
                  ))}
                </div>
              )}

              {/* Bottom Banner */}
              <div style={{ marginTop: 28, background: "linear-gradient(90deg,#e8f4fd,#f0f7ff)", border: "1.5px dashed #bdd6f0", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 10, color: "#999", border: "1px solid #ddd", padding: "1px 5px", borderRadius: 3 }}>Tip</span>
                <span style={{ fontSize: 22 }}>💡</span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <strong style={{ fontSize: 14, display: "block" }}>Can't find what you need?</strong>
                  <span style={{ fontSize: 12, color: S.muted }}>More resources are added every week. Bookmark this page or request a specific topic.</span>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="section-full">
            <Footer bp={bp} gutter="16px" />
          </div>

        </div>
      </>
    </MainLayout>
  );
}