import { useState, useEffect } from "react";

const LOGO = "https://res.cloudinary.com/dd3niyhrb/image/upload/v1773481829/WhatsApp_Image_2026-03-14_at_3.18.14_PM_o5drwx.jpg";

/* ── DATA ─────────────────────────────────────────────────────── */
const JOBS = [
  { id:1,  badge:"featured", badgeLabel:"⭐ Featured", company:"Amazon India",              role:"Amazon Customer Support – Work From Home",          logo:"A",  logoBg:"#e8f4fd", logoColor:"#0f4c81", location:"Work From Home",       edu:"12th Pass / Any Graduate",   batch:"2022–2026 Batch", salary:"₹3.0 – 4.5 LPA",   posted:"2 hours ago",  skills:["Customer Support","Communication","Problem Solving"] },
  { id:2,  badge:"hot",      badgeLabel:"🔥 Hot",      company:"Infosys Limited",            role:"Infosys Systems Engineer – Off Campus Drive",        logo:"I",  logoBg:"#fff0f0", logoColor:"#e8472a", location:"Bangalore, Pune, Hyd",  edu:"B.E / B.Tech / MCA",         batch:"2025–2026 Batch", salary:"₹3.6 – 5.0 LPA",   posted:"5 hours ago",  skills:["Java","Python","SQL","OOPS"] },
  { id:3,  badge:"new",      badgeLabel:"🆕 New",      company:"Tata Consultancy Services",  role:"TCS BPS Fresher Hiring – Digital Operations",        logo:"T",  logoBg:"#f0fff4", logoColor:"#16a34a", location:"Multiple Locations",    edu:"Any Graduate",               batch:"2024–2026 Batch", salary:"₹2.5 – 3.5 LPA",   posted:"8 hours ago",  skills:["MS Office","Communication","Analytical Skills"] },
  { id:4,  badge:"remote",   badgeLabel:"🏠 Remote",   company:"Wipro Technologies",         role:"Wipro NLTH Elite Fresher Hiring 2026",               logo:"W",  logoBg:"#ede9fe", logoColor:"#7c3aed", location:"Bangalore, Chennai",    edu:"B.E / B.Tech (CS/IT/ECE)",   batch:"2025–2026 Batch", salary:"₹3.5 LPA",          posted:"1 day ago",    skills:["C/C++","Data Structures","DBMS","OS"] },
  { id:5,  badge:"hot",      badgeLabel:"🔥 Hot",      company:"Deloitte India",             role:"Deloitte USI – Analyst & Consulting Fresher",        logo:"D",  logoBg:"#fff7ed", logoColor:"#c2410c", location:"Hyderabad, Mumbai",     edu:"MBA / B.Com / BBA",          batch:"2025–2026 Batch", salary:"₹7.0 – 9.5 LPA",   posted:"1 day ago",    skills:["Excel","PowerPoint","Finance","Consulting"] },
  { id:6,  badge:"new",      badgeLabel:"🆕 New",      company:"Red Hat (IBM Company)",      role:"Red Hat – Associate Software Engineer",              logo:"R",  logoBg:"#e8f4fd", logoColor:"#0369a1", location:"Pune",                  edu:"B.E / B.Tech / M.Tech",      batch:"2023–2025 Batch", salary:"₹8.0 – 12.0 LPA",  posted:"2 days ago",   skills:["Linux","Python","Go","Kubernetes"] },
  { id:7,  badge:"new",      badgeLabel:"🆕 New",      company:"Google India",               role:"Google STEP Internship 2026",                        logo:"G",  logoBg:"#fef9c3", logoColor:"#a16207", location:"Bangalore / Remote",    edu:"CS / IT Students",           batch:"2026–2027 Batch", salary:"₹80,000/month",     posted:"3 days ago",   skills:["DSA","Problem Solving","C++/Java"] },
  { id:8,  badge:"featured", badgeLabel:"⭐ Featured", company:"Accenture India",            role:"Accenture ASE Fresher Drive 2026",                   logo:"Ac", logoBg:"#f0f4ff", logoColor:"#3730a3", location:"Pan India",             edu:"B.E / B.Tech / MCA / M.Sc", batch:"2024–2026 Batch", salary:"₹4.5 – 6.5 LPA",   posted:"4 days ago",   skills:["Communication","Reasoning","Tech Fundamentals"] },
  { id:9,  badge:"hot",      badgeLabel:"🔥 Hot",      company:"HCL Technologies",           role:"HCL Tech Bee Fresher Programme 2026",                logo:"H",  logoBg:"#f0fdf4", logoColor:"#166534", location:"Noida, Chennai, Hyd",   edu:"B.E / B.Tech / BCA / MCA",  batch:"2024–2026 Batch", salary:"₹3.0 – 4.0 LPA",   posted:"5 days ago",   skills:["Java","HTML/CSS","Testing","Communication"] },
  { id:10, badge:"remote",   badgeLabel:"🏠 Remote",   company:"NTT Data India",             role:"NTT Data Work From Home – Data Analyst",             logo:"N",  logoBg:"#fdf4ff", logoColor:"#86198f", location:"Work From Home",        edu:"B.E / B.Tech / BCA / MCA",  batch:"2022–2025 Batch", salary:"₹4.0 – 6.0 LPA",   posted:"6 days ago",   skills:["Python","SQL","Power BI","Excel"] },
];

const CATS = ["All Jobs|12.4K","Software/IT|4.2K","Govt Jobs|1.8K","Work From Home|3.1K","MBA Jobs|890","Internships|2.3K","Data Analyst|670","Walk-in|340"].map(s => { const [l,c]=s.split("|"); return {label:l,count:c}; });
const QUICK_CATS = [["Software IT Jobs","4,200+"],["Work From Home","3,100+"],["Government Jobs","1,800+"],["MBA / BBA Jobs","890+"],["Internships","2,300+"],["Walk-in Jobs","340+"],["Data Analyst Jobs","670+"],["Non-Engineering","1,200+"]];
const COMPANIES = [{name:"Amazon",roles:"24 open roles",bg:"#e8f4fd",color:"#0f4c81",l:"A"},{name:"TCS",roles:"36 open roles",bg:"#f0fff4",color:"#16a34a",l:"T"},{name:"Infosys",roles:"18 open roles",bg:"#fff0f0",color:"#e8472a",l:"I"},{name:"Wipro",roles:"22 open roles",bg:"#ede9fe",color:"#7c3aed",l:"W"},{name:"Deloitte",roles:"11 open roles",bg:"#fff7ed",color:"#c2410c",l:"D"}];
const LOCATIONS = [["Bangalore","3,200"],["Hyderabad","2,400"],["Pune","1,900"],["Mumbai","1,600"],["Chennai","1,100"],["Delhi NCR","980"],["Noida","760"]];
const NAV_LINKS = ["Home","Freshers Jobs","Work From Home","Internships","Interview Tips","By Location"];

const C = { primary:"#0f4c81", accent:"#e8472a", gold:"#f5a623", light:"#f4f7fb", green:"#16a34a", text:"#1a1a2e", muted:"#6b7280", border:"#e2e8f0" };
const BADGE_STYLE = { featured:{bg:"#fff8e1",color:"#b45309"}, hot:{bg:"#fee2e2",color:"#b91c1c"}, new:{bg:"#dcfce7",color:"#15803d"}, remote:{bg:"#ede9fe",color:"#6d28d9"} };
const BADGE_BORDER = { featured:`3px solid ${C.gold}`, hot:`3px solid ${C.accent}`, remote:`3px solid #7c3aed`, new:`1px solid ${C.border}` };

/* ── HOOK: window width ───────────────────────────────────────── */
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ── SMALL COMPONENTS ─────────────────────────────────────────── */
function MetaTag({ icon, label }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, color:C.muted, background:C.light, padding:"3px 8px", borderRadius:5, whiteSpace:"nowrap" }}>
      {icon} {label}
    </span>
  );
}

function SkillTag({ label }) {
  return <span style={{ background:"#e8f4fd", color:C.primary, fontSize:10.5, padding:"2px 8px", borderRadius:4, fontWeight:500, whiteSpace:"nowrap" }}>{label}</span>;
}

function SectionTitle({ text }) {
  return (
    <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, display:"flex", alignItems:"center", gap:8, margin:0 }}>
      <span style={{ width:4, height:20, background:C.accent, borderRadius:3, display:"inline-block", flexShrink:0 }} />
      {text}
    </h2>
  );
}

/* ── JOB CARD ─────────────────────────────────────────────────── */
function JobCard({ job }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"#fff", borderRadius:12, border:`1px solid ${C.border}`, borderLeft: BADGE_BORDER[job.badge], padding:"16px", position:"relative", display:"flex", flexDirection:"column", gap:10, height:"100%", boxSizing:"border-box", transition:"all .22s", boxShadow: hov ? "0 6px 24px rgba(15,76,129,.13)" : "none", transform: hov ? "translateY(-2px)" : "none", cursor:"pointer" }}
    >
      <span style={{ position:"absolute", top:12, right:12, fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:4, background:BADGE_STYLE[job.badge].bg, color:BADGE_STYLE[job.badge].color }}>
        {job.badgeLabel}
      </span>
      <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
        <div style={{ width:44, height:44, borderRadius:10, background:job.logoBg, color:job.logoColor, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0, border:`1px solid ${C.border}` }}>
          {job.logo}
        </div>
        <div style={{ paddingRight:80 }}>
          <div style={{ fontSize:13.5, fontWeight:700, lineHeight:1.3, color:C.text }}>{job.role}</div>
          <div style={{ fontSize:12, color:C.primary, fontWeight:500, marginTop:2 }}>{job.company}</div>
        </div>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        <MetaTag icon="📍" label={job.location} />
        <MetaTag icon="🎓" label={job.edu} />
        <MetaTag icon="📅" label={job.batch} />
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {job.skills.map(s => <SkillTag key={s} label={s} />)}
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginTop:"auto" }}>
        <div>
          <div style={{ fontWeight:700, color:C.green, fontSize:13 }}>{job.salary}</div>
          <div style={{ fontSize:11, color:C.muted }}>{job.posted}</div>
        </div>
        <a href="#" style={{ background:C.primary, color:"#fff", padding:"7px 16px", borderRadius:7, fontSize:12.5, fontWeight:600, textDecoration:"none", whiteSpace:"nowrap" }}>Apply Now →</a>
      </div>
    </div>
  );
}

/* ── AD STRIP ─────────────────────────────────────────────────── */
function AdStrip({ icon, title, sub, btn, btnColor=C.accent, bg="linear-gradient(90deg,#fff9e6,#fffde7)", border=`1.5px dashed ${C.gold}` }) {
  const w = useWidth();
  const mobile = w < 600;
  return (
    <div style={{ background:bg, border, borderRadius:10, padding:"11px 14px", display:"flex", flexWrap:"wrap", alignItems:"center", gap:10 }}>
      <span style={{ fontSize:9.5, color:"#999", border:"1px solid #ddd", padding:"1px 5px", borderRadius:3, flexShrink:0 }}>AD</span>
      <div style={{ width:40, height:40, borderRadius:8, background:`linear-gradient(135deg,${C.gold},${C.accent})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1, minWidth:120 }}>
        <strong style={{ fontSize: mobile ? 12.5 : 13.5, display:"block" }}>{title}</strong>
        <span style={{ fontSize: mobile ? 11 : 12, color:C.muted }}>{sub}</span>
      </div>
      <a href="#" style={{ background:btnColor, color:"#fff", padding:"7px 14px", borderRadius:7, fontWeight:600, fontSize:12.5, textDecoration:"none", whiteSpace:"nowrap", marginLeft:"auto" }}>{btn}</a>
    </div>
  );
}

/* ── INLINE AD ────────────────────────────────────────────────── */
function InlineAd({ icon, title, sub, btn, btnColor=C.primary, bg="linear-gradient(90deg,#e8f4fd,#f0f7ff)", border=`1px solid #bdd6f0` }) {
  const w = useWidth(); const mobile = w < 600;
  return (
    <div style={{ background:bg, border, borderRadius:10, padding:"12px 14px", display:"flex", flexWrap:"wrap", alignItems:"center", gap:10 }}>
      <span style={{ fontSize:9.5, color:"#999", border:"1px solid #ddd", padding:"1px 5px", borderRadius:3 }}>Sponsored</span>
      <span style={{ fontSize:24 }}>{icon}</span>
      <div style={{ flex:1, minWidth:120 }}>
        <strong style={{ fontSize: mobile ? 12.5 : 13.5, display:"block" }}>{title}</strong>
        <span style={{ fontSize: mobile ? 11 : 12, color:C.muted }}>{sub}</span>
      </div>
      <a href="#" style={{ background:btnColor, color:"#fff", padding:"7px 14px", borderRadius:7, fontSize:12.5, fontWeight:600, textDecoration:"none", whiteSpace:"nowrap", marginLeft:"auto" }}>{btn}</a>
    </div>
  );
}

/* ── SIDEBAR WIDGET ───────────────────────────────────────────── */
function SidebarWidget({ title, children }) {
  return (
    <div style={{ background:"#fff", borderRadius:12, border:`1px solid ${C.border}`, padding:16, marginBottom:14 }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, marginBottom:12, color:C.text }}>{title}</div>
      {children}
    </div>
  );
}

function QuickLink({ label, count }) {
  return (
    <a href="#" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}`, fontSize:12.5, color:C.text, textDecoration:"none" }}>
      {label}
      <span style={{ display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ background:C.light, color:C.muted, fontSize:10.5, padding:"1px 7px", borderRadius:10 }}>{count}</span>
        <span style={{ color:C.muted, fontSize:11 }}>›</span>
      </span>
    </a>
  );
}

/* ── MOBILE BOTTOM NAV ────────────────────────────────────────── */
function MobileBottomNav() {
  const [active, setActive] = useState(0);
  const items = [["🏠","Home"],["💼","Jobs"],["🔍","Search"],["📍","Near Me"],["👤","Profile"]];
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:`1px solid ${C.border}`, display:"flex", zIndex:200, boxShadow:"0 -2px 10px rgba(0,0,0,.08)" }}>
      {items.map(([icon,label],i) => (
        <button key={label} onClick={() => setActive(i)} style={{ flex:1, border:"none", background:"none", padding:"8px 4px 10px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <span style={{ fontSize:18 }}>{icon}</span>
          <span style={{ fontSize:9.5, fontWeight: active===i ? 700 : 400, color: active===i ? C.primary : C.muted }}>{label}</span>
          {active===i && <span style={{ width:16, height:2, background:C.primary, borderRadius:2 }} />}
        </button>
      ))}
    </div>
  );
}

/* ── MOBILE DRAWER ────────────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:300 }} />
      <div style={{ position:"fixed", top:0, left:0, bottom:0, width:280, background:"#fff", zIndex:400, overflowY:"auto", boxShadow:"4px 0 24px rgba(0,0,0,.15)" }}>
        <div style={{ background:C.primary, padding:"16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <img src={LOGO} alt="logo" style={{ height:32, width:32, borderRadius:8 }} />
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, color:"#fff" }}>Code<span style={{ color:C.gold }}>Techniques</span></span>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", borderRadius:7, width:30, height:30, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        <div style={{ padding:12 }}>
          {NAV_LINKS.map(link => (
            <a key={link} href="#" onClick={onClose} style={{ display:"block", padding:"11px 12px", borderRadius:7, fontSize:14, fontWeight:500, color:C.text, marginBottom:2 }}>{link}</a>
          ))}
          <div style={{ height:1, background:C.border, margin:"12px 0" }} />
          <a href="#" style={{ display:"block", background:C.accent, color:"#fff", padding:"11px 12px", borderRadius:8, fontWeight:700, fontSize:14, textAlign:"center" }}>📢 Post a Job</a>
          <div style={{ marginTop:16, background:C.light, borderRadius:10, padding:14 }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:8, fontWeight:600 }}>📍 Browse by Location</div>
            {LOCATIONS.map(([l]) => <a key={l} href="#" style={{ display:"block", fontSize:13, padding:"5px 0", color:C.primary }}>{l}</a>)}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── MAIN APP ─────────────────────────────────────────────────── */
export default function App() {
  const w = useWidth();
  const isMobile  = w < 640;
  const isTablet  = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;
  const showSidebar = isDesktop;

  const [activeCat, setActiveCat]     = useState(0);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [searching, setSearching]     = useState(false);
  const [searchQ, setSearchQ]         = useState("");

  const handleSearch = () => { setSearching(true); setTimeout(() => setSearching(false), 1400); };

  // cols: 1 on mobile, 2 on tablet+
  const jobCols = isMobile ? 1 : 2;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.light, color:C.text, minHeight:"100vh", paddingBottom: isMobile ? 64 : 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        a{text-decoration:none;color:inherit;}
        @keyframes ticker{0%{transform:translateX(100%)}100%{transform:translateX(-120%)}}
        .ticker{display:inline-block;animation:ticker 38s linear infinite;white-space:nowrap;}
        .cat-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
        .cat-scroll::-webkit-scrollbar{display:none;}
        input::placeholder{color:#aaa;}
        select{appearance:auto;}
        @media(hover:hover){
          .nav-a:hover{background:${C.light} !important;color:${C.primary} !important;}
          .qlink-a:hover{color:${C.primary} !important;}
          .co-item:hover{border-color:${C.primary} !important;}
        }
      `}</style>

      {/* ── ALERT BAR ── */}
      <div style={{ background:`linear-gradient(90deg,${C.accent},#c0392b)`, color:"#fff", textAlign:"center", padding: isMobile ? "8px 12px" : "9px 16px", fontSize: isMobile ? 12 : 13 }}>
        🎉 New jobs added today from Amazon, TCS, Infosys &amp; more!&nbsp;
        <a href="#jobs" style={{ color:"#fff", textDecoration:"underline" }}>View Latest →</a>
      </div>

      {/* ── TOP BAR (tablet+) ── */}
      {!isMobile && (
        <div style={{ background:C.primary, color:"#fff", fontSize:11.5, padding:"5px 0" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, overflow:"hidden", flex:1 }}>
              <span style={{ background:C.accent, color:"#fff", borderRadius:3, padding:"1px 8px", fontWeight:700, fontSize:10, whiteSpace:"nowrap" }}>🔥 HOT</span>
              <div style={{ overflow:"hidden" }}>
                <span className="ticker" style={{ opacity:.85 }}>TCS BPS Hiring 2026 &nbsp;|&nbsp; Amazon WFH &nbsp;|&nbsp; Wipro NLTH 2026 &nbsp;|&nbsp; Infosys Systems Engineer &nbsp;|&nbsp; Google Internship 2026 &nbsp;|&nbsp; Deloitte Fresher Drive &nbsp;|&nbsp; Accenture Off Campus &nbsp;|&nbsp; Red Hat Associate Eng</span>
              </div>
            </div>
            {isDesktop && (
              <div style={{ display:"flex", gap:16, flexShrink:0 }}>
                {["About","Contact","Privacy"].map(l => <a key={l} href="#" style={{ color:"#c8d8ea" }}>{l}</a>)}
                <a href="#" style={{ color:C.gold, fontWeight:600 }}>Advertise With Us</a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav style={{ background:"#fff", borderBottom:`2px solid ${C.border}`, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 10px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: isMobile ? "0 12px" : "0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height: isMobile ? 56 : 64 }}>
          {/* Brand */}
          <a href="#" style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <img src={LOGO} alt="CodeTechniques" style={{ height: isMobile ? 34 : 40, width: isMobile ? 34 : 40, borderRadius:9, objectFit:"cover" }} />
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize: isMobile ? 17 : 21, color:C.primary, whiteSpace:"nowrap" }}>
              Code<span style={{ color:C.accent }}>Techniques</span>
            </span>
          </a>

          {/* Desktop nav */}
          {isDesktop && (
            <div style={{ display:"flex", alignItems:"center", gap:2 }}>
              {NAV_LINKS.map((item,i) => (
                <a key={item} className="nav-a" href="#" style={{ fontSize:13, fontWeight:500, padding:"7px 11px", borderRadius:6, color: i===0 ? C.primary : C.text, background: i===0 ? C.light : "transparent", transition:"all .2s", whiteSpace:"nowrap" }}>{item}</a>
              ))}
              <a href="#" style={{ background:C.accent, color:"#fff", padding:"7px 16px", borderRadius:7, fontWeight:600, fontSize:13, marginLeft:6, whiteSpace:"nowrap" }}>Post a Job</a>
            </div>
          )}

          {/* Tablet: show Post Job + hamburger */}
          {isTablet && (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <a href="#" style={{ background:C.accent, color:"#fff", padding:"7px 14px", borderRadius:7, fontWeight:600, fontSize:12.5 }}>Post a Job</a>
              <button onClick={() => setDrawerOpen(true)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:8, width:38, height:38, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:20, lineHeight:1 }}>☰</span>
              </button>
            </div>
          )}

          {/* Mobile: hamburger only */}
          {isMobile && (
            <button onClick={() => setDrawerOpen(true)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:8, width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:18, lineHeight:1 }}>☰</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile/Tablet Drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ── HERO ── */}
      <section style={{ background:"linear-gradient(135deg,#0f4c81 0%,#1565c0 60%,#0d47a1 100%)", color:"#fff", padding: isMobile ? "28px 0 24px" : isTablet ? "38px 0 32px" : "48px 0 40px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: isMobile ? "0 14px" : "0 16px" }}>
          <div style={{ display:"flex", flexDirection: isMobile ? "column" : isTablet ? "column" : "row", alignItems: isDesktop ? "center" : "flex-start", gap: isMobile ? 20 : 28 }}>
            {/* Left */}
            <div style={{ flex:1 }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize: isMobile ? "1.55rem" : isTablet ? "2rem" : "2.4rem", fontWeight:800, lineHeight:1.2, marginBottom:10 }}>
                Find Your Dream Job<br />As a <span style={{ color:C.gold }}>Fresher in India</span>
              </h1>
              <p style={{ fontSize: isMobile ? 13 : 14.5, opacity:.88, marginBottom:20, maxWidth:520 }}>
                100% verified job postings from top IT, government &amp; startup companies. Updated daily for 2025 &amp; 2026 batch graduates.
              </p>
              <div style={{ display:"flex", gap: isMobile ? 8 : 14, flexWrap:"wrap" }}>
                {[["12,400+","Active Jobs"],["850+","Companies"],["2.3L+","Hired"]].map(([n,l]) => (
                  <div key={l} style={{ background:"rgba(255,255,255,.13)", border:"1px solid rgba(255,255,255,.2)", borderRadius:10, padding: isMobile ? "9px 14px" : "12px 20px", textAlign:"center" }}>
                    <strong style={{ display:"block", fontFamily:"'Syne',sans-serif", fontSize: isMobile ? "1.1rem" : "1.3rem", fontWeight:800 }}>{n}</strong>
                    <small style={{ fontSize: isMobile ? 10.5 : 12, opacity:.8 }}>{l}</small>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Card */}
            <div style={{ background:"rgba(255,255,255,.13)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.2)", borderRadius:14, padding: isMobile ? 16 : 22, width: isDesktop ? 360 : "100%", flexShrink:0 }}>
              <h6 style={{ fontSize:13.5, fontWeight:600, marginBottom:12 }}>🔍 Quick Job Search</h6>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Job title or company name"
                style={{ width:"100%", padding:"10px 13px", borderRadius:8, border:"none", background:"rgba(255,255,255,.96)", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", color:C.text, marginBottom:9, outline:"none", display:"block" }} />
              <select style={{ width:"100%", padding:"10px 13px", borderRadius:8, border:"none", background:"rgba(255,255,255,.96)", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", color:C.text, marginBottom:9, display:"block" }}>
                <option>All Locations</option>
                {["Bangalore","Hyderabad","Pune","Mumbai","Chennai","Work From Home"].map(l => <option key={l}>{l}</option>)}
              </select>
              <select style={{ width:"100%", padding:"10px 13px", borderRadius:8, border:"none", background:"rgba(255,255,255,.96)", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", color:C.text, marginBottom:12, display:"block" }}>
                <option>All Categories</option>
                {["Software / IT","Government Jobs","MBA Jobs","Internships","Data Analyst"].map(c => <option key={c}>{c}</option>)}
              </select>
              <button onClick={handleSearch} style={{ width:"100%", background:C.accent, color:"#fff", border:"none", padding:"11px", borderRadius:8, fontWeight:700, fontSize:14, fontFamily:"'Syne',sans-serif", cursor:"pointer" }}>
                {searching ? "Searching..." : "Search Jobs →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP AD ── */}
      <div style={{ maxWidth:1280, margin:"14px auto", padding: isMobile ? "0 12px" : "0 16px" }}>
        <AdStrip icon="🎓" title="Upskill & Get Hired Faster — GreatLearning Free Courses" sub="Python, Data Science, Cloud, AI/ML — 100% Free Certifications" btn="Enroll Free →" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div id="jobs" style={{ maxWidth:1280, margin:"0 auto", padding: isMobile ? "0 12px 32px" : "0 16px 48px" }}>
        <div style={{ display:"flex", gap:22, alignItems:"flex-start" }}>

          {/* ── LEFT / FULL ── */}
          <div style={{ flex:1, minWidth:0 }}>

            {/* Category Pills */}
            <div style={{ marginTop:16, marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <SectionTitle text="Browse by Category" />
              </div>
              <div className="cat-scroll">
                {CATS.map((c,i) => (
                  <span key={c.label} onClick={() => setActiveCat(i)}
                    style={{ background: activeCat===i ? C.primary : "#fff", color: activeCat===i ? "#fff" : C.text, border:`1.5px solid ${activeCat===i ? C.primary : C.border}`, borderRadius:20, padding: isMobile ? "5px 12px" : "5px 15px", fontSize: isMobile ? 11.5 : 12.5, fontWeight:500, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap", transition:"all .18s", flexShrink:0 }}>
                    {c.label}
                    <span style={{ background: activeCat===i ? "rgba(255,255,255,.2)" : "#e8f4fd", color: activeCat===i ? "#fff" : C.primary, padding:"1px 6px", borderRadius:10, fontSize:10, fontWeight:700 }}>{c.count}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Section Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <SectionTitle text="Latest Jobs 2026" />
              <a href="#" style={{ fontSize:12.5, color:C.primary, fontWeight:600 }}>View All →</a>
            </div>

            {/* Job Grid */}
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${jobCols}, 1fr)`, gap:12 }}>
              {JOBS.slice(0,3).map(j => <JobCard key={j.id} job={j} />)}

              {/* Mid Ad */}
              <div style={{ gridColumn:`1 / -1` }}>
                <InlineAd icon="💼" title="Naukri.com — India's No.1 Job Portal" sub="Build your resume, get alerts & apply to 1 crore+ jobs" btn="Visit Naukri →" />
              </div>

              {JOBS.slice(3,7).map(j => <JobCard key={j.id} job={j} />)}

              {/* Bottom Ad */}
              <div style={{ gridColumn:`1 / -1` }}>
                <InlineAd icon="📚" title="Coding Ninjas — Crack Product Companies" sub="DSA, System Design, Mock Interviews & Placement Prep" btn="Start Free →" btnColor={C.accent} bg="linear-gradient(90deg,#fff0f0,#fff5f5)" border="1px solid #fbb" />
              </div>

              {JOBS.slice(7).map(j => <JobCard key={j.id} job={j} />)}
            </div>

            {/* Pagination */}
            <div style={{ display:"flex", gap:7, marginTop:24, justifyContent:"center", flexWrap:"wrap" }}>
              {["‹","1","2","3","4","5","›"].map((p,i) => (
                <button key={i} style={{ width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius:7, border:`1.5px solid ${p==="1" ? C.primary : C.border}`, background: p==="1" ? C.primary : "#fff", color: p==="1" ? "#fff" : C.text, fontWeight:600, fontSize: isMobile ? 12.5 : 14, cursor:"pointer" }}>{p}</button>
              ))}
            </div>

            {/* Mobile quick cats (shown below jobs on mobile) */}
            {isMobile && (
              <div style={{ marginTop:24 }}>
                <SidebarWidget title="⚡ Quick Job Categories">
                  {QUICK_CATS.map(([l,c]) => <QuickLink key={l} label={l} count={c} />)}
                </SidebarWidget>
                <div style={{ background:"linear-gradient(135deg,#0f4c81,#1565c0)", color:"#fff", borderRadius:12, padding:18, textAlign:"center", marginBottom:14 }}>
                  <span style={{ fontSize:9.5, color:"rgba(255,255,255,.4)", display:"block", marginBottom:7 }}>Advertisement</span>
                  <h5 style={{ fontFamily:"'Syne',sans-serif", fontSize:14.5, fontWeight:800, marginBottom:6 }}>🚀 Launch Your Tech Career</h5>
                  <p style={{ fontSize:12, opacity:.85, marginBottom:12 }}>GeeksforGeeks Bootcamp – Job Guarantee 2026</p>
                  <a href="#" style={{ background:C.gold, color:"#000", padding:"8px 18px", borderRadius:7, fontWeight:700, fontSize:13, display:"inline-block" }}>Join Now →</a>
                </div>
                <SidebarWidget title="📍 Jobs by Location">
                  {LOCATIONS.map(([l,c]) => <QuickLink key={l} label={l} count={c} />)}
                </SidebarWidget>
              </div>
            )}
          </div>

          {/* ── SIDEBAR (desktop only) ── */}
          {showSidebar && (
            <div style={{ width:290, flexShrink:0 }}>
              {/* Sidebar Ad 1 */}
              <div style={{ background:"linear-gradient(135deg,#0f4c81,#1565c0)", color:"#fff", borderRadius:12, padding:18, textAlign:"center", marginBottom:14 }}>
                <span style={{ fontSize:9.5, color:"rgba(255,255,255,.4)", display:"block", marginBottom:7 }}>Advertisement</span>
                <h5 style={{ fontFamily:"'Syne',sans-serif", fontSize:14.5, fontWeight:800, marginBottom:6 }}>🚀 Launch Your Tech Career</h5>
                <p style={{ fontSize:12, opacity:.85, marginBottom:14 }}>GeeksforGeeks Bootcamp – Job Guarantee for 2026 Batch</p>
                <a href="#" style={{ background:C.gold, color:"#000", padding:"8px 18px", borderRadius:7, fontWeight:700, fontSize:13, display:"inline-block" }}>Join Now →</a>
              </div>

              <SidebarWidget title="⚡ Quick Job Categories">
                {QUICK_CATS.map(([l,c]) => <QuickLink key={l} label={l} count={c} />)}
              </SidebarWidget>

              {/* Top Companies */}
              <SidebarWidget title="🏢 Top Hiring Companies">
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  {COMPANIES.map(c => (
                    <div key={c.name} className="co-item" style={{ display:"flex", alignItems:"center", gap:9, padding:9, borderRadius:8, border:`1px solid ${C.border}`, cursor:"pointer", transition:"border-color .2s" }}>
                      <div style={{ width:33, height:33, borderRadius:7, background:c.bg, color:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>{c.l}</div>
                      <div><strong style={{ fontSize:12.5, display:"block" }}>{c.name}</strong><span style={{ fontSize:11.5, color:C.muted }}>{c.roles}</span></div>
                    </div>
                  ))}
                </div>
              </SidebarWidget>

              {/* WhatsApp Ad */}
              <div style={{ background:"linear-gradient(160deg,#1a1a2e,#16213e)", color:"#fff", borderRadius:12, padding:18, textAlign:"center", marginBottom:14 }}>
                <span style={{ fontSize:9.5, color:"rgba(255,255,255,.35)", display:"block", marginBottom:7 }}>Advertisement</span>
                <div style={{ fontSize:34, marginBottom:5 }}>📱</div>
                <h6 style={{ fontFamily:"'Syne',sans-serif", fontSize:13.5, fontWeight:800, marginBottom:5, color:"#fff" }}>Get Job Alerts on WhatsApp</h6>
                <p style={{ fontSize:11.5, opacity:.75, marginBottom:12 }}>Join 5 Lakh+ freshers getting daily updates</p>
                <a href="#" style={{ background:"linear-gradient(90deg,#e8472a,#f5a623)", color:"#fff", padding:"7px 16px", borderRadius:7, fontWeight:700, fontSize:12.5, display:"inline-block" }}>Join Free Group →</a>
              </div>

              <SidebarWidget title="📍 Jobs by Location">
                {LOCATIONS.map(([l,c]) => <QuickLink key={l} label={l} count={c} />)}
              </SidebarWidget>
            </div>
          )}

          {/* Tablet sidebar (condensed, single column) */}
          {isTablet && (
            <div style={{ width:240, flexShrink:0 }}>
              <SidebarWidget title="⚡ Quick Categories">
                {QUICK_CATS.slice(0,6).map(([l,c]) => <QuickLink key={l} label={l} count={c} />)}
              </SidebarWidget>
              <div style={{ background:"linear-gradient(135deg,#0f4c81,#1565c0)", color:"#fff", borderRadius:12, padding:16, textAlign:"center", marginBottom:14 }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginBottom:6 }}>Advertisement</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13.5, marginBottom:5 }}>🚀 Launch Your Career</div>
                <p style={{ fontSize:11, opacity:.85, marginBottom:10 }}>GFG Bootcamp – Job Guarantee 2026</p>
                <a href="#" style={{ background:C.gold, color:"#000", padding:"7px 14px", borderRadius:7, fontWeight:700, fontSize:12, display:"inline-block" }}>Join Now →</a>
              </div>
              <SidebarWidget title="📍 By Location">
                {LOCATIONS.slice(0,5).map(([l,c]) => <QuickLink key={l} label={l} count={c} />)}
              </SidebarWidget>
            </div>
          )}

        </div>
      </div>

      {/* ── BOTTOM AD ── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding: isMobile ? "0 12px 16px" : "0 16px 20px" }}>
        <AdStrip icon="💰" title="Earn While You Learn — Referral Bonus up to ₹5,000" sub="Refer a friend to CodeTechniques Premium & earn per referral" btn="Learn More →" btnColor={C.green} bg="linear-gradient(90deg,#f0fff4,#e8f5e9)" border="1.5px dashed #86efac" />
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#0d1b2a", color:"#c8d6e5", padding: isMobile ? "32px 0 14px" : "48px 0 20px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: isMobile ? "0 14px" : "0 16px" }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 24 : 28, marginBottom:28 }}>
            {/* Brand */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
                <img src={LOGO} alt="CodeTechniques" style={{ height:34, width:34, borderRadius:8 }} />
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"#fff" }}>Code<span style={{ color:C.accent }}>Techniques</span></span>
              </div>
              <p style={{ fontSize:12, opacity:.7, lineHeight:1.7, marginBottom:16 }}>India's most trusted job portal for freshers & recent graduates. 100% verified job postings updated daily.</p>
              <div style={{ display:"flex", maxWidth:300 }}>
                <input type="email" placeholder="Email for job alerts" style={{ flex:1, background:"#1a2e44", border:"1px solid #2a3f5a", color:"#fff", fontSize:12, borderRadius:"7px 0 0 7px", padding:"9px 11px", outline:"none" }} />
                <button style={{ background:C.accent, color:"#fff", border:"none", padding:"9px 13px", borderRadius:"0 7px 7px 0", fontWeight:600, fontSize:12, cursor:"pointer" }}>Subscribe</button>
              </div>
              <div style={{ display:"flex", gap:7, marginTop:12 }}>
                {["f","𝕏","in","▶","W"].map((s,i) => (
                  <a key={i} href="#" style={{ width:32, height:32, borderRadius:7, background:"#1a2e44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:"#8a9bb5" }}>{s}</a>
                ))}
              </div>
            </div>
            {/* Links */}
            {!isMobile && (
              <>
                <div>
                  <h6 style={{ fontFamily:"'Syne',sans-serif", fontSize:12.5, fontWeight:700, color:"#fff", marginBottom:12 }}>Fresher Jobs</h6>
                  {["2026 Batch Jobs","2025 Batch Jobs","Software/IT Jobs","Government Jobs","MBA/BBA Jobs","Non-Engineering","Walk-in Jobs"].map(l => (
                    <a key={l} href="#" style={{ display:"block", fontSize:12, color:"#8a9bb5", marginBottom:7 }}>{l}</a>
                  ))}
                </div>
                <div>
                  <h6 style={{ fontFamily:"'Syne',sans-serif", fontSize:12.5, fontWeight:700, color:"#fff", marginBottom:12 }}>Resources</h6>
                  {["Interview Questions","Resume Tips","Hiring Process Guide","Off Campus Alerts","Salary Guide 2026","Course Reviews"].map(l => (
                    <a key={l} href="#" style={{ display:"block", fontSize:12, color:"#8a9bb5", marginBottom:7 }}>{l}</a>
                  ))}
                </div>
                <div>
                  <h6 style={{ fontFamily:"'Syne',sans-serif", fontSize:12.5, fontWeight:700, color:"#fff", marginBottom:12 }}>Company</h6>
                  {["About Us","Contact Us","Advertise With Us","Privacy Policy","Disclaimer","Sitemap"].map(l => (
                    <a key={l} href="#" style={{ display:"block", fontSize:12, color:"#8a9bb5", marginBottom:7 }}>{l}</a>
                  ))}
                </div>
              </>
            )}
            {/* Mobile: compact footer links */}
            {isMobile && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <h6 style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:"#fff", marginBottom:10 }}>Jobs</h6>
                  {["2026 Batch","2025 Batch","Software/IT","Govt Jobs","Internships"].map(l => <a key={l} href="#" style={{ display:"block", fontSize:12, color:"#8a9bb5", marginBottom:6 }}>{l}</a>)}
                </div>
                <div>
                  <h6 style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:"#fff", marginBottom:10 }}>Company</h6>
                  {["About Us","Contact","Privacy Policy","Disclaimer","Advertise"].map(l => <a key={l} href="#" style={{ display:"block", fontSize:12, color:"#8a9bb5", marginBottom:6 }}>{l}</a>)}
                </div>
              </div>
            )}
          </div>
          <div style={{ borderTop:"1px solid #1e3047", paddingTop:14, display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:8 }}>
            <p style={{ fontSize:11.5, opacity:.5 }}>© 2026 CodeTechniques India. All rights reserved.</p>
            <div style={{ display:"flex", gap:14 }}>
              {["Privacy","Terms","Cookies"].map(l => <a key={l} href="#" style={{ fontSize:11.5, color:"#8a9bb5" }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}