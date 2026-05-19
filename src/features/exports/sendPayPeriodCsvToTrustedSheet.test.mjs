import assert from "node:assert/strict";
import { sendPayPeriodCsvToTrustedSheet } from "./sendPayPeriodCsvToTrustedSheet.js";

const successfulResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: " https://example.test/web-app ",
  importToken: " test-token ",
  csvText: "Date,Company\n2026-05-01,Legend Energy",
  fetchImpl: async (url, options) => {
    assert.equal(url, "https://example.test/web-app");
    assert.equal(options.method, "POST");
    assert.equal(options.body.get("token"), "test-token");
    assert.equal(options.body.get("csvText"), "Date,Company\n2026-05-01,Legend Energy");

    return {
      async json() {
        return {
          success: true,
          message: "Imported",
          dataRowCount: 1,
        };
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

const missingTokenResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://example.test/web-app",
  importToken: "",
  csvText: "Date,Company",
});

assert.equal(missingTokenResult.success, false);
assert.equal(missingTokenResult.message, "Trusted Sheet import token is required.");

const missingCsvResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://example.test/web-app",
  importToken: "test-token",
  csvText: "",
});

assert.equal(missingCsvResult.success, false);
assert.equal(missingCsvResult.message, "CSV data is required before sending to Trusted Sheet.");

const failureResult = await sendPayPeriodCsvToTrustedSheet({
  webAppUrl: "https://example.test/web-app",
  importToken: "test-token",
  csvText: "Date,Company",
  fetchImpl: async () => {
    throw new Error("network unavailable");
  },
});

assert.equal(failureResult.success, false);
assert.equal(failureResult.message, "Trusted Sheet send failed: network unavailable");

console.log("sendPayPeriodCsvToTrustedSheet tests passed");
