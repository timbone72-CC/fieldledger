const DEFAULT_PART_MAX_LENGTH = 48;
const DEFAULT_FILE_TYPE_MAX_LENGTH = 32;

export function sanitizeFilePart(value, options = {}) {
  const fallback = options.fallback ?? "";
  const maxLength = Number(options.maxLength || DEFAULT_PART_MAX_LENGTH);
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return fallback;
  }

  const safeValue = rawValue
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/\.+/g, "-")
    .replace(/[^A-Za-z0-9 _-]+/g, " ")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");

  return safeValue || fallback;
}

export function formatRecordDate(value) {
  if (!value) {
    return "undated";
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    const isoDateMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoDateMatch) {
      return `${isoDateMatch[1]}${isoDateMatch[2]}${isoDateMatch[3]}`;
    }

    if (/^\d{8}$/.test(trimmedValue)) {
      return trimmedValue;
    }
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "undated";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

export function buildRecordKey(record) {
  const datePart = formatRecordDate(record?.date);
  const ticketPart = sanitizeFilePart(record?.fieldTicketNumber, {
    fallback: "no-ticket",
  });
  const companyPart = sanitizeFilePart(record?.company, {
    fallback: "company",
  });

  return [datePart, ticketPart, companyPart].join("__");
}

export function buildRecordFolderName(record) {
  return buildRecordKey(record);
}

export function buildRecordFileName(record, fileType, extension, options = {}) {
  const recordKey = buildRecordKey(record);
  const typePart = sanitizeFilePart(fileType, {
    fallback: options.fileTypeFallback || "file",
    maxLength: options.fileTypeMaxLength || DEFAULT_FILE_TYPE_MAX_LENGTH,
  });
  const extensionPart = sanitizeExtension(extension);
  const baseName = `${recordKey}__${typePart}`;

  return extensionPart ? `${baseName}.${extensionPart}` : baseName;
}

function sanitizeExtension(extension) {
  const rawExtension = String(extension ?? "")
    .trim()
    .replace(/^\.+/, "");

  if (!rawExtension) {
    return "";
  }

  return sanitizeFilePart(rawExtension, {
    fallback: "",
    maxLength: 12,
  }).replaceAll(".", "");
}
