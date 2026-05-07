import assert from "node:assert/strict";
import { validateActivePayPeriod } from "./validateActivePayPeriod.js";

/**
 * 1. Valid Pay Period Shape
 */

const validPayPeriod = {
  id: "active",
  label: "Current Pay Period",
  startDate: "",
  endDate: "",
  status: "open",
  schemaVersion: 1,
  jobs: [],
  expenses: [],
  mileageEntries: [],
};

assert.deepEqual(validateActivePayPeriod(validPayPeriod), {
  isValid: true,
  errors: [],
});

/**
 * 2. Invalid Pay Period Shape
 */

const invalidPayPeriod = {
  id: 123,
  label: "Bad Pay Period",
  startDate: "",
  endDate: "",
  status: "open",
  schemaVersion: "bad",
  jobs: "not an array",
  expenses: [],
  mileageEntries: [],
};

assert.deepEqual(validateActivePayPeriod(invalidPayPeriod), {
  isValid: false,
  errors: ["id must be a string.", "schemaVersion must be a number.", "jobs must be an array."],
});

console.log("validateActivePayPeriod tests passed");
