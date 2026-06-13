const PHOTO_DATABASE_NAME = "fieldledger.photos";
const PHOTO_DATABASE_VERSION = 1;
const PHOTO_STORE_NAME = "photos";

function openPhotoDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this browser."));
      return;
    }

    const request = window.indexedDB.open(PHOTO_DATABASE_NAME, PHOTO_DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        database.createObjectStore(PHOTO_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to open photo storage."));
    };
  });
}

export async function savePhotoBlob(file) {
  const id = crypto.randomUUID();

  return savePhotoRecord({
    id,
    name: file.name || "photo",
    type: file.type || "application/octet-stream",
    size: file.size || 0,
    blob: file,
    createdAt: new Date().toISOString(),
  });
}

export async function savePhotoBlobWithId({ id, blob, name, type, size, createdAt }) {
  if (!id || typeof id !== "string") {
    throw new Error("Photo ID is required.");
  }

  if (!blob) {
    throw new Error("Photo blob is required.");
  }

  return savePhotoRecord({
    id,
    name: name || "photo",
    type: type || blob.type || "application/octet-stream",
    size: Number.isFinite(size) ? size : blob.size || 0,
    blob,
    createdAt: createdAt || new Date().toISOString(),
  });
}

async function savePhotoRecord(photoRecord) {
  const database = await openPhotoDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE_NAME, "readwrite");
    const store = transaction.objectStore(PHOTO_STORE_NAME);
    const request = store.put(photoRecord);

    request.onsuccess = () => {
      resolve(photoRecord.id);
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to save photo."));
    };

    transaction.oncomplete = () => {
      database.close();
    };

    transaction.onerror = () => {
      reject(transaction.error || new Error("Photo save transaction failed."));
    };
  });
}

export async function loadPhotoBlob(photoId) {
  if (!photoId) {
    return null;
  }

  const database = await openPhotoDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE_NAME, "readonly");
    const store = transaction.objectStore(PHOTO_STORE_NAME);
    const request = store.get(photoId);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to load photo."));
    };

    transaction.oncomplete = () => {
      database.close();
    };
  });
}

export async function deletePhotoBlob(photoId) {
  if (!photoId) {
    return;
  }

  const database = await openPhotoDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE_NAME, "readwrite");
    const store = transaction.objectStore(PHOTO_STORE_NAME);
    const request = store.delete(photoId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to delete photo."));
    };

    transaction.oncomplete = () => {
      database.close();
    };
  });
}
