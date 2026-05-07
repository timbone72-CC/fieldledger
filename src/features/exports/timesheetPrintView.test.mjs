import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/features/exports/TimesheetPrintView.jsx", "utf8");

assert.match(source, /Date/);
assert.match(source, /Company/);
assert.match(source, /Rig Name\/Number/);
assert.match(source, /Field Ticket Number/);
assert.match(source, /Day Rate/);
assert.match(source, /Hours Worked/);
assert.match(source, /Transportation/);
assert.match(source, /Total/);

assert.match(source, /Mileage Details/);
assert.match(source, /mileageEntries/);
assert.match(source, /calculateMileageSummary/);
assert.match(source, /Total Business Miles/);
assert.match(source, /Estimated Mileage Value/);
assert.match(source, /businessPurpose/);
assert.match(source, /mileageRateSnapshot/);

console.log("timesheetPrintView tests passed");
