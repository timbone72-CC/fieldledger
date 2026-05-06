import assert from "node:assert/strict";
import { loadJson } from "./localJsonStorage.js";

const storage = new Map();

global.window = {
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
const loadedValue = loadJson("bad-json", fallbackValue);

assert.deepEqual(loadedValue, fallbackValue);

console.log("localJsonStorage tests passed");
