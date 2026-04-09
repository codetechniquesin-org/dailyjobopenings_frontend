import { useState, useEffect } from "react";
import AdminNavbar from "../components/adminnavbar";
import API_BASE_URL from "../../config/api";

// ─── Shared Design Tokens (matches App.jsx) ───────────────────────────────────
const S = {
  primary: "#0f4c81", accent: "#e8472a", gold: "#f5a623",
  light: "#f4f7fb", green: "#16a34a", text: "#1a1a2e",
  muted: "#6b7280", border: "#e2e8f0",
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const IT_TITLES = [
  "Software Engineer","Frontend Developer","Backend Developer","Full Stack Developer",
  "React Native Developer","DevOps Engineer","Cloud Architect","Site Reliability Engineer",
  "Data Scientist","Data Analyst","Data Engineer","ML Engineer","AI Researcher",
  "Cybersecurity Analyst","QA Engineer","Product Manager","UI/UX Designer",
  "System Administrator","Network Engineer","Database Administrator","Blockchain Developer",
];
const NON_IT_TITLES = {
  Finance:["Financial Analyst","Accountant","Auditor","Investment Banker","Risk Manager"],
  Healthcare:["Doctor","Nurse","Pharmacist","Lab Technician","Hospital Administrator"],
  Education:["Teacher","Professor","Academic Coordinator","Curriculum Designer","Tutor"],
  Marketing:["Marketing Manager","SEO Specialist","Content Writer","Social Media Manager"],
  Legal:["Lawyer","Legal Advisor","Compliance Officer","Paralegal","Contract Manager"],
  Engineering:["Mechanical Engineer","Civil Engineer","Electrical Engineer","Chemical Engineer"],
  HR:["HR Manager","Talent Acquisition Specialist","Payroll Manager","Recruiter"],
  Sales:["Sales Executive","Business Development Manager","Account Manager"],
  Operations:["Operations Manager","Supply Chain Manager","Logistics Coordinator"],
};
const GOVT_TITLES = [
  "IAS Officer","IPS Officer","Bank PO","Bank Clerk","SSC CGL Officer",
  "Railway TC","Defence Officer (Army)","Police Constable","Sub-Inspector",
  "Government Teacher","Government Doctor","Income Tax Officer",
];
const JOB_ROLES = {
  IT:["Engineering","Design","Product","Data & AI","DevOps & Infra","Security","QA","Management"],
  NON_IT:["Finance","Healthcare","Education","Marketing","Legal","Engineering","HR","Sales","Operations"],
  GOVT:["Civil Services","Defence","Police","Banking","Railways","Teaching","Healthcare","Judiciary"],
};
const WORK_MODES = ["Full Time","Part Time","Remote","Work From Home","Hybrid","Contract","Freelance","Internship"];
const EXPERIENCE = [
  "Fresher (0–1 yr)","Junior (1–3 yrs)","Mid-Level (3–5 yrs)",
  "Senior (5–8 yrs)","Lead (8–12 yrs)","Manager (5+ yrs)","Director / VP","C-Level",
];
const LOCATIONS = [
  "Hyderabad","Bengaluru","Mumbai","Delhi / NCR","Chennai","Pune",
  "Kolkata","Ahmedabad","Jaipur","Lucknow","Kochi","Remote / Pan-India","Multiple Locations",
];
const SALARY = [
  "0–2 LPA","2–4 LPA","4–6 LPA","6–8 LPA","8–12 LPA",
  "12–18 LPA","18–25 LPA","25–40 LPA","40–60 LPA","60+ LPA","Unpaid / Stipend",
];
const BATCHES = ["2026","2025","2024","2023","2022","Any Batch"];
const EDUCATION = ["B.Tech / B.E","BCA","B.Sc","MCA","M.Tech","MBA","Any Graduate","Any Post Graduate"];
const BADGES = ["featured","hot","new","remote"];

// ─── Reusable Field Components ────────────────────────────────────────────────
const inputCls = `
  width:100%; padding:10px 14px; font-size:13.5px; border:1.5px solid #e2e8f0;
  border-radius:9px; outline:none; background:#fafafa; color:#1a1a2e;
  transition:border-color .15s; box-sizing:border-box; font-family:inherit;
`;
const Field = ({ label, required, hint, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase",
      letterSpacing:".06em", color:S.muted, marginBottom:5 }}>
      {label}{required && <span style={{ color:S.accent, marginLeft:3 }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize:11, color:"#9ca3af", margin:"3px 0 0" }}>{hint}</p>}
  </div>
);
const ErrMsg = ({ msg }) => msg
  ? <p style={{ color:S.accent, fontSize:11, margin:"3px 0 0" }}>{msg}</p> : null;

const SectionHead = ({ title, icon }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, margin:"28px 0 18px",
    paddingBottom:10, borderBottom:`1px dashed ${S.border}` }}>
    <span style={{ fontSize:16 }}>{icon}</span>
    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:800,
      color:S.primary, textTransform:"uppercase", letterSpacing:".1em", margin:0 }}>{title}</h3>
  </div>
);

// ─── TAB CONFIG ───────────────────────────────────────────────────────────────
const TABS = [
  { key:"post",   label:"Post a Job",   icon:"✏️",  color:"#0f4c81", soft:"#e8f4fd" },
  { key:"update", label:"Update Job",   icon:"🔄",  color:"#16a34a", soft:"#f0fdf4" },
  { key:"delete", label:"Delete Job",   icon:"🗑️",  color:"#e8472a", soft:"#fee2e2" },
  { key:"close",  label:"Close a Job",  icon:"🔒",  color:"#f59e0b", soft:"#fff8e1" },
];

// ─── POST JOB FORM ────────────────────────────────────────────────────────────
function PostJobForm() {
  const blank = {
    companyLogo:"", companyName:"", companyWebsite:"", companyCareersLink:"",
    aboutCompany:"", jobTitle:"", jobRole:"", jobDescription:"", jobType:"IT",
    jobCategory:"", experienceLevel:"", eligibleBatches:"", salary:"",
    location:"", workMode:[], jobLink:"", expiryDate:"", education:"",
    department:"", openings:"", skills:"", tags:"", perks:"",
    responsibilities:"", qualifications:"", badge:"", badgeLabel:"",
  };
  const [f, setF] = useState(blank);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggleWM = (wm) => set("workMode", f.workMode.includes(wm) ? f.workMode.filter(x=>x!==wm) : [...f.workMode, wm]);

  const getTitles = () => {
    if (f.jobType === "IT")   return IT_TITLES;
    if (f.jobType === "GOVT") return GOVT_TITLES;
    if (f.jobType === "NON_IT" && f.jobCategory) return NON_IT_TITLES[f.jobCategory] || [];
    return [];
  };

  const validate = () => {
    const e = {};
    if (!f.companyName.trim()) e.companyName = "Required";
    if (!f.jobTitle)           e.jobTitle    = "Required";
    if (!f.jobRole)            e.jobRole     = "Required";
    if (!f.location)           e.location    = "Required";
    if (!f.experienceLevel)    e.experienceLevel = "Required";
    if (!f.eligibleBatches)    e.eligibleBatches = "Required";
    if (f.workMode.length===0) e.workMode    = "Select at least one";
    if (f.jobType==="NON_IT" && !f.jobCategory) e.jobCategory = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    setApiError("");
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      const payload = {
        ...f,
        workMode: f.workMode.join(", "),
        skills: f.skills ? f.skills.split(",").map(s=>s.trim()).filter(Boolean) : [],
        tags: f.tags ? f.tags.split(",").map(s=>s.trim()).filter(Boolean) : [],
        perks: f.perks ? f.perks.split(",").map(s=>s.trim()).filter(Boolean) : [],
        responsibilities: f.responsibilities ? f.responsibilities.split("\n").filter(Boolean) : [],
        qualifications: f.qualifications ? f.qualifications.split("\n").filter(Boolean) : [],
        jobCategory: f.jobCategory || f.jobType,
        openings: f.openings ? Number(f.openings) : undefined,
        badge: f.badge || null,
        badgeLabel: f.badgeLabel || null,
      };
      const res = await fetch(`${API_BASE_URL}/api/post-job`, {
        method:"POST",
        headers:{ "Content-Type":"application/json",
          Authorization:`Bearer ${JSON.parse(localStorage.getItem("adminInfo"))?.token}` },
        body: JSON.stringify(payload),
      });
      // console.log("token", JSON.parse(localStorage.getItem("adminInfo"))?.token);
      const data = await res.json();
      if (data.success) { setPosted(true); setF(blank); }
      else setApiError(data.message || "Something went wrong.");
    } catch { setApiError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const inp = (err) => ({ style:{ ...Object.fromEntries(inputCls.split(";").map(x=>x.trim().split(":")).filter(x=>x.length===2).map(([k,v])=>[k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v.trim()])), border: err ? `1.5px solid ${S.accent}` : "1.5px solid #e2e8f0" } });
  const selStyle = (err) => ({ width:"100%", padding:"10px 14px", fontSize:13.5, borderRadius:9,
    border: err ? `1.5px solid ${S.accent}` : "1.5px solid #e2e8f0",
    background:"#fafafa", color:"#1a1a2e", outline:"none", fontFamily:"inherit",
    appearance:"none", boxSizing:"border-box", cursor:"pointer" });

  if (posted) return (
    <div style={{ textAlign:"center", padding:"48px 24px" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🎉</div>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:S.primary, marginBottom:8 }}>Job Posted Successfully!</h3>
      <p style={{ color:S.muted, fontSize:14, marginBottom:24 }}>Your job listing is under review and will go live within 24 hours.</p>
      <button onClick={()=>setPosted(false)} style={{ background:S.primary, color:"#fff", border:"none",
        padding:"11px 28px", borderRadius:9, fontWeight:700, fontSize:14, cursor:"pointer" }}>
        Post Another Job →
      </button>
    </div>
  );

  return (
    <div>
      {/* Company Info */}
      <SectionHead title="Company Info" icon="🏢" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16 }}>
        <Field label="Company Name" required>
          <input value={f.companyName} onChange={e=>set("companyName",e.target.value)}
            placeholder="e.g. Acme Corp" style={{ width:"100%", padding:"10px 14px", fontSize:13.5,
              border: errors.companyName?`1.5px solid ${S.accent}`:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
          <ErrMsg msg={errors.companyName} />
        </Field>
        <Field label="Company Logo URL" hint="Cloudinary or direct image URL">
          <input value={f.companyLogo} onChange={e=>set("companyLogo",e.target.value)}
            placeholder="https://..." style={{ width:"100%", padding:"10px 14px", fontSize:13.5,
              border:"1.5px solid #e2e8f0", borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
        <Field label="Company Website">
          <input value={f.companyWebsite} onChange={e=>set("companyWebsite",e.target.value)}
            placeholder="https://company.com" style={{ width:"100%", padding:"10px 14px", fontSize:13.5,
              border:"1.5px solid #e2e8f0", borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
        <Field label="Careers Page Link">
          <input value={f.companyCareersLink} onChange={e=>set("companyCareersLink",e.target.value)}
            placeholder="https://company.com/careers" style={{ width:"100%", padding:"10px 14px", fontSize:13.5,
              border:"1.5px solid #e2e8f0", borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
      </div>
      <Field label="About Company">
        <textarea value={f.aboutCompany} onChange={e=>set("aboutCompany",e.target.value)}
          rows={3} placeholder="Brief company description..."
          style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
            borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit",
            boxSizing:"border-box", resize:"vertical" }} />
      </Field>

      {/* Job Details */}
      <SectionHead title="Job Details" icon="💼" />
      <Field label="Job Type" required>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[["IT","IT / Tech"],["NON_IT","Non-IT"],["GOVT","Government"]].map(([val,lbl])=>(
            <button key={val} onClick={()=>{ set("jobType",val); set("jobTitle",""); set("jobRole",""); set("jobCategory",""); }}
              style={{ padding:"8px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                border: f.jobType===val?`1.5px solid ${S.primary}`:"1.5px solid #e2e8f0",
                background: f.jobType===val?S.primary:"#fff",
                color: f.jobType===val?"#fff":S.muted, fontFamily:"inherit", transition:"all .15s" }}>
              {lbl}
            </button>
          ))}
        </div>
      </Field>
      {f.jobType==="NON_IT" && (
        <Field label="Industry Category" required>
          <select value={f.jobCategory} onChange={e=>{ set("jobCategory",e.target.value); set("jobTitle",""); }}
            style={selStyle(errors.jobCategory)}>
            <option value="">Select Industry...</option>
            {Object.keys(NON_IT_TITLES).map(i=><option key={i} value={i}>{i}</option>)}
          </select>
          <ErrMsg msg={errors.jobCategory} />
        </Field>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
        <Field label="Job Title" required>
          <select value={f.jobTitle} onChange={e=>set("jobTitle",e.target.value)} style={selStyle(errors.jobTitle)}
            disabled={f.jobType==="NON_IT" && !f.jobCategory}>
            <option value="">Select Job Title...</option>
            {getTitles().map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <ErrMsg msg={errors.jobTitle} />
        </Field>
        <Field label="Job Role / Department" required>
          <select value={f.jobRole} onChange={e=>set("jobRole",e.target.value)} style={selStyle(errors.jobRole)}>
            <option value="">Select Role...</option>
            {(JOB_ROLES[f.jobType]||[]).map(r=><option key={r} value={r}>{r}</option>)}
          </select>
          <ErrMsg msg={errors.jobRole} />
        </Field>
        <Field label="Experience Level" required>
          <select value={f.experienceLevel} onChange={e=>set("experienceLevel",e.target.value)} style={selStyle(errors.experienceLevel)}>
            <option value="">Select Level...</option>
            {EXPERIENCE.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
          <ErrMsg msg={errors.experienceLevel} />
        </Field>
        <Field label="Eligible Batches" required>
          <select value={f.eligibleBatches} onChange={e=>set("eligibleBatches",e.target.value)} style={selStyle(errors.eligibleBatches)}>
            <option value="">Select Batch...</option>
            {BATCHES.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
          <ErrMsg msg={errors.eligibleBatches} />
        </Field>
        <Field label="Education">
          <select value={f.education} onChange={e=>set("education",e.target.value)} style={selStyle(false)}>
            <option value="">Select Education...</option>
            {EDUCATION.map(e=><option key={e} value={e}>{e}</option>)}
          </select>
        </Field>
        <Field label="Department">
          <input value={f.department} onChange={e=>set("department",e.target.value)}
            placeholder="e.g. Engineering, Finance"
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
      </div>
      <Field label="Job Description">
        <textarea value={f.jobDescription} onChange={e=>set("jobDescription",e.target.value)}
          rows={4} placeholder="Describe roles, responsibilities, required skills..."
          style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
            borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit",
            boxSizing:"border-box", resize:"vertical" }} />
      </Field>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
        <Field label="Responsibilities" hint="One per line">
          <textarea value={f.responsibilities} onChange={e=>set("responsibilities",e.target.value)}
            rows={3} placeholder="Build scalable APIs&#10;Review code..."
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit",
              boxSizing:"border-box", resize:"vertical" }} />
        </Field>
        <Field label="Qualifications" hint="One per line">
          <textarea value={f.qualifications} onChange={e=>set("qualifications",e.target.value)}
            rows={3} placeholder="B.Tech in CS&#10;3+ years experience..."
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit",
              boxSizing:"border-box", resize:"vertical" }} />
        </Field>
      </div>

      {/* Compensation */}
      <SectionHead title="Work & Compensation" icon="💰" />
      <Field label="Work Mode" required>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
          {WORK_MODES.map(wm=>(
            <button key={wm} onClick={()=>toggleWM(wm)}
              style={{ padding:"6px 14px", borderRadius:20, fontSize:12.5, cursor:"pointer",
                border: f.workMode.includes(wm)?`1.5px solid ${S.primary}`:"1.5px solid #e2e8f0",
                background: f.workMode.includes(wm)?S.primary:"#fff",
                color: f.workMode.includes(wm)?"#fff":S.muted, fontFamily:"inherit", transition:"all .15s" }}>
              {wm}
            </button>
          ))}
        </div>
        <ErrMsg msg={errors.workMode} />
      </Field>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
        <Field label="Salary">
          <select value={f.salary} onChange={e=>set("salary",e.target.value)} style={selStyle(false)}>
            <option value="">Select Range...</option>
            {SALARY.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Location" required>
          <select value={f.location} onChange={e=>set("location",e.target.value)} style={selStyle(errors.location)}>
            <option value="">Select Location...</option>
            {LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
          <ErrMsg msg={errors.location} />
        </Field>
        <Field label="Openings">
          <input type="number" value={f.openings} onChange={e=>set("openings",e.target.value)}
            placeholder="e.g. 5" min={1}
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
        <Field label="Expiry Date">
          <input type="date" value={f.expiryDate} onChange={e=>set("expiryDate",e.target.value)}
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
        <Field label="Skills" hint="Comma-separated: React, Node.js, SQL">
          <input value={f.skills} onChange={e=>set("skills",e.target.value)}
            placeholder="React, Node.js, Python..."
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
        <Field label="Tags" hint="Comma-separated: fresher, urgent">
          <input value={f.tags} onChange={e=>set("tags",e.target.value)}
            placeholder="fresher, urgent, mass-hiring..."
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
        <Field label="Perks" hint="Comma-separated: WFH, free lunch">
          <input value={f.perks} onChange={e=>set("perks",e.target.value)}
            placeholder="Health insurance, WFH, stock options..."
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
      </div>

      {/* Links & Badge */}
      <SectionHead title="Links & Badge" icon="🔗" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16 }}>
        <Field label="Job Link" hint="Direct application URL">
          <input value={f.jobLink} onChange={e=>set("jobLink",e.target.value)}
            placeholder="https://apply.company.com/job-id"
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
        <Field label="Badge">
          <select value={f.badge} onChange={e=>set("badge",e.target.value)} style={selStyle(false)}>
            <option value="">No Badge</option>
            {BADGES.map(b=><option key={b} value={b}>{b.charAt(0).toUpperCase()+b.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Badge Label" hint="Custom text on badge e.g. 'Urgent Hiring'">
          <input value={f.badgeLabel} onChange={e=>set("badgeLabel",e.target.value)}
            placeholder="e.g. Urgent Hiring, Top Company"
            style={{ width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
              borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" }} />
        </Field>
      </div>

      {apiError && <p style={{ color:S.accent, fontSize:13, textAlign:"center", margin:"12px 0" }}>{apiError}</p>}
      {Object.keys(errors).length > 0 && (
        <p style={{ color:S.accent, fontSize:12, textAlign:"center", margin:"8px 0" }}>Please fill all required fields *</p>
      )}
      <button onClick={handleSubmit} disabled={loading}
        style={{ width:"100%", padding:"13px", borderRadius:10, fontSize:15, fontWeight:800,
          fontFamily:"'Syne',sans-serif", cursor: loading?"not-allowed":"pointer", border:"none",
          background: loading?`linear-gradient(135deg,#6b7280,#9ca3af)`:`linear-gradient(135deg,${S.primary},#1565c0)`,
          color:"#fff", marginTop:8, transition:"all .2s", letterSpacing:".02em",
          boxShadow: loading?"none":"0 4px 16px rgba(15,76,129,.25)" }}>
        {loading ? "Posting…" : "Post Job Opening →"}
      </button>
    </div>
  );
}

// ─── UPDATE JOB ───────────────────────────────────────────────────────────────
function UpdateJobForm() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm]   = useState({});
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState("");

  const authHeader = () => ({
    "Content-Type":"application/json",
    Authorization:`Bearer ${JSON.parse(localStorage.getItem("adminInfo"))?.token}`,
  });

  const searchJobs = async () => {
    if (!query.trim()) return;
    setSearching(true); setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs?search=${encodeURIComponent(query)}&limit=10`, { headers: authHeader() });
      const data = await res.json();
      setJobs(data.data || data.jobs || []);
    } catch { setError("Failed to fetch jobs."); }
    finally { setSearching(false); }
  };

  const selectJob = (job) => {
    setSelected(job);
    setForm({
      companyName: job.companyName||"", jobTitle: job.jobTitle||"",
      jobRole: job.jobRole||"", location: job.location||"",
      salary: job.salary||"", experienceLevel: job.experienceLevel||"",
      workMode: job.workMode||"", jobDescription: job.jobDescription||"",
      eligibleBatches: job.eligibleBatches||"", expiryDate: job.expiryDate?.split("T")[0]||"",
      jobLink: job.jobLink||"", badge: job.badge||"", badgeLabel: job.badgeLabel||"",
      skills: Array.isArray(job.skills)?job.skills.join(", "):(job.skills||""),
      tags: Array.isArray(job.tags)?job.tags.join(", "):(job.tags||""),
    });
    setJobs([]); setSuccess(false);
  };

  const handleUpdate = async () => {
    setLoading(true); setError("");
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(",").map(s=>s.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(",").map(s=>s.trim()).filter(Boolean) : [],
      };
      const res = await fetch(`${API_BASE_URL}/api/jobs/${selected._id}`, {
        method:"PUT", headers: authHeader(), body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.message || "Update failed.");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  const iStyle = { width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
    borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" };

  return (
    <div>
      {/* Search bar */}
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <input value={query} onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&searchJobs()}
          placeholder="Search by job title or company name..."
          style={{ ...iStyle, flex:1 }} />
        <button onClick={searchJobs} disabled={searching}
          style={{ padding:"10px 22px", background:S.green, color:"#fff", border:"none",
            borderRadius:9, fontWeight:700, fontSize:13.5, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit" }}>
          {searching ? "…" : "Search"}
        </button>
      </div>

      {/* Results list */}
      {jobs.length > 0 && (
        <div style={{ border:`1px solid ${S.border}`, borderRadius:10, overflow:"hidden", marginBottom:20 }}>
          {jobs.map((j,i)=>(
            <div key={j._id} onClick={()=>selectJob(j)}
              style={{ padding:"12px 16px", cursor:"pointer", borderBottom: i<jobs.length-1?`1px solid ${S.border}`:"none",
                background: selected?._id===j._id?"#e8f4fd":"#fff", transition:"background .15s",
                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <strong style={{ fontSize:13.5, color:S.text }}>{j.jobTitle}</strong>
                <span style={{ fontSize:12, color:S.muted, marginLeft:10 }}>{j.companyName}</span>
              </div>
              <span style={{ fontSize:11, background: j.status==="active"?"#f0fdf4":"#fff8e1",
                color: j.status==="active"?S.green:S.gold, padding:"2px 9px", borderRadius:20, fontWeight:600 }}>
                {j.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit form */}
      {selected && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20,
            background:"#e8f4fd", borderRadius:10, padding:"12px 16px" }}>
            <span style={{ fontSize:20 }}>✏️</span>
            <div>
              <strong style={{ fontSize:14, color:S.primary }}>{selected.jobTitle}</strong>
              <span style={{ fontSize:12, color:S.muted, marginLeft:8 }}>@ {selected.companyName}</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
            {[
              ["companyName","Company Name","text"],["jobTitle","Job Title","text"],
              ["jobRole","Job Role","text"],["location","Location","text"],
              ["salary","Salary","text"],["experienceLevel","Experience","text"],
              ["workMode","Work Mode","text"],["eligibleBatches","Eligible Batches","text"],
              ["expiryDate","Expiry Date","date"],["jobLink","Job Link","url"],
              ["badge","Badge","text"],["badgeLabel","Badge Label","text"],
              ["skills","Skills (comma-separated)","text"],["tags","Tags (comma-separated)","text"],
            ].map(([key,label,type])=>(
              <Field key={key} label={label}>
                <input type={type} value={form[key]||""} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                  style={iStyle} />
              </Field>
            ))}
          </div>
          <Field label="Job Description">
            <textarea value={form.jobDescription||""} onChange={e=>setForm(p=>({...p,jobDescription:e.target.value}))}
              rows={4} style={{ ...iStyle, resize:"vertical" }} />
          </Field>
          {success && <p style={{ color:S.green, fontSize:13, textAlign:"center", marginBottom:8 }}>✅ Job updated successfully!</p>}
          {error && <p style={{ color:S.accent, fontSize:13, textAlign:"center", marginBottom:8 }}>{error}</p>}
          <button onClick={handleUpdate} disabled={loading}
            style={{ width:"100%", padding:"13px", borderRadius:10, fontSize:15, fontWeight:800,
              fontFamily:"'Syne',sans-serif", cursor:"pointer", border:"none",
              background:`linear-gradient(135deg,${S.green},#15803d)`,
              color:"#fff", marginTop:8, boxShadow:"0 4px 16px rgba(22,163,74,.25)" }}>
            {loading ? "Updating…" : "Save Changes →"}
          </button>
        </div>
      )}
      {error && !selected && <p style={{ color:S.accent, fontSize:13 }}>{error}</p>}
    </div>
  );
}

// ─── DELETE JOB ───────────────────────────────────────────────────────────────
function DeleteJobForm() {
  const [query, setQuery]     = useState("");
  const [jobs, setJobs]       = useState([]);
  const [searching, setSearching] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  const authHeader = () => ({
    "Content-Type":"application/json",
    Authorization:`Bearer ${JSON.parse(localStorage.getItem("adminInfo"))?.token}`,
  });

  const searchJobs = async () => {
    if (!query.trim()) return;
    setSearching(true); setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs?search=${encodeURIComponent(query)}&limit=10`, { headers: authHeader() });
      const data = await res.json();
      setJobs(data.data || data.jobs || []);
    } catch { setError("Failed to fetch jobs."); }
    finally { setSearching(false); }
  };

  const handleDelete = async (job) => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${job._id}`, {
        method:"DELETE", headers: authHeader(),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setSuccess(`"${job.jobTitle}" deleted successfully.`);
        setJobs(prev => prev.filter(j=>j._id!==job._id));
        setConfirm(null);
      } else setError(data.message || "Delete failed.");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  const iStyle = { width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
    borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" };

  return (
    <div>
      <div style={{ background:"#fee2e2", border:`1px solid #fca5a5`, borderRadius:10,
        padding:"12px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"center" }}>
        <span style={{ fontSize:18 }}>⚠️</span>
        <p style={{ fontSize:13, color:"#b91c1c", margin:0, fontWeight:500 }}>
          This action is permanent and cannot be undone. Please confirm before deleting.
        </p>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <input value={query} onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&searchJobs()}
          placeholder="Search job to delete..."
          style={{ ...iStyle, flex:1 }} />
        <button onClick={searchJobs} disabled={searching}
          style={{ padding:"10px 22px", background:S.accent, color:"#fff", border:"none",
            borderRadius:9, fontWeight:700, fontSize:13.5, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit" }}>
          {searching ? "…" : "Search"}
        </button>
      </div>

      {success && (
        <div style={{ background:"#f0fdf4", border:`1px solid #bbf7d0`, borderRadius:9,
          padding:"12px 16px", marginBottom:16, fontSize:13, color:S.green, fontWeight:500 }}>
          ✅ {success}
        </div>
      )}

      {jobs.map((j,i)=>(
        <div key={j._id} style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:10,
          padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"center",
          justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:0 }}>
            <strong style={{ fontSize:14, color:S.text, display:"block" }}>{j.jobTitle}</strong>
            <span style={{ fontSize:12, color:S.muted }}>{j.companyName} · {j.location}</span>
          </div>
          <span style={{ fontSize:11, background:"#fee2e2", color:"#b91c1c",
            padding:"2px 9px", borderRadius:20, fontWeight:600, flexShrink:0 }}>
            {j.status}
          </span>
          {confirm?._id===j._id ? (
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:12, color:"#b91c1c", fontWeight:600 }}>Confirm delete?</span>
              <button onClick={()=>handleDelete(j)} disabled={loading}
                style={{ background:S.accent, color:"#fff", border:"none", borderRadius:7,
                  padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                {loading ? "…" : "Yes, Delete"}
              </button>
              <button onClick={()=>setConfirm(null)}
                style={{ background:"#f3f4f6", color:S.muted, border:"none", borderRadius:7,
                  padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={()=>setConfirm(j)}
              style={{ background:"#fee2e2", color:"#b91c1c", border:`1px solid #fca5a5`,
                borderRadius:7, padding:"7px 16px", fontSize:12.5, fontWeight:700,
                cursor:"pointer", fontFamily:"inherit" }}>
              🗑️ Delete
            </button>
          )}
        </div>
      ))}
      {error && <p style={{ color:S.accent, fontSize:13 }}>{error}</p>}
    </div>
  );
}

// ─── CLOSE JOB ────────────────────────────────────────────────────────────────
function CloseJobForm() {
  const [query, setQuery]     = useState("");
  const [jobs, setJobs]       = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  const authHeader = () => ({
    "Content-Type":"application/json",
    Authorization:`Bearer ${JSON.parse(localStorage.getItem("adminInfo"))?.token}`,
  });

  const searchJobs = async () => {
    if (!query.trim()) return;
    setSearching(true); setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs?search=${encodeURIComponent(query)}&limit=10`, { headers: authHeader() });
      const data = await res.json();
      setJobs(data.data || data.jobs || []);
    } catch { setError("Failed to fetch jobs."); }
    finally { setSearching(false); }
  };

  const handleClose = async (job) => {
    setLoading(job._id); setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${job._id}`, {
        method:"PUT", headers: authHeader(),
        body: JSON.stringify({ status:"closed" }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setSuccess(`"${job.jobTitle}" closed successfully.`);
        setJobs(prev => prev.map(j => j._id===job._id ? {...j, status:"closed"} : j));
      } else setError(data.message || "Failed to close.");
    } catch { setError("Network error."); }
    finally { setLoading(null); }
  };

  const iStyle = { width:"100%", padding:"10px 14px", fontSize:13.5, border:"1.5px solid #e2e8f0",
    borderRadius:9, outline:"none", background:"#fafafa", color:S.text, fontFamily:"inherit", boxSizing:"border-box" };

  return (
    <div>
      <div style={{ background:"#fff8e1", border:`1px solid #fde68a`, borderRadius:10,
        padding:"12px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"center" }}>
        <span style={{ fontSize:18 }}>ℹ️</span>
        <p style={{ fontSize:13, color:"#92400e", margin:0, fontWeight:500 }}>
          Closing a job sets its status to <strong>closed</strong> — it will no longer accept applications but remains in the system.
        </p>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <input value={query} onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&searchJobs()}
          placeholder="Search job to close..."
          style={{ ...iStyle, flex:1 }} />
        <button onClick={searchJobs} disabled={searching}
          style={{ padding:"10px 22px", background:S.gold, color:"#fff", border:"none",
            borderRadius:9, fontWeight:700, fontSize:13.5, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit" }}>
          {searching ? "…" : "Search"}
        </button>
      </div>

      {success && (
        <div style={{ background:"#f0fdf4", border:`1px solid #bbf7d0`, borderRadius:9,
          padding:"12px 16px", marginBottom:16, fontSize:13, color:S.green, fontWeight:500 }}>
          ✅ {success}
        </div>
      )}

      {jobs.map(j=>(
        <div key={j._id} style={{ background:"#fff", border:`1px solid ${S.border}`, borderRadius:10,
          padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"center",
          justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:0 }}>
            <strong style={{ fontSize:14, color:S.text, display:"block" }}>{j.jobTitle}</strong>
            <span style={{ fontSize:12, color:S.muted }}>{j.companyName} · {j.location}</span>
          </div>
          <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, fontWeight:600, flexShrink:0,
            background: j.status==="active"?"#f0fdf4":j.status==="closed"?"#fff8e1":"#f3f4f6",
            color: j.status==="active"?S.green:j.status==="closed"?S.gold:S.muted }}>
            {j.status}
          </span>
          <button onClick={()=>handleClose(j)} disabled={loading===j._id || j.status==="closed"}
            style={{ background: j.status==="closed"?"#f3f4f6":"#fff8e1",
              color: j.status==="closed"?S.muted:"#92400e",
              border:`1px solid ${j.status==="closed"?"#e5e7eb":"#fde68a"}`,
              borderRadius:7, padding:"7px 16px", fontSize:12.5, fontWeight:700,
              cursor: j.status==="closed"?"not-allowed":"pointer", fontFamily:"inherit" }}>
            {loading===j._id ? "Closing…" : j.status==="closed" ? "Already Closed" : "🔒 Close Job"}
          </button>
        </div>
      ))}
      {error && <p style={{ color:S.accent, fontSize:13 }}>{error}</p>}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ManageJobs() {
  const [activeTab, setActiveTab] = useState("post");
  const admin = JSON.parse(localStorage.getItem("adminInfo"));

  const activeTabData = TABS.find(t => t.key === activeTab);

  return (
    <div style={{ width:"100%", minHeight:"100vh", background:S.light,
      fontFamily:"'DM Sans',sans-serif", color:S.text, overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { width:100% !important; margin:0 !important; padding:0 !important; overflow-x:hidden !important; background:#f4f7fb !important; }
        #root { width:100% !important; overflow-x:hidden !important; }
        .section-full  { width:100%; }
        .section-inner { width:100%; padding:0 clamp(16px,4vw,40px); box-sizing:border-box; }
        input:focus, select:focus, textarea:focus { border-color:${S.primary} !important; box-shadow:0 0 0 3px rgba(15,76,129,.08) !important; }
        .tab-btn { cursor:pointer; border:none; font-family:inherit; transition:all .2s; }
        @media (max-width:600px) {
          .tabs-row { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* Navbar */}
      <div className="section-full">
        <AdminNavbar />
      </div>

      {/* Hero */}
      <div className="section-full" style={{ background:`linear-gradient(135deg,${S.primary} 0%,#1565c0 60%,#0d47a1 100%)`,
        color:"#fff", padding:"clamp(24px,4vw,40px) 0" }}>
        <div className="section-inner">
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.2rem,3vw,1.8rem)",
            fontWeight:800, marginBottom:6 }}>
            Manage Jobs
          </h1>
          <p style={{ fontSize:13.5, opacity:.85 }}>
            Post, update, delete or close job listings · Logged in as{" "}
            <span style={{ background:"rgba(255,255,255,.15)", padding:"2px 10px",
              borderRadius:20, fontSize:12, fontWeight:600 }}>{admin?.email}</span>
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="section-full" style={{ background:"#fff", borderBottom:`1px solid ${S.border}`,
        boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
        <div className="section-inner" style={{ paddingTop:0, paddingBottom:0 }}>
          <div className="tabs-row" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0 }}>
            {TABS.map(tab=>(
              <button key={tab.key} className="tab-btn"
                onClick={()=>setActiveTab(tab.key)}
                style={{ padding:"clamp(12px,2vw,18px) clamp(8px,1.5vw,16px)",
                  background: activeTab===tab.key ? tab.soft : "transparent",
                  color: activeTab===tab.key ? tab.color : S.muted,
                  borderBottom: activeTab===tab.key ? `3px solid ${tab.color}` : "3px solid transparent",
                  fontWeight: activeTab===tab.key ? 700 : 500,
                  fontSize:"clamp(12px,1.5vw,14px)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  gap:"clamp(4px,1vw,8px)", whiteSpace:"nowrap" }}>
                <span style={{ fontSize:"clamp(14px,2vw,18px)" }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-full">
        <div className="section-inner" style={{ paddingTop:"clamp(20px,3vw,32px)", paddingBottom:48 }}>

          {/* Section label */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
            <div style={{ width:4, height:20, background:activeTabData?.color, borderRadius:3 }} />
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800,
              color:S.text, margin:0 }}>{activeTabData?.label}</h2>
          </div>

          {/* Form card */}
          <div style={{ background:"#fff", borderRadius:14, border:`1px solid ${S.border}`,
            padding:"clamp(20px,3vw,36px)", boxShadow:"0 2px 16px rgba(15,76,129,.06)" }}>
            {activeTab === "post"   && <PostJobForm />}
            {activeTab === "update" && <UpdateJobForm />}
            {activeTab === "delete" && <DeleteJobForm />}
            {activeTab === "close"  && <CloseJobForm />}
          </div>

        </div>
      </div>
    </div>
  );
}