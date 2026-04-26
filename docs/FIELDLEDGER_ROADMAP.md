Next step only — create the roadmap.

Inside the docs folder, create a new file named:

FIELDLEDGER_ROADMAP.md

Paste this into it:

# FieldLedger Roadmap

## 1. Purpose

This roadmap defines the build order for FieldLedger.

The goal is to prevent feature drift by building the app in small, contract-controlled phases.

## 2. Build Rules

- No major feature should be built before its contract exists.
- Each phase must be tested before moving forward.
- Each stable phase must be committed to Git.
- MVP must stay offline-first.
- MVP must stay AI-free.
- MVP must stay net zero cost.
- Manual review is required before saving job or receipt records.

## 3. Phase 0 — Project Authority

Goal: create the rules before expanding the app.

Files:

- docs/FIELDLEDGER_MASTER_CONTRACT.md
- docs/FIELDLEDGER_FOLDER_CONTRACT.md
- docs/FIELDLEDGER_SYSTEM_MAP.md
- docs/FIELDLEDGER_ROADMAP.md

Status: in progress

Exit requirement:

- All four files exist.
- Git sees the docs.
- Docs are committed.

## 4. Phase 1 — Pay Contracts

Goal: lock pay logic before adding more calculator code.

Files:

- docs/FIELDLEDGER_PAY_CONTRACT.md

Must define:

- Bucking pay
- Torque Turn pay
- hourly rate snapshots
- hours beyond 24 rule
- gross earnings
- pay-period job totals

Exit requirement:

- Pay rules are written.
- Pay rules match app calculations.

## 5. Phase 2 — Expense Contracts

Goal: lock receipt and expense behavior.

Files:

- docs/FIELDLEDGER_EXPENSE_CONTRACT.md

Must define:

- receipt fields
- expense categories
- manual entry rules
- photo attachment rules
- expense totals
- net income calculation

Exit requirement:

- Expense rules are written.
- Expense categories are locked for MVP.

## 6. Phase 3 — Ticket Entry Contracts

Goal: define job ticket fields before adding ticket screens.

Files:

- docs/FIELDLEDGER_TICKET_CONTRACT.md

Must define:

- required ticket fields
- manual entry fields
- photo attachment behavior
- Bucking ticket behavior
- Torque Turn ticket behavior
- review-before-save behavior

Exit requirement:

- Ticket entry rules are written.
- Required fields are locked.

## 7. Phase 4 — Export Contracts

Goal: define download behavior before creating reports.

Files:

- docs/FIELDLEDGER_EXPORT_CONTRACT.md

Must define:

- PDF export
- spreadsheet export
- pay-period summary output
- job rows
- receipt rows
- tax disclaimer output

Exit requirement:

- Export fields are written.
- Export format is locked.

## 8. Phase 5 — App Folder Structure

Goal: create the real feature folders.

Folders:

- src/features/pay-periods/
- src/features/jobs/
- src/features/receipts/
- src/features/expenses/
- src/features/settings/
- src/shared/utils/
- src/shared/storage/
- src/shared/constants/

Exit requirement:

- Folders exist.
- No feature logic is misplaced.

## 9. Phase 6 — Manual Pay Period MVP

Goal: build the first useful local version.

Must include:

- create pay period
- set hourly rate
- add Bucking job manually
- add Torque Turn job manually
- calculate gross earnings
- show pay-period totals

Exit requirement:

- User can enter jobs manually.
- Bucking and Torque Turn calculations work.
- Data stays local.

## 10. Phase 7 — Receipt Expense MVP

Goal: add manual receipt and expense tracking.

Must include:

- add receipt manually
- choose category
- enter amount
- attach receipt photo later
- calculate expense total
- calculate net income

Exit requirement:

- User can enter expenses.
- Expense total subtracts from gross earnings.

## 11. Phase 8 — Rough Tax Estimate

Goal: add planning-only tax estimate.

Must include:

- self-employment tax rate setting
- federal tax rate setting
- estimated tax from net income
- clear disclaimer

Exit requirement:

- Tax estimate displays correctly.
- App labels it as planning only.

## 12. Phase 9 — Photo Capture

Goal: take ticket and receipt photos inside the app.

Must include:

- take ticket photo
- take receipt photo
- preview photo
- save photo with record
- allow manual entry after photo

Exit requirement:

- Camera works on phone browser.
- Records can keep photo references locally.

## 13. Phase 10 — Downloads

Goal: export pay-period records.

Must include:

- PDF download
- spreadsheet download
- job rows
- receipt rows
- summary totals
- tax disclaimer

Exit requirement:

- User can download a pay-period report.

## 14. Phase 11 — GitHub Transfer

Goal: make project portable to laptop.

Must include:

- create GitHub repo
- push local repo
- clone on laptop
- verify app runs on laptop

Exit requirement:

- App can move between PC and laptop through GitHub.

## 15. Future Phase — Optional OCR

Goal: explore handwriting extraction later.

Rules:

- OCR must be optional.
- OCR must not be required for MVP.
- OCR must not create monthly cost unless approved.
- OCR results must always be reviewed before saving.

Status: future only