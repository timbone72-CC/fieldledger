# FieldLedger Current State Checkpoint

## Current Head

0fc6852 Add edit selected mileage entries

## Recent Commits

0fc6852 Add edit selected mileage entries
2d15855 Add mileage save validation
75910cc Add delete selected mileage entries
95223b3 Display saved mileage entries
061b92c Add contract-aligned mileage save
5bf3989 Fix mileage contract formatting
0927a9b Update mileage contract and fix duplicate import
4dbf46d Add saved mileage placeholder
007f5e3 Add mileage tab
bdb9cc2 Add mileage entry form placeholder

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
