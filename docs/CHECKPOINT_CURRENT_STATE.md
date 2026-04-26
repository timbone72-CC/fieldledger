# FieldLedger Current State Checkpoint

## Confirmed Working

- React/Vite app runs locally.
- Dashboard / Jobs / Expenses tabs work.
- Manual pay period info saves locally.
- Bucking job entries save locally.
- Torque Turn job entries save locally.
- Saved jobs can be deleted.
- Saved jobs can be edited.
- Expense entries save locally.
- Saved expenses can be selected with checkboxes.
- Selected expenses can be deleted.
- Saved expenses can be edited.
- Saved jobs list displays saved jobs.
- Saved expenses list displays saved expenses.
- Pay period summary calculates from saved local data.
- Rough tax estimate calculates from saved local data.
- Clear pay period resets saved local data.
- JSON backup download exports the active pay period.

## Recent Commits

- 12c0ba7 Add saved expense edit action
- 93cb6ab Add saved job edit action
- 7b581f5 Add dashboard jobs expenses tabs
- c976179 Add selected expense delete action
- 709c66e Add saved job delete action

## Storage

Active pay period localStorage key:

fieldledger.activePayPeriod

## Core Tests

Confirmed passing:

- calculateJobPay tests passed
- calculatePayPeriodSummary tests passed
- calculateTaxEstimate tests passed

## Current Good Rollback Point

Current branch:

main

Current head:

12c0ba7 Add saved expense edit action

## Recommended Next Feature

Add Settings tab for editable hourly rate and tax estimate rates.

Reason:

Hourly rate and tax rates are currently hardcoded/defaulted. Contracts say these settings must be user-controlled, but old saved jobs must keep their hourly rate snapshot.
