# FieldLedger Current State Checkpoint

## Current Head

8840d26 Warn user when corrupted local storage is recovered

## Recent Commits

8840d26 Warn user when corrupted local storage is recovered
6425077 Update checkpoint after storage integrity protections
308c2a1 Add active pay period schema version
d828ec9 Verify local JSON storage round trip
e621db8 Add local JSON storage recovery test
530654a Update checkpoint after export integrity tests
45af636 Add printable report integrity test
998e6ea Add CSV export integrity test

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
- JSON import now validates required mileage entry fields before restore.
- JSON backup/import was manually verified with jobs, expenses, and mileage still present.
- Printable full report now includes a Mileage Summary section.
- Printable timesheet now includes row-level mileage details and mileage totals.
- Print Full Report was manually verified in browser print preview.
- Receipt/ticket photo attach, preview, and remove support exists.
- Company field saves on job tickets.
- Rig Name/Number field saves on job tickets.
- Field Ticket Number saves on job tickets.
- Transportation saves on job tickets as a numeric value.
- Company field supports default suggestions and manual typing.
- CSV export currently matches the visible Legend Energy timesheet job columns.
- CSV export intentionally remains job/timesheet-only until the export contract defines a separate mileage/full-report export.
- Google Sheets Timesheet formula now supports Torque Turn rows when Day Rate is present.
- Job save/delete no longer uses a full page reload.
- Expense save/delete no longer uses a full page reload.
- Mileage save/delete no longer uses a full page reload.
- Active pay period storage normalizes missing or old data shape fields.
- Corrupted local JSON storage now warns the user and falls back safely.
- Core calculation tests pass.
- JSON backup round-trip integrity test passes.
- CSV export integrity test passes.
- Printable report integrity test passes.
- Latest build passed with Vite and rebuilt GitHub Pages assets.
- Live Print Timesheet now opens the spreadsheet-style timesheet view instead of the full report cards.
- Browser data reset was recovered successfully by importing a JSON backup.

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

Torque Turn CSV-to-Google-Sheets pipeline passed:

- App exported Torque Turn row with Day Rate 1400 and Additional Hours 7.
- Google Sheet initially calculated Total incorrectly as $346.00.
- Sheet formula was corrected to use Day Rate + Hours Worked × 28 when Day Rate is present.
- Repair Timesheet Formulas was run successfully.
- Torque Turn row stayed correct at $1,596.00.

Latest live recovery test passed:

- Live app initially showed cached/stale print behavior.
- Incognito confirmed updated Print Timesheet spreadsheet view.
- Browser data reset cleared local app data as expected.
- JSON backup import restored saved data successfully.
- Print Timesheet worked after restore.

Previous printable full report test passed:

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

- Continue integration + integrity cleanup.

## Tracked TODO

- Review printable report layout against the Legend Energy timesheet.
- Decide whether Rig Name/Number should use autofill with manual typing like Company.
- Add future way to manage saved company and rig suggestion lists.
- Clean old generated docs/assets files if needed after build churn.
