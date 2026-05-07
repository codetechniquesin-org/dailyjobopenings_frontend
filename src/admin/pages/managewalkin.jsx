import { useState, useEffect } from "react";
import AdminNavbar from "../components/adminnavbar";
import API_BASE_URL from "../../config/api";
import JobExtractor from "../components/extract_job_details";

/* ── Design tokens ── */
const S = {
  cream: "#EDE2D0",
  creamDark: "#D4C4B0",
  creamDeep: "#C2AF97",
  white: "#FAF6F0",
  plum: "#3D1A47",
  plumMid: "#5A2B6E",
  plumLight: "#7B4A8B",
  text: "#1e0d26",
  muted: "#6b5778",
  border: "#D4C4B0",
  accent: "#e8472a",
  green: "#16a34a",
  primary: "#0f4c81",
};

const getToken = () =>
  localStorage.getItem("res.data.token") ||
  JSON.parse(localStorage.getItem("adminInfo"))?.token;

const inp = {
  width: "100%", padding: "11px 14px", fontSize: 13.5,
  border: `1.5px solid ${S.border}`, borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif", color: S.text,
  background: S.white, outline: "none", boxSizing: "border-box",
  transition: "border-color .2s",
};

const Btn = ({ children, onClick, variant = "primary", disabled, style = {} }) => {
  const styles = {
    primary: { background: S.plum, color: S.cream, border: "none" },
    ghost: { background: "transparent", color: S.plum, border: `1.5px solid ${S.border}` },
    danger: { background: "rgba(220,38,38,0.1)", color: "#b91c1c", border: "1.5px solid rgba(220,38,38,0.25)" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
        opacity: disabled ? 0.55 : 1, transition: "opacity .2s, transform .15s",
        letterSpacing: "0.3px", ...styles[variant], ...style,
      }}>
      {children}
    </button>
  );
};

const FieldLabel = ({ children }) => (
  <label style={{
    fontSize: 10, fontWeight: 600, letterSpacing: "2px",
    textTransform: "uppercase", color: S.muted,
    display: "block", marginBottom: 8,
  }}>{children}</label>
);

const Field = ({ label, required, hint, children }) => (
  <div style={{ marginBottom: 18 }}>
    <FieldLabel>
      {label}{required && <span style={{ color: S.accent, marginLeft: 3 }}>*</span>}
    </FieldLabel>
    {children}
    {hint && <p style={{ fontSize: 11, color: S.creamDeep, margin: "4px 0 0" }}>{hint}</p>}
  </div>
);

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

const TABS = [
  { key: "post", label: "Post Walk-In", icon: "✏️" },
  { key: "manage", label: "Manage / Delete", icon: "📋" },
];

const initialForm = {
  // Company
  companyName: "", companyLogo: "", companyWebsite: "",
  // Job
  walkintitle: "", jobTitle: "", roleCategory: "", employmentType: "",
  experience: "", batch: "", qualification: "",
  skills: "", salary: "", location: "",
  // Walk-In Details
  startDate: "", endDate: "", reportingTime: "", venue: "",
  address: "", googleMapsLink: "",
  // Desc
  description: "", responsibilities: "", eligibility: "",
  selectionProcess: "", documentsRequired: "",
  // Contact
  contactEmail: "", contactPhone: "", applyLink: "",
  // Tags / SEO
  tags: "", mode: "Walk-In",
  // Badges
  isFeatured: false, isHot: false, isVerified: false,
};

export default function WalkInAdmin() {
  const [activeTab, setActiveTab] = useState("post");
  const [walkins, setWalkins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [toast, setToast] = useState({ msg: "", type: "ok" });

  // Company autofill
  const [companyResults, setCompanyResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [companyMessage, setCompanyMessage] = useState("");

  // Auto extract
  const [extractUrl, setExtractUrl] = useState("");
  const [extractLoading, setExtractLoading] = useState(false);
  const [extractMessage, setExtractMessage] = useState("");
  const [extractMode, setExtractMode] = useState("url");
  const [extractText, setExtractText] = useState("");
  const [posted, setPosted] = useState(false);
  const [jobUrl, setJobUrl] = useState("");
  const [aiRawText, setAiRawText] = useState("");
  const [postedData, setPostedData] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  /* ── Company Search (same as PostJobForm) ── */
  const searchCompanies = async (query) => {
    if (!query.trim()) { setCompanyResults([]); return; }
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/get-companies?search=${query}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await res.json();
      if (data.success) { setCompanyResults(data.data); setShowDropdown(true); }
    } catch (err) { console.error("Search error", err); }
  };

  // /* ── Auto Extract from URL ── */
  // const handleExtractJob = async () => {
  //   if (!extractUrl.trim()) { setExtractMessage("❌ Please enter a valid URL"); return; }
  //   setExtractLoading(true);
  //   setExtractMessage("");
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/api/admin/extract-job-using-link`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
  //       body: JSON.stringify({ url: extractUrl }),
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       const d = data.data;
  //       setForm(prev => ({
  //         ...prev,
  //         walkintitle:      d.jobTitle || prev.walkintitle,
  //         jobTitle:         d.jobTitle || prev.jobTitle,
  //         companyName:      d.companyName || prev.companyName,
  //         location:         d.location || prev.location,
  //         description:      d.description || prev.description,
  //         responsibilities: Array.isArray(d.responsibilities)
  //           ? d.responsibilities.join("\n")
  //           : (d.responsibilities || prev.responsibilities),
  //         eligibility:      Array.isArray(d.qualifications)
  //           ? d.qualifications.join("\n")
  //           : (d.qualifications || prev.eligibility),
  //         experience:       d.experienceLevel || prev.experience,
  //         salary:           d.salary || prev.salary,
  //         skills:           Array.isArray(d.skills) ? d.skills.join(", ") : (d.skills || prev.skills),
  //       }));
  //       setExtractMessage("✅ Job details extracted successfully");
  //     } else {
  //       setExtractMessage("❌ " + data.message);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setExtractMessage("❌ Extraction failed");
  //   }
  //   setExtractLoading(false);
  // };

  // /* ── Auto Extract from Text ── */
  // const handleExtractText = async () => {
  //   if (!extractText.trim()) { setExtractMessage("❌ Please paste job description"); return; }
  //   setExtractLoading(true);
  //   setExtractMessage("");
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/api/admin/extract-job-using-text`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
  //       body: JSON.stringify({ text: extractText }),
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       const d = data.data;
  //       setForm(prev => ({
  //         ...prev,
  //         walkintitle:      d.jobTitle || prev.walkintitle,
  //         jobTitle:         d.jobTitle || prev.jobTitle,
  //         companyName:      d.companyName || prev.companyName,
  //         location:         d.location || prev.location,
  //         description:      d.description || prev.description,
  //         responsibilities: Array.isArray(d.responsibilities)
  //           ? d.responsibilities.join("\n")
  //           : (d.responsibilities || prev.responsibilities),
  //         eligibility:      Array.isArray(d.qualifications)
  //           ? d.qualifications.join("\n")
  //           : (d.qualifications || prev.eligibility),
  //         experience:       d.experienceLevel || prev.experience,
  //         salary:           d.salary || prev.salary,
  //         skills:           Array.isArray(d.skills) ? d.skills.join(", ") : (d.skills || prev.skills),
  //       }));
  //       setExtractMessage("✅ Text extracted successfully");
  //     } else {
  //       setExtractMessage("❌ " + data.message);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setExtractMessage("❌ Extraction failed");
  //   }
  //   setExtractLoading(false);
  // };

  const parseAIText = (text) => {
  const lines = text.split("\n");
  const data = {};
  let currentKey = null;

  lines.forEach(line => {
    const clean = line.trim();
    if (!clean) return;

    if (clean.includes("=")) {
      const [key, ...rest] = clean.split("=");
      const value = rest.join("=").trim();

      currentKey = key.trim().toLowerCase();
      data[currentKey] = value || "";
    } else if (currentKey) {
      data[currentKey] += "\n" + clean;
    }
  });

  return data;
};

const splitToArray = (val) => {
  if (!val) return "";
  return val
    .split(/,|\/|\n/)
    .map(v => v.trim())
    .filter(Boolean)
    .join(", ");
};

const formatMultiline = (val) => {
  if (!val) return "";
  return val
    .split("\n")
    .map(v => v.trim())
    .filter(Boolean)
    .join("\n");
};

const normalizeEmploymentType = (val) => {
  if (!val) return "";

  const v = val.toLowerCase();

  if (v.includes("full")) return "Full Time, Permanent";
  if (v.includes("part")) return "Part Time";
  if (v.includes("intern")) return "Internship";
  if (v.includes("contract")) return "Contract";

  return "";
};

const normalizeMode = (val) => {
  if (!val) return "Walk-In";

  const v = val.toLowerCase();

  if (v.includes("virtual")) return "Virtual";

  return "Walk-In";
};

const parseDate = (val) => {
  if (!val) return "";

  const d = new Date(val);
  if (isNaN(d)) return "";

  return d.toISOString().split("T")[0]; // yyyy-mm-dd (input field format)
};

const mapAIToWalkin = (d) => ({

  /* ───────── COMPANY ───────── */
  companyName: d["company name"] || "",
  companyWebsite: d["company website"] || "",
  companyLogo: d["company logo"] || "",

  /* ───────── JOB ───────── */
  jobTitle: d["job title"] || "",
  walkintitle: d["walk-in title"] || "",

  roleCategory: d["job category"] || "",
  employmentType: normalizeEmploymentType(d["job type"]),

  experience: d["experience level"] || "",
  salary: d["salary"] || "",
  location: d["location"] || "",

  batch: d["eligible batches"] || "",
  qualification: d["education"] || "",

  skills: splitToArray(d["skills"]),
  tags: splitToArray(d["tags"]),

  /* ───────── DESCRIPTION ───────── */
  description: d["job description"] || "",

  responsibilities: formatMultiline(d["responsibilities"]),
  eligibility: formatMultiline(d["qualifications"]),

  selectionProcess: formatMultiline(d["selection process"]),
  documentsRequired: formatMultiline(d["documents required"]),

  /* ───────── WALK-IN DETAILS ───────── */
  startDate: parseDate(d["start date"] || d["walk-in date"]),
  endDate: parseDate(d["end date"]),

  reportingTime: d["reporting time"] || "",
  venue: d["venue"] || "",

  address: d["address"] || "",
  googleMapsLink: d["google maps link"] || "",

  /* ───────── CONTACT ───────── */
  contactEmail: d["contact email"] || "",
  contactPhone: d["contact phone"] || "",
  applyLink: d["apply link"] || "",

  /* ───────── META ───────── */
  mode: normalizeMode(d["mode"]),
});

const handleParseAIWalkin = () => {
  if (!aiRawText.trim()) {
    showToast("Paste AI response first", "err");
    return;
  }

  const parsed = parseAIText(aiRawText);
  const mapped = mapAIToWalkin(parsed);

  setForm(prev => ({
    ...prev,
    ...mapped
  }));

  showToast("✅ AI Autofill applied");
};

  const buildPayload = () => ({
    ...form,
    walkInDetails: {
      startDate: form.startDate,
      endDate: form.endDate,
      reportingTime: form.reportingTime,
      venue: form.venue,
    },
    skills: typeof form.skills === "string"
      ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
      : form.skills,
    batch: typeof form.batch === "string"
      ? form.batch.split(",").map(s => s.trim()).filter(Boolean)
      : form.batch,
    qualification: typeof form.qualification === "string"
      ? form.qualification.split(",").map(s => s.trim()).filter(Boolean)
      : form.qualification,
    tags: typeof form.tags === "string"
      ? form.tags.split(",").map(s => s.trim()).filter(Boolean)
      : form.tags,
    responsibilities: typeof form.responsibilities === "string"
      ? form.responsibilities.split("\n").filter(Boolean)
      : form.responsibilities,
    eligibility: typeof form.eligibility === "string"
      ? form.eligibility.split("\n").filter(Boolean)
      : form.eligibility,
    selectionProcess: typeof form.selectionProcess === "string"
      ? form.selectionProcess.split("\n").filter(Boolean)
      : form.selectionProcess,
    documentsRequired: typeof form.documentsRequired === "string"
      ? form.documentsRequired.split("\n").filter(Boolean)
      : form.documentsRequired,
  });

  /* ── CRUD ── */
  const fetchWalkins = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/walkins/get-all-walkins`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setWalkins(data.walkIns || []);
    } catch (e) { console.error(e.message); }
  };

  useEffect(() => { fetchWalkins(); }, []);

  // const doCreate = async () => {
  //   setLoading(true);
  //   try {
  //         const payload = buildPayload();
  //     const res = await fetch(`${API_BASE_URL}/api/walkins/create-walkin`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
  //       body: JSON.stringify(buildPayload()),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || "Failed to create");
  //     showToast("Walk-In posted successfully");
  // // ✅ store snapshot BEFORE resetting form
  //   setPostedData(payload);
  //     // 🔥 set job URL (adjust based on your frontend route)
  //     const generatedUrl = `${window.location.origin}/walkin/${data.walkIn?._id}`;
  //     setJobUrl(generatedUrl);

  //     // 🔥 trigger success screen
  //     setPosted(true);

  //     // optional reset
  //     setForm(initialForm);
  //     fetchWalkins();
  //   } catch (e) { showToast(e.message, "err"); }
  //   finally { setLoading(false); }
  // };
  const doCreate = async () => {
  setLoading(true);
  try {
    const payload = buildPayload();

    const res = await fetch(`${API_BASE_URL}/api/walkins/create-walkin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload), // ✅ FIXED
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create");

    showToast("Walk-In posted successfully");

    // ✅ BEST: use backend response instead of payload
    const createdWalkin = data.walkIn || payload;
    setPostedData(createdWalkin);

    // ✅ URL
    const generatedUrl = `${window.location.origin}/walkin/${createdWalkin._id}`;
    setJobUrl(generatedUrl);

    // ✅ success screen
    setPosted(true);

    // reset
    setForm(initialForm);
    fetchWalkins();

  } catch (e) {
    showToast(e.message, "err");
  } finally {
    setLoading(false);
  }
};

  const doUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/walkins/update-walkin/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      showToast("Walk-In updated successfully");
      setForm(initialForm);
      setEditingId(null);
      fetchWalkins();
      setActiveTab("manage");
    } catch (e) { showToast(e.message, "err"); }
    finally { setLoading(false); }
  };

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
    } catch (e) { showToast(e.message, "err"); setConfirmId(null); }
  };
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};
const generateShareMessage = () => {
  if (!postedData) return "";

  return `🚀 Walk-In Opportunity Alert!

🔹 ${postedData.companyName} is Hiring!
💼 Role: ${postedData.roleCategory}
📍 Location: ${postedData.location}
🎓 Batch: ${Array.isArray(postedData.batch) ? postedData.batch.join(", ") : postedData.batch}
📅 Walk-In Date: ${
  formatDate(postedData.walkInDetails?.startDate)
} ${
  postedData.walkInDetails?.endDate
    ? `to ${formatDate(postedData.walkInDetails?.endDate)}`
    : ""
}
⏰ Time: ${postedData.walkInDetails?.reportingTime}
🏢 Venue: ${postedData.walkInDetails?.venue}

🔗 Apply / Details:
${jobUrl}

📢 Stay Updated with Daily Jobs:
💬 WhatsApp Channel:
https://whatsapp.com/channel/0029Vb7fjzJK0IBayWJ7mv0I

📸 Instagram:
https://www.instagram.com/dailyjobopenings1?igsh=MTlrYWFtaHp3M2M0NQ==

🔗 Telegram:
https://t.me/codetechniques

📣 Share this opportunity with your friends ❤️`;
};

  const handleEdit = (job) => {
    setEditingId(job._id);
    setForm({
      companyName: job.companyName || "",
      companyLogo: job.companyLogo || "",
      companyWebsite: job.companyWebsite || "",
      walkintitle: job.walkintitle || "",
      jobTitle: job.jobTitle || "",
      roleCategory: job.roleCategory || "",
      employmentType: job.employmentType || "",
      experience: job.experience || "",
      batch: Array.isArray(job.batch) ? job.batch.join(", ") : (job.batch || ""),
      qualification: Array.isArray(job.qualification) ? job.qualification.join(", ") : (job.qualification || ""),
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : (job.skills || ""),
      salary: job.salary || "",
      location: job.location || "",
      startDate: job.walkInDetails?.startDate ? job.walkInDetails.startDate.split("T")[0] : "",
      endDate: job.walkInDetails?.endDate ? job.walkInDetails.endDate.split("T")[0] : "",
      reportingTime: job.walkInDetails?.reportingTime || "",
      venue: job.walkInDetails?.venue || job.venue || "",
      address: job.address || "",
      googleMapsLink: job.googleMapsLink || "",
      description: job.description || "",
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : (job.responsibilities || ""),
      eligibility: Array.isArray(job.eligibility) ? job.eligibility.join("\n") : (job.eligibility || ""),
      selectionProcess: Array.isArray(job.selectionProcess) ? job.selectionProcess.join("\n") : (job.selectionProcess || ""),
      documentsRequired: Array.isArray(job.documentsRequired) ? job.documentsRequired.join("\n") : (job.documentsRequired || ""),
      contactEmail: job.contactEmail || "",
      contactPhone: job.contactPhone || "",
      applyLink: job.applyLink || "",
      tags: Array.isArray(job.tags) ? job.tags.join(", ") : (job.tags || ""),
      mode: job.mode || "Walk-In",
      isFeatured: job.isFeatured || false,
      isHot: job.isHot || false,
      isVerified: job.isVerified || false,
    });
    setActiveTab("post");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingId ? doUpdate() : doCreate();
  };

  const cancelEdit = () => { setEditingId(null); setForm(initialForm); };

  /* ── Date field with calendar icon ── */
  const DateField = ({ label, name, required, value }) => (
    <Field label={label} required={required}>
      <div style={{ position: "relative" }}>
        <input
          type="date"
          name={name}
          value={value || ""}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          style={{
            ...inp,
            padding: "11px 14px 11px 40px",
            cursor: "pointer",
            colorScheme: "light",
          }}
        />
        <span style={{
          position: "absolute", left: 12, top: "50%",
          transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none",
        }}>📅</span>
      </div>
      {value && (
        <p style={{ fontSize: 11, color: S.plumLight, marginTop: 4 }}>
          {new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}
    </Field>
  );

  /* ── Toggle badge (same as PostJobForm workMode pill) ── */
  const Toggle = ({ name, label, onColor }) => (
    <label style={{
      display: "flex", alignItems: "center", gap: 10,
      cursor: "pointer", fontWeight: 600, fontSize: 14,
      color: form[name] ? S.plum : S.muted, transition: "color .2s",
    }}>
      <div
        onClick={() => setForm(prev => ({ ...prev, [name]: !prev[name] }))}
        style={{
          position: "relative", width: 44, height: 24,
          background: form[name] ? onColor : S.border,
          borderRadius: 20, transition: "background 0.3s", cursor: "pointer",
        }}
      >
        <div style={{
          position: "absolute", top: 2,
          left: form[name] ? 22 : 2,
          width: 20, height: 20, background: "#fff",
          borderRadius: "50%", transition: "left 0.3s",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }} />
      </div>
      {label}
    </label>
  );

return (
  posted ? (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: S.cream,
      minHeight: "100vh",
      color: S.text,
      width: "100%",
      overflowX: "hidden",
    }}>
      <div className="section-full"><AdminNavbar /></div>

      <div className="section-inner" style={{ textAlign: "center", paddingTop: 40 }}>

        <h2 style={{ marginBottom: 10 }}>🎉 Walk-In Posted Successfully!</h2>

        <p style={{ marginBottom: 20 }}>
          Share this opportunity with your network:
        </p>

        {/* TEXTAREA */}
        <textarea
          value={generateShareMessage()}
          readOnly
          style={{
            width: "100%",
            height: 180,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 13
          }}
        />

        {/* ACTION BUTTONS */}
        <div style={{ marginTop: 15, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>

          {/* COPY */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(generateShareMessage());
              showToast("Message copied!");
            }}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: S.plum,
              color: S.cream,
              cursor: "pointer"
            }}
          >
            📋 Copy Message
          </button>

          {/* WHATSAPP */}
          <button
            onClick={() => {
              const msg = generateShareMessage();
              const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
              window.open(url, "_blank");
            }}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#25D366",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            📲 Share on WhatsApp
          </button>
        </div>

        {/* 🔥 THIS IS WHAT YOU WERE ASKING ABOUT */}
        <button
          onClick={() => {
            setPosted(false);
            setJobUrl("");
            setPostedData(null);
          }}
          style={{
            marginTop: 25,
            padding: "11px 24px",
            borderRadius: 10,
            border: "none",
            background: S.primary,
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Post Another Walk-In →
        </button>

      </div>
    </div>
  ) : (
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
        .sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${S.plumLight}; display: inline-block; }
        input:focus, select:focus, textarea:focus {
          border-color: ${S.plumLight}!important;
          box-shadow: 0 0 0 3px rgba(123,74,139,.1)!important;
        }
        select option { background: ${S.white}; color: ${S.text}; }
        .tab-btn { cursor: pointer; border: none; font-family: inherit; transition: all .2s; }
        .form-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
        .walkin-card {
          background: ${S.white}; border: 1px solid ${S.border}; border-radius: 16px;
          padding: clamp(16px, 2vw, 22px); display: flex; align-items: center;
          gap: 18px; flex-wrap: wrap; position: relative; overflow: hidden;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), border-color .25s, box-shadow .3s;
        }
        .walkin-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
          background: ${S.plum}; opacity: 0; transition: opacity .25s; border-radius: 16px 0 0 16px;
        }
        .walkin-card:hover { transform: translateY(-2px); border-color: ${S.plumLight}; box-shadow: 0 10px 28px rgba(61,26,71,0.10); }
        .walkin-card:hover::before { opacity: 1; }
        .act-btn { font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 9px; border: none; cursor: pointer; font-family: inherit; letter-spacing: 0.3px; transition: opacity .2s, transform .15s; }
        .act-btn:hover { opacity: 0.82; transform: translateY(-1px); }
        .act-btn.edit   { background: rgba(61,26,71,0.09);  color: ${S.plum}; }
        .act-btn.delete { background: rgba(220,38,38,0.09); color: #b91c1c; }
        .submit-btn {
          width: 100%; padding: 14px; border-radius: 10px; font-size: 14px; font-weight: 700;
          letter-spacing: 0.5px; font-family: 'Cormorant Garamond', serif; cursor: pointer;
          border: none; background: ${S.plum}; color: ${S.cream}; transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(61,26,71,.2);
        }
        .submit-btn:hover:not(:disabled) { background: ${S.plumMid}; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(61,26,71,.3); }
        .submit-btn:disabled { background: ${S.creamDark}; color: ${S.muted}; cursor: not-allowed; box-shadow: none; }
        .company-dropdown-item:hover { background: rgba(61,26,71,0.05); }
      `}</style>

        <div className="section-full"><AdminNavbar /></div>

        {/* Toast */}
        {toast.msg && (
          <div style={{
            position: "fixed", top: 24, right: 24, zIndex: 300,
            background: S.white, border: `1px solid ${S.border}`,
            borderLeft: `4px solid ${toast.type === "err" ? "#b91c1c" : S.plum}`,
            borderRadius: 12, padding: "13px 20px", fontSize: 13.5, fontWeight: 500,
            boxShadow: "0 8px 28px rgba(61,26,71,0.13)",
            color: toast.type === "err" ? "#b91c1c" : S.plum,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>{toast.type === "err" ? "✕" : "✓"}</span>
            {toast.msg}
          </div>
        )}

        {/* Hero */}
        <div className="section-full" style={{
          background: S.plum, color: S.cream,
          padding: "clamp(28px,4vw,44px) 0",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, right: 120, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.025)", pointerEvents: "none" }} />
          <div className="section-inner">
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: S.creamDeep, marginBottom: 10 }}>Admin Portal</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 400, color: S.cream, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Walk-In <em style={{ fontStyle: "italic", fontWeight: 300, color: S.creamDeep }}>Job Drives</em>
            </h1>
            <div style={{ marginTop: 12 }}>
              <span style={{ fontSize: 12, color: "rgba(237,226,208,0.55)" }}>
                {walkins.length} drive{walkins.length !== 1 ? "s" : ""} · post · update · manage
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="section-full" style={{ background: S.white, borderBottom: `1px solid ${S.border}`, boxShadow: "0 2px 8px rgba(61,26,71,.06)" }}>
          <div className="section-inner" style={{ padding: 0 }}>
            <div style={{ display: "flex" }}>
              {TABS.map(tab => (
                <button key={tab.key} className="tab-btn"
                  onClick={() => { setActiveTab(tab.key); if (tab.key === "post" && !editingId) setForm(initialForm); }}
                  style={{
                    flex: 1, maxWidth: 300, padding: "16px",
                    background: activeTab === tab.key ? "rgba(61,26,71,0.07)" : "transparent",
                    color: activeTab === tab.key ? S.plum : S.muted,
                    borderBottom: activeTab === tab.key ? `3px solid ${S.plum}` : "3px solid transparent",
                    fontWeight: activeTab === tab.key ? 700 : 500, fontSize: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  }}>
                  <span style={{ fontSize: "18px" }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="section-full">
          <div className="section-inner" style={{ paddingTop: "clamp(24px,3vw,36px)", paddingBottom: 60 }}>

            {/* ═══ POST / EDIT TAB ═══ */}
            {activeTab === "post" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div className="sec-label" style={{ marginBottom: 0 }}>
                    {editingId ? "Editing Walk-In" : "New Walk-In Drive"}
                  </div>
                  {editingId && (
                    <button onClick={cancelEdit} style={{
                      background: "transparent", color: S.muted, border: `1.5px solid ${S.border}`,
                      padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>Cancel Edit</button>
                  )}
                </div>

                <div style={{
                  background: S.white, borderRadius: 14, border: `1px solid ${S.border}`,
                  padding: "clamp(20px,3vw,36px)", boxShadow: "0 2px 20px rgba(61,26,71,.07)",
                }}>

                  {/* ⚡ AUTO EXTRACT BOX
                  <JobExtractor
                    API_BASE_URL={API_BASE_URL}
                    S={S}
                    onExtract={(d) => {
                      // 🔥 Map extracted data to THIS PAGE fields (walk-in specific)

                      setForm(prev => ({
                        ...prev,

                        // common fields
                        jobTitle: d.jobTitle || "",
                        companyName: d.companyName || prev.companyName,
                        location: d.location || "",
                        description: d.description || "",

                        // walk-in specific fields (adjust based on your schema)
                        walkInDate: d.walkInDate || "",
                        walkInTime: d.walkInTime || "",
                        venue: d.venue || "",
                        contactDetails: d.contactDetails || "",

                        // optional
                        skills: Array.isArray(d.skills) ? d.skills.join(", ") : "",
                        experience: d.experienceLevel || "",
                        salary: d.salary || ""
                      }));
                    }}
                  /> */}
                  <div
  style={{
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    background: "#ffffff",
    boxShadow: "0 4px 18px rgba(0,0,0,0.04)"
  }}
>
  <h3 style={{
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 10,
    color: S.primary
  }}>
    🤖 AI Autofill (Walk-In)
  </h3>

  <textarea
    value={aiRawText}
    onChange={(e) => setAiRawText(e.target.value)}
    placeholder="Paste AI structured response here..."
    style={{
      width: "100%",
      minHeight: 120,
      padding: "10px 14px",
      borderRadius: 8,
      border: "1.5px solid #e2e8f0",
      background: "#fafafa",
      fontSize: 13.5,
      color: "#111827",
      outline: "none",
      marginBottom: 12
    }}
  />

  <button
    onClick={handleParseAIWalkin}
    className="ai-gradient-btn"
  >
    ⚡ Autofill Using AI
  </button>
</div>

                  <form onSubmit={handleSubmit}>

                    {/* ── Company Info ── */}
                    <SectionHead title="Company Information" icon="🏢" />
                    <div className="form-grid">
                      <Field label="Company Name" required>
                        <div style={{ position: "relative" }}>
                          <input
                            name="companyName"
                            value={form.companyName}
                            onChange={e => {
                              set("companyName", e.target.value);
                              searchCompanies(e.target.value);
                              setCompanyMessage("");
                            }}
                            placeholder="Search or type company name"
                            required
                            style={{
                              ...inp,
                              color: "#111827", caretColor: "#111827",
                            }}
                          />
                          {/* Dropdown */}
                          {showDropdown && companyResults.length > 0 && (
                            <div style={{
                              position: "absolute", top: "100%", left: 0, right: 0,
                              background: S.white, border: `1px solid ${S.border}`,
                              borderRadius: 8, maxHeight: 200, overflowY: "auto", zIndex: 1000,
                              boxShadow: "0 8px 24px rgba(61,26,71,0.12)",
                            }}>
                              {companyResults.map(c => (
                                <div key={c._id} className="company-dropdown-item"
                                  onClick={() => {
                                    setForm(prev => ({
                                      ...prev,
                                      companyName: c.companyName,
                                      companyLogo: c.companyLogo || "",
                                      companyWebsite: c.companyWebsite || "",
                                    }));
                                    setShowDropdown(false);
                                    setCompanyResults([]);
                                    setCompanyMessage("✅ Autofilled company details successfully");
                                  }}
                                  style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${S.border}`, fontSize: 13.5, color: S.text }}>
                                  {c.companyName}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {companyMessage && (
                          <p style={{ fontSize: 12, color: "green", marginTop: 4 }}>{companyMessage}</p>
                        )}
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

                    {/* ── Job Details ── */}
                    <SectionHead title="Job Details" icon="💼" />
                    <Field label="Walk-In Title" hint="Full title shown on the listing">
                      <input name="walkintitle" value={form.walkintitle} onChange={handleChange}
                        placeholder="e.g. Walk-in || Hiring PUC/Graduate Fresher, Experience BPO"
                        style={inp} />
                    </Field>
                    <div className="form-grid">
                      <Field label="Job Title" required>
                        <input name="jobTitle" value={form.jobTitle} onChange={handleChange}
                          placeholder="e.g. Software Engineer" required style={inp} />
                      </Field>
                      <Field label="Role Category">
                        <input name="roleCategory" value={form.roleCategory} onChange={handleChange}
                          placeholder="e.g. Customer Success, Engineering" style={inp} />
                      </Field>
                      <Field label="Employment Type">
                        <select name="employmentType" value={form.employmentType} onChange={handleChange}
                          style={{ ...inp, appearance: "none", cursor: "pointer" }}>
                          <option value="">Select type...</option>
                          <option value="Full Time, Permanent">Full Time, Permanent</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Temporary">Temporary</option>
                        </select>
                      </Field>
                      <Field label="Experience">
                        <input name="experience" value={form.experience} onChange={handleChange}
                          placeholder="e.g. 0 - 5 Years / Fresher" style={inp} />
                      </Field>
                      <Field label="Salary / CTC">
                        <input name="salary" value={form.salary} onChange={handleChange}
                          placeholder="e.g. 2.75 LPA - 4 LPA" style={inp} />
                      </Field>
                      <Field label="Location" required>
                        <input name="location" value={form.location} onChange={handleChange}
                          placeholder="e.g. Bengaluru" required style={inp} />
                      </Field>
                      <Field label="Eligible Batches" hint="Comma-separated: 2024, 2025, 2026">
                        <input name="batch" value={form.batch} onChange={handleChange}
                          placeholder="e.g. 2024, 2025, 2026" style={inp} />
                      </Field>
                      <Field label="Qualification" hint="Comma-separated: Graduate, PUC, Postgraduate">
                        <input name="qualification" value={form.qualification} onChange={handleChange}
                          placeholder="e.g. Graduate, PUC, Postgraduate" style={inp} />
                      </Field>
                      <Field label="Skills" hint="Comma-separated: React, Node.js, SQL">
                        <input name="skills" value={form.skills} onChange={handleChange}
                          placeholder="e.g. Java, Spring Boot, MySQL" style={inp} />
                      </Field>
                      <Field label="Mode">
                        <select name="mode" value={form.mode} onChange={handleChange}
                          style={{ ...inp, appearance: "none", cursor: "pointer" }}>
                          <option value="Walk-In">Walk-In</option>
                          <option value="On-site">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </Field>
                    </div>

                    {/* ── Walk-In Details ── */}
                    <SectionHead title="Walk-In Details" icon="🚶" />
                    <div className="form-grid">
                      <DateField label="Start Date" name="startDate" required value={form.startDate} />
                      <DateField label="End Date" name="endDate" required value={form.endDate} />
                      <Field label="Reporting Time">
                        <input name="reportingTime" value={form.reportingTime} onChange={handleChange}
                          placeholder="e.g. 9:30 AM - 5:30 PM" style={inp} />
                      </Field>
                      <Field label="Venue">
                        <input name="venue" value={form.venue} onChange={handleChange}
                          placeholder="Full venue name" style={inp} />
                      </Field>
                      <Field label="Full Address">
                        <input name="address" value={form.address} onChange={handleChange}
                          placeholder="Full street address" style={inp} />
                      </Field>
                      <Field label="Google Maps Link">
                        <input name="googleMapsLink" value={form.googleMapsLink} onChange={handleChange}
                          placeholder="https://maps.google.com/..." style={inp} />
                      </Field>
                      <Field label="Contact Email">
                        <input type="text" name="contactEmail" value={form.contactEmail} onChange={handleChange}
                          placeholder="hr@company.com" style={inp} />
                      </Field>
                      <Field label="Contact Phone">
                        <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                          placeholder="+91 XXXXXXXXXX" style={inp} />
                      </Field>
                      <Field label="Apply Link" required hint="Must start with https://">
                        <input name="applyLink" type="url" value={form.applyLink} onChange={handleChange}
                          placeholder="https://company.com/apply" required style={inp} />
                      </Field>
                    </div>

                    {/* ── Description ── */}
                    <SectionHead title="Description & Requirements" icon="📝" />
                    <Field label="Job Description">
                      <textarea name="description" value={form.description} onChange={handleChange}
                        rows={4} placeholder="Roles and responsibilities..."
                        style={{ ...inp, resize: "vertical" }} />
                    </Field>
                    <div className="form-grid">
                      <Field label="Responsibilities" hint="One per line">
                        <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange}
                          rows={4} placeholder={"Handle customer queries\nManage voice process..."}
                          style={{ ...inp, resize: "vertical" }} />
                      </Field>
                      <Field label="Eligibility Criteria" hint="One per line">
                        <textarea name="eligibility" value={form.eligibility} onChange={handleChange}
                          rows={4} placeholder={"Graduate / PUC\nExcellent English communication..."}
                          style={{ ...inp, resize: "vertical" }} />
                      </Field>
                      <Field label="Selection Process" hint="One per line">
                        <textarea name="selectionProcess" value={form.selectionProcess} onChange={handleChange}
                          rows={3} placeholder={"Walk-in Screening\nCommunication Round\nHR Interview"}
                          style={{ ...inp, resize: "vertical" }} />
                      </Field>
                      <Field label="Documents Required" hint="One per line">
                        <textarea name="documentsRequired" value={form.documentsRequired} onChange={handleChange}
                          rows={3} placeholder={"Updated Resume\nGovernment ID Proof\nEducational Documents"}
                          style={{ ...inp, resize: "vertical" }} />
                      </Field>
                    </div>

                    {/* ── Tags ── */}
                    <SectionHead title="Tags & SEO" icon="🏷️" />
                    <Field label="Tags" hint="Comma-separated: fresher, urgent, bangalore jobs">
                      <input name="tags" value={form.tags} onChange={handleChange}
                        placeholder="walk-in, bpo, bangalore jobs, freshers..." style={inp} />
                    </Field>

                    {/* ── Visibility & Labels ── */}
                    <SectionHead title="Visibility & Labels" icon="✨" />

                    <div style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>

                      {/* 🔹 Dropdown 1: Highlight Type */}
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
                          Highlight Type
                        </label>

                        <select
                          value={form.highlight || ""}
                          onChange={(e) =>
                            setForm(prev => ({ ...prev, highlight: e.target.value }))
                          }
                          style={{ ...inp, cursor: "pointer" }}
                        >
                          <option value="">Select Highlight</option>
                          <option value="featured">⭐ Featured</option>
                          <option value="hot">🔥 Hot Job</option>
                          <option value="trending">📈 Trending</option>
                        </select>
                      </div>

                      {/* 🔹 Dropdown 2: Walk-in Type */}
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
                          Walk-in Type
                        </label>

                        <select
                          value={form.walkInType || ""}
                          onChange={(e) =>
                            setForm(prev => ({ ...prev, walkInType: e.target.value }))
                          }
                          style={{ ...inp, cursor: "pointer" }}
                        >
                          <option value="">Select Type</option>
                          <option value="urgent">🚨 Urgent Walk-in</option>
                          <option value="walkin">📍 Walk-in Drive</option>
                          <option value="mass_hiring">👥 Mass Hiring</option>
                          <option value="fresher">🎓 Fresher Friendly</option>
                        </select>
                      </div>

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

            {/* ═══ MANAGE TAB ═══ */}
            {activeTab === "manage" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                  <div className="sec-label" style={{ marginBottom: 0 }}>
                    Directory · {walkins.length} drive{walkins.length !== 1 ? "s" : ""}
                  </div>
                  <button onClick={() => { setForm(initialForm); setEditingId(null); setActiveTab("post"); }}
                    style={{
                      background: S.plum, color: S.cream, border: "none",
                      padding: "10px 22px", borderRadius: 10, fontWeight: 600,
                      fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                      letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 8,
                    }}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Walk-In
                  </button>
                </div>

                {walkins.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "70px 0", color: S.muted }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: S.plumLight, marginBottom: 8 }}>
                      No walk-in drives yet
                    </div>
                    <div style={{ fontSize: 13 }}>Post the first walk-in drive to get started.</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {walkins.map(job => (
                      <div key={job._id} className="walkin-card">
                        <div style={{
                          width: 48, height: 48, borderRadius: 12, flexShrink: 0, overflow: "hidden",
                          background: "rgba(61,26,71,0.07)", border: `1.5px solid rgba(61,26,71,0.12)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt=""
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              onError={e => { e.target.style.display = "none"; }} />
                          ) : (
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: S.plum }}>
                              {job.companyName?.charAt(0).toUpperCase() || "?"}
                            </span>
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: 14.5, color: S.text, marginBottom: 5 }}>
                            {job.walkintitle || job.jobTitle}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 500, color: S.plum }}>
                              {job.companyName}
                            </span>
                            <span style={{ fontSize: 11, color: S.muted }}>·</span>
                            <span style={{ fontSize: 12, color: S.muted }}>{job.location}</span>
                            {(job.walkInDetails?.startDate || job.walkInDate) && (
                              <>
                                <span style={{ fontSize: 11, color: S.muted }}>·</span>
                                <span style={{ fontSize: 12, color: S.muted }}>
                                  {new Date(job.walkInDetails?.startDate || job.walkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  {job.walkInDetails?.endDate && (
                                    <> → {new Date(job.walkInDetails.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</>
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                            {job.salary && (
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.8px", textTransform: "uppercase", background: "rgba(61,26,71,0.07)", color: S.plumMid }}>
                                {job.salary}
                              </span>
                            )}
                            {job.isFeatured && (
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.8px", textTransform: "uppercase", background: "rgba(245,158,11,0.1)", color: "#d97706" }}>⭐ Featured</span>
                            )}
                            {job.isHot && (
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.8px", textTransform: "uppercase", background: "rgba(232,71,42,0.1)", color: S.accent }}>🔥 Hot</span>
                            )}
                            {job.isVerified && (
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.8px", textTransform: "uppercase", background: "rgba(22,163,74,0.1)", color: S.green }}>✅ Verified</span>
                            )}
                            <span style={{ fontSize: 11, color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>
                              ···{job._id?.slice(-6)}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button className="act-btn edit" onClick={() => handleEdit(job)}>Edit</button>
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

        {/* Delete confirm modal */}
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
    ));
};