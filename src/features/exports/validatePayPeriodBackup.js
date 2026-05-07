/**
 * 1. Pay Period Backup Validation
 *
 * Lightweight import pre-check for JSON backup files before replacing the active pay period.
 */

export function isValidPayPeriodBackup(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.schemaVersion === "number" &&
    Array.isArray(value.jobs) &&
    Array.isArray(value.expenses) &&
    Array.isArray(value.mileageEntries) &&
    value.jobs.every(isValidJob) &&
    value.expenses.every(isValidExpense) &&
    value.mileageEntries.every(isValidMileageEntry)
  );
}

/**
 * 2. Job Validation
 */

function isValidJob(job) {
  return (
    job &&
    typeof job === "object" &&
    typeof job.id === "string" &&
    typeof job.payPeriodId === "string" &&
    typeof job.date === "string" &&
    typeof job.company === "string" &&
    typeof job.rigNameOrNumber === "string" &&
    typeof job.fieldTicketNumber === "string" &&
    Number.isFinite(Number(job.transportation)) &&
    typeof job.ticketPhotoId === "string" &&
    typeof job.jobType === "string" &&
    typeof job.buckingState === "string" &&
    Number.isFinite(Number(job.jobsCompleted)) &&
    Number(job.jobsCompleted) >= 0 &&
    Number.isFinite(Number(job.hoursPerJob)) &&
    Number(job.hoursPerJob) >= 0 &&
    Number.isFinite(Number(job.hoursWorked)) &&
    Number(job.hoursWorked) >= 0 &&
    Number.isFinite(Number(job.baseJobPay)) &&
    Number(job.baseJobPay) >= 0 &&
    Number.isFinite(Number(job.additionalHours)) &&
    Number(job.additionalHours) >= 0 &&
    Number.isFinite(Number(job.hourlyRateSnapshot)) &&
    Number(job.hourlyRateSnapshot) >= 0 &&
    Number.isFinite(Number(job.totalPay)) &&
    Number(job.totalPay) >= 0 &&
    typeof job.updatedAt === "string" &&
    (
      typeof job.createdAt === "string" ||
      typeof job.createdAt === "undefined"
    )
  );
}

/**
 * 3. Expense Validation
 */

function isValidExpense(expense) {
  return (
    expense &&
    typeof expense === "object" &&
    typeof expense.id === "string" &&
    typeof expense.payPeriodId === "string" &&
    typeof expense.receiptPhotoId === "string" &&
    typeof expense.date === "string" &&
    typeof expense.vendor === "string" &&
    typeof expense.category === "string" &&
    Number.isFinite(Number(expense.amount)) &&
    Number(expense.amount) >= 0 &&
    typeof expense.notes === "string" &&
    typeof expense.updatedAt === "string" &&
    (
      typeof expense.createdAt === "string" ||
      typeof expense.createdAt === "undefined"
    )
  );
}

/**
 * 4. Mileage Entry Validation
 */

function isValidMileageEntry(entry) {
  return (
    entry &&
    typeof entry === "object" &&
    typeof entry.id === "string" &&
    typeof entry.payPeriodId === "string" &&
    typeof entry.date === "string" &&
    typeof entry.vehicle === "string" &&
    typeof entry.startLocation === "string" &&
    typeof entry.endLocation === "string" &&
    typeof entry.businessPurpose === "string" &&
    Number.isFinite(Number(entry.miles)) &&
    Number(entry.miles) > 0 &&
    Number.isFinite(Number(entry.mileageRateSnapshot)) &&
    Number(entry.mileageRateSnapshot) >= 0 &&
    typeof entry.notes === "string" &&
    typeof entry.createdAt === "string" &&
    typeof entry.updatedAt === "string"
  );
}
