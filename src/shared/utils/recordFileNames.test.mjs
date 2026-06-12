import assert from "node:assert/strict";
import {
  buildRecordFileName,
  buildRecordFolderName,
  buildRecordKey,
  formatRecordDate,
  sanitizeFilePart,
} from "./recordFileNames.js";

const normalRecord = {
  date: "2026-06-12",
  fieldTicketNumber: "FT3921",
  company: "Legend",
  rigNameOrNumber: "Rig 27",
};

assert.equal(buildRecordKey(normalRecord), "20260612__FT3921__Legend");
assert.equal(buildRecordFolderName(normalRecord), "20260612__FT3921__Legend");
assert.equal(formatRecordDate("2026-06-12"), "20260612");

assert.equal(
  buildRecordKey({
    ...normalRecord,
    date: "",
  }),
  "undated__FT3921__Legend",
);

assert.equal(
  buildRecordKey({
    ...normalRecord,
    fieldTicketNumber: "",
  }),
  "20260612__no-ticket__Legend",
);

assert.equal(
  buildRecordKey({
    ...normalRecord,
    company: "",
  }),
  "20260612__FT3921__company",
);

assert.equal(
  buildRecordKey({
    date: "2026-06-12",
    fieldTicketNumber: " FT/3921: Rev A ",
    company: " Legend: Energy / Group ",
  }),
  "20260612__FT-3921-Rev-A__Legend-Energy-Group",
);

assert.equal(
  buildRecordFileName(normalRecord, "backup", ".json"),
  "20260612__FT3921__Legend__backup.json",
);

assert.equal(
  buildRecordFileName(normalRecord, "records", "csv"),
  "20260612__FT3921__Legend__records.csv",
);

assert.equal(
  buildRecordFileName(normalRecord, "photo-01", ".jpg"),
  "20260612__FT3921__Legend__photo-01.jpg",
);

assert.equal(
  buildRecordFileName(normalRecord, "summary", "pdf"),
  "20260612__FT3921__Legend__summary.pdf",
);

const fileNameWithRigAvailable = buildRecordFileName(normalRecord, "backup", "json");
assert.equal(fileNameWithRigAvailable.includes("Rig"), false);
assert.equal(fileNameWithRigAvailable.includes("27"), false);

const deterministicRecord = {
  date: "2026-06-12",
  fieldTicketNumber: " FT 3921 ",
  company: "Legend Energy",
};

assert.equal(
  buildRecordFileName(deterministicRecord, "photo-01", "jpg"),
  buildRecordFileName(deterministicRecord, "photo-01", "jpg"),
);

assert.equal(
  buildRecordFileName(
    {
      date: "2026-06-12",
      fieldTicketNumber: "FT 3921",
      company: "Legend Energy",
    },
    "records csv",
    ".csv",
  ),
  "20260612__FT-3921__Legend-Energy__records-csv.csv",
);

assert.equal(sanitizeFilePart("  Field Ticket #3921 -- LEG  "), "Field-Ticket-3921-LEG");

console.log("recordFileNames tests passed");
