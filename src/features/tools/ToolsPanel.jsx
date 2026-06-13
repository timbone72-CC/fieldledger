import { useState } from "react";
import { APP_NAME, APP_VERSION_DATE, APP_VERSION_LABEL, APP_VERSION_NOTE } from "../../shared/constants/appInfo.js";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys.js";
import { loadPhotoBlob } from "../../shared/storage/photoBlobStorage.js";
import DownloadCompleteBackupButton from "../exports/DownloadCompleteBackupButton.jsx";
import DownloadPayPeriodCsvButton from "../exports/DownloadPayPeriodCsvButton.jsx";
import DownloadPayPeriodJsonButton from "../exports/DownloadPayPeriodJsonButton.jsx";
import ImportCompleteBackupButton from "../exports/ImportCompleteBackupButton.jsx";
import ImportPayPeriodJsonButton from "../exports/ImportPayPeriodJsonButton.jsx";
import { buildPayPeriodArchivePayload } from "../exports/payPeriodArchivePayload.js";
import PrintPayPeriodReportButton from "../exports/PrintPayPeriodReportButton.jsx";
import SendPayPeriodCsvToTrustedSheetButton from "../exports/SendPayPeriodCsvToTrustedSheetButton.jsx";
import { sendPayPeriodArchiveToDrive } from "../exports/sendPayPeriodArchiveToDrive.js";
import ClearPayPeriodButton from "../pay-periods/ClearPayPeriodButton.jsx";
import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { loadSettings } from "../settings/settingsStorage.js";

function loadSavedTrustedSheetWebAppUrl() {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.TRUSTED_SHEET_WEB_APP_URL) || "";
  } catch {
    return "";
  }
}

function saveTrustedSheetWebAppUrl(webAppUrl) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.TRUSTED_SHEET_WEB_APP_URL, webAppUrl);
  } catch {
    // Archive sending can continue even if saving the URL fails.
  }
}

async function encodeBlobAsBase64(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return {
    base64: window.btoa(binary),
    mimeType: blob.type || "application/octet-stream",
  };
}

export default function ToolsPanel({ onShowTimesheet, onDataChanged }) {
  const [archiveValidationStatus, setArchiveValidationStatus] = useState("");

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

  async function validateArchiveEndpoint() {
    setArchiveValidationStatus("");

    const savedWebAppUrl = loadSavedTrustedSheetWebAppUrl();
    const webAppUrl = window.prompt(
      "Paste the Apps Script web app URL for archive validation. Use the deployed /exec URL. This sends the current active pay period archive payload to Apps Script and may create Google Drive archive folders/files.",
      savedWebAppUrl,
    );

    if (!webAppUrl || !webAppUrl.trim()) {
      setArchiveValidationStatus("Archive validation canceled. No web app URL was provided.");
      return;
    }

    const trimmedWebAppUrl = webAppUrl.trim();
    saveTrustedSheetWebAppUrl(trimmedWebAppUrl);

    const archiveToken = window.prompt(
      "Paste the FieldLedger archive validation token. For safety, this token is not saved.",
    );

    if (!archiveToken || !archiveToken.trim()) {
      setArchiveValidationStatus("Archive validation canceled. No archive token was provided.");
      return;
    }

    const confirmed = window.confirm(
      "Send the current active pay period archive payload to Apps Script now? This may create Google Drive archive folders/files.",
    );

    if (!confirmed) {
      setArchiveValidationStatus("Archive validation canceled before sending the archive payload.");
      return;
    }

    try {
      setArchiveValidationStatus("Building archive validation payload...");

      const payPeriod = loadActivePayPeriod();
      const currentSettings = loadSettings();
      const archivePayload = await buildPayPeriodArchivePayload({
        payPeriod,
        settings: currentSettings,
        appInfo: {
          name: APP_NAME,
          versionLabel: APP_VERSION_LABEL,
          versionDate: APP_VERSION_DATE,
          versionNote: APP_VERSION_NOTE,
        },
        createdAt: new Date().toISOString(),
        loadPhotoBlob,
        encodeBlobAsBase64,
      });

      setArchiveValidationStatus("Sending archive payload to Apps Script. Google Drive archive folders/files may be created...");

      const result = await sendPayPeriodArchiveToDrive({
        webAppUrl: trimmedWebAppUrl,
        archiveToken,
        archivePayload,
      });

      const countSummary = [
        Number.isFinite(result.fileCount) ? `${result.fileCount} file(s)` : "",
        Number.isFinite(result.photoCount) ? `${result.photoCount} photo(s)` : "",
        Number.isFinite(result.missingPhotoCount) ? `${result.missingPhotoCount} missing photo(s)` : "",
      ].filter(Boolean).join(", ");

      setArchiveValidationStatus(
        `${result.message}${countSummary ? ` ${countSummary}.` : ""} Google Drive archive folders/files may have been created.`,
      );
    } catch (error) {
      setArchiveValidationStatus(
        `Archive validation failed: ${error.message}. Google Drive archive folders/files may have been created before the failure.`,
      );
    }
  }

  return (
    <section className="panel">
      <h2>Tools</h2>

      <div className="tools-grid">
        <section className="tool-section">
          <h3>Complete Backup with Photos</h3>

          <p className="helper">
            Use Complete Backup when you need to move FieldLedger between phone and PC. It includes
            records and photos. Import replaces the current active pay period after confirmation.
          </p>

          <div className="tool-actions">
            <DownloadCompleteBackupButton />
            <ImportCompleteBackupButton onImportComplete={onDataChanged} />
          </div>
        </section>

        <section className="tool-section">
          <h3>Backup / Restore</h3>

          <p className="helper">
            FieldLedger data is saved in this browser. Use Download JSON Backup before switching
            devices, clearing browser data, or importing a replacement backup.
          </p>

          <div className="tool-actions">
            <DownloadPayPeriodJsonButton />
            <ImportPayPeriodJsonButton onImportComplete={onDataChanged} />
          </div>
        </section>

        <section className="tool-section">
          <h3>Timesheet / Reports</h3>

          <p className="helper">
            Export spreadsheet data, send the current CSV to your trusted Sheet, or print pay-period reports.
          </p>

          <div className="tool-actions">
            <DownloadPayPeriodCsvButton />
            <SendPayPeriodCsvToTrustedSheetButton displayMode="button" />
            <PrintPayPeriodReportButton />

            <button type="button" onClick={handlePrintTimesheet}>
              Print Timesheet
            </button>
          </div>
        </section>

        <section className="tool-section">
          <h3>Archive / Drive</h3>

          <p className="helper">
            <strong>Developer Archive Validation</strong>
            <br />
            This manually builds the current active pay period archive payload and sends it to Apps
            Script. Confirm before sending because this may create Google Drive archive folders/files.
          </p>

          <div className="tool-actions">
            <button type="button" onClick={validateArchiveEndpoint}>
              Validate Archive Endpoint
            </button>
          </div>

          {archiveValidationStatus ? <p className="helper">{archiveValidationStatus}</p> : null}
        </section>

        <section className="tool-section">
          <h3>Danger Zone</h3>

          <p className="helper">
            Clear Pay Period downloads its own safety backup before clearing this browser.
          </p>

          <div className="tool-actions">
            <ClearPayPeriodButton onPayPeriodCleared={onDataChanged} displayMode="button" />
          </div>
        </section>
      </div>
    </section>
  );
}
