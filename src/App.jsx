import "./App.css";
import ExpenseEntryForm from "./features/expenses/ExpenseEntryForm.jsx";
import SavedExpensesList from "./features/expenses/SavedExpensesList.jsx";
import JobEntryForm from "./features/jobs/JobEntryForm.jsx";
import SavedJobsList from "./features/jobs/SavedJobsList.jsx";
import ClearPayPeriodButton from "./features/pay-periods/ClearPayPeriodButton.jsx";
import PayPeriodSummaryPanel from "./features/pay-periods/PayPeriodSummaryPanel.jsx";

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">FieldLedger</p>
        <h1>1099 ticket, receipt, and pay-period tracker</h1>
        <p className="subtext">
          Capture job tickets and receipts, review the details, calculate pay,
          subtract expenses, and export a clean pay-period report.
        </p>
      </section>

      <PayPeriodSummaryPanel />
      <ClearPayPeriodButton />
      <SavedJobsList />
      <SavedExpensesList />
      <JobEntryForm />
      <ExpenseEntryForm />
    </main>
  );
}
