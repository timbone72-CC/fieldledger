import {
  buildRecordFileName,
  buildRecordFolderName,
  buildRecordKey,
} from "../../shared/utils/recordFileNames.js";
import { formatCsvCell, getHoursWorkedForTimesheet } from "./payPeriodCsv.js";

const RECORD_PACKAGE_SCHEMA_VERSION = 1;

export async function buildRecordPackageExport({ job, loadPhotoBlob }) {
  const safeJob = job && typeof job === "object" ? job : {};
  const recordKey = buildRecordKey(safeJob);
  const folderName = buildRecordFolderName(safeJob);
  const manifestFileName = buildRecordFileName(safeJob, "manifest", "json");
  const jobBackupFileName = buildRecordFileName(safeJob, "job-backup", "json");
  const recordsFileName = buildRecordFileName(safeJob, "records", "csv");
  const loadedPhoto = await loadTicketPhoto(safeJob, loadPhotoBlob);
  const photoStatus = getPhotoStatus(safeJob, loadedPhoto);
  const photoFile = buildTicketPhotoFile(safeJob, loadedPhoto);

  const fileSummaries = [
    {
      role: "manifest",
      fileName: manifestFileName,
      mimeType: "application/json",
      included: true,
    },
    {
      role: "job-backup",
      fileName: jobBackupFileName,
      mimeType: "application/json",
      included: true,
    },
    {
      role: "records",
      fileName: recordsFileName,
      mimeType: "text/csv",
      included: true,
    },
  ];

  if (photoFile) {
    fileSummaries.push({
      role: "ticket-photo",
      fileName: photoFile.fileName,
      mimeType: photoFile.mimeType,
      included: true,
    });
  } else if (safeJob.ticketPhotoId) {
    fileSummaries.push({
      role: "ticket-photo",
      fileName: buildRecordFileName(safeJob, "ticket-photo-01", "jpg"),
      mimeType: "image/jpeg",
      included: false,
    });
  }

  const manifest = {
    schemaVersion: RECORD_PACKAGE_SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    recordKey,
    folderName,
    jobId: safeJob.id || "",
    date: safeJob.date || "",
    fieldTicketNumber: safeJob.fieldTicketNumber || "",
    company: safeJob.company || "",
    rigNameOrNumber: safeJob.rigNameOrNumber || "",
    jobType: safeJob.jobType || "",
    photoStatus,
    files: fileSummaries,
  };

  const files = [
    {
      role: "manifest",
      fileName: manifestFileName,
      mimeType: "application/json",
      text: JSON.stringify(manifest, null, 2),
    },
    {
      role: "job-backup",
      fileName: jobBackupFileName,
      mimeType: "application/json",
      text: JSON.stringify(safeJob, null, 2),
    },
    {
      role: "records",
      fileName: recordsFileName,
      mimeType: "text/csv",
      text: buildOneJobRecordsCsv(safeJob),
    },
  ];

  if (photoFile) {
    files.push(photoFile);
  }

  return {
    recordKey,
    folderName,
    files,
    manifest,
  };
}

function buildOneJobRecordsCsv(job) {
  const rows = [
    [
      "Date",
      "Company",
      "Rig Name/Number",
      "Field Ticket Number",
      "Day Rate",
      "Hours Worked",
      "Transportation",
      "Total",
    ],
    [
      job.date || "",
      job.company || "",
      job.rigNameOrNumber || "",
      job.fieldTicketNumber || "",
      job.baseJobPay ?? "",
      getHoursWorkedForTimesheet(job),
      job.transportation ?? "",
      job.totalPay ?? 0,
    ],
  ];

  return rows.map((row) => row.map(formatCsvCell).join(",")).join("\n");
}

async function loadTicketPhoto(job, loadPhotoBlob) {
  if (!job.ticketPhotoId || typeof loadPhotoBlob !== "function") {
    return null;
  }

  return loadPhotoBlob(job.ticketPhotoId);
}

function getPhotoStatus(job, loadedPhoto) {
  if (!job.ticketPhotoId) {
    return "none";
  }

  return isValidPhotoRecord(loadedPhoto) ? "included" : "missing";
}

function buildTicketPhotoFile(job, loadedPhoto) {
  if (!isValidPhotoRecord(loadedPhoto)) {
    return null;
  }

  const mimeType = loadedPhoto.type || loadedPhoto.blob.type || "image/jpeg";

  return {
    role: "ticket-photo",
    fileName: buildRecordFileName(job, "ticket-photo-01", getPhotoExtension(loadedPhoto)),
    mimeType,
    blob: loadedPhoto.blob,
  };
}

function isValidPhotoRecord(photoRecord) {
  return Boolean(photoRecord?.blob);
}

function getPhotoExtension(photoRecord) {
  const typeExtension = getPhotoExtensionFromMimeType(photoRecord?.type || photoRecord?.blob?.type);

  if (typeExtension) {
    return typeExtension;
  }

  const nameExtension = getPhotoExtensionFromName(photoRecord?.name);

  return nameExtension || "jpg";
}

function getPhotoExtensionFromMimeType(mimeType) {
  const normalizedType = String(mimeType || "").trim().toLowerCase();

  if (normalizedType === "image/jpeg" || normalizedType === "image/jpg") {
    return "jpg";
  }

  if (normalizedType === "image/png") {
    return "png";
  }

  if (normalizedType === "image/webp") {
    return "webp";
  }

  if (normalizedType === "image/heic") {
    return "heic";
  }

  if (normalizedType === "image/heif") {
    return "heif";
  }

  return "";
}

function getPhotoExtensionFromName(name) {
  const extension = String(name || "")
    .trim()
    .split(".")
    .pop()
    ?.toLowerCase();

  if (["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(extension)) {
    return extension === "jpeg" ? "jpg" : extension;
  }

  return "";
}
