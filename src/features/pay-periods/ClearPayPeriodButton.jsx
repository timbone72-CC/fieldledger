import { clearActivePayPeriod } from "./activePayPeriodStorage.js";

export default function ClearPayPeriodButton() {
  function handleClear() {
    const confirmed = window.confirm(
      "Clear the current pay period? This removes saved jobs and expenses from this browser."
    );

    if (!confirmed) {
      return;
    }

    clearActivePayPeriod();
    window.location.reload();
  }

  return (
    <button type="button" onClick={handleClear}>
      Clear Pay Period
    </button>
  );
}
