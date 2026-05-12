# FieldLedger Sheets Script Handoff

## 1. Purpose

This document records the current status of the Google Sheets / Apps Script side of the FieldLedger workflow.

## 2. Current Status

The FieldLedger repo now contains the current Google Apps Script source code.

Current repo evidence:

- docs/FIELDLEDGER_SHEETS_INTEGRATION_CONTRACT.md exists.
- google-sheets/apps-script/Code.gs exists.
- Apps Script behavior can now be audited, patched, syntax-checked locally as JavaScript, copied into Google Apps Script, and manually tested in a Sheet copy.

## 3. Current Script Source

The repo-controlled script source is:

google-sheets/apps-script/Code.gs

Google Apps Script remains the runtime.

The repo file is the controlled source for review and patching, but script changes must still be copied into the Google Apps Script editor and saved before they affect the live/test Sheet.

## 4. Current Verified Behavior

Confirmed behavior after script import and recovery hardening:

- CSV import writes FieldLedger CSV rows into RawData.
- Exported summary rows such as Grand Total are ignored during RawData import.
- Malformed CSV imports fail before RawData is replaced.
- RawData replacement snapshots the previous RawData contents into _FieldLedger_RawData_Backup before clearing and writing.
- If RawData replacement fails during write, the prior RawData contents are restored from backup.
- Helper sheets can refresh from RawData.
- Timesheet formulas and validations are repaired only inside the governed rows 12–38.
- Timesheet total row H39 is governed.
- Schedule generation skips duplicate pending rows.
- Calendar sync targets LEG Work Calendar.
- Calendar sync skips valid already-synced rows.
- Calendar sync marks rows as Missing calendar event when a stored event ID no longer exists in LEG Work Calendar.

## 5. Current Boundary

FieldLedger app data remains authoritative.

Google Sheets remains a downstream operational/reporting layer.

LEG Work Calendar remains a downstream visualization layer.

Calendar sync must not mutate FieldLedger app source data.

## 6. Local Verification Commands

Before committing Apps Script changes, run:

cp google-sheets/apps-script/Code.gs /tmp/fieldledger-Code-check.js
node --check /tmp/fieldledger-Code-check.js
git diff --check

Expected:

- no syntax error
- no whitespace errors

## 7. Manual Sheet Verification

After copying Code.gs into Google Apps Script and saving it, verify changes in a test Sheet copy before using them in the working Sheet.

Current manual checks:

- Import a valid FieldLedger CSV.
- Confirm RawData updates.
- Confirm _FieldLedger_RawData_Backup is created and hidden.
- Confirm exported Grand Total rows do not break import.
- Run schedule generation twice and confirm duplicates are skipped.
- Run calendar sync and confirm already-synced rows do not duplicate events.
- If testing deleted events, confirm stale event IDs are marked Missing calendar event.

## 8. Current Decision

Apps Script is now repo-controlled for audit and patching.

Future script changes should be small, contract-first, syntax-checked locally, manually tested in a Sheet copy, committed, pushed, and reflected in CHECKPOINT_CURRENT_STATE.md.
