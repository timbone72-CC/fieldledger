import assert from "node:assert/strict";
import { buildPayPeriodCsv } from "./payPeriodCsv.js";

const payPeriod = {
  label: "May 2026",
  startDate: "2026-05-01",
  endDate: "2026-05-15",
  jobs: [
    {
      jobType: "bucking",
      date: "2026-05-02",
      company: "Legend",
      rigNameOrNumber: "Rig 12",
      fieldTicketNumber: "FT-100",
      hoursWorked: 6,
      transportation: 25,
      totalPay: 168,
    },
    {
      jobType: "torque_turn",
      date: "2026-05-03",
      company: "Legend",
      rigNameOrNumber: "Rig 14",
      fieldTicketNumber: "FT-200",
      baseJobPay: 1400,
      additionalHours: 7,
      transportation: 0,
      totalPay: 1596,
    },
  ],
  mileageEntries: [
    {
      miles: 10,
      mileageRateSnapshot: 0.67,
      businessPurpose: "Test mileage",
    },
  ],
};

const csv = buildPayPeriodCsv(payPeriod);
const rows = csv.split("\n").map((row) => row.split(","));

const headerRow = rows.find((row) => row[0] === "Date");
assert.deepEqual(headerRow, [
  "Date",
  "Company",
  "Rig Name/Number",
  "Field Ticket Number",
  "Day Rate",
  "Hours Worked",
  "Transportation",
  "Total",
]);

const buckingRow = rows.find((row) => row[3] === "FT-100");
assert.deepEqual(buckingRow, [
  "2026-05-02",
  "Legend",
  "Rig 12",
  "FT-100",
  "",
  "6",
  "25",
  "168",
]);

const torqueTurnRow = rows.find((row) => row[3] === "FT-200");
assert.deepEqual(torqueTurnRow, [
  "2026-05-03",
  "Legend",
  "Rig 14",
  "FT-200",
  "1400",
  "7",
  "0",
  "1596",
]);

const grandTotalRow = rows.find((row) => row[0] === "Grand Total");
assert.deepEqual(grandTotalRow, ["Grand Total", "", "", "", "", "", "", "1764"]);

assert.doesNotMatch(csv, /mileageEntries/);
assert.doesNotMatch(csv, /mileageRateSnapshot/);
assert.doesNotMatch(csv, /businessPurpose/);

console.log("payPeriodCsvExport tests passed");
