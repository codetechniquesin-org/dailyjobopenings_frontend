import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

const C = {
  primary: "#1e3a8a",
  accent: "#ef4444",
  gold: "#f5a623",
  light: "#f8fafc",
  green: "#16a34a",
  text: "#1e293b",
  muted: "#64748b",
  border: "#e2e8f0",
  purple: "#7c3aed",
  purpleLight: "#f3e8ff",
  purpleBorder: "#c4b5fd",
  purpleDark: "#4c1d95",
};

export default function WalkInJobDetail() {
  const { id } = useParams();

  console.log("ID:", id);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid Job ID");
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        setJob(null);
        setError(null);

        const res = await axios.get(`${API_BASE_URL}/api/walkin/${id}`);
        const jobData = res.data?.job;

        if (!jobData) {
          setError("Job not found");
        } else {
          setJob(jobData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Loading...</h2>;
  if (error) return <h2 style={{ textAlign: "center", marginTop: "100px", color: C.accent }}>{error}</h2>;
  if (!job) return <h2 style={{ textAlign: "center", marginTop: "100px" }}>No job data</h2>;

  return (
    <div className="walkin-full" style={{ width: "100%", background: C.light, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        
        .walkin-full {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
        }

        .walkin-hero {
          width: 100%;
          padding: 60px 20px;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4c1d95 100%);
          color: white;
          text-align: center;
        }

        .walkin-hero h1 {
          font-size: clamp(24px, 5vw, 40px);
          font-weight: 800;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .walkin-hero p {
          font-size: clamp(16px, 2vw, 20px);
          opacity: 0.9;
          font-weight: 500;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: -40px auto 60px;
          padding: 0 24px;
          position: relative;
          z-index: 10;
          text-align: left;
        }

        .detail-card { 
          background: #fff; 
          border-radius: 16px; 
          border: 1px solid ${C.border}; 
          padding: 32px; 
          margin-bottom: 24px; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
          width: 100%;
        }

        .badge { padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .badge-hot { background: #fee2e2; color: #b91c1c; }
        .badge-verified { background: #dcfce7; color: #15803d; }
        
        .info-label { font-size: 13px; color: ${C.muted}; margin-bottom: 6px; font-weight: 500; }
        .info-value { font-size: 16px; color: ${C.text}; font-weight: 600; }
        
        .salary-box { 
          background: #f5f3ff; 
          border: 1.5px solid #c4b5fd; 
          border-radius: 12px; 
          padding: 16px 24px; 
          text-align: center; 
          min-width: 180px; 
        }

        .apply-btn {
          background: #1e3a8a;
          color: #fff;
          padding: 16px 48px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 18px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(30, 58, 138, 0.3);
        }

        .apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
        }

        @media (max-width: 768px) {
          .header-flex { flex-direction: column; align-items: center; text-align: center; }
          .salary-box { margin-top: 20px; width: 100%; }
          .content-wrapper { margin-top: -20px; padding: 0 16px; }
          .detail-card { padding: 20px; }
        }
      `}</style>

      {/* TASK 2: HERO SECTION */}
      <div className="walkin-hero">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
            &nbsp;›&nbsp;
            <Link to="/walk-in-drive" style={{ color: "white", textDecoration: "none" }}>Walk-In Drives</Link>
          </div>
          <h1>{job?.jobTitle}</h1>
          <p>{job?.companyName} • {job?.location}</p>
        </div>
      </div>

      {/* TASK 3: CONTENT WRAPPER */}
      <div className="content-wrapper">
        
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          
          {/* Main Info Card */}
          <div className="detail-card">
            <div className="header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}`, flexShrink: 0 }}>
                  {job?.companyLogo ? (
                    <img src={job?.companyLogo} alt={job?.companyName} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: 32, fontWeight: 800, color: C.primary }}>{job?.companyName?.charAt(0)}</span>
                  )}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    {job?.isHot && <span className="badge badge-hot">🔥 Hot Drive</span>}
                    {job?.isVerified && <span className="badge badge-verified">✅ Verified</span>}
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>{job?.jobTitle}</h2>
                  <p style={{ fontSize: 16, color: C.purple, fontWeight: 600 }}>{job?.companyName}</p>
                </div>
              </div>
              
              <div className="salary-box">
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 4, letterSpacing: "0.5px" }}>ESTIMATED SALARY</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.purple }}>{job?.salary || "Not Specified"}</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="detail-card">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
              <div>
                <div className="info-label">📍 Interview Location</div>
                <div className="info-value">{job?.location}</div>
              </div>
              <div>
                <div className="info-label">📅 Walk-In Date</div>
                <div className="info-value">
                  {job?.walkInDate ? new Date(job?.walkInDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "TBA"}
                </div>
              </div>
              <div>
                <div className="info-label">🏠 Work Mode</div>
                <div className="info-value">{job?.workMode || "On-site"}</div>
              </div>
              <div>
                <div className="info-label">🎓 Eligibility</div>
                <div className="info-value">{job?.batch || "Any Graduate"}</div>
              </div>
            </div>
          </div>

          {/* Detailed Info Section */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
            
            {/* Description */}
            <div className="detail-card">
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: C.text, borderBottom: `2px solid ${C.purple}`, display: "inline-block", paddingBottom: "4px" }}>
                Job Description
              </h3>
              <div style={{ color: "#4b5563", lineHeight: 1.8, fontSize: 15, whiteSpace: "pre-line" }}>
                {job?.description || "No description available."}
              </div>
              
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: "32px 0 20px", color: C.text, borderBottom: `2px solid ${C.purple}`, display: "inline-block", paddingBottom: "4px" }}>
                Skills & Requirements
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {Array.isArray(job?.skills) && job?.skills.length > 0 ? (
                  job?.skills.map((s, i) => (
                    <span key={i} style={{ background: "#f3f4f6", color: C.text, padding: "6px 16px", borderRadius: "8px", fontSize: 14, fontWeight: 600, border: `1px solid ${C.border}` }}>
                      {s}
                    </span>
                  ))
                ) : (
                  <span style={{ color: C.muted }}>N/A</span>
                )}
              </div>
            </div>

            {/* Venue & Contact */}
            <div className="detail-card" style={{ background: "#fdfcfe", border: `1px solid ${C.purpleBorder}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>📍</span>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.purpleDark, margin: 0 }}>Walk-In Venue</h3>
              </div>
              <p style={{ color: C.text, fontSize: 16, lineHeight: 1.7, fontWeight: 500, background: "#fff", padding: "16px", borderRadius: "12px", border: `1px solid ${C.border}` }}>
                {job?.venue || "To be shared via official communication."}
              </p>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: C.muted }}>
                <span style={{ fontWeight: 700, color: C.purple }}>Contact Person:</span>
                <span style={{ color: C.text, fontWeight: 600 }}>{job?.contactDetails || "N/A"}</span>
              </div>
            </div>

          </div>

          {/* Action Area */}
          <div style={{ textAlign: "center", marginTop: 40, marginBottom: 40 }}>
            {!job?.applyLink ? (
               <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "16px", borderRadius: "12px", display: "inline-block", fontWeight: 600 }}>
                 ⚠️ No online registration link provided for this drive.
               </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <p style={{ color: C.muted, fontSize: 14 }}>Click below to register for the walk-in drive officially</p>
                <a href={job?.applyLink} target="_blank" rel="noopener noreferrer">
                  <button className="apply-btn">
                    Register for Walk-In →
                  </button>
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
