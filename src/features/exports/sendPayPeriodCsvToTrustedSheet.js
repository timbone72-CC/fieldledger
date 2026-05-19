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

    const result = await response.json();

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
