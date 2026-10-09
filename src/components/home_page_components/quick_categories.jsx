import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";
import QuickCategoriesSkeleton from "../skeletons/QuickCategoriesSkeleton";
import { useNavigate } from "react-router-dom";


export default function QuickCategories({
  SidebarWidget,
  QuickLink,
}) {
  const navigate = useNavigate();
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
            onClick={() =>
              {switch (cat.type) {
  case "category":
    navigate(`/jobs/search?category=${encodeURIComponent(cat.value)}`);
    break;

  case "role":
    navigate(`/jobs/search?role=${encodeURIComponent(cat.value)}`);
    break;

  case "workMode":
    navigate(`/jobs/search?workMode=${encodeURIComponent(cat.value)}`);
    break;

  case "education":
    navigate(`/jobs/search?education=${encodeURIComponent(cat.value)}`);
    break;

  case "jobType":
    navigate(`/jobs/search?jobType=${encodeURIComponent(cat.value)}`);
    break;

  case "tag":
    navigate(`/jobs/search?tag=${encodeURIComponent(cat.value)}`);
    break;

  default:
    navigate("/jobs/search");
}
            }
          
            }/>
        ))
      )}
    </SidebarWidget>
  );
}