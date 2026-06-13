import { isValidCompletePayPeriodBackupPackage } from "./completePayPeriodBackupPackage.js";

export async function restoreCompletePayPeriodBackup({
  packageData,
  saveActivePayPeriod,
  savePhotoBlobWithId,
  decodeBase64AsBlob = decodeBase64AsBlobInBrowser,
  restoredAt = new Date().toISOString(),
} = {}) {
  if (!isValidCompletePayPeriodBackupPackage(packageData)) {
    return {
      ok: false,
      message: "This does not look like a valid FieldLedger Complete Backup.",
      restoredPhotoCount: 0,
    };
  }

  if (typeof saveActivePayPeriod !== "function") {
    return {
      ok: false,
      message: "FieldLedger could not restore records because local storage is unavailable.",
      restoredPhotoCount: 0,
    };
  }

  if (typeof savePhotoBlobWithId !== "function") {
    return {
      ok: false,
      message: "FieldLedger could not restore photos because photo storage is unavailable.",
      restoredPhotoCount: 0,
    };
  }

  try {
    for (const photo of packageData.photos) {
      const blob = decodeBase64AsBlob(photo.base64, photo.mimeType);

      await savePhotoBlobWithId({
        id: photo.photoId,
        blob,
        name: photo.fileName,
        type: photo.mimeType,
        size: blob.size || 0,
        createdAt: packageData.createdAt,
      });
    }
  } catch (error) {
    return {
      ok: false,
      message: `FieldLedger could not restore photos. Current records were not replaced. ${error.message}`,
      restoredPhotoCount: 0,
    };
  }

  const saved = saveActivePayPeriod({
    ...packageData.payPeriod,
    updatedAt: restoredAt,
  });

  if (!saved) {
    return {
      ok: false,
      message: "FieldLedger restored photos, but could not replace the current active pay period.",
      restoredPhotoCount: packageData.photos.length,
    };
  }

  return {
    ok: true,
    message: "Complete Backup restored.",
    restoredPhotoCount: packageData.photos.length,
    restoredJobCount: packageData.summary.jobCount,
    restoredExpenseCount: packageData.summary.expenseCount,
    restoredMileageEntryCount: packageData.summary.mileageEntryCount,
    missingPhotoCount: packageData.summary.missingPhotoCount,
  };
}

export function decodeBase64AsBlobInBrowser(base64, mimeType = "application/octet-stream") {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}
