export function buildPayPeriodCsv(payPeriod) {
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
      job.baseJobPay ?? "",
      getHoursWorkedForTimesheet(job),
      job.transportation ?? "",
      job.totalPay || 0,
    ]);
  });

  rows.push([]);
  rows.push(["Grand Total", "", "", "", "", "", "", calculateGrandTotal(jobs)]);

  return rows.map((row) => row.map(formatCsvCell).join(",")).join("\n");
}

export function getHoursWorkedForTimesheet(job) {
  if (job?.jobType === "torque_turn") {
    return job.additionalHours || 0;
  }

  return job?.hoursWorked || 0;
}

export function calculateGrandTotal(jobs) {
  return jobs.reduce((total, job) => total + Number(job.totalPay || 0), 0);
}

export function formatCsvCell(value) {
  const text = String(value ?? "");

  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}
