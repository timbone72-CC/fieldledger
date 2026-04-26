# FieldLedger Export Contract
1. Purpose

This contract controls FieldLedger download and export behavior.

No PDF, spreadsheet, report, or download feature may be added or changed unless it follows this contract.

2. Export Scope

Exports are generated from a selected pay period.

Exports must include enough information for job review, expense review, and 1099 planning.

3. Required Export Types

The app should support:

PDF export
Spreadsheet export

The MVP may build one export type first, but both are part of the product goal.

4. Pay Period Header Fields

Each export must include:

app name
pay period label
pay period start date
pay period end date
generated date
tax disclaimer
5. Job Row Fields

Job rows should include:

date
job type
company
rig name or number
field ticket number
hours worked
base job pay
extra hours
hourly rate snapshot
transportation
total pay
notes
6. Expense Row Fields

Expense rows should include:

date
vendor
category
amount
notes
7. Summary Fields

Exports must include:

gross earnings
expense total
net income
estimated self-employment tax
estimated federal tax
estimated total tax
estimated take-home after tax
8. Tax Disclaimer Rule

Every export that includes a tax estimate must include this meaning:

Tax estimates are for planning only and are not tax advice.
9. Source of Truth Rule

Exports must be generated from saved pay-period data.

Exports must not calculate from unsaved form values.

10. Offline Rule

MVP exports must not require a paid service.

MVP exports should work locally from browser data.

11. File Naming Rule

Export filenames should include:

FieldLedger
pay period label or date range
export type

Example:

FieldLedger_2026-04-01_to_2026-04-15.pdf
12. MVP Boundary

The MVP export system does not require:

cloud storage
paid PDF service
paid spreadsheet service
user accounts
AI
OCR