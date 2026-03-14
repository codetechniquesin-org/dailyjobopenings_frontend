import { useState } from "react";

const IT_JOB_TITLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Mobile Developer (iOS)", "Mobile Developer (Android)", "React Native Developer",
  "DevOps Engineer", "Cloud Architect", "Site Reliability Engineer (SRE)",
  "Data Scientist", "Data Analyst", "Data Engineer", "ML Engineer",
  "AI Researcher", "NLP Engineer", "Computer Vision Engineer",
  "Cybersecurity Analyst", "Penetration Tester", "Security Engineer",
  "QA Engineer", "Automation Test Engineer", "Performance Engineer",
  "Product Manager", "Technical Program Manager", "Scrum Master",
  "UI/UX Designer", "UX Researcher", "System Administrator",
  "Network Engineer", "Database Administrator (DBA)", "Blockchain Developer",
  "Game Developer", "Embedded Systems Engineer", "Firmware Engineer",
  "IT Support Specialist", "Help Desk Technician", "IT Manager", "CTO",
];

const NON_IT_JOB_TITLES = {
  Finance: ["Financial Analyst", "Accountant", "Auditor", "Investment Banker", "Risk Manager", "Actuary", "CFO", "Tax Consultant"],
  Healthcare: ["Doctor", "Nurse", "Pharmacist", "Physiotherapist", "Lab Technician", "Hospital Administrator", "Medical Coder", "Radiologist"],
  Education: ["Teacher", "Professor", "Academic Coordinator", "School Principal", "Curriculum Designer", "Tutor", "Education Counselor"],
  Marketing: ["Marketing Manager", "Brand Strategist", "SEO Specialist", "Content Writer", "Social Media Manager", "Growth Hacker", "PR Manager"],
  Legal: ["Lawyer", "Legal Advisor", "Compliance Officer", "Paralegal", "Contract Manager", "Corporate Counsel"],
  Engineering: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Chemical Engineer", "Structural Engineer", "Industrial Engineer"],
  HR: ["HR Manager", "Talent Acquisition Specialist", "Payroll Manager", "L&D Manager", "HRBP", "Recruiter"],
  Sales: ["Sales Executive", "Business Development Manager", "Account Manager", "Regional Sales Manager", "Sales Director"],
  Operations: ["Operations Manager", "Supply Chain Manager", "Logistics Coordinator", "Warehouse Manager", "Procurement Manager"],
  Design: ["Graphic Designer", "Interior Designer", "Fashion Designer", "Industrial Designer", "Creative Director"],
  Media: ["Journalist", "Video Editor", "Photographer", "Content Creator", "Radio Jockey", "Film Director"],
  Hospitality: ["Hotel Manager", "Chef", "Front Desk Manager", "Event Coordinator", "Travel Consultant"],
};

const GOVT_JOB_TITLES = [
  "IAS Officer", "IPS Officer", "IFS Officer", "IRS Officer",
  "Bank PO", "Bank Clerk", "SSC CGL Officer", "Railway TC",
  "Defence Officer (Army)", "Defence Officer (Navy)", "Defence Officer (Air Force)",
  "Police Constable", "Sub-Inspector", "DSP",
  "UPSC Civil Services", "State PSC Officer",
  "Income Tax Officer", "Customs Officer", "Central Excise Officer",
  "Judge / Magistrate", "Public Prosecutor",
  "Government Teacher", "Government Doctor", "AIIMS Resident Doctor",
  "Postal Assistant", "Panchayati Raj Officer",
];

const WORK_TYPES = [
  "Full Time", "Part Time", "Remote", "Work From Home (WFH)", "Hybrid",
  "Contract Based", "Freelance", "Internship", "Apprenticeship", "Temporary",
];

const LOCATIONS = [
  "Hyderabad", "Bengaluru", "Mumbai", "Delhi / NCR", "Chennai", "Pune",
  "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi",
  "Coimbatore", "Bhubaneswar", "Indore", "Nagpur", "Vizag", "Surat",
  "Remote / Pan-India", "Multiple Locations",
];

const SALARY_RANGES = [
  "0 – 2 LPA", "2 – 4 LPA", "4 – 6 LPA", "6 – 8 LPA", "8 – 12 LPA",
  "12 – 18 LPA", "18 – 25 LPA", "25 – 40 LPA", "40 – 60 LPA", "60+ LPA",
  "Unpaid / Stipend", "As per industry standards",
];

const Tag = ({ label, onRemove }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "#e8f0fe", color: "#1a56db",
    borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 500,
    border: "1px solid #c3d9ff",
  }}>
    {label}
    <button onClick={onRemove} style={{
      background: "none", border: "none", cursor: "pointer",
      color: "#1a56db", fontSize: 14, lineHeight: 1, padding: 0,
    }}>×</button>
  </span>
);

const Field = ({ label, required, children, hint }) => (
  <div style={{ marginBottom: 22 }}>
    <label style={{
      display: "block", fontSize: 12, fontWeight: 600,
      textTransform: "uppercase", letterSpacing: "0.06em",
      color: "#6b7280", marginBottom: 6,
    }}>
      {label} {required && <span style={{ color: "#e24b4a" }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{hint}</p>}
  </div>
);

const inputStyle = {
  width: "100%", padding: "10px 14px", fontSize: 14,
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  outline: "none", background: "#fafafa", color: "#111827",
  transition: "border-color 0.15s", boxSizing: "border-box",
  fontFamily: "inherit",
};

export default function JobPostForm() {
  const [jobType, setJobType] = useState("IT");
  const [nonItIndustry, setNonItIndustry] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [workTypes, setWorkTypes] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [posted, setPosted] = useState(false);
  const [jobLink, setJobLink] = useState("");
  const [errors, setErrors] = useState({});

  const toggleWorkType = (wt) => {
    setWorkTypes(prev => prev.includes(wt) ? prev.filter(x => x !== wt) : [...prev, wt]);
  };

  const getJobTitles = () => {
    if (jobType === "IT") return IT_JOB_TITLES;
    if (jobType === "GOVT") return GOVT_JOB_TITLES;
    if (jobType === "NON_IT" && nonItIndustry) return NON_IT_JOB_TITLES[nonItIndustry] || [];
    return [];
  };

  const validate = () => {
    const e = {};
    if (!companyLogo.trim()) e.companyLogo = "Required";
    if (!companyName.trim()) e.companyName = "Required";
    if (!jobTitle) e.jobTitle = "Required";
    if (!datePosted) e.datePosted = "Required";
    if (!salary) e.salary = "Required";
    if (!location) e.location = "Required";
    if (workTypes.length === 0) e.workTypes = "Select at least one";
    if (!jobDescription.trim()) e.jobDescription = "Required";
    if (!aboutCompany.trim()) e.aboutCompany = "Required";
    if (!companyWebsite.trim()) e.companyWebsite = "Required";
    return e;
  };

  const handlePost = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setPosted(true);
      setJobLink("");
    }
  };

  const handleGenerateLink = () => {
    const slug = `${companyName.replace(/\s+/g, "-").toLowerCase()}-${jobTitle.replace(/\s+/g, "-").toLowerCase()}`;
    const uid = Math.random().toString(36).substring(2, 8);
    setJobLink(`https://jobs.yourdomain.com/post/${slug}-${uid}`);
  };

  const selectStyle = (err) => ({
    ...inputStyle,
    border: err ? "1.5px solid #e24b4a" : "1.5px solid #e5e7eb",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 40%, #f5f0ff 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
        input:focus, select:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .wt-btn { cursor: pointer; border: 1.5px solid #e5e7eb; border-radius: 20px; padding: 6px 14px; font-size: 12px; background: white; color: #374151; transition: all 0.15s; font-family: inherit; }
        .wt-btn:hover { border-color: #6366f1; color: #6366f1; }
        .wt-btn.active { background: #6366f1; border-color: #6366f1; color: white; }
        .job-type-btn { cursor: pointer; padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1.5px solid #e5e7eb; background: white; color: #6b7280; transition: all 0.15s; font-family: inherit; }
        .job-type-btn.active { background: #6366f1; border-color: #6366f1; color: white; }
        .post-btn { width: 100%; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; font-family: 'Syne', sans-serif; letter-spacing: 0.04em; cursor: pointer; border: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; transition: all 0.2s; }
        .post-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
        .gen-btn { width: 100%; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; border: 2px solid #6366f1; background: white; color: #6366f1; font-family: inherit; transition: all 0.2s; }
        .gen-btn:hover { background: #f0f0ff; }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "white", borderRadius: 40, padding: "8px 20px",
            border: "1px solid #e5e7eb", marginBottom: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em" }}>
              JOB POSTING PORTAL
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800,
            margin: "0 0 10px", color: "#0f172a",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Post a Job Opening
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            Fill in the details below to reach thousands of active candidates
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: "white", borderRadius: 20, padding: "36px 40px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 32px rgba(99,102,241,0.07)",
        }}>

          {/* Section: Company */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
              color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em",
              margin: "0 0 20px", paddingBottom: 10,
              borderBottom: "1px dashed #e5e7eb",
            }}>Company Info</h2>

            <Field label="Company Logo" required hint="Paste a Cloudinary image URL">
              <input
                type="url"
                placeholder="https://res.cloudinary.com/..."
                value={companyLogo}
                onChange={e => setCompanyLogo(e.target.value)}
                style={{ ...inputStyle, border: errors.companyLogo ? "1.5px solid #e24b4a" : inputStyle.border }}
              />
              {companyLogo && (
                <img src={companyLogo} alt="logo preview" style={{
                  width: 52, height: 52, borderRadius: 10, marginTop: 8,
                  objectFit: "contain", border: "1px solid #e5e7eb", padding: 4,
                }} onError={e => e.target.style.display = "none"} />
              )}
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Company Name" required>
                <input type="text" placeholder="Acme Corp" value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  style={{ ...inputStyle, border: errors.companyName ? "1.5px solid #e24b4a" : inputStyle.border }} />
              </Field>
              <Field label="Company Website" required>
                <input type="url" placeholder="https://acme.com" value={companyWebsite}
                  onChange={e => setCompanyWebsite(e.target.value)}
                  style={{ ...inputStyle, border: errors.companyWebsite ? "1.5px solid #e24b4a" : inputStyle.border }} />
              </Field>
            </div>

            <Field label="About Company" required>
              <textarea placeholder="Brief description of your company, culture, and mission..."
                value={aboutCompany} onChange={e => setAboutCompany(e.target.value)} rows={3}
                style={{ ...inputStyle, resize: "vertical", border: errors.aboutCompany ? "1.5px solid #e24b4a" : inputStyle.border }} />
            </Field>
          </div>

          {/* Section: Job Details */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
              color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em",
              margin: "0 0 20px", paddingBottom: 10, borderBottom: "1px dashed #e5e7eb",
            }}>Job Details</h2>

            <Field label="Job Category" required>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["IT", "IT / Tech"], ["NON_IT", "Non-IT"], ["GOVT", "Government"]].map(([val, label]) => (
                  <button key={val} className={`job-type-btn ${jobType === val ? "active" : ""}`}
                    onClick={() => { setJobType(val); setJobTitle(""); setNonItIndustry(""); }}>
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            {jobType === "NON_IT" && (
              <Field label="Industry" required>
                <select value={nonItIndustry} onChange={e => { setNonItIndustry(e.target.value); setJobTitle(""); }}
                  style={selectStyle(false)}>
                  <option value="">Select Industry...</option>
                  {Object.keys(NON_IT_JOB_TITLES).map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </Field>
            )}

            <Field label="Job Title" required>
              <select value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                style={selectStyle(errors.jobTitle)}
                disabled={jobType === "NON_IT" && !nonItIndustry}>
                <option value="">Select Job Title...</option>
                {getJobTitles().map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.jobTitle && <p style={{ color: "#e24b4a", fontSize: 11, marginTop: 4 }}>{errors.jobTitle}</p>}
            </Field>

            <Field label="Job Description" required>
              <textarea placeholder="Describe roles, responsibilities, required skills, and qualifications..."
                value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={5}
                style={{ ...inputStyle, resize: "vertical", border: errors.jobDescription ? "1.5px solid #e24b4a" : inputStyle.border }} />
            </Field>
          </div>

          {/* Section: Work & Compensation */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
              color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em",
              margin: "0 0 20px", paddingBottom: 10, borderBottom: "1px dashed #e5e7eb",
            }}>Work & Compensation</h2>

            <Field label="Work Type" required>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {WORK_TYPES.map(wt => (
                  <button key={wt} className={`wt-btn ${workTypes.includes(wt) ? "active" : ""}`}
                    onClick={() => toggleWorkType(wt)}>{wt}</button>
                ))}
              </div>
              {errors.workTypes && <p style={{ color: "#e24b4a", fontSize: 11, marginTop: 6 }}>{errors.workTypes}</p>}
              {workTypes.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {workTypes.map(wt => <Tag key={wt} label={wt} onRemove={() => toggleWorkType(wt)} />)}
                </div>
              )}
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Salary Range" required>
                <select value={salary} onChange={e => setSalary(e.target.value)} style={selectStyle(errors.salary)}>
                  <option value="">Select Range...</option>
                  {SALARY_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Location" required>
                <select value={location} onChange={e => setLocation(e.target.value)} style={selectStyle(errors.location)}>
                  <option value="">Select Location...</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Date Posted" required>
                <input type="date" value={datePosted} onChange={e => setDatePosted(e.target.value)}
                  style={{ ...inputStyle, border: errors.datePosted ? "1.5px solid #e24b4a" : inputStyle.border }} />
              </Field>
              <Field label="Last Date to Apply" hint="Optional">
                <input type="date" value={lastDate} onChange={e => setLastDate(e.target.value)}
                  style={inputStyle} />
              </Field>
            </div>
          </div>

          {/* Post Button */}
          <button className="post-btn" onClick={handlePost}>
            {posted ? "✓  Job Posted Successfully" : "Post Job Opening →"}
          </button>

          {Object.keys(errors).length > 0 && (
            <p style={{ color: "#e24b4a", fontSize: 12, textAlign: "center", marginTop: 10 }}>
              Please fill all required fields marked with *
            </p>
          )}
        </div>

        {/* Generate Link Section */}
        {posted && (
          <div style={{
            marginTop: 24,
            background: "white", borderRadius: 20, padding: "28px 40px",
            border: "1px solid #d1fae5",
            boxShadow: "0 4px 24px rgba(34,197,94,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>✓</div>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, margin: 0, color: "#111827" }}>
                  Job posted for <span style={{ color: "#6366f1" }}>{jobTitle}</span> at {companyName}
                </p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Now generate a shareable job link</p>
              </div>
            </div>

            <button className="gen-btn" onClick={handleGenerateLink}>
              ⚡ Generate Job Link
            </button>

            {jobLink && (
              <div style={{
                marginTop: 14, background: "#f8f7ff", border: "1.5px solid #c7d2fe",
                borderRadius: 10, padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>🔗</span>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Shareable Link</p>
                  <a href={jobLink} target="_blank" rel="noreferrer" style={{
                    fontSize: 13, color: "#6366f1", wordBreak: "break-all",
                    textDecoration: "none", fontWeight: 500,
                  }}>{jobLink}</a>
                </div>
                <button onClick={() => navigator.clipboard?.writeText(jobLink)} style={{
                  background: "#6366f1", color: "white", border: "none",
                  borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer",
                  fontFamily: "inherit", fontWeight: 600, whiteSpace: "nowrap",
                }}>Copy</button>
              </div>
            )}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 24 }}>
          All job posts are reviewed within 24 hours before going live.
        </p>
      </div>
    </div>
  );
}