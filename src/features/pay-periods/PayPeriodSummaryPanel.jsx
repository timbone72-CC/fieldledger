import { calculatePayPeriodSummary } from "../../shared/utils/calculatePayPeriodSummary.js";
import { calculateTaxEstimate } from "../../shared/utils/calculateTaxEstimate.js";
import {
  DEFAULT_FEDERAL_TAX_RATE,
  DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
  TAX_DISCLAIMER,
} from "../../shared/constants/fieldLedgerDefaults.js";
import { loadActivePayPeriod } from "./activePayPeriodStorage.js";

export default function PayPeriodSummaryPanel() {
  const payPeriod = loadActivePayPeriod();
  const summary = calculatePayPeriodSummary(payPeriod);
  const taxEstimate = calculateTaxEstimate(summary, {
    selfEmploymentTaxRate: DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
    federalTaxRate: DEFAULT_FEDERAL_TAX_RATE,
  });

  return (
    <section className="panel">
      <h2>Pay Period Summary</h2>

      <p className="helper">
        {payPeriod.label || "Current Pay Period"}
        {payPeriod.startDate || payPeriod.endDate
          ? ` — ${payPeriod.startDate || "No start date"} to ${payPeriod.endDate || "No end date"}`
          : ""}
      </p>

      <div className="result-card">
        <span>Gross Earnings</span>
        <strong>${summary.grossEarnings.toFixed(2)}</strong>
      </div>

      <div className="result-card">
        <span>Expenses</span>
        <strong>${summary.expenseTotal.toFixed(2)}</strong>
      </div>

      <div className="result-card">
        <span>Net Income</span>
        <strong>${summary.netIncome.toFixed(2)}</strong>
      </div>

      <div className="result-card">
        <span>Estimated Tax</span>
        <strong>${taxEstimate.estimatedTotalTax.toFixed(2)}</strong>
      </div>

      <div className="result-card">
        <span>Estimated Take-Home</span>
        <strong>${taxEstimate.estimatedTakeHomeAfterTax.toFixed(2)}</strong>
      </div>

      <p className="helper">{TAX_DISCLAIMER}</p>
    </section>
  );
}
