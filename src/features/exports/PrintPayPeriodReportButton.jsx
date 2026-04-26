export default function PrintPayPeriodReportButton() {
  function printReport() {
    window.print();
  }

  return (
    <button type="button" onClick={printReport}>
      Print / Save PDF Report
    </button>
  );
}
