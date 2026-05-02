# FieldLedger Current State Checkpoint

## Current Head

e58bf8f Add transportation to job tickets

## Recent Commits

e58bf8f Add transportation to job tickets
f6a6f16 Add field ticket number to job tickets
1219873 Add timesheet company autofill and fix saved jobs preview loop
debbfde Add company field to job tickets
3b54a0b Align CSV export with Legend timesheet and add job date
ec4a7a5 Rebuild GitHub Pages after mileage tracking
d0b762d Update checkpoint after mileage tracking milestone
0fc6852 Add edit selected mileage entries

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
- Mileage entries save, display, edit, and delete.
- Saved jobs list works.
- Saved expenses list works.
- Pay period summary works.
- Tax estimate works.
- Clear pay period works.
- JSON backup download works.
- Receipt/ticket photo attach, preview, and remove support exists.
- Company field saves on job tickets.
- Rig Name/Number field saves on job tickets.
- Field Ticket Number saves on job tickets.
- Transportation saves on job tickets.
- Company field supports default suggestions and manual typing.
- CSV export now matches the visible Legend Energy timesheet columns:
  - Date
  - Company
  - Rig Name/Number
  - Field Ticket Number
  - Day Rate
  - Hours Worked
  - Transportation
  - Total
- Verified CSV row:
  - 2026-05-01, Exxon Mobile, Scan Vision, 12345, blank day rate, 6 hours, 150 transportation, 168 total.
- Saved jobs preview loop was fixed.
- Core calculation tests pass.

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
- Export visible fields must mimic the submitted Legend Energy timesheet first.
- Extra FieldLedger-only data should stay hidden or secondary in the timesheet export.

## Latest Manual Browser Test

Legend timesheet CSV export passed:

- Date: 2026-05-01
- Company: Exxon Mobile
- Rig Name/Number: Scan Vision
- Field Ticket Number: 12345
- Transportation: 150
- Bucking jobs completed: 1
- Hours Worked: 6
- Total: 168

Exported CSV row confirmed:

2026-05-01,Exxon Mobile,Scan Vision,12345,,6,150,168

## Next Recommended Move

Run a milestone audit before adding the next feature.

## Tracked TODO

- Decide whether Rig Name/Number should use autofill with manual typing like Company.
- Add future way to manage saved company and rig suggestion lists.
- Review printable report layout against the Legend Energy timesheet.
- Verify JSON backup/import preserves new job ticket fields.
- Verify CSV export behavior for Torque Turn jobs.
- Clean old generated docs/assets files if needed after build churn.
