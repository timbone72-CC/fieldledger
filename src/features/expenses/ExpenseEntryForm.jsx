import { useState } from "react";
import { loadActivePayPeriod, saveActivePayPeriod } from "../pay-periods/activePayPeriodStorage.js";
import { EXPENSE_CATEGORIES } from "../../shared/constants/fieldLedgerDefaults.js";

export default function ExpenseEntryForm() {
  const [date, setDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  function saveExpense() {
    const payPeriod = loadActivePayPeriod();

    const expense = {
      id: crypto.randomUUID(),
      date,
      vendor,
      category,
      amount: Number(amount || 0),
      notes,
      createdAt: new Date().toISOString(),
    };

    saveActivePayPeriod({
      ...payPeriod,
      expenses: [...payPeriod.expenses, expense],
      updatedAt: new Date().toISOString(),
    });

    setDate("");
    setVendor("");
    setCategory(EXPENSE_CATEGORIES[0]);
    setAmount("");
    setNotes("");
    setSaveMessage("Expense saved. Refresh to update the summary.");
  }

  return (
    <section className="panel">
      <h2>Add Receipt / Expense</h2>

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
        Notes
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional notes"
          rows="3"
        />
      </label>

      <button type="button" onClick={saveExpense}>
        Save Expense
      </button>

      {saveMessage && <p className="helper">{saveMessage}</p>}
    </section>
  );
}
