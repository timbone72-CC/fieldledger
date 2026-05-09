# FieldLedger Sheets Integration Contract

## 1. Purpose

This contract protects the paired workflow between FieldLedger and Google Sheets.

FieldLedger is the local app for entering, reviewing, saving, and exporting pay-period records.

Google Sheets is the paired spreadsheet system for importing FieldLedger CSV exports into the formatted timesheet workflow.

## 2. Paired-System Boundary

The supported workflow is:

FieldLedger App
→ CSV Export
→ Google Sheets RawData tab
→ helper sheets
→ Timesheet tab

FieldLedger must not silently change CSV behavior in a way that breaks the Google Sheets pipeline.

Google Sheets must not assume fields that are not included in the FieldLedger CSV contract.

## 3. Authority

This contract is the authority for FieldLedger-to-Google-Sheets integration.

If this contract conflicts with checkpoint notes, this contract wins.

Checkpoint notes are history and evidence.

This contract defines current required behavior.

## 4. Current Integration Status

Current integration method:

- manual CSV export from FieldLedger
- manual or scripted CSV import into Google Sheets RawData

The app does not currently require direct Google Sheets API access.

The app does not require a backend, login, paid service, AI, or OCR for this integration.

## 5. Change-Control Rule

Any change touching CSV export columns, column order, job pay semantics, job type names, or pay-period metadata must be treated as a paired-system change.

A paired-system change requires:

- contract review
- app export validation
- Google Sheets RawData compatibility check
- Timesheet output check
- checkpoint update after verification

## 6. No Silent Interface Changes

Do not silently rename, remove, reorder, or change the meaning of CSV columns used by Google Sheets.

If a breaking change is unavoidable, it must be documented with:

- reason for change
- old behavior
- new behavior
- migration note
- validation result

## 7. CSV Schema Authority

The Google Sheets workflow depends on a stable CSV schema exported by FieldLedger.

The CSV contract must define:

- exact column names
- exact column order
- required fields
- optional fields
- semantic meaning of each field

Google Sheets formulas, helper sheets, filters, validations, and Timesheet formatting may depend on this schema.

CSV schema changes must not be treated as local app-only changes.

## 8. Locked CSV Behavior

The following behaviors are contract-locked unless formally changed through paired-system review:

- CSV column order
- CSV column names
- job type names
- Bucking calculation semantics
- Torque Turn calculation semantics
- transportation handling
- pay-period metadata fields

Blank values used intentionally by one job type must remain predictable for Google Sheets formulas.

## 9. Column Semantics Rule

CSV fields must preserve consistent meaning.

Examples:

- "Hours Worked" must not silently change meaning between exports.
- Torque Turn extra-hour behavior must remain compatible with downstream formulas.
- Gross earnings fields must not include expense deductions.
- Transportation must not become earnings.

If a field meaning changes, the integration contract must be updated first.

## 10. RawData Authority

The RawData tab is the ingestion layer for FieldLedger CSV imports.

RawData must remain compatible with the locked CSV schema.

RawData should be treated as imported operational data, not a manually reformatted report.

The RawData tab must not require hidden manual cleanup steps after normal CSV import.

## 11. Helper Sheet Rule

Helper sheets may derive values from RawData for:

- company lists
- rig lists
- dropdown values
- formatting support
- Timesheet support

Helper sheets must not silently rewrite the meaning of imported FieldLedger data.

Helper sheets must remain compatible with both:

- Bucking jobs
- Torque Turn jobs

## 12. Timesheet Template Boundary

The Timesheet tab is the formatted operational output layer.

Protected Timesheet template areas must not be silently shifted by import behavior.

Current protected operational range:

- Timesheet rows 12–38

Formula repairs or formatting fixes must preserve:

- Bucking behavior
- Torque Turn behavior
- totals
- print formatting

## 13. Manual Review Rule

The Google Sheets workflow remains manual-review-first.

Importing CSV data into Google Sheets does not remove the requirement for human review before operational use.

FieldLedger exports and Google Sheets outputs must remain reviewable and editable by the user.

## 14. Definition of Done for Paired-System Changes

A paired-system change is not complete until all affected layers are verified.

Required verification may include:

- CSV export validation
- RawData import validation
- helper-sheet validation
- Timesheet validation
- Bucking workflow validation
- Torque Turn workflow validation
- totals validation
- print/export validation
- checkpoint update
- live rebuild verification when applicable

A change is not considered complete only because the app locally works.

## 15. Validation Rule

Paired-system validation must verify that:

- CSV exports still import correctly
- formulas still calculate correctly
- totals still match expected values
- helper sheets still populate correctly
- Timesheet formatting remains stable
- Bucking jobs remain correct
- Torque Turn jobs remain correct

Validation should prefer real exported CSV samples when possible.

## 16. Offline-First Rule

The FieldLedger ↔ Google Sheets workflow must remain usable without requiring:

- paid APIs
- required backend services
- required AI services
- required OCR services
- required cloud databases

Manual CSV export/import remains a supported workflow.

## 17. Contract Priority Rule

This contract works together with:

- FIELDLEDGER_EXPORT_CONTRACT.md
- FIELDLEDGER_PAY_CONTRACT.md
- FIELDLEDGER_PRODUCT_ROADMAP_CONTRACT.md
- CHECKPOINT_CURRENT_STATE.md

If operational workflow behavior conflicts with historical notes or assumptions, the active contracts control the system behavior.
