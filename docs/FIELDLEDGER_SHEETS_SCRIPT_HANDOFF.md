# FieldLedger Sheets Script Handoff

## 1. Purpose

This document records the current status of the Google Sheets / Apps Script side of the FieldLedger workflow.

## 2. Current Status

The FieldLedger repo currently contains the Sheets integration contract, but it does not contain the actual Google Apps Script source code.

Current repo evidence:

- `docs/FIELDLEDGER_SHEETS_INTEGRATION_CONTRACT.md` exists.
- No `.gs` Apps Script source files exist in the repo.
- No repo-owned Sheets script implementation file has been verified.

## 3. Current Boundary

The repo can currently govern the Sheets workflow by contract only.

The repo cannot yet directly test or patch Apps Script behavior because the Apps Script source is not present in the repo.

## 4. Required Future Handoff

Before Apps Script behavior can be audited or changed from this repo, the current Google Sheets Apps Script code must be copied into a repo-controlled file.

Recommended future path:

```text
google-sheets/apps-script/Code.gs
```

## 5. Required Verification After Script Import

After the Apps Script source is added to the repo, verify it against the Sheets integration contract for:

- Timesheet governed boundary rows 12–38 and total row H39
- no writes below row 39
- safe formula/validation repair scope
- malformed CSV import failure safety
- schedule generation idempotency
- calendar sync idempotency
- LEG Work Calendar targeting
- no mutation of FieldLedger app source data

## 6. Current Decision

No Apps Script edits are being made in this repo yet.

This is a handoff marker only.
