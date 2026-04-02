"use client";

import React, { useRef, useCallback, useEffect } from "react";
import type { DedicationEventType } from "../utils/dedicationPhrases";
import styles from "@assets/css/party-public.module.css";

/* ── Constants ── */

const POLAROID_PAD = 10;
const TEXT_SAFE_PAD = 12;
const EXPORT_PHOTO_SIZE = 1080;

/* ── Types ── */

export type StepDedicateHandle = {
  exportToBlob: () => Promise<Blob>;
};

type StepDedicateProps = {
  /** Blob URL of the flattened photo+stickers from Paso 2 */
  composedPhotoUrl: string;
  dedicationText: string;
  onDedicationTextChange: (text: string) => void;
  eventType: DedicationEventType;
  onReady: (api: StepDedicateHandle) => void;
};

/* ── Component ── */

const StepDedicate = ({
  composedPhotoUrl,
  dedicationText,
  onDedicationTextChange,
  eventType,
  onReady,
}: StepDedicateProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const dedicationTextRef = useRef(dedicationText);
    dedicationTextRef.current = dedicationText;

    const handleTextAreaClick = useCallback(() => {
      textareaRef.current?.focus();
    }, []);

    /* ── Expose export API via onReady ── */

    useEffect(() => {
      onReady({
        exportToBlob: async () => {
          const img = imgRef.current;
          if (!img) throw new Error("Composed photo not loaded");

          // Wait for image to be fully decoded
          if (img.naturalWidth === 0) {
            await new Promise<void>((resolve) => {
              img.onload = () => resolve();
            });
          }

          const currentText = dedicationTextRef.current;
          const exportPad = Math.round(
            (POLAROID_PAD / 380) * EXPORT_PHOTO_SIZE,
          );
          const whiteAreaHeight = Math.round(EXPORT_PHOTO_SIZE * 0.25);
          const totalW = EXPORT_PHOTO_SIZE + exportPad * 2;
          const totalH = EXPORT_PHOTO_SIZE + exportPad + whiteAreaHeight + exportPad;

          const canvas = document.createElement("canvas");
          canvas.width = totalW;
          canvas.height = totalH;
          const ctx = canvas.getContext("2d")!;

          // White background (polaroid frame)
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, totalW, totalH);

          // Draw composed photo (already cropped + stickers flattened)
          ctx.drawImage(
            img,
            0,
            0,
            img.naturalWidth,
            img.naturalHeight,
            exportPad,
            exportPad,
            EXPORT_PHOTO_SIZE,
            EXPORT_PHOTO_SIZE,
          );

          // Draw dedication text in white area
          if (currentText.trim()) {
            const textSafePad = Math.round(
              (TEXT_SAFE_PAD / 380) * EXPORT_PHOTO_SIZE,
            );
            const maxWidth = EXPORT_PHOTO_SIZE - textSafePad * 2;
            const fontSize = Math.round(EXPORT_PHOTO_SIZE * 0.032);
            ctx.font = `${fontSize}px 'Comic Sans MS', 'Chalkboard SE', cursive`;
            ctx.fillStyle = "#333333";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const textX = totalW / 2;
            const textY = EXPORT_PHOTO_SIZE + exportPad + whiteAreaHeight / 2;

            const lines = wrapText(ctx, currentText, maxWidth);
            const lineHeight = fontSize * 1.4;
            const startY = textY - ((lines.length - 1) * lineHeight) / 2;
            for (let i = 0; i < lines.length; i++) {
              ctx.fillText(lines[i], textX, startY + i * lineHeight);
            }
          }

          return new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (blob) =>
                blob ? resolve(blob) : reject(new Error("Export failed")),
              "image/jpeg",
              0.96,
            );
          });
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className={styles.dedicateStepWrap}>
        {/* Polaroid preview */}
        <div className={styles.polaroidFrame}>
          <div className={styles.polaroidPhotoAreaStatic}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={composedPhotoUrl}
              alt="Tu foto personalizada"
              crossOrigin="anonymous"
              className={styles.polaroidPhotoStatic}
            />
          </div>
          <div
            className={`${styles.polaroidWhiteArea} ${styles.polaroidWhiteAreaEditable}`}
            onClick={handleTextAreaClick}
          >
            <textarea
              ref={textareaRef}
              className={styles.dedicationTextArea}
              placeholder="Escribe tu dedicatoria..."
              value={dedicationText}
              onChange={(e) => onDedicationTextChange(e.target.value)}
              maxLength={120}
              rows={2}
            />
          </div>
        </div>
      </div>
    );
};

export default StepDedicate;

/* ── Helpers ── */

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}
