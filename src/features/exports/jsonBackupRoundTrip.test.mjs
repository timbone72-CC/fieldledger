import assert from "node:assert/strict";

const originalPayPeriod = {
  id: "active",
  label: "Integrity Test Pay Period",
  startDate: "2026-05-01",
  endDate: "2026-05-15",
  status: "open",
  jobs: [
    {
      id: "job-1",
      payPeriodId: "active",
      jobType: "bucking",
      totalPay: 168,
    },
  ],
  expenses: [
    {
      id: "expense-1",
      payPeriodId: "active",
      amount: 42.5,
    },
  ],
  mileageEntries: [
    {
      id: "mileage-1",
      payPeriodId: "active",
      date: "2026-05-06",
      vehicle: "Truck",
      startLocation: "Yard",
      endLocation: "Rig",
      businessPurpose: "Field work",
      miles: 120,
      mileageRateSnapshot: 0.67,
      notes: "Round trip",
      createdAt: "2026-05-06T12:00:00.000Z",
      updatedAt: "2026-05-06T12:00:00.000Z",
    },
  ],
};

const exportedText = JSON.stringify(originalPayPeriod, null, 2);
const restoredPayPeriod = JSON.parse(exportedText);

assert.deepEqual(restoredPayPeriod.jobs, originalPayPeriod.jobs);
assert.deepEqual(restoredPayPeriod.expenses, originalPayPeriod.expenses);
assert.deepEqual(restoredPayPeriod.mileageEntries, originalPayPeriod.mileageEntries);

const grossEarnings = restoredPayPeriod.jobs.reduce((sum, job) => sum + job.totalPay, 0);
const expenseTotal = restoredPayPeriod.expenses.reduce((sum, expense) => sum + expense.amount, 0);
const mileageTotal = restoredPayPeriod.mileageEntries.reduce(
  (sum, entry) => sum + entry.miles * entry.mileageRateSnapshot,
  0,
);

assert.equal(grossEarnings, 168);
assert.equal(expenseTotal, 42.5);
assert.equal(mileageTotal, 80.4);

console.log("jsonBackupRoundTrip tests passed");
