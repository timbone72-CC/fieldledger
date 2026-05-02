# FieldLedger Current State Checkpoint

## Current Head

4e277f0 Remove old GitHub Pages build assets

## Recent Commits

4e277f0 Remove old GitHub Pages build assets
0d39306 Add mileage summary and backup-before-clear
9d75a86 Update checkpoint after reload cleanup
b715a23 Refresh mileage data without page reload
6064b3c Refresh expense data without page reload
31155f5 Refresh job deletion without page reload
1d0434d Update checkpoint after integrity cleanup
1ded66c Normalize active pay period storage

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
- Pay period summary shows business miles and mileage estimate.
- Tax estimate works.
- Clear pay period downloads a full JSON backup before confirmation.
- Clear pay period cancel keeps data visible.
- JSON backup download works.
- Receipt/ticket photo attach, preview, and remove support exists.
- Company field saves on job tickets.
- Rig Name/Number field saves on job tickets.
- Field Ticket Number saves on job tickets.
- Transportation saves on job tickets as a numeric value.
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
- Job save/delete no longer uses a full page reload.
- Expense save/delete no longer uses a full page reload.
- Mileage save/delete no longer uses a full page reload.
- Active pay period storage normalizes missing or old data shape fields.
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

Continue integration + integrity cleanup before adding new features.

## Tracked TODO

- Decide whether Rig Name/Number should use autofill with manual typing like Company.
- Add future way to manage saved company and rig suggestion lists.
- Review printable report layout against the Legend Energy timesheet.
- Verify JSON backup/import preserves new job ticket fields.
- Verify CSV export behavior for Torque Turn jobs.
- Clean old generated docs/assets files if needed after build churn.
