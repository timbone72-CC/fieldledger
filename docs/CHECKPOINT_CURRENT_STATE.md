# FieldLedger Current State Checkpoint

## Current Head

0cef6f0 Add Bucking state default hours

## Recent Commits

0cef6f0 Add Bucking state default hours
7c5f3ee Fix Bucking pay contract formatting
673e120 Update Bucking pay contract for state defaults
27867d1 Update checkpoint after GitHub Pages phone link
9b7867b Add GitHub Pages build output
a90ea2d Configure Vite for GitHub Pages
df16cb6 Update checkpoint after milestone audit
2e47a4e Update checkpoint after photo remove buttons

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

## Locked Rules

- MVP remains offline-first.
- MVP remains AI-free.
- MVP remains net-zero-cost.
- Manual review is required before saving.
- Bucking pay = hoursWorked × hourlyRateSnapshot.
- Torque Turn pay = baseJobPay + max(totalJobHours - 24, 0) × hourlyRateSnapshot.
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
