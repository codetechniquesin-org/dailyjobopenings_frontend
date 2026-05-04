import { useEffect, useState, useRef } from "react";
import AdminNavbar from "../components/AdminNavbar";
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
  accent:     "#B85C8A",
  accentSoft: "#E8B4D0",
  green:      "#2D7A4F",
  greenSoft:  "#A8D5B8",
  orange:     "#C4722A",
  orangeSoft: "#F0C9A0",
};

/* ── Static Data ── */
const stats = [
  { label: "Total Jobs",    value: "48",  sub: "12 active",         dot: S.plum,      trend: "+8%",  up: true  },
  { label: "Applicants",    value: "312", sub: "28 new today",      dot: S.plumMid,   trend: "+23%", up: true  },
  { label: "Exams Held",    value: "19",  sub: "4 this month",      dot: S.plumLight, trend: "+12%", up: true  },
  { label: "Walk-ins",      value: "86",  sub: "11 scheduled",      dot: S.creamDeep, trend: "-3%",  up: false },
  { label: "Apply Clicks",  value: "1.4k",sub: "avg 29/job",        dot: S.accent,    trend: "+41%", up: true  },
  { label: "Avg Session",   value: "4:32",sub: "min per visit",     dot: S.green,     trend: "+6%",  up: true  },
  { label: "Avg Watch Time",value: "2:18",sub: "video engagement",  dot: S.orange,    trend: "+18%", up: true  },
  { label: "Active Users",  value: "934", sub: "last 30 days",      dot: S.plumMid,   trend: "+15%", up: true  },
];

const monthlyJobs = [
  { month: "Oct", jobs: 3,  applicants: 42  },
  { month: "Nov", jobs: 5,  applicants: 61  },
  { month: "Dec", jobs: 2,  applicants: 29  },
  { month: "Jan", jobs: 7,  applicants: 88  },
  { month: "Feb", jobs: 9,  applicants: 103 },
  { month: "Mar", jobs: 6,  applicants: 79  },
  { month: "Apr", jobs: 11, applicants: 134 },
  { month: "May", jobs: 5,  applicants: 62  },
];

const engagementData = [
  { day: "Mon", clicks: 210, sessions: 88,  watchTime: 160 },
  { day: "Tue", clicks: 340, sessions: 130, watchTime: 210 },
  { day: "Wed", clicks: 290, sessions: 107, watchTime: 195 },
  { day: "Thu", clicks: 410, sessions: 155, watchTime: 270 },
  { day: "Fri", clicks: 380, sessions: 142, watchTime: 248 },
  { day: "Sat", clicks: 150, sessions: 55,  watchTime: 98  },
  { day: "Sun", clicks: 120, sessions: 41,  watchTime: 77  },
];

const departmentPie = [
  { label: "Engineering",  value: 38, color: S.plum      },
  { label: "Marketing",    value: 22, color: S.plumMid   },
  { label: "Design",       value: 16, color: S.plumLight },
  { label: "Operations",   value: 14, color: S.accent    },
  { label: "HR / Finance", value: 10, color: S.creamDeep },
];

const funnelData = [
  { stage: "Job Views",     count: 4200, pct: 100 },
  { stage: "Apply Clicks",  count: 1400, pct: 33  },
  { stage: "Applications",  count: 312,  pct: 7.4 },
  { stage: "Shortlisted",   count: 94,   pct: 2.2 },
  { stage: "Interviews",    count: 41,   pct: 0.98},
  { stage: "Offers Made",   count: 12,   pct: 0.29},
];

const topJobs = [
  { title: "Senior Frontend Dev",     dept: "Engineering", apps: 67, status: "Live",    clicks: 310 },
  { title: "Product Manager",          dept: "Product",     apps: 54, status: "Live",    clicks: 280 },
  { title: "Backend Engineer",         dept: "Engineering", apps: 48, status: "Live",    clicks: 241 },
  { title: "UX Designer",              dept: "Design",      apps: 39, status: "Closing", clicks: 198 },
  { title: "Data Analyst",             dept: "Analytics",   apps: 33, status: "Live",    clicks: 162 },
];

const examData = [
  { name: "Backend Aptitude",    candidates: 88, passed: 61, passRate: 69 },
  { name: "Frontend Skill Test", candidates: 74, passed: 52, passRate: 70 },
  { name: "PM Case Study",       candidates: 42, passed: 28, passRate: 67 },
  { name: "HR Assessment",       candidates: 31, passed: 25, passRate: 81 },
];

const walkinTrend = [18, 12, 22, 15, 19, 9, 11, 24, 17, 14, 21, 16];
const walkinLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const adminProfiles = [
  {
    email: "super@company.com", role: "super_admin", avatar: "SA",
    avgLogin: "9:14 AM", totalJobsPosted: 22, lastActive: "2m ago",
    recentJobs: ["Senior Frontend Dev", "Data Analyst", "DevOps Engineer"],
    loginDays: [1,1,1,0,1,1,0,1,1,1,0,1,1,1],
  },
  {
    email: "admin@hr.com", role: "admin", avatar: "AH",
    avgLogin: "9:52 AM", totalJobsPosted: 15, lastActive: "1h ago",
    recentJobs: ["HR Business Partner", "Talent Acquisition", "L&D Manager"],
    loginDays: [1,0,1,1,1,0,1,1,0,1,1,0,1,1],
  },
  {
    email: "admin@company.com", role: "admin", avatar: "AC",
    avgLogin: "10:21 AM", totalJobsPosted: 11, lastActive: "3h ago",
    recentJobs: ["Product Manager", "UX Designer", "Business Analyst"],
    loginDays: [0,1,1,1,0,1,1,0,1,1,1,1,0,1],
  },
];

const activity = [
  { icon: "📝", title: "Senior Frontend Developer",     sub: "Job posted by super@company.com",           status: "Live",      pillBg: "rgba(61,26,71,0.09)",   pillColor: "#3D1A47",  rowBg: "rgba(61,26,71,0.05)",   time: "2m ago"   },
  { icon: "👤", title: "New applicant — Arjun Sharma",  sub: "Applied for Backend Engineer",              status: "New",       pillBg: "rgba(90,43,110,0.09)",  pillColor: "#5A2B6E",  rowBg: "rgba(90,43,110,0.05)",  time: "14m ago"  },
  { icon: "📋", title: "Exam: Backend Aptitude",        sub: "88 candidates attempted • 61 passed",       status: "Completed", pillBg: "rgba(45,122,79,0.1)",   pillColor: "#2D7A4F",  rowBg: "rgba(45,122,79,0.05)",  time: "31m ago"  },
  { icon: "🚶", title: "Walk-in Drive — Operations",    sub: "24 candidates registered",                  status: "Scheduled", pillBg: "rgba(196,114,42,0.1)",  pillColor: "#C4722A",  rowBg: "rgba(196,114,42,0.05)", time: "1h ago"   },
  { icon: "🔒", title: "Product Manager",               sub: "Role closed by admin@hr.com",               status: "Closed",    pillBg: "rgba(194,175,151,0.3)", pillColor: "#7A5C3A",  rowBg: "rgba(194,175,151,0.15)",time: "2h ago"   },
  { icon: "👁", title: "UX Designer — High Traffic",    sub: "198 apply-clicks this week (+34%)",         status: "Trending",  pillBg: "rgba(184,92,138,0.1)",  pillColor: "#B85C8A",  rowBg: "rgba(184,92,138,0.05)", time: "3h ago"   },
  { icon: "⚠️", title: "Admin invite pending",          sub: "ops@company.com hasn't accepted yet",       status: "Pending",   pillBg: "rgba(212,196,176,0.4)", pillColor: "#8B5E3C",  rowBg: "rgba(212,196,176,0.2)", time: "5h ago"   },
  { icon: "📊", title: "Monthly report generated",      sub: "April 2025 — 48 jobs, 312 applicants",      status: "Report",    pillBg: "rgba(61,26,71,0.09)",   pillColor: "#3D1A47",  rowBg: "rgba(61,26,71,0.04)",   time: "Yesterday"},
];

/* ── Chart Components ── */

function BarChart({ data, maxVal, barColor, label }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", borderRadius: "4px 4px 0 0",
            height: `${(d / maxVal) * 80}px`,
            background: barColor,
            transition: "height 0.6s cubic-bezier(.34,1.56,.64,1)",
            minHeight: 3,
          }} title={`${d}`} />
        </div>
      ))}
    </div>
  );
}

function GroupedBarChart({ data }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.jobs * 10, d.applicants)));
  return (
    <div style={{ width: "100%", height: 200, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160, padding: "0 4px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 3 }}>
            <div style={{
              flex: 1, borderRadius: "4px 4px 0 0",
              height: `${(d.jobs / 11) * 160}px`,
              background: `linear-gradient(180deg, ${S.plum} 0%, ${S.plumMid} 100%)`,
              minHeight: 4, transition: "height 0.7s cubic-bezier(.34,1.56,.64,1)",
            }} title={`Jobs: ${d.jobs}`} />
            <div style={{
              flex: 1, borderRadius: "4px 4px 0 0",
              height: `${(d.applicants / 134) * 160}px`,
              background: `linear-gradient(180deg, ${S.accentSoft} 0%, ${S.accent} 100%)`,
              minHeight: 4, transition: "height 0.7s cubic-bezier(.34,1.56,.64,1)",
            }} title={`Applicants: ${d.applicants}`} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, padding: "0 4px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: S.muted }}>{d.month}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: S.plum }} />
          <span style={{ fontSize: 11, color: S.muted }}>Jobs Posted</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: S.accent }} />
          <span style={{ fontSize: 11, color: S.muted }}>Applicants</span>
        </div>
      </div>
    </div>
  );
}

function LineChart({ data, keys, colors, labels }) {
  const maxVal = Math.max(...data.flatMap(d => keys.map(k => d[k])));
  const W = 520, H = 140, PAD = 20;
  const xStep = (W - PAD * 2) / (data.length - 1);

  const toPath = (key) =>
    data.map((d, i) => {
      const x = PAD + i * xStep;
      const y = H - PAD - ((d[key] / maxVal) * (H - PAD * 2));
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");

  const toArea = (key) => {
    const pts = data.map((d, i) => {
      const x = PAD + i * xStep;
      const y = H - PAD - ((d[key] / maxVal) * (H - PAD * 2));
      return `${x},${y}`;
    });
    return `M ${pts[0]} L ${pts.join(" L ")} L ${PAD + (data.length - 1) * xStep},${H - PAD} L ${PAD},${H - PAD} Z`;
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={PAD} y1={H - PAD - t * (H - PAD * 2)} x2={W - PAD} y2={H - PAD - t * (H - PAD * 2)}
            stroke={S.border} strokeWidth="0.8" strokeDasharray="4 4" />
        ))}
        {/* Areas */}
        {keys.map((k, ki) => (
          <path key={k} d={toArea(k)} fill={colors[ki]} opacity="0.12" />
        ))}
        {/* Lines */}
        {keys.map((k, ki) => (
          <path key={k} d={toPath(k)} fill="none" stroke={colors[ki]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {/* Points */}
        {keys.map((k, ki) =>
          data.map((d, i) => {
            const x = PAD + i * xStep;
            const y = H - PAD - ((d[k] / maxVal) * (H - PAD * 2));
            return <circle key={`${k}-${i}`} cx={x} cy={y} r="3" fill={colors[ki]} stroke={S.white} strokeWidth="1.5" />;
          })
        )}
        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={PAD + i * xStep} y={H - 4} textAnchor="middle" fontSize="9" fill={S.muted}>{d.day}</text>
        ))}
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        {keys.map((k, ki) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 2, borderRadius: 2, background: colors[ki] }} />
            <span style={{ fontSize: 11, color: S.muted }}>{labels[ki]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -90;
  const cx = 80, cy = 80, r = 64, ri = 38;

  const slices = data.map(d => {
    const angle = (d.value / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const toRad = a => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const ix1 = cx + ri * Math.cos(toRad(startAngle));
    const iy1 = cy + ri * Math.sin(toRad(startAngle));
    const ix2 = cx + ri * Math.cos(toRad(endAngle));
    const iy2 = cy + ri * Math.sin(toRad(endAngle));
    const large = angle > 180 ? 1 : 0;
    return { ...d, path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ri} ${ri} 0 ${large} 0 ${ix1} ${iy1} Z` };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg viewBox="0 0 160 160" style={{ width: 160, height: 160, flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke={S.white} strokeWidth="2">
            <title>{s.label}: {s.value}%</title>
          </path>
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="600" fill={S.plum} fontFamily="'Cormorant Garamond', serif">{total}%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill={S.muted}>By Dept</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: S.text, flex: 1 }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: S.plum }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelChart({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: S.text }}>{d.stage}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: S.plum }}>{d.count.toLocaleString()} <span style={{ fontSize: 10, color: S.muted, fontWeight: 400 }}>({d.pct}%)</span></span>
          </div>
          <div style={{ height: 10, background: "rgba(61,26,71,0.08)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${d.pct}%`,
              background: `linear-gradient(90deg, ${S.plum}, ${S.plumLight})`,
              borderRadius: 20, minWidth: 4,
              opacity: 0.7 + (i / data.length) * 0.3,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SparkLine({ values, color }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const W = 120, H = 36;
  const xStep = W / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * xStep;
    const y = H - ((v - min) / (max - min + 1)) * H;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={(values.length - 1) * xStep} cy={H - ((values[values.length - 1] - min) / (max - min + 1)) * H} r="3" fill={color} />
    </svg>
  );
}

function LoginHeatmap({ days }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {days.map((active, i) => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: 2,
          background: active ? S.plum : "rgba(61,26,71,0.12)",
        }} title={`Day ${i + 1}: ${active ? "Logged in" : "Absent"}`} />
      ))}
    </div>
  );
}

function ExamProgressBars({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.map((e, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: S.text }}>{e.name}</span>
            <span style={{ fontSize: 11, color: S.muted }}>{e.passed}/{e.candidates} passed</span>
          </div>
          <div style={{ height: 8, background: "rgba(61,26,71,0.08)", borderRadius: 20, overflow: "hidden", position: "relative" }}>
            <div style={{
              position: "absolute", height: "100%",
              width: `${(e.candidates / 88) * 100}%`,
              background: "rgba(61,26,71,0.12)", borderRadius: 20,
            }} />
            <div style={{
              position: "absolute", height: "100%",
              width: `${(e.passed / 88) * 100}%`,
              background: `linear-gradient(90deg, ${S.green}, ${S.greenSoft})`,
              borderRadius: 20,
            }} />
          </div>
          <div style={{ marginTop: 3, fontSize: 10, color: e.passRate >= 70 ? S.green : S.orange }}>
            {e.passRate}% pass rate
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  // Replace these with actual hooks in your app
  const admin = JSON.parse(localStorage.getItem("adminInfo"));
  const [date, setDate] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
    useAutoLogout();

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

        .sec-label {
          font-size: 10px; font-weight: 600; letter-spacing: 2.5px;
          text-transform: uppercase; color: ${S.plumMid};
          margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
        }
        .sec-label::before {
          content: ''; width: 20px; height: 1.5px;
          background: ${S.plumLight}; display: inline-block;
        }

        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: clamp(8px, 1.2vw, 12px); margin-bottom: clamp(28px, 3vw, 40px);
        }
        .stat-card {
          background: ${S.white}; border: 1px solid ${S.border}; border-radius: 14px;
          padding: clamp(14px, 1.6vw, 20px); position: relative; overflow: hidden;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), border-color .25s;
          cursor: default;
        }
        .stat-card:hover { transform: translateY(-3px); border-color: ${S.plumLight}; }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          border-radius: 14px 14px 0 0; opacity: 0; transition: opacity .3s;
        }
        .stat-card:hover::before { opacity: 1; background: var(--dot-color); }
        .stat-label { font-size: 10px; font-weight: 600; letter-spacing: 1.8px; text-transform: uppercase; color: ${S.muted}; margin-bottom: 8px; }
        .stat-value { font-family: 'Cormorant Garamond', serif; font-size: clamp(26px, 3.2vw, 36px); font-weight: 500; color: ${S.plum}; line-height: 1; }
        .stat-sub { font-size: 11px; color: ${S.muted}; margin-top: 6px; display: flex; align-items: center; gap: 6px; }
        .stat-trend { font-size: 10px; font-weight: 600; margin-top: 8px; }
        .dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; display: inline-block; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(10px, 1.5vw, 16px); margin-bottom: clamp(20px, 2.5vw, 32px); }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: clamp(10px, 1.5vw, 16px); margin-bottom: clamp(20px, 2.5vw, 32px); }
        .grid-3-1 { display: grid; grid-template-columns: 2fr 1fr; gap: clamp(10px, 1.5vw, 16px); margin-bottom: clamp(20px, 2.5vw, 32px); }
        .grid-1-2 { display: grid; grid-template-columns: 1fr 2fr; gap: clamp(10px, 1.5vw, 16px); margin-bottom: clamp(20px, 2.5vw, 32px); }

        .panel {
          background: ${S.white}; border: 1px solid ${S.border};
          border-radius: 14px; overflow: hidden;
        }
        .panel-hdr {
          padding: 16px clamp(16px,2vw,22px); border-bottom: 1px solid ${S.border};
          display: flex; align-items: center; justify-content: space-between;
        }
        .panel-hdr-title { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 500; color: ${S.plum}; }
        .panel-hdr-sub { font-size: 11px; color: ${S.muted}; margin-top: 2px; }
        .panel-body { padding: clamp(16px,2vw,22px); }

        .act-row {
          display: flex; align-items: center; gap: clamp(10px,1.5vw,16px);
          padding: 12px clamp(16px,2vw,22px); border-bottom: 1px solid rgba(212,196,176,0.5);
          transition: background .2s; cursor: default;
        }
        .act-row:last-child { border-bottom: none; }
        .act-row:hover { background: rgba(237,226,208,0.5); }
        .act-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .act-info { flex: 1; min-width: 0; }
        .act-info strong { font-size: 13px; font-weight: 500; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${S.text}; }
        .act-info span { font-size: 11.5px; color: ${S.muted}; }
        .pill { font-size: 10px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
        .act-time { font-size: 11px; color: ${S.muted}; white-space: nowrap; flex-shrink: 0; font-variant-numeric: tabular-nums; }

        .tab-bar { display: flex; gap: 4px; border-bottom: 1px solid ${S.border}; padding: 0 clamp(16px,4vw,40px); background: ${S.white}; position: sticky; top: 0; z-index: 10; }
        .tab-btn {
          padding: 12px 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.8px;
          text-transform: uppercase; cursor: pointer; border: none; background: none;
          color: ${S.muted}; border-bottom: 2px solid transparent; transition: color .2s, border-color .2s;
          font-family: 'DM Sans', sans-serif;
        }
        .tab-btn:hover { color: ${S.plum}; }
        .tab-btn.active { color: ${S.plum}; border-bottom-color: ${S.plum}; }

        .tbl { width: 100%; border-collapse: collapse; }
        .tbl th { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${S.muted}; padding: 0 0 12px; text-align: left; border-bottom: 1px solid ${S.border}; }
        .tbl td { font-size: 13px; color: ${S.text}; padding: 11px 0; border-bottom: 1px solid rgba(212,196,176,0.4); vertical-align: middle; }
        .tbl tr:last-child td { border-bottom: none; }
        .tbl tr:hover td { background: rgba(237,226,208,0.3); }

        .admin-card {
          background: ${S.white}; border: 1px solid ${S.border}; border-radius: 14px;
          padding: clamp(16px,2vw,22px); transition: transform .3s cubic-bezier(.34,1.56,.64,1), border-color .25s;
        }
        .admin-card:hover { transform: translateY(-2px); border-color: ${S.plumLight}; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
          .grid-3 { grid-template-columns: 1fr 1fr; }
          .grid-3-1 { grid-template-columns: 1fr; }
          .grid-1-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .grid-2 { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .tab-btn { padding: 12px 12px; font-size: 11px; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .act-time { display: none; }
        }
      `}</style>

      {/* ── Navbar placeholder ── */}
      {/* <AdminNavbar /> */}
      <div className="section-full">
        <AdminNavbar />
      </div>

      {/* ── Hero Banner ── */}
      <div className="section-full" style={{ background: S.plum, color: S.cream, padding: "clamp(28px,4vw,44px) 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, right: 120, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.025)", pointerEvents: "none" }} />
        <div className="section-inner">
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: S.creamDeep, marginBottom: 10 }}>Admin Portal</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 400, color: S.cream, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Welcome back,{" "}
            <em style={{ fontStyle: "italic", fontWeight: 300, color: S.creamDeep }}>
              {admin?.email ?? "super_admin"}
            </em>
          </h1>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(237,226,208,0.55)", letterSpacing: "0.5px" }}>{date}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: S.plum, background: S.creamDeep, padding: "3px 12px", borderRadius: 20 }}>{admin?.role ?? "admin"}</span>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="tab-bar">
        {["overview", "analytics", "admin activity"].map(t => (
          <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="section-full">
        <div className="section-inner" style={{ paddingTop: "clamp(24px,3vw,36px)", paddingBottom: 60 }}>

          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === "overview" && <>

            {/* Stats Row 1 */}
            <div className="sec-label">Key Metrics</div>
            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              {stats.slice(0, 4).map((st, i) => (
                <div key={st.label} className="stat-card" style={{ "--dot-color": st.dot }}>
                  <div className="stat-label">{st.label}</div>
                  <div className="stat-value">{st.value}</div>
                  <div className="stat-sub"><span className="dot" style={{ background: st.dot }} />{st.sub}</div>
                  <div className="stat-trend" style={{ color: st.up ? S.green : S.orange }}>
                    {st.up ? "↑" : "↓"} {st.trend} vs last month
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Row 2 */}
            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: -24 }}>
              {stats.slice(4, 8).map((st, i) => (
                <div key={st.label} className="stat-card" style={{ "--dot-color": st.dot }}>
                  <div className="stat-label">{st.label}</div>
                  <div className="stat-value">{st.value}</div>
                  <div className="stat-sub"><span className="dot" style={{ background: st.dot }} />{st.sub}</div>
                  <div className="stat-trend" style={{ color: st.up ? S.green : S.orange }}>
                    {st.up ? "↑" : "↓"} {st.trend} vs last month
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Jobs + Dept Pie */}
            <div className="sec-label">Jobs & Applications</div>
            <div className="grid-3-1">
              <div className="panel">
                <div className="panel-hdr">
                  <div>
                    <div className="panel-hdr-title">Monthly Job Postings & Applicants</div>
                    <div className="panel-hdr-sub">Oct 2024 – May 2025</div>
                  </div>
                </div>
                <div className="panel-body">
                  <GroupedBarChart data={monthlyJobs} />
                </div>
              </div>
              <div className="panel">
                <div className="panel-hdr">
                  <div className="panel-hdr-title">Jobs by Department</div>
                </div>
                <div className="panel-body">
                  <PieChart data={departmentPie} />
                </div>
              </div>
            </div>

            {/* Engagement Line Chart */}
            <div className="sec-label">User Engagement</div>
            <div className="panel" style={{ marginBottom: "clamp(20px,2.5vw,32px)" }}>
              <div className="panel-hdr">
                <div>
                  <div className="panel-hdr-title">Weekly Engagement — Apply Clicks, Sessions & Watch Time</div>
                  <div className="panel-hdr-sub">Current week</div>
                </div>
              </div>
              <div className="panel-body">
                <LineChart
                  data={engagementData}
                  keys={["clicks", "sessions", "watchTime"]}
                  colors={[S.plum, S.accent, S.green]}
                  labels={["Apply Clicks", "Sessions", "Watch Time (min)"]}
                />
              </div>
            </div>

            {/* Funnel + Exam */}
            <div className="grid-2">
              <div className="panel">
                <div className="panel-hdr">
                  <div>
                    <div className="panel-hdr-title">Hiring Funnel</div>
                    <div className="panel-hdr-sub">Views → Offers</div>
                  </div>
                </div>
                <div className="panel-body">
                  <FunnelChart data={funnelData} />
                </div>
              </div>
              <div className="panel">
                <div className="panel-hdr">
                  <div>
                    <div className="panel-hdr-title">Exam Results</div>
                    <div className="panel-hdr-sub">Candidates vs Pass rate</div>
                  </div>
                </div>
                <div className="panel-body">
                  <ExamProgressBars data={examData} />
                </div>
              </div>
            </div>

            {/* Walk-in Sparkline */}
            <div className="sec-label">Walk-in Trend</div>
            <div className="panel" style={{ marginBottom: "clamp(20px,2.5vw,32px)" }}>
              <div className="panel-hdr">
                <div className="panel-hdr-title">Monthly Walk-in Registrations</div>
              </div>
              <div className="panel-body">
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    {/* Full bar chart for walkins */}
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
                      {walkinTrend.map((v, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{
                            width: "100%", borderRadius: "4px 4px 0 0",
                            height: `${(v / 24) * 100}px`,
                            background: v === Math.max(...walkinTrend)
                              ? `linear-gradient(180deg, ${S.plum}, ${S.plumMid})`
                              : `linear-gradient(180deg, ${S.creamDeep}, ${S.creamDark})`,
                            minHeight: 4, transition: "height 0.6s cubic-bezier(.34,1.56,.64,1)",
                          }} title={`${walkinLabels[i]}: ${v}`} />
                          <span style={{ fontSize: 9, color: S.muted }}>{walkinLabels[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 120, padding: "0 0 20px 16px" }}>
                    <div>
                      <div style={{ fontSize: 10, color: S.muted, letterSpacing: 1, textTransform: "uppercase" }}>Total YTD</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: S.plum, fontWeight: 500 }}>
                        {walkinTrend.reduce((a, b) => a + b, 0)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: S.muted, letterSpacing: 1, textTransform: "uppercase" }}>Peak Month</div>
                      <div style={{ fontSize: 14, color: S.plum, fontWeight: 500 }}>
                        {walkinLabels[walkinTrend.indexOf(Math.max(...walkinTrend))]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Jobs Table */}
            <div className="sec-label">Top Jobs by Engagement</div>
            <div className="panel" style={{ marginBottom: "clamp(20px,2.5vw,32px)" }}>
              <div className="panel-body" style={{ padding: 0 }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="tbl" style={{ padding: "0 22px" }}>
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: 22 }}>Job Title</th>
                        <th>Department</th>
                        <th>Apply Clicks</th>
                        <th>Applications</th>
                        <th>Conversion</th>
                        <th style={{ paddingRight: 22 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topJobs.map((j, i) => (
                        <tr key={i}>
                          <td style={{ paddingLeft: 22, fontWeight: 500 }}>{j.title}</td>
                          <td style={{ color: S.muted }}>{j.dept}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ height: 5, width: `${(j.clicks / 310) * 80}px`, background: S.plumLight, borderRadius: 20, minWidth: 4 }} />
                              {j.clicks}
                            </div>
                          </td>
                          <td>{j.apps}</td>
                          <td style={{ color: S.green, fontWeight: 600 }}>
                            {((j.apps / j.clicks) * 100).toFixed(1)}%
                          </td>
                          <td style={{ paddingRight: 22 }}>
                            <span style={{
                              fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase",
                              padding: "3px 10px", borderRadius: 20,
                              background: j.status === "Live" ? "rgba(45,122,79,0.1)" : "rgba(196,114,42,0.1)",
                              color: j.status === "Live" ? S.green : S.orange,
                            }}>{j.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="sec-label">Recent Activity</div>
            <div className="panel">
              <div className="panel-hdr">
                <span className="panel-hdr-title">Latest Updates</span>
                <a href="#" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: S.plumLight, textDecoration: "none" }}>View all →</a>
              </div>
              {activity.map((a, i) => (
                <div key={i} className="act-row" style={{ background: undefined }}>
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
          </>}

          {/* ===== ANALYTICS TAB ===== */}
          {activeTab === "analytics" && <>

            <div className="sec-label">Deep Dive Analytics</div>

            {/* Session time + engagement combo */}
            <div className="grid-3" style={{ marginBottom: "clamp(20px,2.5vw,32px)" }}>
              {[
                { label: "Avg Session Time",  value: "4:32", delta: "+6%", icon: "⏱", color: S.plum,   sub: "min : sec" },
                { label: "Avg Watch Time",    value: "2:18", delta: "+18%",icon: "🎥", color: S.accent, sub: "video per session" },
                { label: "Apply Click Rate",  value: "33%",  delta: "+41%",icon: "🖱", color: S.green,  sub: "views → clicks" },
              ].map((m, i) => (
                <div key={i} className="panel">
                  <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(61,26,71,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: S.muted }}>{m.label}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: S.plum, lineHeight: 1.1 }}>{m.value}</div>
                      <div style={{ fontSize: 11, color: S.muted }}>{m.sub} &nbsp;<span style={{ color: S.green, fontWeight: 600 }}>↑ {m.delta}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Apply clicks per day bar chart */}
            <div className="grid-2">
              <div className="panel">
                <div className="panel-hdr">
                  <div>
                    <div className="panel-hdr-title">Apply Clicks — Daily Breakdown</div>
                    <div className="panel-hdr-sub">Current week</div>
                  </div>
                </div>
                <div className="panel-body">
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
                    {engagementData.map((d, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10, color: S.muted }}>{d.clicks}</span>
                        <div style={{
                          width: "100%", borderRadius: "5px 5px 0 0",
                          height: `${(d.clicks / 410) * 90}px`,
                          background: d.clicks === Math.max(...engagementData.map(x => x.clicks))
                            ? `linear-gradient(180deg, ${S.plum}, ${S.plumMid})`
                            : `linear-gradient(180deg, ${S.plumLight}88, ${S.plumLight}44)`,
                          minHeight: 4,
                        }} />
                        <span style={{ fontSize: 10, color: S.muted }}>{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-hdr">
                  <div>
                    <div className="panel-hdr-title">Session Duration Distribution</div>
                    <div className="panel-hdr-sub">By time bracket</div>
                  </div>
                </div>
                <div className="panel-body">
                  {[
                    { bracket: "< 1 min",    pct: 14, count: 131 },
                    { bracket: "1–3 min",    pct: 28, count: 262 },
                    { bracket: "3–6 min",    pct: 35, count: 327 },
                    { bracket: "6–10 min",   pct: 15, count: 140 },
                    { bracket: "> 10 min",   pct: 8,  count: 75  },
                  ].map((b, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: S.text }}>{b.bracket}</span>
                        <span style={{ fontSize: 11, color: S.muted }}>{b.count} users ({b.pct}%)</span>
                      </div>
                      <div style={{ height: 8, background: "rgba(61,26,71,0.08)", borderRadius: 20, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${b.pct}%`,
                          background: `linear-gradient(90deg, ${S.plumMid}, ${S.plumLight})`,
                          borderRadius: 20,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversion over time descending */}
            <div className="panel" style={{ marginBottom: "clamp(20px,2.5vw,32px)" }}>
              <div className="panel-hdr">
                <div>
                  <div className="panel-hdr-title">Funnel Conversion — Detailed Breakdown</div>
                  <div className="panel-hdr-sub">Drop-off at each stage (descending)</div>
                </div>
              </div>
              <div className="panel-body">
                <div style={{ display: "flex", gap: 0 }}>
                  {funnelData.map((d, i) => (
                    <div key={i} style={{ flex: d.pct + 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: "100%", height: 48,
                        background: `linear-gradient(135deg, ${S.plum}${Math.round(255 * (1 - i * 0.14)).toString(16).padStart(2,"0")}, ${S.plumLight}${Math.round(255 * (1 - i * 0.14)).toString(16).padStart(2,"0")})`,
                        borderRadius: i === 0 ? "8px 0 0 8px" : i === funnelData.length - 1 ? "0 8px 8px 0" : 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: i < 3 ? S.white : S.plum }}>{d.count.toLocaleString()}</span>
                      </div>
                      <span style={{ fontSize: 10, color: S.muted, textAlign: "center", lineHeight: 1.3 }}>{d.stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Exam analytics deep dive */}
            <div className="sec-label">Exam Analytics</div>
            <div className="grid-2">
              <div className="panel">
                <div className="panel-hdr"><div className="panel-hdr-title">Candidate vs Pass Count</div></div>
                <div className="panel-body">
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 140, paddingTop: 10 }}>
                    {examData.map((e, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 4 }}>
                        <div style={{
                          flex: 1, borderRadius: "5px 5px 0 0",
                          height: `${(e.candidates / 88) * 120}px`,
                          background: `linear-gradient(180deg, ${S.creamDeep}, ${S.creamDark})`,
                          minHeight: 4,
                        }} title={`Candidates: ${e.candidates}`} />
                        <div style={{
                          flex: 1, borderRadius: "5px 5px 0 0",
                          height: `${(e.passed / 88) * 120}px`,
                          background: `linear-gradient(180deg, ${S.green}, ${S.greenSoft})`,
                          minHeight: 4,
                        }} title={`Passed: ${e.passed}`} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
                    {examData.map((e, i) => (
                      <div key={i} style={{ flex: 1, fontSize: 10, color: S.muted, textAlign: "center" }}>{e.name.split(" ").slice(0, 1).join(" ")}</div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: S.creamDeep }} />
                      <span style={{ fontSize: 11, color: S.muted }}>Candidates</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: S.green }} />
                      <span style={{ fontSize: 11, color: S.muted }}>Passed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-hdr"><div className="panel-hdr-title">Pass Rate by Exam</div></div>
                <div className="panel-body">
                  {examData.map((e, i) => (
                    <div key={i} style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: S.text }}>{e.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: e.passRate >= 75 ? S.green : e.passRate >= 65 ? S.orange : "#C42A2A" }}>{e.passRate}%</span>
                      </div>
                      <div style={{ height: 10, background: "rgba(61,26,71,0.08)", borderRadius: 20, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${e.passRate}%`,
                          background: e.passRate >= 75
                            ? `linear-gradient(90deg, ${S.green}, ${S.greenSoft})`
                            : `linear-gradient(90deg, ${S.orange}, ${S.orangeSoft})`,
                          borderRadius: 20,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </>}

          {/* ===== ADMIN ACTIVITY TAB ===== */}
          {activeTab === "admin activity" && <>

            <div className="sec-label">Admin Performance Overview</div>

            {/* Summary row */}
            <div className="grid-3" style={{ marginBottom: "clamp(20px,2.5vw,32px)" }}>
              {[
                { label: "Total Admins",       value: "5",     icon: "👥", sub: "1 pending invite"  },
                { label: "Jobs Posted (Total)", value: "48",    icon: "📋", sub: "across all admins"  },
                { label: "Avg Login Time",      value: "9:49",  icon: "⏰", sub: "AM team average"    },
              ].map((m, i) => (
                <div key={i} className="panel">
                  <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(61,26,71,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: S.muted }}>{m.label}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: S.plum, lineHeight: 1.1 }}>{m.value}</div>
                      <div style={{ fontSize: 11, color: S.muted }}>{m.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Cards */}
            <div className="sec-label">Per Admin Analytics</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "clamp(20px,2.5vw,32px)" }}>
              {adminProfiles.map((a, i) => (
                <div key={i} className="admin-card">
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    {/* Avatar + Info */}
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", minWidth: 220 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12, background: S.plum,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: S.cream, flexShrink: 0,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>{a.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: S.text }}>{a.email}</div>
                        <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase",
                            padding: "2px 8px", borderRadius: 20,
                            background: a.role === "super_admin" ? "rgba(61,26,71,0.12)" : "rgba(90,43,110,0.1)",
                            color: a.role === "super_admin" ? S.plum : S.plumMid,
                          }}>{a.role}</span>
                        </div>
                        <div style={{ fontSize: 11, color: S.muted, marginTop: 4 }}>Last active: <strong style={{ color: S.text }}>{a.lastActive}</strong></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 32, alignItems: "center", flex: 1, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 10, color: S.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Avg Login</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: S.plum, fontWeight: 500 }}>{a.avgLogin}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: S.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Jobs Posted</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: S.plum, fontWeight: 500 }}>{a.totalJobsPosted}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ fontSize: 10, color: S.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Login Activity — Last 14 Days</div>
                        <LoginHeatmap days={a.loginDays} />
                      </div>
                    </div>
                  </div>

                  {/* Recent Jobs */}
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${S.border}` }}>
                    <div style={{ fontSize: 10, color: S.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Recent Job Postings</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {a.recentJobs.map((j, ji) => (
                        <div key={ji} style={{
                          fontSize: 12, color: S.plum, background: "rgba(61,26,71,0.07)",
                          border: `1px solid rgba(61,26,71,0.12)`, borderRadius: 8,
                          padding: "5px 12px", display: "flex", alignItems: "center", gap: 6,
                        }}>
                          <span style={{ fontSize: 11 }}>📌</span> {j}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Jobs contribution bar */}
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: S.muted }}>Contribution to total postings</span>
                      <span style={{ fontSize: 11, color: S.plum, fontWeight: 600 }}>{((a.totalJobsPosted / 48) * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(61,26,71,0.08)", borderRadius: 20, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${(a.totalJobsPosted / 48) * 100}%`,
                        background: `linear-gradient(90deg, ${S.plum}, ${S.plumLight})`,
                        borderRadius: 20, transition: "width 0.8s cubic-bezier(.34,1.56,.64,1)",
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin jobs posted stacked bar */}
            <div className="sec-label">Jobs Posted by Admin</div>
            <div className="panel" style={{ marginBottom: "clamp(20px,2.5vw,32px)" }}>
              <div className="panel-hdr"><div className="panel-hdr-title">Job Posting Distribution Across Admins</div></div>
              <div className="panel-body">
                <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 140 }}>
                  {adminProfiles.map((a, i) => {
                    const colors = [S.plum, S.plumMid, S.plumLight];
                    return (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: S.plum }}>{a.totalJobsPosted}</span>
                        <div style={{
                          width: "100%", borderRadius: "6px 6px 0 0",
                          height: `${(a.totalJobsPosted / 22) * 110}px`,
                          background: `linear-gradient(180deg, ${colors[i]}, ${colors[i]}88)`,
                          minHeight: 4,
                        }} />
                        <span style={{ fontSize: 10, color: S.muted, textAlign: "center" }}>{a.email.split("@")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Activity log filtered for admins */}
            <div className="sec-label">Admin Action Log</div>
            <div className="panel">
              <div className="panel-hdr">
                <span className="panel-hdr-title">Recent Admin Actions</span>
              </div>
              {activity.filter((_, i) => i % 2 === 0).map((a, i) => (
                <div key={i} className="act-row">
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

          </>}

        </div>
      </div>
    </div>
  );
}