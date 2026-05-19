/**
 * =========================================================
 * 01. Send pay period CSV to trusted sheet button
 * =========================================================
 *
 * 01.01 Purpose:
 * Builds the current pay-period CSV and sends it to the trusted
 * Apps Script web endpoint after manual confirmation.
 *
 * 01.02 Safety:
 * This component stores only the Trusted Sheet web app URL.
 * It does not store the import token.
 *
 * 01.03 Boundary:
 * This keeps the existing Download Spreadsheet CSV flow unchanged.
 * =========================================================
 */

import { useState } from "react";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys.js";
import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { buildPayPeriodCsv } from "./payPeriodCsv.js";
import { sendPayPeriodCsvToTrustedSheet } from "./sendPayPeriodCsvToTrustedSheet.js";

function loadSavedTrustedSheetWebAppUrl() {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.TRUSTED_SHEET_WEB_APP_URL) || "";
  } catch {
    return "";
  }
}

function saveTrustedSheetWebAppUrl(webAppUrl) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.TRUSTED_SHEET_WEB_APP_URL, webAppUrl);
  } catch {
    // Sending can continue even if saving the URL fails.
  }
}

export default function SendPayPeriodCsvToTrustedSheetButton() {
  const [sendStatus, setSendStatus] = useState("");

  async function sendCsvToTrustedSheet() {
    setSendStatus("");

    const savedWebAppUrl = loadSavedTrustedSheetWebAppUrl();
    const webAppUrl = window.prompt(
      "Paste the Trusted Sheet web app URL. Use the deployed Apps Script /exec URL. This URL can be saved on this device. The token will not be saved.",
      savedWebAppUrl
    );

    if (!webAppUrl) {
      setSendStatus("Send canceled. No Trusted Sheet web app URL was provided.");
      return;
    }

    const trimmedWebAppUrl = webAppUrl.trim();

    if (!trimmedWebAppUrl) {
      setSendStatus("Send canceled. No Trusted Sheet web app URL was provided.");
      return;
    }

    saveTrustedSheetWebAppUrl(trimmedWebAppUrl);

    const importToken = window.prompt(
      "Paste the Trusted Sheet import token. For safety, this token is not saved."
    );

    if (!importToken) {
      setSendStatus("Send canceled. No Trusted Sheet import token was provided.");
      return;
    }

    const confirmed = window.confirm(
      "Send the current FieldLedger pay-period CSV to the Trusted Sheet?"
    );

    if (!confirmed) {
      setSendStatus("Send canceled. Trusted Sheet was not changed.");
      return;
    }

    const payPeriod = loadActivePayPeriod();
    const csvText = buildPayPeriodCsv(payPeriod);

    setSendStatus("Sending CSV to Trusted Sheet...");

    const result = await sendPayPeriodCsvToTrustedSheet({
      webAppUrl: trimmedWebAppUrl,
      importToken,
      csvText,
    });

    setSendStatus(result.message);
  }

  return (
    <div className="export-action-group">
      <button type="button" onClick={sendCsvToTrustedSheet}>
        Send to Trusted Sheet
      </button>

      <p className="helper">
        Sends the current CSV to your trusted Sheet. Use the deployed Apps Script
        /exec Web App URL. The Web App URL is saved on this device, but the
        import token is never saved.
      </p>

      <p className="helper">
        Phone, laptop, and desktop browser data are separate. If this device has
        no saved jobs, restore a JSON backup here before sending.
      </p>

      {sendStatus ? <p className="helper">{sendStatus}</p> : null}
    </div>
  );
}
