import { useState } from "react";
import { APP_NAME, APP_VERSION_DATE, APP_VERSION_LABEL, APP_VERSION_NOTE } from "../../shared/constants/appInfo.js";
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

  async function updateApp() {
    if (!navigator.onLine) {
      window.alert(
        "You appear to be offline. Do not update FieldLedger while offline. Reconnect to the internet, open the app once, then use Update App."
      );
      return;
    }

    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );
      }

      if ("caches" in window) {
        const cacheNames = await window.caches.keys();

        await Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith("fieldledger-"))
            .map((cacheName) => window.caches.delete(cacheName)),
        );
      }
    } finally {
      window.location.reload();
    }
  }

  return (
    <section className="panel">
      <h2>Settings</h2>

      <div className="responsive-form-grid">
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

        <p className="helper form-span-full">
          Tax estimates are for planning only and are not tax advice. Changing the default
          hourly rate will not change old saved jobs.
        </p>

        <div className="helper form-span-full">
          <strong>FieldLedger Basics:</strong>
          <br />
          FieldLedger saves data in this browser on this device. Your phone and computer do not automatically
          share data. Use JSON Backup before clearing browser data, switching devices, or importing a replacement
          backup. Tax and mileage estimates are for planning only.
        </div>

        <div className="helper form-span-full">
          <strong>App Version:</strong> {APP_NAME} — {APP_VERSION_LABEL}
          <br />
          Current update: {APP_VERSION_DATE} — {APP_VERSION_NOTE}
          <br />
          If the live app looks outdated after an update, first try closing and reopening the browser tab.
          If it still looks old, use JSON Backup, then refresh or clear browser site data only after confirming
          the backup downloaded.
        </div>

        <div className="form-actions form-span-full">
          <button type="button" onClick={saveUserSettings}>
            Save Settings
          </button>
        </div>

        <div className="helper form-span-full">
          <strong>Update App:</strong>
          <br />
          Reload FieldLedger and refresh the app cache. Use this only while online. Your saved records stay on this device.
        </div>

        <div className="form-actions form-span-full">
          <button type="button" onClick={updateApp}>
            Update App
          </button>
        </div>

        {saveMessage && <p className="helper form-span-full">{saveMessage}</p>}
      </div>
    </section>
  );
}
