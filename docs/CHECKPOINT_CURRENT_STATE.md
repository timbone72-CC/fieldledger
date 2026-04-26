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
- Core contract docs have been cleaned.

## Recent Commits

- 2f3f2c9 Add receipt photo preview to expense form
- 2801e64 Add IndexedDB photo blob storage helper
- 2f3f2c9 Add receipt photo preview to expense form
- 05f53c0 Add save time validation
- 222bf37 Add pay period ids to saved records
- 718bdb8 Clean core contract docs
- 877b916 Use saved tax rates in summary
- ded182b Use saved hourly rate for new jobs
- e0e0a0e Add settings tab
- 36db8c1 Add settings storage

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

2f3f2c9 Add receipt photo preview to expense form

## Known MVP Gaps

- Receipt photo attachment/storage is built for expenses using IndexedDB blob storage and receiptPhotoId references.
- Real ticket photo upload/storage is not built yet.
- JSON backup exists, but PDF/spreadsheet exports are not built yet.
- Receipt photo preview works from IndexedDB when editing saved expenses.

## Recommended Next Feature

Add ticket photo attachment/storage for job records, or improve receipt photo delete/replace behavior.

Best next contract-safe move:

Next likely step: add ticket photo attachment/storage for job records, or improve receipt photo delete/replace behavior.
