import { useState, useEffect, useRef } from "react";

const IT_ROLES = [
  "Software Developer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Cybersecurity Analyst",
  "QA / Test Engineer",
  "Mobile Developer",
  "Blockchain Developer",
  "UI/UX Designer",
  "Database Administrator",
  "Site Reliability Engineer",
  "Embedded Systems Engineer",
  "AI/ML Researcher",
];

const NON_IT_ROLES = [
  "Marketing Executive",
  "Sales Manager",
  "Business Analyst",
  "HR Manager",
  "Finance Analyst",
  "Operations Manager",
  "Content Writer",
  "Graphic Designer",
  "Supply Chain Manager",
  "Customer Support",
  "Product Manager",
  "Legal Advisor",
  "Civil Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Accountant",
  "Logistics Coordinator",
  "Healthcare Executive",
];

const LOCATIONS = [
  "All Locations",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Chennai",
  "Delhi / NCR",
  "Kolkata",
  "Ahmedabad",
  "Work From Home",
];

const PLACEHOLDERS = [
  "Search by company name...",
  "Search by job title...",
  "e.g. Google, Infosys...",
  "e.g. Software Developer...",
  "e.g. Amazon, TCS...",
  "e.g. Data Scientist...",
];

export default function JobSearchCard({ onSearch }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIdx, setCharIdx] = useState(0);

  const roles = category === "IT" ? IT_ROLES : category === "Non-IT" ? NON_IT_ROLES : [];

  // Animated placeholder typewriter
  useEffect(() => {
    const target = PLACEHOLDERS[placeholderIdx];
    if (isTyping) {
      if (charIdx < target.length) {
        const t = setTimeout(() => {
          setDisplayedPlaceholder(target.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        }, 48);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setIsTyping(false), 1400);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setDisplayedPlaceholder(target.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        }, 22);
        return () => clearTimeout(t);
      } else {
        setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
        setIsTyping(true);
      }
    }
  }, [charIdx, isTyping, placeholderIdx]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setRole("");
  };

const handleSearch = () => {

  console.log("JobSearchCard values:", {
    query,
    category,
    role,
    location
  });

  if (onSearch) {
    onSearch({
      query,
      category,
      role,
      location
    });
  }
};

  return (
    <>
      <style>{`
       @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .jsc-root {
          font-family: 'DM Sans', sans-serif;
        }

        .jsc-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 28px 28px 24px;
          width: 100%;
          max-width: 520px;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.07),
            0 4px 6px rgba(0,0,0,0.04),
            0 20px 48px rgba(0,0,0,0.07);
        }

        .jsc-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .jsc-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f0edfe;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .jsc-icon-wrap svg {
          width: 20px;
          height: 20px;
          stroke: #6d28d9;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .jsc-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 2px;
          letter-spacing: -0.2px;
        }

        .jsc-subtitle {
          font-size: 12.5px;
          color: #9ca3af;
          margin: 0;
          font-weight: 400;
        }

        .jsc-main-input-wrap {
          position: relative;
          margin-bottom: 14px;
        }

        .jsc-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          stroke: #9ca3af;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          pointer-events: none;
        }

        .jsc-main-input {
          width: 100%;
          padding: 13px 16px 13px 40px;
          border-radius: 12px;
          border: 1.5px solid #e9ebef;
          background: #f8f9fb;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s;
        }

        .jsc-main-input:focus {
          border-color: #7c3aed;
          background: #fff;
        }

        .jsc-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }

        .jsc-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .jsc-label {
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .jsc-select {
          width: 100%;
          padding: 10px 10px;
          border-radius: 10px;
          border: 1.5px solid #e9ebef;
          background: #f8f9fb;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #374151;
          outline: none;
          box-sizing: border-box;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 9px center;
          padding-right: 26px;
          cursor: pointer;
          transition: border-color 0.15s, background-color 0.15s;
        }

        .jsc-select:focus {
          border-color: #7c3aed;
          background-color: #fff;
        }

        .jsc-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .jsc-btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          border: none;
          background: #6d28d9;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: background 0.15s, transform 0.1s;
        }

        .jsc-btn:hover {
          background: #5b21b6;
        }

        .jsc-btn:active {
          transform: scale(0.99);
        }

        .jsc-btn svg {
          width: 15px;
          height: 15px;
          stroke: #fff;
          fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @media (max-width: 420px) {
          .jsc-card { padding: 20px 18px; border-radius: 16px; }
          .jsc-row { grid-template-columns: 1fr; gap: 8px; }
        }
      `}</style>

      <div className="jsc-root">
        <div className="jsc-card">
          {/* Header */}
          <div className="jsc-header">
            <div className="jsc-icon-wrap">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </div>
            <div>
              <p className="jsc-title">Job Search</p>
              <p className="jsc-subtitle">Find your next opportunity</p>
            </div>
          </div>

          {/* Main search bar */}
          <div className="jsc-main-input-wrap">
            <svg className="jsc-search-icon" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
              className="jsc-main-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={displayedPlaceholder}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Three dropdowns side by side */}
          <div className="jsc-row">
            <div className="jsc-field">
              <label className="jsc-label">Category</label>
              <select className="jsc-select" value={category} onChange={handleCategoryChange}>
                <option value="">All</option>
                <option value="IT">IT</option>
                <option value="Non-IT">Non-IT</option>
              </select>
            </div>

            <div className="jsc-field">
              <label className="jsc-label">Job Role</label>
              <select
                className="jsc-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={!category}
              >
                <option value="">All Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="jsc-field">
              <label className="jsc-label">Location</label>
              <select
                className="jsc-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search button */}
          <button className="jsc-btn" onClick={handleSearch}>
            Search Jobs
            <svg viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}