import {
  DEFAULT_FEDERAL_TAX_RATE,
  DEFAULT_HOURLY_RATE,
  DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
} from "../../shared/constants/fieldLedgerDefaults.js";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys.js";
import { loadJson, saveJson } from "../../shared/storage/localJsonStorage.js";

export function loadSettings() {
  return loadJson(STORAGE_KEYS.SETTINGS, createDefaultSettings());
}

export function saveSettings(settings) {
  return saveJson(STORAGE_KEYS.SETTINGS, {
    ...createDefaultSettings(),
    ...settings,
    updatedAt: new Date().toISOString(),
  });
}

export function createDefaultSettings() {
  return {
    hourlyRate: DEFAULT_HOURLY_RATE,
    selfEmploymentTaxRate: DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
    federalTaxRate: DEFAULT_FEDERAL_TAX_RATE,
    stateTaxRate: 0.045,
  };
}
