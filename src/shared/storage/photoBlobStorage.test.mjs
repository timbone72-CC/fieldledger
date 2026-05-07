import assert from "node:assert/strict";
import { loadPhotoBlob } from "./photoBlobStorage.js";

const originalWindow = global.window;

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
              get: () => {
                const getRequest = {};

                queueMicrotask(() => {
                  getRequest.result = null;
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

global.window = originalWindow;

console.log("photoBlobStorage tests passed");
