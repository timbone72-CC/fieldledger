function buildNonJsonCompleteBackupMessage() {
  return [
    "Complete Backup endpoint did not return JSON.",
    "Check that the Web App URL is the deployed Apps Script /exec URL and that Complete Backup Drive save is deployed.",
  ].join(" ");
}

function isValidAppsScriptWebAppUrl(webAppUrl) {
  try {
    const parsedUrl = new URL(webAppUrl);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === "script.google.com" &&
      parsedUrl.pathname.endsWith("/exec")
    );
  } catch {
    return false;
  }
}

async function readCompleteBackupJson(response) {
  if (typeof response?.text === "function") {
    const responseText = await response.text();

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(buildNonJsonCompleteBackupMessage());
    }
  }

  if (typeof response?.json === "function") {
    try {
      return await response.json();
    } catch {
      throw new Error(buildNonJsonCompleteBackupMessage());
    }
  }

  throw new Error(buildNonJsonCompleteBackupMessage());
}

export async function sendCompleteBackupToDrive({
  webAppUrl,
  completeBackupToken,
  completeBackupPackage,
  fetchImpl = fetch,
}) {
  const trimmedWebAppUrl = String(webAppUrl || "").trim();
  const trimmedCompleteBackupToken = String(completeBackupToken || "").trim();

  if (!trimmedWebAppUrl) {
    return {
      success: false,
      message: "Complete Backup web app URL is required.",
    };
  }

  if (!isValidAppsScriptWebAppUrl(trimmedWebAppUrl)) {
    return {
      success: false,
      message: "Complete Backup web app URL must be a deployed Google Apps Script /exec URL.",
    };
  }

  if (!trimmedCompleteBackupToken) {
    return {
      success: false,
      message: "Complete Backup token is required.",
    };
  }

  if (!completeBackupPackage || typeof completeBackupPackage !== "object") {
    return {
      success: false,
      message: "Complete Backup package is required.",
    };
  }

  if (completeBackupPackage.packageType !== "fieldledger.completeBackup") {
    return {
      success: false,
      message: "Complete Backup package type must be fieldledger.completeBackup.",
    };
  }

  const formBody = new URLSearchParams();
  formBody.set("action", "saveCompleteBackupToDrive");
  formBody.set("token", trimmedCompleteBackupToken);
  formBody.set("completeBackupPackage", JSON.stringify(completeBackupPackage));

  try {
    const response = await fetchImpl(trimmedWebAppUrl, {
      method: "POST",
      body: formBody,
    });
    const result = await readCompleteBackupJson(response);

    return {
      success: Boolean(result?.ok || result?.success),
      message: result?.message || "Complete Backup endpoint response did not include a message.",
      fileName: result?.fileName,
      folderName: result?.folderName,
      driveRootFolderName: result?.driveRootFolderName,
      folderPath: result?.folderPath,
      fileUrl: result?.fileUrl,
      createdAt: result?.createdAt,
      summary: result?.summary,
    };
  } catch (error) {
    return {
      success: false,
      message: `Complete Backup Drive save failed: ${error.message}`,
    };
  }
}
