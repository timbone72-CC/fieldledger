export default function PrintPayPeriodReportButton() {
  function handlePrintFull() {
    window.print();
  }

  return (
    <button type="button" onClick={handlePrintFull}>
      Print Full Report
    </button>
  );
}
