import assert from "node:assert/strict";
import { loadJson, saveJson } from "./localJsonStorage.js";

const storage = new Map();

let latestAlertMessage = "";

global.window = {
  alert(message) {
    latestAlertMessage = message;
  },
  localStorage: {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, value);
    },
    removeItem(key) {
      storage.delete(key);
    },
  },
};

storage.set("bad-json", "{broken");

const fallbackValue = { safe: true };
const loadedFallbackValue = loadJson("bad-json", fallbackValue);

assert.deepEqual(loadedFallbackValue, fallbackValue);

const savedValue = {
  label: "Storage Test",
  jobs: [{ id: "job-1", totalPay: 168 }],
};

const saveResult = saveJson("good-json", savedValue);
const loadedSavedValue = loadJson("good-json", null);

assert.equal(saveResult, true);
assert.deepEqual(loadedSavedValue, savedValue);

global.window.localStorage.setItem = () => {
  throw new Error("Storage blocked");
};

const failedSaveResult = saveJson("blocked-json", { label: "Blocked Save" });

assert.equal(failedSaveResult, false);
assert.equal(
  latestAlertMessage,
  "FieldLedger could not save this data. Your browser storage may be full or blocked."
);

console.log("localJsonStorage tests passed");
