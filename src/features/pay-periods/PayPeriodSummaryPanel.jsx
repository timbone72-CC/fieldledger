import { calculatePayPeriodSummary } from "../../shared/utils/calculatePayPeriodSummary.js";
import { calculateTaxEstimate } from "../../shared/utils/calculateTaxEstimate.js";
import {
  DEFAULT_FEDERAL_TAX_RATE,
  DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
  TAX_DISCLAIMER,
} from "../../shared/constants/fieldLedgerDefaults.js";

const demoPayPeriod = {
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
};

export default function PayPeriodSummaryPanel() {
  const summary = calculatePayPeriodSummary(demoPayPeriod);
  const taxEstimate = calculateTaxEstimate(summary, {
    selfEmploymentTaxRate: DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
    federalTaxRate: DEFAULT_FEDERAL_TAX_RATE,
  });

  return (
    <section className="panel">
      <h2>Pay Period Summary</h2>

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
