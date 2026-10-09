import { useState } from "react";

const studyMaterials = [
  {
    id: 1,
    title: "Java Interview Questions and Answers",
    description:
      "200+ commonly asked Java interview questions with detailed answers, covering core concepts, OOP principles, and practical coding problems.",
    link: "https://www.geeksforgeeks.org/java/java-interview-questions/",
    tag: "Most Asked Questions",
  },
  {
    id: 2,
    title: "System Design Interview Questions",
    description:
      "In-depth system design interview questions and case studies, including scalable architecture patterns, database design, and real-world problem-solving scenarios.",
    link: "https://www.interviewbit.com/system-design-interview-questions/",
    tag: "System Design Interview Questions",
  },
  {
    id: 3,
    title: "HR Interview Questions and Answers",
    description:
      "Comprehensive list of HR interview questions with expert answers, covering topics like teamwork, conflict resolution, and career aspirations to help you prepare for the HR round.",
    link: "https://www.ambitionbox.com/skills/hr-interview-questions",
    tag: "HR Interview Questions",
  },
  {
    id: 4,
    title: "Free Resume Templates for Freshers",
    description:
      "Professionally designed resume templates tailored for freshers, featuring clean layouts and sections optimized for management trainee and analyst roles.",
    link: "https://www.overleaf.com/latex/templates/tagged/cv",
    tag: "Resume Templates",
  },
  {
    id: 5,
    title: "Important Aptitude Topics For Campus Placements",
    description:
      "A curated list of essential aptitude topics for campus placements, including quantitative aptitude, logical reasoning, and verbal ability, with practice questions and tips.",
    link: "https://prepinsta.com/complete-aptitude-preparation/?logout=1780674842868",
    tag: "Aptitude Preparation",
  },
];

const tagColors = {
  Aptitude: { bg: "#dbeafe", text: "#1d4ed8" },
  Interview: { bg: "#e0f2fe", text: "#0369a1" },
  HR: { bg: "#ede9fe", text: "#6d28d9" },
  Logical: { bg: "#dbeafe", text: "#1e40af" },
  Career: { bg: "#e0e7ff", text: "#4338ca" },
};

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 17L17 7M17 7H7M17 7v10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease",
    }}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const VISIBLE_COUNT = 3;

export default function StudyMaterials() {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? studyMaterials : studyMaterials.slice(0, VISIBLE_COUNT);
  const hiddenCount = studyMaterials.length - VISIBLE_COUNT;

  const handleRedirect = (link) => {
    // Replace with your router: navigate(link) or window.location.href = link
    window.location.href = link;
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>📚</span>
        <span style={styles.headerText}>
          FREE STUDY MATERIALS ({studyMaterials.length})
        </span>
      </div>

      {/* Cards */}
      <div style={styles.list}>
        {visibleItems.map((item, index) => {
          const tag = tagColors[item.tag] || { bg: "#f0f0f0", text: "#555" };
          return (
            <div
              key={item.id}
              style={{
                ...styles.card,
                animationDelay: `${index * 60}ms`,
              }}
              className="study-card"
            >
              {/* Icon */}
              <div style={styles.iconBox}>
                <BookIcon />
              </div>

              {/* Content */}
              <div style={styles.content}>
                <div style={styles.titleRow}>
                  <h3 style={styles.title}>{item.title}</h3>
                  <span
                    style={{
                      ...styles.tag,
                      backgroundColor: tag.bg,
                      color: tag.text,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <p style={styles.description}>{item.description}</p>
                <button
                  style={styles.link}
                  onClick={() => handleRedirect(item.link)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.gap = "8px";
                    e.currentTarget.style.color = "#1d4ed8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.gap = "4px";
                    e.currentTarget.style.color = "#2563eb";
                  }}
                >
                  Open Resource
                  <ArrowIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More / View Less */}
      <button
        style={styles.viewMoreBtn}
        onClick={() => setExpanded((prev) => !prev)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#eff6ff";
          e.currentTarget.style.borderColor = "#2563eb";
          e.currentTarget.style.color = "#1d4ed8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.color = "#6b7280";
        }}
      >
        {expanded ? (
          <>Show Less <ChevronIcon open={true} /></>
        ) : (
          <>View {hiddenCount} More Resources <ChevronIcon open={false} /></>
        )}
      </button>

      {/* All Resources CTA */}
      <div style={styles.cta}>
        <button
          style={styles.ctaBtn}
          onClick={() => handleRedirect("/resources")}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.25)";
          }}
        >
          Browse All Resources →
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .study-card {
          animation: fadeSlideIn 0.35s ease both;
        }
        .study-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.09) !important;
          transform: translateY(-2px);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    width: "100%",           // ✅ was maxWidth: 720px
    maxWidth: "720px",
    margin: "0 auto",
    padding: "16px",         // ✅ was 28px
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    border: "1px solid #e5e7eb",
    boxSizing: "border-box", // ✅ ADD
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1.5px dashed #e5e7eb",
  },
  headerIcon: { fontSize: "18px" },
  headerText: {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",             // ✅ was 16px
    padding: "14px",         // ✅ was "18px 20px"
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#fafafa",
    cursor: "default",
    transition: "box-shadow 0.2s, transform 0.2s",
    boxSizing: "border-box", // ✅ ADD
    minWidth: 0,             // ✅ ADD - prevents flex overflow
  },
  iconBox: {
    minWidth: "40px",        // ✅ was 44px
    width: "40px",           // ✅ ADD explicit width
    height: "40px",          // ✅ was 44px
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
    flexShrink: 0,           // ✅ ADD - icon never shrinks
  },
  content: {
    flex: 1,
    minWidth: 0,             // ✅ ADD - critical for text truncation
    overflow: "hidden",      // ✅ ADD
  },
  titleRow: {
    display: "flex",
    alignItems: "flex-start",
    flexWrap: "wrap",        // ✅ was missing - tag drops below on mobile
    gap: "8px",              // ✅ was 12px
    marginBottom: "6px",
  },
  title: {
    margin: 0,
    fontSize: "14px",        // ✅ was 15px
    fontWeight: "700",
    color: "#111827",
    lineHeight: "1.4",
    wordBreak: "break-word", // ✅ ADD
    flex: 1,                 // ✅ ADD - takes remaining space
    minWidth: 0,             // ✅ ADD
  },
  tag: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 9px",
    borderRadius: "20px",
    whiteSpace: "normal",    // ✅ was "nowrap" — the main culprit
    wordBreak: "break-word", // ✅ ADD
    flexShrink: 0,
    maxWidth: "140px",       // ✅ ADD - cap tag width on mobile
  },
  description: {
    margin: "0 0 10px",
    fontSize: "13px",        // ✅ was 13.5px
    color: "#6b7280",
    lineHeight: "1.6",
    wordBreak: "break-word", // ✅ ADD
  },
  link: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#2563eb",
    transition: "gap 0.2s ease, color 0.2s ease",
  },
  viewMoreBtn: {
    marginTop: "16px",
    width: "100%",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "13px",        // ✅ was 13.5px
    fontWeight: "600",
    color: "#6b7280",
    backgroundColor: "transparent",
    border: "1.5px dashed #d1d5db",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxSizing: "border-box", // ✅ ADD
  },
  cta: {
    marginTop: "20px",
    textAlign: "center",
  },
  ctaBtn: {
    padding: "11px 28px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#ffffff",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
    letterSpacing: "0.02em",
  },
};