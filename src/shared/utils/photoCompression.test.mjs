import assert from "node:assert/strict";
import { buildJpegFileName, calculateContainedDimensions } from "./photoCompression.js";

assert.deepEqual(
  calculateContainedDimensions(800, 600),
  {
    width: 800,
    height: 600,
  },
);

assert.deepEqual(
  calculateContainedDimensions(3200, 2400),
  {
    width: 1600,
    height: 1200,
  },
);

assert.deepEqual(
  calculateContainedDimensions(1200, 3200),
  {
    width: 600,
    height: 1600,
  },
);

assert.deepEqual(
  calculateContainedDimensions(0, 3200),
  {
    width: 0,
    height: 0,
  },
);

assert.equal(buildJpegFileName("ticket.png"), "ticket.jpg");
assert.equal(buildJpegFileName("receipt"), "receipt.jpg");
assert.equal(buildJpegFileName(""), "photo.jpg");

console.log("photoCompression tests passed");
