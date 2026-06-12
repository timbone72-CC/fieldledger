import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { buildPayPeriodFileName } from "../../shared/utils/recordFileNames.js";

export default function DownloadPayPeriodJsonButton() {
  function downloadJson() {
    const payPeriod = loadActivePayPeriod();
    const fileName = buildPayPeriodFileName(payPeriod, "json");
    const fileContent = JSON.stringify(payPeriod, null, 2);
    const blob = new Blob([fileContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={downloadJson}>
      Download JSON Backup
    </button>
  );
}
