# FieldLedger Trusted User Setup Checklist

## 1. Purpose

This checklist prepares FieldLedger, Google Sheets, and Google Calendar for limited trusted-user testing.

This is not a public release checklist.

## 2. Trusted User Boundary

Each trusted user must use their own:

- FieldLedger app data
- Google Sheet copy
- dedicated FieldLedger calendar
- Google account permissions

No trusted user should depend on a shared master sheet or shared calendar.

## 3. Share Package

Each trusted user should receive only the items needed for testing:

- FieldLedger app link
- their copied Google Sheet link
- name of their dedicated FieldLedger calendar
- trusted-user instructions doc
- reminder to download a JSON backup before testing destructive flows

Do not send:

- the owner's master Sheet
- shared calendar access to the owner's calendar
- GitHub tokens or private repo credentials
- instructions for AI, OCR, backend, login, or cloud sync

## 4. Before Sharing

Confirm:

- FieldLedger app is live and updated
- Google Sheet template is clean
- test CSV import works
- CalendarEvents staging works
- ScheduleConfig values are reviewed
- generated rotation events use the name On Call Rotation
- generated timesheet events include Sunday reminder and Tuesday due dates before Friday payday
- generated timesheet events are validated across month/year boundaries
- duplicate prevention is active
- event IDs persist after sync
- calendar cleanup/regeneration path is understood

## 5. Sheet Safety

Before giving a tester access:

- make a fresh copy of the Sheet template
- rename the copy for that tester
- confirm RawData is empty or demo-safe
- protect formula/helper areas where possible
- leave only approved input/config areas editable
- confirm Timesheet output still works after import

## 6. Calendar Safety

Before syncing events:

- create or select a dedicated FieldLedger calendar
- do not sync to the tester's primary calendar first
- run a small test sync before bulk sync
- confirm duplicate prevention by syncing the same small set twice
- confirm events can be deleted/regenerated safely
- confirm renamed/regenerated events do not silently remove old Calendar events

## 7. Paired-System Evidence

Before sharing a Sheet copy with a trusted user, record the validation evidence:

- Google Sheets template name or copied Sheet name
- validation date
- CSV schema version tested
- Bucking sample result
- Torque Turn sample result
- RawData import result
- helper-sheet refresh result
- Timesheet output result
- CalendarEvents generation result
- duplicate sync result
- breaking-change status

Generic notes such as "Sheets worked" are not enough.

## 8. User Instructions To Give Tester

Tell the tester:

- their app data stays in their browser
- phone and computer data are separate
- JSON backup/import is the transfer method
- the Sheet is downstream from FieldLedger export
- Calendar is only a scheduling display
- deleting Calendar events does not delete FieldLedger app records
- tax estimates are planning only, not tax advice

## 9. Recovery Plan

If something breaks:

- make a new Sheet copy from the clean template
- clear test Calendar events from the dedicated FieldLedger calendar
- manually remove old renamed events, such as prior Workweek events, before resyncing renamed On Call Rotation events
- re-import the CSV into RawData
- regenerate CalendarEvents
- sync again only after reviewing staged rows

## 10. Definition Of Ready

Trusted-user sharing is ready only when:

- setup can be repeated from a fresh Sheet copy
- a small CSV import succeeds
- a small Calendar sync succeeds
- duplicate prevention is verified
- cleanup/regeneration is verified
- old renamed Calendar events are intentionally removed before final trusted-user sharing
- tester instructions are written clearly
