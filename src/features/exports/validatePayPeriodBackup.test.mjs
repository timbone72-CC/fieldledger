import assert from "node:assert/strict";
import { isValidPayPeriodBackup } from "./validatePayPeriodBackup.js";

/**
 * 1. Valid Backup
 */

const validBackup = {
  id: "active",
  schemaVersion: 1,
  jobs: [],
  expenses: [],
  mileageEntries: [
    {
      id: "mileage-1",
      payPeriodId: "active",
      date: "2026-05-07",
      vehicle: "Truck",
      startLocation: "Yard",
      endLocation: "Rig",
      businessPurpose: "Field work",
      miles: 123,
      mileageRateSnapshot: 0.67,
      notes: "",
      createdAt: "2026-05-07T12:00:00.000Z",
      updatedAt: "2026-05-07T12:00:00.000Z",
    },
  ],
};

assert.equal(isValidPayPeriodBackup(validBackup), true);

assert.equal(
  isValidPayPeriodBackup({
    ...validBackup,
    expenses: [
      {
        id: "expense-1",
        payPeriodId: "active",
        receiptPhotos: [{ id: "receipt-photo-1", name: "Fuel receipt" }],
        date: "2026-05-07",
        vendor: "Pilot",
        category: "Fuel",
        amount: 50,
        notes: "",
        createdAt: "2026-05-07T12:00:00.000Z",
        updatedAt: "2026-05-07T12:00:00.000Z",
      },
    ],
  }),
  true,
);

/**
 * 2. Invalid Backup
 */

assert.equal(isValidPayPeriodBackup({ ...validBackup, schemaVersion: "bad" }), false);
assert.equal(isValidPayPeriodBackup({ ...validBackup, mileageEntries: "bad" }), false);
assert.equal(
  isValidPayPeriodBackup({
    ...validBackup,
    mileageEntries: [{ ...validBackup.mileageEntries[0], miles: 0 }],
  }),
  false,
);

console.log("validatePayPeriodBackup tests passed");
