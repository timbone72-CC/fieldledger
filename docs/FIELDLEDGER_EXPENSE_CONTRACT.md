# FieldLedger Expense Contract

## 1. Purpose

This contract controls receipt and expense tracking in FieldLedger.

No expense, receipt, net income, or tax-related expense code may be added or changed unless it follows this contract.

## 2. Expense Scope

Expenses are saved inside a pay period.

Expenses reduce net income but do not change gross earnings.

Formula:

    netIncome = grossEarnings - expenseTotal

## 3. Required Expense Fields

Each expense entry must support:

- id
- payPeriodId
- date
- vendor
- category
- amount
- receiptPhotos when photo support exists

Each receipt photo entry must support:

- id
- name

Expense entries must also support:

- notes
- createdAt
- updatedAt

## 4. Expense Categories

MVP categories:

- Fuel
- Food
- Tools
- Lodging
- Supplies
- Other

The app may suggest categories later, but the MVP must allow manual category selection.

## 5. Receipt Photo Rule

Receipt photos may be attached to expense entries.

The MVP must not require receipt OCR.

Receipt data must be manually reviewable before saving.

## 6. Manual Review Rule

The user must be able to review and edit:

- date
- vendor
- category
- amount
- notes
- receipt photos when photo support exists

before saving the expense.

## 7. Expense Total Rule

Expense total is the sum of all expense amounts inside the selected pay period.

Formula:

    expenseTotal = sum(all expense amounts in pay period)

## 8. Invalid Input Rule

Negative expense amounts are not allowed.

Blank amount values may be treated as zero while editing, but an expense should not be saved without a valid amount unless the user intentionally saves it as zero.

## 9. 1099 Planning Rule

Expenses are tracked for planning and recordkeeping.

The app must not claim that an expense is deductible.

The app may label expenses as possible 1099 expenses, but must not give tax advice.

## 10. MVP Boundary

The MVP does not require AI.

The MVP does not require paid OCR.

The MVP does not require cloud storage.

The MVP starts with manual receipt entry and local calculations.