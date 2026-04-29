import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { Link } from "react-router-dom";
import API_BASE_URL from "../../config/api";



const C = {
  primary: "#0f172a",
  purple: "#7c3aed",
  accent: "#ef4444",
  gold: "#f59e0b",
  muted: "#64748b",
  border: "#e2e8f0",
  light: "#f8fafc",
};

const PAGE = {
  salaryGrad:
    "linear-gradient(135deg,#f8fafc,#eef2ff)",

  salaryBorder: "#c7d2fe",

  salaryColor: "#4338ca",

  skillBg: "#eef2ff",

  skillColor: "#4338ca",
};

const BADGE_STYLES = {
  hot: {
    background: "#fee2e2",
    color: "#dc2626",
  },

  new: {
    background: "#ede9fe",
    color: "#7c3aed",
  },

  featured: {
    background: "#fef3c7",
    color: "#d97706",
  },
};





export default function WalkInJobCard({
  isMobile,
}) {

  const [walkins, setWalkins] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");




  const fetchWalkIns = async () => {
    try {

      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/api/walkins/get-all-walkins`
      );

      if (res.data.success) {
        setWalkins(res.data.walkIns);
      }

    } catch (err) {

      console.log(err);

      setError(
        "Failed to fetch walk-in jobs"
      );

    } finally {

      setLoading(false);

    }
  };




  useEffect(() => {
    fetchWalkIns();
  }, []);





  if (loading) {
    return (
      <div
        style={{
          padding: 30,
          textAlign: "center",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        Loading Walk-In Jobs...
      </div>
    );
  }




  if (error) {
    return (
      <div
        style={{
          padding: 30,
          textAlign: "center",
          color: "red",
          fontWeight: 600,
        }}
      >
        {error}
      </div>
    );
  }





  return (
    <>
      {walkins.map((job) => {

        const badge =
          job.isFeatured
            ? "featured"
            : "new";

        const badgeLabel =
          job.isFeatured
            ? "Featured"
            : "New";

        const bc =
          badge === "hot"
            ? C.accent
            : badge === "new"
            ? C.purple
            : C.gold;





        return (
          <div
            key={job._id}
            style={{
              background: "#fff",
              borderRadius: 14,
              border: `1px solid ${C.border}`,
              padding: isMobile ? 14 : 20,
              marginBottom: 14,
              borderLeft: `4px solid ${bc}`,
              transition:
                "box-shadow .2s, transform .18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 28px rgba(124,58,237,.12)";

              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "none";

              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >


            {/* TOP ROW */}
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >


              {/* LOGO */}
              <img
                src={
                  job.companyLogo ||
                  "https://via.placeholder.com/60"
                }
                alt={job.companyName}
                style={{
                  width: isMobile ? 46 : 58,
                  height: isMobile ? 46 : 58,
                  borderRadius: 12,
                  objectFit: "cover",
                  border: `1px solid ${C.border}`,
                  flexShrink: 0,
                }}
              />




              {/* CONTENT */}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >


                {/* BADGES */}
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    flexWrap: "wrap",
                    marginBottom: 7,
                  }}
                >

                  <span
                    style={{
                      ...BADGE_STYLES[badge],
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "2px 9px",
                      borderRadius: 4,
                    }}
                  >
                    {badgeLabel}
                  </span>

                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "2px 9px",
                      borderRadius: 4,
                    }}
                  >
                    ✅ Verified
                  </span>
                </div>




                {/* TITLE */}
                <h3
                  style={{
                    fontSize:
                      isMobile ? 15 : 17,

                    fontWeight: 700,

                    color: C.primary,

                    marginBottom: 4,

                    lineHeight: 1.3,
                  }}
                >
                  {job.walkintitle}
                </h3>




                {/* COMPANY */}
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: C.purple,
                    marginBottom: 9,
                  }}
                >
                  {job.companyName}
                </div>





                {/* META TAGS */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {[
                    {
                      icon: "📍",
                      val: job.location,
                    },

                    {
                      icon: "🏢",
                      val: job.mode,
                    },

                    {
                      icon: "🎓",
                      val: job.batch?.join(", "),
                    },

                    {
                      icon: "💼",
                      val: job.experience,
                    },
                  ].map((t) => (

                    <span
                      key={t.val}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11.5,
                        color: C.muted,
                        background: C.light,
                        padding: "4px 10px",
                        borderRadius: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.icon} {t.val}
                    </span>

                  ))}
                </div>
              </div>





              {/* SALARY */}
              {!isMobile && (
                <div
                  style={{
                    background:
                      PAGE.salaryGrad,

                    border:
                      `1.5px solid ${PAGE.salaryBorder}`,

                    borderRadius: 12,

                    padding: "13px 18px",

                    textAlign: "center",

                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9.5,
                      color: C.muted,
                      marginBottom: 3,
                      fontWeight: 700,
                    }}
                  >
                    SALARY
                  </div>

                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: PAGE.salaryColor,
                    }}
                  >
                    {job.salary ||
                      "Not Disclosed"}
                  </div>
                </div>
              )}
            </div>





            {/* DESCRIPTION */}
            <p
              style={{
                fontSize: 13,
                color: C.muted,
                lineHeight: 1.75,
                margin: "13px 0 12px",
              }}
            >
              {
                job.description?.slice(
                  0,
                  170
                )
              }
              ...
            </p>





            {/* SKILLS */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 14,
              }}
            >
              {job.skills
                ?.slice(0, 5)
                .map((s) => (
                  <span
                    key={s}
                    style={{
                      background:
                        PAGE.skillBg,

                      color:
                        PAGE.skillColor,

                      fontSize: 11.5,

                      padding: "4px 10px",

                      borderRadius: 5,

                      fontWeight: 500,
                    }}
                  >
                    {s}
                  </span>
                ))}
            </div>





            {/* BUTTON */}
            <Link
              to={`/user/walkins/view-walkin/${job.walkinslug}`}
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#7c3aed",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              View Details
            </Link>
          </div>
        );
      })}
    </>
  );
}