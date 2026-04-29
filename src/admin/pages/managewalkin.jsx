import { useState, useEffect } from "react";
import AdminNavbar from "../components/adminnavbar";
import API_BASE_URL from "../../config/api";

/* ── Design tokens — identical to Dashboard & Admins ── */
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

/* ── Same token helper as Admins page ── */
const getToken = () =>
  localStorage.getItem("res.data.token") ||
  JSON.parse(localStorage.getItem("adminInfo"))?.token;

/* ── Shared input style ── */
const inp = {
  width: "100%", padding: "11px 14px", fontSize: 13.5,
  border: `1.5px solid ${S.border}`, borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif", color: S.text,
  background: S.white, outline: "none", boxSizing: "border-box",
  transition: "border-color .2s",
};

/* ── Reusable Button ── */
const Btn = ({ children, onClick, variant = "primary", disabled, style = {} }) => {
  const styles = {
    primary: { background: S.plum,  color: S.cream, border: "none" },
    ghost:   { background: "transparent", color: S.plum, border: `1.5px solid ${S.border}` },
    danger:  { background: "rgba(220,38,38,0.1)", color: "#b91c1c", border: "1.5px solid rgba(220,38,38,0.25)" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
        opacity: disabled ? 0.55 : 1, transition: "opacity .2s, transform .15s",
        letterSpacing: "0.3px",
        ...styles[variant], ...style,
      }}
    >
      {children}
    </button>
  );
};

/* ── Field label ── */
const FieldLabel = ({ children }) => (
  <label style={{
    fontSize: 10, fontWeight: 600, letterSpacing: "2px",
    textTransform: "uppercase", color: S.muted,
    display: "block", marginBottom: 8,
  }}>
    {children}
  </label>
);

/* ── Field wrapper ── */
const Field = ({ label, required, hint, children }) => (
  <div style={{ marginBottom: 18 }}>
    <FieldLabel>
      {label}{required && <span style={{ color: S.accent, marginLeft: 3 }}>*</span>}
    </FieldLabel>
    {children}
    {hint && <p style={{ fontSize: 11, color: S.creamDeep, margin: "4px 0 0" }}>{hint}</p>}
  </div>
);

/* ── Section heading ── */
const SectionHead = ({ title, icon }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    margin: "28px 0 18px", paddingBottom: 10,
    borderBottom: `1px dashed ${S.border}`,
  }}>
    <span style={{ fontSize: 16 }}>{icon}</span>
    <h3 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 16, fontWeight: 500, color: S.plum,
      letterSpacing: "0.03em", margin: 0,
    }}>{title}</h3>
  </div>
);

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(30,13,38,0.55)",
      zIndex: 200, display: "flex", alignItems: "center",
      justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: S.white, borderRadius: 18, padding: "32px 28px",
        width: "100%", maxWidth: 480, border: `1px solid ${S.border}`,
        boxShadow: "0 24px 64px rgba(61,26,71,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500, fontSize: 22, color: S.plum, margin: 0,
          }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "rgba(61,26,71,0.07)", border: "none",
            width: 30, height: 30, borderRadius: "50%", fontSize: 14,
            cursor: "pointer", color: S.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Tabs ── */
const TABS = [
  { key: "post",   label: "Post Walk-In",   icon: "✏️" },
  { key: "manage", label: "Manage / Delete", icon: "📋" },
];

const initialForm = {
  companyName: "", companyLogo: "", companyWebsite: "",
  jobTitle: "", location: "", salary: "", workMode: "Walk-In",
  experienceLevel: "", eligibleBatches: "",
  walkInDate: "", venue: "", contactDetails: "",
  description: "", eligibility: "", skills: "",
  applyLink: "",
  isHot: false, isVerified: false,
};

export default function WalkInAdmin() {
  const [activeTab,  setActiveTab]  = useState("post");
  const [walkins,    setWalkins]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [confirmId,  setConfirmId]  = useState(null);
  const [form,       setForm]       = useState(initialForm);
  const [toast,      setToast]      = useState({ msg: "", type: "ok" });

  /* ── Toast helper ── */
  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const buildPayload = () => ({
    ...form,
    skills: typeof form.skills === "string"
      ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
      : form.skills,
  });

  /* ─────────────────────────────────────────
     GET ALL  →  GET /api/walkin/get-all-walkins
  ───────────────────────────────────────────── */
  const fetchWalkins = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/walkins/get-all-walkins`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      console.log("Fetched walk-ins:", data);
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
console.log("API response:", data); // check this in console to see exact shape
setWalkins(data.walkIns || []);    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => { fetchWalkins(); }, []);

  /* ─────────────────────────────────────────
     CREATE  →  POST /api/walkin/create-walkin
  ───────────────────────────────────────────── */
  const doCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/walkins/create-walkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create");
      showToast("Walk-In posted successfully");
      setForm(initialForm);
      fetchWalkins();
      setActiveTab("manage");
    } catch (e) {
      showToast(e.message, "err");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────
     UPDATE  →  PUT /api/walkin/update-walkin/:id
  ───────────────────────────────────────────── */
  const doUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/walkins/update-walkin/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      showToast("Walk-In updated successfully");
      setForm(initialForm);
      setEditingId(null);
      fetchWalkins();
      setActiveTab("manage");
    } catch (e) {
      showToast(e.message, "err");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────
     DELETE  →  DELETE /api/walkin/delete-walkin/:id
  ───────────────────────────────────────────── */
  const doDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/walkins/delete-walkin/${confirmId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      showToast("Walk-In removed successfully");
      setConfirmId(null);
      setWalkins(prev => prev.filter(j => j._id !== confirmId));
    } catch (e) {
      showToast(e.message, "err");
      setConfirmId(null);
    }
  };

  /* ── Populate form for editing ── */
  const handleEdit = (job) => {
    setEditingId(job._id);
    setForm({
      companyName:     job.companyName     || "",
      companyLogo:     job.companyLogo     || "",
      companyWebsite:  job.companyWebsite  || "",
      jobTitle:        job.jobTitle        || "",
      location:        job.location        || "",
      salary:          job.salary          || "",
      workMode:        job.workMode        || "Walk-In",
      experienceLevel: job.experienceLevel || "",
      eligibleBatches: job.eligibleBatches || "",
      walkInDate:      job.walkInDate ? job.walkInDate.split("T")[0] : "",
      venue:           job.venue           || "",
      contactDetails:  job.contactDetails  || "",
      description:     job.description     || "",
      eligibility:     job.eligibility     || "",
      skills:          Array.isArray(job.skills) ? job.skills.join(", ") : (job.skills || ""),
      applyLink:       job.applyLink       || "",
      isHot:           job.isHot           || false,
      isVerified:      job.isVerified      || false,
    });
    setActiveTab("post");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingId ? doUpdate() : doCreate();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: S.cream, minHeight: "100vh",
      color: S.text, width: "100%", overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width:100%!important; margin:0!important; padding:0!important; overflow-x:hidden!important; background:${S.cream}!important; }
        #root { width:100%!important; overflow-x:hidden!important; }

        .section-full  { width: 100%; }
        .section-inner { width: 100%; padding: 0 clamp(16px, 4vw, 40px); box-sizing: border-box; }

        .sec-label {
          font-size: 10px; font-weight: 600; letter-spacing: 2.5px;
          text-transform: uppercase; color: ${S.muted};
          margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
        }
        .sec-label::before {
          content: ''; width: 20px; height: 1.5px;
          background: ${S.plumLight}; display: inline-block;
        }

        input:focus, select:focus, textarea:focus {
          border-color: ${S.plumLight}!important;
          box-shadow: 0 0 0 3px rgba(123,74,139,.1)!important;
        }
        select option { background: ${S.white}; color: ${S.text}; }

        .tab-btn { cursor: pointer; border: none; font-family: inherit; transition: all .2s; }

        .form-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }

        .walkin-card {
          background: ${S.white};
          border: 1px solid ${S.border};
          border-radius: 16px;
          padding: clamp(16px, 2vw, 22px);
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), border-color .25s, box-shadow .3s;
        }
        .walkin-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          background: ${S.plum};
          opacity: 0;
          transition: opacity .25s;
          border-radius: 16px 0 0 16px;
        }
        .walkin-card:hover {
          transform: translateY(-2px);
          border-color: ${S.plumLight};
          box-shadow: 0 10px 28px rgba(61,26,71,0.10);
        }
        .walkin-card:hover::before { opacity: 1; }

        .act-btn {
          font-size: 12px; font-weight: 600; padding: 8px 16px;
          border-radius: 9px; border: none; cursor: pointer;
          font-family: inherit; letter-spacing: 0.3px;
          transition: opacity .2s, transform .15s;
        }
        .act-btn:hover { opacity: 0.82; transform: translateY(-1px); }
        .act-btn.edit   { background: rgba(61,26,71,0.09);  color: ${S.plum}; }
        .act-btn.delete { background: rgba(220,38,38,0.09); color: #b91c1c; }

        .submit-btn {
          width: 100%; padding: 14px; border-radius: 10px;
          font-size: 14px; font-weight: 700; letter-spacing: 0.5px;
          font-family: 'Cormorant Garamond', serif;
          cursor: pointer; border: none;
          background: ${S.plum}; color: ${S.cream};
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(61,26,71,.2);
        }
        .submit-btn:hover:not(:disabled) {
          background: ${S.plumMid};
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(61,26,71,.3);
        }
        .submit-btn:disabled {
          background: ${S.creamDark}; color: ${S.muted};
          cursor: not-allowed; box-shadow: none;
        }
      `}</style>

      {/* ── Navbar ── */}
      <div className="section-full"><AdminNavbar /></div>

      {/* ── Toast — same pattern as Admins page ── */}
      {toast.msg && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 300,
          background: S.white, border: `1px solid ${S.border}`,
          borderLeft: `4px solid ${toast.type === "err" ? "#b91c1c" : S.plum}`,
          borderRadius: 12, padding: "13px 20px",
          fontSize: 13.5, fontWeight: 500,
          boxShadow: "0 8px 28px rgba(61,26,71,0.13)",
          color: toast.type === "err" ? "#b91c1c" : S.plum,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>{toast.type === "err" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="section-full" style={{
        background: S.plum, color: S.cream,
        padding: "clamp(28px,4vw,44px) 0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", top:-60, right:-80, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40, right:120, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.025)", pointerEvents:"none" }} />
        <div className="section-inner">
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:"2.5px", textTransform:"uppercase", color:S.creamDeep, marginBottom:10 }}>
            Admin Portal
          </p>
          <h1 style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:400,
            color:S.cream, letterSpacing:"-0.5px", lineHeight:1.1,
          }}>
            Walk-In{" "}
            <em style={{ fontStyle:"italic", fontWeight:300, color:S.creamDeep }}>Job Drives</em>
          </h1>
          <div style={{ marginTop:12 }}>
            <span style={{ fontSize:12, color:"rgba(237,226,208,0.55)" }}>
              {walkins.length} drive{walkins.length !== 1 ? "s" : ""} · post · update · manage
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="section-full" style={{
        background: S.white,
        borderBottom: `1px solid ${S.border}`,
        boxShadow: "0 2px 8px rgba(61,26,71,.06)",
      }}>
        <div className="section-inner" style={{ padding: 0 }}>
          <div style={{ display: "flex" }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                className="tab-btn"
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key === "post" && !editingId) setForm(initialForm);
                }}
                style={{
                  flex: 1, maxWidth: 300, padding: "16px",
                  background: activeTab === tab.key ? "rgba(61,26,71,0.07)" : "transparent",
                  color: activeTab === tab.key ? S.plum : S.muted,
                  borderBottom: activeTab === tab.key ? `3px solid ${S.plum}` : "3px solid transparent",
                  fontWeight: activeTab === tab.key ? 700 : 500, fontSize: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                <span style={{ fontSize: "18px" }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="section-full">
        <div className="section-inner" style={{ paddingTop: "clamp(24px,3vw,36px)", paddingBottom: 60 }}>

          {/* ═══════════ POST / EDIT TAB ═══════════ */}
          {activeTab === "post" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div className="sec-label" style={{ marginBottom: 0 }}>
                  {editingId ? "Editing Walk-In" : "New Walk-In Drive"}
                </div>
                {editingId && (
                  <button onClick={cancelEdit} style={{
                    background: "transparent", color: S.muted,
                    border: `1.5px solid ${S.border}`,
                    padding: "8px 18px", borderRadius: 9,
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    Cancel Edit
                  </button>
                )}
              </div>

              <div style={{
                background: S.white, borderRadius: 14, border: `1px solid ${S.border}`,
                padding: "clamp(20px,3vw,36px)",
                boxShadow: "0 2px 20px rgba(61,26,71,.07)",
              }}>
                <form onSubmit={handleSubmit}>

                  <SectionHead title="Company Information" icon="🏢" />
                  <div className="form-grid">
                    <Field label="Company Name" required>
                      <input name="companyName" value={form.companyName} onChange={handleChange}
                        placeholder="e.g. TCS, Infosys" required style={inp} />
                    </Field>
                    <Field label="Company Logo" hint="Direct image URL">
                      <input name="companyLogo" value={form.companyLogo} onChange={handleChange}
                        placeholder="https://..." style={inp} />
                    </Field>
                    <Field label="Company Website">
                      <input name="companyWebsite" value={form.companyWebsite} onChange={handleChange}
                        placeholder="https://..." style={inp} />
                    </Field>
                  </div>

                  <SectionHead title="Job Details" icon="💼" />
                  <div className="form-grid">
                    <Field label="Job Title" required>
                      <input name="jobTitle" value={form.jobTitle} onChange={handleChange}
                        placeholder="e.g. Software Engineer" required style={inp} />
                    </Field>
                    <Field label="Location" required>
                      <input name="location" value={form.location} onChange={handleChange}
                        placeholder="e.g. Bangalore" required style={inp} />
                    </Field>
                    <Field label="Salary / CTC">
                      <input name="salary" value={form.salary} onChange={handleChange}
                        placeholder="e.g. 4.5 LPA" style={inp} />
                    </Field>
                    <Field label="Work Mode">
                      <select name="workMode" value={form.workMode} onChange={handleChange}
                        style={{ ...inp, appearance: "none", cursor: "pointer" }}>
                        <option value="Walk-In">Walk-In</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </Field>
                    <Field label="Experience Level">
                      <input name="experienceLevel" value={form.experienceLevel} onChange={handleChange}
                        placeholder="e.g. 0–2 Years / Fresher" style={inp} />
                    </Field>
                    <Field label="Eligible Batches">
                      <input name="eligibleBatches" value={form.eligibleBatches} onChange={handleChange}
                        placeholder="e.g. 2024 / 2025" style={inp} />
                    </Field>
                  </div>

                  <SectionHead title="Walk-In Details" icon="🚶" />
                  <div className="form-grid">
                    <Field label="Walk-In Date" required>
                      <input type="date" name="walkInDate" value={form.walkInDate}
                        onChange={handleChange} required style={inp} />
                    </Field>
                    <Field label="Venue">
                      <input name="venue" value={form.venue} onChange={handleChange}
                        placeholder="Full address of venue" style={inp} />
                    </Field>
                    <Field label="Contact Details">
                      <input name="contactDetails" value={form.contactDetails} onChange={handleChange}
                        placeholder="Email or phone number" style={inp} />
                    </Field>
                    <Field label="Apply Link" required hint="Must start with https://">
                      <input name="applyLink" type="url" value={form.applyLink}
                        onChange={handleChange} placeholder="https://company.com/apply"
                        required style={inp} />
                    </Field>
                  </div>

                  <SectionHead title="Description & Requirements" icon="📝" />
                  <Field label="Skills" hint="Comma-separated — e.g. React, Node.js, SQL">
                    <input name="skills" value={form.skills} onChange={handleChange}
                      placeholder="e.g. Java, Spring Boot, MySQL" style={inp} />
                  </Field>
                  <div className="form-grid">
                    <Field label="Job Description">
                      <textarea name="description" value={form.description} onChange={handleChange}
                        rows={5} placeholder="Roles and responsibilities..."
                        style={{ ...inp, resize: "vertical" }} />
                    </Field>
                    <Field label="Eligibility Criteria">
                      <textarea name="eligibility" value={form.eligibility} onChange={handleChange}
                        rows={5} placeholder="Required degrees, percentage cutoffs..."
                        style={{ ...inp, resize: "vertical" }} />
                    </Field>
                  </div>

                  <SectionHead title="Visibility & Badges" icon="✨" />
                  <div style={{ display: "flex", gap: 32, marginBottom: 32, flexWrap: "wrap" }}>
                    {[
                      { name: "isHot",      label: "🔥 Hot Job",  onColor: S.accent },
                      { name: "isVerified", label: "✅ Verified",  onColor: S.green  },
                    ].map(toggle => (
                      <label key={toggle.name} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        cursor: "pointer", fontWeight: 600, fontSize: 14,
                        color: form[toggle.name] ? S.plum : S.muted, transition: "color .2s",
                      }}>
                        <div
                          onClick={() => setForm(prev => ({ ...prev, [toggle.name]: !prev[toggle.name] }))}
                          style={{
                            position: "relative", width: 44, height: 24,
                            background: form[toggle.name] ? toggle.onColor : S.border,
                            borderRadius: 20, transition: "background 0.3s", cursor: "pointer",
                          }}
                        >
                          <div style={{
                            position: "absolute", top: 2,
                            left: form[toggle.name] ? 22 : 2,
                            width: 20, height: 20, background: "#fff",
                            borderRadius: "50%", transition: "left 0.3s",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          }} />
                        </div>
                        <input type="checkbox" name={toggle.name} checked={form[toggle.name]}
                          onChange={handleChange} style={{ display: "none" }} />
                        {toggle.label}
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !form.companyName.trim() || !form.jobTitle.trim()}
                    className="submit-btn"
                  >
                    {loading ? "Saving…" : editingId ? "Update Walk-In Job →" : "Post Walk-In Job →"}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ═══════════ MANAGE TAB ═══════════ */}
          {activeTab === "manage" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div className="sec-label" style={{ marginBottom: 0 }}>
                  Directory · {walkins.length} drive{walkins.length !== 1 ? "s" : ""}
                </div>
                <button
                  onClick={() => { setForm(initialForm); setEditingId(null); setActiveTab("post"); }}
                  style={{
                    background: S.plum, color: S.cream, border: "none",
                    padding: "10px 22px", borderRadius: 10, fontWeight: 600,
                    fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Walk-In
                </button>
              </div>

              {walkins.length === 0 ? (
                <div style={{ textAlign: "center", padding: "70px 0", color: S.muted }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 28, fontWeight: 400, color: S.plumLight, marginBottom: 8,
                  }}>
                    No walk-in drives yet
                  </div>
                  <div style={{ fontSize: 13 }}>Post the first walk-in drive to get started.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {walkins.map(job => (
                    <div key={job._id} className="walkin-card">

                      {/* Logo / Avatar — same pattern as admin initials */}
                      <div style={{
                        width: 48, height: 48, borderRadius: 12, flexShrink: 0, overflow: "hidden",
                        background: "rgba(61,26,71,0.07)", border: `1.5px solid rgba(61,26,71,0.12)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo} alt=""
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            onError={e => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 22, fontWeight: 600, color: S.plum,
                          }}>
                            {job.companyName?.charAt(0).toUpperCase() || "?"}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: 14.5, color: S.text, marginBottom: 5 }}>
                          {job.jobTitle}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 15, fontWeight: 500, color: S.plum,
                          }}>
                            {job.companyName}
                          </span>
                          <span style={{ fontSize: 11, color: S.muted }}>·</span>
                          <span style={{ fontSize: 12, color: S.muted }}>{job.location}</span>
                          {job.walkInDate && (
                            <>
                              <span style={{ fontSize: 11, color: S.muted }}>·</span>
                              <span style={{ fontSize: 12, color: S.muted }}>
                                {new Date(job.walkInDate).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                })}
                              </span>
                            </>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                          {job.salary && (
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                              letterSpacing: "0.8px", textTransform: "uppercase",
                              background: "rgba(61,26,71,0.07)", color: S.plumMid,
                            }}>
                              {job.salary}
                            </span>
                          )}
                          {job.isHot && (
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                              letterSpacing: "0.8px", textTransform: "uppercase",
                              background: "rgba(232,71,42,0.1)", color: S.accent,
                            }}>🔥 Hot</span>
                          )}
                          {job.isVerified && (
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                              letterSpacing: "0.8px", textTransform: "uppercase",
                              background: "rgba(22,163,74,0.1)", color: S.green,
                            }}>✅ Verified</span>
                          )}
                          <span style={{ fontSize: 11, color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>
                            ···{job._id?.slice(-6)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button className="act-btn edit"   onClick={() => handleEdit(job)}>Edit</button>
                        <button className="act-btn delete" onClick={() => setConfirmId(job._id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ── Delete confirm modal — same structure as Admins page ── */}
      {confirmId && (
        <Modal title="Remove Walk-In?" onClose={() => setConfirmId(null)}>
          <p style={{ fontSize: 13.5, color: S.muted, marginBottom: 28, lineHeight: 1.8 }}>
            This action cannot be undone. The walk-in drive will be permanently removed.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn onClick={() => setConfirmId(null)} variant="ghost">Cancel</Btn>
            <Btn onClick={doDelete} variant="danger">Yes, Remove</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}