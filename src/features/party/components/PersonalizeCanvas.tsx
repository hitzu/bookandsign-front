"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { Canvas, FabricImage, util } from "fabric";
import {
  exportFabricCanvasToBlob,
  PERSONALIZED_PHOTO_EXPORT_MIME,
  PERSONALIZED_PHOTO_EXPORT_QUALITY,
} from "../utils/personalizeExport";
import styles from "@assets/css/party-public.module.css";

const STICKER_SIZE = 72;
const CANVAS_IMAGE_LOAD_OPTIONS = { crossOrigin: "anonymous" } as const;

type PersonalizeCanvasProps = {
  imageUrl: string;
  onCanvasReady: (api: {
    exportToBlob: () => Promise<Blob>;
    addSticker: (url: string) => void;
  }) => void;
  isTrayOpen?: boolean;
};

const PersonalizeCanvas = ({
  imageUrl,
  onCanvasReady,
}: PersonalizeCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const deleteZoneRef = useRef<HTMLButtonElement>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [isOverDelete, setIsOverDelete] = useState(false);
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const addSticker = useCallback(async (stickerUrl: string) => {
    const fabricCanvas = canvasRef.current;
    if (!fabricCanvas) return;

    try {
      const img = await loadCanvasImage(stickerUrl);
      const scale = STICKER_SIZE / Math.max(img.width ?? 1, img.height ?? 1);
      img.scale(scale);
      const w = fabricCanvas.width ?? 0;
      const h = fabricCanvas.height ?? 0;
      const centerX = w / 2 - ((img.width ?? 0) * scale) / 2;
      const centerY = h / 2 - ((img.height ?? 0) * scale) / 2;
      img.set({
        left: centerX,
        top: centerY,
        selectable: true,
        evented: true,
      });
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();

      img.set({ scaleX: scale * 0.9, scaleY: scale * 0.9 });
      fabricCanvas.renderAll();
      util.animate({
        startValue: scale * 0.9,
        endValue: scale * 1.08,
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

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    const container = containerRef.current;
    let cancelled = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const fc = canvasRef.current;
      if (
        fc &&
        (e.key === "Delete" || e.key === "Backspace") &&
        fc.getActiveObject()
      ) {
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
        const imgH = img.height ?? 1;

        // Fullscreen canvas — cover the entire viewport
        const displayW = window.innerWidth;
        const displayH = window.innerHeight;

        setCanvasSize({ width: displayW, height: displayH });

        container.innerHTML = "";
        const canvasEl = document.createElement("canvas");
        canvasEl.width = displayW;
        canvasEl.height = displayH;
        canvasEl.style.display = "block";
        canvasEl.style.width = "100%";
        canvasEl.style.height = "100%";
        container.appendChild(canvasEl);

        const fabricCanvas = new Canvas(canvasEl, {
          width: displayW,
          height: displayH,
          selection: true,
        });
        canvasRef.current = fabricCanvas;

        // object-fit: cover — scale to fill, crop overflow
        const imgRatio = imgW / imgH;
        const canvasRatio = displayW / displayH;
        let coverScale: number;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          // image wider than canvas — fit by height
          coverScale = displayH / imgH;
          offsetX = (displayW - imgW * coverScale) / 2;
        } else {
          // image taller than canvas — fit by width
          coverScale = displayW / imgW;
          offsetY = (displayH - imgH * coverScale) / 2;
        }

        img.set({
          scaleX: coverScale,
          scaleY: coverScale,
          originX: "left",
          originY: "top",
          left: offsetX,
          top: offsetY,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
        });
        fabricCanvas.backgroundImage = img;
        (img as unknown as { canvas?: Canvas }).canvas = fabricCanvas;
        fabricCanvas.requestRenderAll();

        const handleSelection = () => {
          const active = fabricCanvas.getActiveObject();
          setHasSelection(Boolean(active));
        };

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

          const canvasEl = fabricCanvas.getElement();
          const canvasRect = canvasEl.getBoundingClientRect();
          const btnRect = deleteBtn.getBoundingClientRect();

          const center = obj.getCenterPoint();
          const scaleX = canvasRect.width / (fabricCanvas.width ?? 1);
          const scaleY = canvasRect.height / (fabricCanvas.height ?? 1);
          const objScreenX = canvasRect.left + center.x * scaleX;
          const objScreenY = canvasRect.top + center.y * scaleY;

          const over =
            objScreenX >= btnRect.left &&
            objScreenX <= btnRect.right &&
            objScreenY >= btnRect.top &&
            objScreenY <= btnRect.bottom;

          setIsOverDelete(over);

          // Dim the sticker while it's over the delete zone
          obj.set({ opacity: over ? 0.5 : 1 });
          fabricCanvas.requestRenderAll();
        });

        fabricCanvas.on("mouse:up", () => {
          const obj = fabricCanvas.getActiveObject();
          const deleteBtn = deleteZoneRef.current;
          if (!obj || !deleteBtn) return;

          const canvasEl = fabricCanvas.getElement();
          const canvasRect = canvasEl.getBoundingClientRect();
          const btnRect = deleteBtn.getBoundingClientRect();

          const center = obj.getCenterPoint();
          const scaleX = canvasRect.width / (fabricCanvas.width ?? 1);
          const scaleY = canvasRect.height / (fabricCanvas.height ?? 1);
          const objScreenX = canvasRect.left + center.x * scaleX;
          const objScreenY = canvasRect.top + center.y * scaleY;

          const over =
            objScreenX >= btnRect.left &&
            objScreenX <= btnRect.right &&
            objScreenY >= btnRect.top &&
            objScreenY <= btnRect.bottom;

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

        onCanvasReady({
          exportToBlob: () =>
            exportFabricCanvasToBlob(
              fabricCanvas,
              PERSONALIZED_PHOTO_EXPORT_MIME,
              PERSONALIZED_PHOTO_EXPORT_QUALITY,
            ),
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
        try {
          fc.dispose();
        } catch {
          // ignore
        }
        canvasRef.current = null;
      }
      container.innerHTML = "";
      setCanvasSize(null);
    };
  }, [imageUrl, addSticker, onCanvasReady]);

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
    <div
      className={styles.personalizeCanvasWrap}
      style={{ width: "100vw", height: "100dvh", overflow: "hidden", background: "#000" }}
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
  );
};

export default PersonalizeCanvas;

async function loadCanvasImage(url: string): Promise<FabricImage> {
  return FabricImage.fromURL(url, CANVAS_IMAGE_LOAD_OPTIONS).catch((error) => {
    throw new Error(
      `No se pudo cargar una imagen para personalizar. Verifica CORS. ${String(error)}`,
    );
  });
}
