# FieldLedger Submission Contract

## 1. Purpose

This contract defines a future-planning boundary for submission workflows.

It does not change current MVP scope.

The current MVP remains worker-owned, offline-first, no-login, no-backend, net-zero-cost, and manual-review-first.

## 2. Future-Only Boundary

Submission workflows are not being built now.

The current MVP remains export-only.

## 3. Submission Packet

A future submission packet may include:

- pay period identifier
- reviewed job rows
- totals
- proof references
- worker notes selected for sharing
- submission timestamp

## 4. Submission States

Future submission status may use:

- draft
- submitted
- needs correction
- reviewed
- approved
- rejected
- paid

## 5. Worker Review

The worker must review records before submission.

No submission should happen from unsaved or unreviewed form values.

## 6. Company Edits

A company must not silently overwrite worker records.

Company review may create comments, correction requests, or downstream payroll export fields.

Worker-owned records remain controlled by the worker.

## 7. Payroll Boundary

Submission is not payroll.

FieldLedger may prepare records for review or export, but it must not claim to process payroll, file taxes, or replace payroll systems.

## 8. MVP Boundary

The current MVP supports export-only workflows.

It does not require submission APIs, backend status tracking, login, company accounts, or live review queues.
