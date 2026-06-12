import assert from "node:assert/strict";
import { sendPayPeriodArchiveToDrive } from "./sendPayPeriodArchiveToDrive.js";

const archivePayload = {
  action: "archivePayPeriod",
  archiveType: "fieldledger-pay-period-archive",
  archiveSchemaVersion: 1,
  manifest: {
    restore: {
      sourceOfTruthFile: "fieldledger-pay-period-backup.json",
    },
  },
  files: [],
  photos: [],
  missingPhotos: [],
  summary: {
    fileCount: 4,
    photoCount: 2,
    missingPhotoCount: 1,
  },
};

const originalArchivePayloadText = JSON.stringify(archivePayload);

const missingUrlResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "",
  archiveToken: "test-token",
  archivePayload,
});

assert.equal(missingUrlResult.success, false);
assert.equal(missingUrlResult.message, "Archive web app URL is required.");

let invalidUrlFetchCalled = false;

const invalidUrlResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "https://example.test/web-app",
  archiveToken: "test-token",
  archivePayload,
  fetchImpl: async () => {
    invalidUrlFetchCalled = true;
    throw new Error("fetch should not be called for invalid URLs");
  },
});

assert.equal(invalidUrlResult.success, false);
assert.equal(
  invalidUrlResult.message,
  "Archive web app URL must be a deployed Google Apps Script /exec URL.",
);
assert.equal(invalidUrlFetchCalled, false);

const nonExecUrlResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/dev",
  archiveToken: "test-token",
  archivePayload,
});

assert.equal(nonExecUrlResult.success, false);
assert.equal(
  nonExecUrlResult.message,
  "Archive web app URL must be a deployed Google Apps Script /exec URL.",
);

const missingTokenResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  archiveToken: "",
  archivePayload,
});

assert.equal(missingTokenResult.success, false);
assert.equal(missingTokenResult.message, "Archive token is required.");

const missingPayloadResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  archiveToken: "test-token",
});

assert.equal(missingPayloadResult.success, false);
assert.equal(missingPayloadResult.message, "Archive payload is required.");

const wrongActionResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  archiveToken: "test-token",
  archivePayload: {
    ...archivePayload,
    action: "importCsv",
  },
});

assert.equal(wrongActionResult.success, false);
assert.equal(wrongActionResult.message, "Archive payload action must be archivePayPeriod.");

const successResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: " https://script.google.com/macros/s/test-deployment-id/exec ",
  archiveToken: " test-token ",
  archivePayload,
  fetchImpl: async (url, options) => {
    assert.equal(url, "https://script.google.com/macros/s/test-deployment-id/exec");
    assert.equal(options.method, "POST");
    assert.deepEqual(options.headers, {
      "Content-Type": "application/json",
    });

    const requestBody = JSON.parse(options.body);

    assert.equal(requestBody.action, "archivePayPeriod");
    assert.equal(requestBody.token, "test-token");
    assert.deepEqual(requestBody.archivePayload, archivePayload);

    return {
      async text() {
        return JSON.stringify({
          success: true,
          message: "Archive payload validated",
          fileCount: 4,
          photoCount: 2,
          missingPhotoCount: 1,
        });
      },
    };
  },
});

assert.deepEqual(successResult, {
  success: true,
  message: "Archive payload validated",
  fileCount: 4,
  photoCount: 2,
  missingPhotoCount: 1,
});

const failureJsonResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  archiveToken: "test-token",
  archivePayload,
  fetchImpl: async () => ({
    async text() {
      return JSON.stringify({
        success: false,
        message: "Unauthorized FieldLedger archive request.",
      });
    },
  }),
});

assert.deepEqual(failureJsonResult, {
  success: false,
  message: "Unauthorized FieldLedger archive request.",
  fileCount: undefined,
  photoCount: undefined,
  missingPhotoCount: undefined,
});

const nonJsonResponseResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  archiveToken: "test-token",
  archivePayload,
  fetchImpl: async () => ({
    async text() {
      return "<!DOCTYPE html><html><body>Not JSON</body></html>";
    },
  }),
});

assert.equal(nonJsonResponseResult.success, false);
assert.equal(
  nonJsonResponseResult.message,
  "Archive send failed: Archive endpoint did not return JSON. Check that the Web App URL is the deployed Apps Script /exec URL and that archive validation is deployed.",
);

const jsonFallbackFailureResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  archiveToken: "test-token",
  archivePayload,
  fetchImpl: async () => ({
    async json() {
      throw new SyntaxError("Unexpected token '<'");
    },
  }),
});

assert.equal(jsonFallbackFailureResult.success, false);
assert.equal(
  jsonFallbackFailureResult.message,
  "Archive send failed: Archive endpoint did not return JSON. Check that the Web App URL is the deployed Apps Script /exec URL and that archive validation is deployed.",
);

const fetchThrowResult = await sendPayPeriodArchiveToDrive({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  archiveToken: "test-token",
  archivePayload,
  fetchImpl: async () => {
    throw new Error("network unavailable");
  },
});

assert.equal(fetchThrowResult.success, false);
assert.equal(fetchThrowResult.message, "Archive send failed: network unavailable");
assert.equal(JSON.stringify(archivePayload), originalArchivePayloadText);

console.log("sendPayPeriodArchiveToDrive tests passed");
