import { useState, useRef, useEffect } from "react";
import API_BASE_URL from "../../config/api";

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = ["IT", "Non-IT", "Government", "Internship"];

const SUB_CATEGORIES = {
  IT: [
    "Software Engineer", "Full Stack Developer", "Frontend Developer",
    "Backend Developer", "Data Engineer", "Data Scientist", "ML Engineer",
    "AI/LLM Engineer", "DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer",
    "Cybersecurity Analyst", "Penetration Tester", "Mobile Developer (Android)",
    "Mobile Developer (iOS)", "Flutter Developer", "React Native Developer",
    "QA Engineer", "Automation Test Engineer", "Embedded Systems Engineer",
    "Blockchain Developer", "AR/VR Developer", "Game Developer",
    "Database Administrator", "ETL Developer", "Business Intelligence Analyst",
    "Scrum Master", "Product Manager", "Technical Writer", "IT Support Engineer",
    "Network Engineer", "System Administrator",
  ],
  "Non-IT": [
    "Marketing Executive", "Digital Marketing", "SEO Specialist", "Social Media Manager",
    "Content Writer", "Copywriter", "Video Editor", "Graphic Designer", "UI/UX Designer",
    "Sales Executive", "Business Development", "Account Manager", "Customer Support",
    "Finance & Accounting", "CA / CMA", "Financial Analyst", "Audit Associate",
    "HR Executive", "HR Recruiter", "Talent Acquisition", "Payroll Specialist",
    "Operations Manager", "Supply Chain", "Logistics Coordinator",
    "Legal Associate", "Compliance Officer",
    "Teacher / Lecturer", "Education Counselor",
    "Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Chemical Engineer",
    "Architecture", "Interior Design",
    "Healthcare / Nursing", "Pharmacist", "Lab Technician",
    "Journalist", "PR Executive", "Event Manager",
  ],
  Government: [
    "Banking – IBPS PO", "Banking – IBPS Clerk", "Banking – SBI PO", "Banking – SBI Clerk",
    "Banking – RBI Grade B", "Banking – NABARD",
    "Railway – RRB NTPC", "Railway – RRB Group D", "Railway – RRB JE", "Railway – RPF",
    "SSC – CGL", "SSC – CHSL", "SSC – MTS", "SSC – GD", "SSC – CPO",
    "UPSC – Civil Services (IAS/IPS/IFS)", "UPSC – CDS", "UPSC – NDA", "UPSC – CAPF",
    "State PSC – General", "State PSC – Engineering Services",
    "Defense – Indian Army", "Defense – Indian Navy", "Defense – Indian Air Force",
    "Police – Constable", "Police – Sub-Inspector",
    "Teaching – CTET", "Teaching – TET", "Teaching – TGT", "Teaching – PGT", "Teaching – NET/SET",
    "Postal Services – GDS", "Postal Services – PA/SA",
    "Municipal Corporation", "Public Sector (PSU – BHEL/ONGC/NTPC/ISRO etc.)",
    "High Court / Judiciary", "Income Tax / Customs",
  ],
  Internship: [
    "Software Development Internship", "Web Development Internship",
    "App Development Internship", "Data Science Internship",
    "Machine Learning Internship", "AI Research Internship",
    "Cybersecurity Internship", "Cloud / DevOps Internship",
    "Marketing Internship", "Digital Marketing Internship",
    "Content Writing Internship", "Graphic Design Internship",
    "UI/UX Design Internship", "Video Editing Internship",
    "Finance Internship", "Accounting Internship",
    "HR Internship", "Business Development Internship",
    "Operations Internship", "Legal Internship",
    "Research Internship", "Civil Engineering Internship",
    "Mechanical Engineering Internship", "Electrical Engineering Internship",
    "Teaching / EdTech Internship", "Social Media Internship",
    "Event Management Internship", "Journalism Internship",
  ],
};

const BATCHES = [
  "2018", "2019", "2020", "2021", "2022",
  "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030",
];

const LOCATIONS = [
  "Hyderabad", "Bengaluru", "Chennai", "Mumbai", "Pune",
  "Delhi NCR", "Noida", "Gurugram", "Kolkata", "Ahmedabad",
  "Jaipur", "Lucknow", "Bhopal", "Indore", "Chandigarh",
  "Kochi", "Coimbatore", "Vizag", "Nagpur", "Surat",
  "Mysuru", "Bhubaneswar", "Patna", "Guwahati", "Dehradun",
  "Remote / Pan India", "Work From Home",
];

const WORK_MODES = ["Remote", "Work From Home (WFH)", "On-site", "Hybrid", "Flexible"];

// ── MultiSelect Dropdown with Search + Scroll ─────────────────────────────────
function MultiDropdown({ label, options, selected, onChange, color = "#e05a5a", disabled = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
    if (!open) setSearch("");
  }, [open]);

  const toggle = (val) => {
    if (disabled) return;
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };

  const filteredOptions = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const displayLabel =
    selected.length === 0
      ? label
      : selected.length === 1
      ? selected[0]
      : `${selected[0]} +${selected.length - 1}`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => { if (!disabled) setOpen((o) => !o); }}
        title={selected.length > 1 ? selected.join(", ") : undefined}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: disabled
            ? "rgba(255,255,255,0.03)"
            : selected.length > 0
            ? "rgba(224,90,90,0.12)"
            : "rgba(255,255,255,0.06)",
          border: selected.length > 0 && !disabled
            ? `1.5px solid ${color}55`
            : "1.5px solid rgba(255,255,255,0.1)",
          color: disabled ? "#3a4a5c" : selected.length > 0 ? color : "#c8d0dc",
          borderRadius: 8, padding: "8px 13px",
          fontSize: 12, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
          whiteSpace: "nowrap", letterSpacing: "0.02em",
          transition: "all 0.18s",
          fontFamily: "inherit",
          opacity: disabled ? 0.5 : 1,
          maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>
          {displayLabel}
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s", opacity: 0.6, flexShrink: 0 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && !disabled && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 999,
          background: "#141f2e",
          border: "1.5px solid rgba(255,255,255,0.1)",
          borderRadius: 10, minWidth: 210, width: "max-content", maxWidth: 260,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}>
          {/* Search bar */}
          <div style={{
            padding: "8px 10px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            background: "#0f1c2a",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "6px 9px" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
                <circle cx="5" cy="5" r="4" stroke="#94a3b8" strokeWidth="1.3" />
                <path d="M8.5 8.5L11 11" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                style={{
                  background: "none", border: "none", outline: "none",
                  color: "#edf2f8", fontSize: 11.5, fontFamily: "inherit",
                  width: "100%", caretColor: color,
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#4a5c70", padding: 0, fontSize: 14, lineHeight: 1, flexShrink: 0,
                }}>×</button>
              )}
            </div>
          </div>

          {/* Selected count badge */}
          {selected.length > 0 && (
            <div style={{
              padding: "5px 12px",
              fontSize: 10, color: color, fontWeight: 600,
              background: "rgba(224,90,90,0.07)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>{selected.length} selected</span>
              <button
                onClick={() => onChange([])}
                style={{ background: "none", border: "none", cursor: "pointer",
                  color: "#4a5c70", fontSize: 10, fontFamily: "inherit", padding: 0 }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Scrollable options */}
          <div style={{
            maxHeight: 220,
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.12) transparent",
          }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: "14px 14px", fontSize: 11.5, color: "#3a4a5c", textAlign: "center" }}>
                No results found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const active = selected.includes(opt);
                return (
                  <div
                    key={opt}
                    onClick={() => toggle(opt)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "7px 12px", cursor: "pointer",
                      background: active ? "rgba(224,90,90,0.1)" : "transparent",
                      transition: "background 0.1s",
                      fontSize: 12, color: active ? "#f87a7a" : "#b0bac8",
                      fontWeight: active ? 600 : 400,
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = active ? "rgba(224,90,90,0.1)" : "transparent"; }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                      border: active ? `2px solid ${color}` : "2px solid rgba(255,255,255,0.18)",
                      background: active ? color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                      {active && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.8L6.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {opt}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Webkit scrollbar styling */}
          <style>{`
            div::-webkit-scrollbar { width: 4px; }
            div::-webkit-scrollbar-track { background: transparent; }
            div::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            div::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
          `}</style>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function JobAlertSubscribe() {
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [batch, setBatch] = useState([]);
  const [location, setLocation] = useState([]);
  const [workMode, setWorkMode] = useState([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Fix: merge all sub-categories from ALL selected categories (deduped, sorted)
  const availableSubCats = [
    ...new Set(category.flatMap((c) => SUB_CATEGORIES[c] || [])),
  ];

  const handleCategoryChange = (val) => {
    setCategory(val);
    // Keep only sub-cats that still exist in the new combined list
    const newAvailable = new Set(val.flatMap((c) => SUB_CATEGORIES[c] || []));
    setSubCategory((prev) => prev.filter((s) => newAvailable.has(s)));
  };

  const handleSubscribe = async () => {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail || !/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setStatus("emailError");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/job-alerts/subscribe-to-job-alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          jobCategory: category,
          jobRole: subCategory,
          location,
          workMode,
          eligibleBatches: batch,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const isLoading = status === "loading";
  const accentColor = "#e05a5a";

  return (
    <div style={{
      background: "linear-gradient(135deg, #12202f 0%, #1a2d42 60%, #16253a 100%)",
      borderRadius: 16,
      padding: "24px 24px 20px",
      border: "1.5px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
      maxWidth: 780,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "visible",  // ✅ allow dropdowns to overflow the card
    }}>
      {/* Subtle glow accent */}
      <div style={{
        position: "absolute", top: -40, right: -40, pointerEvents: "none",
        width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(224,90,90,0.12) 0%, transparent 70%)",
      }} />

      {/* Header */}
      <div style={{ marginBottom: 16, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: accentColor, boxShadow: `0 0 8px ${accentColor}`,
          }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: accentColor, textTransform: "uppercase" }}>
            Job Alerts
          </span>
        </div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#edf2f8", lineHeight: 1.3 }}>
          Never Miss Your Dream Job —{" "}
          <span style={{ color: accentColor }}>Personalize Your Alerts</span>
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#7a8fa6", lineHeight: 1.5 }}>
          Pick your preferences and get notified the moment a matching role drops.
        </p>
      </div>

      {/* Dropdowns — wrap into 2 rows of chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
        <MultiDropdown
          label="Category"
          options={CATEGORIES}
          selected={category}
          onChange={handleCategoryChange}
          color={accentColor}
        />
        <MultiDropdown
          label="Role / Domain"
          options={availableSubCats.length > 0 ? availableSubCats : []}
          selected={subCategory}
          onChange={setSubCategory}
          color={accentColor}
          disabled={availableSubCats.length === 0}
        />
        <MultiDropdown
          label="Batch Year"
          options={BATCHES}
          selected={batch}
          onChange={setBatch}
          color={accentColor}
        />
        <MultiDropdown
          label="Location"
          options={LOCATIONS}
          selected={location}
          onChange={setLocation}
          color={accentColor}
        />
        <MultiDropdown
          label="Work Mode"
          options={WORK_MODES}
          selected={workMode}
          onChange={setWorkMode}
          color={accentColor}
        />
      </div>

      {/* Hint when Role/Domain is disabled */}
      {availableSubCats.length === 0 && (
        <p style={{ margin: "-10px 0 12px", fontSize: 10.5, color: "#3a4a5c", fontStyle: "italic" }}>
          ↑ Select a category above to unlock Role / Domain options
        </p>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 14 }} />

      {/* Email + Subscribe */}
      {status === "success" ? (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "14px 16px", borderRadius: 10,
          background: "rgba(72,199,142,0.08)", border: "1.5px solid rgba(72,199,142,0.22)",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(72,199,142,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L6.5 12.5L14 4" stroke="#48c78e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#48c78e", marginBottom: 3 }}>
              Check your inbox to verify 📩
            </div>
            <div style={{ fontSize: 11.5, color: "#7a8fa6", lineHeight: 1.6 }}>
              We sent a verification link to{" "}
              <strong style={{ color: "#94a3b8" }}>{email}</strong>.<br />
              Click the link in your email to activate your job alerts.
            </div>
            <button
              onClick={() => { setStatus("idle"); setEmail(""); }}
              style={{
                marginTop: 8, background: "none", border: "none",
                color: "#48c78e", fontSize: 11, cursor: "pointer",
                padding: 0, fontFamily: "inherit", opacity: 0.8,
                textDecoration: "underline",
              }}
            >
              Use a different email
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 420 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>
                <path d="M1 3.5L7 8L13 3.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
                <rect x="1" y="2" width="12" height="10" rx="2" stroke="#94a3b8" strokeWidth="1.3" />
              </svg>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                disabled={isLoading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "emailError" || status === "error") setStatus("idle");
                }}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: status === "emailError" ? "rgba(224,90,90,0.06)" : "rgba(255,255,255,0.05)",
                  border: status === "emailError"
                    ? "1.5px solid rgba(224,90,90,0.5)"
                    : "1.5px solid rgba(255,255,255,0.1)",
                  borderRight: "none",
                  color: "#edf2f8", fontSize: 12,
                  borderRadius: "8px 0 0 8px",
                  padding: "10px 12px 10px 32px",
                  outline: "none", fontFamily: "inherit",
                  transition: "border-color 0.2s",
                  opacity: isLoading ? 0.6 : 1,
                }}
              />
            </div>
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              style={{
                background: isLoading
                  ? "rgba(224,90,90,0.5)"
                  : `linear-gradient(135deg, ${accentColor}, #c0392b)`,
                color: "#fff", border: "none",
                padding: "10px 18px",
                borderRadius: "0 8px 8px 0",
                fontWeight: 700, fontSize: 12,
                cursor: isLoading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit", letterSpacing: "0.03em",
                boxShadow: isLoading ? "none" : "0 4px 14px rgba(224,90,90,0.35)",
                transition: "opacity 0.15s, transform 0.1s",
                display: "flex", alignItems: "center", gap: 6, minWidth: 110,
                justifyContent: "center",
              }}
              onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {isLoading ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M6 1 A5 5 0 0 1 11 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Sending...
                </>
              ) : "Subscribe →"}
            </button>
          </div>

          {status === "emailError" && (
            <p style={{ margin: "6px 0 0", fontSize: 11, color: accentColor }}>
              Please enter a valid email address.
            </p>
          )}
          {status === "error" && (
            <p style={{ margin: "6px 0 0", fontSize: 11, color: accentColor }}>
              {errorMsg || "Something went wrong. Please try again."}
            </p>
          )}
        </>
      )}

      <p style={{ margin: "10px 0 0", fontSize: 10, color: "#4a5c70" }}>
        No spam, ever. Unsubscribe anytime. Alerts sent only for matching jobs.
      </p>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}