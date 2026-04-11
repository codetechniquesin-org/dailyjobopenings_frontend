// import React from "react";
// import { Link } from "react-router-dom";

// function TopTicker({ isMobile, isDesktop, C, gutter }) {
//   // if (isMobile) return null;

//   return (
//     <div style={{ background: C.primary, color: "#fff", fontSize: 11.5, padding: "5px 0" }}>
//       <div
//         style={{
//           Width: "100%",
//           margin: "0 auto",
//           padding: `0 ${gutter}`,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 16,
//         }}
//       >
//         {/* Left Section */}
//         <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", flex: 1 }}>
//           <span
//             style={{
//               background: C.accent,
//               color: "#fff",
//               borderRadius: 3,
//               padding: "1px 8px",
//               fontWeight: 700,
//               fontSize: 10,
//               whiteSpace: "nowrap",
//             }}
//           >
//             🔥 HOT
//           </span>

//           <div className="ticker-outer">
//             <span className="ticker-inner">
//               TCS BPS Hiring 2026 &nbsp;|&nbsp; Amazon WFH &nbsp;|&nbsp; Wipro NLTH 2026 &nbsp;|&nbsp;
//               Infosys Systems Engineer &nbsp;|&nbsp; Google Internship 2026 &nbsp;|&nbsp;
//               Deloitte Fresher Drive &nbsp;|&nbsp; Accenture Off Campus &nbsp;|&nbsp; Red Hat ASE 2026
//             </span>
//           </div>
//         </div>

//         {/* Right Section */}
// {isDesktop && (
//   <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
//     {[
//       { label: "About", path: "/about-us" },
//       { label: "Contact", path: "/contact-us" },
//       { label: "Privacy", path: "/privacy" }
//     ].map((item) => (
//       <Link
//         key={item.label}
//         to={item.path}
//         style={{ color: "#c8d8ea", textDecoration: "none" }}
//       >
//         {item.label}
//       </Link>
//     ))}

//     <Link
//       to="/advertise-with-us"
//       style={{ color: C.gold, fontWeight: 600, textDecoration: "none" }}
//     >
//       Advertise With Us
//     </Link>
//   </div>
// )}
//       </div>
//     </div>
//   );
// }

// export default TopTicker;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

function TopTicker({ isMobile, isDesktop, C, gutter }) {
  const [tickerJobs, setTickerJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ticker jobs from backend
  useEffect(() => {
    const fetchTickerJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/top-ticker-jobs`);
        const data = await response.json();

        if (data.success) {
          setTickerJobs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch ticker jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickerJobs();

    // Auto refresh every 5 minutes
    const interval = setInterval(fetchTickerJobs, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: C.primary,
        color: "#fff",
        fontSize: 11.5,
        padding: "5px 0",
      }}
    >
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          padding: `0 ${gutter}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Left Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            overflow: "hidden",
            flex: 1,
          }}
        >
          <span
            style={{
              background: C.accent,
              color: "#fff",
              borderRadius: 3,
              padding: "1px 8px",
              fontWeight: 700,
              fontSize: 10,
              whiteSpace: "nowrap",
            }}
          >
            🔥 HOT
          </span>

          <div className="ticker-outer">
            <div className="ticker-inner">
              {loading ? (
                <span>Loading latest jobs...</span>
              ) : tickerJobs.length > 0 ? (
                tickerJobs.map((job, index) => (
                  <React.Fragment key={job.slug}>
                    <Link
                      to={`/view-job/${job.slug}`}
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        marginRight: "20px",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                      }}
                    >
                      {job.title}
                    </Link>
                    {index < tickerJobs.length - 1 && (
                      <span style={{ marginRight: "20px" }}>|</span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span>No live hiring updates available</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        {isDesktop && (
          <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
            {[
              { label: "About", path: "/about-us" },
              { label: "Contact", path: "/contact-us" },
              { label: "Privacy", path: "/privacy" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ color: "#c8d8ea", textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/advertise-with-us"
              style={{
                color: C.gold,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Advertise With Us
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopTicker;