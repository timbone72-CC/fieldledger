export function calculateJobPay(job) {
  const jobType = job?.jobType;
  const hourlyRateSnapshot = safeNumber(job?.hourlyRateSnapshot);

  if (jobType === "bucking") {
    const hoursWorked = safeNumber(job?.hoursWorked);
    return hoursWorked * hourlyRateSnapshot;
  }

  if (jobType === "torque_turn") {
    const baseJobPay = safeNumber(job?.baseJobPay);
    const totalJobHours = safeNumber(job?.totalJobHours);
    const extraHours = Math.max(totalJobHours - 24, 0);

    return baseJobPay + extraHours * hourlyRateSnapshot;
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
