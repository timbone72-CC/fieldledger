import assert from "node:assert/strict";
import { sendPayPeriodCsvToTrustedSheet } from "./sendPayPeriodCsvToTrustedSheet.js";

const successfulResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: " https://script.google.com/macros/s/test-deployment-id/exec ",
  importToken: " test-token ",
  csvText: "Date,Company\n2026-05-01,Legend Energy",
  fetchImpl: async (url, options) => {
    assert.equal(url, "https://script.google.com/macros/s/test-deployment-id/exec");
    assert.equal(options.method, "POST");
    assert.equal(options.body.get("token"), "test-token");
    assert.equal(options.body.get("csvText"), "Date,Company\n2026-05-01,Legend Energy");

    return {
      async text() {
        return JSON.stringify({
          success: true,
          message: "Imported",
          dataRowCount: 1,
        });
      },
    };
  },
});

assert.deepEqual(successfulResult, {
  success: true,
  message: "Imported",
  dataRowCount: 1,
});

const missingUrlResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "",
  importToken: "test-token",
  csvText: "Date,Company",
});

assert.equal(missingUrlResult.success, false);
assert.equal(missingUrlResult.message, "Trusted Sheet web app URL is required.");

let invalidUrlFetchCalled = false;

const invalidUrlResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://example.test/web-app",
  importToken: "test-token",
  csvText: "Date,Company",
  fetchImpl: async () => {
    invalidUrlFetchCalled = true;
    throw new Error("fetch should not be called for invalid Trusted Sheet URLs");
  },
});

assert.equal(invalidUrlResult.success, false);
assert.equal(
  invalidUrlResult.message,
  "Trusted Sheet web app URL must be a deployed Google Apps Script /exec URL."
);
assert.equal(invalidUrlFetchCalled, false);

let nonExecUrlFetchCalled = false;

const nonExecUrlResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/dev",
  importToken: "test-token",
  csvText: "Date,Company",
  fetchImpl: async () => {
    nonExecUrlFetchCalled = true;
    throw new Error("fetch should not be called for non-/exec URLs");
  },
});

assert.equal(nonExecUrlResult.success, false);
assert.equal(
  nonExecUrlResult.message,
  "Trusted Sheet web app URL must be a deployed Google Apps Script /exec URL."
);
assert.equal(nonExecUrlFetchCalled, false);

const missingTokenResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  importToken: "",
  csvText: "Date,Company",
});

assert.equal(missingTokenResult.success, false);
assert.equal(missingTokenResult.message, "Trusted Sheet import token is required.");

const missingCsvResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  importToken: "test-token",
  csvText: "",
});

assert.equal(missingCsvResult.success, false);
assert.equal(missingCsvResult.message, "CSV data is required before sending to Trusted Sheet.");

const nonJsonResponseResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  importToken: "test-token",
  csvText: "Date,Company",
  fetchImpl: async () => {
    return {
      async text() {
        return "<!DOCTYPE html><html><body>Not the Apps Script JSON response</body></html>";
      },
    };
  },
});

assert.equal(nonJsonResponseResult.success, false);
assert.equal(
  nonJsonResponseResult.message,
  "Trusted Sheet send failed: Trusted Sheet did not return JSON. Check that the Web App URL is the deployed Apps Script /exec URL and that access is allowed."
);

const jsonFallbackFailureResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  importToken: "test-token",
  csvText: "Date,Company",
  fetchImpl: async () => {
    return {
      async json() {
        throw new SyntaxError("Unexpected token '<'");
      },
    };
  },
});

assert.equal(jsonFallbackFailureResult.success, false);
assert.equal(
  jsonFallbackFailureResult.message,
  "Trusted Sheet send failed: Trusted Sheet did not return JSON. Check that the Web App URL is the deployed Apps Script /exec URL and that access is allowed."
);

const failureResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://script.google.com/macros/s/test-deployment-id/exec",
  importToken: "test-token",
  csvText: "Date,Company",
  fetchImpl: async () => {
    throw new Error("network unavailable");
  },
});

assert.equal(failureResult.success, false);
assert.equal(failureResult.message, "Trusted Sheet send failed: network unavailable");

console.log("sendPayPeriodCsvToTrustedSheet tests passed");
