import { useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "./activePayPeriodStorage.js";

export default function PayPeriodInfoForm() {
  const payPeriod = loadActivePayPeriod();

  const [label, setLabel] = useState(payPeriod.label || "Current Pay Period");
  const [startDate, setStartDate] = useState(payPeriod.startDate || "");
  const [endDate, setEndDate] = useState(payPeriod.endDate || "");
  const [saveMessage, setSaveMessage] = useState("");

  function savePayPeriodInfo() {
    const currentPayPeriod = loadActivePayPeriod();

    const saved = saveActivePayPeriod({
      ...currentPayPeriod,
      label,
      startDate,
      endDate,
      updatedAt: new Date().toISOString(),
    });

    if (!saved) {
      setSaveMessage("Pay period could not be saved.");
      return;
    }

    setSaveMessage("Pay period saved.");
  }

  return (
    <section className="panel">
      <h2>Pay Period Info</h2>

      <div className="responsive-form-grid">
        <label className="field form-span-full">
          Label
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Example: April 1–15"
          />
        </label>

        <label className="field">
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>

        <label className="field">
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>

        <div className="form-actions form-span-full">
          <button type="button" onClick={savePayPeriodInfo}>
            Save Pay Period Info
          </button>
        </div>

        {saveMessage && <p className="helper form-span-full">{saveMessage}</p>}
      </div>
    </section>
  );
}
