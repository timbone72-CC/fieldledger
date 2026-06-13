import { isValidPayPeriodBackup } from "./validatePayPeriodBackup.js";

export const COMPLETE_BACKUP_PACKAGE_TYPE = "fieldledger.completeBackup";
export const COMPLETE_BACKUP_SCHEMA_VERSION = 1;
export const COMPLETE_BACKUP_PHOTO_WARNING_COUNT = 15;
export const COMPLETE_BACKUP_PHOTO_STRONG_WARNING_COUNT = 30;
export const COMPLETE_BACKUP_SIZE_WARNING_BYTES = 25 * 1024 * 1024;
export const COMPLETE_BACKUP_SIZE_STRONG_WARNING_BYTES = 50 * 1024 * 1024;

const DEFAULT_APP_INFO = {
  name: "FieldLedger",
  versionLabel: "",
  versionDate: "",
  versionNote: "",
};

export async function buildCompletePayPeriodBackupPackage({
  payPeriod,
  appInfo = DEFAULT_APP_INFO,
  createdAt = new Date().toISOString(),
  loadPhotoBlob,
  encodeBlobAsBase64,
} = {}) {
  const safePayPeriod = payPeriod && typeof payPeriod === "object" ? payPeriod : {};
  const photoReferences = collectCompleteBackupPhotoReferences(safePayPeriod);
  const photoResults = await buildPhotoEntries({
    photoReferences,
    loadPhotoBlob,
    encodeBlobAsBase64,
  });

  return {
    packageType: COMPLETE_BACKUP_PACKAGE_TYPE,
    schemaVersion: COMPLETE_BACKUP_SCHEMA_VERSION,
    createdAt,
    appInfo: {
      ...DEFAULT_APP_INFO,
      ...(appInfo && typeof appInfo === "object" ? appInfo : {}),
    },
    summary: buildSummary({
      payPeriod: safePayPeriod,
      photos: photoResults.photos,
      missingPhotos: photoResults.missingPhotos,
    }),
    payPeriod: safePayPeriod,
    photos: photoResults.photos,
    missingPhotos: photoResults.missingPhotos,
  };
}

export function isValidCompletePayPeriodBackupPackage(value) {
  return (
    value &&
    typeof value === "object" &&
    value.packageType === COMPLETE_BACKUP_PACKAGE_TYPE &&
    value.schemaVersion === COMPLETE_BACKUP_SCHEMA_VERSION &&
    typeof value.createdAt === "string" &&
    isValidAppInfo(value.appInfo) &&
    isValidSummary(value.summary) &&
    isValidPayPeriodBackup(value.payPeriod) &&
    Array.isArray(value.photos) &&
    value.photos.every(isValidPhotoEntry) &&
    Array.isArray(value.missingPhotos) &&
    value.missingPhotos.every(isValidMissingPhotoEntry)
  );
}

export function estimateCompleteBackupPackageSizeBytes(packageData) {
  return new Blob([JSON.stringify(packageData)]).size;
}

export function buildCompleteBackupSizeWarning({ photoCount, estimatedSizeBytes }) {
  const warnings = [];

  if (photoCount > COMPLETE_BACKUP_PHOTO_STRONG_WARNING_COUNT) {
    warnings.push("Strong warning: this backup contains more than 30 photos and may be slow on mobile.");
  } else if (photoCount > COMPLETE_BACKUP_PHOTO_WARNING_COUNT) {
    warnings.push("Warning: this backup contains more than 15 photos and may take longer on mobile.");
  }

  if (estimatedSizeBytes > COMPLETE_BACKUP_SIZE_STRONG_WARNING_BYTES) {
    warnings.push("Strong warning: this backup is larger than 50 MB and may be difficult to import on mobile.");
  } else if (estimatedSizeBytes > COMPLETE_BACKUP_SIZE_WARNING_BYTES) {
    warnings.push("Warning: this backup is larger than 25 MB and may take longer to import on mobile.");
  }

  return warnings;
}

export function collectCompleteBackupPhotoReferences(payPeriod = {}) {
  return [
    ...collectJobTicketPhotoReferences(payPeriod.jobs),
    ...collectExpenseReceiptPhotoReferences(payPeriod.expenses),
  ];
}

async function buildPhotoEntries({ photoReferences, loadPhotoBlob, encodeBlobAsBase64 }) {
  const photos = [];
  const missingPhotos = [];

  for (const photoReference of photoReferences) {
    if (typeof loadPhotoBlob !== "function") {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-loader-unavailable"));
      continue;
    }

    let photoRecord;

    try {
      photoRecord = await loadPhotoBlob(photoReference.photoId);
    } catch {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-load-failed"));
      continue;
    }

    if (!photoRecord) {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-not-found"));
      continue;
    }

    if (typeof encodeBlobAsBase64 !== "function") {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-encoder-unavailable"));
      continue;
    }

    try {
      const sourceBlob = photoRecord.blob ?? photoRecord;
      const encodedPhoto = await encodeBlobAsBase64(sourceBlob);
      const base64 = typeof encodedPhoto === "string" ? encodedPhoto : encodedPhoto?.base64;

      if (!base64) {
        missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-encode-empty"));
        continue;
      }

      photos.push({
        photoId: photoReference.photoId,
        fileName: photoReference.fileName,
        mimeType: encodedPhoto?.mimeType || photoRecord.type || sourceBlob?.type || "application/octet-stream",
        base64,
        role: photoReference.role,
        recordId: photoReference.recordId,
      });
    } catch {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-encode-failed"));
    }
  }

  return { photos, missingPhotos };
}

function buildSummary({ payPeriod, photos, missingPhotos }) {
  return {
    jobCount: Array.isArray(payPeriod.jobs) ? payPeriod.jobs.length : 0,
    expenseCount: Array.isArray(payPeriod.expenses) ? payPeriod.expenses.length : 0,
    mileageEntryCount: Array.isArray(payPeriod.mileageEntries) ? payPeriod.mileageEntries.length : 0,
    photoCount: photos.length,
    missingPhotoCount: missingPhotos.length,
  };
}

function collectJobTicketPhotoReferences(jobs = []) {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs
    .filter((job) => job?.ticketPhotoId)
    .map((job, index) => ({
      photoId: job.ticketPhotoId,
      fileName: job.ticketPhotoName || `job-ticket-${index + 1}.jpg`,
      role: "jobTicket",
      recordId: job.id || "",
    }));
}

function collectExpenseReceiptPhotoReferences(expenses = []) {
  if (!Array.isArray(expenses)) {
    return [];
  }

  return expenses.flatMap((expense, expenseIndex) => {
    if (Array.isArray(expense?.receiptPhotos) && expense.receiptPhotos.length > 0) {
      return expense.receiptPhotos
        .filter((photo) => photo?.id)
        .map((photo, photoIndex) => ({
          photoId: photo.id,
          fileName: photo.name || `expense-receipt-${expenseIndex + 1}-${photoIndex + 1}.jpg`,
          role: "expenseReceipt",
          recordId: expense.id || "",
        }));
    }

    if (!expense?.receiptPhotoId) {
      return [];
    }

    return [
      {
        photoId: expense.receiptPhotoId,
        fileName: expense.receiptPhotoName || `expense-receipt-${expenseIndex + 1}.jpg`,
        role: "expenseReceipt",
        recordId: expense.id || "",
      },
    ];
  });
}

function buildMissingPhotoEntry(photoReference, reason) {
  return {
    photoId: photoReference.photoId,
    fileName: photoReference.fileName,
    role: photoReference.role,
    recordId: photoReference.recordId,
    reason,
  };
}

function isValidAppInfo(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.name === "string" &&
    typeof value.versionLabel === "string" &&
    typeof value.versionDate === "string" &&
    typeof value.versionNote === "string"
  );
}

function isValidSummary(value) {
  return (
    value &&
    typeof value === "object" &&
    Number.isFinite(Number(value.jobCount)) &&
    Number.isFinite(Number(value.expenseCount)) &&
    Number.isFinite(Number(value.mileageEntryCount)) &&
    Number.isFinite(Number(value.photoCount)) &&
    Number.isFinite(Number(value.missingPhotoCount))
  );
}

function isValidPhotoEntry(photo) {
  return (
    photo &&
    typeof photo === "object" &&
    typeof photo.photoId === "string" &&
    typeof photo.fileName === "string" &&
    typeof photo.mimeType === "string" &&
    typeof photo.base64 === "string" &&
    typeof photo.role === "string" &&
    typeof photo.recordId === "string"
  );
}

function isValidMissingPhotoEntry(photo) {
  return (
    photo &&
    typeof photo === "object" &&
    typeof photo.photoId === "string" &&
    typeof photo.fileName === "string" &&
    typeof photo.role === "string" &&
    typeof photo.recordId === "string" &&
    typeof photo.reason === "string"
  );
}
