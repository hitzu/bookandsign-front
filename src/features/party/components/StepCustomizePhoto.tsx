"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { Canvas, FabricImage, util } from "fabric";
import type { CropData } from "./PolaroidCanvas";
import { PERSONALIZED_PHOTO_EXPORT_QUALITY } from "../utils/personalizeExport";
import styles from "@assets/css/party-public.module.css";

const STICKER_SIZE = 72;
const EXPORT_MAX_DIM = 2048;
const CANVAS_IMAGE_LOAD_OPTIONS = { crossOrigin: "anonymous" } as const;

export type StepCustomizeHandle = {
  exportToBlob: () => Promise<Blob>;
  addSticker: (url: string) => void;
};

type StepCustomizePhotoProps = {
  imageUrl: string;
  crop: CropData;
  onReady: (api: StepCustomizeHandle) => void;
};

const StepCustomizePhoto = ({
  imageUrl,
  crop,
  onReady,
}: StepCustomizePhotoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const deleteZoneRef = useRef<HTMLButtonElement>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [isOverDelete, setIsOverDelete] = useState(false);
  const [canvasSize, setCanvasSize] = useState<number | null>(null);

  /* ── Add sticker ── */

  const addSticker = useCallback(async (stickerUrl: string) => {
    const fabricCanvas = canvasRef.current;
    if (!fabricCanvas) return;

    try {
      const img = await loadCanvasImage(stickerUrl);
      const s = STICKER_SIZE / Math.max(img.width ?? 1, img.height ?? 1);
      img.scale(s);
      const w = fabricCanvas.width ?? 0;
      const h = fabricCanvas.height ?? 0;
      const centerX = w / 2 - ((img.width ?? 0) * s) / 2;
      const centerY = h / 2 - ((img.height ?? 0) * s) / 2;
      img.set({ left: centerX, top: centerY, selectable: true, evented: true });
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();

      img.set({ scaleX: s * 0.9, scaleY: s * 0.9 });
      fabricCanvas.renderAll();
      util.animate({
        startValue: s * 0.9,
        endValue: s * 1.08,
        duration: 120,
        easing: util.ease.easeOutCubic,
        onChange: (v: number) => {
          img.set({ scaleX: v, scaleY: v });
          fabricCanvas.renderAll();
        },
      });
    } catch (err) {
      console.error("Failed to add sticker:", err);
    }
  }, []);

  /* ── Init canvas with cropped photo ── */

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    const container = containerRef.current;
    let cancelled = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const fc = canvasRef.current;
      if (fc && (e.key === "Delete" || e.key === "Backspace") && fc.getActiveObject()) {
        e.preventDefault();
        fc.remove(fc.getActiveObject()!);
        fc.discardActiveObject();
        fc.requestRenderAll();
        setHasSelection(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    loadCanvasImage(imageUrl)
      .then((img) => {
        if (cancelled) return;

        const imgW = img.width ?? 1;

        const cropScale = crop.scale;
        const naturalCropSize = imgW;
        const naturalCropY = -crop.offsetY / cropScale;

        const maxW =
          typeof window !== "undefined"
            ? Math.min(window.innerWidth * 0.9, 380)
            : 360;
        const displaySize = maxW;
        setCanvasSize(displaySize);

        container.innerHTML = "";
        const canvasEl = document.createElement("canvas");
        canvasEl.width = displaySize;
        canvasEl.height = displaySize;
        canvasEl.style.display = "block";
        canvasEl.style.width = "100%";
        canvasEl.style.height = "100%";
        container.appendChild(canvasEl);

        const fabricCanvas = new Canvas(canvasEl, {
          width: displaySize,
          height: displaySize,
          selection: true,
        });
        canvasRef.current = fabricCanvas;

        const renderScale = displaySize / naturalCropSize;
        img.set({
          scaleX: renderScale,
          scaleY: renderScale,
          originX: "left",
          originY: "top",
          left: 0,
          top: -naturalCropY * renderScale,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
        });
        fabricCanvas.backgroundImage = img;
        (img as unknown as { canvas?: Canvas }).canvas = fabricCanvas;
        fabricCanvas.requestRenderAll();

        const handleSelection = () => setHasSelection(Boolean(fabricCanvas.getActiveObject()));
        fabricCanvas.on("selection:created", handleSelection);
        fabricCanvas.on("selection:updated", handleSelection);
        fabricCanvas.on("selection:cleared", () => {
          setHasSelection(false);
          setIsOverDelete(false);
        });

        fabricCanvas.on("object:moving", () => {
          const obj = fabricCanvas.getActiveObject();
          const deleteBtn = deleteZoneRef.current;
          if (!obj || !deleteBtn) return;

          const canvasElm = fabricCanvas.getElement();
          const canvasRect = canvasElm.getBoundingClientRect();
          const btnRect = deleteBtn.getBoundingClientRect();
          const center = obj.getCenterPoint();
          const sx = canvasRect.width / (fabricCanvas.width ?? 1);
          const sy = canvasRect.height / (fabricCanvas.height ?? 1);
          const objX = canvasRect.left + center.x * sx;
          const objY = canvasRect.top + center.y * sy;
          const over =
            objX >= btnRect.left && objX <= btnRect.right &&
            objY >= btnRect.top && objY <= btnRect.bottom;
          setIsOverDelete(over);
          obj.set({ opacity: over ? 0.5 : 1 });
          fabricCanvas.requestRenderAll();
        });

        fabricCanvas.on("mouse:up", () => {
          const obj = fabricCanvas.getActiveObject();
          const deleteBtn = deleteZoneRef.current;
          if (!obj || !deleteBtn) return;

          const canvasElm = fabricCanvas.getElement();
          const canvasRect = canvasElm.getBoundingClientRect();
          const btnRect = deleteBtn.getBoundingClientRect();
          const center = obj.getCenterPoint();
          const sx = canvasRect.width / (fabricCanvas.width ?? 1);
          const sy = canvasRect.height / (fabricCanvas.height ?? 1);
          const objX = canvasRect.left + center.x * sx;
          const objY = canvasRect.top + center.y * sy;
          const over =
            objX >= btnRect.left && objX <= btnRect.right &&
            objY >= btnRect.top && objY <= btnRect.bottom;

          if (over) {
            fabricCanvas.remove(obj);
            fabricCanvas.discardActiveObject();
            fabricCanvas.requestRenderAll();
            setHasSelection(false);
          } else {
            obj.set({ opacity: 1 });
            fabricCanvas.requestRenderAll();
          }
          setIsOverDelete(false);
        });

        // Notify parent that the API is ready
        onReady({
          exportToBlob: async () => {
            // Export only the visible square viewport (not the full bg bounds)
            // This is critical for the dedicate flow where the bg image
            // overflows vertically due to the cover-fit crop.
            fabricCanvas.discardActiveObject();
            fabricCanvas.requestRenderAll();
            await new Promise<void>((r) => requestAnimationFrame(() => r()));

            const cw = fabricCanvas.getWidth();
            const ch = fabricCanvas.getHeight();
            const multiplier = Math.min(
              EXPORT_MAX_DIM / Math.max(cw, ch, 1),
              ((fabricCanvas.backgroundImage?.width ?? cw) / cw) || 1,
            );

            const blob = await fabricCanvas.toBlob({
              left: 0,
              top: 0,
              width: cw,
              height: ch,
              format: "jpeg",
              quality: PERSONALIZED_PHOTO_EXPORT_QUALITY,
              multiplier: Math.max(1, multiplier),
            });
            if (blob) return blob;
            throw new Error("Export failed");
          },
          addSticker,
        });
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to load image:", err);
      });

    return () => {
      cancelled = true;
      document.removeEventListener("keydown", handleKeyDown);
      const fc = canvasRef.current;
      if (fc) {
        fc.off("selection:created");
        fc.off("selection:updated");
        fc.off("selection:cleared");
        fc.off("object:moving");
        fc.off("mouse:up");
        try { fc.dispose(); } catch { /* ignore */ }
        canvasRef.current = null;
      }
      container.innerHTML = "";
      setCanvasSize(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, crop]);

  const handleDeleteSelected = useCallback(() => {
    const fabricCanvas = canvasRef.current;
    if (!fabricCanvas) return;
    const active = fabricCanvas.getActiveObject();
    if (active) {
      fabricCanvas.remove(active);
      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
      setHasSelection(false);
    }
  }, []);

  return (
    <div className={styles.customizeStepWrap}>
      <div
        className={styles.safeAreaOverlay}
        style={canvasSize ? { width: canvasSize, height: canvasSize } : undefined}
      >
        <div ref={containerRef} className={styles.personalizeCanvasContainer} />
        {hasSelection && (
          <button
            ref={deleteZoneRef}
            type="button"
            className={`${styles.stickerDeleteBtn}${isOverDelete ? ` ${styles.stickerDeleteBtnActive}` : ""}`}
            onClick={handleDeleteSelected}
            aria-label="Eliminar sticker"
          >
            <span className={styles.stickerDeleteLabel}>Arrastra para eliminar</span>
            <span className={styles.stickerDeleteCircle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2L19 6" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StepCustomizePhoto;

async function loadCanvasImage(url: string): Promise<FabricImage> {
  return FabricImage.fromURL(url, CANVAS_IMAGE_LOAD_OPTIONS).catch((error) => {
    throw new Error(`No se pudo cargar imagen. Verifica CORS. ${String(error)}`);
  });
}
