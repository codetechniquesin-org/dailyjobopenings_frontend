import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import AlertBar from "../components/alertbar";
import API_BASE_URL from "../config/api";

/* ─────────────────────────────────────────────
   THEME (matches ViewJob)
───────────────────────────────────────────── */
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

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0,
  width: "100%", height: "100%",
  background: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "#ffffff",
  padding: "24px",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "320px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
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
  textDecoration: "none",
});

const BADGE_STYLE = {
  Government:  { background: "#fff8e1", color: "#b45309" },
  Engineering: { background: "#e8f4fd", color: "#0f4c81" },
  Banking:     { background: "#dcfce7", color: "#15803d" },
  Railway:     { background: "#fce7f3", color: "#9d174d" },
  Defence:     { background: "#fee2e2", color: "#b91c1c" },
  Teaching:    { background: "#ede9fe", color: "#6d28d9" },
  Medical:     { background: "#f0fdfa", color: "#0f766e" },
  Law:         { background: "#fef3c7", color: "#92400e" },
  Management:  { background: "#f0f7ff", color: "#1e40af" },
  SSC:         { background: "#fff7ed", color: "#c2410c" },
  UPSC:        { background: "#fdf4ff", color: "#86198f" },
  "State PSC": { background: "#f0fdf4", color: "#166534" },
  Entrance:    { background: "#fff1f2", color: "#be123c" },
  Private:     { background: "#f8fafc", color: "#475569" },
  Other:       { background: "#f4f4f5", color: "#3f3f46" },
};

const CATEGORY_STYLE = {
  Notification: { background: "#e8f4fd", color: "#0f4c81" },
  "Admit Card": { background: "#fff8e1", color: "#b45309" },
  Result:       { background: "#dcfce7", color: "#15803d" },
  "Answer Key": { background: "#fef3c7", color: "#92400e" },
  Syllabus:     { background: "#ede9fe", color: "#6d28d9" },
  Counselling:  { background: "#fce7f3", color: "#9d174d" },
  Scholarship:  { background: "#f0fdfa", color: "#0f766e" },
  Recruitment:  { background: "#fff7ed", color: "#c2410c" },
};

/* ─────────────────────────────────────────────
   BREAKPOINT HOOK
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11.5, color: C.muted, background: C.light,
      padding: "4px 10px", borderRadius: 6,
      whiteSpace: "normal", wordBreak: "break-word",
      overflowWrap: "anywhere", maxWidth: "100%",
    }}>
      {children}
    </span>
  );
}

function Pill({ children, bg, color }) {
  return (
    <span style={{
      background: bg, color, padding: "4px 11px",
      borderRadius: 20, fontSize: 12, fontWeight: 500,
      whiteSpace: "normal", wordBreak: "break-word",
      overflowWrap: "anywhere", maxWidth: "100%", display: "inline-block",
    }}>
      {children}
    </span>
  );
}

function SectionTitle({ text }) {
  return (
    <h2 style={{
      fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700,
      display: "flex", alignItems: "center", gap: 8, margin: "0 0 18px", color: "black",
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

/* ─────────────────────────────────────────────
   DATE HELPERS
───────────────────────────────────────────── */
function fmt(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - Date.now()) / 86400000);
  return diff;
}

function StatusBadge({ date, prefix = "" }) {
  if (!date) return <span style={{ fontSize: 13, color: C.muted }}>N/A</span>;
  const d = daysLeft(date);
  let color = C.green, bg = "#dcfce7", label = "";
  if (d < 0) { color = "#6b7280"; bg = "#f1f5f9"; label = "Closed"; }
  else if (d === 0) { color = C.accent; bg = "#fee2e2"; label = "Today"; }
  else if (d <= 7) { color = "#b45309"; bg = "#fff8e1"; label = `${d}d left`; }
  else { label = fmt(date); color = C.green; bg = "#dcfce7"; }

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{fmt(date)}</div>
      {d !== null && (
        <span style={{ background: bg, color, fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 4, marginTop: 3, display: "inline-block" }}>
          {prefix}{label}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function ViewExamSkeleton() {
  const { isMobile, showSidebar, w } = useBreakpoint();
  const gutter = isMobile ? "10px" : "24px";
  const S = (width, height, extra = {}) => (
    <span style={{
      display: "block", width, height, borderRadius: 6, flexShrink: 0,
      background: "linear-gradient(90deg,#e2e8f0 25%,#cdd5e0 50%,#e2e8f0 75%)",
      backgroundSize: "200% 100%", animation: "skshimmer 1.5s infinite", ...extra,
    }} />
  );
  const SCard = ({ children, style = {} }) => (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: isMobile ? 14 : 18, marginBottom: 12, ...style }}>
      {children}
    </div>
  );
  const Col = ({ children }) => <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#f4f7fb", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <style>{`@keyframes skshimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}html,body{width:100%!important;margin:0!important;padding:0!important;overflow-x:hidden!important}#root{width:100%!important;overflow-x:hidden!important}`}</style>
      <div style={{ padding: `12px ${gutter} 0` }}>{S(200, 12, { borderRadius: 4 })}</div>
      <div style={{ padding: `14px ${gutter} 40px`, display: "flex", flexDirection: showSidebar ? "row" : "column", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SCard style={{ borderLeft: "4px solid #0f4c81", borderRadius: "0 14px 14px 0" }}>
            <div style={{ display: "flex", gap: 14 }}>
              {S(isMobile ? 48 : 80, isMobile ? 48 : 80, { borderRadius: 12, flexShrink: 0 })}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  {S(56, 20, { borderRadius: 5 })}{S(68, 20, { borderRadius: 5 })}
                </div>
                {S("72%", 24, { borderRadius: 6, marginBottom: 8 })}
                {S("40%", 16, { borderRadius: 5, marginBottom: 10 })}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[100, 88, 106].map((bw, i) => S(bw, 24, { borderRadius: 6, key: i }))}
                </div>
              </div>
            </div>
            <div style={{ height: 1, background: "#e2e8f0", margin: "18px 0" }} />
            <div style={{ display: "flex", gap: 10 }}>
              {[128, 108, 88].map((bw, i) => S(bw, 42, { borderRadius: 9, key: i }))}
            </div>
          </SCard>
          {[1, 2, 3].map(i => (
            <SCard key={i}>
              {S(110, 18, { borderRadius: 5, marginBottom: 16 })}
              <Col>{[100, 97, 92, 86, 72].map((p, j) => S(`${p}%`, 13, { borderRadius: 4, key: j }))}</Col>
            </SCard>
          ))}
        </div>
        {showSidebar && (
          <div style={{ width: w >= 1280 ? 300 : 260, flexShrink: 0 }}>
            {[1, 2].map(i => (
              <SCard key={i}>
                {S(142, 13, { marginBottom: 14 })}
                <Col>{[100, 94, 86, 76].map((p, j) => S(`${p}%`, 11, { borderRadius: 3, key: j }))}</Col>
              </SCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NOT FOUND
───────────────────────────────────────────── */
function ExamNotFound() {
  return (
    <div style={{
      fontFamily: "'DM Sans',sans-serif", background: "#f4f7fb", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "32px 20px", textAlign: "center",
    }}>
      <style>{`
        @keyframes njf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes njf-fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .njf-float{animation:njf-float 3.5s ease-in-out infinite}
        .njf-f1{animation:njf-fadeUp .6s ease .1s both}.njf-f2{animation:njf-fadeUp .6s ease .2s both}
        .njf-f3{animation:njf-fadeUp .6s ease .3s both}.njf-f4{animation:njf-fadeUp .6s ease .4s both}
        .njf-btn-primary{background:#0f4c81;color:#fff;padding:12px 24px;border-radius:9px;font-weight:700;font-size:13.5px;font-family:'Syne',sans-serif;text-decoration:none;display:inline-block}
        .njf-btn-outline{background:#fff;color:#0f4c81;border:1.5px solid #0f4c81;padding:11px 22px;border-radius:9px;font-weight:600;font-size:13.5px;text-decoration:none;display:inline-block}
        html,body{width:100%!important;margin:0!important;padding:0!important;overflow-x:hidden!important}#root{width:100%!important;overflow-x:hidden!important}
      `}</style>
      <div className="njf-float">
        <svg width="160" height="140" viewBox="0 0 160 140" fill="none">
          <rect x="20" y="20" width="120" height="100" rx="12" fill="#e8eef6" stroke="#c8d6e8" strokeWidth="1.5"/>
          <rect x="20" y="20" width="120" height="22" rx="12" fill="#cddaed" stroke="#c8d6e8" strokeWidth="1.5"/>
          <rect x="20" y="31" width="120" height="11" fill="#cddaed"/>
          <rect x="36" y="58" width="60" height="8" rx="4" fill="#c8d6e8"/>
          <rect x="36" y="72" width="88" height="7" rx="3.5" fill="#dce6f2"/>
          <rect x="36" y="85" width="72" height="7" rx="3.5" fill="#dce6f2"/>
          <rect x="36" y="98" width="50" height="7" rx="3.5" fill="#dce6f2"/>
          <circle cx="112" cy="108" r="22" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1.5"/>
          <line x1="105" y1="101" x2="119" y2="115" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="119" y1="101" x2="105" y2="115" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="njf-f1"><span style={{ display:"inline-block",background:"#fee2e2",color:"#b91c1c",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,letterSpacing:".5px",textTransform:"uppercase",marginBottom:16 }}>404 — Not Found</span></div>
      <div className="njf-f2"><h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(22px,5vw,30px)",fontWeight:800,color:"#1a1a2e",marginBottom:10 }}>Oops! This exam listing has vanished</h1></div>
      <div className="njf-f3"><p style={{ fontSize:14,color:"#6b7280",maxWidth:360,lineHeight:1.7,marginBottom:28 }}>The exam listing you're looking for may have expired, been removed, or the link might be incorrect.</p></div>
      <div className="njf-f4" style={{ display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center" }}>
        <a href="/" className="njf-btn-primary">Browse All Exams →</a>
        <a href="#" onClick={() => window.history.back()} className="njf-btn-outline">← Go Back</a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR WIDGET
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
   IMPORTANT DATES ROW
───────────────────────────────────────────── */
function DateRow({ icon, label, date }) {
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>
        <SectionLabel>{label}</SectionLabel>
        <StatusBadge date={date} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
function Sidebar({ exam }) {
  return (
    <div style={{ width: "100%" }}>

      {/* Organisation Card */}
      <SidebarWidget title="🏛️ About the Organisation">
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${C.border}`, flexShrink: 0, overflow: "hidden",
          }}>
            {exam.image
              ? <img src={exam.image} alt={exam.organization} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
              : <span style={{ fontSize: 22 }}>🏛️</span>
            }
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{exam.title}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{exam.organization}</div>
          </div>
        </div>
        {exam.overview && (
          <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
            {exam.overview}
          </div>
        )}
        {exam.officialWebsite && (
          <a
            href={exam.officialWebsite} target="_blank" rel="noopener noreferrer"
            style={{
              display: "block", textAlign: "center", fontSize: 12.5, color: C.primary,
              fontWeight: 600, border: `1.5px solid ${C.border}`, borderRadius: 8,
              padding: "8px 10px", wordBreak: "break-word", overflowWrap: "anywhere",
            }}
          >
            Visit Official Website →
          </a>
        )}
      </SidebarWidget>

      {/* Exam Summary */}
      <SidebarWidget title="📋 Exam Summary">
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {[
            ["📌", "EXAM TYPE",     exam.examType],
            ["🗂️", "CATEGORY",     exam.category],
            ["💻", "EXAM MODE",     exam.examMode],
            ["📍", "LOCATION",      exam.location],
            ["💰", "APPLICATION FEE", exam.applicationFee],
            ["🎂", "AGE LIMIT",     exam.ageLimit],
          ].map(([icon, lbl, val]) => val && (
            <div key={lbl} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, flexShrink: 0, marginTop: 2 }}>{icon}</span>
              <div>
                <SectionLabel>{lbl}</SectionLabel>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
      </SidebarWidget>

      {/* Ad */}
      <div style={{
        background: "linear-gradient(135deg,#0f4c81,#1565c0)",
        color: "#fff", borderRadius: 12, padding: 18,
        textAlign: "center", marginBottom: 14,
      }}>
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Advertisement</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>📚 Crack Any Govt Exam</div>
        <p style={{ fontSize: 12, opacity: 0.85, marginBottom: 14 }}>Testbook Pro — India's #1 Exam Prep Platform</p>
        <a href="#" style={{ background: C.gold, color: "#000", padding: "9px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13, display: "inline-block", fontFamily: "'Syne',sans-serif" }}>
          Start Free →
        </a>
      </div>

      {/* Important Dates */}
      <SidebarWidget title="📅 Important Dates">
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <DateRow icon="📝" label="APPLICATION START" date={exam.applicationStartDate} />
          <DateRow icon="⏰" label="LAST DATE TO APPLY" date={exam.applicationEndDate} />
          <DateRow icon="📖" label="EXAM DATE" date={exam.examDate} />
          <DateRow icon="📊" label="RESULT DATE" date={exam.resultDate} />
        </div>
      </SidebarWidget>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ViewExam() {
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop, showSidebar, w } = bp;
  const gutter = isMobile ? "14px" : isTablet ? "20px" : "24px";
  const [showShare, setShowShare] = useState(false);
  const [saved, setSaved] = useState(false);
  const { slug } = useParams();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/exams/get-exam/${slug}`);
        console.log("Fetch response:", res);
        const data = await res.json();
        setExam(data.exam);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [slug]);

  if (loading) return <ViewExamSkeleton />;
  if (!exam) return <ExamNotFound />;

  const appEndDays = daysLeft(exam.applicationEndDate);
  const isUrgent = appEndDays !== null && appEndDays >= 0 && appEndDays <= 7;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.light, color: C.text, minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        ul { list-style: disc; padding-left: 20px; }
        li { margin-bottom: 6px; font-size: 13.5px; line-height: 1.8; color: ${C.text}; }
        .btn-apply {
          background: ${C.primary}; color: #fff; border: none;
          padding: 12px 28px; border-radius: 9px; font-weight: 700;
          font-size: 14px; font-family: 'Syne',sans-serif;
          display: inline-block; cursor: pointer; transition: background .2s; white-space: nowrap;
        }
        .btn-apply:hover { background: #0a3a65; }
        .btn-save {
          background: #fff; color: ${C.primary}; border: 1.5px solid ${C.primary};
          padding: 11px 22px; border-radius: 9px; font-weight: 600;
          font-size: 13.5px; cursor: pointer; transition: background .2s; white-space: nowrap;
        }
        .btn-save:hover { background: ${C.light}; }
        .btn-share {
          font-size: 13px; color: ${C.muted}; padding: 11px 14px;
          border-radius: 9px; border: 1px solid ${C.border};
          background: #fff; cursor: pointer; transition: background .2s; white-space: nowrap;
        }
        .btn-share:hover { background: ${C.light}; }
        @media (max-width: 639px) {
          .exam-title { font-size: 19px !important; }
          .detail-grid { grid-template-columns: 1fr 1fr !important; }
          .action-row { flex-direction: column; align-items: stretch !important; }
          .action-row .btn-apply, .action-row .btn-save, .action-row .btn-share { width: 100%; text-align: center; }
        }
        @media (min-width: 640px) { .exam-title { font-size: 21px !important; } }
        @media (min-width: 1024px) { .exam-title { font-size: 24px !important; } }
        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }
      `}</style>

      <AlertBar isMobile={false} C={{ accent: "#ff4d4f" }} />
      <TopTicker
        isMobile={isMobile}
        isDesktop={isDesktop}
        C={C}
        gutter="16px"
      />
      <Navbar bp={bp} onMenuOpen={() => {}} />

      {/* BREADCRUMB */}
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: `12px ${gutter} 0` }}>
        <div style={{ fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <a href="/" style={{ color: C.primary }}>Home</a>
          <span>›</span>
          <a href="/exams" style={{ color: C.primary }}>Exams</a>
          <span>›</span>
          <a href={`/exams?type=${exam.examType}`} style={{ color: C.primary }}>{exam.examType}</a>
          <span>›</span>
          <span style={{ color: C.text }}>{exam.shortTitle || exam.title}</span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{
        maxWidth: "100%", margin: "16px auto",
        padding: `0 ${gutter} 56px`,
        display: "flex", flexDirection: showSidebar ? "row" : "column",
        gap: 22, alignItems: "flex-start",
      }}>

        {/* ═══════════════ LEFT COLUMN ═══════════════ */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── HERO CARD ── */}
          <Card style={{ marginBottom: 14, borderLeft: `4px solid ${C.primary}` }}>
            <div style={{ display: "flex", gap: 16, alignItems: isMobile ? "center" : "flex-start", flexDirection: isMobile ? "column" : "row" }}>

              {/* Exam logo / icon */}
              <div style={{
                width: isMobile ? 56 : 96, height: isMobile ? 56 : 96,
                borderRadius: 14, background: "#f0f7ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${C.border}`, flexShrink: 0, overflow: "hidden",
              }}>
                {exam.image
                  ? <img src={exam.image} alt={exam.title} style={{ width: "85%", height: "85%", objectFit: "contain" }} />
                  : <span style={{ fontSize: isMobile ? 26 : 38 }}>📋</span>
                }
              </div>

              {/* Title / meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ ...(BADGE_STYLE[exam.examType] || BADGE_STYLE.Other), fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>
                    {exam.examType}
                  </span>
                  <span style={{ ...(CATEGORY_STYLE[exam.category] || {}), fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>
                    {exam.category}
                  </span>
                  {exam.isFeatured && (
                    <span style={{ background: "#fff8e1", color: "#b45309", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>
                      ⭐ Featured
                    </span>
                  )}
                  {exam.isActive && (
                    <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>
                      🟢 Active
                    </span>
                  )}
                </div>

                <h1 className="exam-title" style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: 800, color: C.text,
                  lineHeight: 1.2, marginBottom: 5, wordBreak: "break-word", overflowWrap: "anywhere",
                }}>
                  {exam.title}
                  {exam.shortTitle && (
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: C.muted, marginLeft: 8 }}>
                      ({exam.shortTitle})
                    </span>
                  )}
                </h1>

                <div style={{ fontSize: isMobile ? 13.5 : 15, fontWeight: 600, color: C.primary, marginBottom: 10 }}>
                  {exam.organization}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {exam.examMode && <Tag>💻 {exam.examMode}</Tag>}
                  {exam.location && <Tag>📍 {exam.location}</Tag>}
                  {exam.publishedAt && (
                    <Tag>📅 Published {new Date(exam.publishedAt).toDateString()}</Tag>
                  )}
                </div>
              </div>

              {/* Deadline chip — tablet landscape+ */}
              {w >= 768 && exam.applicationEndDate && (
                <div style={{
                  background: isUrgent
                    ? "linear-gradient(135deg,#fff8e1,#fef3c7)"
                    : "linear-gradient(135deg,#f0fff4,#e8f5e9)",
                  border: `1.5px solid ${isUrgent ? "#fcd34d" : "#86efac"}`,
                  borderRadius: 10, padding: "14px 18px", textAlign: "center", flexShrink: 0,
                }}>
                  <div style={{ fontSize: 10.5, color: C.muted, marginBottom: 3, fontWeight: 600 }}>LAST DATE</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, color: isUrgent ? "#b45309" : C.green }}>
                    {fmt(exam.applicationEndDate)}
                  </div>
                  {appEndDays !== null && appEndDays >= 0 && (
                    <div style={{ fontSize: 11, color: isUrgent ? "#b45309" : C.muted, marginTop: 2 }}>
                      {appEndDays === 0 ? "Closes Today!" : `${appEndDays} days left`}
                    </div>
                  )}
                  {appEndDays !== null && appEndDays < 0 && (
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Closed</div>
                  )}
                </div>
              )}
            </div>

            {/* Deadline strip for mobile */}
            {w < 768 && exam.applicationEndDate && (
              <div style={{
                marginTop: 12,
                background: isUrgent ? "linear-gradient(135deg,#fff8e1,#fef3c7)" : "linear-gradient(135deg,#f0fff4,#e8f5e9)",
                border: `1.5px solid ${isUrgent ? "#fcd34d" : "#86efac"}`,
                borderRadius: 10, padding: "11px 14px",
                display: "flex", flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center", gap: 8,
              }}>
                <div>
                  <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>LAST DATE TO APPLY</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: isUrgent ? "#b45309" : C.green }}>
                    {fmt(exam.applicationEndDate)}
                  </div>
                </div>
                {appEndDays !== null && (
                  <div style={{ fontSize: 11.5, color: isUrgent ? "#b45309" : C.muted }}>
                    {appEndDays < 0 ? "Applications closed" : appEndDays === 0 ? "Closes today!" : `${appEndDays} days remaining`}
                  </div>
                )}
              </div>
            )}

            <Divider />

            {/* Action buttons */}
            <div className="action-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {exam.applyUrl && (
                <a href={exam.applyUrl} target="_blank" rel="noreferrer" className="btn-apply">
                  Apply Now →
                </a>
              )}
              <button className="btn-save" onClick={() => setSaved(!saved)}>
                {saved ? "✅ Saved" : "🔖 Save Exam"}
              </button>
              <button className="btn-share" onClick={() => setShowShare(true)}>
                📤 Share
              </button>

              {/* Share modal */}
              {showShare && (
                <div style={overlayStyle}>
                  <div style={modalStyle}>
                    <h3 style={{ marginBottom: "10px" }}>Share Exam</h3>
                    <input
                      type="text"
                      value={`${window.location.origin}/view-exam/${exam.slug}`}
                      readOnly
                      style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "12px" }}
                    />
                    <button
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/view-exam/${exam.slug}`); alert("Link copied!"); }}
                      style={{ padding: "8px 14px", borderRadius: "8px", border: "none", background: "#0f4c81", color: "#fff", cursor: "pointer" }}
                    >
                      Copy Link
                    </button>
                    <div style={{ marginTop: "18px", display: "flex", justifyContent: "center", gap: "12px" }}>
                      <a href={`https://wa.me/?text=${window.location.origin}/view-exam/${exam.slug}`} target="_blank" style={iconBtn("#25D366")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M20.52 3.48A11.94 11.94 0 0012.02 0C5.39 0 .02 5.37.02 12c0 2.12.55 4.18 1.6 6L0 24l6.17-1.62A11.96 11.96 0 0012.02 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.5-8.52zM12.02 22c-1.82 0-3.6-.48-5.17-1.38l-.37-.22-3.66.96.98-3.57-.24-.37A9.93 9.93 0 012.02 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.49-7.32c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/></svg>
                      </a>
                      <a href={`https://twitter.com/intent/tweet?url=${window.location.origin}/view-exam/${exam.slug}`} target="_blank" style={iconBtn("#1DA1F2")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.6 8.6 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9 12.14 12.14 0 01-8.82-4.47 4.28 4.28 0 001.32 5.7 4.24 4.24 0 01-1.94-.54v.05c0 2.06 1.46 3.78 3.4 4.17-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.72 2.14 2.97 4.02 3a8.58 8.58 0 01-5.3 1.83c-.34 0-.68-.02-1.01-.06A12.1 12.1 0 006.56 21c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.72 8.72 0 0022.46 6z"/></svg>
                      </a>
                      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/view-exam/${exam.slug}`} target="_blank" style={iconBtn("#0077B5")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M4.98 3.5C4.98 5 3.88 6 2.49 6S0 5 0 3.5 1.1 1 2.49 1 4.98 2 4.98 3.5zM.24 8.98h4.5V24H.24V8.98zM8.98 8.98h4.31v2.05h.06c.6-1.14 2.07-2.34 4.27-2.34 4.56 0 5.4 3 5.4 6.89V24h-4.5v-7.53c0-1.8-.03-4.12-2.51-4.12-2.51 0-2.89 1.96-2.89 3.98V24h-4.5V8.98z"/></svg>
                      </a>
                      <div onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/view-exam/${exam.slug}`); alert("Copied!"); }} style={iconBtn("#6b7280")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M16 1H4C2.9 1 2 1.9 2 3v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                      </div>
                    </div>
                    <button onClick={() => setShowShare(false)} style={{ marginTop: "20px", background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Urgent warning */}
            {isUrgent && (
              <div style={{
                background: "#fff8e1", border: `1.5px solid ${C.gold}`,
                borderRadius: 9, padding: "10px 14px",
                display: "flex", alignItems: "flex-start",
                gap: 8, fontSize: 13, color: "#b45309", marginTop: 14,
              }}>
                <span style={{ flexShrink: 0 }}>⏰</span>
                <div>
                  <strong>Hurry!</strong> Last date to apply is {fmt(exam.applicationEndDate)}&nbsp;—&nbsp;
                  <span style={{ color: C.accent, fontWeight: 700 }}>only {appEndDays} day{appEndDays !== 1 ? "s" : ""} remaining</span>
                </div>
              </div>
            )}
          </Card>

          {/* ── EXAM DETAILS GRID ── */}
          <Card style={{ marginBottom: 14 }}>
            <SectionTitle text="Exam Details" />
            <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: isMobile ? 16 : 20 }}>
              {[
                ["Exam Type",        <Pill bg="#e8f4fd" color={C.primary}>{exam.examType}</Pill>],
                ["Category",         <Pill bg="#fff0f0" color={C.accent}>{exam.category}</Pill>],
                ["Exam Mode",        <Pill bg="#dcfce7" color="#15803d">{exam.examMode || "N/A"}</Pill>],
                ["Location",         <div style={{ fontSize: 13.5, fontWeight: 500 }}>📍 {exam.location || "All India"}</div>],
                ["Application Fee",  <div style={{ fontSize: 13.5, fontWeight: 500 }}>💰 {exam.applicationFee || "N/A"}</div>],
                ["Age Limit",        <div style={{ fontSize: 13.5, fontWeight: 500 }}>🎂 {exam.ageLimit || "N/A"}</div>],
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <SectionLabel>{lbl}</SectionLabel>
                  {val}
                </div>
              ))}
            </div>

            <Divider />

            {/* Important dates inline grid */}
            <SectionTitle text="Important Dates" />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 14 : 20 }}>
              {[
                ["📝", "Application Start", exam.applicationStartDate],
                ["⏰", "Application End",   exam.applicationEndDate],
                ["📖", "Exam Date",         exam.examDate],
                ["📊", "Result Date",       exam.resultDate],
              ].map(([icon, lbl, date]) => (
                <div key={lbl} style={{ background: C.light, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 18, marginBottom: 5 }}>{icon}</div>
                  <SectionLabel>{lbl}</SectionLabel>
                  {date
                    ? <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{fmt(date)}</div>
                    : <div style={{ fontSize: 12.5, color: C.muted }}>To be announced</div>
                  }
                </div>
              ))}
            </div>
          </Card>

          {/* ── DESCRIPTION & OVERVIEW ── */}
          <Card style={{ marginBottom: 14, overflow: "hidden", minWidth: 0 }}>
            <SectionTitle text="About the Exam" />

            {exam.description && (
              <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.8, marginBottom: 18, wordBreak: "break-word", overflowWrap: "anywhere" }}>
                {exam.description}
              </p>
            )}

            {exam.overview && exam.overview !== exam.description && (
              <>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Overview</div>
                <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.8, marginBottom: 18, wordBreak: "break-word", overflowWrap: "anywhere" }}>
                  {exam.overview}
                </p>
              </>
            )}

            {/* Eligibility */}
            {exam.eligibility && (
              <>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10, marginTop: 4 }}>
                  Eligibility Criteria
                </div>
                <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.8, marginBottom: 18, wordBreak: "break-word", overflowWrap: "anywhere" }}>
                  {exam.eligibility}
                </p>
              </>
            )}

            {/* Qualifications */}
            {Array.isArray(exam.qualification) && exam.qualification.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>
                  Required Qualifications
                </div>
                <ul>
                  {exam.qualification.map((q, i) => (
                    <li key={i} style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Application fee detail */}
            {exam.applicationFee && (
              <div style={{
                background: "#f0fff4", border: "1.5px solid #86efac",
                borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center",
              }}>
                <span style={{ fontSize: 22 }}>💰</span>
                <div>
                  <SectionLabel>APPLICATION FEE</SectionLabel>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{exam.applicationFee}</div>
                </div>
              </div>
            )}
          </Card>

          {/* ── HOW TO APPLY ── */}
          <Card style={{ marginBottom: 14, background: "linear-gradient(135deg,#f0f7ff,#e8f4fd)", borderColor: "#bdd6f0" }}>
            <SectionTitle text="How to Apply" />
            <p style={{ fontSize: 13.5, color: C.muted, marginBottom: 14 }}>
              Click the button below to visit the official {exam.organization} portal and complete your application. Keep your documents ready before proceeding.
            </p>
            <div style={{
              background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 9,
              padding: "12px 16px",
              display: "flex", flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between", gap: 12,
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <SectionLabel>OFFICIAL APPLY LINK</SectionLabel>
                <div style={{ fontSize: 13, color: C.primary, wordBreak: "break-all", marginTop: 3 }}>
                  {exam.applyUrl || exam.officialWebsite || "Visit official website"}
                </div>
              </div>
              <a
                href={exam.applyUrl || exam.officialWebsite}
                target="_blank" rel="noreferrer"
                className="btn-apply"
                style={{ flexShrink: 0 }}
              >
                Apply Now →
              </a>
            </div>

            {exam.officialWebsite && exam.applyUrl && exam.officialWebsite !== exam.applyUrl && (
              <div style={{ marginTop: 10 }}>
                <a
                  href={exam.officialWebsite} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12.5, color: C.primary, fontWeight: 600 }}
                >
                  🌐 Visit Official Website →
                </a>
              </div>
            )}

            <div style={{ marginTop: 12, fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
              ⚠️ CodeTechniques does not charge any fee for applying. Always apply through official channels only.
            </div>
          </Card>

          {/* Sidebar below content on mobile/tablet */}
          {!showSidebar && (
            <div style={{ marginTop: 8 }}>
              <Sidebar exam={exam} />
            </div>
          )}
        </div>

        {/* ═══════════════ RIGHT SIDEBAR ═══════════════ */}
        {showSidebar && (
          <div style={{ width: w >= 1280 ? 300 : 260, flexShrink: 0 }}>
            <Sidebar exam={exam} />
          </div>
        )}
      </div>

      {/* BOTTOM AD STRIP */}
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
          }}>📚</div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <strong style={{ fontSize: isMobile ? 12.5 : 13.5, display: "block" }}>
              Ace Your Exam — Free Mock Tests &amp; Study Material
            </strong>
            <span style={{ fontSize: isMobile ? 11 : 12, color: C.muted }}>
              Join 10 lakh+ students already preparing on CodeTechniques
            </span>
          </div>
          <a href="#" style={{ background: C.green, color: "#fff", padding: "8px 16px", borderRadius: 7, fontWeight: 600, fontSize: 12.5, whiteSpace: "nowrap" }}>
            Start Free →
          </a>
        </div>
      </div>

      <Footer bp={{ isMobile: false, isTablet: false, isDesktop: true }} gutter="16px" />
    </div>
  );
}