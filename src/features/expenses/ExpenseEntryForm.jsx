import { useEffect, useRef, useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { EXPENSE_CATEGORIES } from "../../shared/constants/fieldLedgerDefaults.js";
import { deletePhotoBlob, loadPhotoBlob, savePhotoBlob } from "../../shared/storage/photoBlobStorage.js";
import CameraCapture from "../../shared/components/CameraCapture.jsx";

export default function ExpenseEntryForm({ onExpenseSaved }) {
  const receiptPhotoInputRef = useRef(null);
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
      if (receiptPhotoInputRef.current) {
        receiptPhotoInputRef.current.value = "";
      }
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


  useEffect(() => {
    if (!receiptPhotoFile) {
      return;
    }

    const previewUrl = URL.createObjectURL(receiptPhotoFile);
    setReceiptPhotoPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [receiptPhotoFile]);

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
    if (receiptPhotoInputRef.current) {
      receiptPhotoInputRef.current.value = "";
    }
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

    const saved = saveActivePayPeriod({
      ...payPeriod,
      expenses: nextExpenses,
      updatedAt: new Date().toISOString(),
    });

    if (!saved) {
      setSaveMessage("Expense could not be saved.");
      return;
    }

    resetForm(
      editingExpenseId
        ? "Expense updated."
        : "Expense saved.",
    );

    if (typeof onExpenseSaved === "function") {
      onExpenseSaved();
    }
  }

  async function removeReceiptPhoto() {
    if (!receiptPhotoId) {
      setReceiptPhotoFile(null);
      setReceiptPhotoPreviewUrl("");
      return;
    }

    const confirmed = window.confirm("Remove this receipt photo from the saved expense?");

    if (!confirmed) {
      return;
    }

    try {
      await deletePhotoBlob(receiptPhotoId);
    } catch {
      setSaveMessage("Receipt photo reference was removed, but the stored photo could not be deleted.");
    }

    setReceiptPhotoId("");
    setReceiptPhotoFile(null);
    setReceiptPhotoPreviewUrl("");
    setSaveMessage("Receipt photo removed. Save expense changes to keep this update.");
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

      <CameraCapture
        label="Take Receipt Photo"
        onPhotoCaptured={(photoFile) => {
          setReceiptPhotoFile(photoFile);

          if (receiptPhotoInputRef.current) {
            receiptPhotoInputRef.current.value = "";
          }
        }}
      />

      <label className="field">
        Upload Receipt Photo
        <input
          ref={receiptPhotoInputRef}
          type="file"
          accept="image/*"
          capture="environment"
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

      {(receiptPhotoId || receiptPhotoFile) && (
        <button type="button" onClick={removeReceiptPhoto}>
          Remove Receipt Photo
        </button>
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
