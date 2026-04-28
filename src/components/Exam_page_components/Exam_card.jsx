// components/ExamCard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const S = {
  white: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  light: "#f8fafc",
  primary: "#0f4c81",
  gold: "#f59e0b",
};

function ExamCardItem({ exam, onBookmark }) {

  const isExpired =
    exam.applicationEndDate &&
    new Date(exam.applicationEndDate) < new Date();

  return (
    <div
      style={{
        background: S.white,
        border: `1px solid ${S.border}`,
        borderRadius: 16,
        padding: "20px 22px 18px",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow =
          "0 8px 32px rgba(15,76,129,0.13)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flex: 1,
            minWidth: 0,
          }}
        >

          {/* Logo */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#0f4c8115",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 21,
              flexShrink: 0,
            }}
          >
            🎓
          </div>

          {/* Title */}
          <div style={{ minWidth: 0 }}>

            <div
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: S.text,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {exam.title}
            </div>

            <div
              style={{
                fontSize: 12,
                color: S.muted,
                marginTop: 3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {exam.organization}
            </div>

          </div>
        </div>

        {/* Status + Bookmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            marginLeft: 12,
          }}
        >

          <span
            style={{
              background: isExpired ? "#fee2e2" : "#dcfce7",
              color: isExpired ? "#dc2626" : "#166534",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 20,
              whiteSpace: "nowrap",
            }}
          >
            {isExpired ? "Closed" : "Active"}
          </span>

          <button
            onClick={() => onBookmark(exam._id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              padding: 0,
              lineHeight: 1,
              color: exam.isBookmarked ? S.gold : "#cbd5e1",
              transition: "color 0.15s",
            }}
            title="Bookmark"
          >
            {exam.isBookmarked ? "★" : "☆"}
          </button>

        </div>
      </div>

      {/* Details Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px 12px",
          margin: "0 0 16px",
          padding: "14px 16px",
          background: S.light,
          borderRadius: 10,
        }}
      >

        {[
          [
            "Exam Date",
            exam.examDate
              ? new Date(exam.examDate).toLocaleDateString()
              : "N/A",
          ],

          [
            "Last Date",
            exam.applicationEndDate
              ? new Date(exam.applicationEndDate).toLocaleDateString()
              : "N/A",
          ],

          [
            "Qualification",
            exam.qualification?.[0] || "N/A",
          ],

          [
            "Mode",
            exam.examMode || "N/A",
          ],

          [
            "Type",
            exam.examType || "N/A",
          ],

          [
            "Fee",
            exam.applicationFee || "N/A",
          ],

        ].map(([label, val]) => (
          <div key={label}>

            <div
              style={{
                fontSize: 10,
                color: S.muted,
                marginBottom: 3,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              {label}
            </div>

            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: S.text,
                lineHeight: 1.4,
              }}
            >
              {val}
            </div>

          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            flex: 1,
            minWidth: 0,
          }}
        >

          {exam.tags?.slice(0, 2).map(tag => (
            <span
              key={tag}
              style={{
                background: "#e8f4fd",
                color: S.primary,
                fontSize: 11,
                padding: "3px 9px",
                borderRadius: 5,
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}

          <span
            style={{
              background: "#0f4c8118",
              color: S.primary,
              fontSize: 11,
              padding: "3px 9px",
              borderRadius: 5,
              fontWeight: 600,
            }}
          >
            {exam.category}
          </span>

        </div>

        {/* Apply Button */}
        <a
          href={`${window.location.origin}/user/view-exams/${exam.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: S.primary,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            padding: "8px 18px",
            borderRadius: 9,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Apply →
        </a>

      </div>
    </div>
  );
}

export default function ExamCard() {

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllExams = async () => {
    try {

      setLoading(true);

      const { data } = await axios.get(
        `${API_BASE_URL}/api/exams/get-all-exams`
      );

      if (data?.success) {
        setExams(data.exams);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllExams();
  }, []);

  const handleBookmark = (id) => {
    console.log("Bookmarked:", id);
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Loading Exams...
      </h2>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        gap: 20,
      }}
    >

      {exams.map(exam => (
        <ExamCardItem
          key={exam._id}
          exam={exam}
          onBookmark={handleBookmark}
        />
      ))}

    </div>
  );
}