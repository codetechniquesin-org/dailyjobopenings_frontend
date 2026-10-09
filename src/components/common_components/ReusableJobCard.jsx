import { useState } from "react";

const S = {
  primary: "#0f4c81", accent: "#e8472a", gold: "#f5a623",
  light: "#f4f7fb", green: "#16a34a", text: "#1a1a2e", muted: "#6b7280", border: "#e2e8f0",
};

const borderAccent = {
    featured: `3px solid ${S.gold}`,
    hot: `3px solid ${S.accent}`,
    remote: `3px solid #7c3aed`,
    new: `1px solid ${S.border}`,
};

const badgeStyle = {
    featured: { background: "#fff8e1", color: "#b45309" },
    hot: { background: "#fee2e2", color: "#b91c1c" },
    new: { background: "#dcfce7", color: "#15803d" },
    remote: { background: "#ede9fe", color: "#6d28d9" },
};

function MetaTag({ icon, label }) {
    if (!label) return null;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: S.muted, background: S.light, padding: "3px 9px", borderRadius: 5 }}>
            {icon} {label}
        </span>
    );
}

function SkillTag({ label }) {
    return (
        <span
            style={{
                background: "#e8f4fd",
                color: S.primary,
                fontSize: 11,
                padding: "4px 9px",
                borderRadius: 4,
                fontWeight: 500,

                maxWidth: 160,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "inline-block"
            }}
            title={label}
        >
            {label}
        </span>
    );
}
export default function ReusableJobCard({ job }) {
    const [hovered, setHovered] = useState(false);

    const badge = job.badge || "new";
    const badgeLabel = job.badgeLabel || "New";
    const role = job.jobTitle || job.role || job.title;
    const company = job.companyName || job.company;
    const location = job.location;
    const edu = job.education || job.edu;
    const batch = job.eligibleBatches || job.batch;
    const salary = job.salary;
    const skills = Array.isArray(job.skills) ? job.skills : [];
    const slug = job.displaySlug;
    const jobLink = job.jobLink || "#";
    const logoSrc = job.companyLogo;
    const posted = job.createdAt
        ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : job.posted || "";

    const type = job.contentType || "job";

    const detailsUrl =
        type === "job"
            ? `/jobs/${slug}`
            : type === "walkin"
                ? `user/walkins/view-walkin/${slug}`
                : `/exams/${slug}`;

    const buttonText =
        type === "exam"
            ? "View Exam →"
            : type === "walkin"
                ? "View Walk-In →"
                : "Apply Now →";

    const typeBadge =
        type === "job"
            ? "💼 Job"
            : type === "walkin"
                ? "🏢 Walk-In"
                : "📝 Exam";
    // console.log("CARD DATA:", job);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "#fff", borderRadius: 12,
                border: `1px solid ${S.border}`,
                borderLeft: borderAccent[badge] || `1px solid ${S.border}`,
                padding: 18, position: "relative", height: window.innerWidth < 640 ? 300 : 320,
                minHeight: window.innerWidth < 640 ? 300 : 320,
                maxHeight: window.innerWidth < 640 ? 300 : 320, overflow: "hidden", display: "flex", justifyContent: "space-between", flexDirection: "column", boxSizing: "border-box",
                transition: "all .2s", cursor: "pointer",
                boxShadow: hovered ? "0 4px 20px rgba(15,76,129,.12)" : "none",
                transform: hovered ? "translateY(-2px)" : "none",
            }}
        >
            {/* <span style={{ position: "absolute", top: 13, right: 13, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 4, ...(badgeStyle[badge] || badgeStyle.new) }}>
                {badgeLabel}
            </span> */}
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 12,
                    minHeight: 72,
                    maxHeight: 72,
                    overflow: "hidden"
                }}
            >
                <div style={{ width: 46, height: 46, borderRadius: 10, background: "#e8f4fd", color: S.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0, border: `1px solid ${S.border}`, overflow: "hidden" }}>
                    {logoSrc ? <img src={logoSrc} alt={company} style={{ width: "80%", height: "80%", objectFit: "contain" }} /> : company?.charAt(0)}
                </div>
                <div>
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            paddingRight: 120,
                            color: S.text,

                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",

                            height: 38
                        }}
                    >
                        {role}
                    </div>
                    <div
                        style={{
                            fontSize: 12,
                            color: S.primary,
                            fontWeight: 500,
                            marginTop: 2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            height: 18
                        }}
                    >
                        {company}
                    </div>                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 10,
                    minHeight: 32,
                    maxHeight: 32,
                    overflow: "hidden"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap"
                    }}
                >
                    <span
                        style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: 4,
                            whiteSpace: "nowrap",
                            ...(badgeStyle[badge] || badgeStyle.new)
                        }}
                    >
                        {badgeLabel}
                    </span>

                    <span
                        style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: 4,
                            background: "#e8f4fd",
                            color: S.primary,
                            whiteSpace: "nowrap"
                        }}
                    >
                        {typeBadge}
                    </span>
                </div>

                <MetaTag icon="📍" label={location} />
                <MetaTag icon="🎓" label={edu} />
                <MetaTag icon="📅" label={batch} />
            </div>
            {/* <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 14,
    minHeight: 52,
    maxHeight: 52,
    overflow: "hidden"
  }}
> */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 10,
                    height: 38,
                    overflow: "hidden"
                }}
            >
                {skills.slice(0, 3).map(s => <SkillTag key={s} label={s} />)}
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "auto",
                    gap: 10,
                    minHeight: 52,
                    flexWrap: "nowrap"
                }}
            >
                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: "55%",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            fontWeight: 700,
                            color: S.green,
                            fontSize: 13.5,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                        title={salary}
                    >
                        {salary}
                    </div>
                    <div style={{ fontSize: 11, color: S.muted }}>{posted}</div>
                </div>
                <a
                    href={slug ? detailsUrl : jobLink} style={{
                        background: S.primary,
                        color: "#fff",
                        padding: "7px 18px",
                        borderRadius: 7,
                        fontSize: 12.5,
                        fontWeight: 600,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        width: 120,
                        flexShrink: 0,
                        textAlign: "center"
                    }}>
                    {buttonText}
                </a>
            </div>
        </div>
    );
}