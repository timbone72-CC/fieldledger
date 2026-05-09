export default function HelpPanel() {
  return (
    <section className="help-panel">
      <h2>Help & Workflow Guide</h2>

      <p>
        FieldLedger is an offline-first 1099 field-work tracker for jobs,
        expenses, mileage, receipts, and pay-period reporting.
      </p>

      <nav className="help-contents" aria-label="Help guide contents">
        <strong>Guide contents</strong>
        <ul>
          <li><a href="#help-getting-started">Getting Started</a></li>
          <li><a href="#help-data-reminder">Important Data Reminder</a></li>
          <li><a href="#help-product-scope">Current Product Scope</a></li>
          <li><a href="#help-update-app">Keeping FieldLedger Updated</a></li>
          <li><a href="#help-future-ideas">Future Ideas</a></li>
          <li><a href="#help-feedback">Feedback</a></li>
        </ul>
      </nav>

      <section id="help-getting-started">
        <h3>Getting Started</h3>

        <ol>
          <li>Create or review your pay period dates.</li>
          <li>Add jobs, expenses, and mileage entries.</li>
          <li>Use JSON Backup regularly to protect your records.</li>
          <li>Export or print your pay-period report when ready.</li>
        </ol>
      </section>

      <section id="help-data-reminder">
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

      <section id="help-product-scope">
        <h3>Current Product Scope</h3>

        <ul>
          <li>Offline-first</li>
          <li>No required login</li>
          <li>No required cloud sync</li>
          <li>No AI or OCR required</li>
          <li>Manual-review-first workflow</li>
        </ul>
      </section>

      <section id="help-update-app">
        <h3>Keeping FieldLedger Updated</h3>

        <p>
          Sometimes the installed app may keep older files cached after a deployment
          or visible update.
        </p>

        <p>
          If the app still looks outdated after an update, open Settings and tap
          <strong> Update App</strong>.
        </p>

        <p>
          Your saved records stay on this device during the update process.
        </p>
      </section>

      <section id="help-future-ideas">
        <h3>Future Ideas</h3>

        <ul>
          <li>Clickable contextual help tips</li>
          <li>Expanded onboarding walkthroughs</li>
          <li>Google Sheets setup guide</li>
        </ul>
      </section>

      <section id="help-feedback">
        <h3>Feedback</h3>

        <p>
          Found a bug, confusing workflow, or something that could be easier?
        </p>

        <p>
          During the trusted-user phase, please text the app owner with:
        </p>

        <ul>
          <li>bug reports</li>
          <li>workflow confusion</li>
          <li>feature ideas</li>
          <li>export/report issues</li>
        </ul>
      </section>
    </section>
  );
}
