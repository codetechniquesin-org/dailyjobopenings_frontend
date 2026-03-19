import { useState, useEffect } from "react";

const S = {
    primary: "#0f4c81", accent: "#e8472a", gold: "#f5a623",
    light: "#f4f7fb", green: "#16a34a", text: "#1a1a2e", muted: "#6b7280", border: "#e2e8f0",
};

const badgeStyle = {
    featured: { background: "#fff8e1", color: "#b45309" },
    hot: { background: "#fee2e2", color: "#b91c1c" },
    new: { background: "#dcfce7", color: "#15803d" },
    remote: { background: "#ede9fe", color: "#6d28d9" },
};

const borderAccent = {
    featured: `3px solid ${S.gold}`,
    hot: `3px solid ${S.accent}`,
    remote: `3px solid #7c3aed`,
    new: `1px solid ${S.border}`,
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
    return <span style={{ background: "#e8f4fd", color: S.primary, fontSize: 11, padding: "2px 9px", borderRadius: 4, fontWeight: 500 }}>{label}</span>;
}

function JobCard({ job }) {
    const [hovered, setHovered] = useState(false);

    const badge = job.badge || "new";
    const badgeLabel = job.badgeLabel || "New";
    const role = job.jobTitle || job.role;
    const company = job.companyName || job.company;
    const location = job.location;
    const edu = job.education || job.edu;
    const batch = job.eligibleBatches || job.batch;
    const salary = job.salary;
    const skills = Array.isArray(job.skills) ? job.skills : [];
    const slug = job.slug || job._id || "";
    const jobLink = job.jobLink || "#";
    const logoSrc = job.companyLogo || null;
    const posted = job.createdAt
        ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : job.posted || "";

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "#fff", borderRadius: 12,
                border: `1px solid ${S.border}`,
                borderLeft: borderAccent[badge] || `1px solid ${S.border}`,
                padding: 18, position: "relative", height: "100%", boxSizing: "border-box",
                transition: "all .2s", cursor: "pointer",
                boxShadow: hovered ? "0 4px 20px rgba(15,76,129,.12)" : "none",
                transform: hovered ? "translateY(-2px)" : "none",
            }}
        >
            <span style={{ position: "absolute", top: 13, right: 13, fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 4, ...(badgeStyle[badge] || badgeStyle.new) }}>
                {badgeLabel}
            </span>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, background: "#e8f4fd", color: S.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0, border: `1px solid ${S.border}`, overflow: "hidden" }}>
                    {logoSrc ? <img src={logoSrc} alt={company} style={{ width: "80%", height: "80%", objectFit: "contain" }} /> : company?.charAt(0)}
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, paddingRight: 80, color: S.text }}>{role}</div>
                    <div style={{ fontSize: 12, color: S.primary, fontWeight: 500, marginTop: 2 }}>{company}</div>
                </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                <MetaTag icon="📍" label={location} />
                <MetaTag icon="🎓" label={edu} />
                <MetaTag icon="📅" label={batch} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                {skills.slice(0, 4).map(s => <SkillTag key={s} label={s} />)}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                    <div style={{ fontWeight: 700, color: S.green, fontSize: 13.5 }}>{salary}</div>
                    <div style={{ fontSize: 11, color: S.muted }}>{posted}</div>
                </div>
                <a href={slug ? `/view-job/${slug}` : jobLink} style={{ background: S.primary, color: "#fff", padding: "7px 18px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}>
                    Apply Now →
                </a>
            </div>
        </div>
    );
}

export default function JobCardList({ page = 1, onTotal }) {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/get-jobs")
            .then(r => r.json())
            .then(d => {
                console.log("API response:", d);           // 👈 add this
                const all = Array.isArray(d) ? d : d.jobs || d.data || [];
                console.log("Parsed jobs length:", all.length); // 👈 and this
                setJobs(all);
                if (onTotal) onTotal(all.length);
            })
            .catch(console.error);
    }, []);
    const offset = (page - 1) * 15;
    const first = jobs.slice(offset, offset + 8);
    const second = jobs.slice(offset + 8, offset + 13);
    const third = jobs.slice(offset + 13, offset + 15);
    function InlineAd({ icon, title, sub, btnText, btnColor = S.primary, bg = "linear-gradient(90deg,#e8f4fd,#f0f7ff)", borderColor = "#bdd6f0" }) {
        return (
            <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: "13px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 10, color: "#999", border: "1px solid #ddd", padding: "1px 5px", borderRadius: 3 }}>AD</span>
                <span style={{ fontSize: 26 }}>{icon}</span>
                <div style={{ flex: 1, minWidth: 140 }}>
                    <strong style={{ fontSize: 13.5, display: "block" }}>{title}</strong>
                    <span style={{ fontSize: 12, color: S.muted }}>{sub}</span>
                </div>
                <a href="#" style={{ background: btnColor, color: "#fff", padding: "7px 16px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>{btnText}</a>
            </div>
        );
    }
    return (
        <>
            {first.map(job => <JobCard key={job._id || job.id} job={job} />)}

            <div style={{ gridColumn: "1 / -1" }}>
                <InlineAd icon="💼" title="Naukri.com — India's No.1 Job Portal" sub="Build your resume, get job alerts & apply to 1 crore+ jobs" btnText="Visit Naukri →" />
            </div>

            {second.map(job => <JobCard key={job._id || job.id} job={job} />)}

            <div style={{ gridColumn: "1 / -1" }}>
                <InlineAd icon="📚" title="Coding Ninjas — Crack Product Companies" sub="Data Structures, System Design, Mock Interviews & Placement Prep" btnText="Start Free →" btnColor={S.accent} bg="linear-gradient(90deg,#fff0f0,#fff5f5)" borderColor="#fbb" />
            </div>

            {third.map(job => <JobCard key={job._id || job.id} job={job} />)}

            <div style={{ gridColumn: "1 / -1" }}>
                <InlineAd icon="🎓" title="GreatLearning — Free Certifications" sub="Python, Data Science, Cloud, AI/ML — 100% Free" btnText="Enroll Free →" btnColor={S.green} bg="linear-gradient(90deg,#f0fff4,#e8f5e9)" borderColor="#86efac" />
            </div>
        </>
    );
}