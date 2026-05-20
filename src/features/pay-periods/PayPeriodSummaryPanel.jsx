import { calculatePayPeriodSummary } from "../../shared/utils/calculatePayPeriodSummary.js";
import { calculateMileageSummary } from "../../shared/utils/calculateMileageSummary.js";
import { calculateTaxEstimate } from "../../shared/utils/calculateTaxEstimate.js";
import { TAX_DISCLAIMER } from "../../shared/constants/fieldLedgerDefaults.js";
import { loadSettings } from "../settings/settingsStorage.js";
import { loadActivePayPeriod } from "./activePayPeriodStorage.js";

export default function PayPeriodSummaryPanel() {
  const payPeriod = loadActivePayPeriod();
  const summary = calculatePayPeriodSummary(payPeriod);
  const mileageSummary = calculateMileageSummary(payPeriod.mileageEntries);
  const settings = loadSettings();
  const taxEstimate = calculateTaxEstimate(summary, {
    selfEmploymentTaxRate: settings.selfEmploymentTaxRate,
    federalTaxRate: settings.federalTaxRate,
    stateTaxRate: settings.stateTaxRate,
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
        <span>Business Miles</span>
        <strong>{mileageSummary.totalBusinessMiles.toFixed(2)} mi</strong>
      </div>

      <div className="result-card">
        <span>Mileage Estimate</span>
        <strong>${mileageSummary.totalMileageEstimate.toFixed(2)}</strong>
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
