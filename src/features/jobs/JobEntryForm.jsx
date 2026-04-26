import { useEffect, useMemo, useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { calculateJobPay } from "../../shared/utils/calculateJobPay.js";
import { DEFAULT_HOURLY_RATE, JOB_TYPES } from "../../shared/constants/fieldLedgerDefaults.js";
import { loadSettings } from "../settings/settingsStorage.js";

export default function JobEntryForm() {
  const [editingJobId, setEditingJobId] = useState("");
  const [jobType, setJobType] = useState(JOB_TYPES.BUCKING);
  const [hoursWorked, setHoursWorked] = useState("");
  const [baseJobPay, setBaseJobPay] = useState("");
  const [totalJobHours, setTotalJobHours] = useState("");
  const [hourlyRateSnapshot, setHourlyRateSnapshot] = useState(loadSettings().hourlyRate);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    function loadJobForEditing(event) {
      const job = event.detail?.job;

      if (!job) {
        return;
      }

      setEditingJobId(job.id);
      setJobType(job.jobType || JOB_TYPES.BUCKING);
      setHoursWorked(job.jobType === JOB_TYPES.BUCKING ? String(job.hoursWorked || "") : "");
      setBaseJobPay(job.jobType === JOB_TYPES.TORQUE_TURN ? String(job.baseJobPay || "") : "");
      setTotalJobHours(job.jobType === JOB_TYPES.TORQUE_TURN ? String(job.totalJobHours || "") : "");
      setHourlyRateSnapshot(job.hourlyRateSnapshot ?? loadSettings().hourlyRate ?? DEFAULT_HOURLY_RATE);
      setSaveMessage("Editing saved job. Make changes, then save.");
    }

    window.addEventListener("fieldledger:edit-job", loadJobForEditing);

    return () => {
      window.removeEventListener("fieldledger:edit-job", loadJobForEditing);
    };
  }, []);

  const calculatedPay = useMemo(() => {
    return calculateJobPay({
      jobType,
      hoursWorked,
      baseJobPay,
      totalJobHours,
      hourlyRateSnapshot,
    });
  }, [baseJobPay, hourlyRateSnapshot, hoursWorked, jobType, totalJobHours]);

  function resetForm(message) {
    setEditingJobId("");
    setHoursWorked("");
    setBaseJobPay("");
    setTotalJobHours("");
    setSaveMessage(message);
  }

  function saveJob() {
    const payPeriod = loadActivePayPeriod();

    const hoursWorkedValue = jobType === JOB_TYPES.BUCKING ? Number(hoursWorked || 0) : 0;
    const baseJobPayValue = jobType === JOB_TYPES.TORQUE_TURN ? Number(baseJobPay || 0) : 0;
    const totalJobHoursValue = jobType === JOB_TYPES.TORQUE_TURN ? Number(totalJobHours || 0) : 0;
    const hourlyRateSnapshotValue = Number(hourlyRateSnapshot || 0);

    if (
      hoursWorkedValue < 0 ||
      baseJobPayValue < 0 ||
      totalJobHoursValue < 0 ||
      hourlyRateSnapshotValue < 0
    ) {
      setSaveMessage("Negative hours or pay values are not allowed.");
      return;
    }

    const job = {
      id: editingJobId || crypto.randomUUID(),
      payPeriodId: payPeriod.id,
      jobType,
      hoursWorked: hoursWorkedValue,
      baseJobPay: baseJobPayValue,
      totalJobHours: totalJobHoursValue,
      hourlyRateSnapshot: hourlyRateSnapshotValue,
      totalPay: calculatedPay,
      createdAt: editingJobId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingJobs = Array.isArray(payPeriod.jobs) ? payPeriod.jobs : [];

    const nextJobs = editingJobId
      ? existingJobs.map((existingJob) => {
          if (existingJob.id !== editingJobId) {
            return existingJob;
          }

          return {
            ...existingJob,
            ...job,
            createdAt: existingJob.createdAt,
          };
        })
      : [...existingJobs, job];

    saveActivePayPeriod({
      ...payPeriod,
      jobs: nextJobs,
      updatedAt: new Date().toISOString(),
    });

    resetForm(editingJobId ? "Job updated. Refresh to update the summary." : "Job saved. Refresh to update the summary.");
    window.location.reload();
  }

  function cancelEdit() {
    resetForm("");
  }

  return (
    <section className="panel">
      <h2>{editingJobId ? "Edit Job Ticket" : "Add Job Ticket"}</h2>

      <label className="field">
        Job Type
        <select value={jobType} onChange={(event) => setJobType(event.target.value)}>
          <option value={JOB_TYPES.BUCKING}>Bucking</option>
          <option value={JOB_TYPES.TORQUE_TURN}>Torque Turn</option>
        </select>
      </label>

      <label className="field">
        Hourly Rate
        <input
          type="number"
          min="0"
          step="0.01"
          value={hourlyRateSnapshot}
          onChange={(event) => setHourlyRateSnapshot(event.target.value)}
        />
      </label>

      {jobType === JOB_TYPES.BUCKING && (
        <label className="field">
          Hours Worked
          <input
            type="number"
            min="0"
            step="0.25"
            value={hoursWorked}
            onChange={(event) => setHoursWorked(event.target.value)}
          />
        </label>
      )}

      {jobType === JOB_TYPES.TORQUE_TURN && (
        <>
          <label className="field">
            Base Job Pay
            <input
              type="number"
              min="0"
              step="0.01"
              value={baseJobPay}
              onChange={(event) => setBaseJobPay(event.target.value)}
            />
          </label>

          <label className="field">
            Total Job Hours
            <input
              type="number"
              min="0"
              step="0.25"
              value={totalJobHours}
              onChange={(event) => setTotalJobHours(event.target.value)}
            />
          </label>
        </>
      )}

      <div className="result-card">
        <span>Calculated Pay</span>
        <strong>${calculatedPay.toFixed(2)}</strong>
      </div>

      <button type="button" onClick={saveJob}>
        {editingJobId ? "Save Job Changes" : "Save Job"}
      </button>

      {editingJobId && (
        <button type="button" onClick={cancelEdit}>
          Cancel Edit
        </button>
      )}

      {saveMessage && <p className="helper">{saveMessage}</p>}
    </section>
  );
}
