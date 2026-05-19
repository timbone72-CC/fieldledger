# FieldLedger Trusted User Instructions

## 1. Purpose

These instructions explain how a trusted user should test FieldLedger safely.

This is not a public release guide.

## 2. What FieldLedger Is

FieldLedger is a work-record app for tracking:

- job tickets
- pay periods
- expenses
- mileage
- timesheet exports
- calendar reminders

FieldLedger is designed for manual review before saving.

## 3. What You Should Receive

Before testing, you should receive:

- the FieldLedger app link
- your copied Google Sheet link
- the name of your dedicated FieldLedger calendar
- these trusted-user instructions
- a reminder to download a JSON backup before testing destructive flows

Do not use the owner's master Sheet or personal/default calendar for testing.

## 4. Important Data Warning

FieldLedger stores app data in the browser used on that device.

Phone data and computer data are separate unless moved with JSON backup/import.

Before clearing browser data, changing phones, or reinstalling the app, download a JSON backup.

## 5. What To Test First

Start with a small test pay period.

Add:

- one Bucking job
- one Torque Turn job
- one expense
- one mileage entry if mileage is being tested

Then verify:

- saved records display correctly
- summary totals look reasonable
- JSON backup downloads
- CSV export downloads
- printable report opens

## 6. Google Sheets Test

Import a small FieldLedger CSV into the Google Sheet.

Confirm:

- RawData updates
- helper sheets update
- Timesheet rows fill correctly
- formulas still calculate
- Grand Total rows stay hidden as expected

## 7. Trusted Sheet Send Test

Use the Export / Backup menu to send the current pay-period CSV to your copied Trusted Sheet.

Confirm:

- the Web App URL uses the deployed Apps Script `/exec` URL
- the Web App URL may be saved on this device
- the import token is entered only when sending
- the import token is not saved
- phone, laptop, and desktop browser data are separate
- if this device has no saved jobs, restore a JSON backup before sending

If the send fails, check:

- the Web App URL is the deployed `/exec` URL, not the editor URL
- the import token matches the copied Trusted Sheet setup
- the current browser has saved FieldLedger jobs
- the copied Trusted Sheet is the tester Sheet, not the owner/master Sheet

## 8. Calendar Test

Use the dedicated LEG Work Calendar only.

Do not sync generated FieldLedger work events to a personal/default calendar.

Confirm:

- CalendarEvents rows generate
- Sync Calendar Events creates events
- eventId values are saved
- syncing the same rows again does not create duplicates
- clearing CalendarEvents staging rows does not delete existing LEG Work Calendar events

## 9. Calendar Rollover Test

Before relying on generated reminders, confirm ScheduleConfig handles:

- month rollover
- year rollover
- payday events
- Sunday timesheet reminders
- Tuesday timesheet due events

## 10. What Not To Test Yet

Do not expect:

- AI
- OCR
- login
- cloud sync
- automatic tax filing
- paid backend services

## 11. Reporting Problems

When reporting a problem, include:

- what device was used
- which browser was used
- what button or menu item was clicked
- what was expected
- what happened instead
- whether a JSON backup exists

## 12. Safety Rule

Do not use real critical records as the only copy during testing.

Keep a JSON backup before testing imports, clears, or calendar regeneration.
