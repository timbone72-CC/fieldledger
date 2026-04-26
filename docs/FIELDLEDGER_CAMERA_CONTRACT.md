# FieldLedger Camera Contract
1. Purpose

This contract controls camera and photo capture behavior in FieldLedger.

No camera, photo upload, ticket image, or receipt image feature may be added or changed unless it follows this contract.

2. Camera Scope

The app should allow the user to attach photos to:

job tickets
receipts

Photos are supporting records.

Photos are not required for the MVP's manual calculations.

3. Capture Methods

The app may support:

taking a photo from inside the app
selecting an existing image from the device

Phone browser support is preferred.

4. Offline Rule

Photo capture must not require a paid service.

Photo capture must not require AI.

Photo capture must not require OCR.

Photo capture should work locally when the browser/device supports it.

5. Manual Entry Rule

Taking a photo does not replace manual entry.

The user must still be able to enter and review all job or receipt fields before saving.

6. Ticket Photo Rule

A ticket photo may attach to a job record.

The ticket record must still save structured fields such as:

date
company
rig name or number
field ticket number
job type
pay values
7. Receipt Photo Rule

A receipt photo may attach to an expense record.

The expense record must still save structured fields such as:

date
vendor
category
amount
8. Photo Storage Rule

Photos should be stored by reference.

Large image/blob storage should prefer IndexedDB over localStorage.

9. Privacy Rule

Photos should stay on the user's device for the MVP.

The MVP must not upload photos to cloud services.

10. Future OCR Rule

Future OCR may read photos later.

OCR must be optional.

OCR must not be required for MVP use.

OCR results must require manual review before saving.

11. MVP Boundary

The MVP may start with file attachment before full camera capture.

The MVP does not require:

AI
OCR
cloud upload
paid camera service
user accounts