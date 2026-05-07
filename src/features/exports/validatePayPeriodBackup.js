/**
 * 1. Pay Period Backup Validation
 *
 * Lightweight import pre-check for JSON backup files before replacing the active pay period.
 */

export function isValidPayPeriodBackup(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.schemaVersion === "number" &&
    Array.isArray(value.jobs) &&
    Array.isArray(value.expenses) &&
    Array.isArray(value.mileageEntries) &&
    value.mileageEntries.every(isValidMileageEntry)
  );
}

/**
 * 2. Mileage Entry Validation
 */

function isValidMileageEntry(entry) {
  return (
    entry &&
    typeof entry === "object" &&
    typeof entry.id === "string" &&
    typeof entry.payPeriodId === "string" &&
    typeof entry.date === "string" &&
    typeof entry.vehicle === "string" &&
    typeof entry.startLocation === "string" &&
    typeof entry.endLocation === "string" &&
    typeof entry.businessPurpose === "string" &&
    Number.isFinite(Number(entry.miles)) &&
    Number(entry.miles) > 0 &&
    Number.isFinite(Number(entry.mileageRateSnapshot)) &&
    Number(entry.mileageRateSnapshot) >= 0 &&
    typeof entry.notes === "string" &&
    typeof entry.createdAt === "string" &&
    typeof entry.updatedAt === "string"
  );
}
