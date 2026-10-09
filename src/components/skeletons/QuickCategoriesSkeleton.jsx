import React from "react";

export default function QuickCategoriesSkeleton() {
  return (
    <div>
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            marginBottom: "8px",
            borderRadius: "8px",
            background: "#f3f4f6",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: "65%",
              height: "14px",
              borderRadius: "4px",
              background: "#e5e7eb",
            }}
          />
          <div
            style={{
              width: "40px",
              height: "14px",
              borderRadius: "4px",
              background: "#e5e7eb",
            }}
          />
        </div>
      ))}

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
}