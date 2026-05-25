# FieldLedger Trusted User Release Readiness

## 1. Purpose

This document defines when FieldLedger is ready to share with a limited trusted user.

This is not a public launch checklist.

This is the single trusted-user release gate. The setup checklist, tester instructions, trusted-user contract, local-doc boundary, and Sheets integration contract support this gate; they do not replace it.

Supporting docs:

- `docs/FIELDLEDGER_TRUSTED_USER_SETUP_CHECKLIST.md`
- `docs/FIELDLEDGER_TRUSTED_USER_INSTRUCTIONS.md`
- `docs/FIELDLEDGER_TRUSTED_USER_CONTRACT.md`
- `docs/FIELDLEDGER_TRUSTED_USER_LOCAL_DOCS.md`
- `docs/FIELDLEDGER_SHEETS_INTEGRATION_CONTRACT.md`

## 2. Current Release Boundary

Trusted-user release means the app may be shared with a known tester who understands:

- FieldLedger stores data locally in the browser
- phone, laptop, and desktop data are separate
- JSON backup/import is the transfer method
- tax estimates are planning only, not tax advice
- Google Sheets is a downstream review tool
- Calendar events are downstream reminders only

## 3. Must Be Ready Before Sharing

Before sharing with a trusted user, confirm:

- the live FieldLedger app link opens
- the app can create a test pay period
- one Bucking job can be saved
- one Torque Turn job can be saved
- one expense can be saved
- one mileage entry can be saved if mileage is part of the test
- JSON backup downloads
- JSON import restores the test data
- CSV export downloads
- Print Timesheet opens
- Print Full Report opens
- Send to Trusted Sheet uses a deployed `/exec` Web App URL
- Trusted Sheet Web App URL setup is confirmed on the exact browser/device being tested
- Send to Trusted Sheet does not save the import token
- import token entry is confirmed on the exact browser/device being tested

## 4. Trusted User Share Package

Each trusted user should receive:

- FieldLedger app link
- copied tester Google Sheet link
- deployed Apps Script Web App `/exec` URL for the copied Sheet
- import token for the copied Sheet, shared separately from the Sheet link when possible
- dedicated FieldLedger calendar name provided for that tester
- trusted-user instructions
- backup warning

Do not share the owner's master Sheet, personal/default calendar, GitHub tokens, private repo credentials, or source-code access.

## 5. Safety Warnings Required

Trusted-user guidance must clearly say:

- download a JSON backup before clear/reset actions
- download a JSON backup before importing replacement data
- keep backup files somewhere safe
- browser data can be lost if browser storage is cleared
- the app does not provide tax advice

## 6. Not Ready For Public Release

FieldLedger is not ready for public customers until these are improved:

- onboarding
- backup warnings
- mobile layout polish
- export/report polish
- version or changelog visibility
- tester feedback review
- recovery instructions

## 7. Definition Of Ready

Trusted-user sharing is ready only when:

- checklist docs match the live app workflow
- tester Sheet setup can be repeated from a fresh copied Sheet
- small send-to-Sheet test succeeds
- small sync to the tester's dedicated FieldLedger calendar succeeds
- calendar duplicate prevention and cleanup/regeneration are verified
- JSON backup/import recovery is tested
- trusted-user instructions are clear
- checkpoint is updated from real git log
