# FieldLedger Master Contract

## 1. App Identity

FieldLedger is an offline-first 1099 field-work tracking app for job tickets, pay periods, receipts, expenses, rough tax planning, and export-ready records.

FieldLedger is designed for workers who need to manually review job and receipt information, calculate earnings, track expenses, estimate planning taxes, and keep pay-period records.

## 2. Non-Negotiable Rules

### 2.1 Offline-First Rule

FieldLedger must work without requiring an internet connection for core MVP use.

Core offline functions include:

- Creating a pay period
- Adding job ticket entries
- Manually entering job pay details
- Adding receipt or expense entries
- Calculating gross earnings
- Calculating expenses
- Calculating net income
- Showing rough tax estimates
- Preparing export data

Internet access may only be required later for optional sync, backup, hosting, or OCR services.

### 2.2 Net-Zero-Cost Rule

FieldLedger must be buildable and usable at zero required monthly cost for the MVP.

The MVP must not depend on paid APIs, paid AI services, paid OCR services, paid databases, paid hosting, or required paid software.

### 2.3 AI-Free MVP Rule

The MVP must not require AI to function.

Any future OCR or AI feature must be optional and must not replace manual review.

### 2.4 Manual Review Rule

No extracted, imported, scanned, or calculated data may be permanently saved without user review.

The user must be able to edit all job, receipt, expense, pay, and tax-rate values before saving.

### 2.5 Tax Disclaimer Rule

Tax estimates are for planning only.

FieldLedger must not present rough tax estimates as tax advice, tax filing guidance, guaranteed tax liability, deduction approval, or an accountant replacement.

## 3. Locked Pay Rules

### 3.1 Bucking Jobs

Bucking pay is based on hours only.

Formula:

    buckingTotal = hoursWorked × hourlyRateSnapshot

### 3.2 Torque Turn Jobs

Torque Turn pay is based on base job pay plus hourly pay only after the first 24 hours on that job.

Formula:

    extraHours = max(totalJobHours - 24, 0)
    torqueTurnTotal = baseJobPay + (extraHours × hourlyRateSnapshot)

### 3.3 Hourly Rate Snapshot

The default hourly rate is user-controlled.

The starting default hourly rate is:

    28

Each saved job must store the hourly rate used at the time of saving so old jobs do not change if the user changes the default hourly rate later.

## 4. Locked Expense Rules

Expenses belong inside a pay period.

Receipt and expense entries must support:

- Date
- Vendor
- Category
- Amount
- Notes
- Receipt photo reference when photo support exists

Expense categories may include:

- Fuel
- Food
- Tools
- Lodging
- Supplies
- Other

Expense categories may be guessed later, but the MVP must allow manual selection and correction.

## 5. Locked Pay Period Rules

Pay periods are created manually.

A pay period may contain mixed job types.

A pay period may contain:

- Bucking jobs
- Torque Turn jobs
- Receipt expenses

Summary calculations must include:

    grossEarnings = sum(all job totals)
    expenseTotal = sum(all expense totals)
    netIncome = grossEarnings - expenseTotal

## 6. Rough Tax Estimate Rules

The rough tax estimate must use editable user settings.

Starting defaults:

    selfEmploymentTaxRate = 0.153
    federalTaxRate = 0.12

Formula:

    estimatedTaxableIncome = max(netIncome, 0)
    estimatedSelfEmploymentTax = estimatedTaxableIncome × selfEmploymentTaxRate
    estimatedFederalTax = estimatedTaxableIncome × federalTaxRate
    estimatedTotalTax = estimatedSelfEmploymentTax + estimatedFederalTax

The app must display that tax estimates are only rough planning estimates and are not tax advice.

## 7. Authority Documents

FieldLedger is governed by these documents:

- docs/FIELDLEDGER_MASTER_CONTRACT.md
- docs/FIELDLEDGER_FOLDER_CONTRACT.md
- docs/FIELDLEDGER_SYSTEM_MAP.md
- docs/FIELDLEDGER_ROADMAP.md
- docs/FIELDLEDGER_PAY_CONTRACT.md
- docs/FIELDLEDGER_EXPENSE_CONTRACT.md
- docs/FIELDLEDGER_TAX_CONTRACT.md
- docs/FIELDLEDGER_TICKET_CONTRACT.md
- docs/FIELDLEDGER_STORAGE_CONTRACT.md
- docs/FIELDLEDGER_CAMERA_CONTRACT.md
- docs/FIELDLEDGER_EXPORT_CONTRACT.md

## 8. Build Order Rule

No feature should be expanded before its contract exists.

Build order:

1. Master contract
2. Folder contract
3. System map
4. Roadmap
5. Pay calculation contract
6. Expense contract
7. Tax contract
8. Ticket contract
9. Storage contract
10. Camera contract
11. Export contract
12. App implementation

## 9. Current MVP Boundary

The MVP is not a full accounting system.

The MVP does not file taxes.

The MVP does not require AI.

The MVP does not require paid OCR.

The MVP does not require cloud storage.

The MVP must focus on:

- Manual pay periods
- Manual job entry
- Manual receipt and expense entry
- Pay calculation
- Expense calculation
- Net income calculation
- Rough tax estimate
- Export-ready records