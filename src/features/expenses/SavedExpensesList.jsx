import { useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

export default function SavedExpensesList() {
  const payPeriod = loadActivePayPeriod();
  const expenses = Array.isArray(payPeriod.expenses) ? payPeriod.expenses : [];
  const [selectedExpenseIds, setSelectedExpenseIds] = useState([]);

  function toggleExpenseSelection(expenseId) {
    setSelectedExpenseIds((currentIds) => {
      if (currentIds.includes(expenseId)) {
        return currentIds.filter((id) => id !== expenseId);
      }

      return [...currentIds, expenseId];
    });
  }

  function deleteSelectedExpenses() {
    const selectedCount = selectedExpenseIds.length;
    const confirmed = window.confirm(`Delete ${selectedCount} selected expense(s)?`);

    if (!confirmed) {
      return;
    }

    const latestPayPeriod = loadActivePayPeriod();
    const latestExpenses = Array.isArray(latestPayPeriod.expenses)
      ? latestPayPeriod.expenses
      : [];

    saveActivePayPeriod({
      ...latestPayPeriod,
      expenses: latestExpenses.filter((expense) => !selectedExpenseIds.includes(expense.id)),
      updatedAt: new Date().toISOString(),
    });

    window.location.reload();
  }

  return (
    <section className="panel">
      <h2>Saved Expenses</h2>

      {expenses.length === 0 ? (
        <p className="helper">No expenses saved yet.</p>
      ) : (
        <>
          <button
            type="button"
            onClick={deleteSelectedExpenses}
            disabled={selectedExpenseIds.length === 0}
          >
            Delete Selected Expenses
          </button>

          <div className="list">
            {expenses.map((expense) => (
              <label className="result-card" key={expense.id}>
                <input
                  type="checkbox"
                  checked={selectedExpenseIds.includes(expense.id)}
                  onChange={() => toggleExpenseSelection(expense.id)}
                />
                <span>{formatExpenseLabel(expense)}</span>
                <strong>${Number(expense.amount || 0).toFixed(2)}</strong>
              </label>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function formatExpenseLabel(expense) {
  const vendor = expense.vendor || "Expense";
  const category = expense.category || "Other";

  return `${vendor} — ${category}`;
}
