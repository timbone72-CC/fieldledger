import { useEffect, useState } from "react";
import "./App.css";
import ExpenseEntryForm from "./features/expenses/ExpenseEntryForm.jsx";
import SavedExpensesList from "./features/expenses/SavedExpensesList.jsx";
import ExportActionsDropdown from "./features/exports/ExportActionsDropdown.jsx";
import JobEntryForm from "./features/jobs/JobEntryForm.jsx";
import SavedJobsList from "./features/jobs/SavedJobsList.jsx";
import MileageEntryForm from "./features/mileage/MileageEntryForm.jsx";
import SavedMileageList from "./features/mileage/SavedMileageList.jsx";
import PayPeriodInfoForm from "./features/pay-periods/PayPeriodInfoForm.jsx";
import PayPeriodSummaryPanel from "./features/pay-periods/PayPeriodSummaryPanel.jsx";
import SettingsPanel from "./features/settings/SettingsPanel.jsx";
import HelpPanel from "./features/help/HelpPanel.jsx";
import TimesheetPrintView from "./features/exports/TimesheetPrintView.jsx";

const TABS = {
  DASHBOARD: "dashboard",
  JOBS: "jobs",
  EXPENSES: "expenses",
  MILEAGE: "mileage",
  SETTINGS: "settings",
  HELP: "help",
};

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [refreshCount, setRefreshCount] = useState(0);
  const [showTimesheetPrintView, setShowTimesheetPrintView] = useState(false);
  const [storageRecoveryMessage, setStorageRecoveryMessage] = useState("");

  useEffect(() => {
    function handleStorageRecovery(event) {
      setStorageRecoveryMessage(event.detail?.message || "FieldLedger recovered from a storage problem.");
    }

    window.addEventListener("fieldledger:storage-recovery", handleStorageRecovery);

    return () => {
      window.removeEventListener("fieldledger:storage-recovery", handleStorageRecovery);
    };
  }, []);

  function refreshAppData() {
    setRefreshCount((currentCount) => currentCount + 1);
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">FieldLedger</p>
        <h1>1099 field ticket, receipt, and pay-period tracker</h1>
        <p className="subtext">
          Capture job tickets and receipts, review the details, calculate pay,
          subtract expenses, and export a clean pay-period report.
        </p>
      </section>

      {storageRecoveryMessage && (
        <section className="storage-recovery-banner" role="alert">
          <strong>Storage recovery notice</strong>
          <p>{storageRecoveryMessage}</p>
          <button type="button" onClick={() => setStorageRecoveryMessage("")}>
            Dismiss
          </button>
        </section>
      )}

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
          className={activeTab === TABS.MILEAGE ? "active" : ""}
          onClick={() => setActiveTab(TABS.MILEAGE)}
        >
          Mileage
        </button>
        <button
          type="button"
          className={activeTab === TABS.SETTINGS ? "active" : ""}
          onClick={() => setActiveTab(TABS.SETTINGS)}
        >
          Settings
        </button>
        <button
          type="button"
          className={activeTab === TABS.HELP ? "active" : ""}
          onClick={() =>
            setActiveTab((currentTab) =>
              currentTab === TABS.HELP ? TABS.DASHBOARD : TABS.HELP
            )
          }
        >
          {activeTab === TABS.HELP ? "Help — click again to close" : "Help"}
        </button>
      </nav>

      {activeTab === TABS.DASHBOARD && (
        <>
          <section className="data-ownership-notice">
            <strong>Data ownership reminder</strong>
            <p>
              FieldLedger stores records locally on this browser/device. Your phone and
              computer do not automatically share data.
            </p>

            <p>
              Use JSON Backup regularly to protect your records before clearing browser
              data, switching devices, reinstalling the app, or importing a replacement
              backup.
            </p>

            <p>
              Deleting browser/site data without a backup can permanently erase your
              saved records.
            </p>
          </section>
          <PayPeriodInfoForm key={`pay-period-info-${refreshCount}`} />
          <ExportActionsDropdown
            onShowTimesheet={() => setShowTimesheetPrintView(true)}
            onDataChanged={refreshAppData}
          />
          {showTimesheetPrintView && <TimesheetPrintView />}
          <PayPeriodSummaryPanel key={`summary-${refreshCount}`} />
        </>
      )}

      {activeTab === TABS.JOBS && (
        <>
          <SavedJobsList key={`jobs-${refreshCount}`} onJobDeleted={refreshAppData} />
          <JobEntryForm onJobSaved={refreshAppData} />
        </>
      )}

      {activeTab === TABS.EXPENSES && (
        <>
          <SavedExpensesList key={`expenses-${refreshCount}`} onExpenseDeleted={refreshAppData} />
          <ExpenseEntryForm onExpenseSaved={refreshAppData} />
        </>
      )}

      {activeTab === TABS.MILEAGE && (
        <>
          <SavedMileageList key={`mileage-${refreshCount}`} onMileageDeleted={refreshAppData} />
          <MileageEntryForm onMileageSaved={refreshAppData} />
        </>
      )}

      {activeTab === TABS.SETTINGS && <SettingsPanel />}

      {activeTab === TABS.HELP && <HelpPanel />}
    </main>
  );
}
