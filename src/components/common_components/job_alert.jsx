import { useState, useRef, useEffect } from "react";
import API_BASE_URL from "../../config/api";

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = ["IT", "Non-IT", "Government", "Internship"];

const SUB_CATEGORIES = {
  IT: [
    "Software Engineer", "Full Stack Developer", "Frontend Developer",
    "Backend Developer", "Data Engineer", "Data Scientist", "ML Engineer",
    "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst",
    "Mobile Developer", "QA Engineer", "Product Manager",
  ],
  "Non-IT": [
    "Marketing", "Sales", "Finance & Accounting", "HR & Recruitment",
    "Operations", "Content Writing", "Design", "Legal", "Teaching",
  ],
  Government: [
    "Banking (IBPS/SBI)", "Railway (RRB)", "SSC", "UPSC", "State PSC",
    "Defense", "Police", "Teaching (TET/TGT/PGT)", "Postal Services",
  ],
  Internship: [
    "Tech Internship", "Marketing Internship", "Research Internship",
    "Design Internship", "Finance Internship", "HR Internship",
  ],
};

const BATCHES = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];

const LOCATIONS = [
  "Hyderabad", "Bengaluru", "Chennai", "Mumbai", "Pune",
  "Delhi NCR", "Kolkata", "Ahmedabad", "Remote / Pan India",
];

const WORK_MODES = ["Remote", "WFH", "On-site", "Hybrid"];

// ── MultiSelect Dropdown ───────────────────────────────────────────────────────
function MultiDropdown({ label, options, selected, onChange, color = "#e05a5a" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };

  const displayLabel =
    selected.length === 0
      ? label
      : selected.length === 1
      ? selected[0]
      : `${selected[0]} +${selected.length - 1}`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: selected.length > 0 ? "rgba(224,90,90,0.12)" : "rgba(255,255,255,0.06)",
          border: selected.length > 0 ? `1.5px solid ${color}55` : "1.5px solid rgba(255,255,255,0.12)",
          color: selected.length > 0 ? color : "#c8d0dc",
          borderRadius: 8, padding: "8px 13px",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
          whiteSpace: "nowrap", letterSpacing: "0.02em",
          transition: "all 0.18s",
          fontFamily: "inherit",
        }}
      >
        {displayLabel}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s", opacity: 0.7 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50,
          background: "#1a2535", border: "1.5px solid rgba(255,255,255,0.1)",
          borderRadius: 10, minWidth: 180, padding: "6px 0",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        }}>
          {options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <div key={opt} onClick={() => toggle(opt)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 14px", cursor: "pointer",
                  background: active ? "rgba(224,90,90,0.1)" : "transparent",
                  transition: "background 0.13s",
                  fontSize: 12, color: active ? "#f87a7a" : "#b0bac8",
                  fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = active ? "rgba(224,90,90,0.1)" : "transparent"; }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: 4,
                  border: active ? `2px solid ${color}` : "2px solid rgba(255,255,255,0.2)",
                  background: active ? color : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.15s",
                }}>
                  {active && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.2 5.8L6.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                {opt}
              </div>
            );
          })}
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
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | emailError
  const [errorMsg, setErrorMsg] = useState("");

  const availableSubCats = [...new Set(category.flatMap((c) => SUB_CATEGORIES[c] || []))];

  const handleCategoryChange = (val) => {
    setCategory(val);
    setSubCategory((prev) => prev.filter((s) => val.flatMap((c) => SUB_CATEGORIES[c] || []).includes(s)));
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

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      // DO NOT clear form — user may want to re-check what they submitted

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
      padding: "28px 28px 24px",
      border: "1.5px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
      maxWidth: 780,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle glow accent */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(224,90,90,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ marginBottom: 18, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
          }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: accentColor, textTransform: "uppercase" }}>
            Job Alerts
          </span>
        </div>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#edf2f8", lineHeight: 1.3 }}>
          Never Miss Your Dream Job — <span style={{ color: accentColor }}>Personalize Your Alerts</span>
        </h3>
        <p style={{ margin: "5px 0 0", fontSize: 12, color: "#7a8fa6", lineHeight: 1.5 }}>
          Pick your preferences and get notified the moment a matching role drops.
        </p>
      </div>

      {/* Dropdowns row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        <MultiDropdown label="Category" options={CATEGORIES} selected={category} onChange={handleCategoryChange} />
        <MultiDropdown
          label="Role / Domain"
          options={availableSubCats.length > 0 ? availableSubCats : ["Select a category first"]}
          selected={subCategory}
          onChange={availableSubCats.length > 0 ? setSubCategory : () => { }}
        />
        <MultiDropdown label="Batch Year" options={BATCHES} selected={batch} onChange={setBatch} />
        <MultiDropdown label="Location" options={LOCATIONS} selected={location} onChange={setLocation} />
        <MultiDropdown label="Work Mode" options={WORK_MODES} selected={workMode} onChange={setWorkMode} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />

      {/* Email + Subscribe */}
      {status === "success" ? (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "14px 16px", borderRadius: 10,
          background: "rgba(72,199,142,0.08)", border: "1.5px solid rgba(72,199,142,0.22)",
          animation: "fadeIn 0.3s ease",
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
              We sent a verification link to <strong style={{ color: "#94a3b8" }}>{email}</strong>.<br />
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
                onChange={(e) => { setEmail(e.target.value); if (status === "emailError" || status === "error") setStatus("idle"); }}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: status === "emailError" ? "rgba(224,90,90,0.06)" : "rgba(255,255,255,0.05)",
                  border: status === "emailError" ? "1.5px solid rgba(224,90,90,0.5)" : "1.5px solid rgba(255,255,255,0.1)",
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
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
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