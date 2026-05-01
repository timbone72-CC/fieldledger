export function calculateMileageSummary(mileageEntries) {
  const entries = Array.isArray(mileageEntries) ? mileageEntries : [];

  return entries.reduce(
    (summary, entry) => {
      const miles = Number(entry?.miles) || 0;
      const mileageRateSnapshot = Number(entry?.mileageRateSnapshot) || 0;
      const mileageEstimate = miles * mileageRateSnapshot;

      return {
        totalBusinessMiles: summary.totalBusinessMiles + miles,
        totalMileageEstimate: Number((summary.totalMileageEstimate + mileageEstimate).toFixed(2)),
      };
    },
    {
      totalBusinessMiles: 0,
      totalMileageEstimate: 0,
    }
  );
}
