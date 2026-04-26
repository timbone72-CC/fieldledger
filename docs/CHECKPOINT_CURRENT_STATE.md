# FieldLedger Current State Checkpoint

## Confirmed Working

- React/Vite app runs locally.
- Manual pay period info saves locally.
- Bucking job entries save locally.
- Torque Turn job entries save locally.
- Expense entries save locally.
- Saved jobs list displays saved jobs.
- Saved expenses list displays saved expenses.
- Pay period summary calculates from saved local data.
- Rough tax estimate calculates from saved local data.
- Clear pay period resets saved local data.
- JSON backup download exports the active pay period.
- Core calculation tests pass.

## Confirmed Tests

- calculateJobPay tests passed
- calculatePayPeriodSummary tests passed
- calculateTaxEstimate tests passed

## Current Storage

The app currently saves the active pay period in browser localStorage under:

fieldledger.activePayPeriod

## Next Safe Feature Options

- Add receipt photo attachment.
- Add ticket photo attachment.
- Add edit/delete saved job.
- Add edit/delete saved expense.
- Add spreadsheet export.
- Add PDF export.
