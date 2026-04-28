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
    link.click();

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
    [
      "Section",
      "Date",
      "Type",
      "Name",
      "Category",
      "Bucking State",
      "Jobs Completed",
      "Hours Per Job",
      "Hours",
      "Base Pay",
      "Hourly Rate",
      "Amount",
      "Notes",
    ],
  ];

  const jobs = Array.isArray(payPeriod?.jobs) ? payPeriod.jobs : [];
  const expenses = Array.isArray(payPeriod?.expenses) ? payPeriod.expenses : [];

  jobs.forEach((job) => {
    rows.push([
      "Job",
      job.date || "",
      job.jobType || "",
      job.company || "",
      "",
      job.jobType === "bucking" ? job.buckingState || "" : "",
      job.jobType === "bucking" ? job.jobsCompleted || 0 : "",
      job.jobType === "bucking" ? job.hoursPerJob || 0 : "",
      job.jobType === "torque_turn" ? job.totalJobHours || 0 : job.hoursWorked || 0,
      job.baseJobPay || 0,
      job.hourlyRateSnapshot || 0,
      job.totalPay || 0,
      job.notes || "",
    ]);
  });

  expenses.forEach((expense) => {
    rows.push([
      "Expense",
      expense.date || "",
      "",
      expense.vendor || "",
      expense.category || "",
      "",
      "",
      "",
      "",
      "",
      "",
      expense.amount || 0,
      expense.notes || "",
    ]);
  });

  return rows.map((row) => row.map(formatCsvCell).join(",")).join("\n");
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
