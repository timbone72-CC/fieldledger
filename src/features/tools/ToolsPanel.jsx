import { useState } from "react";
import { APP_NAME, APP_VERSION_DATE, APP_VERSION_LABEL, APP_VERSION_NOTE } from "../../shared/constants/appInfo.js";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys.js";
import { loadPhotoBlob } from "../../shared/storage/photoBlobStorage.js";
import { buildPayPeriodArchivePayload } from "../exports/payPeriodArchivePayload.js";
import { sendPayPeriodArchiveToDrive } from "../exports/sendPayPeriodArchiveToDrive.js";
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

export default function ToolsPanel() {
  const [archiveValidationStatus, setArchiveValidationStatus] = useState("");

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

      <div className="responsive-form-grid">
        <details className="form-span-full">
          <summary>Developer Archive Validation</summary>

          <p className="helper">
            This manually builds the current active pay period archive payload and sends it to Apps
            Script. Confirm before sending because this may create Google Drive archive folders/files.
          </p>

          <div className="form-actions">
            <button type="button" onClick={validateArchiveEndpoint}>
              Validate Archive Endpoint
            </button>
          </div>

          {archiveValidationStatus ? <p className="helper">{archiveValidationStatus}</p> : null}
        </details>
      </div>
    </section>
  );
}
