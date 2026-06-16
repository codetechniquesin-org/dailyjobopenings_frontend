import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";
import QuickCategoriesSkeleton from "../skeletons/QuickCategoriesSkeleton";

export default function QuickCategories({
  SidebarWidget,
  QuickLink,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE_URL}/api/quick-job-categories`
        );

        const data = await res.json();

        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <SidebarWidget title="⚡ Quick Job Categories">
      {loading ? (
        <QuickCategoriesSkeleton />
      ) : (
        categories.map((cat) => (
          <QuickLink
            key={cat.label}
            label={cat.label}
            count={`${cat.count}+`}
          />
        ))
      )}
    </SidebarWidget>
  );
}