import { useMemo, useState } from "react";
import { calculateJobPay } from "../../shared/utils/calculateJobPay.js";
import { DEFAULT_HOURLY_RATE, JOB_TYPES } from "../../shared/constants/fieldLedgerDefaults.js";

export default function JobEntryForm() {
  const [jobType, setJobType] = useState(JOB_TYPES.BUCKING);
  const [hoursWorked, setHoursWorked] = useState("");
  const [baseJobPay, setBaseJobPay] = useState("");
  const [totalJobHours, setTotalJobHours] = useState("");
  const [hourlyRateSnapshot, setHourlyRateSnapshot] = useState(DEFAULT_HOURLY_RATE);

  const calculatedPay = useMemo(() => {
    return calculateJobPay({
      jobType,
      hoursWorked,
      baseJobPay,
      totalJobHours,
      hourlyRateSnapshot,
    });
  }, [baseJobPay, hourlyRateSnapshot, hoursWorked, jobType, totalJobHours]);

  return (
    <section className="panel">
      <h2>Add Job Ticket</h2>

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
    </section>
  );
}
