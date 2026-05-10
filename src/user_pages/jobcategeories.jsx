import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AlertBar from "../components/alertbar";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import VITE_API_BASE_URL  from "../config/api";

const C = {
  primary:"#0f4c81", accent:"#e8472a", gold:"#f5a623",
  light:"#f4f7fb", green:"#16a34a", text:"#1a1a2e", muted:"#6b7280", border:"#e2e8f0",
};

const PER_PAGE = 24;

function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h); },[]);
  return { w, isMobile:w<640, isTablet:w>=640&&w<1024, isDesktop:w>=1024 };
}

const badge = { featured:{bg:"#fff8e1",color:"#b45309"}, hot:{bg:"#fee2e2",color:"#b91c1c"}, new:{bg:"#dcfce7",color:"#15803d"}, remote:{bg:"#ede9fe",color:"#6d28d9"} };
const leftBorder = { featured:`3px solid ${C.gold}`, hot:`3px solid ${C.accent}`, remote:"3px solid #7c3aed", new:`1px solid ${C.border}` };

function Tag({ icon, label }) {
  if (!label) return null;
  return <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11.5, color:C.muted, background:C.light, padding:"3px 9px", borderRadius:5 }}>{icon} {label}</span>;
}

function Skill({ label }) {
  return <span style={{ background:"#e8f4fd", color:C.primary, fontSize:11, padding:"2px 9px", borderRadius:4, fontWeight:500 }}>{label}</span>;
}

function JobCard({ job }) {
  const [hov, setHov] = useState(false);
  const b     = job.badge || "new";
  const skills = Array.isArray(job.skills) ? job.skills : [];
  const posted = job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : job.posted || "";

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background:"#fff", borderRadius:12, border:`1px solid ${C.border}`,
      borderLeft: leftBorder[b] || `1px solid ${C.border}`,
      padding:18, position:"relative", boxSizing:"border-box",
      transition:"all .22s ease", cursor:"pointer",
      boxShadow: hov ? "0 6px 24px rgba(15,76,129,.13)" : "none",
      transform: hov ? "translateY(-3px)" : "none",
    }}>
      {/* Badge */}
      <span style={{ position:"absolute", top:12, right:12, fontSize:10.5, fontWeight:700,
        padding:"3px 9px", borderRadius:4, background:(badge[b]||badge.new).bg, color:(badge[b]||badge.new).color }}>
        {job.badgeLabel || b}
      </span>

      {/* Logo + Title */}
      <div style={{ display:"flex", gap:12, marginBottom:12 }}>
        <div style={{ width:46, height:46, borderRadius:10, background:"#e8f4fd", color:C.primary,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontWeight:700, fontSize:15, flexShrink:0, border:`1px solid ${C.border}`, overflow:"hidden" }}>
          {job.companyLogo
            ? <img src={job.companyLogo} alt="" style={{ width:"80%", height:"80%", objectFit:"contain" }}/>
            : (job.companyName||job.company||"?").charAt(0)}
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:700, lineHeight:1.35, paddingRight:76, color:C.text }}>
            {job.jobTitle || job.role || job.title}
          </div>
          <div style={{ fontSize:12, color:C.primary, fontWeight:500, marginTop:2 }}>
            {job.companyName || job.company}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
        <Tag icon="📍" label={job.location} />
        <Tag icon="🎓" label={job.education || job.edu} />
        <Tag icon="📅" label={job.eligibleBatches || job.batch} />
        <Tag icon="💼" label={job.workMode} />
        <Tag icon="⚡" label={job.experienceLevel} />
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
          {skills.slice(0,4).map(s => <Skill key={s} label={s}/>)}
        </div>
      )}

      {/* Footer */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginTop:4 }}>
        <div>
          <div style={{ fontWeight:700, color:C.green, fontSize:13.5 }}>{job.salary}</div>
          <div style={{ fontSize:11, color:C.muted }}>{posted}</div>
        </div>
        <a href={`/jobs/${job.slug || job._id}`}
          style={{ background:C.primary, color:"#fff", padding:"7px 18px", borderRadius:7, fontSize:12.5, fontWeight:600, textDecoration:"none" }}>
          Apply Now →
        </a>
      </div>
    </div>
  );
}

function QuickLink({ label, count }) {
  return (
    <a href="#" style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"8px 0", borderBottom:`1px solid ${C.border}`, fontSize:13, color:C.text, textDecoration:"none" }}>
      {label}
      <span style={{ background:C.light, color:C.muted, fontSize:11, padding:"1px 7px", borderRadius:10 }}>{count}</span>
    </a>
  );
}

const QUICK = [["Software IT","4,200+"],["Work From Home","3,100+"],["Govt Jobs","1,800+"],["MBA Jobs","890+"],["Internships","2,300+"],["Data Analyst","670+"],["Walk-in","340+"],["Non-Engineering","1,200+"]];
const COMPANIES = [
  { name:"Amazon", bg:"#e8f4fd", color:"#0f4c81", l:"A" },{ name:"TCS", bg:"#f0fff4", color:"#16a34a", l:"T" },
  { name:"Infosys", bg:"#fff0f0", color:"#e8472a", l:"I" },{ name:"Wipro", bg:"#ede9fe", color:"#7c3aed", l:"W" },
  { name:"Deloitte", bg:"#fff7ed", color:"#c2410c", l:"D" },
];

export default function Jobcategories() {
  const { category } = useParams();
  const bp = useBreakpoint();
  const { isMobile, isDesktop } = bp;
  const g = isMobile ? "16px" : "24px";

  const [jobs,  setJobs]  = useState([]);
  const [page,  setPage]  = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  setPage(1);

  fetch(`${VITE_API_BASE_URL}/api/jobs-by-categories?category=${category}`)
    .then((r) => r.json())
    .then((d) => {
      const all = Array.isArray(d) ? d : d.jobs || d.data || [];
      setJobs(all);
      setTotal(all.length);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, [category]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const visible    = jobs.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const title      = category ? category.replace(/-/g," ").replace(/\b\w/g, c => c.toUpperCase()) : "All Jobs";

  return (
    <div style={{ width:"100%", overflowX:"hidden", fontFamily:"'DM Sans',Arial,sans-serif", background:C.light, color:C.text, minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { width:100%!important; margin:0!important; overflow-x:hidden!important; }
        #root { width:100%!important; overflow-x:hidden!important; }
        a { text-decoration:none; color:inherit; }
        .sidebar { display:block; }
        @media(max-width:1023px){ .sidebar{ display:none!important; } .job-grid{ grid-template-columns:repeat(2,1fr)!important; } }
        @media(max-width:639px){ .job-grid{ grid-template-columns:1fr!important; } }
        .page-btn { width:36px; height:36px; border-radius:7px; border:1.5px solid ${C.border}; background:#fff; color:${C.text}; font-weight:600; font-size:14px; cursor:pointer; transition:all .18s; }
        .page-btn:hover { border-color:${C.primary}; color:${C.primary}; }
        .page-btn.on { border-color:${C.primary}; background:${C.primary}; color:#fff; }
        .page-btn:disabled { opacity:.4; cursor:not-allowed; }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <AlertBar C={{ accent:"#ff4d4f" }} />
      {/* <TopTicker C={C} gutter={g} isMobile={isMobile} isDesktop={isDesktop} /> */}
            <div className="section-full">
        {/* <TopTicker isMobile={isMobile} isDesktop={isDesktop} C={C} gutter="16px" /> */}
      </div>
      <Navbar bp={bp} onMenuOpen={() => {}} />

      {/* Hero strip */}
      <div
  style={{
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg,#f8fbff 0%,#eef4ff 45%,#f5f9ff 100%)",
    padding: isMobile ? "52px 18px 48px" : "82px 24px 72px",
    borderBottom: "1px solid #e5e7eb",
  }}
>
  {/* Background Shapes */}
  <div
    style={{
      position: "absolute",
      top: -140,
      right: -120,
      width: 360,
      height: 360,
      borderRadius: "42%",
      background: "linear-gradient(135deg,#dbeafe,#93c5fd)",
      opacity: 0.7,
      transform: "rotate(22deg)",
    }}
  />

  <div
    style={{
      position: "absolute",
      bottom: -140,
      left: -120,
      width: 340,
      height: 340,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#fde68a,#fca5a5)",
      opacity: 0.35,
      filter: "blur(24px)",
    }}
  />

  {/* Grid Overlay */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage:
        "linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)",
      backgroundSize: "42px 42px",
      pointerEvents: "none",
    }}
  />

  <div
    style={{
      maxWidth: 1240,
      margin: "0 auto",
      padding: `0 ${g}`,
      position: "relative",
      zIndex: 2,
    }}
  >
    {/* Breadcrumb */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 26,
        fontSize: 12,
      }}
    >
      <a
        href="/"
        style={{
          color: "#6b7280",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Home
      </a>

      <span style={{ color: "#9ca3af" }}>›</span>

      <a
        href="/jobs"
        style={{
          color: "#6b7280",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Jobs
      </a>

      <span style={{ color: "#9ca3af" }}>›</span>

      <span
        style={{
          color: "#111827",
          fontWeight: 700,
        }}
      >
        {title}
      </span>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.1fr .9fr",
        gap: isMobile ? 40 : 60,
        alignItems: "center",
      }}
    >
      {/* LEFT CONTENT */}
      <div>
        {/* Top Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            border: "1px solid #dbeafe",
            borderRadius: 999,
            padding: "8px 18px",
            marginBottom: 26,
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
              letterSpacing: ".04em",
            }}
          >
            VERIFIED JOB LISTINGS
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: isMobile ? "2.6rem" : "4.6rem",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            color: "#111827",
            marginBottom: 22,
            maxWidth: 760,
          }}
        >
          Discover <br />

          <span style={{ color: "#2563eb" }}>
            {title}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: isMobile ? 14 : 16,
            lineHeight: 1.9,
            color: "#4b5563",
            maxWidth: 620,
            marginBottom: 34,
          }}
        >
          Browse verified fresher and experienced jobs from top companies
          across India. Updated daily with the latest opportunities,
          remote jobs, internships and walk-in drives.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? 14 : 18,
          }}
        >
          {[
            ["💼", loading ? "..." : total, "Jobs Found"],
            ["⚡", "Daily", "Updates"],
            ["🏢", "500+", "Companies"],
          ].map(([icon, val, label]) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid #dbeafe",
                borderRadius: 20,
                padding: isMobile ? "16px 18px" : "18px 22px",
                minWidth: isMobile ? 110 : 145,
                boxShadow: "0 12px 30px rgba(0,0,0,.05)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  marginBottom: 8,
                }}
              >
                {icon}
              </div>

              <div
                style={{
                  fontSize: isMobile ? 22 : 30,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: "#111827",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {val}
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE DESIGN */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            width: isMobile ? 320 : 460,
            height: isMobile ? 320 : 460,
          }}
        >
          {/* Glow Circle */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)",
              opacity: 0.08,
            }}
          />

          {/* Floating Cards */}
          {[
            {
              icon: "🚀",
              title: "Freshers Jobs",
              top: 18,
              left: 12,
            },
            {
              icon: "💻",
              title: "IT Hiring",
              top: 65,
              right: 0,
            },
            {
              icon: "🏠",
              title: "Remote Jobs",
              bottom: 90,
              left: 0,
            },
            {
              icon: "📄",
              title: "Internships",
              bottom: 18,
              right: 40,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...item,
                background: "rgba(255,255,255,.82)",
                backdropFilter: "blur(14px)",
                border: "1px solid #dbeafe",
                borderRadius: 22,
                padding: "16px 18px",
                minWidth: 150,
                boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>
                {item.icon}
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 4,
                }}
              >
                Verified Openings
              </div>
            </div>
          ))}

          {/* Center Circle */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? 140  : 180,
              height: isMobile ? 50 : 180,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #dbeafe",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 50px rgba(37,99,235,0.12)",
            }}
          >
            <div style={{ fontSize: isMobile ? 40 : 56 }}>
              💼
            </div>

            <div
              style={{
                marginTop: 10,
                fontWeight: 800,
                color: "#111827",
                fontSize: isMobile ? 14 : 16,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              Career
              <br />
              Opportunities
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Main */}
      <div style={{ width:"100%", padding:`24px ${g} 60px`, boxSizing:"border-box", display:"flex", gap:24, alignItems:"flex-start" }}>

        {/* Job content */}
        <div style={{ flex:1, minWidth:0 }}>

          {/* Skeleton */}
          {loading && (
            <div className="job-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {Array.from({length:6}).map((_,i) => (
                <div key={i} style={{ background:"#fff", borderRadius:12, border:`1px solid ${C.border}`, padding:18, height:200 }}>
                  {[["70%",12],["40%",8],["90%",8],["60%",8]].map(([w,mb],j) => (
                    <div key={j} style={{ height:11, borderRadius:6, background:"#e8f0f8", width:w, marginBottom:mb, animation:"shimmer 1.4s infinite" }}/>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Cards */}
          {!loading && (
            <div className="job-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {visible.map(job => <JobCard key={job._id||job.id} job={job} />)}
              {visible.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 0", color:C.muted }}>
                  No jobs found for <strong>{title}</strong>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ display:"flex", gap:8, marginTop:28, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="page-btn" onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(n => (
                <button key={n} className={`page-btn ${page===n?"on":""}`} onClick={()=>setPage(n)}>{n}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>›</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar" style={{ width:280, flexShrink:0 }}>
          {/* Ad */}
          <div style={{ background:`linear-gradient(135deg,${C.primary},#1565c0)`, color:"#fff", borderRadius:12, padding:20, textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginBottom:8 }}>Advertisement</div>
            <div style={{ fontWeight:800, fontSize:14, marginBottom:6 }}>🚀 Launch Your Tech Career</div>
            <p style={{ fontSize:12, opacity:.85, marginBottom:14 }}>GeeksforGeeks Bootcamp – Job Guarantee 2026</p>
            <a href="#" style={{ background:C.gold, color:"#000", padding:"8px 18px", borderRadius:7, fontWeight:700, fontSize:12.5, display:"inline-block" }}>Join Now →</a>
          </div>

          {/* Quick cats */}
          <div style={{ background:"#fff", borderRadius:12, border:`1px solid ${C.border}`, padding:18, marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>⚡ Quick Categories</div>
            {QUICK.map(([l,c]) => <QuickLink key={l} label={l} count={c} />)}
          </div>

          {/* Top companies */}
          <div style={{ background:"#fff", borderRadius:12, border:`1px solid ${C.border}`, padding:18, marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>🏢 Top Companies</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {COMPANIES.map(co => (
                <div key={co.name} style={{ display:"flex", alignItems:"center", gap:10, padding:9, borderRadius:8, border:`1px solid ${C.border}`, cursor:"pointer" }}>
                  <div style={{ width:34, height:34, borderRadius:7, background:co.bg, color:co.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>{co.l}</div>
                  <strong style={{ fontSize:13 }}>{co.name}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <div style={{ background:"linear-gradient(160deg,#1a1a2e,#16213e)", color:"#fff", borderRadius:12, padding:18, textAlign:"center" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginBottom:8 }}>Advertisement</div>
            <div style={{ fontSize:32, marginBottom:6 }}>📱</div>
            <div style={{ fontWeight:800, fontSize:14, marginBottom:6 }}>Job Alerts on WhatsApp</div>
            <p style={{ fontSize:12, opacity:.75, marginBottom:14 }}>Join 5L+ freshers getting daily updates</p>
            <a href="#" style={{ background:"linear-gradient(90deg,#e8472a,#f5a623)", color:"#fff", padding:"8px 18px", borderRadius:7, fontWeight:700, fontSize:12.5, display:"inline-block" }}>Join Free →</a>
          </div>
        </div>

      </div>

      <Footer bp={bp} gutter={g} />
    </div>
  );
}