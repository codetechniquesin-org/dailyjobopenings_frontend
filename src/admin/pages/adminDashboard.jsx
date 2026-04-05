import { useEffect, useState } from "react";
import AdminNavbar from "../components/adminnavbar";
import useAutoLogout from "../services/useAutoLogout";

/* ── Design tokens ── */
const S = {
  cream:      "#EDE2D0",
  creamDark:  "#D4C4B0",
  creamDeep:  "#C2AF97",
  white:      "#FAF6F0",
  plum:       "#3D1A47",
  plumMid:    "#5A2B6E",
  plumLight:  "#7B4A8B",
  text:       "#1e0d26",
  muted:      "#6b5778",
  border:     "#D4C4B0",
};

const stats = [
  { label: "Total Jobs",  value: "48",  sub: "12 active",        dot: S.plum      },
  { label: "Applicants",  value: "312", sub: "28 new today",     dot: S.plumMid   },
  { label: "Open Roles",  value: "7",   sub: "3 closing soon",   dot: S.plumLight },
  { label: "Admins",      value: "5",   sub: "1 pending invite", dot: S.creamDeep },
];

const activity = [
  { icon: "📝", title: "Senior Frontend Developer",    sub: "Job posted by admin@company.com",       status: "Live",    pillBg: "rgba(61,26,71,0.09)",   pillColor: "#3D1A47",  rowBg: "rgba(61,26,71,0.05)",  time: "2m ago"  },
  { icon: "👤", title: "New applicant — Arjun Sharma", sub: "Applied for Backend Engineer",           status: "New",     pillBg: "rgba(90,43,110,0.09)",  pillColor: "#5A2B6E",  rowBg: "rgba(90,43,110,0.05)", time: "14m ago" },
  { icon: "🔒", title: "Product Manager",               sub: "Role closed by admin@hr.com",           status: "Closed",  pillBg: "rgba(194,175,151,0.3)", pillColor: "#7A5C3A",  rowBg: "rgba(194,175,151,0.15)", time: "1h ago"  },
  { icon: "⚠️", title: "Admin invite pending",          sub: "ops@company.com hasn't accepted yet",  status: "Pending", pillBg: "rgba(212,196,176,0.4)", pillColor: "#8B5E3C",  rowBg: "rgba(212,196,176,0.2)", time: "3h ago"  },
];

const cards = [
  { icon: "📋", title: "Manage Jobs",   desc: "View, update, and close existing job listings with precision.", role: null         },
  { icon: "✏️", title: "Create Job",    desc: "Post new openings and set application deadlines.",              role: null         },
  { icon: "👥", title: "Manage Admins", desc: "Add, update, or remove admin accounts and permissions.",        role: "super_admin" },
];

export default function Dashboard() {
  useAutoLogout();
  const admin = JSON.parse(localStorage.getItem("adminInfo"));
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    }));
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: S.cream, fontFamily: "'DM Sans', sans-serif", color: S.text, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; background: #EDE2D0 !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }

        .section-full  { width: 100%; }
        .section-inner { width: 100%; padding: 0 clamp(16px, 4vw, 40px); box-sizing: border-box; }

        /* ── Section label ── */
        .sec-label {
          font-size: 10px; font-weight: 600; letter-spacing: 2.5px;
          text-transform: uppercase; color: ${S.plumMid};
          margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
        }
        .sec-label::before {
          content: ''; width: 20px; height: 1.5px;
          background: ${S.plumLight}; display: inline-block;
        }

        /* ── Stats ── */
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: clamp(10px, 1.5vw, 14px); margin-bottom: clamp(28px, 3vw, 40px);
        }
        .stat-card {
          background: ${S.white}; border: 1px solid ${S.border}; border-radius: 14px;
          padding: clamp(16px, 2vw, 22px); position: relative; overflow: hidden;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), border-color .25s;
          cursor: default;
        }
        .stat-card:hover { transform: translateY(-3px); border-color: ${S.plumLight}; }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          border-radius: 14px 14px 0 0; opacity: 0; transition: opacity .3s;
        }
        .stat-card:hover::before { opacity: 1; }
        .sc0::before { background: ${S.plum}; }
        .sc1::before { background: ${S.plumMid}; }
        .sc2::before { background: ${S.plumLight}; }
        .sc3::before { background: ${S.creamDeep}; }
        .stat-label {
          font-size: 10px; font-weight: 600; letter-spacing: 1.8px;
          text-transform: uppercase; color: ${S.muted}; margin-bottom: 10px;
        }
        .stat-value {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(30px, 4vw, 42px);
          font-weight: 500; color: ${S.plum}; line-height: 1;
        }
        .stat-sub {
          font-size: 12px; color: ${S.muted}; margin-top: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; display: inline-block; }

        /* ── Action Cards ── */
        .cards-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: clamp(10px, 1.5vw, 14px); margin-bottom: clamp(28px, 3vw, 40px);
        }
        .act-card {
          background: ${S.white}; border: 1px solid ${S.border}; border-radius: 14px;
          padding: clamp(18px, 2vw, 24px); cursor: pointer; display: flex;
          flex-direction: column; gap: 12px; position: relative; overflow: hidden;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), border-color .3s, box-shadow .3s;
        }
        .act-card:hover {
          transform: translateY(-4px); border-color: ${S.plumLight};
          box-shadow: 0 12px 32px rgba(61,26,71,0.12);
        }
        .act-card::after {
          content: ''; position: absolute; bottom: 0; right: 0;
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(61,26,71,0.04); transform: translate(30px,30px);
          transition: transform .4s;
        }
        .act-card:hover::after { transform: translate(20px,20px); }
        .card-icon-wrap {
          width: 42px; height: 42px; border-radius: 10px;
          background: rgba(61,26,71,0.08); border: 1px solid rgba(61,26,71,0.12);
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }
        .card-title {
          font-family: 'Cormorant Garamond', serif; font-size: 18px;
          font-weight: 500; color: ${S.plum}; margin: 0;
        }
        .card-desc { font-size: 12.5px; color: ${S.muted}; line-height: 1.6; margin-top: 4px; }
        .card-arrow {
          margin-top: auto; font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
          text-transform: uppercase; color: ${S.plumLight};
          display: flex; align-items: center; gap: 6px; transition: gap .25s;
        }
        .act-card:hover .card-arrow { gap: 10px; }
        .arrow-line { width: 20px; height: 1.5px; background: ${S.plumLight}; transition: width .25s; display: inline-block; }
        .act-card:hover .arrow-line { width: 28px; }

        /* ── Activity Panel ── */
        .panel {
          background: ${S.white}; border: 1px solid ${S.border};
          border-radius: 14px; overflow: hidden;
        }
        .panel-hdr {
          padding: 18px clamp(16px,2vw,24px); border-bottom: 1px solid ${S.border};
          display: flex; align-items: center; justify-content: space-between;
        }
        .panel-hdr-title {
          font-family: 'Cormorant Garamond', serif; font-size: 17px;
          font-weight: 500; color: ${S.plum};
        }
        .panel-hdr-link {
          font-size: 11px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: ${S.plumLight}; cursor: pointer; text-decoration: none;
        }
        .act-row {
          display: flex; align-items: center; gap: clamp(10px,1.5vw,18px);
          padding: 14px clamp(16px,2vw,24px); border-bottom: 1px solid rgba(212,196,176,0.5);
          transition: background .2s; cursor: default;
        }
        .act-row:last-child { border-bottom: none; }
        .act-row:hover { background: rgba(237,226,208,0.5); }
        .act-icon {
          width: 36px; height: 36px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }
        .act-info { flex: 1; min-width: 0; }
        .act-info strong {
          font-size: 13.5px; font-weight: 500; display: block;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${S.text};
        }
        .act-info span { font-size: 12px; color: ${S.muted}; }
        .pill {
          font-size: 10px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase;
          padding: 3px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0;
        }
        .act-time { font-size: 11px; color: ${S.muted}; white-space: nowrap; flex-shrink: 0; font-variant-numeric: tabular-nums; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .cards-grid { grid-template-columns: 1fr; }
          .act-time   { display: none; }
        }
        @media (max-width: 400px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <div className="section-full">
        <AdminNavbar />
      </div>

      {/* ── Hero Banner ── */}
      <div
        className="section-full"
        style={{
          background: S.plum,
          color: S.cream,
          padding: "clamp(28px,4vw,44px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -60, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, right: 120, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.025)", pointerEvents: "none" }} />

        <div className="section-inner">
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: S.creamDeep, marginBottom: 10 }}>
            Admin Portal
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 400, color: S.cream, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Welcome back,{" "}
            <em style={{ fontStyle: "italic", fontWeight: 300, color: S.creamDeep }}>
              {admin?.email ?? "super_admin"}
            </em>
          </h1>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(237,226,208,0.55)", letterSpacing: "0.5px" }}>{date}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: S.plum, background: S.creamDeep, padding: "3px 12px", borderRadius: 20 }}>
              {admin?.role ?? "admin"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="section-full">
        <div className="section-inner" style={{ paddingTop: "clamp(24px,3vw,36px)", paddingBottom: 60 }}>

          {/* Stats */}
          <div className="sec-label">Overview</div>
          <div className="stats-grid">
            {stats.map((st, i) => (
              <div key={st.label} className={`stat-card sc${i}`}>
                <div className="stat-label">{st.label}</div>
                <div className="stat-value">{st.value}</div>
                <div className="stat-sub">
                  <span className="dot" style={{ background: st.dot }} />
                  {st.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div className="sec-label">Quick Actions</div>
          <div className="cards-grid">
            {cards
              .filter((c) => !c.role || admin?.role === c.role)
              .map((c) => (
                <div key={c.title} className="act-card">
                  <div className="card-icon-wrap">{c.icon}</div>
                  <div>
                    <h3 className="card-title">{c.title}</h3>
                    <p className="card-desc">{c.desc}</p>
                  </div>
                  <div className="card-arrow">
                    <span className="arrow-line" />
                    Open
                  </div>
                </div>
              ))}
          </div>

          {/* Activity */}
          <div className="sec-label">Recent Activity</div>
          <div className="panel">
            <div className="panel-hdr">
              <span className="panel-hdr-title">Latest Updates</span>
              <a href="#" className="panel-hdr-link">View all →</a>
            </div>
            {activity.map((a) => (
              <div key={a.title} className="act-row">
                <div className="act-icon" style={{ background: a.rowBg }}>{a.icon}</div>
                <div className="act-info">
                  <strong>{a.title}</strong>
                  <span>{a.sub}</span>
                </div>
                <span className="pill" style={{ background: a.pillBg, color: a.pillColor }}>{a.status}</span>
                <span className="act-time">{a.time}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}