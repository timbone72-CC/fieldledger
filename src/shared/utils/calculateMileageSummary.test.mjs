import assert from "node:assert/strict";
import { calculateMileageSummary } from "./calculateMileageSummary.js";

const emptySummary = calculateMileageSummary([]);

assert.equal(emptySummary.totalBusinessMiles, 0);
assert.equal(emptySummary.totalMileageEstimate, 0);

const summary = calculateMileageSummary([
  {
    miles: 10,
    mileageRateSnapshot: 0.67,
  },
  {
    miles: 25,
    mileageRateSnapshot: 0.67,
  },
]);

assert.equal(summary.totalBusinessMiles, 35);
assert.equal(summary.totalMileageEstimate, 23.45);

const mixedRateSummary = calculateMileageSummary([
  {
    miles: 10,
    mileageRateSnapshot: 0.67,
  },
  {
    miles: 10,
    mileageRateSnapshot: 0.7,
  },
]);

assert.equal(mixedRateSummary.totalBusinessMiles, 20);
assert.equal(mixedRateSummary.totalMileageEstimate, 13.7);

console.log("calculateMileageSummary tests passed");
