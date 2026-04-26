import { useEffect, useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { EXPENSE_CATEGORIES } from "../../shared/constants/fieldLedgerDefaults.js";
import { loadPhotoBlob, savePhotoBlob } from "../../shared/storage/photoBlobStorage.js";

export default function ExpenseEntryForm() {
  const [editingExpenseId, setEditingExpenseId] = useState("");
  const [date, setDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptPhotoId, setReceiptPhotoId] = useState("");
  const [receiptPhotoFile, setReceiptPhotoFile] = useState(null);
  const [receiptPhotoPreviewUrl, setReceiptPhotoPreviewUrl] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    function loadExpenseForEditing(event) {
      const expense = event.detail?.expense;

      if (!expense) {
        return;
      }

      setEditingExpenseId(expense.id);
      setDate(expense.date || "");
      setVendor(expense.vendor || "");
      setCategory(expense.category || EXPENSE_CATEGORIES[0]);
      setAmount(String(expense.amount || ""));
      setNotes(expense.notes || "");
      setReceiptPhotoId(expense.receiptPhotoId || "");
      setReceiptPhotoFile(null);
      setSaveMessage("Editing saved expense. Make changes, then save.");
    }

    window.addEventListener("fieldledger:edit-expense", loadExpenseForEditing);

    return () => {
      window.removeEventListener("fieldledger:edit-expense", loadExpenseForEditing);
    };
  }, []);

  useEffect(() => {
    let previewUrl = "";

    async function loadReceiptPhotoPreview() {
      if (!receiptPhotoId || receiptPhotoFile) {
        setReceiptPhotoPreviewUrl("");
        return;
      }

      try {
        const photoRecord = await loadPhotoBlob(receiptPhotoId);

        if (!photoRecord?.blob) {
          setReceiptPhotoPreviewUrl("");
          return;
        }

        previewUrl = URL.createObjectURL(photoRecord.blob);
        setReceiptPhotoPreviewUrl(previewUrl);
      } catch {
        setReceiptPhotoPreviewUrl("");
      }
    }

    loadReceiptPhotoPreview();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [receiptPhotoId, receiptPhotoFile]);

  function resetForm(message) {
    setEditingExpenseId("");
    setDate("");
    setVendor("");
    setCategory(EXPENSE_CATEGORIES[0]);
    setAmount("");
    setNotes("");
    setReceiptPhotoId("");
    setReceiptPhotoFile(null);
    setReceiptPhotoPreviewUrl("");
    setSaveMessage(message);
  }

  async function saveExpense() {
    const payPeriod = loadActivePayPeriod();
    const existingExpenses = Array.isArray(payPeriod.expenses) ? payPeriod.expenses : [];
    const amountValue = Number(amount || 0);

    if (amountValue < 0) {
      setSaveMessage("Negative expense amounts are not allowed.");
      return;
    }

    let nextReceiptPhotoId = receiptPhotoId;

    if (receiptPhotoFile) {
      try {
        nextReceiptPhotoId = await savePhotoBlob(receiptPhotoFile);
      } catch {
        setSaveMessage("Receipt photo could not be saved. Expense was not saved.");
        return;
      }
    }

    const expense = {
      id: editingExpenseId || crypto.randomUUID(),
      payPeriodId: payPeriod.id,
      receiptPhotoId: nextReceiptPhotoId,
      date,
      vendor,
      category,
      amount: amountValue,
      notes,
      createdAt: editingExpenseId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextExpenses = editingExpenseId
      ? existingExpenses.map((existingExpense) => {
          if (existingExpense.id !== editingExpenseId) {
            return existingExpense;
          }

          return {
            ...existingExpense,
            ...expense,
            createdAt: existingExpense.createdAt,
          };
        })
      : [...existingExpenses, expense];

    saveActivePayPeriod({
      ...payPeriod,
      expenses: nextExpenses,
      updatedAt: new Date().toISOString(),
    });

    resetForm(
      editingExpenseId
        ? "Expense updated. Refresh to update the summary."
        : "Expense saved. Refresh to update the summary.",
    );

    window.location.reload();
  }

  function cancelEdit() {
    resetForm("");
  }

  return (
    <section className="panel">
      <h2>{editingExpenseId ? "Edit Receipt / Expense" : "Add Receipt / Expense"}</h2>

      <label className="field">
        Date
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>

      <label className="field">
        Vendor
        <input
          type="text"
          value={vendor}
          onChange={(event) => setVendor(event.target.value)}
          placeholder="Example: Loves, Walmart, AutoZone"
        />
      </label>

      <label className="field">
        Category
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {EXPENSE_CATEGORIES.map((expenseCategory) => (
            <option key={expenseCategory} value={expenseCategory}>
              {expenseCategory}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        Amount
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
        />
      </label>

      <label className="field">
        Receipt Photo
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            setReceiptPhotoFile(event.target.files?.[0] || null);
          }}
        />
      </label>

      {receiptPhotoId && !receiptPhotoFile && (
        <p className="helper">Receipt photo already attached.</p>
      )}

      {receiptPhotoPreviewUrl && (
        <img
          src={receiptPhotoPreviewUrl}
          alt="Attached receipt preview"
          style={{
            display: "block",
            maxWidth: "240px",
            maxHeight: "240px",
            marginTop: "0.75rem",
            borderRadius: "0.75rem",
            border: "1px solid #d8d4ef",
          }}
        />
      )}

      {receiptPhotoFile && (
        <p className="helper">Selected receipt photo: {receiptPhotoFile.name}</p>
      )}

      <label className="field">
        Notes
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional notes"
          rows="3"
        />
      </label>

      <button type="button" onClick={saveExpense}>
        {editingExpenseId ? "Save Expense Changes" : "Save Expense"}
      </button>

      {editingExpenseId && (
        <button type="button" onClick={cancelEdit}>
          Cancel Edit
        </button>
      )}

      {saveMessage && <p className="helper">{saveMessage}</p>}
    </section>
  );
}
