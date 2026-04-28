# FieldLedger Pay Contract

## 1. Purpose

This contract controls all job pay calculations in FieldLedger.

No pay calculation code may be added or changed unless it follows this contract.

## 2. Job Types

FieldLedger supports two MVP job types:

- Bucking
- Torque Turn

## 3. Hourly Rate Rule

The hourly rate is user-controlled.

The starting default hourly rate is:

    28

Each saved job must store the hourly rate used at the time the job is saved.

This is called the hourly rate snapshot.

Changing the user’s default hourly rate later must not change old saved job totals.

## 4. Bucking Pay Rule

Bucking jobs are paid by hours.

The app may provide default Bucking hours based on job state, but the user must be able to manually edit the hours before saving.

Default Bucking hours:

- Texas = 6 hours per job
- New Mexico = 8 hours per job

Required Bucking fields:

- buckingState
- jobsCompleted
- hoursPerJob
- hoursWorked
- hourlyRateSnapshot

Default hours formula:

hoursWorked = jobsCompleted × hoursPerJob

Pay formula:

buckingTotal = hoursWorked × hourlyRateSnapshot

Example Texas:

2 jobs × 6 hours = 12 hours
12 hours × $28 = $336

Example New Mexico:

2 jobs × 8 hours = 16 hours
16 hours × $28 = $448

Manual override rule:

The user may manually change hoursWorked before saving.

The saved Bucking job must use the final reviewed hoursWorked value, not blindly recalculate after the user edits it.

## 5. Torque Turn Pay Rule

Torque Turn jobs use base job pay plus extra hourly pay after the first 24 hours on that job.

Required fields:

- baseJobPay
- totalJobHours
- hourlyRateSnapshot

Formula:

    extraHours = max(totalJobHours - 24, 0)
    torqueTurnTotal = baseJobPay + (extraHours × hourlyRateSnapshot)

Example:

    baseJobPay = 1400
    totalJobHours = 31
    extraHours = 31 - 24 = 7
    extraPay = 7 × 28 = 196
    torqueTurnTotal = 1596

## 6. Pay Period Gross Earnings

Gross earnings are the total of all saved job totals inside the active pay period.

Formula:

    grossEarnings = sum(all job totals)

## 7. Manual Review Rule

All job pay values must be reviewable before saving.

The user must be able to manually correct:

- job type
- hours worked
- base job pay
- total job hours
- hourly rate snapshot
- calculated total if a correction is needed

## 8. Invalid Input Rule

Negative pay values are not allowed.

Negative hours are not allowed.

Blank numeric values may be treated as zero while editing, but required values must be checked before saving.

## 9. MVP Boundary

The MVP does not automatically read pay from handwritten tickets.

The MVP does not use AI.

The MVP does not use paid OCR.

The MVP starts with manual entry and local calculations.