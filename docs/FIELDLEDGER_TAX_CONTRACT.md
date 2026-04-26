# FieldLedger Tax Contract

## 1. Purpose

This contract controls all rough tax estimate behavior in FieldLedger.

No tax estimate, tax setting, tax summary, or tax export feature may be added or changed unless it follows this contract.

## 2. Authority

This contract is controlled by the FieldLedger Master Contract.

Tax estimates must follow the Master Contract rules for:

- offline-first use
- net zero cost
- AI-free MVP
- manual review
- tax disclaimer

## 3. Tax Estimate Boundary

FieldLedger may calculate rough tax estimates for planning only.

FieldLedger must not present tax estimates as:

- tax advice
- tax filing guidance
- guaranteed tax liability
- deduction approval
- accountant replacement

## 4. Required Disclaimer

Any screen or export showing a tax estimate must include this meaning:

```text
Tax estimates are for planning only and are not tax advice.
5. Tax Settings

The user must be able to edit tax estimate rates.

Default starting rates:

selfEmploymentTaxRate = 0.153
federalTaxRate = 0.12

These are planning defaults only.

6. Taxable Income Rule

Tax estimate calculations must use net income from the selected pay period.

Formula:

estimatedTaxableIncome = max(netIncome, 0)

Negative net income must not create a negative estimated tax.

7. Self-Employment Tax Rule

Formula:

estimatedSelfEmploymentTax = estimatedTaxableIncome × selfEmploymentTaxRate
8. Federal Tax Rule

Formula:

estimatedFederalTax = estimatedTaxableIncome × federalTaxRate
9. Total Estimated Tax Rule

Formula:

estimatedTotalTax = estimatedSelfEmploymentTax + estimatedFederalTax
10. Estimated Take-Home Rule

Formula:

estimatedTakeHomeAfterTax = netIncome - estimatedTotalTax

If net income is negative, estimated take-home after tax should equal net income.

11. Expense Rule

Expenses may reduce net income inside the app.

The app must not claim that an expense is deductible.

Expense deductibility is outside the MVP scope.

12. Export Rule

Any export that includes tax estimates must include:

net income
self-employment tax estimate
federal tax estimate
total estimated tax
estimated take-home after tax
tax disclaimer
13. MVP Boundary

The MVP only provides rough planning estimates.

The MVP does not file taxes.

The MVP does not generate official tax forms.

The MVP does not determine legal deductions.

The MVP does not require paid tax software.