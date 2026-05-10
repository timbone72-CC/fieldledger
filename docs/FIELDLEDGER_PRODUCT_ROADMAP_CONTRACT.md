# FieldLedger Product Roadmap Contract

## 1. Purpose

This contract defines the long-term product direction, system philosophy, and expansion boundaries for FieldLedger.

This contract exists to prevent uncontrolled complexity, forced cloud dependence, feature drift, and loss of user data ownership.

No future feature, monetization layer, sync layer, AI system, or platform expansion should violate this contract.

## 2. Core Product Philosophy

FieldLedger must remain local-first, offline-capable, user-controlled, portable, export-friendly, and manual-review-first.

These principles are higher authority than convenience features.

## 3. Local-First Rule

The primary source of truth must remain local user-controlled storage.

The app must continue functioning for core workflows without requiring constant internet, cloud dependency, live backend connection, or remote database dependency.

Core workflows include job entry, expense entry, mileage entry, summaries, tax estimates, photo attachment, exports, printable reports, and backup generation.

## 4. User Ownership Rule

The user owns their records.

FieldLedger must not trap user data inside proprietary systems.

Users must always be able to export, back up, move, restore, and retain local-only workflows if desired.

### 4.1 Browser Storage Risk Rule

Local browser storage can be lost through browser data clearing, device resets, private browsing limits, app reinstall behavior, or browser/device failure.

FieldLedger should clearly remind users that regular user-controlled backups are part of responsible local-first use.

## 5. Optional Cloud Rule

Cloud features may exist later.

Cloud features must remain optional.

Examples include Google Drive backup, OneDrive backup, Dropbox backup, iCloud backup, optional sync, and optional account login.

The app must still support local-only operation.

## 6. Login Boundary Rule

Future login systems may control premium access, backup automation, sync convenience, and account preferences.

Login systems must not become required to access locally stored records.

Users must not lose access to their own field records because of account issues.

## 7. Manual-Review-First Rule

The user must remain the final authority before records are saved.

No AI, OCR, automation, import, sync, or smart rule may permanently save financial records without user review.

Editable review must remain part of the workflow.

## 8. AI / OCR Boundary Rule

AI and OCR features may exist later.

AI and OCR must remain optional.

The app must still function without them.

AI/OCR systems must require manual review, remain user-correctable, avoid hidden calculations, and avoid automatic financial assumptions.

## 9. Simplicity Protection Rule

FieldLedger must avoid unnecessary platform complexity.

Danger areas include forced cloud dependence, mandatory sync, hidden automation, backend-heavy architecture, forced subscriptions, platform lock-in, excessive configuration, and enterprise-style workflows.

The product should prioritize reliability and clarity over feature quantity.

## 10. Monetization Rule

Paid features may exist later.

Allowed monetization examples include advanced exports, automated Google Sheets workflows, backup automation, advanced reporting, support access, and convenience tools.

Monetization must not remove local ownership, export ability, local backups, or offline functionality.

## 11. Portable Data Rule

User records must remain portable.

Preferred portable formats include JSON, CSV, printable reports, and spreadsheet-compatible exports.

The app should avoid storing critical user data in inaccessible proprietary formats.

## 12. Google Sheets Workflow Rule

Google Sheets integration should remain lightweight.

Preferred architecture: FieldLedger creates an export, the user controls the storage destination, and Google Sheets consumes the exported data.

The spreadsheet layer should remain a reporting and organization workflow, not the primary database.

Google Sheets should not become the authoritative source of truth for FieldLedger records.

The app-owned local records and user-controlled backups should remain the primary recordkeeping authority.

## 13. Proof Photo Rule

Ticket and receipt photos may later integrate with Google Sheets through optional proof-photo links.

Preferred structure is structured rows plus optional linked proof photos.

Avoid embedding large image blobs directly into spreadsheet rows.

## 14. Sync Complexity Rule

Live sync is considered a high-complexity feature.

Live sync introduces conflict resolution, server authority problems, recovery burden, auth complexity, privacy responsibility, and support burden.

Live sync must not be added unless real user demand clearly justifies the complexity.

## 15. Trusted User Expansion Rule

Before public scaling, FieldLedger should first succeed as a personal tool, a trusted coworker tool, and a small-group workflow tool.

The app should stabilize in real-world field conditions before major expansion.

## 16. Roadmap Phases

### 16.1 Phase 1 — Stable MVP

Reliable local-first field-work tracker.

### 16.2 Phase 2 — Reliability + Trusted User Phase

Polish, safety, onboarding, backup clarity, mobile cleanup, and accessibility cleanup.

### 16.3 Phase 3 — User-Controlled Cloud Backup

Optional backup destinations chosen by the user.

### 16.4 Phase 4 — Lightweight Paid Version

Convenience monetization without data lock-in.

### 16.5 Phase 5 — Long-Term Preferences

Remembered settings, templates, history, and preferences.

### 16.6 Phase 6 — Optional Assisted Features

Optional OCR, suggestions, and scanning helpers.

### 16.7 Phase 7 — Live Sync Only If Truly Needed

Optional sync only after proven demand.

## 17. Workflow Authority Rule

Future development decisions should follow this order: contracts, workflow safety, reliability, integration, user clarity, convenience features, then advanced features.

Not the reverse.

### 17.1 Contract Change Rule

Major contract changes should be intentional, documented, and reviewed before related implementation changes occur.

Core product philosophy should not drift through silent contract edits.

## 18. Final Product Direction

FieldLedger is intended to become a trustworthy local-first field-work record system with optional lightweight connected workflows without sacrificing user ownership.

## 19. Data Recovery Rule

FieldLedger must prioritize recovery safety for user-owned records.

The system should avoid irreversible data loss whenever practical.

Recovery-focused behavior should include corrupted storage recovery, failed import handling, failed export handling, failed save handling, partial recovery handling, and rollback-safe workflows when possible.

The app should prefer visible recovery messaging over silent failure.

## 20. Schema Evolution Rule

FieldLedger data structures may evolve over time.

Future updates should preserve compatibility with older backups whenever reasonably practical.

The system should support schema version tracking, normalization, validation, and migration-safe imports.

Older user records should not silently break after app updates.

## 21. Definition of Done Rule

A feature is not considered complete until it has been reviewed through the full workflow pipeline.

Whenever applicable, a feature should be verified through save, display, edit/delete, summary, export, backup, restore, and print.

Partial implementation is not considered full integration.

## 22. Offline Failure Rule

Offline-first systems must fail safely.

When offline or local operations fail, the app should prefer visible user feedback, graceful degradation, retry-safe workflows, data preservation, and recovery guidance.

The app should avoid silent failures whenever practical.

## 23. Simplicity Budget Rule

New features must justify their complexity cost.

Future expansion should consider maintenance burden, support burden, recovery burden, testing burden, architectural complexity, and user confusion risk.

Convenience features should not override long-term maintainability.

## 24. Platform Independence Rule

FieldLedger should avoid unnecessary dependence on a single platform vendor whenever practical.

Core workflows should remain portable across browsers, operating systems, storage providers, and cloud vendors.

Optional integrations may exist without becoming mandatory dependencies.

## 25. No Hidden Automation Rule

FieldLedger should avoid hidden automation affecting financial records.

Users should remain aware of calculated values, suggested values, imported values, synced values, and modified values.

Financial record changes should remain reviewable and user-correctable.

### 25.1 No Silent Data Mutation Rule

Saved financial records should not be silently modified without visible user awareness whenever practical.

Migrations, imports, sync actions, smart rules, and recovery behavior should preserve user trust by making meaningful record changes reviewable or clearly communicated.

## 26. Lightweight Architecture Rule

FieldLedger should prefer lightweight architecture whenever practical.

The system should avoid unnecessary backend services, infrastructure layers, cloud dependencies, third-party dependencies, and always-online requirements.

The simplest reliable solution should generally be preferred.


### 26.1 Simpler Workflow Preference Rule

When multiple valid solutions exist, FieldLedger should generally prefer the workflow with lower cognitive load, clearer recovery behavior, better offline reliability, and simpler field usability.

Convenience should not come at the cost of reliability or user clarity.

## 27. Integrity Review Rule

Major feature phases should be followed by integration and integrity review phases before major expansion continues.

Integrity review areas may include storage safety, backup integrity, export integrity, print integrity, summary accuracy, validation coverage, workflow consistency, and mobile usability.

Feature growth should not outpace reliability verification.

## 28. Support Boundary Rule

FieldLedger is a workflow and recordkeeping tool.

FieldLedger does not guarantee tax filing correctness, accounting correctness, legal compliance, deduction eligibility, cloud provider reliability, third-party service uptime, or user backup discipline.

Users remain responsible for reviewing and maintaining their own records.

## 29. Long-Term Product Direction

FieldLedger should continue evolving as a trustworthy local-first field-work record system with optional lightweight connected workflows without sacrificing user ownership, portability, or reliability.

## 30. Calendar Scheduling Roadmap

FieldLedger now recognizes Google Calendar as an approved downstream scheduling display layer through Google Sheets.

Approved architecture:

FieldLedger -> CSV export -> Google Sheets -> Google Calendar

Google Sheets remains the orchestration layer.

Google Calendar remains non-authoritative.

## 31. Approved Future Calendar Features

Approved future roadmap items:

- separate FieldLedger calendar
- Workweek event generation
- Payday event generation
- two-week hitch or pay-period blocks
- event color coding
- payday reminders
- work-period start and end reminders
- travel-day generation
- shared family calendar support
- safe schedule regeneration
- duplicate prevention
- event cleanup workflow

These features must preserve user ownership and avoid introducing a backend requirement.

## 32. App Pay-Period Label Alignment

A future FieldLedger app enhancement may auto-suggest the current pay-period label using the same schedule rules as ScheduleConfig.

The label must remain editable by the user before saving.

FieldLedger must not require live Google Sheets or Google Calendar access for the local app to function.

Any future Sheets-to-FieldLedger import path requires a separate contract update before implementation.


## Trusted User Release Candidate Phase

Purpose:

Prepare FieldLedger, Google Sheets orchestration, and Google Calendar scheduling for limited trusted-user sharing.

Primary goals:

- safe Google Sheet template workflow
- safe dedicated FieldLedger calendar workflow
- duplicate prevention verification
- regeneration/cleanup verification
- onboarding/setup clarity
- user-owned data protection
- recovery/rebuild instructions
- trusted-user operational testing

This phase focuses on operational safety and workflow survivability.

This phase does NOT introduce:

- AI
- OCR
- backend infrastructure
- forced login
- cloud sync
- paid APIs/services
