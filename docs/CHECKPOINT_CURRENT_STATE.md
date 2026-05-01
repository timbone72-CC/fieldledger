# FieldLedger Current State Checkpoint

## Current Head

87294f5 Rebuild GitHub Pages after Torque Turn and tax updates

## Recent Commits

87294f5 Rebuild GitHub Pages after Torque Turn and tax updates
b6aa6e7 Clean up Torque Turn additional hours wording in contracts
9f2b8b8 Update checkpoint after Torque Turn fix and state tax feature
b1cd512 Add state tax to tax contract and total tax calculation
155626e Add state tax rate to settings UI
5ee4257 Add state tax rate support to tax estimate (Oklahoma default 4.5%)
bf23730 Clean up tax rate display in settings
b2b9dac Fix summary test and CSV export for Torque Turn additional hours
5c16f0f Fix Torque Turn pay contract for additional hours
e4a804f Fix Torque Turn pay: use additional hours after 24 and update UI field

## Confirmed Working State

- React/Vite app runs locally.
- Manual pay period info saves locally.
- Bucking jobs save locally.
- Bucking jobs support state-based default hours:
  - Texas defaults to 6 hours per job.
  - New Mexico defaults to 8 hours per job.
  - Hours Worked remains manually editable before saving.
- Torque Turn jobs save locally.
- Expenses save locally.
- Saved jobs list works.
- Saved expenses list works.
- Pay period summary works.
- Tax estimate works.
- Clear pay period works.
- JSON backup download works.
- Receipt/ticket photo attach, preview, and remove support exists.
- Core calculation tests pass.
- JSON backup includes buckingState, jobsCompleted, hoursPerJob, hoursWorked, hourlyRateSnapshot, and totalPay.
- Print preview includes the saved Bucking breakdown because it prints the current page.
- CSV export includes Bucking State, Jobs Completed, Hours Per Job, Hours, Hourly Rate, and Amount.
- Saved Jobs list shows Bucking breakdown with state, jobs completed, hours per job, and final hours worked.

## Locked Rules

- MVP remains offline-first.
- MVP remains AI-free.
- MVP remains net-zero-cost.
- Manual review is required before saving.
- Bucking pay = hoursWorked × hourlyRateSnapshot.
- Torque Turn pay = baseJobPay + additionalHours × hourlyRateSnapshot.
- Expenses reduce net income but do not change gross earnings.
- Tax estimates are planning only, not tax advice.
- Structured records use localStorage.
- Large photo/blob storage uses IndexedDB.
- Saved records store photo IDs by reference, not image blobs.

## Latest Manual Browser Test

Bucking default-hours behavior passed:

- Texas, 1 job, 6 hours, $28/hour = $168.00.
- Texas, 2 jobs, 12 hours, $28/hour = $336.00.
- New Mexico, 2 jobs, 16 hours, $28/hour = $448.00.
- Manual override to 7 hours, $28/hour = $196.00.

## Next Recommended Move

Run a milestone audit before adding the next feature.

## Tracked TODO

- Add clean printable report layout:
  - Hide tabs, buttons, forms, export controls, file inputs, and empty entry fields.
  - Show only report title, pay period info, saved jobs, saved expenses, summary, and tax disclaimer.
