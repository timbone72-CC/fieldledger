# FieldLedger Sheets Reconciliation Audit Plan

## 1. Purpose

This document records the targeted Codex audit findings for Sheets integration reliability and reconciliation hardening.

No fixes are applied in this document.

## 2. Audit Source

Codex audit completed against:

- Repo root: /home/timbo/projects/fieldledger
- Branch: main
- Working tree: clean
- Current head: 36911e1 Update checkpoint after calendar verification + timesheet drift fix

## 3. Confirmed High-Priority Findings

### 3.1 Calendar duplicate prevention fails open

Severity: High

Location:

- google-sheets/apps-script/Code.gs
- calendarEventAlreadyExists
- syncCalendarEvents

Issue:

If Calendar duplicate lookup fails, the helper returns false. Sync can continue and create a duplicate visible calendar event.

Why it matters:

Calendar sync safety requires duplicate visible-event prevention to block creation when identity cannot be safely checked.

Planned fix:

Change duplicate lookup failure behavior from fail-open to fail-closed.

Expected behavior after fix:

If duplicate lookup fails, sync must not create the event. The row should be marked failed or skipped visibly.

Implementation guardrail:

Duplicate lookup failure must produce an explicit visible failure state in CalendarEvents.

The failure must not become a silent skip.

The row must remain auditable for reconciliation and manual recovery.

### 3.2 ScheduleConfig allows negative values

Severity: High

Location:

- google-sheets/apps-script/Code.gs
- generateScheduleEvents

Issue:

ScheduleConfig validation rejects missing or zero values but does not reject negative PayPeriodDays or negative PeriodsToCreate.

Why it matters:

Contracts require zero or negative pay-period lengths and zero or negative PeriodsToCreate values to be rejected.

Planned fix:

Add explicit validation requiring:

- PayPeriodDays > 0
- PeriodsToCreate > 0

Expected behavior after fix:

Negative or zero values should stop schedule generation before any schedule rows are created.

Implementation guardrail:

Validation must occur before any schedule rows are appended.

No partial schedule generation is allowed before validation passes.

## 4. Confirmed Medium-Priority Findings

### 4.1 CalendarEvents blank syncStatus rows are skipped silently

Severity: Medium

Planned approach:

Clarify whether blank syncStatus rows should be rejected only when title/startDate exist.

No fix until rule is confirmed.

### 4.2 CSV downstream failure message lacks distinction

Severity: Medium

Planned approach:

Improve operator-facing failure message only after high-priority integrity fixes are complete.

### 4.3 Helper refresh preserves stale helper values

Severity: Medium

Planned approach:

Confirm intended behavior before changing. This may be useful historical dropdown behavior, not necessarily a bug.

## 5. Fix Order

### Step 1

Fix calendar duplicate lookup fail-open behavior.

### Step 2

Fix ScheduleConfig negative value validation.

### Step 3

Review medium findings one at a time only if still needed.

## 6. Guardrails

Do not fix all findings at once.

Do not refactor unrelated script sections.

Do not change product direction.

Do not change Sheets architecture.

Do not change RawData authority model.

Do not change Timesheet governed row boundaries.

Each fix must be tested manually in Google Sheets before checkpoint update.

## 7. Codex Plan Review Target

Before implementation, ask Codex to review this plan for:

- missing chain-of-impact risks
- whether the fix order is safe
- whether any planned fix could violate existing contracts
- whether the plan overreaches beyond the audit findings

No fixes should be applied by Codex.
