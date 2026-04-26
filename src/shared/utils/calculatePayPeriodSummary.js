import { calculateJobPay } from "./calculateJobPay.js";

export function calculatePayPeriodSummary(payPeriod) {
  const jobs = Array.isArray(payPeriod?.jobs) ? payPeriod.jobs : [];
  const expenses = Array.isArray(payPeriod?.expenses) ? payPeriod.expenses : [];

  const grossEarnings = jobs.reduce((total, job) => {
    return total + calculateJobPay(job);
  }, 0);

  const expenseTotal = expenses.reduce((total, expense) => {
    return total + safeNumber(expense?.amount);
  }, 0);

  return {
    grossEarnings,
    expenseTotal,
    netIncome: grossEarnings - expenseTotal,
    jobCount: jobs.length,
    expenseCount: expenses.length,
  };
}

function safeNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(number, 0);
}
