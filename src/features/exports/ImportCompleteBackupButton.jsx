import { savePhotoBlobWithId } from "../../shared/storage/photoBlobStorage.js";
import { saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import {
  buildCompleteBackupSizeWarning,
  estimateCompleteBackupPackageSizeBytes,
  isValidCompletePayPeriodBackupPackage,
} from "./completePayPeriodBackupPackage.js";
import { restoreCompletePayPeriodBackup } from "./restoreCompletePayPeriodBackup.js";

function formatPayPeriodRange(payPeriod) {
  if (payPeriod?.startDate && payPeriod?.endDate) {
    return `${payPeriod.startDate} to ${payPeriod.endDate}`;
  }

  return "No date range";
}

function buildRestoreConfirmationMessage(packageData, estimatedSizeBytes) {
  const warnings = buildCompleteBackupSizeWarning({
    photoCount: packageData.summary.photoCount,
    estimatedSizeBytes,
  });
  const missingPhotoWarning = packageData.summary.missingPhotoCount
    ? `\n\nWarning: this package reports ${packageData.summary.missingPhotoCount} missing photo(s). Those photos cannot be restored.`
    : "";
  const sizeWarnings = warnings.length ? `\n\n${warnings.join("\n")}` : "";

  return [
    "Import this Complete Backup?",
    "",
    `Package created: ${packageData.createdAt}`,
    `Pay period: ${packageData.payPeriod.label || "Current Pay Period"}`,
    `Date range: ${formatPayPeriodRange(packageData.payPeriod)}`,
    `Jobs: ${packageData.summary.jobCount}`,
    `Expenses: ${packageData.summary.expenseCount}`,
    `Mileage entries: ${packageData.summary.mileageEntryCount}`,
    `Photos: ${packageData.summary.photoCount}`,
    `Missing photos: ${packageData.summary.missingPhotoCount}`,
    "",
    "Import replaces the current active pay period on this device.",
    `${missingPhotoWarning}${sizeWarnings}`,
  ].join("\n");
}

export default function ImportCompleteBackupButton({ onImportComplete }) {
  async function importCompleteBackup(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const fileText = await file.text();
      const packageData = JSON.parse(fileText);

      if (!isValidCompletePayPeriodBackupPackage(packageData)) {
        window.alert("This does not look like a valid FieldLedger Complete Backup.");
        event.target.value = "";
        return;
      }

      const estimatedSizeBytes = estimateCompleteBackupPackageSizeBytes(packageData);
      const confirmed = window.confirm(buildRestoreConfirmationMessage(packageData, estimatedSizeBytes));

      if (!confirmed) {
        event.target.value = "";
        return;
      }

      const restoreResult = await restoreCompletePayPeriodBackup({
        packageData,
        saveActivePayPeriod,
        savePhotoBlobWithId,
      });

      if (!restoreResult.ok) {
        window.alert(restoreResult.message);
        event.target.value = "";
        return;
      }

      if (typeof onImportComplete === "function") {
        onImportComplete();
      }

      window.alert(
        `Complete Backup imported. Restored ${restoreResult.restoredJobCount} job(s), ${restoreResult.restoredExpenseCount} expense(s), ${restoreResult.restoredMileageEntryCount} mileage entry(s), and ${restoreResult.restoredPhotoCount} photo(s).`,
      );
      event.target.value = "";
    } catch (error) {
      window.alert(`Could not import this Complete Backup. ${error.message}`);
      event.target.value = "";
    }
  }

  return (
    <label className="import-json-button">
      Import Complete Backup
      <input
        type="file"
        accept="application/json,.json"
        onChange={importCompleteBackup}
        style={{ display: "none" }}
      />
    </label>
  );
}
