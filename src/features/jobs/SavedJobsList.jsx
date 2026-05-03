import { useEffect, useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { loadPhotoBlob } from "../../shared/storage/photoBlobStorage.js";

export default function SavedJobsList({ onJobDeleted }) {
  const payPeriod = loadActivePayPeriod();
  const jobs = Array.isArray(payPeriod.jobs) ? payPeriod.jobs : [];
  const jobsPreviewKey = jobs.map((job) => `${job.id}:${job.ticketPhotoId || ""}`).join("|");
  const [previewUrls, setPreviewUrls] = useState({});

  useEffect(() => {
    let active = true;
    const urls = {};

    async function loadPreviews() {
      for (const job of jobs) {
        if (!job.ticketPhotoId) continue;

        try {
          const record = await loadPhotoBlob(job.ticketPhotoId);

          if (record?.blob) {
            urls[job.id] = URL.createObjectURL(record.blob);
          }
        } catch {
          // Ignore broken preview records.
        }
      }

      if (active) {
        setPreviewUrls(urls);
      }
    }

    loadPreviews();

    return () => {
      active = false;
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [jobsPreviewKey]);

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

    const saved = saveActivePayPeriod({
      ...latestPayPeriod,
      jobs: latestJobs.filter((job) => job.id !== jobId),
      updatedAt: new Date().toISOString(),
    });

    if (!saved) {
      return;
    }

    if (typeof onJobDeleted === "function") {
      onJobDeleted();
    }
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

              {previewUrls[job.id] && (
                <img
                  src={previewUrls[job.id]}
                  alt="Ticket preview"
                  style={{
                    display: "block",
                    maxWidth: "120px",
                    marginTop: "0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d8d4ef",
                  }}
                />
              )}

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
    return `Torque Turn — ${Number(job.additionalHours || 0)} additional hrs`;
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
