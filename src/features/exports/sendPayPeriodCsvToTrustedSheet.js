/**
 * =========================================================
 * 01. Send pay period CSV to trusted sheet
 * =========================================================
 *
 * 01.01 Purpose:
 * Posts a FieldLedger CSV export to the trusted Apps Script web endpoint.
 *
 * 01.02 Safety:
 * This helper does not store secrets.
 * The caller must provide the web app URL and import token.
 *
 * 01.03 Boundary:
 * This sends CSV text only.
 * It does not build CSV, mutate pay-period data, or write local storage.
 * =========================================================
 */

function buildNonJsonTrustedSheetMessage() {
  return [
    "Trusted Sheet did not return JSON.",
    "Check that the Web App URL is the deployed Apps Script /exec URL and that access is allowed.",
  ].join(" ");
}

function isValidTrustedSheetWebAppUrl(webAppUrl) {
  try {
    const parsedUrl = new URL(webAppUrl);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === "script.google.com" &&
      parsedUrl.pathname.endsWith("/exec")
    );
  } catch {
    return false;
  }
}

async function readTrustedSheetJson(response) {
  if (typeof response?.text === "function") {
    const responseText = await response.text();

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(buildNonJsonTrustedSheetMessage());
    }
  }

  if (typeof response?.json === "function") {
    try {
      return await response.json();
    } catch {
      throw new Error(buildNonJsonTrustedSheetMessage());
    }
  }

  throw new Error(buildNonJsonTrustedSheetMessage());
}

export async function sendPayPeriodCsvToTrustedSheet({
  webAppUrl,
  importToken,
  csvText,
  fetchImpl = fetch,
}) {
  const trimmedWebAppUrl = String(webAppUrl || "").trim();
  const trimmedImportToken = String(importToken || "").trim();
  const csvBody = String(csvText || "");

  if (!trimmedWebAppUrl) {
    return {
      success: false,
      message: "Trusted Sheet web app URL is required.",
    };
  }

  if (!isValidTrustedSheetWebAppUrl(trimmedWebAppUrl)) {
    return {
      success: false,
      message: "Trusted Sheet web app URL must be a deployed Google Apps Script /exec URL.",
    };
  }

  if (!trimmedImportToken) {
    return {
      success: false,
      message: "Trusted Sheet import token is required.",
    };
  }

  if (!csvBody) {
    return {
      success: false,
      message: "CSV data is required before sending to Trusted Sheet.",
    };
  }

  const formBody = new URLSearchParams();
  formBody.set("token", trimmedImportToken);
  formBody.set("csvText", csvBody);

  try {
    const response = await fetchImpl(trimmedWebAppUrl, {
      method: "POST",
      body: formBody,
    });

    const result = await readTrustedSheetJson(response);

    return {
      success: Boolean(result?.success),
      message: result?.message || "Trusted Sheet response did not include a message.",
      dataRowCount: result?.dataRowCount,
    };
  } catch (error) {
    return {
      success: false,
      message: `Trusted Sheet send failed: ${error.message}`,
    };
  }
}
