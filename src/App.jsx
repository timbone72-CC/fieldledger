import { useState } from "react";
import "./App.css";
import ExpenseEntryForm from "./features/expenses/ExpenseEntryForm.jsx";
import SavedExpensesList from "./features/expenses/SavedExpensesList.jsx";
import DownloadPayPeriodJsonButton from "./features/exports/DownloadPayPeriodJsonButton.jsx";
import JobEntryForm from "./features/jobs/JobEntryForm.jsx";
import SavedJobsList from "./features/jobs/SavedJobsList.jsx";
import ClearPayPeriodButton from "./features/pay-periods/ClearPayPeriodButton.jsx";
import PayPeriodInfoForm from "./features/pay-periods/PayPeriodInfoForm.jsx";
import PayPeriodSummaryPanel from "./features/pay-periods/PayPeriodSummaryPanel.jsx";
import SettingsPanel from "./features/settings/SettingsPanel.jsx";

const TABS = {
  DASHBOARD: "dashboard",
  JOBS: "jobs",
  EXPENSES: "expenses",
  SETTINGS: "settings",
};

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">FieldLedger</p>
        <h1>1099 ticket, receipt, and pay-period tracker</h1>
        <p className="subtext">
          Capture job tickets and receipts, review the details, calculate pay,
          subtract expenses, and export a clean pay-period report.
        </p>
      </section>

      <nav className="tab-bar" aria-label="FieldLedger sections">
        <button
          type="button"
          className={activeTab === TABS.DASHBOARD ? "active" : ""}
          onClick={() => setActiveTab(TABS.DASHBOARD)}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={activeTab === TABS.JOBS ? "active" : ""}
          onClick={() => setActiveTab(TABS.JOBS)}
        >
          Jobs
        </button>
        <button
          type="button"
          className={activeTab === TABS.EXPENSES ? "active" : ""}
          onClick={() => setActiveTab(TABS.EXPENSES)}
        >
          Expenses
        </button>
        <button
          type="button"
          className={activeTab === TABS.SETTINGS ? "active" : ""}
          onClick={() => setActiveTab(TABS.SETTINGS)}
        >
          Settings
        </button>
      </nav>

      {activeTab === TABS.DASHBOARD && (
        <>
          <PayPeriodInfoForm />
          <PayPeriodSummaryPanel />
          <DownloadPayPeriodJsonButton />
          <ClearPayPeriodButton />
        </>
      )}

      {activeTab === TABS.JOBS && (
        <>
          <SavedJobsList />
          <JobEntryForm />
        </>
      )}

      {activeTab === TABS.EXPENSES && (
        <>
          <SavedExpensesList />
          <ExpenseEntryForm />
        </>
      )}

      {activeTab === TABS.SETTINGS && <SettingsPanel />}
    </main>
  );
}
