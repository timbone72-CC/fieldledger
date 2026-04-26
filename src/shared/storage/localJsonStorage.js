export function loadJson(key, fallbackValue) {
  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch {
    return fallbackValue;
  }
}

export function saveJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeJson(key) {
  window.localStorage.removeItem(key);
}
