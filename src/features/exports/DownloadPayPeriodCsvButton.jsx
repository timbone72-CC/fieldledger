import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

export default function DownloadPayPeriodCsvButton() {
  function downloadCsv() {
    const payPeriod = loadActivePayPeriod();
    const csvContent = buildPayPeriodCsv(payPeriod);
    const fileName = buildFileName(payPeriod);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={downloadCsv}>
      Download Spreadsheet CSV
    </button>
  );
}

function buildPayPeriodCsv(payPeriod) {
  const rows = [
    ["Legend Energy Group"],
    ["201 West Vermillion, Suite 200 Lafayette, LA 70501"],
    ["Please remit invoices to: bleger@bwaccounting.com and lorid@bwaccounting.com"],
    [],
    ["Pay Period:", payPeriod?.label || ""],
    ["Start Date:", payPeriod?.startDate || ""],
    ["End Date:", payPeriod?.endDate || ""],
    [],
    ["Name:", "Timothy A Rushing"],
    ["Address:", "222 Blackburn Blvd"],
    ["City, State, Zip:", "Elk City, Ok 73644"],
    ["Phone:", "843-597-4935"],
    ["Email Address:", "timbone72@gmail.com"],
    [],
    [
      "Date",
      "Company",
      "Rig Name/Number",
      "Field Ticket Number",
      "Day Rate",
      "Hours Worked",
      "Transportation",
      "Total",
    ],
  ];

  const jobs = Array.isArray(payPeriod?.jobs) ? payPeriod.jobs : [];

  jobs.forEach((job) => {
    rows.push([
      job.date || "",
      job.company || "",
      job.rigNameOrNumber || "",
      job.fieldTicketNumber || "",
      job.baseJobPay || "",
      getHoursWorkedForTimesheet(job),
      job.transportation || "",
      job.totalPay || 0,
    ]);
  });

  rows.push([]);
  rows.push(["Grand Total", "", "", "", "", "", "", calculateGrandTotal(jobs)]);

  return rows.map((row) => row.map(formatCsvCell).join(",")).join("\n");
}

function getHoursWorkedForTimesheet(job) {
  if (job?.jobType === "torque_turn") {
    return job.additionalHours || 0;
  }

  return job?.hoursWorked || 0;
}

function calculateGrandTotal(jobs) {
  return jobs.reduce((total, job) => total + Number(job.totalPay || 0), 0);
}

function formatCsvCell(value) {
  const text = String(value ?? "");

  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function buildFileName(payPeriod) {
  const label = payPeriod?.label || "current-pay-period";
  const safeLabel = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `fieldledger-${safeLabel || "pay-period"}.csv`;
}
