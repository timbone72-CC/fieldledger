import { useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

const DEFAULT_MILEAGE_RATE = 0.67;

export default function MileageEntryForm() {
  const [date, setDate] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [businessPurpose, setBusinessPurpose] = useState("");
  const [miles, setMiles] = useState("");
  const [mileageRateSnapshot, setMileageRateSnapshot] = useState(DEFAULT_MILEAGE_RATE);
  const [notes, setNotes] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  function resetForm(message) {
    setDate("");
    setVehicle("");
    setStartLocation("");
    setEndLocation("");
    setBusinessPurpose("");
    setMiles("");
    setMileageRateSnapshot(DEFAULT_MILEAGE_RATE);
    setNotes("");
    setSaveMessage(message);
  }

  function saveMileageEntry() {
    const payPeriod = loadActivePayPeriod();
    const existingEntries = Array.isArray(payPeriod.mileageEntries) ? payPeriod.mileageEntries : [];

    const milesValue = Number(miles || 0);
    const rateValue = Number(mileageRateSnapshot || 0);

    if (milesValue < 0) {
      setSaveMessage("Negative miles are not allowed.");
      return;
    }

    if (rateValue < 0) {
      setSaveMessage("Negative mileage rate is not allowed.");
      return;
    }

    const mileageEntry = {
      id: crypto.randomUUID(),
      payPeriodId: payPeriod.id,
      date,
      vehicle,
      startLocation,
      endLocation,
      businessPurpose,
      miles: milesValue,
      mileageRateSnapshot: rateValue,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextEntries = [...existingEntries, mileageEntry];

    saveActivePayPeriod({
      ...payPeriod,
      mileageEntries: nextEntries,
      updatedAt: new Date().toISOString(),
    });

    resetForm("Mileage saved. Refresh to update the summary.");

    window.location.reload();
  }

  return (
    <section className="panel">
      <h2>Add Mileage</h2>

      <label className="field">
        Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <label className="field">
        Vehicle
        <input value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
      </label>

      <label className="field">
        Start Location
        <input value={startLocation} onChange={(e) => setStartLocation(e.target.value)} />
      </label>

      <label className="field">
        End Location
        <input value={endLocation} onChange={(e) => setEndLocation(e.target.value)} />
      </label>

      <label className="field">
        Business Purpose
        <input value={businessPurpose} onChange={(e) => setBusinessPurpose(e.target.value)} />
      </label>

      <label className="field">
        Miles
        <input type="number" min="0" step="0.1" value={miles} onChange={(e) => setMiles(e.target.value)} />
      </label>

      <label className="field">
        Mileage Rate
        <input type="number" min="0" step="0.01" value={mileageRateSnapshot} onChange={(e) => setMileageRateSnapshot(e.target.value)} />
      </label>

      <label className="field">
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <button type="button" onClick={saveMileageEntry}>
        Save Mileage
      </button>

      {saveMessage && <p className="helper">{saveMessage}</p>}
    </section>
  );
}