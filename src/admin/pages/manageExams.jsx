import { useState, useEffect } from "react";
import AdminNavbar from "../components/adminnavbar";
import API_BASE_URL from "../../config/api";

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
  accent:     "#e8472a",
  green:      "#16a34a",
};

const getToken = () =>
  localStorage.getItem("res.data.token") ||
  JSON.parse(localStorage.getItem("adminInfo"))?.token;

const inp = {
  width: "100%", padding: "11px 14px", fontSize: 14,
  border: `1.5px solid ${S.border}`, borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif", color: S.text,
  background: S.white, outline: "none", boxSizing: "border-box",
  transition: "border-color .2s",
};

const EXAM_TYPES = ["Government","Engineering","Banking","Railway","Defence","Teaching","Medical","Law","Management","SSC","UPSC","State PSC","Entrance","Private","Other"];
const CATEGORIES = ["Notification","Admit Card","Result","Answer Key","Syllabus","Counselling","Scholarship","Recruitment"];
const EXAM_MODES = ["Online","Offline","Hybrid"];

const initialForm = {
  title: "", shortTitle: "", organization: "", examType: "", category: "Notification",
  description: "", overview: "", eligibility: "", applicationFee: "", ageLimit: "",
  examMode: "", location: "",
  applicationStartDate: "", applicationEndDate: "", examDate: "", resultDate: "",
  officialWebsite: "", applyUrl: "", image: "",
  qualification: "", tags: "",
  isActive: true, isFeatured: false,
};

/* ── Sub-components ── */
const Btn = ({ children, onClick, variant = "primary", disabled, style = {} }) => {
  const vs = {
    primary: { background: S.plum,  color: S.cream, border: "none" },
    ghost:   { background: "transparent", color: S.plum, border: `1.5px solid ${S.border}` },
    danger:  { background: "rgba(220,38,38,0.1)", color: "#b91c1c", border: "1.5px solid rgba(220,38,38,0.25)" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 13.5,
      cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
      opacity: disabled ? 0.55 : 1, transition: "opacity .2s, transform .15s",
      letterSpacing: "0.3px", ...vs[variant], ...style,
    }}>{children}</button>
  );
};

const FieldLabel = ({ children, required }) => (
  <label style={{
    fontSize: 11, fontWeight: 600, letterSpacing: "1.8px",
    textTransform: "uppercase", color: S.muted, display: "block", marginBottom: 7,
  }}>
    {children}{required && <span style={{ color: S.accent, marginLeft: 3 }}>*</span>}
  </label>
);

const Field = ({ label, required, hint, children, span }) => (
  <div style={{ marginBottom: 18, gridColumn: span ? "1 / -1" : undefined }}>
    <FieldLabel required={required}>{label}</FieldLabel>
    {children}
    {hint && <p style={{ fontSize: 11.5, color: S.creamDeep, margin: "4px 0 0" }}>{hint}</p>}
  </div>
);

const SectionHead = ({ title, icon }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    margin: "32px 0 20px", paddingBottom: 12,
    borderBottom: `1px dashed ${S.border}`,
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: "rgba(61,26,71,0.08)", border: "1px solid rgba(61,26,71,0.12)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
    }}>{icon}</div>
    <h3 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 18, fontWeight: 500, color: S.plum, margin: 0,
    }}>{title}</h3>
  </div>
);

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(30,13,38,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:S.white, borderRadius:18, padding:"32px 28px", width:"100%", maxWidth:460, border:`1px solid ${S.border}`, boxShadow:"0 24px 64px rgba(61,26,71,0.18)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:22, color:S.plum, margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"rgba(61,26,71,0.07)", border:"none", width:30, height:30, borderRadius:"50%", fontSize:14, cursor:"pointer", color:S.muted, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Category & Type badge colors ── */
const categoryColor = {
  "Notification":  { bg:"rgba(61,26,71,0.09)",   color:S.plum    },
  "Admit Card":    { bg:"rgba(90,43,110,0.09)",   color:S.plumMid },
  "Result":        { bg:"rgba(22,163,74,0.1)",    color:"#15803d" },
  "Answer Key":    { bg:"rgba(234,179,8,0.12)",   color:"#a16207" },
  "Syllabus":      { bg:"rgba(59,130,246,0.1)",   color:"#1d4ed8" },
  "Counselling":   { bg:"rgba(168,85,247,0.1)",   color:"#7e22ce" },
  "Scholarship":   { bg:"rgba(20,184,166,0.1)",   color:"#0f766e" },
  "Recruitment":   { bg:"rgba(232,71,42,0.1)",    color:S.accent  },
};

const TABS = [
  { key:"post",   label:"Post Exam",     icon:"✏️" },
  { key:"manage", label:"Manage / Delete", icon:"📋" },
];

export default function ManageExams() {
  const [activeTab,  setActiveTab]  = useState("post");
  const [exams,      setExams]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [confirmId,  setConfirmId]  = useState(null);
  const [form,       setForm]       = useState(initialForm);
  const [toast,      setToast]      = useState({ msg:"", type:"ok" });
  const [search,     setSearch]     = useState("");
  const [filterType, setFilterType] = useState("All");

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"ok" }), 3500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const buildPayload = () => ({
    ...form,
    qualification: typeof form.qualification === "string"
      ? form.qualification.split(",").map(s => s.trim()).filter(Boolean) : form.qualification,
    tags: typeof form.tags === "string"
      ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : form.tags,
    applicationStartDate: form.applicationStartDate || undefined,
    applicationEndDate:   form.applicationEndDate   || undefined,
    examDate:             form.examDate             || undefined,
    resultDate:           form.resultDate           || undefined,
  });

  /* ── GET ALL  →  GET /api/exams/get-all-exams ── */
  const fetchExams = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/exams/get-all-exams`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setExams(data.exams || data || []);
    } catch (e) { console.error(e.message); }
  };

  useEffect(() => { fetchExams(); }, []);

  /* ── CREATE  →  POST /api/exams/create-an-exam ── */
  const doCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/exams/create-an-exam`, {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create");
      showToast("Exam posted successfully");
      setForm(initialForm);
      fetchExams();
      setActiveTab("manage");
    } catch (e) { showToast(e.message, "err"); }
    finally { setLoading(false); }
  };

  /* ── UPDATE  →  PUT /api/exams/update-exam/:id ── */
  const doUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/exams/update-exam/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      showToast("Exam updated successfully");
      setForm(initialForm); setEditingId(null);
      fetchExams(); setActiveTab("manage");
    } catch (e) { showToast(e.message, "err"); }
    finally { setLoading(false); }
  };

  /* ── DELETE  →  DELETE /api/exams/delete-exam/:id ── */
  const doDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/exams/delete-exam/${confirmId}`, {
        method: "DELETE",
        headers: { Authorization:`Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      showToast("Exam removed successfully");
      setConfirmId(null);
      setExams(prev => prev.filter(e => e._id !== confirmId));
    } catch (e) { showToast(e.message, "err"); setConfirmId(null); }
  };

  const handleEdit = (exam) => {
    setEditingId(exam._id);
    setForm({
      title:                exam.title                || "",
      shortTitle:           exam.shortTitle           || "",
      organization:         exam.organization         || "",
      examType:             exam.examType             || "",
      category:             exam.category             || "Notification",
      description:          exam.description          || "",
      overview:             exam.overview             || "",
      eligibility:          exam.eligibility          || "",
      applicationFee:       exam.applicationFee       || "",
      ageLimit:             exam.ageLimit             || "",
      examMode:             exam.examMode             || "",
      location:             exam.location             || "",
      applicationStartDate: exam.applicationStartDate ? exam.applicationStartDate.split("T")[0] : "",
      applicationEndDate:   exam.applicationEndDate   ? exam.applicationEndDate.split("T")[0]   : "",
      examDate:             exam.examDate             ? exam.examDate.split("T")[0]             : "",
      resultDate:           exam.resultDate           ? exam.resultDate.split("T")[0]           : "",
      officialWebsite:      exam.officialWebsite      || "",
      applyUrl:             exam.applyUrl             || "",
      image:                exam.image                || "",
      qualification:        Array.isArray(exam.qualification) ? exam.qualification.join(", ") : (exam.qualification || ""),
      tags:                 Array.isArray(exam.tags)          ? exam.tags.join(", ")          : (exam.tags          || ""),
      isActive:             exam.isActive   ?? true,
      isFeatured:           exam.isFeatured ?? false,
    });
    setActiveTab("post");
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleSubmit = (e) => { e.preventDefault(); editingId ? doUpdate() : doCreate(); };
  const cancelEdit   = () => { setEditingId(null); setForm(initialForm); };

  const filteredExams = exams.filter(e => {
    const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.organization?.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === "All" || e.examType === filterType;
    return matchSearch && matchType;
  });

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:S.cream, minHeight:"100vh", color:S.text, width:"100%", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { width:100%!important; margin:0!important; padding:0!important; overflow-x:hidden!important; background:${S.cream}!important; }
        #root { width:100%!important; overflow-x:hidden!important; }

        .s-full  { width:100%; }
        .s-inner { width:100%; padding:0 clamp(16px,4vw,40px); box-sizing:border-box; }

        .sec-label {
          font-size:11px; font-weight:600; letter-spacing:2.5px;
          text-transform:uppercase; color:${S.muted};
          display:flex; align-items:center; gap:10px; margin-bottom:16px;
        }
        .sec-label::before { content:''; width:20px; height:1.5px; background:${S.plumLight}; display:inline-block; }

        input:focus, select:focus, textarea:focus {
          border-color:${S.plumLight}!important;
          box-shadow:0 0 0 3px rgba(123,74,139,.1)!important;
        }
        select option { background:${S.white}; color:${S.text}; }

        .tab-btn { cursor:pointer; border:none; font-family:inherit; transition:all .2s; }

        /* 3-col form grid */
        .form-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .form-grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        @media (max-width:900px) { .form-grid-3 { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:600px) { .form-grid-3, .form-grid-2 { grid-template-columns:1fr; } }

        /* exam card */
        .exam-card {
          background:${S.white}; border:1px solid ${S.border}; border-radius:16px;
          padding:clamp(16px,2vw,22px); position:relative; overflow:hidden;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1), border-color .25s, box-shadow .3s;
        }
        .exam-card::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
          background:${S.plum}; opacity:0; transition:opacity .25s;
          border-radius:16px 0 0 16px;
        }
        .exam-card:hover { transform:translateY(-2px); border-color:${S.plumLight}; box-shadow:0 10px 28px rgba(61,26,71,0.10); }
        .exam-card:hover::before { opacity:1; }

        .act-btn { font-size:12.5px; font-weight:600; padding:8px 16px; border-radius:9px; border:none; cursor:pointer; font-family:inherit; letter-spacing:0.3px; transition:opacity .2s, transform .15s; }
        .act-btn:hover { opacity:0.82; transform:translateY(-1px); }
        .act-btn.edit   { background:rgba(61,26,71,0.09);  color:${S.plum}; }
        .act-btn.delete { background:rgba(220,38,38,0.09); color:#b91c1c; }

        .submit-btn {
          width:100%; padding:15px; border-radius:10px; font-size:15px; font-weight:700;
          letter-spacing:0.5px; font-family:'Cormorant Garamond',serif;
          cursor:pointer; border:none; background:${S.plum}; color:${S.cream};
          transition:all 0.25s; box-shadow:0 4px 20px rgba(61,26,71,.2);
        }
        .submit-btn:hover:not(:disabled) { background:${S.plumMid}; transform:translateY(-2px); box-shadow:0 8px 28px rgba(61,26,71,.3); }
        .submit-btn:disabled { background:${S.creamDark}; color:${S.muted}; cursor:not-allowed; box-shadow:none; }

        .search-bar { padding:10px 16px; font-size:14px; border:1.5px solid ${S.border}; border-radius:10px; background:${S.white}; color:${S.text}; font-family:inherit; outline:none; width:100%; max-width:320px; }
        .search-bar:focus { border-color:${S.plumLight}; box-shadow:0 0 0 3px rgba(123,74,139,.1); }
        .filter-select { padding:10px 14px; font-size:13px; border:1.5px solid ${S.border}; border-radius:10px; background:${S.white}; color:${S.text}; font-family:inherit; outline:none; cursor:pointer; appearance:none; }
        .filter-select:focus { border-color:${S.plumLight}; }

        .pill { font-size:10.5px; font-weight:600; padding:3px 10px; border-radius:20px; white-space:nowrap; letter-spacing:0.5px; text-transform:uppercase; }

        /* date grid in card */
        .date-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-top:12px; }
        @media (max-width:480px) { .date-grid { grid-template-columns:1fr; } }
      `}</style>

      <div className="s-full"><AdminNavbar /></div>

      {/* ── Toast ── */}
      {toast.msg && (
        <div style={{
          position:"fixed", top:24, right:24, zIndex:300,
          background:S.white, border:`1px solid ${S.border}`,
          borderLeft:`4px solid ${toast.type==="err"?"#b91c1c":S.plum}`,
          borderRadius:12, padding:"13px 20px", fontSize:14, fontWeight:500,
          boxShadow:"0 8px 28px rgba(61,26,71,0.13)",
          color:toast.type==="err"?"#b91c1c":S.plum,
          display:"flex", alignItems:"center", gap:10, maxWidth:360,
        }}>
          <span style={{ fontSize:16 }}>{toast.type==="err"?"✕":"✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Hero ── */}
      <div className="s-full" style={{ background:S.plum, color:S.cream, padding:"clamp(28px,4vw,44px) 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-80, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40, right:120, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.025)", pointerEvents:"none" }} />
        <div className="s-inner">
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:"2.5px", textTransform:"uppercase", color:S.creamDeep, marginBottom:10 }}>Admin Portal</p>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:400, color:S.cream, letterSpacing:"-0.5px", lineHeight:1.1 }}>
            Manage{" "}<em style={{ fontStyle:"italic", fontWeight:300, color:S.creamDeep }}>Exams & Notifications</em>
          </h1>
          <div style={{ marginTop:12 }}>
            <span style={{ fontSize:12, color:"rgba(237,226,208,0.55)" }}>
              {exams.length} exam{exams.length!==1?"s":""} · post · update · manage
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="s-full" style={{ background:S.white, borderBottom:`1px solid ${S.border}`, boxShadow:"0 2px 8px rgba(61,26,71,.06)" }}>
        <div className="s-inner" style={{ padding:0 }}>
          <div style={{ display:"flex" }}>
            {TABS.map(tab => (
              <button key={tab.key} className="tab-btn"
                onClick={() => { setActiveTab(tab.key); if(tab.key==="post"&&!editingId) setForm(initialForm); }}
                style={{
                  flex:1, maxWidth:300, padding:"16px",
                  background: activeTab===tab.key?"rgba(61,26,71,0.07)":"transparent",
                  color: activeTab===tab.key?S.plum:S.muted,
                  borderBottom: activeTab===tab.key?`3px solid ${S.plum}`:"3px solid transparent",
                  fontWeight: activeTab===tab.key?700:500, fontSize:"14px",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                }}>
                <span style={{ fontSize:"18px" }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="s-full">
        <div className="s-inner" style={{ paddingTop:"clamp(24px,3vw,36px)", paddingBottom:60 }}>

          {/* ════════════ POST TAB ════════════ */}
          {activeTab==="post" && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                <div className="sec-label" style={{ marginBottom:0 }}>{editingId?"Editing Exam":"New Exam"}</div>
                {editingId && (
                  <button onClick={cancelEdit} style={{ background:"transparent", color:S.muted, border:`1.5px solid ${S.border}`, padding:"8px 18px", borderRadius:9, fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                    Cancel Edit
                  </button>
                )}
              </div>

              <div style={{ background:S.white, borderRadius:14, border:`1px solid ${S.border}`, padding:"clamp(20px,3vw,36px)", boxShadow:"0 2px 20px rgba(61,26,71,.07)" }}>
                <form onSubmit={handleSubmit}>

                  {/* ── Section 1: Basic Info ── */}
                  <SectionHead title="Basic Information" icon="📋" />
                  <div className="form-grid-2">
                    <Field label="Exam Title" required>
                      <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. UPSC Civil Services Exam 2025" required style={inp} />
                    </Field>
                    <Field label="Short Title" hint="Abbreviated name shown on cards">
                      <input name="shortTitle" value={form.shortTitle} onChange={handleChange} placeholder="e.g. UPSC CSE 2025" style={inp} />
                    </Field>
                    <Field label="Conducting Organization" required>
                      <input name="organization" value={form.organization} onChange={handleChange} placeholder="e.g. Union Public Service Commission" required style={inp} />
                    </Field>
                    <Field label="Location / State">
                      <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. All India / Delhi" style={inp} />
                    </Field>
                  </div>

                  <div className="form-grid-3">
                    <Field label="Exam Type" required>
                      <select name="examType" value={form.examType} onChange={handleChange} required style={{ ...inp, appearance:"none", cursor:"pointer" }}>
                        <option value="">Select Type</option>
                        {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Category">
                      <select name="category" value={form.category} onChange={handleChange} style={{ ...inp, appearance:"none", cursor:"pointer" }}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Exam Mode">
                      <select name="examMode" value={form.examMode} onChange={handleChange} style={{ ...inp, appearance:"none", cursor:"pointer" }}>
                        <option value="">Select Mode</option>
                        {EXAM_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </Field>
                  </div>

                  {/* ── Section 2: Key Details ── */}
                  <SectionHead title="Key Details" icon="📌" />
                  <div className="form-grid-3">
                    <Field label="Application Fee">
                      <input name="applicationFee" value={form.applicationFee} onChange={handleChange} placeholder="e.g. ₹100 (General) / Free" style={inp} />
                    </Field>
                    <Field label="Age Limit">
                      <input name="ageLimit" value={form.ageLimit} onChange={handleChange} placeholder="e.g. 21–32 years" style={inp} />
                    </Field>
                    <Field label="Thumbnail / Image URL">
                      <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." style={inp} />
                    </Field>
                  </div>

                  {/* ── Section 3: Important Dates ── */}
                  <SectionHead title="Important Dates" icon="📅" />
                  <div className="form-grid-2">
                    <Field label="Application Start Date">
                      <input type="date" name="applicationStartDate" value={form.applicationStartDate} onChange={handleChange} style={inp} />
                    </Field>
                    <Field label="Application End Date">
                      <input type="date" name="applicationEndDate" value={form.applicationEndDate} onChange={handleChange} style={inp} />
                    </Field>
                    <Field label="Exam Date">
                      <input type="date" name="examDate" value={form.examDate} onChange={handleChange} style={inp} />
                    </Field>
                    <Field label="Result Date">
                      <input type="date" name="resultDate" value={form.resultDate} onChange={handleChange} style={inp} />
                    </Field>
                  </div>

                  {/* ── Section 4: Links ── */}
                  <SectionHead title="Links & URLs" icon="🔗" />
                  <div className="form-grid-2">
                    <Field label="Official Website">
                      <input name="officialWebsite" value={form.officialWebsite} onChange={handleChange} placeholder="https://upsc.gov.in" style={inp} />
                    </Field>
                    <Field label="Apply URL">
                      <input name="applyUrl" value={form.applyUrl} onChange={handleChange} placeholder="https://upsconline.nic.in/..." style={inp} />
                    </Field>
                  </div>

                  {/* ── Section 5: Descriptions ── */}
                  <SectionHead title="Description & Eligibility" icon="📝" />
                  <div className="form-grid-2">
                    <Field label="Short Description">
                      <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="A brief 2–3 line summary of the exam..." style={{ ...inp, resize:"vertical" }} />
                    </Field>
                    <Field label="Detailed Overview">
                      <textarea name="overview" value={form.overview} onChange={handleChange} rows={4} placeholder="Full exam overview, pattern, highlights..." style={{ ...inp, resize:"vertical" }} />
                    </Field>
                  </div>
                  <Field label="Eligibility Criteria">
                    <textarea name="eligibility" value={form.eligibility} onChange={handleChange} rows={3} placeholder="Nationality, education, marks required..." style={{ ...inp, resize:"vertical" }} />
                  </Field>

                  {/* ── Section 6: Meta ── */}
                  <SectionHead title="Classification & Tags" icon="🏷️" />
                  <div className="form-grid-2">
                    <Field label="Qualifications" hint="Comma-separated — e.g. B.Tech, MCA, BCA">
                      <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. B.Tech, MCA, Any Graduate" style={inp} />
                    </Field>
                    <Field label="Tags" hint="Comma-separated — e.g. upsc, ias, civil services">
                      <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. ssc, cgl, banking, 2025" style={inp} />
                    </Field>
                  </div>

                  {/* ── Section 7: Visibility ── */}
                  <SectionHead title="Visibility & Status" icon="✨" />
                  <div style={{ display:"flex", gap:32, marginBottom:32, flexWrap:"wrap" }}>
                    {[
                      { name:"isActive",   label:"✅ Active",   onColor:S.green  },
                      { name:"isFeatured", label:"⭐ Featured", onColor:"#d97706" },
                    ].map(toggle => (
                      <label key={toggle.name} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", fontWeight:600, fontSize:14, color:form[toggle.name]?S.plum:S.muted, transition:"color .2s" }}>
                        <div
                          onClick={() => setForm(prev => ({ ...prev, [toggle.name]: !prev[toggle.name] }))}
                          style={{ position:"relative", width:44, height:24, background:form[toggle.name]?toggle.onColor:S.border, borderRadius:20, transition:"background 0.3s", cursor:"pointer" }}
                        >
                          <div style={{ position:"absolute", top:2, left:form[toggle.name]?22:2, width:20, height:20, background:"#fff", borderRadius:"50%", transition:"left 0.3s", boxShadow:"0 2px 6px rgba(0,0,0,0.2)" }} />
                        </div>
                        <input type="checkbox" name={toggle.name} checked={form[toggle.name]} onChange={handleChange} style={{ display:"none" }} />
                        {toggle.label}
                      </label>
                    ))}
                  </div>

                  <button type="submit" disabled={loading || !form.title.trim() || !form.organization.trim() || !form.examType} className="submit-btn">
                    {loading ? "Saving…" : editingId ? "Update Exam →" : "Post Exam →"}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ════════════ MANAGE TAB ════════════ */}
          {activeTab==="manage" && (
            <>
              {/* Toolbar */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
                <div className="sec-label" style={{ marginBottom:0 }}>
                  Directory · {filteredExams.length} of {exams.length} exam{exams.length!==1?"s":""}
                </div>
                <button
                  onClick={() => { setForm(initialForm); setEditingId(null); setActiveTab("post"); }}
                  style={{ background:S.plum, color:S.cream, border:"none", padding:"10px 22px", borderRadius:10, fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.5px", display:"flex", alignItems:"center", gap:8 }}
                >
                  <span style={{ fontSize:16, lineHeight:1 }}>+</span> New Exam
                </button>
              </div>

              {/* Search + Filter */}
              <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
                <input
                  className="search-bar"
                  placeholder="🔍  Search by title or organization…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="All">All Types</option>
                  {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {filteredExams.length === 0 ? (
                <div style={{ textAlign:"center", padding:"70px 0", color:S.muted }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:400, color:S.plumLight, marginBottom:8 }}>
                    {exams.length===0 ? "No exams yet" : "No results found"}
                  </div>
                  <div style={{ fontSize:13.5 }}>
                    {exams.length===0 ? "Post your first exam to get started." : "Try adjusting your search or filter."}
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {filteredExams.map(exam => {
                    const catStyle = categoryColor[exam.category] || categoryColor["Notification"];
                    return (
                      <div key={exam._id} className="exam-card">

                        {/* Top row */}
                        <div style={{ display:"flex", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>

                          {/* Thumbnail / Initial */}
                          <div style={{ width:52, height:52, borderRadius:12, flexShrink:0, overflow:"hidden", background:"rgba(61,26,71,0.07)", border:`1.5px solid rgba(61,26,71,0.12)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            {exam.image ? (
                              <img src={exam.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => e.target.style.display="none"} />
                            ) : (
                              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:S.plum }}>
                                {exam.title?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* Main info */}
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:6 }}>
                              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:500, color:S.plum, margin:0 }}>
                                {exam.shortTitle || exam.title}
                              </h3>
                              <span className="pill" style={{ background:catStyle.bg, color:catStyle.color }}>{exam.category}</span>
                              {exam.isFeatured && <span className="pill" style={{ background:"rgba(217,119,6,0.12)", color:"#b45309" }}>⭐ Featured</span>}
                              {!exam.isActive && <span className="pill" style={{ background:"rgba(220,38,38,0.09)", color:"#b91c1c" }}>Inactive</span>}
                            </div>

                            <div style={{ fontSize:13.5, color:S.muted, marginBottom:8 }}>{exam.organization}</div>

                            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                              {exam.examType && (
                                <span className="pill" style={{ background:"rgba(61,26,71,0.07)", color:S.plumMid }}>{exam.examType}</span>
                              )}
                              {exam.examMode && (
                                <span className="pill" style={{ background:"rgba(59,130,246,0.08)", color:"#1d4ed8" }}>{exam.examMode}</span>
                              )}
                              {exam.location && (
                                <span style={{ fontSize:12, color:S.muted }}>📍 {exam.location}</span>
                              )}
                              <span style={{ fontSize:11, color:"#9ca3af", fontVariantNumeric:"tabular-nums" }}>···{exam._id?.slice(-6)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display:"flex", gap:8, flexShrink:0, alignSelf:"flex-start" }}>
                            <button className="act-btn edit"   onClick={() => handleEdit(exam)}>Edit</button>
                            <button className="act-btn delete" onClick={() => setConfirmId(exam._id)}>Remove</button>
                          </div>
                        </div>

                        {/* Date row */}
                        {(exam.applicationStartDate || exam.applicationEndDate || exam.examDate || exam.resultDate) && (
                          <div className="date-grid" style={{ borderTop:`1px dashed ${S.border}`, paddingTop:12, marginTop:12 }}>
                            {[
                              { label:"Apply Start", value:exam.applicationStartDate },
                              { label:"Apply End",   value:exam.applicationEndDate   },
                              { label:"Exam Date",   value:exam.examDate             },
                              { label:"Result",      value:exam.resultDate           },
                            ].map(d => d.value && (
                              <div key={d.label} style={{ display:"flex", flexDirection:"column", gap:2 }}>
                                <span style={{ fontSize:10, fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase", color:S.muted }}>{d.label}</span>
                                <span style={{ fontSize:13, fontWeight:500, color:S.text }}>{fmtDate(d.value)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ── Delete confirm modal ── */}
      {confirmId && (
        <Modal title="Remove Exam?" onClose={() => setConfirmId(null)}>
          <p style={{ fontSize:14, color:S.muted, marginBottom:28, lineHeight:1.8 }}>
            This action cannot be undone. The exam listing will be permanently removed.
          </p>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn onClick={() => setConfirmId(null)} variant="ghost">Cancel</Btn>
            <Btn onClick={doDelete} variant="danger">Yes, Remove</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}