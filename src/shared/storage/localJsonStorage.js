export function loadJson(key, fallbackValue) {
  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch {
    if (typeof window.alert === "function") {
      window.alert(
        "FieldLedger found corrupted saved data and loaded a safe blank version instead. If you have a backup JSON file, use Import JSON to restore it."
      );
    }

    return fallbackValue;
  }
}

export function saveJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    window.alert("FieldLedger could not save this data. Your browser storage may be full or blocked.");
    return false;
  }
}

export function removeJson(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    window.alert("FieldLedger could not remove this data. Your browser storage may be blocked.");
    return false;
  }
}
