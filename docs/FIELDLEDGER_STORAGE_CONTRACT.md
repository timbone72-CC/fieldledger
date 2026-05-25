# FieldLedger Storage Contract

## 1. Purpose

This contract controls how FieldLedger stores app data.

No storage, persistence, backup, import, restore, export, or sync feature may be added or changed unless it follows this contract.

## 2. Storage Scope

FieldLedger is offline-first.

The MVP must store data locally on the user's device.

Local-first storage is an intentional product boundary, not a temporary limitation.

## 3. Allowed MVP Storage

Allowed MVP storage:

- browser localStorage for structured records and settings
- browser IndexedDB for large photo/blob records
- downloaded export files
- user-owned Google Sheets exports through the Trusted Sheet flow

## 4. Not Allowed For MVP

The MVP must not require:

- paid cloud database
- paid backend service
- paid AI storage
- paid OCR storage
- required user login
- required internet connection
- automatic cloud sync

## 5. Device Boundary Rule

Each browser/device has its own FieldLedger data.

Phone records, laptop records, desktop records, private/incognito browser records, browser-profile records, and installed PWA records may be separate.

FieldLedger must not imply that records automatically sync across devices.

Users must move records between devices manually through JSON Backup / Restore unless a future optional sync feature is intentionally added.

## 6. Pay Period Storage

Each pay period must support:

- id
- label
- startDate
- endDate
- status
- hourlyRateDefault when needed
- jobs
- expenses
- mileage entries
- settings snapshot when needed
- createdAt
- updatedAt

## 7. Job Storage

Each saved job must store enough data to preserve its calculated value even if settings change later.

Each job must support:

- id
- payPeriodId
- job type
- hourly rate snapshot
- calculated total pay
- ticket photo id when photo support exists
- createdAt
- updatedAt

## 8. Expense Storage

Each saved expense must support:

- id
- payPeriodId
- date
- vendor
- category
- amount
- receipt photo id when photo support exists
- notes
- createdAt
- updatedAt

## 9. Mileage Storage

Each saved mileage entry must support enough data to preserve mileage records inside the active pay period and JSON backup flow.

Each mileage entry must support:

- id
- payPeriodId when needed
- date
- description or route note when needed
- miles
- rate snapshot when mileage reimbursement or estimate support exists
- createdAt
- updatedAt

## 10. Photo Storage

Ticket and receipt photos may be stored locally.

Large photo/blob storage must use IndexedDB instead of localStorage.

Structured records should store photo IDs or photo references instead of storing full image blobs directly inside localStorage records.

JSON backup and restore behavior for photos must be verified before user-facing restore text promises that photos will move to a new device.

If JSON backup includes photo references but not recoverable photo blob data, restore UI must clearly explain that attached photo files may not restore on a different device or browser.

## 11. Settings Storage

User settings must support:

- hourly rate
- self-employment tax rate
- federal tax rate
- state tax rate when enabled
- Trusted Sheet Web App URL preference when saved
- local backup-status timestamp when enabled

Changing settings must not rewrite old saved job totals.

Import or restore behavior must clearly define whether settings are preserved, replaced, or ignored.

## 12. Data Safety Rule

The app should avoid silent data loss.

Before destructive actions, the app should ask for confirmation.

Destructive actions include:

- deleting a pay period
- clearing all jobs
- clearing all expenses
- clearing mileage entries
- clearing all local data
- importing or restoring records that replace current local records
- changing storage behavior in a way that may affect existing records

## 13. Persistent Storage Rule

FieldLedger may use browser storage APIs such as navigator.storage.estimate(), navigator.storage.persisted(), and navigator.storage.persist() to show local storage status and request persistent browser storage.

Persistent browser storage must be described as an automatic-cleanup risk reducer.

It must never be described as a complete guarantee against data loss.

JSON Backup / Restore remains FieldLedger's primary disaster-recovery path.

## 14. Export Backup Rule

Exports are a backup method.

The user should be able to download pay-period records.

JSON Backup must remain the primary user-controlled recovery path for local FieldLedger records.

Backup UI should remind users to download a fresh JSON backup before:

- clearing a pay period
- importing or restoring data
- switching devices
- switching browsers
- clearing browser data
- uninstalling or reinstalling the app
- relying on a new phone or computer

## 15. Backup Health Rule

FieldLedger may record a local backup timestamp after a successful JSON backup download.

Backup health indicators must be passive status only unless they call the existing verified backup/export function.

Settings must not duplicate backup-generation logic.

Backup health should be considered trustworthy only when the backup file validates and restores the expected saved data shape.

## 16. Restore Contract Rule

Restore behavior must be explicit.

Restore UI must never use ambiguous wording such as "merge or replace" unless the app truly supports both behaviors.

Before building restore-preview UI, the current restore contract must be verified from code.

The restore contract must document:

- exact localStorage keys read
- exact localStorage keys written
- whether active pay period data is replaced
- whether jobs are replaced or merged
- whether expenses are replaced or merged
- whether mileage entries are replaced or merged
- whether settings are preserved, replaced, or ignored
- whether Trusted Sheet URL preference is preserved, replaced, or ignored
- whether photo IDs are restored
- whether IndexedDB photo blobs are restored
- what happens when restored records reference missing photo blobs

## 17. Trusted Sheet Boundary

Google Sheets and Apps Script are export and trusted-user handoff paths.

They are not FieldLedger's source of truth during the MVP.

Local FieldLedger records remain authoritative until the user intentionally exports, imports, or restores data.

Trusted Sheet support must not become hidden sync.

## 18. Checkpoint Evidence Rule

Any change touching storage shape, backup, restore, import, localStorage, IndexedDB, photo references, clear/reset behavior, or PWA cache behavior must update checkpoint evidence when the change is completed.

Relevant validation should be recorded before the work is considered stable.

## 19. Future Sync Rule

Future cloud sync may be added later.

Future sync must be optional.

Future sync must not break offline-first use.

Future sync must not silently overwrite local records.

## 20. MVP Boundary

The MVP uses local device storage only.

The MVP does not require:

- backend server
- cloud database
- paid storage
- account login
