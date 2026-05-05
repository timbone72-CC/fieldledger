# FieldLedger Current State Checkpoint

## Current Head

92619c6 Update checkpoint after mileage print + JSON validation integration

## Recent Commits

92619c6 Update checkpoint after mileage print + JSON validation integration
a4c8d53 Add mileage summary to printable report and rebuild assets
50b50d1 Require mileage entries in JSON backup validation
7c48e9b Improve print full report mode and rebuild GitHub Pages assets
b968f9d Rebuild live app after reliability phase
b181a2e Update checkpoint after reliability phase
4e67763 Only show pay period saved after storage succeeds
8462a93 Stop job delete refresh when storage fails
30e09a1 Stop mileage delete refresh when storage fails

## Confirmed Working State

- React/Vite app runs locally.
- Manual pay period info saves locally.
- Bucking jobs save locally.
- Torque Turn jobs save locally.
- Expenses save locally.
- Mileage entries save, display, edit, and delete.
- Saved jobs list works.
- Saved expenses list works.
- Saved mileage list works.
- Pay period summary works.
- Pay period summary shows business miles and mileage estimate.
- Tax estimate works.
- Clear pay period downloads a full JSON backup before confirmation.
- Clear pay period cancel keeps data visible.
- JSON backup download exports the full active pay period.
- JSON import now requires mileageEntries in valid backups.
- JSON backup/import was manually verified with jobs, expenses, and mileage still present.
- Printable full report now includes a Mileage Summary section.
- Print Full Report was manually verified in browser print preview.
- Receipt/ticket photo attach, preview, and remove support exists.
- Company field saves on job tickets.
- Rig Name/Number field saves on job tickets.
- Field Ticket Number saves on job tickets.
- Transportation saves on job tickets as a numeric value.
- Company field supports default suggestions and manual typing.
- CSV export currently matches the visible Legend Energy timesheet job columns.
- CSV export intentionally remains job/timesheet-only until the export contract defines a separate mileage/full-report export.
- Job save/delete no longer uses a full page reload.
- Expense save/delete no longer uses a full page reload.
- Mileage save/delete no longer uses a full page reload.
- Active pay period storage normalizes missing or old data shape fields.
- Core calculation tests pass.
- Latest build passed with Vite and rebuilt GitHub Pages assets.

## Locked Rules

- MVP remains offline-first.
- MVP remains AI-free.
- MVP remains net-zero-cost.
- Manual review is required before saving.
- Bucking pay = hoursWorked × hourlyRateSnapshot.
- Torque Turn pay = baseJobPay + additionalHours × hourlyRateSnapshot.
- Expenses reduce net income but do not change gross earnings.
- Mileage estimate is shown for planning only and must not be treated as a guaranteed deduction.
- Tax estimates are planning only, not tax advice.
- Structured records use localStorage.
- Large photo/blob storage uses IndexedDB.
- Saved records store photo IDs by reference, not image blobs.
- Export visible fields must mimic the submitted Legend Energy timesheet first.
- Extra FieldLedger-only data should stay hidden or secondary in the timesheet export.

## Latest Manual Browser Test

Printable full report passed:

- Dashboard opened successfully.
- Print Full Report opened browser print preview.
- Timesheet report still showed job/report content.
- Pay Period Summary remained visible.
- Business Miles showed 299.60 mi.
- Mileage Estimate showed $200.74.
- Print preview generated successfully.

## Next Recommended Move

Continue integration + integrity cleanup before adding new features.

Next target:

- Verify CSV export behavior for Torque Turn jobs.

## Tracked TODO

- Verify CSV export behavior for Torque Turn jobs.
- Review printable report layout against the Legend Energy timesheet.
- Decide whether Rig Name/Number should use autofill with manual typing like Company.
- Add future way to manage saved company and rig suggestion lists.
- Clean old generated docs/assets files if needed after build churn.
