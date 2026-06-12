import assert from "node:assert/strict";
import { buildPayPeriodArchivePayload } from "./payPeriodArchivePayload.js";

const payPeriod = {
  id: "active",
  label: "June 1-15 / LEG",
  startDate: "2026-06-01",
  endDate: "2026-06-15",
  status: "open",
  schemaVersion: 1,
  jobs: [
    {
      id: "job-1",
      date: "2026-06-12",
      company: "Legend",
      rigNameOrNumber: "Rig 7",
      fieldTicketNumber: "FT3921",
      jobType: "daywork",
      baseJobPay: 900,
      hoursWorked: 12,
      transportation: 25,
      totalPay: 925,
      ticketPhotoId: "ticket-photo-1",
      ticketPhotoName: "Ticket FT3921.jpg",
    },
  ],
  expenses: [
    {
      id: "expense-1",
      receiptPhotos: [
        {
          id: "receipt-photo-1",
          name: "Fuel receipt.png",
        },
      ],
    },
    {
      id: "expense-2",
      receiptPhotoId: "legacy-receipt-photo",
      receiptPhotoName: "Legacy Receipt.jpg",
    },
  ],
  mileageEntries: [
    {
      id: "mileage-1",
    },
  ],
};

const settings = {
  hourlyRate: 28,
  selfEmploymentTaxRate: 0.153,
};

const appInfo = {
  name: "FieldLedger",
  versionLabel: "Trusted User Readiness",
};

const createdAt = "2026-06-16T14:35:20.000Z";

const originalPayPeriodText = JSON.stringify(payPeriod);
const originalSettingsText = JSON.stringify(settings);

const payload = await buildPayPeriodArchivePayload({
  payPeriod,
  settings,
  appInfo,
  createdAt,
  loadPhotoBlob: async (photoId) => ({
    id: photoId,
    type: photoId === "receipt-photo-1" ? "image/png" : "image/jpeg",
    blob: {
      type: photoId === "receipt-photo-1" ? "image/png" : "image/jpeg",
      testPhotoId: photoId,
    },
  }),
  encodeBlobAsBase64: async (blob) => ({
    base64: `base64:${blob.testPhotoId}`,
    mimeType: blob.type,
  }),
});

assert.equal(payload.action, "archivePayPeriod");
assert.equal(payload.archiveType, "fieldledger-pay-period-archive");
assert.equal(payload.archiveSchemaVersion, 1);

assert.deepEqual(
  payload.files.map((file) => file.fileName),
  [
    "OPEN_ME.txt",
    "fieldledger-archive-manifest.json",
    "fieldledger-pay-period-backup.json",
    "fieldledger-timesheet.csv",
  ],
);
assert.deepEqual(
  payload.files.map((file) => file.relativePath),
  [
    "OPEN_ME.txt",
    "fieldledger-archive-manifest.json",
    "fieldledger-pay-period-backup.json",
    "fieldledger-timesheet.csv",
  ],
);
assert.equal(payload.files[0].contentText.includes("FieldLedger Pay Period Archive"), true);

const manifestFile = payload.files.find((file) => file.role === "manifest");
const backupFile = payload.files.find((file) => file.role === "pay-period-backup");
const csvFile = payload.files.find((file) => file.role === "timesheet-csv");
const backupJson = JSON.parse(backupFile.contentText);
const manifestJson = JSON.parse(manifestFile.contentText);

assert.deepEqual(backupJson, payPeriod);
assert.equal(backupJson.archiveType, undefined);
assert.equal(manifestJson.archiveType, "fieldledger-pay-period-archive");
assert.equal(manifestJson.restore.sourceOfTruthFile, "fieldledger-pay-period-backup.json");
assert.equal(manifestJson.restore.csvIsReportOnly, true);
assert.equal(manifestJson.restore.restoreMode, "future-drive-archive-folder");
assert.equal(csvFile.contentText.includes("FT3921"), true);

assert.equal(payload.photos.length, 3);
assert.equal(payload.missingPhotos.length, 0);
assert.deepEqual(
  payload.photos.map((photo) => photo.photoId),
  ["ticket-photo-1", "receipt-photo-1", "legacy-receipt-photo"],
);
assert.deepEqual(
  payload.photos.map((photo) => photo.role),
  ["job-ticket-photo", "expense-receipt-photo", "expense-receipt-photo"],
);
assert.equal(payload.photos[0].base64, "base64:ticket-photo-1");
assert.equal(payload.photos[1].base64, "base64:receipt-photo-1");
assert.equal(payload.photos[1].mimeType, "image/png");
assert.equal(payload.photos[0].relativePath.startsWith("photos/jobs/"), true);
assert.equal(payload.photos[1].relativePath.startsWith("photos/expenses/"), true);
assert.equal(payload.photos[0].expectedPath.includes("FieldLedger Records/2026-06/"), true);

assert.deepEqual(payload.summary, {
  fileCount: 4,
  photoCount: 3,
  missingPhotoCount: 0,
});
assert.equal(payload.manifest.counts.jobs, 1);
assert.equal(payload.manifest.counts.expenses, 2);
assert.equal(payload.manifest.counts.mileageEntries, 1);
assert.equal(payload.manifest.counts.includedPhotos, 3);
assert.equal(payload.manifest.counts.missingPhotos, 0);
assert.deepEqual(payload.manifest.photoArchive, {
  expectedPhotoCount: 3,
  includedPhotoCount: 3,
  missingPhotoCount: 0,
});
assert.equal(payload.manifest.expectedFiles.filter((file) => file.included).length, 7);
assert.deepEqual(manifestJson.photoArchive, payload.manifest.photoArchive);

assert.equal(JSON.stringify(payPeriod), originalPayPeriodText);
assert.equal(JSON.stringify(settings), originalSettingsText);

const missingPayload = await buildPayPeriodArchivePayload({
  payPeriod,
  settings,
  appInfo,
  createdAt,
  loadPhotoBlob: async (photoId) => (photoId === "ticket-photo-1"
    ? {
      id: photoId,
      type: "image/jpeg",
      blob: {
        type: "image/jpeg",
        testPhotoId: photoId,
      },
    }
    : null),
  encodeBlobAsBase64: async (blob) => {
    if (blob.testPhotoId === "ticket-photo-1") {
      throw new Error("encode failed");
    }

    return "unused";
  },
});

assert.equal(missingPayload.photos.length, 0);
assert.equal(missingPayload.missingPhotos.length, 3);
assert.deepEqual(
  missingPayload.missingPhotos.map((photo) => photo.reason),
  ["photo-encode-failed", "photo-not-found", "photo-not-found"],
);
assert.deepEqual(missingPayload.summary, {
  fileCount: 4,
  photoCount: 0,
  missingPhotoCount: 3,
});
assert.equal(missingPayload.manifest.counts.includedPhotos, 0);
assert.equal(missingPayload.manifest.counts.missingPhotos, 3);
assert.equal(missingPayload.manifest.expectedFiles.filter((file) => file.missing).length, 3);

const noLoaderPayload = await buildPayPeriodArchivePayload({
  payPeriod,
  settings,
  appInfo,
  createdAt,
});

assert.equal(noLoaderPayload.photos.length, 0);
assert.equal(noLoaderPayload.missingPhotos.length, 3);
assert.deepEqual(
  noLoaderPayload.missingPhotos.map((photo) => photo.reason),
  [
    "photo-loader-unavailable",
    "photo-loader-unavailable",
    "photo-loader-unavailable",
  ],
);

const noEncoderPayload = await buildPayPeriodArchivePayload({
  payPeriod,
  settings,
  appInfo,
  createdAt,
  loadPhotoBlob: async (photoId) => ({
    id: photoId,
    type: "image/jpeg",
    blob: {
      type: "image/jpeg",
    },
  }),
});

assert.equal(noEncoderPayload.photos.length, 0);
assert.equal(noEncoderPayload.missingPhotos.length, 3);
assert.equal(noEncoderPayload.missingPhotos.every((photo) => photo.reason === "photo-encoder-unavailable"), true);

assert.equal(globalThis.fetch, globalThis.fetch);
assert.equal(globalThis.DriveApp, undefined);
assert.equal(globalThis.google, undefined);

console.log("payPeriodArchivePayload tests passed");
