import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import JobCardList from "../components/home_page_components/Job_card_component";
import AlertBar from "../components/alertbar.jsx";
import TopTicker from "../components/topticker.jsx";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import MainLayout from "../components/common_components/MainLayout.jsx";
import ReusableJobGrid from "../components/common_components/ReusableJobGrid.jsx";

const JOBS_PER_PAGE = 12;

const S = {
  primary: "#0f4c81",
  accent: "#e8472a",
  gold: "#f5a623",
  light: "#f0f4f9",
  text: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  purple: "#6d28d9",
  purpleLight: "#ede9fe",
  card: "#ffffff",
};

const C = {
  primary: "#0f4c81",
  accent: "#e8472a",
  gold: "#f5a623",
  light: "#f0f4f9",
  green: "#16a34a",
  text: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
};

function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return {
    w,
    isMobile: w < 640,
    isTablet: w >= 640 && w < 1024,
    isDesktop: w >= 1024,
    showSidebar: w >= 1024,
  };
}

function SkeletonCard() {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: 20,
      border: `1px solid ${S.border}`, animation: "srPulse 1.4s ease-in-out infinite",
    }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#e5e7eb", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, background: "#e5e7eb", borderRadius: 4, marginBottom: 8, width: "70%" }} />
          <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4, width: "45%" }} />
        </div>
      </div>
      <div style={{ height: 11, background: "#f3f4f6", borderRadius: 4, marginBottom: 6 }} />
      <div style={{ height: 11, background: "#f3f4f6", borderRadius: 4, width: "80%", marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 8 }}>
        {[60, 80, 55].map((w, i) => (
          <div key={i} style={{ height: 22, width: w, background: "#f3f4f6", borderRadius: 20 }} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ query }) {
  return (
    <div style={{
      gridColumn: "1 / -1", textAlign: "center",
      padding: "80px 24px", background: "#fff",
      borderRadius: 20, border: `1px solid ${S.border}`,
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24, background: S.purpleLight,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px", fontSize: 36,
      }}>🔍</div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800,
        color: S.text, margin: "0 0 10px",
      }}>No results found</h3>
      <p style={{ color: S.muted, fontSize: 14, lineHeight: 1.8, maxWidth: 380, margin: "0 auto 28px" }}>
        {query
          ? <>We couldn't find jobs matching <strong style={{ color: S.text }}>"{query}"</strong>. Try different keywords.</>
          : "No jobs match your current filters. Try removing some filters."}
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {["Software Developer", "Fresher Jobs", "Work From Home", "Data Analyst"].map(s => (
          <span key={s} style={{
            background: S.purpleLight, color: S.purple, padding: "6px 14px",
            borderRadius: 20, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
          }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const btnBase = {
    width: 38, height: 38, borderRadius: 10,
    border: `1.5px solid ${S.border}`,
    background: "#fff", color: S.text,
    fontSize: 14, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Syne', sans-serif", fontWeight: 600,
    transition: "all 0.15s",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 44, flexWrap: "wrap" }}>
      <button
        onClick={() => onPageChange(page - 1)} disabled={page === 1}
        style={{ ...btnBase, opacity: page === 1 ? 0.35 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
      >‹</button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`d${i}`} style={{ color: S.muted, padding: "0 4px", fontSize: 14 }}>···</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p)} style={{
            ...btnBase,
            border: `1.5px solid ${p === page ? S.purple : S.border}`,
            background: p === page ? S.purple : "#fff",
            color: p === page ? "#fff" : S.text,
            fontWeight: p === page ? 700 : 500,
          }}>{p}</button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        style={{ ...btnBase, opacity: page === totalPages ? 0.35 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
      >›</button>
    </div>
  );
}

/* ─── Sidebar components ─── */

function AlertWidget({ query }) {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <div style={{
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      borderRadius: 18, padding: "24px 22px", color: "#fff", marginBottom: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: "rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 14,
      }}>🔔</div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800,
        margin: "0 0 6px", color: "#fff",
      }}>Get Job Alerts</h3>
      <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", margin: "0 0 16px", lineHeight: 1.6 }}>
        {query ? <>New <strong style={{ color: "#c4b5fd" }}>"{query}"</strong> jobs straight to your inbox</> : "Be the first to know about new opportunities."}
      </p>
      {saved ? (
        <div style={{
          background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 14px",
          fontSize: 13, fontWeight: 600, textAlign: "center", color: "#a7f3d0",
        }}>✓ Alert created!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 10, padding: "9px 12px", color: "#fff",
              fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
            }}
          />
          <button
            onClick={() => email && setSaved(true)}
            style={{
              background: "#a78bfa", border: "none", borderRadius: 10,
              padding: "10px", fontSize: 13, fontWeight: 700,
              color: "#1e1b4b", cursor: "pointer", width: "100%",
            }}
          >Create Alert →</button>
        </div>
      )}
    </div>
  );
}

function TrendingRoles({ navigate }) {
  const roles = [
    { title: "Full Stack Developer", count: "2.4k jobs", icon: "💻", hot: true },
    { title: "Data Scientist", count: "1.8k jobs", icon: "📊", hot: true },
    { title: "Product Manager", count: "1.2k jobs", icon: "🎯" },
    { title: "DevOps Engineer", count: "980 jobs", icon: "⚙️" },
    { title: "UI/UX Designer", count: "760 jobs", icon: "🎨" },
    { title: "Cloud Architect", count: "640 jobs", icon: "☁️" },
  ];
  return (
    <div style={{
      background: "#fff", borderRadius: 18, padding: "20px 20px",
      border: `1px solid ${S.border}`, marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{
          fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800,
          color: S.text, margin: 0,
        }}>Trending Roles</h3>
        <span style={{
          background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 700,
          padding: "2px 8px", borderRadius: 20,
        }}>🔥 HOT</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {roles.map((r, i) => (
          <div
            key={r.title}
            onClick={() => navigate(`/search?role=${encodeURIComponent(r.title)}`)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 12px", borderRadius: 10,
              background: i === 0 ? "#faf5ff" : "#f8fafc",
              border: `1px solid ${i === 0 ? "#e9d5ff" : "transparent"}`,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{r.icon}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: S.text }}>{r.title}</span>
              {r.hot && <span style={{
                background: "#fee2e2", color: "#ef4444", fontSize: 9, fontWeight: 700,
                padding: "1px 6px", borderRadius: 20,
              }}>HOT</span>}
            </div>
            <span style={{ fontSize: 11, color: S.muted, fontWeight: 500 }}>{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopCompanies() {
  const companies = [
    { name: "Google", logo: "G", color: "#4285f4", roles: 340 },
    { name: "Microsoft", logo: "M", color: "#00a4ef", roles: 280 },
    { name: "Amazon", logo: "A", color: "#ff9900", roles: 520 },
    { name: "Flipkart", logo: "F", color: "#2874f0", roles: 160 },
    { name: "Infosys", logo: "I", color: "#007cc2", roles: 890 },
  ];
  return (
    <div style={{
      background: "#fff", borderRadius: 18, padding: "20px 20px",
      border: `1px solid ${S.border}`, marginBottom: 16,
    }}>
      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800,
        color: S.text, margin: "0 0 14px",
      }}>Actively Hiring</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {companies.map(c => (
          <div key={c.name} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
            borderRadius: 10, cursor: "pointer",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: c.color + "18",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: c.color, flexShrink: 0,
            }}>{c.logo}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>{c.name}</div>
              <div style={{ fontSize: 11, color: S.muted }}>{c.roles} open roles</div>
            </div>
            <span style={{ fontSize: 11, color: S.purple, fontWeight: 600 }}>View →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalaryInsight({ query }) {
  const salaries = [
    { level: "Entry", range: "₹3–6 LPA", bar: 35 },
    { level: "Mid", range: "₹8–15 LPA", bar: 65 },
    { level: "Senior", range: "₹18–35 LPA", bar: 90 },
  ];
  return (
    <div style={{
      background: "#fff", borderRadius: 18, padding: "20px 20px",
      border: `1px solid ${S.border}`, marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>💰</span>
        <h3 style={{
          fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800,
          color: S.text, margin: 0,
        }}>Salary Insights</h3>
      </div>
      <p style={{ fontSize: 11.5, color: S.muted, margin: "0 0 14px" }}>
        {query ? `For "${query}" roles in India` : "Average across all roles"}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {salaries.map(s => (
          <div key={s.level}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: S.text }}>{s.level}</span>
              <span style={{ fontSize: 12, color: S.muted }}>{s.range}</span>
            </div>
            <div style={{
              height: 6, borderRadius: 4, background: "#f1f5f9", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: `${s.bar}%`,
                background: `linear-gradient(90deg, #6d28d9, #a78bfa)`,
                transition: "width 0.8s ease",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickLinks({ navigate }) {
  const links = [
    { label: "Work From Home", icon: "🏠", q: "work from home" },
    { label: "Fresher Jobs", icon: "🎓", q: "fresher" },
    { label: "Walk-in Interviews", icon: "🚶", q: "walk in" },
    { label: "Part Time", icon: "⏱", q: "part time" },
    { label: "Internships", icon: "📎", q: "internship" },
    { label: "Government Jobs", icon: "🏛", q: "government" },
  ];
  return (
    <div style={{
      background: "#fff", borderRadius: 18, padding: "20px 20px",
      border: `1px solid ${S.border}`,
    }}>
      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800,
        color: S.text, margin: "0 0 14px",
      }}>Quick Searches</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {links.map(l => (
          <span
            key={l.label}
            onClick={() => navigate(`/search?q=${encodeURIComponent(l.q)}`)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "#f8fafc", border: `1px solid ${S.border}`,
              color: S.text, padding: "6px 12px", borderRadius: 20,
              fontSize: 12, fontWeight: 500, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = S.purpleLight;
              e.currentTarget.style.borderColor = "#c4b5fd";
              e.currentTarget.style.color = S.purple;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = S.border;
              e.currentTarget.style.color = S.text;
            }}
          >
            <span>{l.icon}</span>{l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Hero section ─── */
function HeroSection({ query, category, role, location, jobs, loading }) {
  const label = query || role || category || "All Jobs";
  const locationLabel = location && location !== "All Locations" ? location : "India";

  return (
    <div style={{
      position: "relative",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f4c81 100%)",
      overflow: "hidden",
      padding: "48px 0 56px",
      marginBottom: 0,
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: -60, right: -60,
        width: 300, height: 300, borderRadius: "50%",
        background: "rgba(167,139,250,0.12)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: "30%",
        width: 400, height: 400, borderRadius: "50%",
        background: "rgba(56,189,248,0.07)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "20%", left: "-40px",
        width: 200, height: 200, borderRadius: "50%",
        background: "rgba(109,40,217,0.1)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        {/* Breadcrumb */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 20,
        }}>
          <span style={{ color: "#a78bfa", fontWeight: 600, cursor: "pointer" }}>Home</span>
          <span>›</span>
          <span>Search Results</span>
          {label !== "All Jobs" && <><span>›</span><span style={{ color: "rgba(255,255,255,0.8)" }}>{label}</span></>}
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          {/* Left content */}
          <div style={{ flex: 1, minWidth: 280 }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(167,139,250,0.2)", border: "1px solid rgba(167,139,250,0.3)",
              borderRadius: 20, padding: "5px 14px", marginBottom: 18,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: loading ? "#94a3b8" : "#4ade80",
                display: "inline-block",
                animation: loading ? "none" : "heroPulse 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#c4b5fd" }}>
                {loading ? "Searching database…" : `Live results for "${label}"`}
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 900, color: "#fff",
              margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-0.02em",
            }}>
              {loading ? (
                <span style={{ opacity: 0.5 }}>Finding your perfect<br />match…</span>
              ) : (
                <>
                  <span style={{
                    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>
                    {jobs.length.toLocaleString()}
                  </span>
                  {" "}Jobs in<br />
                  <span style={{ color: "#fff" }}>{locationLabel}</span>
                </>
              )}
            </h1>

            <p style={{
              fontSize: 15, color: "rgba(255,255,255,0.65)",
              margin: "0 0 28px", lineHeight: 1.7, maxWidth: 480,
            }}>
              {category && <span style={{ color: "#93c5fd" }}>{category} · </span>}
              {role && <span style={{ color: "#c4b5fd" }}>{role} · </span>}
              Showing opportunities updated daily — apply before they close.
            </p>

            {/* Hero stats row */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { value: loading ? "—" : jobs.length.toLocaleString(), label: "Results", color: "#a78bfa" },
                { value: "Daily", label: "Updated", color: "#60a5fa" },
                { value: "Free", label: "Apply", color: "#4ade80" },
              ].map(st => (
                <div key={st.label} style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, padding: "12px 18px",
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 20,
                    fontWeight: 900, color: st.color, lineHeight: 1,
                  }}>{st.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{st.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating illustration card */}
          <div style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20, padding: "22px 24px",
            backdropFilter: "blur(16px)",
            minWidth: 240, maxWidth: 280,
            flexShrink: 0,
            animation: "heroFloat 4s ease-in-out infinite",
          }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              📍 Top locations
            </div>
            {["Bangalore", "Hyderabad", "Mumbai", "Delhi NCR", "Pune"].map((city, i) => (
              <div key={city} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 0",
                borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{city}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: ["#a78bfa", "#60a5fa", "#4ade80", "#fbbf24", "#f87171"][i],
                  background: "rgba(255,255,255,0.06)",
                  padding: "2px 8px", borderRadius: 20,
                }}>
                  {["12.4k", "9.8k", "8.2k", "7.1k", "5.6k"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function SearchResults() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topRef = useRef(null);
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop, showSidebar } = bp;

  const q        = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const role     = searchParams.get("role") || "";
  const location = searchParams.get("location") || "";

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setPage(1);
      try {
        const res  = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/job-search-using-fields?${searchParams.toString()}`);
        const data = await res.json();
        setJobs(data.data || []);
      } catch (err) {
        console.error(err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchParams]);

  const totalPages    = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const paginatedJobs = jobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);
  const start         = (page - 1) * JOBS_PER_PAGE + 1;
  const end           = Math.min(page * JOBS_PER_PAGE, jobs.length);

  const activeTags = [
    q        && { label: q,        key: "q" },
    category && { label: category, key: "category" },
    role     && { label: role,     key: "role" },
    location && location !== "All Locations" && { label: location, key: "location" },
  ].filter(Boolean);

  const removeTag = (key) => {
    const p = new URLSearchParams(searchParams);
    p.delete(key);
    navigate(`/search?${p.toString()}`);
  };

  const handlePageChange = (p) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <MainLayout isMobile={isMobile} isDesktop={isDesktop} C={C} bp={bp}>
      <>
        <style>{`
          .sr-grid {
            display: grid;
            gap: 16px;
            grid-template-columns: repeat(3, 1fr);
          }
          @media (max-width: 1279px) { .sr-grid { grid-template-columns: repeat(2,1fr); } }
          @media (max-width: 639px)  { .sr-grid { grid-template-columns: 1fr; } }

          @keyframes srPulse {
            0%,100% { opacity: 1; } 50% { opacity: 0.45; }
          }
          @keyframes srFadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes heroPulse {
            0%,100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.3); }
          }
          @keyframes heroFloat {
            0%,100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          .sr-card-enter { animation: srFadeUp 0.35s ease both; }
          .sr-tag:hover { background: #fecaca !important; color: #b91c1c !important; }
          .sr-back:hover { border-color: ${S.purple} !important; color: ${S.purple} !important; }

          html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }
          #root { width: 100% !important; overflow-x: hidden !important; }
        `}</style>

        <div style={{
          width: "100%", minHeight: "100vh",
          background: S.light,
          fontFamily: "'DM Sans', sans-serif",
          color: S.text,
        }}>

          {/* ── HERO SECTION ── */}
          <HeroSection
            query={q} category={category} role={role}
            location={location} jobs={jobs} loading={loading}
          />

          {/* ── Sticky results header ── */}
          <div ref={topRef} style={{
            position: "sticky", top: 0, zIndex: 20,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${S.border}`,
            padding: "12px 24px",
            boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ maxWidth: 1400, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800,
                      color: S.text, margin: 0,
                    }}>
                      {loading
                        ? "Searching…"
                        : <><span style={{ color: S.purple }}>{jobs.length.toLocaleString()}</span> Jobs Found</>}
                    </h2>
                    {!loading && jobs.length > 0 && (
                      <span style={{ fontSize: 12, color: S.muted }}>
                        Showing {start}–{end} of {jobs.length.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Filter tags */}
                  {activeTags.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      {activeTags.map(tag => (
                        <span
                          key={tag.key}
                          className="sr-tag"
                          onClick={() => removeTag(tag.key)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            background: S.purpleLight, color: S.purple,
                            padding: "4px 10px 4px 12px", borderRadius: 20,
                            fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                          }}
                        >
                          {tag.label}
                          <span style={{
                            width: 14, height: 14, borderRadius: "50%",
                            background: "rgba(109,40,217,0.18)",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, fontWeight: 800,
                          }}>✕</span>
                        </span>
                      ))}
                      {activeTags.length > 1 && (
                        <span
                          onClick={() => navigate("/search")}
                          style={{
                            display: "inline-flex", alignItems: "center",
                            background: "#fee2e2", color: "#b91c1c",
                            padding: "4px 12px", borderRadius: 20,
                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                          }}
                        >Clear all ✕</span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  className="sr-back"
                  onClick={() => navigate(-1)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "transparent", border: `1.5px solid ${S.border}`,
                    borderRadius: 10, padding: "7px 14px",
                    fontSize: 13, fontWeight: 600, color: S.muted,
                    cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                >← Back</button>
              </div>
            </div>
          </div>

          {/* ── Page body: two-column layout ── */}
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px 72px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: showSidebar ? "1fr 300px" : "1fr",
              gap: 28,
              alignItems: "start",
            }}>

              {/* ── LEFT: Job results ── */}
              <div>
                {/* Stats strip */}
                {!loading && jobs.length > 0 && (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                    {[
                      { label: "Total results", value: jobs.length.toLocaleString(), color: S.purple },
                      { label: "This page",     value: paginatedJobs.length,          color: S.primary },
                      { label: "Total pages",   value: totalPages,                    color: "#059669" },
                      { label: "Per page",      value: JOBS_PER_PAGE,                color: S.muted },
                    ].map(st => (
                      <div key={st.label} style={{
                        background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`,
                        padding: "9px 16px", display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <strong style={{
                          fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: st.color,
                        }}>{st.value}</strong>
                        <span style={{ fontSize: 12, color: S.muted }}>{st.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid */}
                {loading ? (
                  <div className="sr-grid">
                    {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="sr-grid"><EmptyState query={q} /></div>
                ) : (
                  <ReusableJobGrid jobs={paginatedJobs} />
                )}

                {/* Pagination */}
                {!loading && <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />}

                {!loading && jobs.length > 0 && (
                  <p style={{ textAlign: "center", fontSize: 12.5, color: S.muted, marginTop: 14 }}>
                    Showing {start}–{end} of {jobs.length.toLocaleString()} jobs
                  </p>
                )}
              </div>

              {/* ── RIGHT: Sidebar ── */}
              {showSidebar && (
                <div style={{ position: "sticky", top: 72 }}>
                  <AlertWidget query={q || role || category} />
                  <TrendingRoles navigate={navigate} />
                  <TopCompanies />
                  <SalaryInsight query={q || role} />
                  <QuickLinks navigate={navigate} />
                </div>
              )}
            </div>
          </div>

          <Footer />
        </div>
      </>
    </MainLayout>
  );
}