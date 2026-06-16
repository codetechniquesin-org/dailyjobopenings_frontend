import ReusableJobCard from "./ReusableJobCard";

export default function ReusableJobGrid({
  jobs = []
}) {

  if (!jobs.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px"
        }}
      >
        No jobs found
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill,minmax(320px,1fr))",
        gap: "16px"
      }}
    >
      {jobs.map(job => (
        <ReusableJobCard
          key={
            job._id ||
            job.slug
          }
          job={job}
        />
      ))}
    </div>
  );
}