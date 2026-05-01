import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

export default function SavedMileageList() {
  const payPeriod = loadActivePayPeriod();
  const mileageEntries = Array.isArray(payPeriod.mileageEntries) ? payPeriod.mileageEntries : [];

  return (
    <section className="panel">
      <h2>Saved Mileage</h2>

      {mileageEntries.length === 0 ? (
        <p className="helper">No mileage saved yet.</p>
      ) : (
        <div className="list">
          {mileageEntries.map((entry) => (
            <div className="result-card" key={entry.id}>
              <span>{formatMileageLabel(entry)}</span>
              <strong>{Number(entry.miles || 0).toFixed(1)} miles</strong>
              <span>
                Estimate: ${Number((entry.miles || 0) * (entry.mileageRateSnapshot || 0)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatMileageLabel(entry) {
  const vehicle = entry.vehicle || "Vehicle";
  const purpose = entry.businessPurpose || "Mileage";
  return `${vehicle} — ${purpose}`;
}
