import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { calculateMileageSummary } from "../../shared/utils/calculateMileageSummary.js";

export default function TimesheetPrintView() {
  const payPeriod = loadActivePayPeriod();
  const jobs = Array.isArray(payPeriod.jobs) ? payPeriod.jobs : [];
  const mileageEntries = Array.isArray(payPeriod.mileageEntries) ? payPeriod.mileageEntries : [];

  const mileageSummary = calculateMileageSummary(mileageEntries);

  return (
    <section className="timesheet-print-view">
      <h2>Pay Period Report</h2>

      <table className="timesheet-print-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Company</th>
            <th>Rig Name/Number</th>
            <th>Field Ticket Number</th>
            <th>Day Rate</th>
            <th>Hours Worked</th>
            <th>Transportation</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="8">No jobs saved.</td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.date || ""}</td>
                <td>{job.company || ""}</td>
                <td>{job.rigNameOrNumber || ""}</td>
                <td>{job.fieldTicketNumber || ""}</td>
                <td>{job.baseJobPay || ""}</td>
                <td>{getHoursWorkedForTimesheet(job)}</td>
                <td>{job.transportation || ""}</td>
                <td>{job.totalPay || 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <section className="timesheet-mileage-summary">
        <h3>Mileage Details</h3>

        {mileageEntries.length === 0 ? (
          <p>No mileage entries.</p>
        ) : (
          <>
            <table className="timesheet-print-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Vehicle</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Purpose</th>
                  <th>Miles</th>
                  <th>Rate</th>
                  <th>Estimate</th>
                </tr>
              </thead>

              <tbody>
                {mileageEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date || ""}</td>
                    <td>{entry.vehicle || ""}</td>
                    <td>{entry.startLocation || ""}</td>
                    <td>{entry.endLocation || ""}</td>
                    <td>{entry.businessPurpose || ""}</td>
                    <td>{Number(entry.miles || 0).toFixed(1)}</td>
                    <td>${Number(entry.mileageRateSnapshot || 0).toFixed(2)}</td>
                    <td>
                      $
                      {Number(
                        (entry.miles || 0) * (entry.mileageRateSnapshot || 0),
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p>
              Total Business Miles:{" "}
              <strong>{mileageSummary.totalBusinessMiles.toFixed(2)} mi</strong>
            </p>

            <p>
              Estimated Mileage Value:{" "}
              <strong>${mileageSummary.totalMileageEstimate.toFixed(2)}</strong>
            </p>
          </>
        )}
      </section>
    </section>
  );
}

function getHoursWorkedForTimesheet(job) {
  if (job?.jobType === "torque_turn") {
    return job.additionalHours || 0;
  }

  return job?.hoursWorked || 0;
}
