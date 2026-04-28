# FieldLedger Ticket Contract
1. Purpose

This contract controls job ticket records in FieldLedger.

No job ticket screen, job ticket data model, or ticket photo behavior may be added or changed unless it follows this contract.

2. Ticket Scope

A ticket represents one saved job entry inside a pay period.

Each ticket must belong to one pay period.

Each ticket must have one job type:

Bucking
Torque Turn
3. Required Shared Ticket Fields

Every ticket entry must support:

id
payPeriodId
jobType
date
company
rigNameOrNumber
fieldTicketNumber
transportation
ticketPhotoId
notes
createdAt
updatedAt
4. Company Rule

Company must come from the job ticket field labeled:

Ordered By

If the app cannot read this automatically, the user must enter it manually.

5. Bucking Ticket Fields

Bucking tickets require:

hoursWorked
hourlyRateSnapshot
totalPay

Bucking tickets do not require base job pay.

Formula authority belongs to:

docs/FIELDLEDGER_PAY_CONTRACT.md
6. Torque Turn Ticket Fields

Torque Turn tickets require:

baseJobPay
additionalHours
hourlyRateSnapshot
additionalHours
totalPay

Torque Turn extra hours begin only after the first 24 hours on that job.

Formula authority belongs to:

docs/FIELDLEDGER_PAY_CONTRACT.md
7. Transportation Rule

Transportation is entered manually.

Transportation is recorded for the company/pay sheet.

Transportation is not added to user earnings.

8. Photo Rule

A ticket may have a photo attached.

Ticket photos are evidence/reference files.

The MVP must not require OCR or AI to create a ticket.

9. Manual Review Rule

Before saving a ticket, the user must be able to review and edit:

job type
date
company
rig name or number
field ticket number
transportation
hours worked
base job pay
total job hours
notes
ticket photo
10. AI-Free MVP Rule

The MVP must work with manual entry.

Any future OCR or AI feature must be optional.

Any future extracted result must require manual review before saving.

11. Invalid Input Rule

A ticket should not be saved unless the required fields for its job type are valid.

Negative hours are not allowed.

Negative pay values are not allowed.

Blank numeric values may be treated as zero while editing.

12. MVP Boundary

The MVP supports manual job ticket entry and optional photo attachment.

The MVP does not require:

AI
OCR
paid APIs
cloud storage
user accounts