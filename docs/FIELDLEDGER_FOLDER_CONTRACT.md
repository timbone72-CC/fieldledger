# FieldLedger Folder Contract

## 1. Purpose

This contract defines where app files belong so FieldLedger does not become messy or mixed across unrelated features.

Every feature must live in the correct folder.

## 2. Root Files

```text
README.md
package.json
vite.config.js
index.html

Root files are for project setup only.

Feature logic must not be placed directly in the project root.

3. Documentation Folder
docs/

The docs folder stores contracts, roadmaps, system maps, and project authority documents.

Required docs:

docs/FIELDLEDGER_MASTER_CONTRACT.md
docs/FIELDLEDGER_FOLDER_CONTRACT.md
docs/FIELDLEDGER_SYSTEM_MAP.md
docs/FIELDLEDGER_ROADMAP.md
docs/FIELDLEDGER_PAY_CONTRACT.md
docs/FIELDLEDGER_EXPENSE_CONTRACT.md
docs/FIELDLEDGER_TICKET_CONTRACT.md
docs/FIELDLEDGER_EXPORT_CONTRACT.md
4. Source Folder
src/

The src folder stores all app code.

5. Feature Folders

FieldLedger app features must be separated by responsibility.

Required feature folders:

src/features/pay-periods/
src/features/jobs/
src/features/receipts/
src/features/expenses/
src/features/exports/
src/features/settings/
src/features/camera/
6. Shared Folders

Shared code must go in shared folders.

src/shared/components/
src/shared/utils/
src/shared/storage/
src/shared/constants/
7. Contract Rule

No feature may be expanded before its contract exists.

Examples:

Pay logic must follow FIELDLEDGER_PAY_CONTRACT.md
Receipt logic must follow FIELDLEDGER_EXPENSE_CONTRACT.md
Ticket/photo logic must follow FIELDLEDGER_TICKET_CONTRACT.md
Export logic must follow FIELDLEDGER_EXPORT_CONTRACT.md
8. No Mixing Rule

Do not mix unrelated logic in one file.

Examples:

Pay calculation logic must not live inside camera files.
Receipt expense logic must not live inside job ticket files.
Export logic must not live inside pay-period screen files.
Tax estimate logic must not be hidden inside UI components.
9. One File, One Job Rule

Each file should have one clear purpose.

Good examples:

calculateJobPay.js
calculatePayPeriodSummary.js
expenseCategories.js
receiptStorage.js
cameraCapture.js

Bad examples:

helpers.js
misc.js
stuff.js
allLogic.js
10. MVP Folder Scope

For the MVP, the app should start with these folders only:

docs/
src/features/pay-periods/
src/features/jobs/
src/features/receipts/
src/features/expenses/
src/features/settings/
src/shared/utils/
src/shared/storage/
src/shared/constants/

The camera and export folders may be added when those features begin.