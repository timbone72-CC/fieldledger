import { STORAGE_KEYS } from "../../shared/constants/storageKeys.js";
import { loadJson, saveJson } from "../../shared/storage/localJsonStorage.js";

export function loadActivePayPeriod() {
  return loadJson(STORAGE_KEYS.ACTIVE_PAY_PERIOD, createEmptyPayPeriod());
}

export function saveActivePayPeriod(payPeriod) {
  saveJson(STORAGE_KEYS.ACTIVE_PAY_PERIOD, payPeriod);
}

export function createEmptyPayPeriod() {
  return {
    id: "active",
    label: "Current Pay Period",
    startDate: "",
    endDate: "",
    status: "open",
    jobs: [],
    expenses: [],
  };
}
