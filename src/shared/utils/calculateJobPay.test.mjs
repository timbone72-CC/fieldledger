import assert from "node:assert/strict";
import { calculateJobPay } from "./calculateJobPay.js";

assert.equal(
  calculateJobPay({
    jobType: "bucking",
    hoursWorked: 6,
    hourlyRateSnapshot: 28,
  }),
  168
);

assert.equal(
  calculateJobPay({
    jobType: "torque_turn",
    baseJobPay: 1400,
    totalJobHours: 31,
    hourlyRateSnapshot: 28,
  }),
  1596
);

assert.equal(
  calculateJobPay({
    jobType: "torque_turn",
    baseJobPay: 1400,
    totalJobHours: 20,
    hourlyRateSnapshot: 28,
  }),
  1400
);

console.log("calculateJobPay tests passed");
