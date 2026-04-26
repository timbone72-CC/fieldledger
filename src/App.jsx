import "./App.css";
import JobEntryForm from "./features/jobs/JobEntryForm.jsx";

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

      <JobEntryForm />
    </main>
  );
}
