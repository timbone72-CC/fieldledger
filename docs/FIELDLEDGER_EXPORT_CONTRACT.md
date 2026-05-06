# FieldLedger Export Contract

## 1. Purpose

This contract controls FieldLedger download and export behavior.

No CSV, PDF, spreadsheet, report, backup, or download feature may be added or changed unless it follows this contract.

## 2. Export Categories

FieldLedger supports different export purposes.

### 2.1 Company Timesheet CSV

The Company Timesheet CSV is a narrow submission-style export.

For MVP, this CSV may match the required company timesheet format instead of including every FieldLedger recordkeeping field.

The current MVP CSV is allowed to focus on:

- Date
- Company
- Rig Name/Number
- Field Ticket Number
- Day Rate
- Hours Worked
- Transportation
- Total
- Grand Total

The Company Timesheet CSV does not need to include expenses, mileage, tax estimates, or full planning summaries unless the company submission format requires them.

### 2.2 Full FieldLedger Record Export

A full FieldLedger record export is for backup, review, reporting, and 1099 planning.

This export should include:

- pay period metadata
- jobs
- expenses
- mileage
- summaries
- tax planning estimates
- tax disclaimer

This may be implemented as JSON, printable report, PDF, spreadsheet, or another full-record format.

### 2.3 Future Production Spreadsheet Export

A future production spreadsheet export may include more detailed FieldLedger data than the MVP Company Timesheet CSV.

This is production-phase scope, not required for the current MVP CSV.

## 3. Source of Truth Rule

Exports must be generated from saved pay-period data.

Exports must not calculate from unsaved form values.

## 4. Company Timesheet CSV Rule

The MVP Company Timesheet CSV may intentionally hide FieldLedger-only fields if those fields do not belong on the company-facing timesheet.

Examples of fields that may be excluded from the company timesheet CSV:

- expenses
- mileage
- tax estimates
- internal notes
- photo IDs
- backup metadata

## 5. Full Record Export Fields

A full FieldLedger record export should include enough information for job review, expense review, mileage review, backup, restore, and 1099 planning.

Full record exports should include:

- app name
- pay period label
- pay period start date
- pay period end date
- generated date
- job rows
- expense rows
- mileage rows
- gross earnings
- expense total
- net income
- estimated tax fields when shown
- tax disclaimer when tax estimates are shown

## 6. Tax Disclaimer Rule

Every export that includes a tax estimate must include this meaning:

Tax estimates are for planning only and are not tax advice.

## 7. Offline Rule

MVP exports must not require a paid service.

MVP exports should work locally from browser data.

## 8. File Naming Rule

Export filenames should include:

- FieldLedger
- pay period label or date range
- export type

The exact filename style may differ by export category.

## 9. MVP Boundary

The MVP export system does not require:

- cloud storage
- paid PDF service
- paid spreadsheet service
- user accounts
- AI
- OCR

## 10. Production Boundary

Production exports may later add:

- detailed spreadsheet workbooks
- separate company/customer templates
- expanded CSV options
- richer reporting
- stronger export configuration

These are not required for MVP completion.
