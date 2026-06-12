import { clearActivePayPeriod, loadActivePayPeriod } from "./activePayPeriodStorage.js";
import { buildPayPeriodFileName } from "../../shared/utils/recordFileNames.js";

export default function ClearPayPeriodButton({ onPayPeriodCleared }) {
  function handleClear() {
    const payPeriod = loadActivePayPeriod();

    downloadJsonBackup(payPeriod);

    const confirmed = window.confirm(
      "A JSON backup was downloaded first. Clear the current pay period from this browser now?"
    );

    if (!confirmed) {
      return;
    }

    const cleared = clearActivePayPeriod();

    if (!cleared) {
      window.alert("FieldLedger could not clear this pay period. Your data should still be intact.");
      return;
    }

    if (typeof onPayPeriodCleared === "function") {
      onPayPeriodCleared();
    }
  }

  return (
    <details className="export-action-group danger-zone-action">
      <summary>Clear Pay Period</summary>

      <p className="helper">
        This clears the current pay period from this browser only. FieldLedger
        downloads a JSON backup first, then asks for confirmation before clearing.
      </p>

      <button type="button" onClick={handleClear}>
        Download Backup and Clear
      </button>
    </details>
  );
}

function downloadJsonBackup(payPeriod) {
  const fileName = buildPayPeriodFileName(payPeriod, "json", {
    fileType: "backup-before-clear",
  });
  const fileContent = JSON.stringify(payPeriod, null, 2);
  const blob = new Blob([fileContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}
