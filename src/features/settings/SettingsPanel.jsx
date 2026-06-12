import { useState } from "react";
import { APP_NAME, APP_VERSION_DATE, APP_VERSION_LABEL, APP_VERSION_NOTE } from "../../shared/constants/appInfo.js";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys.js";
import { loadPhotoBlob } from "../../shared/storage/photoBlobStorage.js";
import { buildPayPeriodArchivePayload } from "../exports/payPeriodArchivePayload.js";
import { sendPayPeriodArchiveToDrive } from "../exports/sendPayPeriodArchiveToDrive.js";
import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { loadSettings, saveSettings } from "./settingsStorage.js";

function loadSavedTrustedSheetWebAppUrl() {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.TRUSTED_SHEET_WEB_APP_URL) || "";
  } catch {
    return "";
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

export default function SettingsPanel() {
  const savedSettings = loadSettings();

  const [hourlyRate, setHourlyRate] = useState(savedSettings.hourlyRate);
  const [selfEmploymentTaxRate, setSelfEmploymentTaxRate] = useState(
    (savedSettings.selfEmploymentTaxRate * 100).toFixed(2),
  );
  const [federalTaxRate, setFederalTaxRate] = useState((savedSettings.federalTaxRate * 100).toFixed(2));
  const [stateTaxRate, setStateTaxRate] = useState((savedSettings.stateTaxRate * 100).toFixed(2));
  const [saveMessage, setSaveMessage] = useState("");
  const [archiveValidationStatus, setArchiveValidationStatus] = useState("");

  function saveUserSettings() {
    const saved = saveSettings({
      hourlyRate: Number(hourlyRate || 0),
      selfEmploymentTaxRate: Number(selfEmploymentTaxRate || 0) / 100,
      federalTaxRate: Number(federalTaxRate || 0) / 100,
      stateTaxRate: Number(stateTaxRate || 0) / 100,
    });

    if (!saved) {
      setSaveMessage("");
      return;
    }

    setSaveMessage("Settings saved.");
  }

  async function updateApp() {
    if (!navigator.onLine) {
      window.alert(
        "You appear to be offline. Do not update FieldLedger while offline. Reconnect to the internet, open the app once, then use Update App."
      );
      return;
    }

    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );
      }

      if ("caches" in window) {
        const cacheNames = await window.caches.keys();

        await Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith("fieldledger-"))
            .map((cacheName) => window.caches.delete(cacheName)),
        );
      }
    } finally {
      window.location.reload();
    }
  }

  async function validateArchiveEndpoint() {
    setArchiveValidationStatus("");

    const savedWebAppUrl = loadSavedTrustedSheetWebAppUrl();
    const webAppUrl = window.prompt(
      "Paste the Apps Script web app URL for archive validation. Use the deployed /exec URL. Validation only. No Google Drive files are written yet.",
      savedWebAppUrl,
    );

    if (!webAppUrl || !webAppUrl.trim()) {
      setArchiveValidationStatus("Archive validation canceled. No web app URL was provided.");
      return;
    }

    const archiveToken = window.prompt(
      "Paste the FieldLedger archive validation token. For safety, this token is not saved.",
    );

    if (!archiveToken || !archiveToken.trim()) {
      setArchiveValidationStatus("Archive validation canceled. No archive token was provided.");
      return;
    }

    const confirmed = window.confirm(
      "Build the current FieldLedger pay-period archive payload and send it for validation only? No Google Drive files are written yet.",
    );

    if (!confirmed) {
      setArchiveValidationStatus("Archive validation canceled. No Google Drive files were written.");
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

      setArchiveValidationStatus("Sending archive payload for validation only...");

      const result = await sendPayPeriodArchiveToDrive({
        webAppUrl: webAppUrl.trim(),
        archiveToken,
        archivePayload,
      });

      const countSummary = [
        Number.isFinite(result.fileCount) ? `${result.fileCount} file(s)` : "",
        Number.isFinite(result.photoCount) ? `${result.photoCount} photo(s)` : "",
        Number.isFinite(result.missingPhotoCount) ? `${result.missingPhotoCount} missing photo(s)` : "",
      ].filter(Boolean).join(", ");

      setArchiveValidationStatus(
        `${result.message}${countSummary ? ` ${countSummary}.` : ""} Validation only. No Google Drive files are written yet.`,
      );
    } catch (error) {
      setArchiveValidationStatus(
        `Archive validation failed: ${error.message}. Validation only. No Google Drive files were written.`,
      );
    }
  }

  return (
    <section className="panel">
      <h2>Settings</h2>

      <div className="responsive-form-grid">
        <label className="field">
          Default Hourly Rate
          <input
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(event.target.value)}
          />
        </label>

        <label className="field">
          Self-Employment Tax Rate %
          <input
            type="number"
            min="0"
            step="0.01"
            value={selfEmploymentTaxRate}
            onChange={(event) => setSelfEmploymentTaxRate(event.target.value)}
          />
        </label>

        <label className="field">
          Federal Tax Rate %
          <input
            type="number"
            min="0"
            step="0.01"
            value={federalTaxRate}
            onChange={(event) => setFederalTaxRate(event.target.value)}
          />
        </label>

        <label className="field">
          State Tax Rate % (Oklahoma default)
          <input
            type="number"
            min="0"
            step="0.01"
            value={stateTaxRate}
            onChange={(event) => setStateTaxRate(event.target.value)}
          />
        </label>

        <p className="helper form-span-full">
          Tax estimates are for planning only and are not tax advice. Changing the default
          hourly rate will not change old saved jobs.
        </p>

        <div className="helper form-span-full">
          <strong>FieldLedger Basics:</strong>
          <br />
          FieldLedger saves data in this browser on this device. Your phone and computer do not automatically
          share data. Use JSON Backup before clearing browser data, switching devices, or importing a replacement
          backup. Tax and mileage estimates are for planning only.
        </div>

        <div className="helper form-span-full">
          <strong>Storage & Backup Safety:</strong>
          <br />
          FieldLedger saves your active records on this device so you can keep working locally.
          Local-only records are convenient, but they are not the safest long-term backup.
          If this browser storage is cleared, this device is lost or broken, or app/site data is removed,
          local-only records may be lost.
          <br />
          <br />
          For safer record keeping, use Download Backup now. Google Drive archive is planned as the
          recommended long-term record folder option once available.
        </div>

        <div className="helper form-span-full">
          <strong>App Version:</strong> {APP_NAME} — {APP_VERSION_LABEL}
          <br />
          Current update: {APP_VERSION_DATE} — {APP_VERSION_NOTE}
          <br />
          If the live app looks outdated after an update, first try closing and reopening the browser tab.
          If it still looks old, use JSON Backup, then refresh or clear browser site data only after confirming
          the backup downloaded.
        </div>

        <div className="form-actions form-span-full">
          <button type="button" onClick={saveUserSettings}>
            Save Settings
          </button>
        </div>

        <div className="helper form-span-full">
          <strong>Update App:</strong>
          <br />
          Reload FieldLedger and refresh the app cache. Use this only while online. Your saved records stay on this device.
        </div>

        <div className="form-actions form-span-full">
          <button type="button" onClick={updateApp}>
            Update App
          </button>
        </div>

        <details className="form-span-full">
          <summary>Developer Archive Validation</summary>

          <p className="helper">
            Validation only. No Google Drive files are written yet. This manually builds the current
            pay-period archive payload and sends it to the Apps Script archive validation endpoint.
          </p>

          <div className="form-actions">
            <button type="button" onClick={validateArchiveEndpoint}>
              Validate Archive Endpoint
            </button>
          </div>

          {archiveValidationStatus ? <p className="helper">{archiveValidationStatus}</p> : null}
        </details>

        {saveMessage && <p className="helper form-span-full">{saveMessage}</p>}
      </div>
    </section>
  );
}
