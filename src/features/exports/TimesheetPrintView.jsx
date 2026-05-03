import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

export default function TimesheetPrintView() {
  const payPeriod = loadActivePayPeriod();
  const jobs = Array.isArray(payPeriod.jobs) ? payPeriod.jobs : [];

  return (
    <section className="timesheet-print-view">
      <h2>Timesheet</h2>

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
    </section>
  );
}

function getHoursWorkedForTimesheet(job) {
  if (job?.jobType === "torque_turn") {
    return job.additionalHours || 0;
  }

  return job?.hoursWorked || 0;
}
