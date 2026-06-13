import { useState } from "react";
import { APP_NAME, APP_VERSION_DATE, APP_VERSION_LABEL, APP_VERSION_NOTE } from "../../shared/constants/appInfo.js";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys.js";
import { loadPhotoBlob } from "../../shared/storage/photoBlobStorage.js";
import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import {
  buildCompleteBackupSizeWarning,
  buildCompletePayPeriodBackupPackage,
  estimateCompleteBackupPackageSizeBytes,
} from "./completePayPeriodBackupPackage.js";
import { sendCompleteBackupToDrive } from "./sendCompleteBackupToDrive.js";

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
    // Drive save can continue even if saving the URL fails.
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

function formatSuccessMessage(result, packageData) {
  const summary = result.summary || packageData.summary;
  const folderPath = result.folderPath ||
    [result.driveRootFolderName, result.folderName].filter(Boolean).join("/");
  const parts = [
    result.message,
    result.fileName ? `File: ${result.fileName}` : "",
    folderPath ? `Folder: ${folderPath}` : "",
    result.fileUrl ? `URL: ${result.fileUrl}` : "",
    `Photos: ${summary.photoCount}`,
    `Missing photos: ${summary.missingPhotoCount}`,
  ].filter(Boolean);

  if (summary.missingPhotoCount > 0) {
    parts.push("Warning: missing photos are listed in the backup package and cannot be restored from this file.");
  }

  return parts.join(" ");
}

export default function SaveCompleteBackupToDriveButton() {
  const [sendStatus, setSendStatus] = useState("");

  async function saveCompleteBackupToDrive() {
    setSendStatus("");

    const savedWebAppUrl = loadSavedTrustedSheetWebAppUrl();
    const webAppUrl = window.prompt(
      "Paste the Apps Script web app URL. Use the deployed /exec URL. This saves one Complete Backup JSON file with records and photos to Google Drive. The URL can be saved on this device. The token will not be saved.",
      savedWebAppUrl,
    );

    if (!webAppUrl || !webAppUrl.trim()) {
      setSendStatus("Complete Backup Drive save canceled. No web app URL was provided.");
      return;
    }

    const trimmedWebAppUrl = webAppUrl.trim();
    saveTrustedSheetWebAppUrl(trimmedWebAppUrl);

    const completeBackupToken = window.prompt(
      "Paste the FieldLedger Complete Backup token. For safety, this token is not saved.",
    );

    if (!completeBackupToken || !completeBackupToken.trim()) {
      setSendStatus("Complete Backup Drive save canceled. No Complete Backup token was provided.");
      return;
    }

    const confirmed = window.confirm(
      "Build and save the current Complete Backup to Google Drive now? This writes one JSON file with records and photos.",
    );

    if (!confirmed) {
      setSendStatus("Complete Backup Drive save canceled before sending.");
      return;
    }

    try {
      setSendStatus("Building Complete Backup package...");

      const packageData = await buildCompletePayPeriodBackupPackage({
        payPeriod: loadActivePayPeriod(),
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
      const estimatedSizeBytes = estimateCompleteBackupPackageSizeBytes(packageData);
      const warnings = buildCompleteBackupSizeWarning({
        photoCount: packageData.summary.photoCount,
        estimatedSizeBytes,
      });

      setSendStatus("Sending Complete Backup to Apps Script for Google Drive save...");

      const result = await sendCompleteBackupToDrive({
        webAppUrl: trimmedWebAppUrl,
        completeBackupToken,
        completeBackupPackage: packageData,
      });

      if (!result.success) {
        setSendStatus(result.message);
        return;
      }

      const warningText = warnings.length ? ` ${warnings.join(" ")}` : "";

      setSendStatus(`${formatSuccessMessage(result, packageData)}${warningText}`);
    } catch (error) {
      setSendStatus(`Complete Backup Drive save failed: ${error.message}`);
    }
  }

  return (
    <>
      <button type="button" onClick={saveCompleteBackupToDrive}>
        Save Complete Backup to Google Drive
      </button>

      {sendStatus ? <p className="helper form-span-full">{sendStatus}</p> : null}
    </>
  );
}
