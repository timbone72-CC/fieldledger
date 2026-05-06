import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/features/exports/DownloadPayPeriodCsvButton.jsx", "utf8");

assert.match(source, /Legend Energy Group/);
assert.match(source, /Field Ticket Number/);
assert.match(source, /Grand Total/);
assert.match(source, /function getHoursWorkedForTimesheet/);
assert.match(source, /function calculateGrandTotal/);

assert.doesNotMatch(source, /mileageEntries/);
assert.doesNotMatch(source, /mileageRateSnapshot/);
assert.doesNotMatch(source, /businessPurpose/);

console.log("payPeriodCsvExport tests passed");
