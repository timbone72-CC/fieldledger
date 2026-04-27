# FieldLedger Current State Checkpoint

## Confirmed Working

- React/Vite app runs locally.
- Dashboard / Jobs / Expenses / Settings tabs work.
- Manual pay period info saves locally.
- Bucking job entries save locally.
- Torque Turn job entries save locally.
- New saved jobs include payPeriodId.
- New saved jobs include ticketPhotoId placeholder.
- Saved jobs can be deleted.
- Saved jobs can be edited.
- Expense entries save locally.
- New saved expenses include payPeriodId.
- New saved expenses include receiptPhotoId placeholder.
- Saved expenses can be selected with checkboxes.
- Selected expenses can be deleted.
- Saved expenses can be edited.
- Save-time validation blocks negative job hours/pay values.
- Save-time validation blocks negative expense amounts.
- Saved jobs list displays saved jobs.
- Saved expenses list displays saved expenses.
- Pay period summary calculates from saved local data.
- Rough tax estimate uses saved settings.
- Settings save default hourly rate and tax rates.
- Clear pay period resets saved local data.
- JSON backup download exports the active pay period.
- JSON backup import restores a valid FieldLedger pay period after confirmation.
- Spreadsheet CSV download exports saved pay-period jobs and expenses.
- Export / Backup dropdown appears near the top of the dashboard.
- Production build passed.
- Milestone audit passed with no blocking issues.
- JSON backup restore imports a valid backup after confirmation.
- Print / Save PDF Report opens the browser print dialog.
- Core contract docs have been cleaned.

## Recent Commits

- 2e47a4e Update checkpoint after photo remove buttons
- ef5d982 Add ticket photo remove button
- 0e20985 Add receipt photo remove button
- c8043fe Add printable pay period report button
- d47e08d Update checkpoint after JSON backup restore
- 673e5c0 Add JSON backup restore
- fbd68fa Update checkpoint after spreadsheet CSV export
- b764c45 Add spreadsheet CSV export dropdown
- 42b164b Update checkpoint after ticket photo storage
- bd2e872 Add ticket photo preview to job form
- 5722c2e Update checkpoint after receipt photo storage
- 2f3f2c9 Add receipt photo preview to expense form
- 2801e64 Add IndexedDB photo blob storage helper
- f018777 Update checkpoint after photo placeholders
- a1d3384 Add photo id placeholders to saved records

## Storage

Active pay period localStorage key:

fieldledger.activePayPeriod

Settings localStorage key:

fieldledger.settings

## Core Tests

Confirmed passing:

- calculateJobPay tests passed
- calculatePayPeriodSummary tests passed
- calculateTaxEstimate tests passed

## Current Good Rollback Point

Current branch:

main

Current head:

2e47a4e Update checkpoint after photo remove buttons

## Known MVP Gaps

- Receipt photo attachment/storage is built for expenses using IndexedDB blob storage and receiptPhotoId references.
- Ticket photo attachment/storage is built for jobs using IndexedDB blob storage and ticketPhotoId references.
- JSON backup and spreadsheet CSV export exist, but PDF export is not built yet.
- Receipt photo preview works from IndexedDB when editing saved expenses.
- Receipt photos can be removed from saved expenses.
- Ticket photos can be removed from saved jobs.

## Recommended Next Feature

Run final contract audit before more feature work.

Best next contract-safe move:

Next likely step: continue remaining MVP work, then run final audit when feature-complete.
