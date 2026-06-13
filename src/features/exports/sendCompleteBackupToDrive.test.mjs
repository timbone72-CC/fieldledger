import assert from "node:assert/strict";
import { sendCompleteBackupToDrive } from "./sendCompleteBackupToDrive.js";

const completeBackupPackage = {
  packageType: "fieldledger.completeBackup",
  schemaVersion: 1,
  createdAt: "2026-06-13T12:00:00.000Z",
  appInfo: {
    name: "FieldLedger",
    versionLabel: "Test",
    versionDate: "2026-06-13",
    versionNote: "Complete backup sender tests",
  },
  summary: {
    jobCount: 1,
    expenseCount: 1,
    mileageEntryCount: 1,
    photoCount: 2,
    missingPhotoCount: 0,
  },
  payPeriod: {
    id: "active",
    schemaVersion: 1,
    jobs: [],
    expenses: [],
    mileageEntries: [],
  },
  photos: [],
  missingPhotos: [],
};

const missingUrlResult = await sendCompleteBackupToDrive({
  webAppUrl: "",
  completeBackupToken: "test-token",
  completeBackupPackage,
});

assert.equal(missingUrlResult.success, false);
assert.equal(missingUrlResult.message, "Complete Backup web app URL is required.");

let invalidUrlFetchCalled = false;
const invalidUrlResult = await sendCompleteBackupToDrive({
  webAppUrl: "https://example.test/web-app",
  completeBackupToken: "test-token",
  completeBackupPackage,
  fetchImpl: async () => {
    invalidUrlFetchCalled = true;
    throw new Error("fetch should not be called for invalid URLs");
  },
});

assert.equal(invalidUrlResult.success, false);
assert.equal(
  invalidUrlResult.message,
  "Complete Backup web app URL must be a deployed Google Apps Script /exec URL.",
);
assert.equal(invalidUrlFetchCalled, false);

const missingTokenResult = await sendCompleteBackupToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  completeBackupToken: "",
  completeBackupPackage,
});

assert.equal(missingTokenResult.success, false);
assert.equal(missingTokenResult.message, "Complete Backup token is required.");

const wrongPackageTypeResult = await sendCompleteBackupToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  completeBackupToken: "test-token",
  completeBackupPackage: {
    ...completeBackupPackage,
    packageType: "fieldledger.wrongPackage",
  },
});

assert.equal(wrongPackageTypeResult.success, false);
assert.equal(
  wrongPackageTypeResult.message,
  "Complete Backup package type must be fieldledger.completeBackup.",
);

const successResult = await sendCompleteBackupToDrive({
  webAppUrl: " https://script.google.com/macros/s/test-deployment-id/exec ",
  completeBackupToken: " test-token ",
  completeBackupPackage,
  fetchImpl: async (url, options) => {
    assert.equal(url, "https://script.google.com/macros/s/test-deployment-id/exec");
    assert.equal(options.method, "POST");
    assert.equal(options.headers, undefined);
    assert.equal(options.body instanceof URLSearchParams, true);
    assert.equal(options.body.get("action"), "saveCompleteBackupToDrive");
    assert.equal(options.body.get("token"), "test-token");
    assert.deepEqual(JSON.parse(options.body.get("completeBackupPackage")), completeBackupPackage);

    return {
      async text() {
        return JSON.stringify({
          ok: true,
          message: "Complete Backup saved to Google Drive.",
          fileName: "fieldledger-complete-backup-20260613-120000.json",
          folderName: "Complete Backups",
          driveRootFolderName: "FieldLedger Records",
          folderPath: "FieldLedger Records/Complete Backups",
          fileUrl: "https://drive.google.com/file/d/test-file-id/view",
          createdAt: "2026-06-13T12:00:00.000Z",
          summary: completeBackupPackage.summary,
        });
      },
    };
  },
});

assert.deepEqual(successResult, {
  success: true,
  message: "Complete Backup saved to Google Drive.",
  fileName: "fieldledger-complete-backup-20260613-120000.json",
  folderName: "Complete Backups",
  driveRootFolderName: "FieldLedger Records",
  folderPath: "FieldLedger Records/Complete Backups",
  fileUrl: "https://drive.google.com/file/d/test-file-id/view",
  createdAt: "2026-06-13T12:00:00.000Z",
  summary: completeBackupPackage.summary,
});

const errorJsonResult = await sendCompleteBackupToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  completeBackupToken: "test-token",
  completeBackupPackage,
  fetchImpl: async () => ({
    async text() {
      return JSON.stringify({
        ok: false,
        message: "Unauthorized FieldLedger Complete Backup request.",
      });
    },
  }),
});

assert.equal(errorJsonResult.success, false);
assert.equal(errorJsonResult.message, "Unauthorized FieldLedger Complete Backup request.");

const nonJsonResponseResult = await sendCompleteBackupToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  completeBackupToken: "test-token",
  completeBackupPackage,
  fetchImpl: async () => ({
    async text() {
      return "<!DOCTYPE html><html><body>Not JSON</body></html>";
    },
  }),
});

assert.equal(nonJsonResponseResult.success, false);
assert.equal(
  nonJsonResponseResult.message,
  "Complete Backup Drive save failed: Complete Backup endpoint did not return JSON. Check that the Web App URL is the deployed Apps Script /exec URL and that Complete Backup Drive save is deployed.",
);

console.log("sendCompleteBackupToDrive tests passed");
