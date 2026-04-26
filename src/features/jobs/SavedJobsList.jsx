import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

export default function SavedJobsList() {
  const payPeriod = loadActivePayPeriod();
  const jobs = Array.isArray(payPeriod.jobs) ? payPeriod.jobs : [];

  return (
    <section className="panel">
      <h2>Saved Jobs</h2>

      {jobs.length === 0 ? (
        <p className="helper">No jobs saved yet.</p>
      ) : (
        <div className="list">
          {jobs.map((job) => (
            <div className="result-card" key={job.id}>
              <span>{formatJobLabel(job)}</span>
              <strong>${Number(job.totalPay || 0).toFixed(2)}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatJobLabel(job) {
  if (job.jobType === "torque_turn") {
    return `Torque Turn — ${Number(job.totalJobHours || 0)} hrs`;
  }

  return `Bucking — ${Number(job.hoursWorked || 0)} hrs`;
}
