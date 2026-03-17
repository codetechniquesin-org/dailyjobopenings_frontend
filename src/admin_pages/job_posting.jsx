// import { useState } from "react";

// const IT_JOB_TITLES = [
//   "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
//   "Mobile Developer (iOS)", "Mobile Developer (Android)", "React Native Developer",
//   "DevOps Engineer", "Cloud Architect", "Site Reliability Engineer (SRE)",
//   "Data Scientist", "Data Analyst", "Data Engineer", "ML Engineer",
//   "AI Researcher", "NLP Engineer", "Computer Vision Engineer",
//   "Cybersecurity Analyst", "Penetration Tester", "Security Engineer",
//   "QA Engineer", "Automation Test Engineer", "Performance Engineer",
//   "Product Manager", "Technical Program Manager", "Scrum Master",
//   "UI/UX Designer", "UX Researcher", "System Administrator",
//   "Network Engineer", "Database Administrator (DBA)", "Blockchain Developer",
//   "Game Developer", "Embedded Systems Engineer", "Firmware Engineer",
//   "IT Support Specialist", "Help Desk Technician", "IT Manager", "CTO",
// ];

// const NON_IT_JOB_TITLES = {
//   Finance: ["Financial Analyst", "Accountant", "Auditor", "Investment Banker", "Risk Manager", "Actuary", "CFO", "Tax Consultant"],
//   Healthcare: ["Doctor", "Nurse", "Pharmacist", "Physiotherapist", "Lab Technician", "Hospital Administrator", "Medical Coder", "Radiologist"],
//   Education: ["Teacher", "Professor", "Academic Coordinator", "School Principal", "Curriculum Designer", "Tutor", "Education Counselor"],
//   Marketing: ["Marketing Manager", "Brand Strategist", "SEO Specialist", "Content Writer", "Social Media Manager", "Growth Hacker", "PR Manager"],
//   Legal: ["Lawyer", "Legal Advisor", "Compliance Officer", "Paralegal", "Contract Manager", "Corporate Counsel"],
//   Engineering: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Chemical Engineer", "Structural Engineer", "Industrial Engineer"],
//   HR: ["HR Manager", "Talent Acquisition Specialist", "Payroll Manager", "L&D Manager", "HRBP", "Recruiter"],
//   Sales: ["Sales Executive", "Business Development Manager", "Account Manager", "Regional Sales Manager", "Sales Director"],
//   Operations: ["Operations Manager", "Supply Chain Manager", "Logistics Coordinator", "Warehouse Manager", "Procurement Manager"],
//   Design: ["Graphic Designer", "Interior Designer", "Fashion Designer", "Industrial Designer", "Creative Director"],
//   Media: ["Journalist", "Video Editor", "Photographer", "Content Creator", "Radio Jockey", "Film Director"],
//   Hospitality: ["Hotel Manager", "Chef", "Front Desk Manager", "Event Coordinator", "Travel Consultant"],
// };

// const GOVT_JOB_TITLES = [
//   "IAS Officer", "IPS Officer", "IFS Officer", "IRS Officer",
//   "Bank PO", "Bank Clerk", "SSC CGL Officer", "Railway TC",
//   "Defence Officer (Army)", "Defence Officer (Navy)", "Defence Officer (Air Force)",
//   "Police Constable", "Sub-Inspector", "DSP",
//   "UPSC Civil Services", "State PSC Officer",
//   "Income Tax Officer", "Customs Officer", "Central Excise Officer",
//   "Judge / Magistrate", "Public Prosecutor",
//   "Government Teacher", "Government Doctor", "AIIMS Resident Doctor",
//   "Postal Assistant", "Panchayati Raj Officer",
// ];

// const WORK_TYPES = [
//   "Full Time", "Part Time", "Remote", "Work From Home (WFH)", "Hybrid",
//   "Contract Based", "Freelance", "Internship", "Apprenticeship", "Temporary",
// ];

// const LOCATIONS = [
//   "Hyderabad", "Bengaluru", "Mumbai", "Delhi / NCR", "Chennai", "Pune",
//   "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi",
//   "Coimbatore", "Bhubaneswar", "Indore", "Nagpur", "Vizag", "Surat",
//   "Remote / Pan-India", "Multiple Locations",
// ];

// const SALARY_RANGES = [
//   "0 – 2 LPA", "2 – 4 LPA", "4 – 6 LPA", "6 – 8 LPA", "8 – 12 LPA",
//   "12 – 18 LPA", "18 – 25 LPA", "25 – 40 LPA", "40 – 60 LPA", "60+ LPA",
//   "Unpaid / Stipend", "As per industry standards",
// ];

// const Tag = ({ label, onRemove }) => (
//   <span style={{
//     display: "inline-flex", alignItems: "center", gap: 5,
//     background: "#e8f0fe", color: "#1a56db",
//     borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 500,
//     border: "1px solid #c3d9ff",
//   }}>
//     {label}
//     <button onClick={onRemove} style={{
//       background: "none", border: "none", cursor: "pointer",
//       color: "#1a56db", fontSize: 14, lineHeight: 1, padding: 0,
//     }}>×</button>
//   </span>
// );

// const Field = ({ label, required, children, hint }) => (
//   <div style={{ marginBottom: 22 }}>
//     <label style={{
//       display: "block", fontSize: 12, fontWeight: 600,
//       textTransform: "uppercase", letterSpacing: "0.06em",
//       color: "#6b7280", marginBottom: 6,
//     }}>
//       {label} {required && <span style={{ color: "#e24b4a" }}>*</span>}
//     </label>
//     {children}
//     {hint && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{hint}</p>}
//   </div>
// );

// const inputStyle = {
//   width: "100%", padding: "10px 14px", fontSize: 14,
//   border: "1.5px solid #e5e7eb", borderRadius: 10,
//   outline: "none", background: "#fafafa", color: "#111827",
//   transition: "border-color 0.15s", boxSizing: "border-box",
//   fontFamily: "inherit",
// };

// export default function JobPostForm() {
//   const [jobType, setJobType] = useState("IT");
//   const [nonItIndustry, setNonItIndustry] = useState("");
//   const [jobTitle, setJobTitle] = useState("");
//   const [companyLogo, setCompanyLogo] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [companyWebsite, setCompanyWebsite] = useState("");
//   const [aboutCompany, setAboutCompany] = useState("");
//   const [datePosted, setDatePosted] = useState("");
//   const [lastDate, setLastDate] = useState("");
//   const [salary, setSalary] = useState("");
//   const [location, setLocation] = useState("");
//   const [workTypes, setWorkTypes] = useState([]);
//   const [jobDescription, setJobDescription] = useState("");
//   const [posted, setPosted] = useState(false);
//   const [jobLink, setJobLink] = useState("");
//   const [errors, setErrors] = useState({});

//   const toggleWorkType = (wt) => {
//     setWorkTypes(prev => prev.includes(wt) ? prev.filter(x => x !== wt) : [...prev, wt]);
//   };

//   const getJobTitles = () => {
//     if (jobType === "IT") return IT_JOB_TITLES;
//     if (jobType === "GOVT") return GOVT_JOB_TITLES;
//     if (jobType === "NON_IT" && nonItIndustry) return NON_IT_JOB_TITLES[nonItIndustry] || [];
//     return [];
//   };

//   const validate = () => {
//     const e = {};
//     if (!companyLogo.trim()) e.companyLogo = "Required";
//     if (!companyName.trim()) e.companyName = "Required";
//     if (!jobTitle) e.jobTitle = "Required";
//     if (!datePosted) e.datePosted = "Required";
//     if (!salary) e.salary = "Required";
//     if (!location) e.location = "Required";
//     if (workTypes.length === 0) e.workTypes = "Select at least one";
//     if (!jobDescription.trim()) e.jobDescription = "Required";
//     if (!aboutCompany.trim()) e.aboutCompany = "Required";
//     if (!companyWebsite.trim()) e.companyWebsite = "Required";
//     return e;
//   };

//   const handlePost = () => {
//     const e = validate();
//     setErrors(e);
//     if (Object.keys(e).length === 0) {
//       setPosted(true);
//       setJobLink("");
//     }
//   };

//   const handleGenerateLink = () => {
//     const slug = `${companyName.replace(/\s+/g, "-").toLowerCase()}-${jobTitle.replace(/\s+/g, "-").toLowerCase()}`;
//     const uid = Math.random().toString(36).substring(2, 8);
//     setJobLink(`https://jobs.yourdomain.com/post/${slug}-${uid}`);
//   };

//   const selectStyle = (err) => ({
//     ...inputStyle,
//     border: err ? "1.5px solid #e24b4a" : "1.5px solid #e5e7eb",
//     appearance: "none",
//     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "right 14px center",
//     paddingRight: 36,
//   });

//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 40%, #f5f0ff 100%)",
//       fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//       padding: "40px 20px",
//     }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
//         input:focus, select:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
//         .wt-btn { cursor: pointer; border: 1.5px solid #e5e7eb; border-radius: 20px; padding: 6px 14px; font-size: 12px; background: white; color: #374151; transition: all 0.15s; font-family: inherit; }
//         .wt-btn:hover { border-color: #6366f1; color: #6366f1; }
//         .wt-btn.active { background: #6366f1; border-color: #6366f1; color: white; }
//         .job-type-btn { cursor: pointer; padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1.5px solid #e5e7eb; background: white; color: #6b7280; transition: all 0.15s; font-family: inherit; }
//         .job-type-btn.active { background: #6366f1; border-color: #6366f1; color: white; }
//         .post-btn { width: 100%; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; font-family: 'Syne', sans-serif; letter-spacing: 0.04em; cursor: pointer; border: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; transition: all 0.2s; }
//         .post-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
//         .gen-btn { width: 100%; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; border: 2px solid #6366f1; background: white; color: #6366f1; font-family: inherit; transition: all 0.2s; }
//         .gen-btn:hover { background: #f0f0ff; }
//       `}</style>

//       <div style={{ maxWidth: 760, margin: "0 auto" }}>

//         {/* Header */}
//         <div style={{ textAlign: "center", marginBottom: 40 }}>
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: 10,
//             background: "white", borderRadius: 40, padding: "8px 20px",
//             border: "1px solid #e5e7eb", marginBottom: 20,
//             boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//           }}>
//             <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
//             <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em" }}>
//               JOB POSTING PORTAL
//             </span>
//           </div>
//           <h1 style={{
//             fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800,
//             margin: "0 0 10px", color: "#0f172a",
//             background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//             WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//           }}>
//             Post a Job Opening
//           </h1>
//           <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
//             Fill in the details below to reach thousands of active candidates
//           </p>
//         </div>

//         {/* Form Card */}
//         <div style={{
//           background: "white", borderRadius: 20, padding: "36px 40px",
//           border: "1px solid #e5e7eb",
//           boxShadow: "0 4px 32px rgba(99,102,241,0.07)",
//         }}>

//           {/* Section: Company */}
//           <div style={{ marginBottom: 32 }}>
//             <h2 style={{
//               fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
//               color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em",
//               margin: "0 0 20px", paddingBottom: 10,
//               borderBottom: "1px dashed #e5e7eb",
//             }}>Company Info</h2>

//             <Field label="Company Logo" required hint="Paste a Cloudinary image URL">
//               <input
//                 type="url"
//                 placeholder="https://res.cloudinary.com/..."
//                 value={companyLogo}
//                 onChange={e => setCompanyLogo(e.target.value)}
//                 style={{ ...inputStyle, border: errors.companyLogo ? "1.5px solid #e24b4a" : inputStyle.border }}
//               />
//               {companyLogo && (
//                 <img src={companyLogo} alt="logo preview" style={{
//                   width: 52, height: 52, borderRadius: 10, marginTop: 8,
//                   objectFit: "contain", border: "1px solid #e5e7eb", padding: 4,
//                 }} onError={e => e.target.style.display = "none"} />
//               )}
//             </Field>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//               <Field label="Company Name" required>
//                 <input type="text" placeholder="Acme Corp" value={companyName}
//                   onChange={e => setCompanyName(e.target.value)}
//                   style={{ ...inputStyle, border: errors.companyName ? "1.5px solid #e24b4a" : inputStyle.border }} />
//               </Field>
//               <Field label="Company Website" required>
//                 <input type="url" placeholder="https://acme.com" value={companyWebsite}
//                   onChange={e => setCompanyWebsite(e.target.value)}
//                   style={{ ...inputStyle, border: errors.companyWebsite ? "1.5px solid #e24b4a" : inputStyle.border }} />
//               </Field>
//             </div>

//             <Field label="About Company" required>
//               <textarea placeholder="Brief description of your company, culture, and mission..."
//                 value={aboutCompany} onChange={e => setAboutCompany(e.target.value)} rows={3}
//                 style={{ ...inputStyle, resize: "vertical", border: errors.aboutCompany ? "1.5px solid #e24b4a" : inputStyle.border }} />
//             </Field>
//           </div>

//           {/* Section: Job Details */}
//           <div style={{ marginBottom: 32 }}>
//             <h2 style={{
//               fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
//               color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em",
//               margin: "0 0 20px", paddingBottom: 10, borderBottom: "1px dashed #e5e7eb",
//             }}>Job Details</h2>

//             <Field label="Job Category" required>
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {[["IT", "IT / Tech"], ["NON_IT", "Non-IT"], ["GOVT", "Government"]].map(([val, label]) => (
//                   <button key={val} className={`job-type-btn ${jobType === val ? "active" : ""}`}
//                     onClick={() => { setJobType(val); setJobTitle(""); setNonItIndustry(""); }}>
//                     {label}
//                   </button>
//                 ))}
//               </div>
//             </Field>

//             {jobType === "NON_IT" && (
//               <Field label="Industry" required>
//                 <select value={nonItIndustry} onChange={e => { setNonItIndustry(e.target.value); setJobTitle(""); }}
//                   style={selectStyle(false)}>
//                   <option value="">Select Industry...</option>
//                   {Object.keys(NON_IT_JOB_TITLES).map(ind => (
//                     <option key={ind} value={ind}>{ind}</option>
//                   ))}
//                 </select>
//               </Field>
//             )}

//             <Field label="Job Title" required>
//               <select value={jobTitle} onChange={e => setJobTitle(e.target.value)}
//                 style={selectStyle(errors.jobTitle)}
//                 disabled={jobType === "NON_IT" && !nonItIndustry}>
//                 <option value="">Select Job Title...</option>
//                 {getJobTitles().map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//               {errors.jobTitle && <p style={{ color: "#e24b4a", fontSize: 11, marginTop: 4 }}>{errors.jobTitle}</p>}
//             </Field>

//             <Field label="Job Description" required>
//               <textarea placeholder="Describe roles, responsibilities, required skills, and qualifications..."
//                 value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={5}
//                 style={{ ...inputStyle, resize: "vertical", border: errors.jobDescription ? "1.5px solid #e24b4a" : inputStyle.border }} />
//             </Field>
//           </div>

//           {/* Section: Work & Compensation */}
//           <div style={{ marginBottom: 32 }}>
//             <h2 style={{
//               fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
//               color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em",
//               margin: "0 0 20px", paddingBottom: 10, borderBottom: "1px dashed #e5e7eb",
//             }}>Work & Compensation</h2>

//             <Field label="Work Type" required>
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {WORK_TYPES.map(wt => (
//                   <button key={wt} className={`wt-btn ${workTypes.includes(wt) ? "active" : ""}`}
//                     onClick={() => toggleWorkType(wt)}>{wt}</button>
//                 ))}
//               </div>
//               {errors.workTypes && <p style={{ color: "#e24b4a", fontSize: 11, marginTop: 6 }}>{errors.workTypes}</p>}
//               {workTypes.length > 0 && (
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
//                   {workTypes.map(wt => <Tag key={wt} label={wt} onRemove={() => toggleWorkType(wt)} />)}
//                 </div>
//               )}
//             </Field>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//               <Field label="Salary Range" required>
//                 <select value={salary} onChange={e => setSalary(e.target.value)} style={selectStyle(errors.salary)}>
//                   <option value="">Select Range...</option>
//                   {SALARY_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
//                 </select>
//               </Field>
//               <Field label="Location" required>
//                 <select value={location} onChange={e => setLocation(e.target.value)} style={selectStyle(errors.location)}>
//                   <option value="">Select Location...</option>
//                   {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
//                 </select>
//               </Field>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//               <Field label="Date Posted" required>
//                 <input type="date" value={datePosted} onChange={e => setDatePosted(e.target.value)}
//                   style={{ ...inputStyle, border: errors.datePosted ? "1.5px solid #e24b4a" : inputStyle.border }} />
//               </Field>
//               <Field label="Last Date to Apply" hint="Optional">
//                 <input type="date" value={lastDate} onChange={e => setLastDate(e.target.value)}
//                   style={inputStyle} />
//               </Field>
//             </div>
//           </div>

//           {/* Post Button */}
//           <button className="post-btn" onClick={handlePost}>
//             {posted ? "✓  Job Posted Successfully" : "Post Job Opening →"}
//           </button>

//           {Object.keys(errors).length > 0 && (
//             <p style={{ color: "#e24b4a", fontSize: 12, textAlign: "center", marginTop: 10 }}>
//               Please fill all required fields marked with *
//             </p>
//           )}
//         </div>

//         {/* Generate Link Section */}
//         {posted && (
//           <div style={{
//             marginTop: 24,
//             background: "white", borderRadius: 20, padding: "28px 40px",
//             border: "1px solid #d1fae5",
//             boxShadow: "0 4px 24px rgba(34,197,94,0.08)",
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
//               <div style={{
//                 width: 36, height: 36, borderRadius: "50%",
//                 background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: 16,
//               }}>✓</div>
//               <div>
//                 <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, margin: 0, color: "#111827" }}>
//                   Job posted for <span style={{ color: "#6366f1" }}>{jobTitle}</span> at {companyName}
//                 </p>
//                 <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Now generate a shareable job link</p>
//               </div>
//             </div>

//             <button className="gen-btn" onClick={handleGenerateLink}>
//               ⚡ Generate Job Link
//             </button>

//             {jobLink && (
//               <div style={{
//                 marginTop: 14, background: "#f8f7ff", border: "1.5px solid #c7d2fe",
//                 borderRadius: 10, padding: "12px 16px",
//                 display: "flex", alignItems: "center", gap: 10,
//               }}>
//                 <span style={{ fontSize: 18 }}>🔗</span>
//                 <div style={{ flex: 1, overflow: "hidden" }}>
//                   <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Shareable Link</p>
//                   <a href={jobLink} target="_blank" rel="noreferrer" style={{
//                     fontSize: 13, color: "#6366f1", wordBreak: "break-all",
//                     textDecoration: "none", fontWeight: 500,
//                   }}>{jobLink}</a>
//                 </div>
//                 <button onClick={() => navigator.clipboard?.writeText(jobLink)} style={{
//                   background: "#6366f1", color: "white", border: "none",
//                   borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer",
//                   fontFamily: "inherit", fontWeight: 600, whiteSpace: "nowrap",
//                 }}>Copy</button>
//               </div>
//             )}
//           </div>
//         )}

//         <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 24 }}>
//           All job posts are reviewed within 24 hours before going live.
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

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

const JOB_ROLES = {
  IT:     ["Engineering", "Design", "Product", "Data & AI", "DevOps & Infra", "Security", "QA", "Management"],
  NON_IT: ["Finance", "Healthcare", "Education", "Marketing", "Legal", "Engineering", "HR", "Sales", "Operations", "Design", "Media", "Hospitality"],
  GOVT:   ["Civil Services", "Defence", "Police", "Banking", "Railways", "Teaching", "Healthcare", "Judiciary", "Revenue"],
};

const WORK_MODES = [
  "Full Time", "Part Time", "Remote", "Work From Home (WFH)", "Hybrid",
  "Contract Based", "Freelance", "Internship", "Apprenticeship", "Temporary",
];

const EXPERIENCE_LEVELS = [
  "Fresher (0 – 1 yr)", "Junior (1 – 3 yrs)", "Mid-Level (3 – 5 yrs)",
  "Senior (5 – 8 yrs)", "Lead / Principal (8 – 12 yrs)",
  "Manager (5+ yrs)", "Director / VP (10+ yrs)", "C-Level / Executive",
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

// ─── Dummy API  (replace URL + logic with your real endpoint) ─────────────────
const postJobToAPI = async (payload) => {
  // TODO: swap the block below with your real fetch call
  // ─────────────────────────────────────────────────────
  const res = await fetch("http://localhost:5000/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  return await res.json();
  // ─────────────────────────────────────────────────────

  // Dummy: simulates an 800ms network round-trip
  // return new Promise((resolve) =>
  //   setTimeout(() => resolve({
  //     success: true,
  //     jobId: "JOB-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  //     message: "Job posted successfully",
  //   }), 800)
  // );
};

// ─── Small shared components ──────────────────────────────────────────────────

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
      {label}{required && <span style={{ color: "#e24b4a", marginLeft: 3 }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize: 11, color: "#9ca3af", margin: "4px 0 0" }}>{hint}</p>}
  </div>
);

const SectionHead = ({ title }) => (
  <h2 style={{
    fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
    color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em",
    margin: "0 0 20px", paddingBottom: 10, borderBottom: "1px dashed #e5e7eb",
  }}>{title}</h2>
);

const inputStyle = {
  width: "100%", padding: "10px 14px", fontSize: 14,
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  outline: "none", background: "#fafafa", color: "#111827",
  transition: "border-color 0.15s", boxSizing: "border-box",
  fontFamily: "inherit",
};
const ERR = "1.5px solid #e24b4a";
const ErrMsg = ({ msg }) => msg ? <p style={{ color: "#e24b4a", fontSize: 11, margin: "4px 0 0" }}>{msg}</p> : null;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function JobPostForm() {

  // ── Fields that match the backend payload exactly ──
  const [companyLogo,      setCompanyLogo]      = useState("");  // Cloudinary URL
  const [companyName,      setCompanyName]      = useState("");
  const [jobTitle,         setJobTitle]         = useState("");
  const [jobRole,          setJobRole]          = useState("");  // department / sub-role
  const [jobDescription,   setJobDescription]   = useState("");
  const [jobType,          setJobType]          = useState("IT"); // "IT" | "NON_IT" | "GOVT"
  const [experienceLevel,  setExperienceLevel]  = useState("");
  const [jobCategory,      setJobCategory]      = useState("");  // industry bucket
  const [workMode,         setWorkMode]         = useState([]);  // array → joined on submit
  const [salary,           setSalary]           = useState("");
  const [location,         setLocation]         = useState("");
  const [jobLink,          setJobLink]          = useState("");  // blank → filled after post
  const [expiryDate,       setExpiryDate]       = useState("");

  // ── UI-only state ──
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [posted,   setPosted]   = useState(false);
  const [apiError, setApiError] = useState("");
  const [copied,   setCopied]   = useState(false);

  // ── Helpers ──
  const getJobTitles = () => {
    if (jobType === "IT")   return IT_JOB_TITLES;
    if (jobType === "GOVT") return GOVT_JOB_TITLES;
    if (jobType === "NON_IT" && jobCategory) return NON_IT_JOB_TITLES[jobCategory] || [];
    return [];
  };

  const toggleWorkMode = (wm) =>
    setWorkMode(prev => prev.includes(wm) ? prev.filter(x => x !== wm) : [...prev, wm]);

  const selectStyle = (hasErr) => ({
    ...inputStyle,
    border: hasErr ? ERR : "1.5px solid #e5e7eb",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
  });

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (!companyLogo.trim())                      e.companyLogo     = "Required";
    if (!companyName.trim())                      e.companyName     = "Required";
    if (!jobTitle)                                e.jobTitle        = "Required";
    if (!jobRole)                                 e.jobRole         = "Required";
    if (!jobDescription.trim())                   e.jobDescription  = "Required";
    if (!experienceLevel)                         e.experienceLevel = "Required";
    if (jobType === "NON_IT" && !jobCategory)     e.jobCategory     = "Required";
    if (workMode.length === 0)                    e.workMode        = "Select at least one";
    if (!salary)                                  e.salary          = "Required";
    if (!location)                                e.location        = "Required";
    if (!expiryDate)                              e.expiryDate      = "Required";
    return e;
  };

  // ── Submit ──
  const handlePost = async () => {
    const e = validate();
    setErrors(e);
    setApiError("");
    if (Object.keys(e).length > 0) return;

    // Exact payload the backend expects
    const payload = {
      companyLogo,
      companyName,
      jobTitle,
      jobRole,
      jobDescription,
      jobType,
      experienceLevel,
      jobCategory: jobCategory || jobType,   // IT / GOVT use jobType as category
      workMode:    workMode.join(", "),       // comma-separated string
      salary,
      location,
      jobLink,                               // may be blank; backend can return the real one
      expiryDate,
    };

    console.log("📦 Job payload →", payload); // handy during dev

    setLoading(true);
    try {
      const res = await postJobToAPI(payload);
      if (res.success) {
        setPosted(true);
        // Auto-generate link if field is still blank
        if (!jobLink) {
          const slug = `${companyName.replace(/\s+/g, "-").toLowerCase()}-${jobTitle.replace(/\s+/g, "-").toLowerCase()}`;
          setJobLink(`http://localhost:5000/job/${slug}-${res.jobId.toLowerCase()}`);
        }
      }
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = () => {
    const slug = `${companyName.replace(/\s+/g, "-").toLowerCase()}-${jobTitle.replace(/\s+/g, "-").toLowerCase()}`;
    const uid  = Math.random().toString(36).substring(2, 8);
    setJobLink(`http://localhost:5000/job/${slug}-${uid}`);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(jobLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 40%, #f5f0ff 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
        input:focus, select:focus, textarea:focus { border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
        .wt-btn  { cursor:pointer; border:1.5px solid #e5e7eb; border-radius:20px; padding:6px 14px; font-size:12px; background:white; color:#374151; transition:all 0.15s; font-family:inherit; }
        .wt-btn:hover { border-color:#6366f1; color:#6366f1; }
        .wt-btn.active { background:#6366f1; border-color:#6366f1; color:white; }
        .jtype-btn { cursor:pointer; padding:8px 22px; border-radius:8px; font-size:13px; font-weight:600; border:1.5px solid #e5e7eb; background:white; color:#6b7280; transition:all 0.15s; font-family:inherit; }
        .jtype-btn.active { background:#6366f1; border-color:#6366f1; color:white; }
        .post-btn { width:100%; padding:14px; border-radius:12px; font-size:15px; font-weight:700; font-family:'Syne',sans-serif; letter-spacing:0.04em; cursor:pointer; border:none; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:white; transition:all 0.2s; }
        .post-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(99,102,241,0.35); }
        .post-btn:disabled { opacity:0.65; cursor:not-allowed; }
        .gen-btn { padding:9px 16px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:1.5px solid #6366f1; background:white; color:#6366f1; font-family:inherit; transition:all 0.15s; white-space:nowrap; }
        .gen-btn:hover:not(:disabled) { background:#f0f0ff; }
        .gen-btn:disabled { opacity:0.45; cursor:not-allowed; }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* ── Header ── */}
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
            margin: "0 0 10px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Post a Job Opening</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            Fill in the details below to reach thousands of active candidates
          </p>
        </div>

        {/* ── Form Card ── */}
        <div style={{
          background: "white", borderRadius: 20, padding: "36px 40px",
          border: "1px solid #e5e7eb", boxShadow: "0 4px 32px rgba(99,102,241,0.07)",
        }}>

          {/* ── Company Info ── */}
          <div style={{ marginBottom: 32 }}>
            <SectionHead title="Company Info" />

            <Field label="Company Logo" required hint="Paste a Cloudinary image URL  ·  field key: companyLogo">
              <input type="url"
                placeholder="https://res.cloudinary.com/your-cloud/image/upload/logo.png"
                value={companyLogo} onChange={e => setCompanyLogo(e.target.value)}
                style={{ ...inputStyle, border: errors.companyLogo ? ERR : inputStyle.border }} />
              {companyLogo && (
                <img src={companyLogo} alt="logo preview" style={{
                  width: 52, height: 52, borderRadius: 10, marginTop: 8,
                  objectFit: "contain", border: "1px solid #e5e7eb", padding: 4, display: "block",
                }} onError={e => e.target.style.display = "none"} />
              )}
              <ErrMsg msg={errors.companyLogo} />
            </Field>

            <Field label="Company Name" required hint="field key: companyName">
              <input type="text" placeholder="Acme Corp"
                value={companyName} onChange={e => setCompanyName(e.target.value)}
                style={{ ...inputStyle, border: errors.companyName ? ERR : inputStyle.border }} />
              <ErrMsg msg={errors.companyName} />
            </Field>
          </div>

          {/* ── Job Details ── */}
          <div style={{ marginBottom: 32 }}>
            <SectionHead title="Job Details" />

            {/* jobType */}
            <Field label="Job Type" required hint="field key: jobType">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["IT", "IT / Tech"], ["NON_IT", "Non-IT"], ["GOVT", "Government"]].map(([val, lbl]) => (
                  <button key={val} className={`jtype-btn ${jobType === val ? "active" : ""}`}
                    onClick={() => { setJobType(val); setJobTitle(""); setJobRole(""); setJobCategory(""); }}>
                    {lbl}
                  </button>
                ))}
              </div>
            </Field>

            {/* jobCategory — required for NON_IT; auto-set for IT/GOVT */}
            {jobType === "NON_IT" && (
              <Field label="Industry / Job Category" required hint="field key: jobCategory">
                <select value={jobCategory}
                  onChange={e => { setJobCategory(e.target.value); setJobTitle(""); setJobRole(""); }}
                  style={selectStyle(errors.jobCategory)}>
                  <option value="">Select Industry...</option>
                  {Object.keys(NON_IT_JOB_TITLES).map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <ErrMsg msg={errors.jobCategory} />
              </Field>
            )}

            {/* jobTitle */}
            <Field label="Job Title" required hint="field key: jobTitle">
              <select value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                style={selectStyle(errors.jobTitle)}
                disabled={jobType === "NON_IT" && !jobCategory}>
                <option value="">Select Job Title...</option>
                {getJobTitles().map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ErrMsg msg={errors.jobTitle} />
            </Field>

            {/* jobRole */}
            <Field label="Job Role / Department" required hint="field key: jobRole">
              <select value={jobRole} onChange={e => setJobRole(e.target.value)}
                style={selectStyle(errors.jobRole)}>
                <option value="">Select Role / Department...</option>
                {(JOB_ROLES[jobType] || []).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ErrMsg msg={errors.jobRole} />
            </Field>

            {/* experienceLevel */}
            <Field label="Experience Level" required hint="field key: experienceLevel">
              <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)}
                style={selectStyle(errors.experienceLevel)}>
                <option value="">Select Experience Level...</option>
                {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ErrMsg msg={errors.experienceLevel} />
            </Field>

            {/* jobDescription */}
            <Field label="Job Description" required hint="field key: jobDescription">
              <textarea
                placeholder="Describe roles, responsibilities, required skills, and qualifications..."
                value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={5}
                style={{ ...inputStyle, resize: "vertical", border: errors.jobDescription ? ERR : inputStyle.border }} />
              <ErrMsg msg={errors.jobDescription} />
            </Field>
          </div>

          {/* ── Work & Compensation ── */}
          <div style={{ marginBottom: 32 }}>
            <SectionHead title="Work & Compensation" />

            {/* workMode */}
            <Field label="Work Mode" required hint="field key: workMode  ·  sent as comma-separated string">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {WORK_MODES.map(wm => (
                  <button key={wm} className={`wt-btn ${workMode.includes(wm) ? "active" : ""}`}
                    onClick={() => toggleWorkMode(wm)}>{wm}</button>
                ))}
              </div>
              <ErrMsg msg={errors.workMode} />
              {workMode.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {workMode.map(wm => <Tag key={wm} label={wm} onRemove={() => toggleWorkMode(wm)} />)}
                </div>
              )}
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* salary */}
              <Field label="Salary" required hint="field key: salary">
                <select value={salary} onChange={e => setSalary(e.target.value)} style={selectStyle(errors.salary)}>
                  <option value="">Select Range...</option>
                  {SALARY_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ErrMsg msg={errors.salary} />
              </Field>

              {/* location */}
              <Field label="Location" required hint="field key: location">
                <select value={location} onChange={e => setLocation(e.target.value)} style={selectStyle(errors.location)}>
                  <option value="">Select Location...</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ErrMsg msg={errors.location} />
              </Field>
            </div>

            {/* expiryDate */}
            <Field label="Application Expiry Date" required hint="field key: expiryDate  ·  last date candidates can apply">
              <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
                style={{ ...inputStyle, border: errors.expiryDate ? ERR : inputStyle.border }} />
              <ErrMsg msg={errors.expiryDate} />
            </Field>
          </div>

          {/* ── Job Link ── */}
          <div style={{ marginBottom: 32 }}>
            <SectionHead title="Job Link" />
            <Field label="Job Link" hint="field key: jobLink  ·  auto-filled after posting, or generate manually">
              <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                <input type="url"
                  placeholder="https://jobs.yourdomain.com/your-job-link  — leave blank to auto-fill"
                  value={jobLink} onChange={e => setJobLink(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }} />
                <button className="gen-btn" onClick={handleGenerateLink}
                  disabled={!companyName || !jobTitle}>
                  ⚡ Generate
                </button>
              </div>
              {jobLink && (
                <div style={{
                  marginTop: 8, display: "flex", alignItems: "center", gap: 8,
                  background: "#f8f7ff", borderRadius: 8, padding: "8px 12px",
                  border: "1px solid #c7d2fe",
                }}>
                  <a href={jobLink} target="_blank" rel="noreferrer" style={{
                    fontSize: 12, color: "#6366f1", wordBreak: "break-all",
                    textDecoration: "none", flex: 1, fontWeight: 500,
                  }}>{jobLink}</a>
                  <button onClick={handleCopy} style={{
                    background: copied ? "#22c55e" : "#6366f1", color: "white",
                    border: "none", borderRadius: 6, padding: "5px 12px",
                    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                    fontWeight: 600, whiteSpace: "nowrap", transition: "background 0.2s",
                  }}>{copied ? "Copied!" : "Copy"}</button>
                </div>
              )}
            </Field>
          </div>

          {/* ── Post Button ── */}
          <button className="post-btn" onClick={handlePost} disabled={loading || posted}>
            {loading ? "Posting…" : posted ? "✓  Job Posted Successfully" : "Post Job Opening →"}
          </button>

          {apiError && (
            <p style={{ color: "#e24b4a", fontSize: 12, textAlign: "center", marginTop: 10 }}>{apiError}</p>
          )}
          {Object.keys(errors).length > 0 && !posted && (
            <p style={{ color: "#e24b4a", fontSize: 12, textAlign: "center", marginTop: 10 }}>
              Please fill all required fields marked with *
            </p>
          )}

          {/* ── Success banner (inline, below button) ── */}
          {posted && (
            <div style={{
              marginTop: 20, background: "#f0fdf4",
              border: "1px solid #bbf7d0", borderRadius: 12, padding: "16px 20px",
              display: "flex", alignItems: "flex-start", gap: 14,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: "#dcfce7",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>✓</div>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, margin: "0 0 4px", color: "#166534" }}>
                  {jobTitle} at {companyName} — posted!
                </p>
                <p style={{ fontSize: 12, color: "#16a34a", margin: 0 }}>
                  {jobLink
                    ? "Your job link has been generated. Copy it from the Job Link field above."
                    : "Use ⚡ Generate in the Job Link field to create a shareable link."}
                </p>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 24 }}>
          All job posts are reviewed within 24 hours before going live.
        </p>
      </div>
    </div>
  );
}