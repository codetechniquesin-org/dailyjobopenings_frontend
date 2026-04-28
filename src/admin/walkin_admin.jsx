import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./components/adminnavbar";
import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/api/walkin`;

// ─── Shared Design Tokens (matches Manage Jobs) ───────────────────────────────────
const S = {
  primary: "#0f4c81", accent: "#e8472a", gold: "#f5a623",
  light: "#f4f7fb", green: "#16a34a", text: "#1a1a2e",
  muted: "#6b7280", border: "#e2e8f0", purple: "#7c3aed"
};

const inputCls = {
  width: "100%", padding: "10px 14px", fontSize: "13.5px", border: "1px solid #ddd",
  borderRadius: "8px", outline: "none", background: "#fafafa", color: S.text,
  fontFamily: "inherit", boxSizing: "border-box", transition: "all 0.2s"
};

const Field = ({ label, required, hint, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: S.muted, marginBottom: 6 }}>
      {label}{required && <span style={{ color: S.accent, marginLeft: 3 }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize: 11, color: "#9ca3af", margin: "3px 0 0" }}>{hint}</p>}
  </div>
);

const SectionHead = ({ title, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "28px 0 18px", paddingBottom: 10, borderBottom: `1px dashed ${S.border}` }}>
    <span style={{ fontSize: 16 }}>{icon}</span>
    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, color: S.primary, textTransform: "uppercase", letterSpacing: ".1em", margin: 0 }}>{title}</h3>
  </div>
);

const TABS = [
  { key: "post", label: "Post Walk-In", icon: "✏️", color: "#0f4c81", soft: "#e8f4fd" },
  { key: "manage", label: "Manage/Delete", icon: "📋", color: "#e8472a", soft: "#fee2e2" },
];

export default function WalkInAdmin() {
  const [activeTab, setActiveTab] = useState("post");
  const [walkins, setWalkins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const admin = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  const initialFormState = {
    companyName: "", companyLogo: "", companyWebsite: "",
    jobTitle: "", location: "", salary: "", workMode: "Walk-In", experienceLevel: "", eligibleBatches: "",
    walkInDate: "", venue: "", contactDetails: "",
    description: "", eligibility: "", skills: "",
    applyLink: "",
    isHot: false, isVerified: false
  };

  const [formData, setFormData] = useState(initialFormState);

  const getConfig = () => ({
    headers: { Authorization: `Bearer ${admin?.token || ""}` }
  });

  const fetchWalkins = async () => {
    try {
      const res = await axios.get(API_URL, getConfig());
      setWalkins(res.data?.jobs || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch walk-ins');
    }
  };

  useEffect(() => {
    fetchWalkins();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        skills: typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : formData.skills
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload, getConfig());
        toast.success("Walk-In Job Updated successfully!");
      } else {
        await axios.post(API_URL, payload, getConfig());
        toast.success("Walk-In Job Posted successfully!");
      }
      
      setFormData(initialFormState);
      setEditingId(null);
      fetchWalkins();
      setActiveTab('manage');
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setFormData({
      companyName: job.companyName || "", companyLogo: job.companyLogo || "", companyWebsite: job.companyWebsite || "",
      jobTitle: job.jobTitle || "", location: job.location || "", salary: job.salary || "",
      workMode: job.workMode || "Walk-In", experienceLevel: job.experienceLevel || "", eligibleBatches: job.eligibleBatches || "",
      walkInDate: job.walkInDate ? job.walkInDate.split('T')[0] : "", venue: job.venue || "", contactDetails: job.contactDetails || "",
      description: job.description || "", eligibility: job.eligibility || "", skills: job.skills ? job.skills.join(', ') : "",
      applyLink: job.applyLink || "",
      isHot: job.isHot || false, isVerified: job.isVerified || false
    });
    setActiveTab('post');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Walk-In Job?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, getConfig());
      toast.success("Job deleted successfully");
      setWalkins(prev => prev.filter(job => job._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job");
    }
  };

  const activeTabData = TABS.find(t => t.key === activeTab);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: S.light, fontFamily: "'DM Sans',sans-serif", color: S.text, overflowX: "hidden" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { width:100% !important; margin:0 !important; padding:0 !important; overflow-x:hidden !important; background:#f4f7fb !important; }
        #root { width:100% !important; overflow-x:hidden !important; }
        .section-full  { width:100%; }
        .section-inner { max-width: 1200px; margin: auto; padding: 0 20px; box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: ${S.primary} !important; box-shadow: 0 0 0 3px rgba(15,76,129,.08) !important; }
        .tab-btn { cursor: pointer; border: none; font-family: inherit; transition: all .2s; }
        
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
        
        .admin-table th { background: #f8fafc; padding: 14px 16px; font-weight: 600; font-size: 13px; color: ${S.muted}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid ${S.border}; }
        .admin-table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid ${S.border}; vertical-align: middle; }
        .admin-table tr:hover td { background: #f8fafc; }
        .admin-table tr:last-child td { border-bottom: none; }
      `}</style>

      {/* Navbar */}
      <div className="section-full">
        <AdminNavbar />
      </div>

      {/* Hero Header */}
      <div className="section-full" style={{ background: `linear-gradient(135deg,${S.primary} 0%,#1565c0 60%,#0d47a1 100%)`, color: "#fff", padding: "40px 0" }}>
        <div className="section-inner">
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: 6 }}>
            Manage Walk-In Jobs
          </h1>
          <p style={{ fontSize: 13.5, opacity: .85 }}>
            Post, update, and manage walk-in drives · Logged in as{" "}
            <span style={{ background: "rgba(255,255,255,.15)", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{admin?.email || "Admin"}</span>
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="section-full" style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
        <div className="section-inner" style={{ padding: 0 }}>
          <div style={{ display: "flex" }}>
            {TABS.map(tab => (
              <button key={tab.key} className="tab-btn" onClick={() => { setActiveTab(tab.key); if (tab.key === 'post' && !editingId) setFormData(initialFormState); }}
                style={{
                  flex: 1, maxWidth: 300, padding: "16px",
                  background: activeTab === tab.key ? tab.soft : "transparent",
                  color: activeTab === tab.key ? tab.color : S.muted,
                  borderBottom: activeTab === tab.key ? `3px solid ${tab.color}` : "3px solid transparent",
                  fontWeight: activeTab === tab.key ? 700 : 500, fontSize: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}>
                <span style={{ fontSize: "18px" }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-full">
        <div className="section-inner" style={{ paddingTop: "32px", paddingBottom: 60 }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 4, height: 20, background: activeTabData?.color, borderRadius: 3 }} />
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: S.text, margin: 0 }}>
              {activeTabData?.label}
            </h2>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, padding: "30px", boxShadow: "0 2px 16px rgba(15,76,129,.06)" }}>
            
            {activeTab === "post" && (
              <form onSubmit={handleSubmit}>
                {/* SECTION 1: Company Info */}
                <SectionHead title="Company Info" icon="🏢" />
                <div className="form-grid">
                  <Field label="Company Name" required>
                    <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. TCS" required style={inputCls} />
                  </Field>
                  <Field label="Company Logo" hint="Direct image URL">
                    <input name="companyLogo" value={formData.companyLogo} onChange={handleChange} placeholder="https://..." style={inputCls} />
                  </Field>
                  <Field label="Company Website">
                    <input name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="https://..." style={inputCls} />
                  </Field>
                </div>

                {/* SECTION 2: Job Details */}
                <SectionHead title="Job Details" icon="💼" />
                <div className="form-grid">
                  <Field label="Job Title" required>
                    <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. Software Engineer" required style={inputCls} />
                  </Field>
                  <Field label="Location" required>
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bangalore" required style={inputCls} />
                  </Field>
                  <Field label="Salary">
                    <input name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. 4.5 LPA" style={inputCls} />
                  </Field>
                  <Field label="Work Mode">
                    <select name="workMode" value={formData.workMode} onChange={handleChange} style={inputCls}>
                      <option value="Walk-In">Walk-In</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </Field>
                  <Field label="Experience Level">
                    <input name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} placeholder="e.g. 0-2 Years" style={inputCls} />
                  </Field>
                  <Field label="Eligible Batches">
                    <input name="eligibleBatches" value={formData.eligibleBatches} onChange={handleChange} placeholder="e.g. 2024 / 2025" style={inputCls} />
                  </Field>
                </div>

                {/* SECTION 3: Walk-In Details */}
                <SectionHead title="Walk-In Details" icon="🚶" />
                <div className="form-grid">
                  <Field label="Walk-In Date" required>
                    <input type="date" name="walkInDate" value={formData.walkInDate} onChange={handleChange} required style={inputCls} />
                  </Field>
                  <Field label="Venue">
                    <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Full address" style={inputCls} />
                  </Field>
                  <Field label="Contact Details">
                    <input name="contactDetails" value={formData.contactDetails} onChange={handleChange} placeholder="Email or Phone" style={inputCls} />
                  </Field>
                  <Field label="Apply Link" required hint="External application URL (starts with http)">
                    <input name="applyLink" type="url" value={formData.applyLink} onChange={handleChange} placeholder="https://company.com/apply" required style={inputCls} />
                  </Field>
                </div>

                {/* SECTION 4: Description */}
                <SectionHead title="Description & Requirements" icon="📝" />
                <Field label="Skills" hint="Comma-separated (e.g. React, Node.js, SQL)">
                  <input name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js" style={inputCls} />
                </Field>
                <div className="form-grid">
                  <Field label="Job Description">
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe roles and responsibilities..." style={{ ...inputCls, resize: "vertical" }} />
                  </Field>
                  <Field label="Eligibility Criteria">
                    <textarea name="eligibility" value={formData.eligibility} onChange={handleChange} rows={4} placeholder="Required degrees, marks..." style={{ ...inputCls, resize: "vertical" }} />
                  </Field>
                </div>

                {/* SECTION 5: Toggles */}
                <SectionHead title="Visibility & Badges" icon="✨" />
                <div style={{ display: "flex", gap: 32, marginBottom: 24 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                    <div style={{ position: "relative", width: 44, height: 24, background: formData.isHot ? S.accent : S.border, borderRadius: 20, transition: "0.3s" }}>
                      <div style={{ position: "absolute", top: 2, left: formData.isHot ? 22 : 2, width: 20, height: 20, background: "#fff", borderRadius: "50%", transition: "0.3s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                    </div>
                    <input type="checkbox" name="isHot" checked={formData.isHot} onChange={handleChange} style={{ display: "none" }} />
                    🔥 Hot Job
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                    <div style={{ position: "relative", width: 44, height: 24, background: formData.isVerified ? S.green : S.border, borderRadius: 20, transition: "0.3s" }}>
                      <div style={{ position: "absolute", top: 2, left: formData.isVerified ? 22 : 2, width: 20, height: 20, background: "#fff", borderRadius: "50%", transition: "0.3s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                    </div>
                    <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange} style={{ display: "none" }} />
                    ✅ Verified
                  </label>
                </div>

                <button type="submit" disabled={loading}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 10, fontSize: 15, fontWeight: 800,
                    fontFamily: "'Syne',sans-serif", cursor: loading ? "not-allowed" : "pointer", border: "none",
                    background: loading ? "#9ca3af" : `linear-gradient(135deg, ${S.primary}, #1565c0)`,
                    color: "#fff", transition: "all 0.2s", boxShadow: loading ? "none" : "0 4px 16px rgba(15,76,129,.25)",
                    transform: loading ? "none" : "translateY(0)"
                  }}
                  onMouseEnter={e => { if(!loading) e.currentTarget.style.transform = "translateY(-2px)" }}
                  onMouseLeave={e => { if(!loading) e.currentTarget.style.transform = "translateY(0)" }}
                >
                  {loading ? "Saving..." : editingId ? "Update Walk-In Job →" : "Post Walk-In Job →"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setFormData(initialFormState); }}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 700, marginTop: 12,
                      fontFamily: "'Syne',sans-serif", cursor: "pointer", border: `1.5px solid ${S.border}`, background: "#fff", color: S.text
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            )}

            {activeTab === "manage" && (
              <div style={{ overflowX: "auto" }}>
                {walkins && walkins.length > 0 ? (
                  <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walkins.map(job => (
                        <tr key={job._id}>
                          <td>
                            <strong style={{ color: S.primary, display: "block" }}>{job.companyName}</strong>
                            {job.isVerified && <span style={{ fontSize: 10, color: S.green, fontWeight: 600 }}>Verified</span>}
                          </td>
                          <td style={{ fontWeight: 500 }}>{job.jobTitle}</td>
                          <td>{job.location}</td>
                          <td>{job.walkInDate ? new Date(job.walkInDate).toLocaleDateString() : 'N/A'}</td>
                          <td style={{ textAlign: "right" }}>
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                              <button onClick={() => handleEdit(job)}
                                style={{ background: "#e8f4fd", color: S.primary, border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                Edit
                              </button>
                              <button onClick={() => handleDelete(job._id)}
                                style={{ background: "#fee2e2", color: S.accent, border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: "center", padding: "48px 24px" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: S.primary, marginBottom: 8 }}>No walk-in jobs found</h3>
                    <p style={{ color: S.muted, fontSize: 14 }}>You haven't posted any walk-in drives yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
