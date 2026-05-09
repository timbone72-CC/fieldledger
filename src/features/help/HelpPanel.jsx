export default function HelpPanel() {
  return (
    <section className="help-panel">
      <h2>Help & Workflow Guide</h2>

      <p>
        FieldLedger is an offline-first 1099 field-work tracker for jobs,
        expenses, mileage, receipts, and pay-period reporting.
      </p>

      <section>
        <h3>Getting Started</h3>

        <ol>
          <li>Create or review your pay period dates.</li>
          <li>Add jobs, expenses, and mileage entries.</li>
          <li>Use JSON Backup regularly to protect your records.</li>
          <li>Export or print your pay-period report when ready.</li>
        </ol>
      </section>

      <section>
        <h3>Important Data Reminder</h3>

        <p>
          FieldLedger stores records locally on this browser/device.
        </p>

        <p>
          Your phone and computer do not automatically share data.
        </p>

        <p>
          Use JSON Backup regularly before:
        </p>

        <ul>
          <li>Clearing browser/site data</li>
          <li>Switching devices</li>
          <li>Reinstalling the app</li>
          <li>Importing replacement backups</li>
        </ul>
      </section>

      <section>
        <h3>Current Product Scope</h3>

        <ul>
          <li>Offline-first</li>
          <li>No required login</li>
          <li>No required cloud sync</li>
          <li>No AI or OCR required</li>
          <li>Manual-review-first workflow</li>
        </ul>
      </section>

      <section>
        <h3>Future Ideas</h3>

        <ul>
          <li>Clickable contextual help tips</li>
          <li>Expanded onboarding walkthroughs</li>
          <li>Google Sheets setup guide</li>
        </ul>
      </section>
    </section>
  );
}
