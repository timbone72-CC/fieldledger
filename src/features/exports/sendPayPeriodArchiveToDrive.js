/**
 * =========================================================
 * 01. Send pay period archive payload to Drive endpoint
 * =========================================================
 *
 * 01.01 Purpose:
 * Posts a prepared FieldLedger archive payload to the Apps Script
 * validation endpoint for future Google Drive archive writing.
 *
 * 01.02 Safety:
 * This helper does not store secrets.
 * The caller must provide the web app URL, archive token, and payload.
 *
 * 01.03 Boundary:
 * This sends an existing archive payload only.
 * It does not build payloads, read storage, mutate records, or write Drive.
 * =========================================================
 */

function buildNonJsonArchiveMessage() {
  return [
    "Archive endpoint did not return JSON.",
    "Check that the Web App URL is the deployed Apps Script /exec URL and that archive validation is deployed.",
  ].join(" ");
}

function isValidAppsScriptWebAppUrl(webAppUrl) {
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

async function readArchiveJson(response) {
  if (typeof response?.text === "function") {
    const responseText = await response.text();

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(buildNonJsonArchiveMessage());
    }
  }

  if (typeof response?.json === "function") {
    try {
      return await response.json();
    } catch {
      throw new Error(buildNonJsonArchiveMessage());
    }
  }

  throw new Error(buildNonJsonArchiveMessage());
}

export async function sendPayPeriodArchiveToDrive({
  webAppUrl,
  archiveToken,
  archivePayload,
  fetchImpl = fetch,
}) {
  const trimmedWebAppUrl = String(webAppUrl || "").trim();
  const trimmedArchiveToken = String(archiveToken || "").trim();

  if (!trimmedWebAppUrl) {
    return {
      success: false,
      message: "Archive web app URL is required.",
    };
  }

  if (!isValidAppsScriptWebAppUrl(trimmedWebAppUrl)) {
    return {
      success: false,
      message: "Archive web app URL must be a deployed Google Apps Script /exec URL.",
    };
  }

  if (!trimmedArchiveToken) {
    return {
      success: false,
      message: "Archive token is required.",
    };
  }

  if (!archivePayload || typeof archivePayload !== "object") {
    return {
      success: false,
      message: "Archive payload is required.",
    };
  }

  if (archivePayload.action !== "archivePayPeriod") {
    return {
      success: false,
      message: "Archive payload action must be archivePayPeriod.",
    };
  }

  try {
    const response = await fetchImpl(trimmedWebAppUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "archivePayPeriod",
        token: trimmedArchiveToken,
        archivePayload,
      }),
    });

    const result = await readArchiveJson(response);

    return {
      success: Boolean(result?.success),
      message: result?.message || "Archive endpoint response did not include a message.",
      fileCount: result?.fileCount,
      photoCount: result?.photoCount,
      missingPhotoCount: result?.missingPhotoCount,
    };
  } catch (error) {
    return {
      success: false,
      message: `Archive send failed: ${error.message}`,
    };
  }
}
