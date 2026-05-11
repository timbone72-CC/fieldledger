/**
 * =========================================================
 * 01. FieldLedger Apps Script v2
 * =========================================================
 * Trusted-user reliability rewrite
 *
 * Architecture:
 * FieldLedger app = authoritative
 * Google Sheets = downstream operational/reporting layer
 * LEG Work Calendar = non-authoritative visualization layer
 *
 * Current safety goals:
 * - atomic CSV import
 * - strict template boundaries
 * - scoped validation repair
 * - duplicate schedule prevention
 * - safer calendar sync handling
 * =========================================================
 */

/**
 * =========================================================
 * 01.01 Configuration constants
 * =========================================================
 */
const CONFIG = {
  RAWDATA_SHEET_NAME: "RawData",
  RAWDATA_BACKUP_SHEET_NAME: "_FieldLedger_RawData_Backup",
  TIMESHEET_SHEET_NAME: "Timesheet",
  COMPANY_HELPER_SHEET_NAME: "List",
  RIG_HELPER_SHEET_NAME: "Rig Name/Number",
  CALENDAR_EVENTS_SHEET_NAME: "CalendarEvents",
  SCHEDULE_CONFIG_SHEET_NAME: "ScheduleConfig",

  LEG_WORK_CALENDAR_NAME: "LEG Work Calendar",

  MAX_FILE_SIZE_MB: 50,

  HEADER_SEARCH_TERM: "date",

  TIMESHEET_START_ROW: 12,
  TIMESHEET_END_ROW: 38,
  GRAND_TOTAL_ROW: 39,

  DEBUG: true
};

/**
 * =========================================================
 * 01.02 Logging helper
 * =========================================================
 */
function logMessage(level, message, data = null) {
  if (!CONFIG.DEBUG) {
    return;
  }

  const timestamp = new Date().toLocaleTimeString();

  Logger.log(
    `[${timestamp}] ${level}: ${message} ${
      data ? JSON.stringify(data) : ""
    }`
  );
}

/**
 * =========================================================
 * 01.03 UI alert helper
 * =========================================================
 */
function showAlert(message) {
  SpreadsheetApp.getUi().alert(message);
}

/**
 * =========================================================
 * 02. Spreadsheet menu
 * =========================================================
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("FieldLedger")
    .addItem("📁 Import CSV to RawData", "importFieldLedgerCsv")
    .addItem("🔄 Refresh Dropdown Helpers", "updateHelperSheetsFromRawData")
    .addItem("🧰 Repair Timesheet Formulas", "repairTimesheetFormulasAndValidation")
    .addItem("🙈 Hide Grand Total Rows", "hideGrandTotalRows")
    .addSeparator()
    .addItem("📅 Generate Schedule Events", "generateScheduleEvents")
    .addItem("🔁 Sync Calendar Events", "syncCalendarEvents")
    .addSeparator()
    .addItem("🔍 View Debug Logs", "viewDebugLogs")
    .addToUi();

  logMessage("INFO", "FieldLedger menu created");
}

/**
 * =========================================================
 * 03. Debug log helper
 * =========================================================
 */
function viewDebugLogs() {
  showAlert(
    "Debug logs are available in Apps Script Execution Logs."
  );
}

/**
 * =========================================================
 * 04. CSV import dialog
 * =========================================================
 */
function importFieldLedgerCsv() {
  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f5f5f5;
          }

          .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
          }

          h2 {
            margin-top: 0;
            font-size: 16px;
          }

          #status {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            display: none;
            font-size: 13px;
          }

          #status.processing {
            background: #e3f2fd;
            display: block;
          }

          #status.success {
            background: #e8f5e9;
            display: block;
          }

          #status.error {
            background: #ffebee;
            display: block;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <h2>Import FieldLedger CSV</h2>
          <input type="file" id="file" accept=".csv" />
          <div id="status"></div>
        </div>

        <script>
          const fileInput = document.getElementById("file");
          const statusDiv = document.getElementById("status");

          function updateStatus(message, className) {
            statusDiv.textContent = message;
            statusDiv.className = className;
          }

          fileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];

            if (!file) {
              return;
            }

            if (!file.name.toLowerCase().endsWith(".csv")) {
              updateStatus("Please select a CSV file.", "error");
              fileInput.value = "";
              return;
            }

            const maxSize = ${CONFIG.MAX_FILE_SIZE_MB} * 1024 * 1024;

            if (file.size > maxSize) {
              updateStatus("File is too large.", "error");
              fileInput.value = "";
              return;
            }

            fileInput.disabled = true;
            updateStatus("Processing CSV...", "processing");

            const reader = new FileReader();

            reader.onload = function(loadEvent) {
              google.script.run
                .withSuccessHandler(function(result) {
                  if (result && result.success) {
                    updateStatus(result.message, "success");
                    setTimeout(function() {
                      google.script.host.close();
                    }, 1500);
                    return;
                  }

                  updateStatus(
                    result && result.message ? result.message : "Import failed.",
                    "error"
                  );

                  fileInput.disabled = false;
                  fileInput.value = "";
                })
                .withFailureHandler(function(error) {
                  updateStatus("Import failed: " + error.message, "error");
                  fileInput.disabled = false;
                  fileInput.value = "";
                })
                .processCsv(loadEvent.target.result);
            };

            reader.onerror = function() {
              updateStatus("Could not read file.", "error");
              fileInput.disabled = false;
              fileInput.value = "";
            };

            reader.readAsText(file);
          });
        </script>
      </body>
    </html>
  `).setWidth(420).setHeight(220);

  SpreadsheetApp.getUi().showModalDialog(html, "Import CSV to RawData");
}

/**
 * =========================================================
 * 04.01 Main CSV processing function
 * =========================================================
 */
function processCsv(csvText, sheetName = CONFIG.RAWDATA_SHEET_NAME) {
  logMessage("INFO", `Starting CSV import for ${sheetName}`);

  try {
    const inputValidation = validateCsvInput(csvText);

    if (!inputValidation.success) {
      showAlert(inputValidation.message);
      return inputValidation;
    }

    const parsedRows = Utilities.parseCsv(csvText, ",");
    const headerIndex = findHeaderRowIndex(parsedRows);

    if (headerIndex === -1) {
      return failCsvImport(
        `Could not find header row starting with "${CONFIG.HEADER_SEARCH_TERM}".`
      );
    }

    let cleanRows = removeEmptyRows(parsedRows.slice(headerIndex));
    cleanRows = removeSummaryRows(cleanRows);
    cleanRows = formatDateColumn(cleanRows);

    const consistency = validateCsvRowsForImport(cleanRows);

    if (!consistency.success) {
      return failCsvImport(consistency.message);
    }

    const sheet = getOrCreateSheet(sheetName);

    if (!sheet) {
      return failCsvImport(`Sheet "${sheetName}" could not be created.`);
    }

    replaceSheetContents(sheet, cleanRows);
    formatImportedRawDataSheet(sheet, cleanRows);
    updateHelperSheetsFromRawData();
    repairTimesheetFormulasAndValidation();
    hideGrandTotalRows();

    SpreadsheetApp.flush();

    const message = `Successfully imported ${cleanRows.length - 1} data row(s) to "${sheetName}".`;

    showAlert(message);
    logMessage("INFO", message);

    return {
      success: true,
      message
    };
  } catch (error) {
    const message = `Error processing CSV: ${error.message}`;
    logMessage("ERROR", message, error);
    showAlert(message);

    return {
      success: false,
      message
    };
  }
}

/**
 * =========================================================
 * 04.02 CSV input validation
 * =========================================================
 */
function validateCsvInput(csvText) {
  if (!csvText || csvText.trim() === "") {
    return {
      success: false,
      message: "No CSV data provided."
    };
  }

  if (csvText.length > CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      success: false,
      message: `File too large. Maximum size is ${CONFIG.MAX_FILE_SIZE_MB}MB.`
    };
  }

  return {
    success: true,
    message: "CSV input is valid."
  };
}

/**
 * =========================================================
 * 04.03 CSV failure helper
 * =========================================================
 */
function failCsvImport(message) {
  logMessage("ERROR", message);
  showAlert(message);

  return {
    success: false,
    message
  };
}

/**
 * =========================================================
 * 04.04 Get or create sheet
 * =========================================================
 */
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

/**
 * =========================================================
 * 04.05 Finds the CSV header row
 * =========================================================
 */
function findHeaderRowIndex(rows) {
  if (!rows || rows.length === 0) {
    return -1;
  }

  return rows.findIndex(row =>
    row &&
    row.length > 0 &&
    String(row[0] || "").trim().toLowerCase() === CONFIG.HEADER_SEARCH_TERM
  );
}

/**
 * =========================================================
 * 04.06 Removes empty CSV rows
 * =========================================================
 */
function removeEmptyRows(rows) {
  return rows.filter(row =>
    row && row.some(cell => String(cell || "").trim() !== "")
  );
}

/**
 * =========================================================
 * 04.07 Removes exported summary rows
 * =========================================================
 */
function removeSummaryRows(rows) {
  const summaryLabels = ["grand total"];

  return rows.filter((row, index) => {
    if (index === 0) {
      return true;
    }

    const firstCell = String(row[0] || "").trim().toLowerCase();

    return !summaryLabels.includes(firstCell);
  });
}

/**
 * =========================================================
 * 04.08 Strict FieldLedger CSV row validation
 * =========================================================
 */
function validateCsvRowsForImport(rows) {
  if (!rows || rows.length < 2) {
    return {
      success: false,
      message: "No data rows found after the CSV header."
    };
  }

  const requiredHeaders = [
    "date",
    "company",
    "rig name/number",
    "field ticket number",
    "day rate",
    "hours worked",
    "transportation",
    "total"
  ];

  const actualHeaders = rows[0].map(header =>
    String(header || "").trim().toLowerCase()
  );

  const headerMatches =
    requiredHeaders.length === actualHeaders.length &&
    requiredHeaders.every((header, index) => actualHeaders[index] === header);

  if (!headerMatches) {
    return {
      success: false,
      message:
        "This does not look like a FieldLedger CSV. " +
        "Expected headers: Date, Company, Rig Name/Number, Field Ticket Number, Day Rate, Hours Worked, Transportation, Total. " +
        "RawData was not changed."
    };
  }

  const badRows = [];

  rows.slice(1).forEach((row, index) => {
    const sheetRowNumber = index + 2;

    if (row.length !== requiredHeaders.length) {
      badRows.push(`row ${sheetRowNumber}: wrong column count`);
      return;
    }

    const dateValue = String(row[0] || "").trim();
    const dayRate = String(row[4] || "").trim();
    const hoursWorked = String(row[5] || "").trim();
    const transportation = String(row[6] || "").trim();
    const total = String(row[7] || "").trim();

    if (!dateValue || isNaN(new Date(dateValue).getTime())) {
      badRows.push(`row ${sheetRowNumber}: invalid date`);
    }

    [
      ["Day Rate", dayRate],
      ["Hours Worked", hoursWorked],
      ["Transportation", transportation],
      ["Total", total]
    ].forEach(([label, value]) => {
      if (value !== "" && Number.isNaN(Number(value))) {
        badRows.push(`row ${sheetRowNumber}: ${label} must be numeric or blank`);
      }
    });
  });

  if (badRows.length > 0) {
    return {
      success: false,
      message:
        "CSV validation failed. " +
        badRows.slice(0, 5).join("; ") +
        ". RawData was not changed."
    };
  }

  return {
    success: true,
    message: "FieldLedger CSV rows are valid."
  };
}

/**
 * =========================================================
 * 04.09 Formats date column values
 * =========================================================
 */
function formatDateColumn(rows) {
  if (!rows || rows.length === 0) {
    return rows;
  }

  const headerIsDate =
    String(rows[0][0] || "").trim().toLowerCase() === CONFIG.HEADER_SEARCH_TERM;

  if (!headerIsDate) {
    return rows;
  }

  return rows.map((row, index) => {
    if (index === 0) {
      return row;
    }

    const dateValue = row[0];

    if (!dateValue || String(dateValue).trim() === "") {
      return row;
    }

    const parsedDate = new Date(String(dateValue));

    if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 1900) {
      row[0] = parsedDate;
    }

    return row;
  });
}

/**
 * =========================================================
 * 04.10 RawData rollback helpers
 * =========================================================
 */
function getRawDataBackupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let backupSheet = spreadsheet.getSheetByName(CONFIG.RAWDATA_BACKUP_SHEET_NAME);

  if (!backupSheet) {
    backupSheet = spreadsheet.insertSheet(CONFIG.RAWDATA_BACKUP_SHEET_NAME);
    backupSheet.hideSheet();
  }

  return backupSheet;
}

function snapshotSheetContents(sourceSheet, backupSheet) {
  backupSheet.clearContents();

  if (!sourceSheet || sourceSheet.getLastRow() === 0 || sourceSheet.getLastColumn() === 0) {
    return;
  }

  const sourceRange = sourceSheet.getDataRange();
  const sourceValues = sourceRange.getValues();

  backupSheet
    .getRange(1, 1, sourceValues.length, sourceValues[0].length)
    .setValues(sourceValues);
}

function restoreSheetContentsFromBackup(targetSheet, backupSheet) {
  targetSheet.clearContents();

  if (!backupSheet || backupSheet.getLastRow() === 0 || backupSheet.getLastColumn() === 0) {
    return;
  }

  const backupRange = backupSheet.getDataRange();
  const backupValues = backupRange.getValues();

  targetSheet
    .getRange(1, 1, backupValues.length, backupValues[0].length)
    .setValues(backupValues);
}

/**
 * =========================================================
 * 04.11 Replaces sheet contents after validation passes
 * =========================================================
 */
function replaceSheetContents(sheet, rows) {
  const backupSheet = getRawDataBackupSheet();

  snapshotSheetContents(sheet, backupSheet);

  try {
    sheet.clearContents();
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  } catch (error) {
    restoreSheetContentsFromBackup(sheet, backupSheet);
    throw error;
  }
}

/**
 * =========================================================
 * 04.12 Formats imported RawData
 * =========================================================
 */
function formatImportedRawDataSheet(sheet, rows) {
  const headerRange = sheet.getRange(1, 1, 1, rows[0].length);

  headerRange.setFontWeight("bold");
  headerRange.setBackground("#4285F4");
  headerRange.setFontColor("#ffffff");

  sheet.autoResizeColumns(1, rows[0].length);

  if (String(rows[0][0] || "").trim().toLowerCase() === CONFIG.HEADER_SEARCH_TERM) {
    const dataRowCount = rows.length - 1;

    if (dataRowCount > 0) {
      sheet.getRange(2, 1, dataRowCount, 1).setNumberFormat("yyyy-mm-dd");
    }
  }
}

/**
 * =========================================================
 * 05. Helper sheet refresh
 * =========================================================
 *
 * 05.01 Source:
 * RawData column B = Company
 * RawData column C = Rig Name/Number
 *
 * 05.02 Targets:
 * List column A
 * Rig Name/Number column A
 * =========================================================
 */
function updateHelperSheetsFromRawData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = spreadsheet.getSheetByName(CONFIG.RAWDATA_SHEET_NAME);
  const companySheet = spreadsheet.getSheetByName(CONFIG.COMPANY_HELPER_SHEET_NAME);
  const rigSheet = spreadsheet.getSheetByName(CONFIG.RIG_HELPER_SHEET_NAME);

  if (!rawSheet || !companySheet || !rigSheet) {
    logMessage("ERROR", "Missing RawData, List, or Rig Name/Number sheet");
    return;
  }

  const lastRow = rawSheet.getLastRow();

  if (lastRow < 2) {
    logMessage("INFO", "No RawData rows found for helper refresh");
    return;
  }

  const rawValues = rawSheet.getRange(2, 1, lastRow - 1, 3).getValues();

  const companies = rawValues
    .map(row => String(row[1] || "").trim())
    .filter(Boolean);

  const rigs = rawValues
    .map(row => String(row[2] || "").trim())
    .filter(Boolean);

  appendUniqueValuesToHelperSheet(companySheet, companies);
  appendUniqueValuesToHelperSheet(rigSheet, rigs);

  logMessage(
    "INFO",
    `Helper refresh checked ${companies.length} company value(s) and ${rigs.length} rig value(s)`
  );
}

/**
 * =========================================================
 * 05.03 Append, dedupe, and sort helper values
 * =========================================================
 */
function appendUniqueValuesToHelperSheet(sheet, values) {
  const lastRow = sheet.getLastRow();

  const existingValues =
    lastRow >= 2
      ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat()
      : [];

  const mergedValues = new Map();

  existingValues.concat(values).forEach(value => {
    const cleanValue = String(value || "").trim();

    if (!cleanValue) {
      return;
    }

    const key = cleanValue.toLowerCase();

    if (!mergedValues.has(key)) {
      mergedValues.set(key, cleanValue);
    }
  });

  const sortedValues = Array.from(mergedValues.values()).sort((a, b) =>
    a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base"
    })
  );

  sheet.getRange("A2:A").clearContent();

  if (sortedValues.length > 0) {
    sheet
      .getRange(2, 1, sortedValues.length, 1)
      .setValues(sortedValues.map(value => [value]));
  }

  logMessage(
    "INFO",
    `Sorted ${sortedValues.length} helper value(s) in ${sheet.getName()}`
  );
}

/**
 * =========================================================
 * 06. Timesheet repair
 * =========================================================
 *
 * 06.01 Safe write boundary:
 * - Formulas: A12:H38
 * - Grand total formula: H39 only
 * - Date validation: A12:A38 only
 * - Company validation: B12:B38 only
 * - Rig validation: C12:C38 only
 *
 * 06.02 Hard rule:
 * This function must not write to row 40 or below.
 * =========================================================
 */
function repairTimesheetFormulasAndValidation() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(CONFIG.TIMESHEET_SHEET_NAME);
  const companyList = spreadsheet.getSheetByName(CONFIG.COMPANY_HELPER_SHEET_NAME);
  const rigList = spreadsheet.getSheetByName(CONFIG.RIG_HELPER_SHEET_NAME);

  if (!sheet || !companyList || !rigList) {
    logMessage("ERROR", "Missing Timesheet, List, or Rig Name/Number sheet");
    return;
  }

  const startRow = CONFIG.TIMESHEET_START_ROW;
  const endRow = CONFIG.TIMESHEET_END_ROW;
  const rowCount = endRow - startRow + 1;

  sheet.getRange(startRow, 1, rowCount, 8).clearDataValidations();

  const formulas = [];

  for (let row = startRow; row <= endRow; row++) {
    const rawRow = row - 10;

    formulas.push([
      `=RawData!A${rawRow}`,
      `=RawData!B${rawRow}`,
      `=RawData!C${rawRow}`,
      `=RawData!D${rawRow}`,
      `=RawData!E${rawRow}`,
      `=RawData!F${rawRow}`,
      `=RawData!G${rawRow}`,
      `=IF(F${row}="","",IF(E${row}<>"",E${row}+(F${row}*28),(F${row}*28)+G${row}))`
    ]);
  }

  sheet.getRange(startRow, 1, rowCount, 8).setFormulas(formulas);

  const dateRule = SpreadsheetApp.newDataValidation()
    .requireDate()
    .setAllowInvalid(true)
    .build();

  const companyRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(companyList.getRange("A2:A"), true)
    .setAllowInvalid(true)
    .build();

  const rigRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(rigList.getRange("A2:A"), true)
    .setAllowInvalid(true)
    .build();

  sheet.getRange(startRow, 1, rowCount, 1).setDataValidation(dateRule);
  sheet.getRange(startRow, 2, rowCount, 1).setDataValidation(companyRule);
  sheet.getRange(startRow, 3, rowCount, 1).setDataValidation(rigRule);

  sheet
    .getRange(CONFIG.GRAND_TOTAL_ROW, 8)
    .setFormula(`=SUM(H${startRow}:H${endRow})`);

  hideGrandTotalRows();

  logMessage(
    "INFO",
    "Repaired Timesheet formulas and validations inside safe boundary only"
  );
}

/**
 * =========================================================
 * 06.03 Hide Grand Total rows
 * =========================================================
 */
function hideGrandTotalRows() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(CONFIG.TIMESHEET_SHEET_NAME);

  if (!sheet) {
    logMessage("ERROR", "Timesheet sheet not found");
    return;
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 1) {
    return;
  }

  const values = sheet.getRange(1, 1, lastRow, 1).getValues();

  values.forEach((row, index) => {
    const cellValue = String(row[0] || "").trim().toLowerCase();

    if (cellValue.indexOf("grand total") === 0) {
      sheet.hideRows(index + 1, 1);
    }
  });
}

/**
 * =========================================================
 * 07. Schedule event generation
 * =========================================================
 *
 * 07.01 Source:
 * ScheduleConfig
 *
 * 07.02 Target:
 * CalendarEvents
 *
 * 07.03 Safety:
 * Repeated generation skips existing matching events.
 * =========================================================
 */
function generateScheduleEvents() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const configSheet = spreadsheet.getSheetByName(CONFIG.SCHEDULE_CONFIG_SHEET_NAME);
    const eventsSheet = spreadsheet.getSheetByName(CONFIG.CALENDAR_EVENTS_SHEET_NAME);

    if (!configSheet || !eventsSheet) {
      showAlert("Missing ScheduleConfig or CalendarEvents sheet.");
      return;
    }

    const payPeriodStart = configSheet.getRange("B2").getValue();
    const payPeriodDays = Number(configSheet.getRange("B3").getValue());
    const paydayOffsetDays = Number(configSheet.getRange("B4").getValue());
    const periodsToCreate = Number(configSheet.getRange("B5").getValue());

    if (!(payPeriodStart instanceof Date)) {
      showAlert("ScheduleConfig B2 must be a real date.");
      return;
    }

    if (!payPeriodDays || !periodsToCreate || Number.isNaN(paydayOffsetDays)) {
      showAlert("ScheduleConfig B3 and B5 must be numbers. B4 must be zero or a number.");
      return;
    }

    const existingKeys = getExistingCalendarEventKeys(eventsSheet);
    let appendedCount = 0;
    let skippedCount = 0;

    for (let index = 0; index < periodsToCreate; index++) {
      const workStart = new Date(payPeriodStart);
      workStart.setDate(workStart.getDate() + index * payPeriodDays);

      const workEnd = new Date(workStart);
      workEnd.setDate(workEnd.getDate() + payPeriodDays - 1);

      const payday = new Date(workEnd);
      payday.setDate(payday.getDate() + paydayOffsetDays);

      const timesheetReminder = new Date(payday);
      timesheetReminder.setDate(timesheetReminder.getDate() - 5);

      const timesheetDue = new Date(payday);
      timesheetDue.setDate(timesheetDue.getDate() - 3);

      const generatedRows = [
        [
          "",
          "On Call Rotation",
          `On Call Rotation ${index + 1}`,
          workStart,
          workEnd,
          "Auto-generated work period",
          "Pending"
        ],
        [
          "",
          "Timesheet Reminder",
          `Turn in timesheet reminder ${index + 1}`,
          timesheetReminder,
          timesheetReminder,
          "Reminder: timesheet turn-in window opens Sunday before payday.",
          "Pending"
        ],
        [
          "",
          "Timesheet Due",
          `Timesheet due ${index + 1}`,
          timesheetDue,
          timesheetDue,
          "Timesheet is due Tuesday of payday week.",
          "Pending"
        ],
        [
          "",
          "Payday",
          `Payday ${index + 1}`,
          payday,
          payday,
          "Auto-generated payday",
          "Pending"
        ]
      ];

      generatedRows.forEach(row => {
        const key = buildCalendarEventKey(row[1], row[2], row[3], row[4]);

        if (existingKeys.has(key)) {
          skippedCount += 1;
          return;
        }

        eventsSheet.appendRow(row);
        existingKeys.add(key);
        appendedCount += 1;
      });
    }

    showAlert(
      `Schedule generation complete.\n\nAdded: ${appendedCount}\nSkipped existing: ${skippedCount}`
    );
  } catch (error) {
    showAlert("Generate schedule failed: " + error.message);
    logMessage("ERROR", "Generate schedule failed", error);
  }
}

/**
 * =========================================================
 * 07.04 Existing CalendarEvents duplicate keys
 * =========================================================
 */
function getExistingCalendarEventKeys(eventsSheet) {
  const keys = new Set();
  const lastRow = eventsSheet.getLastRow();

  if (lastRow < 2) {
    return keys;
  }

  const values = eventsSheet.getRange(2, 1, lastRow - 1, 7).getValues();

  values.forEach(row => {
    const type = row[1];
    const title = row[2];
    const startDate = row[3];
    const endDate = row[4];

    if (!type || !title || !startDate || !endDate) {
      return;
    }

    keys.add(buildCalendarEventKey(type, title, startDate, endDate));
  });

  return keys;
}

/**
 * =========================================================
 * 07.05 Calendar event key builder
 * =========================================================
 */
function buildCalendarEventKey(type, title, startDate, endDate) {
  return [
    String(type || "").trim().toLowerCase(),
    String(title || "").trim().toLowerCase(),
    normalizeDateKey(startDate),
    normalizeDateKey(endDate)
  ].join("|");
}

/**
 * =========================================================
 * 07.06 Date key normalizer
 * =========================================================
 */
function normalizeDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return String(value || "").trim();
  }

  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );
}

/**
 * =========================================================
 * 08. Calendar sync
 * =========================================================
 *
 * 08.01 Source:
 * CalendarEvents
 *
 * 08.02 Target:
 * LEG Work Calendar
 *
 * 08.03 Safety:
 * - aborts if duplicate LEG calendars exist
 * - syncs only Pending rows without eventId
 * - writes row-level failure messages
 * - keeps Google Calendar downstream-only
 * =========================================================
 */
function syncCalendarEvents() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(CONFIG.CALENDAR_EVENTS_SHEET_NAME);

  if (!sheet) {
    showAlert('Sheet "CalendarEvents" was not found.');
    return;
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    showAlert("No calendar events found to sync.");
    return;
  }

  const calendarResult = getLegWorkCalendar();

  if (!calendarResult.success) {
    showAlert(calendarResult.message);
    return;
  }

  const calendar = calendarResult.calendar;
  const values = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

  let syncedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  values.forEach((row, index) => {
    const rowNumber = index + 2;

    try {
      const eventId = String(row[0] || "").trim();
      const title = row[2];
      const startDate = row[3];
      const endDate = row[4];
      const notes = row[5];
      const syncStatus = String(row[6] || "").trim();

      if (eventId || syncStatus !== "Pending") {
        skippedCount += 1;
        return;
      }

      if (!title || !startDate) {
        sheet.getRange(rowNumber, 7).setValue("Missing required fields");
        failedCount += 1;
        return;
      }

      const calendarStartDate = new Date(startDate);
      const calendarEndDate = new Date(endDate || startDate);
      calendarEndDate.setDate(calendarEndDate.getDate() + 1);

      const event = calendar.createAllDayEvent(
        String(title),
        calendarStartDate,
        calendarEndDate,
        {
          description: notes || ""
        }
      );

      sheet.getRange(rowNumber, 1).setValue(event.getId());
      sheet.getRange(rowNumber, 7).setValue("Synced");
      syncedCount += 1;
    } catch (error) {
      sheet
        .getRange(rowNumber, 7)
        .setValue(`Sync failed: ${String(error.message || error).slice(0, 80)}`);

      failedCount += 1;
      logMessage("ERROR", `Calendar sync failed on row ${rowNumber}`, error);
    }
  });

  showAlert(
    `Calendar sync complete.\n\nSynced: ${syncedCount}\nSkipped: ${skippedCount}\nFailed: ${failedCount}`
  );
}

/**
 * =========================================================
 * 08.04 LEG Work Calendar resolver
 * =========================================================
 */
function getLegWorkCalendar() {
  const calendars = CalendarApp.getCalendarsByName(CONFIG.LEG_WORK_CALENDAR_NAME);

  if (calendars.length > 1) {
    return {
      success: false,
      message:
        `Multiple calendars named "${CONFIG.LEG_WORK_CALENDAR_NAME}" were found. ` +
        "Sync was stopped to avoid writing to the wrong calendar."
    };
  }

  if (calendars.length === 1) {
    return {
      success: true,
      calendar: calendars[0],
      message: "LEG Work Calendar found."
    };
  }

  const calendar = CalendarApp.createCalendar(CONFIG.LEG_WORK_CALENDAR_NAME);

  if (!calendar || calendar.getName() !== CONFIG.LEG_WORK_CALENDAR_NAME) {
    return {
      success: false,
      message: "Failed to access LEG Work Calendar safely."
    };
  }

  return {
    success: true,
    calendar,
    message: "LEG Work Calendar created."
  };
}