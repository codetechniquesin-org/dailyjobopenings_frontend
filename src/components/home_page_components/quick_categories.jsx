import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";

export default function QuickCategories({ SidebarWidget, QuickLink }) {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/quick-job-categories`);
        const data = await res.json();

        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <SidebarWidget title="⚡ Quick Job Categories">
      {categories
        ? categories.map((cat) => (
            <QuickLink
              key={cat.label}
              label={cat.label}
              count={`${cat.count}+`}
            />
          ))
        : <p>Loading...</p>}
    </SidebarWidget>
  );
}