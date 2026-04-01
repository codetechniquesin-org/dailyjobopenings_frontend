import React, { useState, useEffect } from "react";
import  API_BASE_URL  from "../config/api";

const defaultColors = {
  accent: "#ff4d4f",
};

function AlertBar({ C = defaultColors }) {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [visible, setVisible] = useState(true);

  // 🔥 NEW STATE FOR API DATA
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  // 🔥 FETCH LATEST JOBS
  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/get-latest-jobs`);
        const data = await res.json();

        if (data.success) {
          setJobs(data.jobs);
        }
        // console.log("Fetched latest jobs:", data.jobs);
      } catch (err) {
        console.error("Error fetching latest jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  if (!visible) return null;

  // 🔥 FORMAT JOB TEXT
  const jobText =
    jobs.length > 0
      ? jobs.map((j) => j.companyName).join(", ")
      : "Top companies";

  return (
    <div
      style={{
        width: "100%",
        background: `linear-gradient(90deg, ${C.accent}, #c0392b)`,
        color: "#fff",
        fontSize: isMobile ? 11.5 : isTablet ? 12.5 : 13,
        position: "relative",
        zIndex: 99,
      }}
    >
      {/* ── Inner layout ── */}
      <div
        style={{
          width: "100%", // 🔥 FULL WIDTH FIX
          padding: isMobile ? "8px 36px 8px 12px" : "9px 48px 9px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "flex-start" : "center",
          gap: isMobile ? 6 : 10,
          flexWrap: "wrap",
        }}
      >
        {!isMobile && (
          <span style={{ fontSize: isTablet ? 14 : 15 }}>🎉</span>
        )}

        {/* 🔥 DYNAMIC MESSAGE */}
        <span
          style={{
            lineHeight: 1.45,
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          {loading
            ? "Loading latest jobs..."
            : isMobile
            ? `New jobs from ${jobText}!`
            : isTablet
            ? `🎉 New jobs added today from ${jobText}!`
            : `New jobs added today from ${jobText} — updated every hour!`}
        </span>

        {/* CTA */}
        <a
          href="#jobs"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.35)",
            padding: isMobile ? "2px 8px" : "3px 11px",
            borderRadius: 5,
            fontSize: isMobile ? 11 : 12.5,
            whiteSpace: "nowrap",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.28)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
          }
        >
          View Latest →
        </a>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss alert"
        style={{
          position: "absolute",
          top: "50%",
          right: isMobile ? 8 : 14,
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff",
          width: isMobile ? 20 : 24,
          height: isMobile ? 20 : 24,
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: isMobile ? 11 : 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default AlertBar;