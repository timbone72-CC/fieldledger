import DownloadPayPeriodCsvButton from "./DownloadPayPeriodCsvButton.jsx";
import DownloadPayPeriodJsonButton from "./DownloadPayPeriodJsonButton.jsx";
import ImportPayPeriodJsonButton from "./ImportPayPeriodJsonButton.jsx";
import PrintPayPeriodReportButton from "./PrintPayPeriodReportButton.jsx";
import ClearPayPeriodButton from "../pay-periods/ClearPayPeriodButton.jsx";

export default function ExportActionsDropdown({ onShowTimesheet, onDataChanged }) {
  function handlePrintTimesheet() {
    if (typeof onShowTimesheet === "function") {
      onShowTimesheet();
    }

    document.body.classList.add("print-timesheet");

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        document.body.classList.remove("print-timesheet");
      }, 200);
    }, 300);
  }

  return (
    <details className="export-actions">
      <summary>Export / Backup</summary>

      <div className="export-actions-menu">
        <p className="helper">
          FieldLedger data is saved in this browser. Download a JSON backup before clearing browser
          data, switching devices, or importing a replacement backup.
        </p>

        <p className="helper">
          <strong>Backup / Restore</strong>
        </p>
        <DownloadPayPeriodJsonButton />
        <ImportPayPeriodJsonButton onImportComplete={onDataChanged} />

        <p className="helper">
          <strong>Timesheet / Reports</strong>
        </p>
        <DownloadPayPeriodCsvButton />
        <PrintPayPeriodReportButton />

        <button type="button" onClick={handlePrintTimesheet}>
          Print Timesheet
        </button>

        <p className="helper">
          <strong>Danger Zone</strong>
        </p>
        <ClearPayPeriodButton onPayPeriodCleared={onDataChanged} />
      </div>
    </details>
  );
}
