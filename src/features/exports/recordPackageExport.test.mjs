import assert from "node:assert/strict";
import { buildRecordPackageExport } from "./recordPackageExport.js";

const baseJob = {
  id: "job-1",
  payPeriodId: "active",
  date: "2026-06-12",
  company: "Legend",
  rigNameOrNumber: "Rig 27",
  fieldTicketNumber: "FT3921",
  jobType: "bucking",
  hoursWorked: 6,
  transportation: 25,
  totalPay: 168,
  expenses: [{ id: "expense-should-not-export" }],
  mileageEntries: [{ id: "mileage-should-not-export" }],
};

const noPhotoPackage = await buildRecordPackageExport({
  job: baseJob,
  loadPhotoBlob: async () => {
    throw new Error("photo loader should not be called without ticketPhotoId");
  },
});

assert.equal(noPhotoPackage.recordKey, "20260612__FT3921__Legend");
assert.equal(noPhotoPackage.folderName, "20260612__FT3921__Legend");
assert.equal(noPhotoPackage.manifest.photoStatus, "none");
assert.equal(noPhotoPackage.files.length, 3);
assert.deepEqual(
  noPhotoPackage.files.map((file) => file.fileName),
  [
    "20260612__FT3921__Legend__manifest.json",
    "20260612__FT3921__Legend__job-backup.json",
    "20260612__FT3921__Legend__records.csv",
  ],
);
assert.equal(
  noPhotoPackage.files.every((file) => file.fileName.startsWith(`${noPhotoPackage.recordKey}__`)),
  true,
);
assert.equal(noPhotoPackage.files.some((file) => file.fileName.includes("Rig")), false);
assert.equal(noPhotoPackage.files.some((file) => file.fileName.includes("27")), false);
assert.equal(noPhotoPackage.manifest.rigNameOrNumber, "Rig 27");

const noPhotoJobBackup = JSON.parse(
  noPhotoPackage.files.find((file) => file.role === "job-backup").text,
);
assert.equal(noPhotoJobBackup.rigNameOrNumber, "Rig 27");
assert.equal(noPhotoJobBackup.expenses.length, 1);
assert.equal(noPhotoJobBackup.mileageEntries.length, 1);

const noPhotoManifestText = JSON.parse(
  noPhotoPackage.files.find((file) => file.role === "manifest").text,
);
assert.deepEqual(noPhotoManifestText.files, noPhotoPackage.manifest.files);
assert.equal(noPhotoManifestText.files.length, noPhotoPackage.files.length);
assert.equal(
  noPhotoManifestText.files.every((fileSummary) =>
    noPhotoPackage.files.some((file) => file.role === fileSummary.role && file.fileName === fileSummary.fileName),
  ),
  true,
);

const noPhotoCsv = noPhotoPackage.files.find((file) => file.role === "records").text;
const noPhotoCsvRows = noPhotoCsv.split("\n");
assert.equal(noPhotoCsvRows.length, 2);
assert.deepEqual(noPhotoCsvRows[0].split(","), [
  "Date",
  "Company",
  "Rig Name/Number",
  "Field Ticket Number",
  "Day Rate",
  "Hours Worked",
  "Transportation",
  "Total",
]);
assert.deepEqual(noPhotoCsvRows[1].split(","), [
  "2026-06-12",
  "Legend",
  "Rig 27",
  "FT3921",
  "",
  "6",
  "25",
  "168",
]);
assert.doesNotMatch(noPhotoCsv, /expense-should-not-export/);
assert.doesNotMatch(noPhotoCsv, /mileage-should-not-export/);

const pngBlob = new Blob(["fake png"], { type: "image/png" });
const includedPhotoPackage = await buildRecordPackageExport({
  job: {
    ...baseJob,
    ticketPhotoId: "photo-1",
    ticketPhotoName: "Unsafe/Original:Name.png",
  },
  loadPhotoBlob: async (photoId) => {
    assert.equal(photoId, "photo-1");

    return {
      id: photoId,
      name: "Unsafe/Original:Name.png",
      type: "image/png",
      blob: pngBlob,
    };
  },
});

const includedPhotoFile = includedPhotoPackage.files.find((file) => file.role === "ticket-photo");
assert.equal(includedPhotoPackage.manifest.photoStatus, "included");
assert.equal(includedPhotoFile.fileName, "20260612__FT3921__Legend__ticket-photo-01.png");
assert.equal(includedPhotoFile.mimeType, "image/png");
assert.equal(includedPhotoFile.blob, pngBlob);
assert.equal(
  includedPhotoPackage.manifest.files.find((file) => file.role === "ticket-photo").included,
  true,
);

const missingPhotoPackage = await buildRecordPackageExport({
  job: {
    ...baseJob,
    ticketPhotoId: "missing-photo",
  },
  loadPhotoBlob: async () => null,
});

assert.equal(missingPhotoPackage.manifest.photoStatus, "missing");
assert.equal(missingPhotoPackage.files.some((file) => file.role === "ticket-photo"), false);
assert.deepEqual(missingPhotoPackage.manifest.files.find((file) => file.role === "ticket-photo"), {
  role: "ticket-photo",
  fileName: "20260612__FT3921__Legend__ticket-photo-01.jpg",
  mimeType: "image/jpeg",
  included: false,
});

const unknownTypeBlob = new Blob(["fake image"], { type: "application/octet-stream" });
const jpgFallbackPackage = await buildRecordPackageExport({
  job: {
    ...baseJob,
    ticketPhotoId: "unknown-photo",
  },
  loadPhotoBlob: async () => ({
    id: "unknown-photo",
    name: "unsafe.original",
    type: "application/octet-stream",
    blob: unknownTypeBlob,
  }),
});

assert.equal(
  jpgFallbackPackage.files.find((file) => file.role === "ticket-photo").fileName,
  "20260612__FT3921__Legend__ticket-photo-01.jpg",
);

console.log("recordPackageExport tests passed");
