export default function JobCardSkeleton() {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
            padding: "16px",
            minHeight: "180px",
        }}
    >
        <div className="skeleton title"></div>
        <div className="skeleton text"></div>
        <div className="skeleton text"></div>
        <div className="skeleton button"></div>
    </div>
)};