import assert from "node:assert/strict";
import { calculatePayPeriodSummary } from "./calculatePayPeriodSummary.js";

const summary = calculatePayPeriodSummary({
  jobs: [
    {
      jobType: "bucking",
      hoursWorked: 6,
      hourlyRateSnapshot: 28,
    },
    {
      jobType: "torque_turn",
      baseJobPay: 1400,
      totalJobHours: 31,
      hourlyRateSnapshot: 28,
    },
  ],
  expenses: [
    {
      amount: 50,
    },
    {
      amount: 25,
    },
  ],
});

assert.deepEqual(summary, {
  grossEarnings: 1764,
  expenseTotal: 75,
  netIncome: 1689,
  jobCount: 2,
  expenseCount: 2,
});

console.log("calculatePayPeriodSummary tests passed");
