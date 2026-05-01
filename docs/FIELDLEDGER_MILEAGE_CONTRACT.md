# FieldLedger Mileage Contract

## 1. Purpose

This contract controls mileage tracking and mileage estimate behavior in FieldLedger.

No mileage entry, mileage summary, mileage export, or mileage tax-planning feature may be added or changed unless it follows this contract.

## 2. Boundary

Mileage tracking is for recordkeeping and rough planning only.

FieldLedger must not claim that mileage is deductible.

FieldLedger may show mileage as:

- business mileage
- possible business mileage
- mileage deduction estimate

## 3. Required Mileage Fields

Each mileage entry must support:

- vehicle
- id
- payPeriodId
- date
- startLocation
- endLocation
- businessPurpose
- miles
- mileageRateSnapshot
- notes
- createdAt
- updatedAt

## 4. Mileage Rate Rule

Mileage rate must be user-editable.

Each saved mileage entry must store the mileage rate used at the time of saving.

Changing the mileage rate later must not change old saved mileage estimates.

## 5. Calculation Rule

Mileage estimate is calculated as:

```text
mileageEstimate = miles × mileageRateSnapshot

Pay-period mileage total is calculated as:

totalBusinessMiles = sum(all mileage entry miles)
totalMileageEstimate = sum(all mileage estimates)
6. Invalid Input Rule

Negative miles are not allowed.

Negative mileage rates are not allowed.

Blank numeric values may be treated as zero while editing, but saved records must use valid reviewed values.

7. Manual Review Rule

The user must be able to review and edit all mileage fields before saving.

8. Export Rule

Exports that include mileage must show:

date
start location
end location
business purpose
miles
mileage rate snapshot
mileage estimate
notes
9. MVP Boundary

Mileage must work offline.

Mileage must not require GPS.

Mileage must not require maps.

Mileage must not require paid APIs.

Mileage must not require AI or OCR.