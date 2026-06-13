import assert from "node:assert/strict";
import {
  buildCompletePayPeriodBackupPackage,
  isValidCompletePayPeriodBackupPackage,
} from "./completePayPeriodBackupPackage.js";

function buildPayPeriod(overrides = {}) {
  return {
    id: "active",
    label: "June Pay Period",
    startDate: "2026-06-01",
    endDate: "2026-06-15",
    status: "open",
    schemaVersion: 1,
    jobs: [],
    expenses: [],
    mileageEntries: [],
    ...overrides,
  };
}

function buildJob(overrides = {}) {
  return {
    id: "job-1",
    payPeriodId: "active",
    date: "2026-06-02",
    company: "Legend Energy",
    rigNameOrNumber: "Rig 12",
    fieldTicketNumber: "FT-1001",
    transportation: 25,
    ticketPhotoId: "",
    ticketPhotoName: "",
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
    ...overrides,
  };
}

function buildExpense(overrides = {}) {
  return {
    id: "expense-1",
    payPeriodId: "active",
    date: "2026-06-03",
    vendor: "Pilot",
    category: "Fuel",
    amount: 42.5,
    receiptPhotoId: "",
    receiptPhotoName: "",
    notes: "",
    createdAt: "2026-06-03T12:00:00.000Z",
    updatedAt: "2026-06-03T12:00:00.000Z",
    ...overrides,
  };
}

function buildMileageEntry(overrides = {}) {
  return {
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
    ...overrides,
  };
}

const appInfo = {
  name: "FieldLedger",
  versionLabel: "Test",
  versionDate: "2026-06-13",
  versionNote: "Complete backup tests",
};

const createdAt = "2026-06-13T12:00:00.000Z";

async function encodeBlobAsBase64(blob) {
  return {
    base64: Buffer.from(await blob.text()).toString("base64"),
    mimeType: blob.type,
  };
}

async function buildPackage(payPeriod, photoRecords = {}) {
  return buildCompletePayPeriodBackupPackage({
    payPeriod,
    appInfo,
    createdAt,
    loadPhotoBlob: async (photoId) => photoRecords[photoId] || null,
    encodeBlobAsBase64,
  });
}

const noPhotoPackage = await buildPackage(buildPayPeriod());

assert.equal(noPhotoPackage.packageType, "fieldledger.completeBackup");
assert.equal(noPhotoPackage.summary.jobCount, 0);
assert.equal(noPhotoPackage.summary.expenseCount, 0);
assert.equal(noPhotoPackage.summary.mileageEntryCount, 0);
assert.equal(noPhotoPackage.summary.photoCount, 0);
assert.equal(noPhotoPackage.summary.missingPhotoCount, 0);
assert.equal(isValidCompletePayPeriodBackupPackage(noPhotoPackage), true);

const jobPhotoPackage = await buildPackage(
  buildPayPeriod({
    jobs: [
      buildJob({
        ticketPhotoId: "job-photo-1",
        ticketPhotoName: "ticket.jpg",
      }),
    ],
  }),
  {
    "job-photo-1": {
      blob: new Blob(["job photo"], { type: "image/jpeg" }),
      type: "image/jpeg",
    },
  },
);

assert.equal(jobPhotoPackage.photos.length, 1);
assert.equal(jobPhotoPackage.photos[0].photoId, "job-photo-1");
assert.equal(jobPhotoPackage.photos[0].fileName, "ticket.jpg");
assert.equal(jobPhotoPackage.photos[0].role, "jobTicket");
assert.equal(jobPhotoPackage.photos[0].recordId, "job-1");
assert.equal(jobPhotoPackage.summary.photoCount, 1);
assert.equal(jobPhotoPackage.summary.missingPhotoCount, 0);

const receiptPhotoPackage = await buildPackage(
  buildPayPeriod({
    expenses: [
      buildExpense({
        receiptPhotos: [{ id: "receipt-photo-1", name: "receipt.jpg" }],
      }),
    ],
  }),
  {
    "receipt-photo-1": {
      blob: new Blob(["receipt photo"], { type: "image/jpeg" }),
      type: "image/jpeg",
    },
  },
);

assert.equal(receiptPhotoPackage.photos.length, 1);
assert.equal(receiptPhotoPackage.photos[0].photoId, "receipt-photo-1");
assert.equal(receiptPhotoPackage.photos[0].fileName, "receipt.jpg");
assert.equal(receiptPhotoPackage.photos[0].role, "expenseReceipt");
assert.equal(receiptPhotoPackage.photos[0].recordId, "expense-1");

const missingJobPhotoPackage = await buildPackage(
  buildPayPeriod({
    jobs: [
      buildJob({
        ticketPhotoId: "missing-job-photo",
        ticketPhotoName: "missing-ticket.jpg",
      }),
    ],
  }),
);

assert.equal(missingJobPhotoPackage.photos.length, 0);
assert.equal(missingJobPhotoPackage.missingPhotos.length, 1);
assert.equal(missingJobPhotoPackage.missingPhotos[0].reason, "photo-not-found");
assert.equal(missingJobPhotoPackage.missingPhotos[0].role, "jobTicket");

const missingExpensePhotoPackage = await buildPackage(
  buildPayPeriod({
    expenses: [
      buildExpense({
        receiptPhotoId: "missing-receipt-photo",
        receiptPhotoName: "missing-receipt.jpg",
      }),
    ],
  }),
);

assert.equal(missingExpensePhotoPackage.photos.length, 0);
assert.equal(missingExpensePhotoPackage.missingPhotos.length, 1);
assert.equal(missingExpensePhotoPackage.missingPhotos[0].reason, "photo-not-found");
assert.equal(missingExpensePhotoPackage.missingPhotos[0].role, "expenseReceipt");

const countedPackage = await buildPackage(
  buildPayPeriod({
    jobs: [buildJob()],
    expenses: [buildExpense()],
    mileageEntries: [buildMileageEntry()],
  }),
);

assert.equal(countedPackage.summary.jobCount, 1);
assert.equal(countedPackage.summary.expenseCount, 1);
assert.equal(countedPackage.summary.mileageEntryCount, 1);

assert.equal(isValidCompletePayPeriodBackupPackage({}), false);
assert.equal(
  isValidCompletePayPeriodBackupPackage({
    ...noPhotoPackage,
    packageType: "fieldledger.wrongPackage",
  }),
  false,
);
assert.equal(
  isValidCompletePayPeriodBackupPackage({
    ...noPhotoPackage,
    photos: [{ photoId: "missing-required-fields" }],
  }),
  false,
);

console.log("completePayPeriodBackupPackage tests passed");
