import { useEffect, useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { loadPhotoBlob } from "../../shared/storage/photoBlobStorage.js";

export default function SavedExpensesList({ onExpenseDeleted }) {
  const payPeriod = loadActivePayPeriod();
  const expenses = Array.isArray(payPeriod.expenses) ? payPeriod.expenses : [];
  const [selectedExpenseIds, setSelectedExpenseIds] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});

  useEffect(() => {
    let active = true;
    const urls = {};

    async function loadPreviews() {
      for (const expense of expenses) {
        if (!expense.receiptPhotoId) continue;

        try {
          const record = await loadPhotoBlob(expense.receiptPhotoId);
          if (record?.blob) {
            urls[expense.id] = URL.createObjectURL(record.blob);
          }
        } catch {
          // ignore broken preview
        }
      }

      if (active) {
        setPreviewUrls(urls);
      }
    }

    loadPreviews();

    return () => {
      active = false;
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [expenses]);

  function editSelectedExpense() {
    const selectedExpenseId = selectedExpenseIds[0];
    const selectedExpense = expenses.find((expense) => expense.id === selectedExpenseId);

    if (!selectedExpense || selectedExpenseIds.length !== 1) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("fieldledger:edit-expense", {
        detail: { expense: selectedExpense },
      }),
    );
  }

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

    if (typeof onExpenseDeleted === "function") {
      onExpenseDeleted();
    }
  }

  return (
    <section className="panel">
      <h2>Saved Expenses</h2>

      {expenses.length === 0 ? (
        <p className="helper">No expenses saved yet.</p>
      ) : (
        <>
          <div className="section-actions">
            <button
              type="button"
              onClick={editSelectedExpense}
              disabled={selectedExpenseIds.length !== 1}
            >
              Edit Selected Expense
            </button>

            <button
              type="button"
              onClick={deleteSelectedExpenses}
              disabled={selectedExpenseIds.length === 0}
            >
              Delete Selected Expenses
            </button>
          </div>

          <div className="list">
            {expenses.map((expense) => (
              <label className="result-card" key={expense.id}>
                <input
                  type="checkbox"
                  checked={selectedExpenseIds.includes(expense.id)}
                  onChange={() => toggleExpenseSelection(expense.id)}
                />

                <div>
                  <span>{formatExpenseLabel(expense)}</span>
                  <strong>${Number(expense.amount || 0).toFixed(2)}</strong>

                  {previewUrls[expense.id] && (
                    <img
                      src={previewUrls[expense.id]}
                      alt="Receipt preview"
                      style={{
                        display: "block",
                        maxWidth: "120px",
                        marginTop: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d8d4ef",
                      }}
                    />
                  )}
                </div>
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
