import DownloadPayPeriodCsvButton from "./DownloadPayPeriodCsvButton.jsx";
import DownloadPayPeriodJsonButton from "./DownloadPayPeriodJsonButton.jsx";
import ImportPayPeriodJsonButton from "./ImportPayPeriodJsonButton.jsx";
import PrintPayPeriodReportButton from "./PrintPayPeriodReportButton.jsx";
import ClearPayPeriodButton from "../pay-periods/ClearPayPeriodButton.jsx";

export default function ExportActionsDropdown({ setPrintMode }) {
  return (
    <details className="export-actions">
      <summary>Export / Backup</summary>
      <div className="export-actions-menu">
        <DownloadPayPeriodJsonButton />
        <DownloadPayPeriodCsvButton />
        <ImportPayPeriodJsonButton />
        <PrintPayPeriodReportButton setPrintMode={setPrintMode} />

        <button type="button" onClick={() => {
          if (setPrintMode) {
            setPrintMode("timesheet");
          }

          document.body.classList.add("print-timesheet");

          setTimeout(() => {
            window.print();
            document.body.classList.remove("print-timesheet");
          }, 50);
        }}>
          Print Timesheet
        </button>
        <ClearPayPeriodButton />
      </div>
    </details>
  );
}
