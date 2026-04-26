import { useState } from "react";
import { loadSettings, saveSettings } from "./settingsStorage.js";

export default function SettingsPanel() {
  const savedSettings = loadSettings();

  const [hourlyRate, setHourlyRate] = useState(savedSettings.hourlyRate);
  const [selfEmploymentTaxRate, setSelfEmploymentTaxRate] = useState(
    savedSettings.selfEmploymentTaxRate * 100,
  );
  const [federalTaxRate, setFederalTaxRate] = useState(savedSettings.federalTaxRate * 100);
  const [saveMessage, setSaveMessage] = useState("");

  function saveUserSettings() {
    saveSettings({
      hourlyRate: Number(hourlyRate || 0),
      selfEmploymentTaxRate: Number(selfEmploymentTaxRate || 0) / 100,
      federalTaxRate: Number(federalTaxRate || 0) / 100,
    });

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

      <p className="helper">
        Tax estimates are for planning only and are not tax advice. Changing the default
        hourly rate will not change old saved jobs.
      </p>

      <button type="button" onClick={saveUserSettings}>
        Save Settings
      </button>

      {saveMessage && <p className="helper">{saveMessage}</p>}
    </section>
  );
}
