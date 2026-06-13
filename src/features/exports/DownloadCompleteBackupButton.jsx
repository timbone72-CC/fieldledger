import { APP_NAME, APP_VERSION_DATE, APP_VERSION_LABEL, APP_VERSION_NOTE } from "../../shared/constants/appInfo.js";
import { loadPhotoBlob } from "../../shared/storage/photoBlobStorage.js";
import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import {
  buildCompleteBackupSizeWarning,
  buildCompletePayPeriodBackupPackage,
  estimateCompleteBackupPackageSizeBytes,
} from "./completePayPeriodBackupPackage.js";

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

function buildCompleteBackupFileName(packageData) {
  const timestamp = packageData.createdAt
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z")
    .replace("T", "-");
  const label = packageData.payPeriod?.label || "active-pay-period";
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "active-pay-period";

  return `fieldledger-complete-backup-${safeLabel}-${timestamp}.json`;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function DownloadCompleteBackupButton() {
  async function downloadCompleteBackup() {
    try {
      const payPeriod = loadActivePayPeriod();
      const packageData = await buildCompletePayPeriodBackupPackage({
        payPeriod,
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
      const fileContent = JSON.stringify(packageData, null, 2);
      const blob = new Blob([fileContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = buildCompleteBackupFileName(packageData);
      link.click();

      URL.revokeObjectURL(url);

      const missingPhotoMessage = packageData.summary.missingPhotoCount
        ? ` ${packageData.summary.missingPhotoCount} photo(s) were missing and are listed in the backup.`
        : "";
      const warningMessage = warnings.length ? ` ${warnings.join(" ")}` : "";

      window.alert(
        `Complete Backup downloaded with ${packageData.summary.photoCount} photo(s), ${packageData.summary.jobCount} job(s), ${packageData.summary.expenseCount} expense(s), and ${packageData.summary.mileageEntryCount} mileage entry(s). Estimated size: ${formatBytes(estimatedSizeBytes)}.${missingPhotoMessage}${warningMessage}`,
      );
    } catch (error) {
      window.alert(`Could not download Complete Backup. ${error.message}`);
    }
  }

  return (
    <button type="button" onClick={downloadCompleteBackup}>
      Download Complete Backup
    </button>
  );
}
