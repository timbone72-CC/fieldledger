export default function PrintPayPeriodReportButton({ setPrintMode }) {
  function handlePrintFullReport() {
    if (setPrintMode) {
      setPrintMode("full-report");
    }

    document.body.classList.add("print-full-report");

    setTimeout(() => {
      window.print();
      document.body.classList.remove("print-full-report");
    }, 50);
  }

  return (
    <button type="button" onClick={handlePrintFullReport}>
      Print Full Report
    </button>
  );
}
