import assert from "node:assert/strict";
import { buildCompletePayPeriodBackupPackage } from "./completePayPeriodBackupPackage.js";
import { restoreCompletePayPeriodBackup } from "./restoreCompletePayPeriodBackup.js";

function buildPayPeriod() {
  return {
    id: "active",
    label: "Round Trip Pay Period",
    startDate: "2026-06-01",
    endDate: "2026-06-15",
    status: "open",
    schemaVersion: 1,
    jobs: [
      {
        id: "job-1",
        payPeriodId: "active",
        date: "2026-06-02",
        company: "Legend Energy",
        rigNameOrNumber: "Rig 12",
        fieldTicketNumber: "FT-1001",
        transportation: 25,
        ticketPhotoId: "job-photo-1",
        ticketPhotoName: "ticket.jpg",
        jobType: "bucking",
        buckingState: "oklahoma",
        jobsCompleted: 1,
        hoursPerJob: 4,
        hoursWorked: 4,
        baseJobPay: 200,
        additionalHours: 0,
        hourlyRateSnapshot: 50,
        totalPay: 225,
        notes: "",
        createdAt: "2026-06-02T12:00:00.000Z",
        updatedAt: "2026-06-02T12:00:00.000Z",
      },
    ],
    expenses: [
      {
        id: "expense-1",
        payPeriodId: "active",
        date: "2026-06-03",
        vendor: "Pilot",
        category: "Fuel",
        amount: 42.5,
        receiptPhotos: [{ id: "receipt-photo-1", name: "receipt.jpg" }],
        notes: "",
        createdAt: "2026-06-03T12:00:00.000Z",
        updatedAt: "2026-06-03T12:00:00.000Z",
      },
    ],
    mileageEntries: [
      {
        id: "mileage-1",
        payPeriodId: "active",
        date: "2026-06-04",
        vehicle: "Truck",
        startLocation: "Yard",
        endLocation: "Rig",
        businessPurpose: "Field work",
        miles: 120,
        mileageRateSnapshot: 0.67,
        notes: "",
        createdAt: "2026-06-04T12:00:00.000Z",
        updatedAt: "2026-06-04T12:00:00.000Z",
      },
    ],
  };
}

const appInfo = {
  name: "FieldLedger",
  versionLabel: "Test",
  versionDate: "2026-06-13",
  versionNote: "Complete restore tests",
};

async function encodeBlobAsBase64(blob) {
  return {
    base64: Buffer.from(await blob.text()).toString("base64"),
    mimeType: blob.type,
  };
}

function decodeBase64AsBlob(base64, mimeType) {
  return new Blob([Buffer.from(base64, "base64")], { type: mimeType });
}

const photoRecords = {
  "job-photo-1": {
    blob: new Blob(["job photo"], { type: "image/jpeg" }),
    type: "image/jpeg",
  },
  "receipt-photo-1": {
    blob: new Blob(["receipt photo"], { type: "image/jpeg" }),
    type: "image/jpeg",
  },
};

const packageData = await buildCompletePayPeriodBackupPackage({
  payPeriod: buildPayPeriod(),
  appInfo,
  createdAt: "2026-06-13T12:00:00.000Z",
  loadPhotoBlob: async (photoId) => photoRecords[photoId] || null,
  encodeBlobAsBase64,
});

let savedPayPeriod = null;
const savedPhotos = new Map();
const restoreResult = await restoreCompletePayPeriodBackup({
  packageData,
  saveActivePayPeriod: (payPeriod) => {
    savedPayPeriod = payPeriod;
    return true;
  },
  savePhotoBlobWithId: async (photoRecord) => {
    savedPhotos.set(photoRecord.id, photoRecord);
    return photoRecord.id;
  },
  decodeBase64AsBlob,
  restoredAt: "2026-06-13T13:00:00.000Z",
});

assert.equal(restoreResult.ok, true);
assert.equal(restoreResult.restoredPhotoCount, 2);
assert.equal(savedPayPeriod.id, "active");
assert.equal(savedPayPeriod.jobs[0].ticketPhotoId, "job-photo-1");
assert.equal(savedPayPeriod.expenses[0].receiptPhotos[0].id, "receipt-photo-1");
assert.equal(savedPayPeriod.mileageEntries[0].id, "mileage-1");
assert.equal(savedPayPeriod.updatedAt, "2026-06-13T13:00:00.000Z");
assert.equal(savedPhotos.size, 2);
assert.equal(savedPhotos.get("job-photo-1").name, "ticket.jpg");
assert.equal(savedPhotos.get("receipt-photo-1").name, "receipt.jpg");
assert.equal(await savedPhotos.get("job-photo-1").blob.text(), "job photo");
assert.equal(await savedPhotos.get("receipt-photo-1").blob.text(), "receipt photo");

let invalidWrotePayPeriod = false;
let invalidWrotePhoto = false;
const invalidResult = await restoreCompletePayPeriodBackup({
  packageData: { packageType: "fieldledger.completeBackup" },
  saveActivePayPeriod: () => {
    invalidWrotePayPeriod = true;
    return true;
  },
  savePhotoBlobWithId: async () => {
    invalidWrotePhoto = true;
  },
  decodeBase64AsBlob,
});

assert.equal(invalidResult.ok, false);
assert.equal(invalidWrotePayPeriod, false);
assert.equal(invalidWrotePhoto, false);

let photoFailureWrotePayPeriod = false;
const photoFailureResult = await restoreCompletePayPeriodBackup({
  packageData,
  saveActivePayPeriod: () => {
    photoFailureWrotePayPeriod = true;
    return true;
  },
  savePhotoBlobWithId: async () => {
    throw new Error("indexeddb unavailable");
  },
  decodeBase64AsBlob,
});

assert.equal(photoFailureResult.ok, false);
assert.equal(photoFailureWrotePayPeriod, false);

console.log("restoreCompletePayPeriodBackup tests passed");
