import { useState } from "react";
import "./App.css";

const HOURLY_RATE_DEFAULT = 28;

export default function App() {
  const [hourlyRate, setHourlyRate] = useState(HOURLY_RATE_DEFAULT);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">FieldLedger</p>
        <h1>1099 ticket, receipt, and pay-period tracker</h1>
        <p className="subtext">
          Capture job tickets and receipts, review the extracted details, calculate pay,
          subtract expenses, and export a clean pay-period report.
        </p>
      </section>

      <section className="panel">
        <h2>Current Pay Settings</h2>

        <label className="field">
          Hourly Rate
          <input
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(Number(event.target.value))}
          />
        </label>

        <p className="helper">
          Bucking jobs use hours × hourly rate. Torque Turn jobs use base job pay
          plus hours beyond 24 × hourly rate.
        </p>
      </section>

      <section className="actions">
        <button type="button">Add Job Ticket</button>
        <button type="button">Add Receipt</button>
        <button type="button">Download Pay Period</button>
      </section>
    </main>
  );
}
