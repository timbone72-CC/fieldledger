export function calculateJobPay(job) {
  const jobType = job?.jobType;
  const hourlyRateSnapshot = safeNumber(job?.hourlyRateSnapshot);

  if (jobType === "bucking") {
    const hoursWorked = safeNumber(job?.hoursWorked);
    return hoursWorked * hourlyRateSnapshot;
  }

  if (jobType === "torque_turn") {
    const baseJobPay = safeNumber(job?.baseJobPay);
    const additionalHours = safeNumber(job?.additionalHours ?? job?.totalJobHours);

    return baseJobPay + additionalHours * hourlyRateSnapshot;
  }

  return 0;
}

function safeNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(number, 0);
}
