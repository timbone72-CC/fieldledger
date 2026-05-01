import { useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

export default function SavedMileageList() {
  const payPeriod = loadActivePayPeriod();
  const mileageEntries = Array.isArray(payPeriod.mileageEntries) ? payPeriod.mileageEntries : [];
  const [selectedMileageIds, setSelectedMileageIds] = useState([]);

  function toggleMileageSelection(mileageId) {
    setSelectedMileageIds((currentIds) => {
      if (currentIds.includes(mileageId)) {
        return currentIds.filter((id) => id !== mileageId);
      }

      return [...currentIds, mileageId];
    });
  }

  function deleteSelectedMileage() {
    const selectedCount = selectedMileageIds.length;
    const confirmed = window.confirm(`Delete ${selectedCount} selected mileage entrie(s)?`);

    if (!confirmed) {
      return;
    }

    const latestPayPeriod = loadActivePayPeriod();
    const latestMileageEntries = Array.isArray(latestPayPeriod.mileageEntries)
      ? latestPayPeriod.mileageEntries
      : [];

    saveActivePayPeriod({
      ...latestPayPeriod,
      mileageEntries: latestMileageEntries.filter(
        (entry) => !selectedMileageIds.includes(entry.id),
      ),
      updatedAt: new Date().toISOString(),
    });

    window.location.reload();
  }

  return (
    <section className="panel">
      <h2>Saved Mileage</h2>

      {mileageEntries.length === 0 ? (
        <p className="helper">No mileage saved yet.</p>
      ) : (
        <>
          <div className="section-actions">
            <button
              type="button"
              onClick={deleteSelectedMileage}
              disabled={selectedMileageIds.length === 0}
            >
              Delete Selected Mileage
            </button>
          </div>

          <div className="list">
            {mileageEntries.map((entry) => (
              <label className="result-card" key={entry.id}>
                <input
                  type="checkbox"
                  checked={selectedMileageIds.includes(entry.id)}
                  onChange={() => toggleMileageSelection(entry.id)}
                />

                <div>
                  <span>{formatMileageLabel(entry)}</span>
                  <strong>{Number(entry.miles || 0).toFixed(1)} miles</strong>
                  <span>
                    Estimate: ${Number((entry.miles || 0) * (entry.mileageRateSnapshot || 0)).toFixed(2)}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function formatMileageLabel(entry) {
  const vehicle = entry.vehicle || "Vehicle";
  const purpose = entry.businessPurpose || "Mileage";
  return `${vehicle} — ${purpose}`;
}
