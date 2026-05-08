import { useEffect, useMemo, useRef, useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { calculateJobPay } from "../../shared/utils/calculateJobPay.js";
import { DEFAULT_HOURLY_RATE, JOB_TYPES, TIMESHEET_COMPANIES } from "../../shared/constants/fieldLedgerDefaults.js";
import { deletePhotoBlob, loadPhotoBlob, savePhotoBlob } from "../../shared/storage/photoBlobStorage.js";
import { loadSettings } from "../settings/settingsStorage.js";
import CameraCapture from "../../shared/components/CameraCapture.jsx";

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

export default function JobEntryForm({ onJobSaved }) {
  const ticketPhotoInputRef = useRef(null);
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
  const [fieldTicketNumber, setFieldTicketNumber] = useState("");
  const [transportation, setTransportation] = useState("");

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
      if (ticketPhotoInputRef.current) {
        ticketPhotoInputRef.current.value = "";
      }
      setDate(job.date || "");
      setCompany(job.company || "");
      setRigNameOrNumber(job.rigNameOrNumber || "");
      setFieldTicketNumber(job.fieldTicketNumber || "");
      setTransportation(job.transportation || "");
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
    let cancelled = false;

    async function loadTicketPhotoPreview() {
      try {
        if (ticketPhotoFile) {
          previewUrl = URL.createObjectURL(ticketPhotoFile);

          if (!cancelled) {
            setTicketPhotoPreviewUrl(previewUrl);
          }

          return;
        }

        if (!ticketPhotoId) {
          setTicketPhotoPreviewUrl("");
          return;
        }

        const photoRecord = await loadPhotoBlob(ticketPhotoId);

        if (!photoRecord?.blob) {
          setTicketPhotoPreviewUrl("");
          return;
        }

        previewUrl = URL.createObjectURL(photoRecord.blob);

        if (!cancelled) {
          setTicketPhotoPreviewUrl(previewUrl);
        }
      } catch {
        setTicketPhotoPreviewUrl("");
      }
    }

    loadTicketPhotoPreview();

    return () => {
      cancelled = true;

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
    if (ticketPhotoInputRef.current) {
      ticketPhotoInputRef.current.value = "";
    }
    setDate("");
    setCompany("");
    setRigNameOrNumber("");
    setFieldTicketNumber("");
    setTransportation("");
    setSaveMessage(message);
  }

  async function saveJob() {
    const payPeriod = loadActivePayPeriod();

    const jobsCompletedValue = jobType === JOB_TYPES.BUCKING ? Number(jobsCompleted || 0) : 0;
    const hoursPerJobValue = jobType === JOB_TYPES.BUCKING ? Number(BUCKING_HOURS_BY_STATE[buckingState] || 0) : 0;
    const hoursWorkedValue = jobType === JOB_TYPES.BUCKING ? Number(hoursWorked || 0) : 0;
    const baseJobPayValue = jobType === JOB_TYPES.TORQUE_TURN ? Number(baseJobPay || 0) : 0;
    const additionalHoursValue = jobType === JOB_TYPES.TORQUE_TURN ? Number(additionalHours || 0) : 0;
    const transportationValue = Number(transportation || 0);
    const hourlyRateSnapshotValue = Number(hourlyRateSnapshot || 0);

    if (
      jobsCompletedValue < 0 ||
      hoursWorkedValue < 0 ||
      baseJobPayValue < 0 ||
      additionalHoursValue < 0 ||
      transportationValue < 0 ||
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

    
    if (!date || !company) {
      setSaveMessage("Date and Company are required.");
      return;
    }

    const job = {
      date,
      company,
      rigNameOrNumber,
      fieldTicketNumber,
      transportation: transportationValue,
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

    const saved = saveActivePayPeriod({
      ...payPeriod,
      jobs: nextJobs,
      updatedAt: new Date().toISOString(),
    });

    if (!saved) {
      setSaveMessage("Job could not be saved.");
      return;
    }

    resetForm(editingJobId ? "Job updated." : "Job saved.");

    if (typeof onJobSaved === "function") {
      onJobSaved();
    }
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
        Field Ticket Number
        <input
          type="text"
          value={fieldTicketNumber}
          onChange={(event) => setFieldTicketNumber(event.target.value)}
          placeholder="Example: 12345"
        />
      </label>

      <label className="field">
        Transportation
        <input
          type="number"
          min="0"
          step="0.01"
          value={transportation}
          onChange={(event) => setTransportation(event.target.value)}
          placeholder="Example: 150"
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

      <CameraCapture
        label="Take Ticket Photo"
        onPhotoCaptured={(photoFile) => {
          setTicketPhotoFile(photoFile);
          if (ticketPhotoInputRef.current) {
            ticketPhotoInputRef.current.value = "";
          }
        }}
      />

      <label className="field">
        Upload Ticket Photo
        <input
          ref={ticketPhotoInputRef}
          type="file"
          accept="image/*"
          capture="environment"
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
