import { sanitizeFilePart } from "../../shared/utils/recordFileNames.js";

const ARCHIVE_TYPE = "fieldledger-pay-period-archive";
const ARCHIVE_SCHEMA_VERSION = 1;
const DRIVE_ROOT_FOLDER_NAME = "FieldLedger Records";
const OPEN_ME_FILE_NAME = "OPEN_ME.txt";
const MANIFEST_FILE_NAME = "fieldledger-archive-manifest.json";
const BACKUP_FILE_NAME = "fieldledger-pay-period-backup.json";
const CSV_FILE_NAME = "fieldledger-timesheet.csv";

export function buildPayPeriodArchivePlan({
  payPeriod,
  settings,
  appInfo,
  createdAt,
} = {}) {
  const safePayPeriod = payPeriod && typeof payPeriod === "object" ? payPeriod : {};
  const archiveCreatedAt = normalizeCreatedAt(createdAt);
  const monthFolderName = buildMonthFolderName(safePayPeriod.startDate, archiveCreatedAt);
  const archiveFolderName = buildArchiveFolderName(safePayPeriod, archiveCreatedAt);
  const baseFolderPath = [
    DRIVE_ROOT_FOLDER_NAME,
    monthFolderName,
    archiveFolderName,
  ].join("/");
  const photoReferences = collectPhotoReferences(safePayPeriod, baseFolderPath);
  const expectedFiles = [
    buildExpectedFile("open-me", OPEN_ME_FILE_NAME, "text/plain", baseFolderPath),
    buildExpectedFile("manifest", MANIFEST_FILE_NAME, "application/json", baseFolderPath),
    buildExpectedFile("pay-period-backup", BACKUP_FILE_NAME, "application/json", baseFolderPath),
    buildExpectedFile("timesheet-csv", CSV_FILE_NAME, "text/csv", baseFolderPath),
    ...photoReferences.map((photoReference) => ({
      role: photoReference.role,
      fileName: photoReference.fileName,
      mimeType: photoReference.mimeType,
      path: photoReference.expectedPath,
      included: false,
    })),
  ];

  const manifest = {
    archiveType: ARCHIVE_TYPE,
    archiveSchemaVersion: ARCHIVE_SCHEMA_VERSION,
    createdAt: archiveCreatedAt,
    appInfo: appInfo ? { ...appInfo } : undefined,
    driveRootFolderName: DRIVE_ROOT_FOLDER_NAME,
    monthFolderName,
    archiveFolderName,
    payPeriod: {
      id: safePayPeriod.id || "",
      label: safePayPeriod.label || "",
      startDate: safePayPeriod.startDate || "",
      endDate: safePayPeriod.endDate || "",
      status: safePayPeriod.status || "",
      schemaVersion: safePayPeriod.schemaVersion ?? null,
    },
    counts: buildCounts(safePayPeriod, photoReferences),
    expectedFiles,
    photoReferences,
    restore: {
      sourceOfTruthFile: BACKUP_FILE_NAME,
      csvIsReportOnly: true,
      photosMustBeRestoredSeparately: true,
      restoreMode: "future-drive-archive-folder",
    },
    settingsSnapshotAtArchiveTime: settings ? { ...settings } : undefined,
    notes: [
      "This archive is designed for Google Drive organization.",
      "The backup JSON is the structured restore source.",
      "The CSV is a human-readable report only.",
      "Photos are evidence files and must be restored separately in a future restore step.",
    ],
  };

  return {
    archiveType: ARCHIVE_TYPE,
    archiveSchemaVersion: ARCHIVE_SCHEMA_VERSION,
    driveRootFolderName: DRIVE_ROOT_FOLDER_NAME,
    monthFolderName,
    archiveFolderName,
    openMeFileName: OPEN_ME_FILE_NAME,
    manifestFileName: MANIFEST_FILE_NAME,
    backupFileName: BACKUP_FILE_NAME,
    csvFileName: CSV_FILE_NAME,
    expectedFiles,
    photoReferences,
    manifest,
  };
}

function buildMonthFolderName(startDate, createdAt) {
  const startMonth = formatYearMonth(startDate);

  return startMonth || formatYearMonth(createdAt);
}

function buildArchiveFolderName(payPeriod, createdAt) {
  const timestamp = formatArchiveTimestamp(createdAt);
  const dateRange = buildDateRangeLabel(payPeriod.startDate, payPeriod.endDate, createdAt);
  const label = sanitizeFilePart(payPeriod.label, {
    fallback: buildFallbackPayPeriodLabel(payPeriod.id, timestamp),
  });

  return `${dateRange}__${label}__archive-${timestamp}`;
}

function buildDateRangeLabel(startDate, endDate, createdAt) {
  const safeStartDate = formatIsoDate(startDate);
  const safeEndDate = formatIsoDate(endDate);

  if (!safeStartDate || !safeEndDate) {
    return `archive-created-${formatIsoDate(createdAt)}`;
  }

  return `${safeStartDate}_to_${safeEndDate}`;
}

function buildFallbackPayPeriodLabel(payPeriodId, timestamp) {
  const safePayPeriodId = sanitizeFilePart(payPeriodId, {
    fallback: "",
  });

  if (safePayPeriodId) {
    return `pay-period-${safePayPeriodId}`;
  }

  return `pay-period-archive-${timestamp}`;
}

function collectPhotoReferences(payPeriod, baseFolderPath) {
  return [
    ...collectJobTicketPhotoReferences(payPeriod, baseFolderPath),
    ...collectExpenseReceiptPhotoReferences(payPeriod, baseFolderPath),
  ];
}

function collectJobTicketPhotoReferences(payPeriod, baseFolderPath) {
  const jobs = Array.isArray(payPeriod.jobs) ? payPeriod.jobs : [];

  return jobs
    .filter((job) => job?.ticketPhotoId)
    .map((job, index) => {
      const fileName = buildPhotoFileName({
        prefix: "job-ticket-photo",
        index,
        originalName: job.ticketPhotoName,
      });

      return {
        role: "job-ticket-photo",
        photoId: job.ticketPhotoId,
        originalName: job.ticketPhotoName || "",
        relatedRecordId: job.id || "",
        fileName,
        relativePath: `photos/jobs/${fileName}`,
        expectedPath: `${baseFolderPath}/photos/jobs/${fileName}`,
        mimeType: "image/jpeg",
      };
    });
}

function collectExpenseReceiptPhotoReferences(payPeriod, baseFolderPath) {
  const expenses = Array.isArray(payPeriod.expenses) ? payPeriod.expenses : [];
  let receiptPhotoIndex = 0;

  return expenses.flatMap((expense) => getExpenseReceiptPhotos(expense)
    .map((receiptPhoto) => {
      const fileName = buildPhotoFileName({
        prefix: "expense-receipt-photo",
        index: receiptPhotoIndex,
        originalName: receiptPhoto.name,
      });
      receiptPhotoIndex += 1;

      return {
        role: "expense-receipt-photo",
        photoId: receiptPhoto.id,
        originalName: receiptPhoto.name || "",
        relatedRecordId: expense.id || "",
        fileName,
        relativePath: `photos/expenses/${fileName}`,
        expectedPath: `${baseFolderPath}/photos/expenses/${fileName}`,
        mimeType: "image/jpeg",
      };
    }));
}

function getExpenseReceiptPhotos(expense) {
  if (Array.isArray(expense?.receiptPhotos)) {
    return expense.receiptPhotos
      .filter((photo) => photo?.id)
      .map((photo) => ({
        id: photo.id,
        name: photo.name || "",
      }));
  }

  if (expense?.receiptPhotoId) {
    return [
      {
        id: expense.receiptPhotoId,
        name: expense.receiptPhotoName || "",
      },
    ];
  }

  return [];
}

function buildPhotoFileName({ prefix, index, originalName }) {
  const sequence = String(index + 1).padStart(2, "0");
  const safeName = sanitizeFilePart(originalName, {
    fallback: "",
    maxLength: 32,
  });
  const namePart = safeName ? `__${safeName}` : "";

  return `${prefix}-${sequence}${namePart}.jpg`;
}

function buildExpectedFile(role, fileName, mimeType, baseFolderPath) {
  return {
    role,
    fileName,
    mimeType,
    path: `${baseFolderPath}/${fileName}`,
    included: true,
  };
}

function buildCounts(payPeriod, photoReferences) {
  const jobs = Array.isArray(payPeriod.jobs) ? payPeriod.jobs : [];
  const expenses = Array.isArray(payPeriod.expenses) ? payPeriod.expenses : [];
  const mileageEntries = Array.isArray(payPeriod.mileageEntries) ? payPeriod.mileageEntries : [];

  return {
    jobs: jobs.length,
    expenses: expenses.length,
    mileageEntries: mileageEntries.length,
    jobTicketPhotos: photoReferences.filter((photo) => photo.role === "job-ticket-photo").length,
    expenseReceiptPhotos: photoReferences.filter((photo) => photo.role === "expense-receipt-photo").length,
  };
}

function normalizeCreatedAt(createdAt) {
  const date = createdAt ? new Date(createdAt) : new Date();

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function formatYearMonth(value) {
  const isoDate = formatIsoDate(value);

  return isoDate ? isoDate.slice(0, 7) : "";
}

function formatIsoDate(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatArchiveTimestamp(value) {
  const date = new Date(value);

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
    "-",
    String(date.getUTCHours()).padStart(2, "0"),
    String(date.getUTCMinutes()).padStart(2, "0"),
  ].join("");
}
