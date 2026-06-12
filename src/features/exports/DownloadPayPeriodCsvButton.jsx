import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { buildPayPeriodCsv } from "./payPeriodCsv.js";
import { buildPayPeriodFileName } from "../../shared/utils/recordFileNames.js";

export default function DownloadPayPeriodCsvButton() {
  function downloadCsv() {
    const payPeriod = loadActivePayPeriod();
    const csvContent = buildPayPeriodCsv(payPeriod);
    const fileName = buildPayPeriodFileName(payPeriod, "csv");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={downloadCsv}>
      Download Spreadsheet CSV
    </button>
  );
}
