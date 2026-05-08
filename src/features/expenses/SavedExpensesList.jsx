import { useEffect, useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { loadPhotoBlob } from "../../shared/storage/photoBlobStorage.js";

export default function SavedExpensesList({ onExpenseDeleted }) {
  const payPeriod = loadActivePayPeriod();
  const expenses = Array.isArray(payPeriod.expenses) ? payPeriod.expenses : [];
  const expensePreviewKey = expenses
    .map((expense) => {
      const receiptPhotos = getExpenseReceiptPhotos(expense);

      return `${expense.id}:${receiptPhotos.map((photo) => photo.id).join(",")}`;
    })
    .join("|");
  const [selectedExpenseIds, setSelectedExpenseIds] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});

  useEffect(() => {
    let active = true;
    const urls = {};

    async function loadPreviews() {
      for (const expense of expenses) {
        const receiptPhotos = getExpenseReceiptPhotos(expense);

        if (receiptPhotos.length === 0) {
          continue;
        }

        urls[expense.id] = [];

        for (const receiptPhoto of receiptPhotos) {
          try {
            const record = await loadPhotoBlob(receiptPhoto.id);

            if (record?.blob) {
              urls[expense.id].push({
                id: receiptPhoto.id,
                name: receiptPhoto.name || "Receipt photo",
                url: URL.createObjectURL(record.blob),
              });
            }
          } catch {
            // ignore broken preview
          }
        }
      }

      if (active) {
        setPreviewUrls(urls);
      }
    }

    loadPreviews();

    return () => {
      active = false;
      Object.values(urls).forEach((photoList) => {
        photoList.forEach((photo) => URL.revokeObjectURL(photo.url));
      });
    };
  }, [expensePreviewKey]);

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

    const saved = saveActivePayPeriod({
      ...latestPayPeriod,
      expenses: latestExpenses.filter((expense) => !selectedExpenseIds.includes(expense.id)),
      updatedAt: new Date().toISOString(),
    });

    if (!saved) {
      return;
    }

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

                  {previewUrls[expense.id]?.map((photo) => (
                    <div key={photo.id} style={{ marginTop: "0.75rem" }}>
                      <img
                        src={photo.url}
                        alt={photo.name}
                        style={{
                          display: "block",
                          maxWidth: "120px",
                          borderRadius: "0.5rem",
                          border: "1px solid #d8d4ef",
                        }}
                      />

                      <p className="helper">{photo.name}</p>
                    </div>
                  ))}
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


function getExpenseReceiptPhotos(expense) {
  if (Array.isArray(expense.receiptPhotos)) {
    return expense.receiptPhotos.filter((photo) => photo?.id);
  }

  if (expense.receiptPhotoId) {
    return [
      {
        id: expense.receiptPhotoId,
        name: expense.receiptPhotoName || "Receipt photo",
      },
    ];
  }

  return [];
}
