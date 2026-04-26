import { loadActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";

export default function SavedExpensesList() {
  const payPeriod = loadActivePayPeriod();
  const expenses = Array.isArray(payPeriod.expenses) ? payPeriod.expenses : [];

  return (
    <section className="panel">
      <h2>Saved Expenses</h2>

      {expenses.length === 0 ? (
        <p className="helper">No expenses saved yet.</p>
      ) : (
        <div className="list">
          {expenses.map((expense) => (
            <div className="result-card" key={expense.id}>
              <span>{formatExpenseLabel(expense)}</span>
              <strong>${Number(expense.amount || 0).toFixed(2)}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatExpenseLabel(expense) {
  const vendor = expense.vendor || "Expense";
  const category = expense.category || "Other";

  return `${vendor} — ${category}`;
}
