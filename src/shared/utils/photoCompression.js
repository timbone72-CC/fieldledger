const DEFAULT_MAX_WIDTH = 1600;
const DEFAULT_MAX_HEIGHT = 1600;
const DEFAULT_JPEG_QUALITY = 0.75;
const OUTPUT_TYPE = "image/jpeg";

export function calculateContainedDimensions(width, height, maxWidth = DEFAULT_MAX_WIDTH, maxHeight = DEFAULT_MAX_HEIGHT) {
  const safeWidth = Number(width || 0);
  const safeHeight = Number(height || 0);

  if (safeWidth <= 0 || safeHeight <= 0) {
    return {
      width: 0,
      height: 0,
    };
  }

  const scale = Math.min(1, maxWidth / safeWidth, maxHeight / safeHeight);

  return {
    width: Math.max(1, Math.round(safeWidth * scale)),
    height: Math.max(1, Math.round(safeHeight * scale)),
  };
}

export async function compressImageFile(file, {
  maxWidth = DEFAULT_MAX_WIDTH,
  maxHeight = DEFAULT_MAX_HEIGHT,
  quality = DEFAULT_JPEG_QUALITY,
} = {}) {
  if (!file || !String(file.type || "").startsWith("image/")) {
    return file;
  }

  const image = await loadImageSource(file);
  const sourceWidth = image.width || image.videoWidth || 0;
  const sourceHeight = image.height || image.videoHeight || 0;
  const dimensions = calculateContainedDimensions(sourceWidth, sourceHeight, maxWidth, maxHeight);

  if (!dimensions.width || !dimensions.height) {
    closeImageSource(image);
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
  closeImageSource(image);

  const blob = await canvasToBlob(canvas, OUTPUT_TYPE, quality);

  return new File([blob], buildJpegFileName(file.name), {
    type: OUTPUT_TYPE,
    lastModified: file.lastModified || Date.now(),
  });
}

export function buildJpegFileName(fileName) {
  const rawName = String(fileName || "").trim();

  if (!rawName) {
    return "photo.jpg";
  }

  const dotIndex = rawName.lastIndexOf(".");
  const baseName = dotIndex > 0 ? rawName.slice(0, dotIndex) : rawName;

  return `${baseName || "photo"}.jpg`;
}

async function loadImageSource(file) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }

  return loadHtmlImage(file);
}

function loadHtmlImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Photo could not be loaded for compression."));
    };

    image.src = url;
  });
}

function closeImageSource(image) {
  if (typeof image?.close === "function") {
    image.close();
  }
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Photo could not be compressed."));
        return;
      }

      resolve(blob);
    }, type, quality);
  });
}
