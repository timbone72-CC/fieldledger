import { useState } from "react";
import { loadSettings, saveSettings } from "./settingsStorage.js";

export default function SettingsPanel() {
  const savedSettings = loadSettings();

  const [hourlyRate, setHourlyRate] = useState(savedSettings.hourlyRate);
  const [selfEmploymentTaxRate, setSelfEmploymentTaxRate] = useState(
    (savedSettings.selfEmploymentTaxRate * 100).toFixed(2),
  );
  const [federalTaxRate, setFederalTaxRate] = useState((savedSettings.federalTaxRate * 100).toFixed(2));
  const [stateTaxRate, setStateTaxRate] = useState((savedSettings.stateTaxRate * 100).toFixed(2));
  const [saveMessage, setSaveMessage] = useState("");

  function saveUserSettings() {
    const saved = saveSettings({
      hourlyRate: Number(hourlyRate || 0),
      selfEmploymentTaxRate: Number(selfEmploymentTaxRate || 0) / 100,
      federalTaxRate: Number(federalTaxRate || 0) / 100,
      stateTaxRate: Number(stateTaxRate || 0) / 100,
    });

    if (!saved) {
      setSaveMessage("");
      return;
    }

    setSaveMessage("Settings saved.");
  }

  return (
    <section className="panel">
      <h2>Settings</h2>

      <label className="field">
        Default Hourly Rate
        <input
          type="number"
          min="0"
          step="0.01"
          value={hourlyRate}
          onChange={(event) => setHourlyRate(event.target.value)}
        />
      </label>

      <label className="field">
        Self-Employment Tax Rate %
        <input
          type="number"
          min="0"
          step="0.01"
          value={selfEmploymentTaxRate}
          onChange={(event) => setSelfEmploymentTaxRate(event.target.value)}
        />
      </label>

      <label className="field">
        Federal Tax Rate %
        <input
          type="number"
          min="0"
          step="0.01"
          value={federalTaxRate}
          onChange={(event) => setFederalTaxRate(event.target.value)}
        />
      </label>

      <label className="field">
        State Tax Rate % (Oklahoma default)
        <input
          type="number"
          min="0"
          step="0.01"
          value={stateTaxRate}
          onChange={(event) => setStateTaxRate(event.target.value)}
        />
      </label>

      <p className="helper">
        Tax estimates are for planning only and are not tax advice. Changing the default
        hourly rate will not change old saved jobs.
      </p>

      <div className="helper">
        <strong>App Version:</strong> FieldLedger local MVP
        <br />
        If the live app looks outdated after an update, first try closing and reopening the browser tab.
        If it still looks old, use JSON Backup, then refresh or clear browser site data only after confirming
        the backup downloaded.
      </div>

      <button type="button" onClick={saveUserSettings}>
        Save Settings
      </button>

      {saveMessage && <p className="helper">{saveMessage}</p>}
    </section>
  );
}
