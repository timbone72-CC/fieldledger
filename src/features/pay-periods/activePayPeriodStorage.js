import { STORAGE_KEYS } from "../../shared/constants/storageKeys.js";
import { loadJson, removeJson, saveJson } from "../../shared/storage/localJsonStorage.js";

export function loadActivePayPeriod() {
  return normalizePayPeriod(loadJson(STORAGE_KEYS.ACTIVE_PAY_PERIOD, createEmptyPayPeriod()));
}

export function saveActivePayPeriod(payPeriod) {
  saveJson(STORAGE_KEYS.ACTIVE_PAY_PERIOD, normalizePayPeriod(payPeriod));
}

export function clearActivePayPeriod() {
  removeJson(STORAGE_KEYS.ACTIVE_PAY_PERIOD);
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
    mileageEntries: [],
  };
}

function normalizePayPeriod(payPeriod) {
  const emptyPayPeriod = createEmptyPayPeriod();

  if (!payPeriod || typeof payPeriod !== "object" || Array.isArray(payPeriod)) {
    return emptyPayPeriod;
  }

  return {
    ...emptyPayPeriod,
    ...payPeriod,
    id: typeof payPeriod.id === "string" && payPeriod.id ? payPeriod.id : emptyPayPeriod.id,
    label: typeof payPeriod.label === "string" ? payPeriod.label : emptyPayPeriod.label,
    startDate: typeof payPeriod.startDate === "string" ? payPeriod.startDate : emptyPayPeriod.startDate,
    endDate: typeof payPeriod.endDate === "string" ? payPeriod.endDate : emptyPayPeriod.endDate,
    status: typeof payPeriod.status === "string" ? payPeriod.status : emptyPayPeriod.status,
    jobs: Array.isArray(payPeriod.jobs) ? payPeriod.jobs : [],
    expenses: Array.isArray(payPeriod.expenses) ? payPeriod.expenses : [],
    mileageEntries: Array.isArray(payPeriod.mileageEntries) ? payPeriod.mileageEntries : [],
  };
}
