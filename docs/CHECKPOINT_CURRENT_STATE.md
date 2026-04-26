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
- Core contract docs have been cleaned.

## Recent Commits

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
- 5773f46 Update checkpoint after contract cleanup
- 05f53c0 Add save time validation
- 222bf37 Add pay period ids to saved records
- 718bdb8 Clean core contract docs
- 877b916 Use saved tax rates in summary

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

673e5c0 Add JSON backup restore

## Known MVP Gaps

- Receipt photo attachment/storage is built for expenses using IndexedDB blob storage and receiptPhotoId references.
- Ticket photo attachment/storage is built for jobs using IndexedDB blob storage and ticketPhotoId references.
- JSON backup and spreadsheet CSV export exist, but PDF export is not built yet.
- Receipt photo preview works from IndexedDB when editing saved expenses.

## Recommended Next Feature

Improve photo replace/delete behavior, or start PDF/printable report export.

Best next contract-safe move:

Next likely step: improve photo replace/delete behavior, or start PDF/printable report export.
