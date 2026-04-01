import type { Canvas } from "fabric";

export const PERSONALIZED_PHOTO_EXPORT_MIME = "image/jpeg";
export const PERSONALIZED_PHOTO_EXPORT_QUALITY = 0.96;

const MAX_EXPORT_DIMENSION_PX = 2048;

/**
 * Export canvas to Blob for download.
 * TDD Iteración 6.
 */
export async function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  format: "image/jpeg" | "image/png" = "image/jpeg",
  quality = PERSONALIZED_PHOTO_EXPORT_QUALITY,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      format,
      quality,
    );
  });
}

/**
 * Export Fabric canvas cropped to the photo area, without selection controls.
 * BUG 1: Crops to background image bounds to avoid black space.
 * BUG 2: Deselects before export so no bounding box/handles appear.
 */
export async function exportFabricCanvasToBlob(
  fabricCanvas: Canvas,
  format: "image/jpeg" | "image/png" = "image/jpeg",
  quality = PERSONALIZED_PHOTO_EXPORT_QUALITY,
): Promise<Blob> {
  fabricCanvas.discardActiveObject();
  fabricCanvas.requestRenderAll();

  await new Promise<void>((r) => requestAnimationFrame(() => r()));

  const bg = fabricCanvas.backgroundImage;
  const sourceCanvas = fabricCanvas.getElement();

  const fmt = format === "image/jpeg" ? "jpeg" : "png";
  const exportMultiplier = getFabricExportMultiplier(fabricCanvas);

  if (bg) {
    const left = bg.left ?? 0;
    const top = bg.top ?? 0;
    const w = (bg.width ?? 0) * (bg.scaleX ?? 1);
    const h = (bg.height ?? 0) * (bg.scaleY ?? 1);
    if (w > 0 && h > 0) {
      const blob = await fabricCanvas.toBlob({
        left,
        top,
        width: w,
        height: h,
        format: fmt as "jpeg" | "png",
        quality,
        multiplier: exportMultiplier,
      });
      if (blob) return blob;
    }
  }

  return exportCanvasToBlob(sourceCanvas, format, quality);
}

export function buildPersonalizedPhotoFilename(now = new Date()): string {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  return `photo_customized_${stamp}.jpg`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getFabricExportMultiplier(fabricCanvas: Canvas): number {
  const bg = fabricCanvas.backgroundImage;
  const displayWidth = fabricCanvas.getWidth();
  const displayHeight = fabricCanvas.getHeight();
  const displayMaxDimension = Math.max(displayWidth, displayHeight, 1);

  const maxDimensionMultiplier = MAX_EXPORT_DIMENSION_PX / displayMaxDimension;

  if (!bg) {
    return Math.max(1, maxDimensionMultiplier);
  }

  const exportedWidth = (bg.width ?? 0) * (bg.scaleX ?? 1);
  const exportedHeight = (bg.height ?? 0) * (bg.scaleY ?? 1);
  const naturalWidth = bg.width ?? exportedWidth;
  const naturalHeight = bg.height ?? exportedHeight;

  const naturalWidthMultiplier =
    exportedWidth > 0 ? naturalWidth / exportedWidth : 1;
  const naturalHeightMultiplier =
    exportedHeight > 0 ? naturalHeight / exportedHeight : 1;
  const naturalMultiplier = Math.min(
    Math.max(1, naturalWidthMultiplier),
    Math.max(1, naturalHeightMultiplier),
  );

  return Math.max(1, Math.min(naturalMultiplier, maxDimensionMultiplier));
}
