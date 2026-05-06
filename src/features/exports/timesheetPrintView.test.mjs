import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/features/exports/TimesheetPrintView.jsx", "utf8");

assert.match(source, /Mileage Details/);
assert.match(source, /mileageEntries/);
assert.match(source, /calculateMileageSummary/);
assert.match(source, /Total Business Miles/);
assert.match(source, /Estimated Mileage Value/);
assert.match(source, /businessPurpose/);
assert.match(source, /mileageRateSnapshot/);

console.log("timesheetPrintView tests passed");
