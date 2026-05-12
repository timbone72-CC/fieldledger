# FieldLedger Sheets Integration Contract

## 1. Purpose

This contract protects the paired workflow between FieldLedger and Google Sheets.

FieldLedger is the local app for entering, reviewing, saving, and exporting pay-period records.

Google Sheets is the paired spreadsheet system for importing FieldLedger CSV exports into the formatted timesheet workflow.

## 2. Paired-System Boundary

The supported workflow is:

FieldLedger App
→ CSV Export
→ Google Sheets RawData tab
→ helper sheets
→ Timesheet tab

FieldLedger must not silently change CSV behavior in a way that breaks the Google Sheets pipeline.

Google Sheets must not assume fields that are not included in the FieldLedger CSV contract.

## 3. Authority

This contract is the authority for FieldLedger-to-Google-Sheets integration.

If this contract conflicts with checkpoint notes, this contract wins.

Checkpoint notes are history and evidence.

This contract defines current required behavior.

## 4. Current Integration Status

Current integration method:

- manual CSV export from FieldLedger
- manual or scripted CSV import into Google Sheets RawData

The app does not currently require direct Google Sheets API access.

The app does not require a backend, login, paid service, AI, or OCR for this integration.

## 5. Change-Control Rule

Any change touching CSV export columns, column order, job pay semantics, job type names, or pay-period metadata must be treated as a paired-system change.

A paired-system change requires:

- contract review
- app export validation
- Google Sheets RawData compatibility check
- Timesheet output check
- checkpoint update after verification

## 6. No Silent Interface Changes

Do not silently rename, remove, reorder, or change the meaning of CSV columns used by Google Sheets.

If a breaking change is unavoidable, it must be documented with:

- reason for change
- old behavior
- new behavior
- migration note
- validation result

## 7. CSV Schema Authority

The Google Sheets workflow depends on a stable CSV schema exported by FieldLedger.

The CSV contract must define:

- exact column names
- exact column order
- required fields
- optional fields
- semantic meaning of each field

Google Sheets formulas, helper sheets, filters, validations, and Timesheet formatting may depend on this schema.

CSV schema changes must not be treated as local app-only changes.

## 8. Locked CSV Behavior

The following behaviors are contract-locked unless formally changed through paired-system review:

- CSV column order
- CSV column names
- job type names
- Bucking calculation semantics
- Torque Turn calculation semantics
- transportation handling
- pay-period metadata fields

Blank values used intentionally by one job type must remain predictable for Google Sheets formulas.

## 9. Column Semantics Rule

CSV fields must preserve consistent meaning.

Examples:

- "Hours Worked" must not silently change meaning between exports.
- Torque Turn extra-hour behavior must remain compatible with downstream formulas.
- Gross earnings fields must not include expense deductions.
- Transportation must not become earnings.

If a field meaning changes, the integration contract must be updated first.

## 10. RawData Authority

The RawData tab is the ingestion layer for FieldLedger CSV imports.

RawData must remain compatible with the locked CSV schema.

RawData should be treated as imported operational data, not a manually reformatted report.

The RawData tab must not require hidden manual cleanup steps after normal CSV import.

## 11. Helper Sheet Rule

Helper sheets may derive values from RawData for:

- company lists
- rig lists
- dropdown values
- formatting support
- Timesheet support

Helper sheets must not silently rewrite the meaning of imported FieldLedger data.

Helper sheets must remain compatible with both:

- Bucking jobs
- Torque Turn jobs

## 12. Timesheet Template Boundary

The Timesheet tab is the formatted operational output layer.

Protected Timesheet template areas must not be silently shifted by import behavior.

Current protected operational range:

- Timesheet rows 12–38

Formula repairs or formatting fixes must preserve:

- Bucking behavior
- Torque Turn behavior
- totals
- print formatting

## 13. Manual Review Rule

The Google Sheets workflow remains manual-review-first.

Importing CSV data into Google Sheets does not remove the requirement for human review before operational use.

FieldLedger exports and Google Sheets outputs must remain reviewable and editable by the user.

## 14. Definition of Done for Paired-System Changes

A paired-system change is not complete until all affected layers are verified.

Required verification may include:

- CSV export validation
- RawData import validation
- helper-sheet validation
- Timesheet validation
- Bucking workflow validation
- Torque Turn workflow validation
- totals validation
- print/export validation
- checkpoint update
- live rebuild verification when applicable

A change is not considered complete only because the app locally works.

## 15. Validation Rule

Paired-system validation must verify that:

- CSV exports still import correctly
- formulas still calculate correctly
- totals still match expected values
- helper sheets still populate correctly
- Timesheet formatting remains stable
- Bucking jobs remain correct
- Torque Turn jobs remain correct

Validation should prefer real exported CSV samples when possible.

## 16. Offline-First Rule

The FieldLedger ↔ Google Sheets workflow must remain usable without requiring:

- paid APIs
- required backend services
- required AI services
- required OCR services
- required cloud databases

Manual CSV export/import remains a supported workflow.

## 17. Contract Priority Rule

This contract works together with:

- FIELDLEDGER_EXPORT_CONTRACT.md
- FIELDLEDGER_PAY_CONTRACT.md
- FIELDLEDGER_PRODUCT_ROADMAP_CONTRACT.md
- CHECKPOINT_CURRENT_STATE.md

If operational workflow behavior conflicts with historical notes or assumptions, the active contracts control the system behavior.

## 18. CSV Schema Version 1

Current CSV schema version:

- csvSchemaVersion: 1
- consumer: Google Sheets RawData tab
- purpose: Legend-style timesheet import

The CSV header row must preserve this exact column order:

| Index | Column Name | Type | Required | Semantic Meaning |
| --- | --- | --- | --- | --- |
| 1 | Date | date/string | yes | Job work date exported from FieldLedger. |
| 2 | Company | string | yes | Company/customer name for the job. |
| 3 | Rig Name/Number | string | yes | Rig name or rig number for the job. |
| 4 | Field Ticket Number | string | yes | Field ticket identifier from the job ticket. |
| 5 | Day Rate | number/blank | conditional | Torque Turn base job pay/day-rate value when applicable; blank or zero when not applicable. |
| 6 | Hours Worked | number/blank | conditional | Bucking hours worked or Torque Turn additional/hour-compatible value expected by the Sheets workflow. |
| 7 | Transportation | number/blank | optional | Transportation value for operational timesheet reporting; not user earnings. |
| 8 | Total | number | yes | FieldLedger-calculated job total for the row. |

This schema is intentionally job-row focused.

Mileage is not part of CSV Schema Version 1.

Expenses are not part of CSV Schema Version 1.

JSON backup remains the full local-record backup path.

## 19. CSV Versioning and Compatibility Policy

CSV schema changes must be versioned.

The current supported schema is:

- CSV Schema Version 1

A non-breaking CSV change may include:

- adding optional metadata outside the locked job-row columns
- improving filename wording
- improving export button wording
- improving internal code without changing exported column names, order, or meaning

A breaking CSV change includes:

- renaming a locked column
- removing a locked column
- reordering locked columns
- changing the meaning of a locked column
- changing job type names consumed by Sheets
- changing Bucking export semantics
- changing Torque Turn export semantics
- changing whether Transportation is treated as earnings

Breaking CSV changes require:

- contract update before implementation
- schema version bump
- migration note
- RawData compatibility check
- helper-sheet compatibility check
- Timesheet compatibility check
- checkpoint update after verification

No breaking CSV change may be treated as app-only work.

## 20. Backward Compatibility Rule

CSV Schema Version 1 must remain supported until a replacement schema is documented and verified.

If CSV Schema Version 2 is introduced, the contract must document:

- why Version 2 exists
- what changed from Version 1
- whether Version 1 remains supported
- how Google Sheets must migrate
- validation evidence for the new workflow

FieldLedger must not remove or break CSV Schema Version 1 support without a documented migration path.

## 21. Required Paired-System Evidence

A paired-system change must leave clear evidence of what was verified.

Evidence may include:

- exported CSV sample name or date
- RawData import result
- helper-sheet refresh result
- Timesheet row population result
- Bucking sample validation result
- Torque Turn sample validation result
- total/parity validation result
- print/export validation result
- related test command output
- related commit hash after completion

Validation evidence must be specific enough that a later audit can understand what was checked.

Generic notes such as "Sheets worked" or "export passed" are not enough.

## 22. Required Checkpoint Fields for Paired-System Changes

When a paired-system change is completed, CHECKPOINT_CURRENT_STATE.md must include a paired-system validation note with:

- CSV schema version validated
- FieldLedger export behavior validated
- RawData import compatibility
- helper-sheet compatibility
- Timesheet output compatibility
- Bucking sample result
- Torque Turn sample result
- totals/parity result
- breaking-change status
- migration note, if applicable

Checkpoint updates must be based on verified behavior, not assumptions.

## 23. Current Governance Status

This contract defines the current FieldLedger-to-Google-Sheets operational boundary.

Current protected CSV schema:

- CSV Schema Version 1

Current protected downstream workflow:

- FieldLedger CSV export
- Google Sheets RawData import
- helper-sheet processing
- Timesheet output rows 12–38

Until a later contract update changes this, FieldLedger and Google Sheets must stay compatible with this workflow.

RawData is the authoritative imported data layer.

Helper-sheet processing, Timesheet formula repair, and Grand Total row hiding are downstream reconciliation steps.

Downstream reconciliation steps must not be treated as the source of truth.

## 24. Cross-Contract Synchronization Rule

Changes to this contract must trigger consistency review for:

- FIELDLEDGER_EXPORT_CONTRACT.md
- FIELDLEDGER_PAY_CONTRACT.md
- FIELDLEDGER_PRODUCT_ROADMAP_CONTRACT.md
- CHECKPOINT_CURRENT_STATE.md

No paired-system governance change is complete until related contracts and checkpoint expectations are reviewed for consistency.

## 25. CSV Canonical Value Rules

CSV Schema Version 1 must preserve these canonical export behaviors.

### Bucking Jobs

- Day Rate:
  - must export as blank
- Hours Worked:
  - must export actual Bucking hoursWorked value
- Transportation:
  - must export numeric transportation value or blank if unused

### Torque Turn Jobs

- Day Rate:
  - must export Torque Turn baseJobPay value
- Hours Worked:
  - must export the Sheets-compatible Torque Turn hours value defined by the paired workflow
- Transportation:
  - must export numeric transportation value or blank if unused

### Blank vs Zero Rule

Blank values and zero values are not interchangeable.

If a field is intentionally unused for a job type, the export behavior must remain contract-consistent so Google Sheets formulas do not drift.

## 26. Template Identity Rule

Paired-system validation must record the Google Sheets template identity used during validation.

Validation evidence should include:

- spreadsheet name or template identifier
- validation date
- CSV schema version
- related commit hash when applicable

Timesheet row validation without template identity context is incomplete.

## 27. Machine-Verifiable Validation Rule

Paired-system validation must include:

- one parsed CSV schema validation
- one Bucking export validation sample
- one Torque Turn export validation sample
- one RawData import validation
- one helper-sheet validation
- one Timesheet validation

Validation evidence must be reproducible by a later audit when possible.

## 28. Google Calendar Downstream Layer

Google Calendar is an approved downstream operational display layer for FieldLedger scheduling data.

The approved flow is:

FieldLedger -> CSV export -> Google Sheets -> Google Calendar

Google Calendar must not become the source of truth for jobs, expenses, mileage, pay periods, CSV schema, RawData, Timesheet formulas, or FieldLedger app state.

## 29. CalendarEvents Sheet Authority

The CalendarEvents sheet is the approved staging table for calendar sync.

Required columns:

- eventId
- eventType
- title
- startDate
- endDate
- notes
- syncStatus

Rows marked Pending may be synced to Google Calendar.

Rows with an existing eventId must not create duplicate Google Calendar events.

Synced rows should preserve eventId as operational metadata.

CalendarEvents row validation must require:

- title
- startDate
- syncStatus

Rows missing required sync fields must not create Google Calendar events.

Malformed rows must be marked with an explicit failure status rather than silently skipped when the row is intended to sync.

## 30. ScheduleConfig Sheet Authority

The ScheduleConfig sheet is the approved control table for generated schedule events.

Approved settings:

- PayPeriodStart
- PayPeriodDays
- PaydayOffsetDays
- PeriodsToCreate

ScheduleConfig may generate Workweek and Payday rows into CalendarEvents.

ScheduleConfig must not mutate FieldLedger local app data.

ScheduleConfig validation must reject:

- invalid or missing dates
- non-numeric values
- zero or negative pay-period lengths
- zero or negative PeriodsToCreate values

Decimal and unusually large values are currently not contract-governed and require future hardening if operational issues appear.

## 31. Calendar Sync Boundary Rule

Calendar sync is downstream-only.

Approved direction:

Google Sheets -> Google Calendar

Not approved without a future contract update:

Google Calendar -> Google Sheets
Google Calendar -> FieldLedger
Google Sheets -> FieldLedger live sync

FieldLedger may later add local pay-period label defaults using the same scheduling rules, but that must remain local and editable unless a future import contract is approved.

## 32. Scheduling Roadmap Boundary

Approved future scheduling enhancements include:

- separate FieldLedger Google Calendar
- color-coded calendar events
- reminders and notifications
- travel-day events
- shared family calendar support
- safe regenerate and cleanup workflow
- optional ScheduleConfig import into FieldLedger
- local FieldLedger pay-period label defaults

These are planned features, not automatic implementation approval.


## 33. Trusted User Sheet Sharing Rules

Each trusted tester must use their own personal copy of the FieldLedger Google Sheet.

The Google Sheet remains user-controlled.

FieldLedger must not depend on a shared multi-user master sheet.

Trusted-user sheet safety rules:

- RawData remains the CSV import authority
- Helper sheets remain orchestration-only
- Timesheet remains formatted output only
- Users should only edit approved input/config areas
- Formula regions should be protected where possible
- Template damage must be recoverable by making a fresh template copy
- No tester data should depend on another tester's sheet

The Google Sheet remains downstream from FieldLedger exports.

The Google Sheet must not become the authoritative source for FieldLedger app records.

## 34. Trusted User Calendar Rules

Each trusted tester should use a separate dedicated FieldLedger calendar.

Google Calendar remains non-authoritative.

Calendar events may be deleted and regenerated safely.

Trusted-user calendar rules:

- duplicate prevention must remain active
- CalendarEvents remains event-sync authority
- event IDs must persist between sync operations
- no reverse sync into FieldLedger is allowed
- calendar sync must not modify FieldLedger app records
- calendar cleanup/regeneration must remain recoverable
- generated scheduling events may include On Call Rotation, Timesheet Reminder, Timesheet Due, and Payday

Google Calendar exists as a downstream scheduling/presentation layer only.

Dedicated work calendar rule:

- Apps Script calendar sync must target the dedicated calendar named LEG Work Calendar.
- Apps Script must not use the personal/default Google Calendar for generated FieldLedger work events.
- The sync function must get or create LEG Work Calendar and abort safely if that calendar cannot be accessed by name.
- Generated work events may be shared from LEG Work Calendar without exposing personal calendar events.
- Clearing synced rows from CalendarEvents must not delete Google Calendar events.

## 35. Timesheet Governed Boundary

This fixed boundary is intentional.

Rows 12-38 map to the governed Legend Energy template layout and are not dynamically resized.

Dynamic expansion or shrinking of the Timesheet repair area is not allowed unless the template contract itself changes first.

Rows 40 and below are outside repair-script authority unless explicitly governed by a future contract revision.

The Apps Script v2 Timesheet boundary is locked as:

```text
header row = 11
governed entry rows = 12–38
governed total row = H39
rows 40+ are not script-owned
```

The script must not write formulas, validations, totals, or generated values below row 39.

## 36. RepairTimesheetFormulasAndValidation Rule

RepairTimesheetFormulasAndValidation may only repair the governed Timesheet zone.

Allowed repair scope:

```text
Timesheet rows 12–38
Timesheet total row H39
```

It must not clear validations, overwrite formulas, or modify rows 40+.

## 37. CSV Import Failure Safety Rule

Malformed CSV imports must fail safely.

A failed import must not overwrite or clear existing RawData.

CSV headers must match the FieldLedger export schema exactly before RawData is replaced.

CSV data rows must pass strict validation before RawData is replaced.

RawData replacement must be protected by a backup snapshot and rollback path.

If replacement fails after validation, the previous RawData contents must be restored from backup.

Failure messages must make clear that RawData was not changed.

## 38. Downstream Reconciliation Partial-Failure Rule

RawData rollback protection applies to RawData replacement only.

After RawData is successfully replaced, helper-sheet refresh, Timesheet repair, Grand Total hiding, schedule generation, and calendar sync are downstream reconciliation steps.

If a downstream reconciliation step fails after RawData has already been replaced, the failure must not be described as a RawData rollback event.

The operator must treat the imported RawData as the current downstream import layer and rerun or repair the failed reconciliation step explicitly.

Failure handling must clearly distinguish between:

- failed import before RawData replacement
- failed RawData replacement with backup restoration
- failed downstream reconciliation after RawData replacement

## 39. Schedule Generation Idempotency Rule

Repeated schedule generation must not append duplicate pending rows.

If schedule rows already exist for the same governed period/event identity, the script must skip them instead of creating duplicates.

Current duplicate prevention identity is:

- event type
- event title
- start date
- end date

Duplicate prevention must occur before CalendarEvents rows are appended.

## 40. Calendar Sync Idempotency Rule

Repeated calendar sync must skip already-synced rows.

Rows with existing synced event IDs must not create duplicate Google Calendar events.

Rows with stored event IDs must be checked against LEG Work Calendar before being skipped.

If a stored event ID no longer exists in LEG Work Calendar, the row must be marked `Missing calendar event` instead of silently passing as synced.

Missing calendar events must not be silently recreated during normal sync.

Before creating a new Google Calendar event from a Pending CalendarEvents row, sync must check LEG Work Calendar for an existing visible event with the same governed identity (title, start date, and end date). If a matching visible event already exists without a stored event ID, normal sync must not create another event.

Operator recovery must be explicit: a restore action may clear the stale event ID, mark the row `Pending`, and then allow the normal sync flow to recreate the downstream calendar event with a new event ID.

Calendar reconciliation destructive recovery has been live-verified: deleting a synced LEG Work Calendar event and rerunning sync marked the row `Missing calendar event`; running `Restore Missing Calendar Events` reset only that row to `Pending`; rerunning sync recreated only the missing event; already-synced valid events were skipped and not duplicated.

LEG Work Calendar remains downstream-only.

Calendar sync must never mutate FieldLedger source data.
