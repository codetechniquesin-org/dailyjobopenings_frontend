import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";

export default function TopCompanies({ SidebarWidget, S }) {
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/top-hiring-companies`);
        const data = await res.json();

        setCompanies(data.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <SidebarWidget title="🏢 Top Hiring Companies">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {companies ? (
          companies.map((c) => (
            <div
              key={c.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 9,
                borderRadius: 8,
                border: `1px solid ${S.border}`,
                cursor: "pointer"
              }}
            >
              {/* Company Logo */}
              <img
                src={c.logo}
                alt={c.name}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 7,
                  objectFit: "contain",
                  background: "#fff"
                }}
              />

              {/* Company Info */}
              <div>
                <strong style={{ fontSize: 13, display: "block" }}>
                  {c.name}
                </strong>
                <span style={{ fontSize: 12, color: S.muted }}>
                  {c.count} open roles
                </span>
              </div>
            </div>
          ))
        ) : (
          <span>Loading companies...</span>
        )}
      </div>
    </SidebarWidget>
  );
}