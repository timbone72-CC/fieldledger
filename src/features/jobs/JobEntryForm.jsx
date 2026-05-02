import { useEffect, useMemo, useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { calculateJobPay } from "../../shared/utils/calculateJobPay.js";
import { DEFAULT_HOURLY_RATE, JOB_TYPES, TIMESHEET_COMPANIES } from "../../shared/constants/fieldLedgerDefaults.js";
import { deletePhotoBlob, loadPhotoBlob, savePhotoBlob } from "../../shared/storage/photoBlobStorage.js";
import { loadSettings } from "../settings/settingsStorage.js";

const BUCKING_STATES = {
  TEXAS: "Texas",
  NEW_MEXICO: "New Mexico",
};

const BUCKING_HOURS_BY_STATE = {
  [BUCKING_STATES.TEXAS]: 6,
  [BUCKING_STATES.NEW_MEXICO]: 8,
};

function calculateDefaultBuckingHours(jobsCompleted, buckingState) {
  return Number(jobsCompleted || 0) * Number(BUCKING_HOURS_BY_STATE[buckingState] || 0);
}

export default function JobEntryForm() {
  const [editingJobId, setEditingJobId] = useState("");
  const [jobType, setJobType] = useState(JOB_TYPES.BUCKING);
  const [buckingState, setBuckingState] = useState(BUCKING_STATES.TEXAS);
  const [jobsCompleted, setJobsCompleted] = useState("1");
  const [hoursWorked, setHoursWorked] = useState(String(BUCKING_HOURS_BY_STATE[BUCKING_STATES.TEXAS]));
  const [baseJobPay, setBaseJobPay] = useState("");
  const [additionalHours, setAdditionalHours] = useState("");
  const [hourlyRateSnapshot, setHourlyRateSnapshot] = useState(loadSettings().hourlyRate);
  const [ticketPhotoId, setTicketPhotoId] = useState("");
  const [ticketPhotoFile, setTicketPhotoFile] = useState(null);
  const [ticketPhotoPreviewUrl, setTicketPhotoPreviewUrl] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [date, setDate] = useState("");
  const [company, setCompany] = useState("");
  const [rigNameOrNumber, setRigNameOrNumber] = useState("");

  useEffect(() => {
    function loadJobForEditing(event) {
      const job = event.detail?.job;

      if (!job) {
        return;
      }

      setEditingJobId(job.id);
      setJobType(job.jobType || JOB_TYPES.BUCKING);
      setBuckingState(job.buckingState || BUCKING_STATES.TEXAS);
      setJobsCompleted(job.jobType === JOB_TYPES.BUCKING ? String(job.jobsCompleted || "1") : "1");
      setHoursWorked(job.jobType === JOB_TYPES.BUCKING ? String(job.hoursWorked || "") : "");
      setBaseJobPay(job.jobType === JOB_TYPES.TORQUE_TURN ? String(job.baseJobPay || "") : "");
      setAdditionalHours(job.jobType === JOB_TYPES.TORQUE_TURN ? String(job.additionalHours || "") : "");
      setHourlyRateSnapshot(job.hourlyRateSnapshot ?? loadSettings().hourlyRate ?? DEFAULT_HOURLY_RATE);
      setTicketPhotoId(job.ticketPhotoId || "");
      setTicketPhotoFile(null);
      setDate(job.date || "");
      setCompany(job.company || "");
      setRigNameOrNumber(job.rigNameOrNumber || "");
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
      additionalHours,
      hourlyRateSnapshot,
    });
  }, [baseJobPay, hourlyRateSnapshot, hoursWorked, jobType, additionalHours]);

  useEffect(() => {
    let previewUrl = "";

    async function loadTicketPhotoPreview() {
      if (!ticketPhotoId || ticketPhotoFile) {
        setTicketPhotoPreviewUrl("");
        return;
      }

      try {
        const photoRecord = await loadPhotoBlob(ticketPhotoId);

        if (!photoRecord?.blob) {
          setTicketPhotoPreviewUrl("");
          return;
        }

        previewUrl = URL.createObjectURL(photoRecord.blob);
        setTicketPhotoPreviewUrl(previewUrl);
      } catch {
        setTicketPhotoPreviewUrl("");
      }
    }

    loadTicketPhotoPreview();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [ticketPhotoId, ticketPhotoFile]);

  function resetForm(message) {
    setEditingJobId("");
    setBuckingState(BUCKING_STATES.TEXAS);
    setJobsCompleted("1");
    setHoursWorked(String(BUCKING_HOURS_BY_STATE[BUCKING_STATES.TEXAS]));
    setBaseJobPay("");
    setAdditionalHours("");
    setTicketPhotoId("");
    setTicketPhotoFile(null);
    setTicketPhotoPreviewUrl("");
    setDate("");
    setCompany("");
    setRigNameOrNumber("");
    setSaveMessage(message);
  }

  async function saveJob() {
    const payPeriod = loadActivePayPeriod();

    const jobsCompletedValue = jobType === JOB_TYPES.BUCKING ? Number(jobsCompleted || 0) : 0;
    const hoursPerJobValue = jobType === JOB_TYPES.BUCKING ? Number(BUCKING_HOURS_BY_STATE[buckingState] || 0) : 0;
    const hoursWorkedValue = jobType === JOB_TYPES.BUCKING ? Number(hoursWorked || 0) : 0;
    const baseJobPayValue = jobType === JOB_TYPES.TORQUE_TURN ? Number(baseJobPay || 0) : 0;
    const additionalHoursValue = jobType === JOB_TYPES.TORQUE_TURN ? Number(additionalHours || 0) : 0;
    const hourlyRateSnapshotValue = Number(hourlyRateSnapshot || 0);

    if (
      jobsCompletedValue < 0 ||
      hoursWorkedValue < 0 ||
      baseJobPayValue < 0 ||
      additionalHoursValue < 0 ||
      hourlyRateSnapshotValue < 0
    ) {
      setSaveMessage("Negative hours or pay values are not allowed.");
      return;
    }

    let nextTicketPhotoId = ticketPhotoId;

    if (ticketPhotoFile) {
      try {
        nextTicketPhotoId = await savePhotoBlob(ticketPhotoFile);
      } catch {
        setSaveMessage("Ticket photo could not be saved. Job was not saved.");
        return;
      }
    }

    const job = {
      date,
      company,
      rigNameOrNumber,
      id: editingJobId || crypto.randomUUID(),
      payPeriodId: payPeriod.id,
      ticketPhotoId: nextTicketPhotoId,
      jobType,
      buckingState: jobType === JOB_TYPES.BUCKING ? buckingState : "",
      jobsCompleted: jobsCompletedValue,
      hoursPerJob: hoursPerJobValue,
      hoursWorked: hoursWorkedValue,
      baseJobPay: baseJobPayValue,
      additionalHours: additionalHoursValue,
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

  async function removeTicketPhoto() {
    if (!ticketPhotoId) {
      setTicketPhotoFile(null);
      setTicketPhotoPreviewUrl("");
      return;
    }

    const confirmed = window.confirm("Remove this ticket photo from the saved job?");

    if (!confirmed) {
      return;
    }

    try {
      await deletePhotoBlob(ticketPhotoId);
    } catch {
      setSaveMessage("Ticket photo reference was removed, but the stored photo could not be deleted.");
    }

    setTicketPhotoId("");
    setTicketPhotoFile(null);
    setTicketPhotoPreviewUrl("");
    setSaveMessage("Ticket photo removed. Save job changes to keep this update.");
  }

  function cancelEdit() {
    resetForm("");
  }

  return (
    <section className="panel">
      <h2>{editingJobId ? "Edit Job Ticket" : "Add Job Ticket"}</h2>

      <label className="field">
        Job Type
        <select
          value={jobType}
          onChange={(event) => {
            const nextJobType = event.target.value;

            setJobType(nextJobType);

            if (nextJobType === JOB_TYPES.BUCKING) {
              setBuckingState(BUCKING_STATES.TEXAS);
              setJobsCompleted("1");
              setHoursWorked(String(BUCKING_HOURS_BY_STATE[BUCKING_STATES.TEXAS]));
            }
          }}
        >
          <option value={JOB_TYPES.BUCKING}>Bucking</option>
          <option value={JOB_TYPES.TORQUE_TURN}>Torque Turn</option>
        </select>
      </label>

      <label className="field">
        Date
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>

      <label className="field">
        Company
        <input
          type="text"
          list="timesheet-company-options"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="Select or type company"
        />
        <datalist id="timesheet-company-options">
          {TIMESHEET_COMPANIES.map((companyOption) => (
            <option key={companyOption} value={companyOption} />
          ))}
        </datalist>
      </label>

      <label className="field">
        Rig Name/Number
        <input
          type="text"
          value={rigNameOrNumber}
          onChange={(event) => setRigNameOrNumber(event.target.value)}
          placeholder="Example: Scan Vision"
        />
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
        <>
          <label className="field">
            Bucking State
            <select
              value={buckingState}
              onChange={(event) => {
                const nextState = event.target.value;

                setBuckingState(nextState);
                setHoursWorked(String(calculateDefaultBuckingHours(jobsCompleted, nextState)));
              }}
            >
              <option value={BUCKING_STATES.TEXAS}>Texas</option>
              <option value={BUCKING_STATES.NEW_MEXICO}>New Mexico</option>
            </select>
          </label>

          <label className="field">
            Jobs Completed
            <input
              type="number"
              min="0"
              step="1"
              value={jobsCompleted}
              onChange={(event) => {
                const nextJobsCompleted = event.target.value;

                setJobsCompleted(nextJobsCompleted);
                setHoursWorked(String(calculateDefaultBuckingHours(nextJobsCompleted, buckingState)));
              }}
            />
          </label>

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
        </>
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
            Additional Hours After 24
            <input
              type="number"
              min="0"
              step="0.25"
              value={additionalHours}
              onChange={(event) => setAdditionalHours(event.target.value)}
            />
          </label>
        </>
      )}

      <label className="field">
        Ticket Photo
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            setTicketPhotoFile(event.target.files?.[0] || null);
          }}
        />
      </label>

      {ticketPhotoId && !ticketPhotoFile && (
        <p className="helper">Ticket photo already attached.</p>
      )}

      {ticketPhotoPreviewUrl && (
        <img
          src={ticketPhotoPreviewUrl}
          alt="Attached ticket preview"
          style={{
            display: "block",
            maxWidth: "240px",
            maxHeight: "240px",
            marginTop: "0.75rem",
            borderRadius: "0.75rem",
            border: "1px solid #d8d4ef",
          }}
        />
      )}

      {(ticketPhotoId || ticketPhotoFile) && (
        <button type="button" onClick={removeTicketPhoto}>
          Remove Ticket Photo
        </button>
      )}

      {ticketPhotoFile && (
        <p className="helper">Selected ticket photo: {ticketPhotoFile.name}</p>
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
