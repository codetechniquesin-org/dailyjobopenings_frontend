import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config/api";

const CategorySection = ({ styles, activeCat, setActiveCat, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        console.log("Fetching categories from:", `${API_BASE_URL}/api/browse-by-categories`);
        const res = await fetch(`${API_BASE_URL}/api/browse-by-categories`);
        const data = await res.json();
        
        console.log("Full API Response:", data);

        const parsedCategories = 
          Array.isArray(data) ? data :
          Array.isArray(data.categories) ? data.categories :
          Array.isArray(data.data) ? data.data :
          [];

        console.log("Parsed Categories:", parsedCategories);
        setCategories(parsedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 10,
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: 5,
          marginBottom: 10,
        }}
      >
        <h2
          className="syne"
          style={{
            fontSize: 17,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: styles.text,
          }}
        >
          <span
            style={{
              width: 4,
              height: 20,
              background: styles.accent,
              borderRadius: 3,
              display: "inline-block",
            }}
          />
          Browse by Category
        </h2>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="cat-pill-wrap">
        {loading ? (
          <span style={{ fontSize: 13, color: styles.muted }}>Loading categories...</span>
        ) : categories.length === 0 ? (
          <span style={{ fontSize: 13, color: styles.muted }}>No categories found.</span>
        ) : (
          categories.map((c, i) => (
            <span
              key={c.name}
              onClick={() => {
                if (setActiveCat) setActiveCat(i);
                if (onCategorySelect) onCategorySelect(c.name);
              }}
              style={{
                background: activeCat === i ? styles.primary : "#fff",
                color: activeCat === i ? "#fff" : styles.text,
                border: `1.5px solid ${activeCat === i ? styles.primary : styles.border}`,
                borderRadius: 20,
                padding: "5px 15px",
                fontSize: 12.5,
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all .2s",
              }}
            >
              {c.name}
              <span
                style={{
                  background: activeCat === i ? "rgba(255,255,255,.2)" : "#e8f4fd",
                  color: activeCat === i ? "#fff" : styles.primary,
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                {c.count > 1000 ? (c.count / 1000).toFixed(1) + "K" : c.count}
              </span>
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default CategorySection;