import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";

export default function JobsByLocation({ SidebarWidget, QuickLink }) {
  const [locations, setLocations] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs-by-location`);
        const data = await res.json();

        setLocations(data.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <SidebarWidget title="📍 Jobs by Location">
      {locations ? (
        locations.map((loc) => (
          <QuickLink
            key={loc.label}
            label={loc.label}
            count={`${loc.count}+`}
          />
        ))
      ) : (
        <span>Loading locations...</span>
      )}
    </SidebarWidget>
  );
}