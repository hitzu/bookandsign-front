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
  const [hasSelection, setHasSelection] = useState(false);
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
        const maxW =
          typeof window !== "undefined"
            ? Math.min(window.innerWidth * 0.95, 420)
            : 400;
        const maxH =
          typeof window !== "undefined"
            ? window.innerHeight * 0.75
            : 500;
        const scale = Math.min(maxW / imgW, maxH / imgH);
        const displayW = Math.round(imgW * scale);
        const displayH = Math.round(imgH * scale);

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

        img.set({
          scaleX: scale,
          scaleY: scale,
          originX: "left",
          originY: "top",
          left: 0,
          top: 0,
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
        fabricCanvas.on("selection:cleared", () => setHasSelection(false));

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
      style={
        canvasSize
          ? { width: canvasSize.width, height: canvasSize.height }
          : undefined
      }
    >
      <div ref={containerRef} className={styles.personalizeCanvasContainer} />
      {hasSelection && (
        <button
          type="button"
          className={styles.stickerDeleteBtn}
          onClick={handleDeleteSelected}
          aria-label="Eliminar sticker"
        >
          Eliminar 🗑
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
