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
 * This component does not store the import token.
 * The user must provide the web app URL and token before sending.
 *
 * 01.03 Boundary:
 * This keeps the existing Download Spreadsheet CSV flow unchanged.
 * =========================================================
 */

import { useState } from "react";
import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { buildPayPeriodCsv } from "./payPeriodCsv.js";
import { sendPayPeriodCsvToTrustedSheet } from "./sendPayPeriodCsvToTrustedSheet.js";

export default function SendPayPeriodCsvToTrustedSheetButton() {
  const [sendStatus, setSendStatus] = useState("");

  async function sendCsvToTrustedSheet() {
    setSendStatus("");

    const webAppUrl = window.prompt("Paste the Trusted Sheet web app URL:");

    if (!webAppUrl) {
      setSendStatus("Send canceled. No Trusted Sheet web app URL was provided.");
      return;
    }

    const importToken = window.prompt("Paste the Trusted Sheet import token:");

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
      webAppUrl,
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

      {sendStatus ? <p className="helper">{sendStatus}</p> : null}
    </div>
  );
}
