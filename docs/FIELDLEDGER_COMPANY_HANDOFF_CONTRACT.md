# FieldLedger Company Handoff Contract

## 1. Purpose

This contract defines a future-planning boundary for controlled company handoff.

It does not change current MVP scope.

The current MVP remains worker-owned, offline-first, no-login, no-backend, net-zero-cost, and manual-review-first.

## 2. Future-Only Boundary

Company handoff is not being built now.

Current MVP handoff remains export-only and user-controlled.

## 3. Worker Ownership

The worker owns FieldLedger records.

FieldLedger must not make the company the source of truth for worker records.

## 4. Controlled Handoff

A company may receive only a controlled handoff or export prepared by the worker.

The handoff must not grant silent access to local browser data, backups, photos, or private notes.

## 5. Handoff Packet

A future handoff packet may include:

- pay period identifier
- reviewed job rows
- totals
- proof references
- correction history
- export timestamp

## 6. Company Review Fields

Future company review may track:

- review status
- reviewer name
- reviewed date
- approved amount
- correction reason
- payment reference

## 7. Proof References

Proof should be shared by reference, not stuffed into payroll rows.

Proof may include ticket IDs, receipt IDs, file names, or controlled links.

## 8. Future Google Sheets Layout

A future company Sheet may use:

- RawData
- Review
- PayrollExport
- Proof

RawData remains imported data. Review and PayrollExport remain downstream review/output layers.

## 9. Correction Requests

Companies may request corrections.

Correction requests must not silently overwrite worker records.

The worker must review and choose whether to update their own record.

## 10. Backend Trigger

A backend may be considered only after proven need for controlled submission, status tracking, or multi-party review.

A backend is not required for the current MVP.

## 11. Security Boundary

Future handoff must protect worker privacy, local records, tokens, backups, and proof files.

Company access must be explicit, limited, and revocable where practical.

## 12. Payroll Boundary

FieldLedger is not payroll software.

Company handoff may support review and export, but it must not claim to run payroll, calculate taxes for filing, or replace company payroll systems.
