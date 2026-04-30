import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
function MultiDropdown({ label, options, selected, onChange, color = "#e05a5a", disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val) => {
    if (disabled) return;
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };

  const displayLabel =
    selected.length === 0 ? label
    : selected.length === 1 ? selected[0]
    : `${selected[0]} +${selected.length - 1}`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: selected.length > 0 ? "rgba(224,90,90,0.12)" : "rgba(255,255,255,0.06)",
          border: selected.length > 0 ? `1.5px solid ${color}55` : "1.5px solid rgba(255,255,255,0.12)",
          color: selected.length > 0 ? color : "#c8d0dc",
          borderRadius: 8, padding: "8px 13px",
          fontSize: 12, fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          whiteSpace: "nowrap", letterSpacing: "0.02em",
          transition: "all 0.18s", fontFamily: "inherit",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {displayLabel}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s", opacity: 0.7 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && !disabled && (
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
                  fontSize: 12, color: active ? "#f87a7a" : "#b0bac8",
                  fontWeight: active ? 600 : 400, transition: "background 0.13s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = active ? "rgba(224,90,90,0.1)" : "transparent"; }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                  border: active ? `2px solid ${color}` : "2px solid rgba(255,255,255,0.2)",
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
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Request Edit Link Page ─────────────────────────────────────────────────────
function RequestEditLink() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const accentColor = "#e05a5a";

  const handleSend = async () => {
    const normalized = email.toLowerCase().trim();
    if (!normalized || !/\S+@\S+\.\S+/.test(normalized)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/job-alerts/edit-request-for-job-alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1a27 0%, #12202f 50%, #16253a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1.5px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "48px 40px",
        maxWidth: 440, width: "100%", textAlign: "center",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        animation: "fadeUp 0.4s ease",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(224,90,90,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
              stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {status === "success" ? (
          <>
            <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 700, color: "#edf2f8" }}>
              Check your inbox ✉️
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "#7a8fa6", lineHeight: 1.7 }}>
              We sent an edit link to <strong style={{ color: "#94a3b8" }}>{email}</strong>.<br />
              Click the link to update your job alert preferences.
            </p>
            <p style={{ margin: "16px 0 0", fontSize: 11, color: "#4a5c70" }}>
              The link expires in 1 hour.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#edf2f8" }}>
              Manage Job Alerts
            </h2>
            <p style={{ margin: "0 0 28px", fontSize: 13, color: "#7a8fa6", lineHeight: 1.6 }}>
              Enter the email you subscribed with. We'll send you a secure link to edit your preferences.
            </p>

            <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                disabled={status === "loading"}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.05)",
                  border: status === "error" ? "1.5px solid rgba(224,90,90,0.5)" : "1.5px solid rgba(255,255,255,0.1)",
                  borderRight: "none",
                  color: "#edf2f8", fontSize: 13,
                  borderRadius: "8px 0 0 8px",
                  padding: "11px 14px",
                  outline: "none", fontFamily: "inherit",
                  opacity: status === "loading" ? 0.6 : 1,
                }}
              />
              <button
                onClick={handleSend}
                disabled={status === "loading"}
                style={{
                  background: status === "loading" ? "rgba(224,90,90,0.5)" : `linear-gradient(135deg, ${accentColor}, #c0392b)`,
                  color: "#fff", border: "none",
                  padding: "11px 20px", borderRadius: "0 8px 8px 0",
                  fontWeight: 700, fontSize: 12,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  fontFamily: "inherit", whiteSpace: "nowrap",
                  boxShadow: status === "loading" ? "none" : "0 4px 14px rgba(224,90,90,0.35)",
                  minWidth: 100, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                {status === "loading" ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M7 1 A6 6 0 0 1 13 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : "Send Link →"}
              </button>
            </div>

            {status === "error" && errorMsg && (
              <p style={{ margin: "4px 0 0", fontSize: 11, color: accentColor, textAlign: "left" }}>
                {errorMsg}
              </p>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Edit Preferences Form ──────────────────────────────────────────────────────
function EditPreferencesForm({ token }) {
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [batch, setBatch] = useState([]);
  const [location, setLocation] = useState([]);
  const [workMode, setWorkMode] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading"); // loading | ready | tokenError
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const accentColor = "#e05a5a";

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/job-alerts/edit-job-alert?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Invalid token");

        setCategory(data.jobCategory || []);
        setSubCategory(data.jobRole || []);
        setBatch(data.eligibleBatches || []);
        setLocation(data.location || []);
        setWorkMode(data.workMode || []);
        setLoadStatus("ready");
      } catch (err) {
        setErrorMsg(err.message || "Invalid or expired link.");
        setLoadStatus("tokenError");
      }
    };

    fetchPrefs();
  }, [token]);

  const availableSubCats = [...new Set(category.flatMap((c) => SUB_CATEGORIES[c] || []))];

  const handleCategoryChange = (val) => {
    setCategory(val);
    setSubCategory((prev) => prev.filter((s) => val.flatMap((c) => SUB_CATEGORIES[c] || []).includes(s)));
  };

  const handleUpdate = async () => {
    setSaveStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/job-alerts/update-job-alert?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobCategory: category,
            jobRole: subCategory,
            location,
            workMode,
            eligibleBatches: batch,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setSaveStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
      setSaveStatus("error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1a27 0%, #12202f 50%, #16253a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #12202f 0%, #1a2d42 60%, #16253a 100%)",
        border: "1.5px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "36px 32px",
        maxWidth: 680, width: "100%",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        animation: "fadeUp 0.4s ease",
        position: "relative", overflow: "hidden",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200, borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(224,90,90,0.1) 0%, transparent 70%)",
        }} />

        {/* Loading */}
        {loadStatus === "loading" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
              style={{ animation: "spin 0.9s linear infinite", margin: "0 auto 16px", display: "block" }}>
              <circle cx="18" cy="18" r="15" stroke="rgba(224,90,90,0.2)" strokeWidth="3" />
              <path d="M18 3 A15 15 0 0 1 33 18" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p style={{ color: "#7a8fa6", fontSize: 14, margin: 0 }}>Loading your preferences...</p>
          </div>
        )}

        {/* Token Error */}
        {loadStatus === "tokenError" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(224,90,90,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M18 6L6 18" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 700, color: "#edf2f8" }}>
              Invalid or expired link
            </h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#7a8fa6" }}>
              {errorMsg}
            </p>
            <a href="/edit-job-alert-request" style={{
              display: "inline-block", background: `linear-gradient(135deg, ${accentColor}, #c0392b)`,
              color: "#fff", borderRadius: 10, padding: "11px 24px",
              fontWeight: 700, fontSize: 13, textDecoration: "none",
              boxShadow: "0 6px 20px rgba(224,90,90,0.3)",
            }}>
              Request a New Link
            </a>
          </div>
        )}

        {/* Edit Form */}
        {loadStatus === "ready" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: accentColor, textTransform: "uppercase" }}>
                  Edit Preferences
                </span>
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "#edf2f8" }}>
                Update Your Job Alerts
              </h2>
              <p style={{ margin: 0, fontSize: 12, color: "#7a8fa6" }}>
                Modify your preferences below and save to get better-matched alerts.
              </p>
            </div>

            {saveStatus === "success" ? (
              <div style={{
                padding: "20px 20px",
                background: "rgba(72,199,142,0.08)", border: "1.5px solid rgba(72,199,142,0.2)",
                borderRadius: 12, textAlign: "center",
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#48c78e", marginBottom: 6 }}>
                  Preferences updated successfully!
                </div>
                <div style={{ fontSize: 12, color: "#7a8fa6" }}>
                  Your job alerts have been updated. You'll receive notifications for matching roles.
                </div>
              </div>
            ) : (
              <>
                {/* Dropdowns */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  <MultiDropdown label="Category" options={CATEGORIES} selected={category} onChange={handleCategoryChange} disabled={saveStatus === "loading"} />
                  <MultiDropdown
                    label="Role / Domain"
                    options={availableSubCats.length > 0 ? availableSubCats : ["Select a category first"]}
                    selected={subCategory}
                    onChange={availableSubCats.length > 0 ? setSubCategory : () => {}}
                    disabled={saveStatus === "loading"}
                  />
                  <MultiDropdown label="Batch Year" options={BATCHES} selected={batch} onChange={setBatch} disabled={saveStatus === "loading"} />
                  <MultiDropdown label="Location" options={LOCATIONS} selected={location} onChange={setLocation} disabled={saveStatus === "loading"} />
                  <MultiDropdown label="Work Mode" options={WORK_MODES} selected={workMode} onChange={setWorkMode} disabled={saveStatus === "loading"} />
                </div>

                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={handleUpdate}
                    disabled={saveStatus === "loading"}
                    style={{
                      background: saveStatus === "loading" ? "rgba(224,90,90,0.5)" : `linear-gradient(135deg, ${accentColor}, #c0392b)`,
                      color: "#fff", border: "none",
                      padding: "11px 26px", borderRadius: 10,
                      fontWeight: 700, fontSize: 13,
                      cursor: saveStatus === "loading" ? "not-allowed" : "pointer",
                      fontFamily: "inherit", letterSpacing: "0.03em",
                      boxShadow: saveStatus === "loading" ? "none" : "0 6px 20px rgba(224,90,90,0.3)",
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "transform 0.15s, opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { if (saveStatus !== "loading") { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.opacity = "0.9"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
                  >
                    {saveStatus === "loading" ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                          <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                          <path d="M7 1 A6 6 0 0 1 13 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Saving...
                      </>
                    ) : "Save Preferences →"}
                  </button>

                  {saveStatus === "error" && (
                    <span style={{ fontSize: 12, color: accentColor }}>{errorMsg}</span>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Router: Edit Page Entry ────────────────────────────────────────────────────
export default function EditJobAlert() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // If no token → show "request edit link" form
  if (!token) {
    return <RequestEditLink />;
  }

  // If token present → show edit preferences form
  return <EditPreferencesForm token={token} />;
}