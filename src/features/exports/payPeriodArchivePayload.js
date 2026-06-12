import { buildPayPeriodArchivePlan } from "./payPeriodArchivePlan.js";
import { buildPayPeriodCsv } from "./payPeriodCsv.js";

const ARCHIVE_ACTION = "archivePayPeriod";

export async function buildPayPeriodArchivePayload({
  payPeriod,
  settings,
  appInfo,
  createdAt,
  loadPhotoBlob,
  encodeBlobAsBase64,
} = {}) {
  const plan = buildPayPeriodArchivePlan({
    payPeriod,
    settings,
    appInfo,
    createdAt,
  });
  const photoResults = await buildPhotoPayloadEntries({
    photoReferences: plan.photoReferences,
    loadPhotoBlob,
    encodeBlobAsBase64,
  });
  const manifest = buildManifest({
    plan,
    photos: photoResults.photos,
    missingPhotos: photoResults.missingPhotos,
  });
  const files = buildTextFileEntries({
    plan,
    payPeriod,
    manifest,
  });

  return {
    action: ARCHIVE_ACTION,
    archiveType: plan.archiveType,
    archiveSchemaVersion: plan.archiveSchemaVersion,
    manifest,
    files,
    photos: photoResults.photos,
    missingPhotos: photoResults.missingPhotos,
    summary: {
      fileCount: files.length,
      photoCount: photoResults.photos.length,
      missingPhotoCount: photoResults.missingPhotos.length,
    },
  };
}

function buildTextFileEntries({ plan, payPeriod, manifest }) {
  return [
    {
      role: "open-me",
      fileName: plan.openMeFileName,
      relativePath: plan.openMeFileName,
      mimeType: "text/plain",
      contentText: buildOpenMeText({ plan, manifest }),
    },
    {
      role: "manifest",
      fileName: plan.manifestFileName,
      relativePath: plan.manifestFileName,
      mimeType: "application/json",
      contentText: `${JSON.stringify(manifest, null, 2)}\n`,
    },
    {
      role: "pay-period-backup",
      fileName: plan.backupFileName,
      relativePath: plan.backupFileName,
      mimeType: "application/json",
      contentText: `${JSON.stringify(payPeriod || {}, null, 2)}\n`,
    },
    {
      role: "timesheet-csv",
      fileName: plan.csvFileName,
      relativePath: plan.csvFileName,
      mimeType: "text/csv",
      contentText: buildPayPeriodCsv(payPeriod || {}),
    },
  ];
}

function buildOpenMeText({ plan, manifest }) {
  return [
    "FieldLedger Pay Period Archive",
    "",
    `Archive folder: ${plan.driveRootFolderName}/${plan.monthFolderName}/${plan.archiveFolderName}`,
    `Created: ${manifest.createdAt}`,
    `Pay period: ${manifest.payPeriod.label || "Current Pay Period"}`,
    "",
    "The backup JSON is the structured restore source.",
    "The CSV is a human-readable report only.",
    "Photos are evidence files and must be restored separately in a future restore step.",
    "",
    `Included photos: ${manifest.photoArchive.includedPhotoCount}`,
    `Missing photos: ${manifest.photoArchive.missingPhotoCount}`,
    "",
  ].join("\n");
}

async function buildPhotoPayloadEntries({
  photoReferences,
  loadPhotoBlob,
  encodeBlobAsBase64,
}) {
  const photos = [];
  const missingPhotos = [];

  for (const photoReference of photoReferences) {
    if (typeof loadPhotoBlob !== "function") {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-loader-unavailable"));
      continue;
    }

    let photoRecord;

    try {
      photoRecord = await loadPhotoBlob(photoReference.photoId);
    } catch {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-load-failed"));
      continue;
    }

    if (!photoRecord) {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-not-found"));
      continue;
    }

    if (typeof encodeBlobAsBase64 !== "function") {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-encoder-unavailable"));
      continue;
    }

    try {
      const sourceBlob = photoRecord.blob ?? photoRecord;
      const encodedPhoto = await encodeBlobAsBase64(sourceBlob);
      const base64 = typeof encodedPhoto === "string"
        ? encodedPhoto
        : encodedPhoto?.base64;

      if (!base64) {
        missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-encode-empty"));
        continue;
      }

      photos.push({
        role: photoReference.role,
        photoId: photoReference.photoId,
        relatedRecordId: photoReference.relatedRecordId,
        fileName: photoReference.fileName,
        relativePath: photoReference.relativePath,
        expectedPath: photoReference.expectedPath,
        mimeType: encodedPhoto?.mimeType || photoRecord.type || sourceBlob?.type || photoReference.mimeType,
        base64,
      });
    } catch {
      missingPhotos.push(buildMissingPhotoEntry(photoReference, "photo-encode-failed"));
    }
  }

  return {
    photos,
    missingPhotos,
  };
}

function buildMissingPhotoEntry(photoReference, reason) {
  return {
    role: photoReference.role,
    photoId: photoReference.photoId,
    relatedRecordId: photoReference.relatedRecordId,
    fileName: photoReference.fileName,
    relativePath: photoReference.relativePath,
    expectedPath: photoReference.expectedPath,
    reason,
  };
}

function buildManifest({ plan, photos, missingPhotos }) {
  const includedPhotoIds = new Set(photos.map((photo) => photo.photoId));
  const missingPhotoIds = new Set(missingPhotos.map((photo) => photo.photoId));
  const expectedFiles = plan.expectedFiles.map((file) => {
    const photoReference = plan.photoReferences.find((photo) => photo.expectedPath === file.path);

    if (!photoReference) {
      return { ...file };
    }

    return {
      ...file,
      included: includedPhotoIds.has(photoReference.photoId),
      missing: missingPhotoIds.has(photoReference.photoId),
    };
  });

  return {
    ...plan.manifest,
    counts: {
      ...plan.manifest.counts,
      includedPhotos: photos.length,
      missingPhotos: missingPhotos.length,
    },
    expectedFiles,
    photoReferences: plan.photoReferences.map((photoReference) => ({
      ...photoReference,
      included: includedPhotoIds.has(photoReference.photoId),
      missing: missingPhotoIds.has(photoReference.photoId),
    })),
    photoArchive: {
      expectedPhotoCount: plan.photoReferences.length,
      includedPhotoCount: photos.length,
      missingPhotoCount: missingPhotos.length,
    },
    missingPhotos: missingPhotos.map((photo) => ({ ...photo })),
  };
}
