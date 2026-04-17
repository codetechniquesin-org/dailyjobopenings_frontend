import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";

const C = {
  primary: "#0f4c81",
  accent: "#e8472a",
  gold: "#f5a623",
  light: "#f4f7fb",
  green: "#16a34a",
  text: "#1a1a2e",
  muted: "#6b7280",
  border: "#e2e8f0",
};

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `1px solid ${C.border}`,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SidebarWidget({ title, children }) {
  return (
    <Card style={{ marginBottom: 14 }}>
      <div
        style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 14,
          color: C.text,
        }}
      >
        {title}
      </div>
      {children}
    </Card>
  );
}

function SimilarJobs({ jobId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch similar jobs
  useEffect(() => {
    if (!jobId) return;

    const fetchSimilarJobs = async () => {
      try {
        // console.log("Received jobId:", jobId);
        const res = await fetch(`${API_BASE_URL}/api/similar-jobs/${jobId}`);
        const data = await res.json();

        if (data.success) {
          setJobs(data.jobs);
        }
      } catch (err) {
        console.error("Error fetching similar jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarJobs();
  }, [jobId]);

  return (
    <SidebarWidget title="🔍 Similar Jobs">
      {loading ? (
        <div style={{ fontSize: 12, color: C.muted }}>
          Loading similar jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ fontSize: 12, color: C.muted }}>
          No similar jobs found
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {jobs.map((j) => (
            <a
              key={j._id}
              href={`/view-job/${j.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                gap: 10,
                padding: 10,
                borderRadius: 9,
                border: `1px solid ${C.border}`,
                textDecoration: "none",
              }}
            >
              {/* Logo fallback */}
<div
  style={{
    width: 34,
    height: 34,
    borderRadius: 8,
    background: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  }}
>
  {j.companyLogo ? (
    <img
      src={j.companyLogo}
      alt={j.companyName}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
  ) : (
    <span style={{ fontWeight: 700, fontSize: 13 }}>
      {j.companyName?.[0] || "J"}
    </span>
  )}
</div>

              <div>
                <strong
                  style={{
                    fontSize: 13,
                    display: "block",
                    color: C.text,
                  }}
                >
                  {j.jobTitle}
                </strong>

                <span
                  style={{
                    fontSize: 11.5,
                    color: C.muted,
                  }}
                >
                  {j.companyName} · {j.salary}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      <a
        href="/jobs"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: 12,
          fontSize: 12.5,
          color: C.primary,
          fontWeight: 600,
        }}
      >
        View All Software Jobs →
      </a>
    </SidebarWidget>
  );
}

export default SimilarJobs;