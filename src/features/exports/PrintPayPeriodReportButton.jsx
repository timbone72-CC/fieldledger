export default function PrintPayPeriodReportButton({ setPrintMode }) {
  function handlePrintFull() {
    if (setPrintMode) {
      setPrintMode("full");
    }

    setTimeout(() => {
      window.print();
    }, 50);
  }

  return (
    <button type="button" onClick={handlePrintFull}>
      Print Full Report
    </button>
  );
}
