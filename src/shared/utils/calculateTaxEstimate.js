export function calculateTaxEstimate(summary, settings = {}) {
  const netIncome = safeNumber(summary?.netIncome);
  const selfEmploymentTaxRate = safeRate(settings?.selfEmploymentTaxRate, 0.153);
  const federalTaxRate = safeRate(settings?.federalTaxRate, 0.12);

  const estimatedTaxableIncome = Math.max(netIncome, 0);
  const estimatedSelfEmploymentTax = estimatedTaxableIncome * selfEmploymentTaxRate;
  const estimatedFederalTax = estimatedTaxableIncome * federalTaxRate;
  const estimatedTotalTax = estimatedSelfEmploymentTax + estimatedFederalTax;
  const estimatedTakeHomeAfterTax =
    netIncome < 0 ? netIncome : netIncome - estimatedTotalTax;

  return {
    estimatedTaxableIncome,
    estimatedSelfEmploymentTax,
    estimatedFederalTax,
    estimatedTotalTax,
    estimatedTakeHomeAfterTax,
  };
}

function safeNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}

function safeRate(value, fallback) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return fallback;
  }

  return number;
}
