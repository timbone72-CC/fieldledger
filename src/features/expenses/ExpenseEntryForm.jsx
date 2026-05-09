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
  const [receiptPhotos, setReceiptPhotos] = useState([]);
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
      setReceiptPhotos(normalizeReceiptPhotos(expense));
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
    let active = true;
    const createdPreviewUrls = [];

    async function loadSavedReceiptPhotoPreviews() {
      const nextReceiptPhotos = [];

      for (const receiptPhoto of receiptPhotos) {
        if (receiptPhoto.file || receiptPhoto.previewUrl || !receiptPhoto.id) {
          nextReceiptPhotos.push(receiptPhoto);
          continue;
        }

        try {
          const photoRecord = await loadPhotoBlob(receiptPhoto.id);

          if (!photoRecord?.blob) {
            nextReceiptPhotos.push(receiptPhoto);
            continue;
          }

          const previewUrl = URL.createObjectURL(photoRecord.blob);
          createdPreviewUrls.push(previewUrl);
          nextReceiptPhotos.push({
            ...receiptPhoto,
            previewUrl,
          });
        } catch {
          nextReceiptPhotos.push(receiptPhoto);
        }
      }

      if (active) {
        setReceiptPhotos(nextReceiptPhotos);
      }
    }

    loadSavedReceiptPhotoPreviews();

    return () => {
      active = false;
      createdPreviewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, [receiptPhotos.map((receiptPhoto) => receiptPhoto.id || receiptPhoto.localId).join("|")]);

  function resetForm(message) {
    receiptPhotos.forEach((receiptPhoto) => {
      if (receiptPhoto.previewUrl && receiptPhoto.file) {
        URL.revokeObjectURL(receiptPhoto.previewUrl);
      }
    });

    setEditingExpenseId("");
    setDate("");
    setVendor("");
    setCategory(EXPENSE_CATEGORIES[0]);
    setAmount("");
    setNotes("");
    setReceiptPhotos([]);
    if (receiptPhotoInputRef.current) {
      receiptPhotoInputRef.current.value = "";
    }
    setSaveMessage(message);
  }

  function addReceiptPhotoFiles(files) {
    const nextPhotos = Array.from(files || []).map((file) => ({
      localId: crypto.randomUUID(),
      id: "",
      name: file.name || "Receipt photo",
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    if (nextPhotos.length === 0) {
      return;
    }

    setReceiptPhotos((currentPhotos) => [...currentPhotos, ...nextPhotos]);
    setSaveMessage("Receipt photo added. Review and name it before saving.");
  }

  function updateReceiptPhotoName(photoKey, name) {
    setReceiptPhotos((currentPhotos) =>
      currentPhotos.map((receiptPhoto) => {
        if (getReceiptPhotoKey(receiptPhoto) !== photoKey) {
          return receiptPhoto;
        }

        return {
          ...receiptPhoto,
          name,
        };
      }),
    );
  }

  async function removeReceiptPhoto(photoKey) {
    const receiptPhoto = receiptPhotos.find(
      (currentPhoto) => getReceiptPhotoKey(currentPhoto) === photoKey,
    );

    if (!receiptPhoto) {
      return;
    }

    const confirmed = window.confirm("Remove this receipt photo from the expense?");

    if (!confirmed) {
      return;
    }

    if (receiptPhoto.id) {
      try {
        await deletePhotoBlob(receiptPhoto.id);
      } catch {
        setSaveMessage("Receipt photo reference was removed, but the stored photo could not be deleted.");
      }
    }

    if (receiptPhoto.previewUrl && receiptPhoto.file) {
      URL.revokeObjectURL(receiptPhoto.previewUrl);
    }

    setReceiptPhotos((currentPhotos) =>
      currentPhotos.filter((currentPhoto) => getReceiptPhotoKey(currentPhoto) !== photoKey),
    );
    setSaveMessage("Receipt photo removed. Save expense changes to keep this update.");
  }

  async function saveExpense() {
    const payPeriod = loadActivePayPeriod();
    const existingExpenses = Array.isArray(payPeriod.expenses) ? payPeriod.expenses : [];
    const amountValue = Number(amount || 0);

    if (amountValue < 0) {
      setSaveMessage("Negative expense amounts are not allowed.");
      return;
    }

    let nextReceiptPhotos = [];

    try {
      nextReceiptPhotos = await Promise.all(
        receiptPhotos.map(async (receiptPhoto) => {
          const id = receiptPhoto.file
            ? await savePhotoBlob(receiptPhoto.file)
            : receiptPhoto.id;

          return {
            id,
            name: receiptPhoto.name || receiptPhoto.file?.name || "Receipt photo",
          };
        }),
      );
    } catch {
      setSaveMessage("One or more receipt photos could not be saved. Expense was not saved.");
      return;
    }

    const expense = {
      id: editingExpenseId || crypto.randomUUID(),
      payPeriodId: payPeriod.id,
      receiptPhotos: nextReceiptPhotos,
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
          addReceiptPhotoFiles([photoFile]);

          if (receiptPhotoInputRef.current) {
            receiptPhotoInputRef.current.value = "";
          }
        }}
      />

      <label className="field">
        Upload Receipt Photos
        <input
          ref={receiptPhotoInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            addReceiptPhotoFiles(event.target.files);

            if (receiptPhotoInputRef.current) {
              receiptPhotoInputRef.current.value = "";
            }
          }}
        />
      </label>

      {receiptPhotos.length > 0 && (
        <div className="attached-photo-preview">
          <h3>Attached Photos</h3>
          <p className="helper">Review and name each receipt photo before saving.</p>

          {receiptPhotos.map((receiptPhoto) => {
            const photoKey = getReceiptPhotoKey(receiptPhoto);

            return (
              <div className="result-card" key={photoKey}>
                {receiptPhoto.previewUrl && (
                  <img
                    src={receiptPhoto.previewUrl}
                    alt="Attached receipt preview"
                    style={{
                      display: "block",
                      maxWidth: "240px",
                      maxHeight: "240px",
                      margin: "0.75rem auto 0",
                      borderRadius: "0.75rem",
                      border: "1px solid #d8d4ef",
                    }}
                  />
                )}

                <label className="field">
                  Receipt Photo Name
                  <input
                    type="text"
                    value={receiptPhoto.name}
                    onChange={(event) => updateReceiptPhotoName(photoKey, event.target.value)}
                    placeholder="Example: Fuel receipt, Hotel receipt, Tool receipt"
                  />
                </label>

                <button type="button" onClick={() => removeReceiptPhoto(photoKey)}>
                  Remove Photo
                </button>
              </div>
            );
          })}
        </div>
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

function normalizeReceiptPhotos(expense) {
  if (Array.isArray(expense.receiptPhotos)) {
    return expense.receiptPhotos
      .filter((receiptPhoto) => receiptPhoto?.id)
      .map((receiptPhoto) => ({
        localId: crypto.randomUUID(),
        id: receiptPhoto.id,
        name: receiptPhoto.name || "Receipt photo",
        file: null,
        previewUrl: "",
      }));
  }

  if (expense.receiptPhotoId) {
    return [
      {
        localId: crypto.randomUUID(),
        id: expense.receiptPhotoId,
        name: expense.receiptPhotoName || "Receipt photo",
        file: null,
        previewUrl: "",
      },
    ];
  }

  return [];
}

function getReceiptPhotoKey(receiptPhoto) {
  return receiptPhoto.id || receiptPhoto.localId;
}