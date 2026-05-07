import { clearActivePayPeriod, loadActivePayPeriod } from "./activePayPeriodStorage.js";

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
      return;
    }

    if (typeof onPayPeriodCleared === "function") {
      onPayPeriodCleared();
    }
  }

  return (
    <button type="button" onClick={handleClear}>
      Clear Pay Period
    </button>
  );
}

function downloadJsonBackup(payPeriod) {
  const fileName = buildFileName(payPeriod);
  const fileContent = JSON.stringify(payPeriod, null, 2);
  const blob = new Blob([fileContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function buildFileName(payPeriod) {
  const label = payPeriod?.label || "current-pay-period";
  const safeLabel = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `fieldledger-${safeLabel || "pay-period"}-backup-before-clear.json`;
}
