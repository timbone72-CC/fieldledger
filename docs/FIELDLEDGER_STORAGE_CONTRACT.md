# FieldLedger Storage Contract
1. Purpose

This contract controls how FieldLedger stores app data.

No storage, persistence, backup, import, or sync feature may be added or changed unless it follows this contract.

2. Storage Scope

FieldLedger is offline-first.

The MVP must store data locally on the user's device.

3. Allowed MVP Storage

Allowed MVP storage:

browser localStorage
browser IndexedDB
downloaded export files
4. Not Allowed For MVP

The MVP must not require:

paid cloud database
paid backend service
paid AI storage
paid OCR storage
required user login
required internet connection
5. Pay Period Storage

Each pay period must support:

id
label
startDate
endDate
status
hourlyRateDefault
jobs
expenses
settings snapshot if needed
createdAt
updatedAt
6. Job Storage

Each saved job must store enough data to preserve its calculated value even if settings change later.

Each job must store:

job type
pay period id
hourly rate snapshot
calculated total pay
7. Expense Storage

Each saved expense must store:

pay period id
date
vendor
category
amount
receipt photo id if attached
8. Photo Storage

Ticket and receipt photos may be stored locally.

Large photo handling should avoid bloating localStorage.

IndexedDB is preferred for photo/blob storage.

9. Settings Storage

User settings must support:

hourly rate
self-employment tax rate
federal tax rate

Changing settings must not rewrite old saved job totals.

10. Data Safety Rule

The app should avoid silent data loss.

Before destructive actions, the app should ask for confirmation.

Destructive actions include:

deleting a pay period
clearing all jobs
clearing all expenses
clearing all local data
11. Export Backup Rule

Exports are a backup method.

The user should be able to download pay-period records.

12. Future Sync Rule

Future cloud sync may be added later.

Future sync must be optional.

Future sync must not break offline-first use.

13. MVP Boundary

The MVP uses local device storage only.

The MVP does not require:

backend server
cloud database
paid storage
account login