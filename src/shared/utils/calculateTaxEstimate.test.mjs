import assert from "node:assert/strict";
import { calculateTaxEstimate } from "./calculateTaxEstimate.js";

const estimate = calculateTaxEstimate(
  {
    netIncome: 1000,
  },
  {
    selfEmploymentTaxRate: 0.153,
    federalTaxRate: 0.12,
  }
);

assert.deepEqual(estimate, {
  estimatedTaxableIncome: 1000,
  estimatedSelfEmploymentTax: 153,
  estimatedFederalTax: 120,
  estimatedTotalTax: 273,
  estimatedTakeHomeAfterTax: 727,
});

const negativeEstimate = calculateTaxEstimate(
  {
    netIncome: -50,
  },
  {
    selfEmploymentTaxRate: 0.153,
    federalTaxRate: 0.12,
  }
);

assert.deepEqual(negativeEstimate, {
  estimatedTaxableIncome: 0,
  estimatedSelfEmploymentTax: 0,
  estimatedFederalTax: 0,
  estimatedTotalTax: 0,
  estimatedTakeHomeAfterTax: -50,
});

console.log("calculateTaxEstimate tests passed");
