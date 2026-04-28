import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

export default function SavedJobsList() {
  const payPeriod = loadActivePayPeriod();
  const jobs = Array.isArray(payPeriod.jobs) ? payPeriod.jobs : [];

  function editJob(job) {
    window.dispatchEvent(
      new CustomEvent("fieldledger:edit-job", {
        detail: { job },
      }),
    );
  }

  function deleteJob(jobId) {
    const confirmed = window.confirm("Delete this saved job?");

    if (!confirmed) {
      return;
    }

    const latestPayPeriod = loadActivePayPeriod();
    const latestJobs = Array.isArray(latestPayPeriod.jobs) ? latestPayPeriod.jobs : [];

    saveActivePayPeriod({
      ...latestPayPeriod,
      jobs: latestJobs.filter((job) => job.id !== jobId),
      updatedAt: new Date().toISOString(),
    });

    window.location.reload();
  }

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
              <div className="card-actions">
                <button type="button" onClick={() => editJob(job)}>
                  Edit
                </button>
                <button type="button" onClick={() => deleteJob(job.id)}>
                  Delete
                </button>
              </div>
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

  const buckingState = job.buckingState || "State not set";
  const jobsCompleted = Number(job.jobsCompleted || 0);
  const hoursPerJob = Number(job.hoursPerJob || 0);
  const hoursWorked = Number(job.hoursWorked || 0);

  if (jobsCompleted > 0 && hoursPerJob > 0) {
    return `Bucking — ${buckingState} — ${jobsCompleted} job${jobsCompleted === 1 ? "" : "s"} × ${hoursPerJob} hrs = ${hoursWorked} hrs`;
  }

  return `Bucking — ${hoursWorked} hrs`;
}
