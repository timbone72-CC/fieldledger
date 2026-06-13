import assert from "node:assert/strict";
import { buildPayPeriodArchivePlan } from "./payPeriodArchivePlan.js";

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
      ticketPhotoId: "ticket-photo-1",
      ticketPhotoName: "Ticket FT/3921.jpg",
    },
    {
      id: "job-2",
      ticketPhotoId: "",
      ticketPhotoName: "",
    },
  ],
  expenses: [
    {
      id: "expense-1",
      receiptPhotos: [
        {
          id: "receipt-photo-1",
          name: "Fuel / receipt.png",
        },
      ],
    },
    {
      id: "expense-2",
      receiptPhotos: [
        {
          id: "receipt-photo-2",
          name: "Toll receipt.jpg",
        },
      ],
    },
    {
      id: "expense-3",
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

const originalPayPeriodText = JSON.stringify(payPeriod);
const originalSettingsText = JSON.stringify(settings);

const plan = buildPayPeriodArchivePlan({
  payPeriod,
  settings,
  appInfo,
  createdAt: "2026-06-16T14:35:20.000Z",
});

assert.equal(plan.archiveType, "fieldledger-pay-period-archive");
assert.equal(plan.archiveSchemaVersion, 1);
assert.equal(plan.driveRootFolderName, "FieldLedger Records");
assert.equal(plan.monthFolderName, "2026-06");
assert.equal(plan.archiveFolderName, "2026-06-01_to_2026-06-15__June-1-15-LEG__archive-20260616-1435");
assert.equal(plan.openMeFileName, "OPEN_ME.txt");
assert.equal(plan.manifestFileName, "fieldledger-archive-manifest.json");
assert.equal(plan.backupFileName, "fieldledger-pay-period-backup.json");
assert.equal(plan.csvFileName, "fieldledger-timesheet.csv");

assert.equal(plan.manifest.archiveType, "fieldledger-pay-period-archive");
assert.equal(plan.manifest.archiveSchemaVersion, 1);
assert.deepEqual(plan.manifest.appInfo, appInfo);
assert.deepEqual(plan.manifest.payPeriod, {
  id: "active",
  label: "June 1-15 / LEG",
  startDate: "2026-06-01",
  endDate: "2026-06-15",
  status: "open",
  schemaVersion: 1,
});
assert.deepEqual(plan.manifest.counts, {
  jobs: 2,
  expenses: 3,
  mileageEntries: 1,
  jobTicketPhotos: 1,
  expenseReceiptPhotos: 3,
});

const baseArchivePath = "FieldLedger Records/2026-06/2026-06-01_to_2026-06-15__June-1-15-LEG__archive-20260616-1435";

assert.equal(plan.photoReferences.length, 4);
assert.deepEqual(
  plan.photoReferences.map((photoReference) => photoReference.relativePath),
  [
    "photos/jobs/job-ticket-photo-01__Ticket-FT-3921-jpg.jpg",
    "photos/expenses/expense-receipt-photo-01__Fuel-receipt-png.jpg",
    "photos/expenses/expense-receipt-photo-02__Toll-receipt-jpg.jpg",
    "photos/expenses/expense-receipt-photo-03__Legacy-Receipt-jpg.jpg",
  ],
);
assert.deepEqual(
  plan.photoReferences.map((photoReference) => photoReference.expectedPath),
  [
    `${baseArchivePath}/photos/jobs/job-ticket-photo-01__Ticket-FT-3921-jpg.jpg`,
    `${baseArchivePath}/photos/expenses/expense-receipt-photo-01__Fuel-receipt-png.jpg`,
    `${baseArchivePath}/photos/expenses/expense-receipt-photo-02__Toll-receipt-jpg.jpg`,
    `${baseArchivePath}/photos/expenses/expense-receipt-photo-03__Legacy-Receipt-jpg.jpg`,
  ],
);
assert.equal(plan.photoReferences[0].photoId, "ticket-photo-1");
assert.equal(plan.photoReferences[1].photoId, "receipt-photo-1");
assert.equal(plan.photoReferences[2].photoId, "receipt-photo-2");
assert.equal(plan.photoReferences[3].photoId, "legacy-receipt-photo");

assert.equal(plan.expectedFiles.length, 8);
assert.deepEqual(
  plan.expectedFiles.slice(0, 4).map((file) => file.fileName),
  [
    "OPEN_ME.txt",
    "fieldledger-archive-manifest.json",
    "fieldledger-pay-period-backup.json",
    "fieldledger-timesheet.csv",
  ],
);
assert.equal(
  plan.expectedFiles[0].path,
  `${baseArchivePath}/OPEN_ME.txt`,
);
assert.deepEqual(
  plan.expectedFiles.slice(4).map((file) => file.path),
  plan.photoReferences.map((photoReference) => photoReference.expectedPath),
);
assert.deepEqual(plan.manifest.expectedFiles, plan.expectedFiles);
assert.deepEqual(plan.manifest.photoReferences, plan.photoReferences);

assert.deepEqual(plan.manifest.settingsSnapshotAtArchiveTime, settings);
assert.deepEqual(plan.manifest.restore, {
  sourceOfTruthFile: "fieldledger-pay-period-backup.json",
  csvIsReportOnly: true,
  photosMustBeRestoredSeparately: true,
  restoreMode: "future-drive-archive-folder",
});
assert.equal(plan.manifest.notes.some((note) => note.includes("Google Drive")), true);
assert.equal(plan.manifest.notes.some((note) => note.includes("backup JSON")), true);
assert.equal(plan.manifest.notes.some((note) => note.includes("CSV is a human-readable report only")), true);
assert.equal(plan.manifest.notes.some((note) => note.includes("Photos are evidence files")), true);

assert.equal(JSON.stringify(payPeriod), originalPayPeriodText);
assert.equal(JSON.stringify(settings), originalSettingsText);

const fallbackPlan = buildPayPeriodArchivePlan({
  payPeriod: {
    id: "active",
    label: "",
    startDate: "",
    endDate: "",
    status: "",
    schemaVersion: 1,
    jobs: [],
    expenses: [],
    mileageEntries: [],
  },
  createdAt: "2026-07-04T08:09:00.000Z",
});

assert.equal(fallbackPlan.monthFolderName, "2026-07");
assert.equal(fallbackPlan.archiveFolderName, "archive-created-2026-07-04__pay-period-active__archive-20260704-0809");
assert.equal(fallbackPlan.manifest.payPeriod.label, "");
assert.equal(fallbackPlan.manifest.restore.sourceOfTruthFile, "fieldledger-pay-period-backup.json");
assert.equal(fallbackPlan.manifest.restore.csvIsReportOnly, true);
assert.equal(fallbackPlan.manifest.restore.restoreMode, "future-drive-archive-folder");
assert.equal(fallbackPlan.manifest.settingsSnapshotAtArchiveTime, undefined);

console.log("payPeriodArchivePlan tests passed");
