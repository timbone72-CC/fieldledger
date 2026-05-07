import { saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { isValidPayPeriodBackup } from "./validatePayPeriodBackup.js";

export default function ImportPayPeriodJsonButton() {
  async function importJson(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const fileText = await file.text();
      const payPeriod = JSON.parse(fileText);

      if (!isValidPayPeriodBackup(payPeriod)) {
        window.alert("This does not look like a valid FieldLedger pay period backup.");
        event.target.value = "";
        return;
      }

      const confirmed = window.confirm(
        "Restore this JSON backup? This will replace the current active pay period in this browser.",
      );

      if (!confirmed) {
        event.target.value = "";
        return;
      }

      const saved = saveActivePayPeriod({
        ...payPeriod,
        updatedAt: new Date().toISOString(),
      });

      if (!saved) {
        event.target.value = "";
        return;
      }

      window.location.reload();
    } catch {
      window.alert("Could not import this JSON backup.");
      event.target.value = "";
    }
  }

  return (
    <label className="import-json-button">
      Import JSON Backup
      <input
        type="file"
        accept="application/json,.json"
        onChange={importJson}
        style={{ display: "none" }}
      />
    </label>
  );
}
