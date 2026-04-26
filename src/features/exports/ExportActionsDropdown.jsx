import DownloadPayPeriodCsvButton from "./DownloadPayPeriodCsvButton.jsx";
import DownloadPayPeriodJsonButton from "./DownloadPayPeriodJsonButton.jsx";
import ClearPayPeriodButton from "../pay-periods/ClearPayPeriodButton.jsx";

export default function ExportActionsDropdown() {
  return (
    <details className="export-actions">
      <summary>Export / Backup</summary>
      <div className="export-actions-menu">
        <DownloadPayPeriodJsonButton />
        <DownloadPayPeriodCsvButton />
        <ClearPayPeriodButton />
      </div>
    </details>
  );
}
