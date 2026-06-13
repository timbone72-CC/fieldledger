import assert from "node:assert/strict";
import { loadPhotoBlob, savePhotoBlobWithId } from "./photoBlobStorage.js";

const originalWindow = global.window;
const photoRecords = new Map();

global.window = {
  indexedDB: {
    open() {
      const request = {};

      queueMicrotask(() => {
        request.result = {
          objectStoreNames: {
            contains: () => true,
          },
          transaction: () => ({
            objectStore: () => ({
              put: (photoRecord) => {
                const putRequest = {};

                queueMicrotask(() => {
                  photoRecords.set(photoRecord.id, photoRecord);
                  putRequest.onsuccess?.();
                });

                return putRequest;
              },
              get: () => {
                const getRequest = {};

                queueMicrotask(() => {
                  getRequest.result = photoRecords.get("restored-photo-id") || null;
                  getRequest.onsuccess?.();
                });

                return getRequest;
              },
            }),
            oncomplete: null,
          }),
          close: () => {},
        };

        request.onsuccess?.();
      });

      return request;
    },
  },
};

const missingPhoto = await loadPhotoBlob("missing-photo-id");

assert.equal(missingPhoto, null);

const restoredBlob = new Blob(["restored photo"], { type: "image/jpeg" });
const restoredPhotoId = await savePhotoBlobWithId({
  id: "restored-photo-id",
  blob: restoredBlob,
  name: "restored-ticket.jpg",
  type: "image/jpeg",
  size: restoredBlob.size,
  createdAt: "2026-06-13T12:00:00.000Z",
});
const restoredPhoto = await loadPhotoBlob("restored-photo-id");

assert.equal(restoredPhotoId, "restored-photo-id");
assert.equal(restoredPhoto.id, "restored-photo-id");
assert.equal(restoredPhoto.name, "restored-ticket.jpg");
assert.equal(restoredPhoto.type, "image/jpeg");
assert.equal(await restoredPhoto.blob.text(), "restored photo");

global.window = originalWindow;

console.log("photoBlobStorage tests passed");
