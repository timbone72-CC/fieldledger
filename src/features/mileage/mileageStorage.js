import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

export function loadMileageEntries() {
  const payPeriod = loadActivePayPeriod();
  return Array.isArray(payPeriod.mileageEntries) ? payPeriod.mileageEntries : [];
}

export function saveMileageEntries(nextEntries) {
  const payPeriod = loadActivePayPeriod();
  const safeEntries = Array.isArray(nextEntries) ? nextEntries : [];

  saveActivePayPeriod({
    ...payPeriod,
    mileageEntries: safeEntries,
    updatedAt: new Date().toISOString(),
  });
}
