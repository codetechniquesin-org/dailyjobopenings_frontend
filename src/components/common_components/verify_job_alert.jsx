import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";

export default function VerifyJobAlert() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setErrorMsg("No verification token found in the link.");
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/job-alerts/verify-job-alert?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setStatus("success");
      } catch (err) {
        setErrorMsg(err.message || "Invalid or expired link.");
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  const accentColor = "#e05a5a";
  const green = "#48c78e";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1a27 0%, #12202f 50%, #16253a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400, borderRadius: "50%", pointerEvents: "none",
        background: status === "success"
          ? "radial-gradient(circle, rgba(72,199,142,0.06) 0%, transparent 70%)"
          : status === "error"
          ? "radial-gradient(circle, rgba(224,90,90,0.06) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(224,90,90,0.04) 0%, transparent 70%)",
      }} />

      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1.5px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "48px 40px",
        maxWidth: 460,
        width: "100%",
        textAlign: "center",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        position: "relative",
        overflow: "hidden",
        animation: "fadeUp 0.4s ease",
      }}>

        {/* Loading State */}
        {status === "loading" && (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(224,90,90,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                style={{ animation: "spin 0.9s linear infinite" }}>
                <circle cx="14" cy="14" r="12" stroke="rgba(224,90,90,0.2)" strokeWidth="2.5" />
                <path d="M14 2 A12 12 0 0 1 26 14" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#edf2f8" }}>
              Verifying your email...
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "#7a8fa6", lineHeight: 1.6 }}>
              Please wait while we activate your job alerts.
            </p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(72,199,142,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M7 15L12.5 20.5L23 9" stroke={green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{
              display: "inline-block", background: "rgba(72,199,142,0.1)",
              border: "1px solid rgba(72,199,142,0.2)", borderRadius: 20,
              padding: "3px 12px", fontSize: 10, fontWeight: 700,
              color: green, letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 16,
            }}>
              Activated
            </div>
            <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 700, color: "#edf2f8" }}>
              Your job alerts are now active 🎉
            </h2>
            <p style={{ margin: "0 0 28px", fontSize: 13, color: "#7a8fa6", lineHeight: 1.7 }}>
              We'll notify you the moment a matching job drops. Keep an eye on your inbox!
            </p>
            <button
              onClick={() => navigate("/jobs")}
              style={{
                background: `linear-gradient(135deg, ${green}, #2fb37a)`,
                color: "#fff", border: "none",
                padding: "12px 28px", borderRadius: 10,
                fontWeight: 700, fontSize: 13,
                cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "0.03em",
                boxShadow: "0 6px 20px rgba(72,199,142,0.3)",
                transition: "transform 0.15s, opacity 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
            >
              Browse Jobs →
            </button>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(224,90,90,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M9 9L19 19M19 9L9 19" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{
              display: "inline-block", background: "rgba(224,90,90,0.1)",
              border: "1px solid rgba(224,90,90,0.2)", borderRadius: 20,
              padding: "3px 12px", fontSize: 10, fontWeight: 700,
              color: accentColor, letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 16,
            }}>
              Link Expired
            </div>
            <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 700, color: "#edf2f8" }}>
              Invalid or expired link
            </h2>
            <p style={{ margin: "0 0 28px", fontSize: 13, color: "#7a8fa6", lineHeight: 1.7 }}>
              {errorMsg || "This verification link has expired or is invalid."}<br />
              Please subscribe again to receive a new verification email.
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #c0392b)`,
                color: "#fff", border: "none",
                padding: "12px 28px", borderRadius: 10,
                fontWeight: 700, fontSize: 13,
                cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "0.03em",
                boxShadow: "0 6px 20px rgba(224,90,90,0.3)",
                transition: "transform 0.15s, opacity 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
            >
              Subscribe Again
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}