"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import styles from "@assets/css/party-public.module.css";

/* ── Types ─────────────────────────────────────── */

export type CropData = {
  offsetY: number;
  scale: number;
  naturalW: number;
  naturalH: number;
};

export type PolaroidCropHandle = {
  /** Returns the current crop so Paso 2 can use it. */
  getCrop: () => CropData;
};

type PolaroidCanvasProps = {
  imageUrl: string;
};

/* ── Component: Paso 1 — square crop with vertical pan ── */

const PolaroidCanvas = forwardRef<PolaroidCropHandle, PolaroidCanvasProps>(
  ({ imageUrl }, ref) => {
    const photoAreaRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const naturalSize = useRef({ w: 1, h: 1 });

    const [imgLoaded, setImgLoaded] = useState(false);
    const [offsetY, setOffsetY] = useState(0);
    const [scale, setScale] = useState(1);
    const [showHint, setShowHint] = useState(true);

    // Drag state (ref for perf)
    const dragState = useRef<{
      active: boolean;
      startY: number;
      origOffsetY: number;
    } | null>(null);

    /* ── Load image & compute initial cover-fit ── */

    const handleImgLoad = useCallback(() => {
      const img = imgRef.current;
      const area = photoAreaRef.current;
      if (!img || !area) return;

      naturalSize.current = {
        w: img.naturalWidth,
        h: img.naturalHeight,
      };

      const areaSize = area.clientWidth;
      const { w, h } = naturalSize.current;
      // Cover-fit: width fills square, height may overflow
      const coverScale = areaSize / w;
      setScale(coverScale);

      // Center vertically
      const displayH = h * coverScale;
      setOffsetY((areaSize - displayH) / 2);

      setImgLoaded(true);
    }, []);

    /* ── Clamp Y so image always covers the square ── */

    const clampY = useCallback((oy: number, s: number) => {
      const area = photoAreaRef.current;
      if (!area) return oy;
      const areaSize = area.clientWidth;
      const dh = naturalSize.current.h * s;
      if (dh <= areaSize) return (areaSize - dh) / 2; // image fits, center it
      return Math.min(0, Math.max(areaSize - dh, oy));
    }, []);

    /* ── Vertical-only pointer drag ── */

    useEffect(() => {
      const area = photoAreaRef.current;
      if (!area || !imgLoaded) return;

      const onPointerDown = (e: PointerEvent) => {
        e.preventDefault();
        area.setPointerCapture(e.pointerId);
        dragState.current = {
          active: true,
          startY: e.clientY,
          origOffsetY: offsetY,
        };
        setShowHint(false);
      };

      const onPointerMove = (e: PointerEvent) => {
        const ds = dragState.current;
        if (!ds?.active) return;
        const dy = e.clientY - ds.startY;
        setOffsetY(clampY(ds.origOffsetY + dy, scale));
      };

      const onPointerUp = () => {
        if (dragState.current) dragState.current.active = false;
      };

      area.addEventListener("pointerdown", onPointerDown);
      area.addEventListener("pointermove", onPointerMove);
      area.addEventListener("pointerup", onPointerUp);
      area.addEventListener("pointercancel", onPointerUp);

      return () => {
        area.removeEventListener("pointerdown", onPointerDown);
        area.removeEventListener("pointermove", onPointerMove);
        area.removeEventListener("pointerup", onPointerUp);
        area.removeEventListener("pointercancel", onPointerUp);
      };
    }, [imgLoaded, offsetY, scale, clampY]);

    /* ── Hide hint after delay ── */

    useEffect(() => {
      if (!showHint) return;
      const t = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(t);
    }, [showHint]);

    /* ── Expose crop data to parent ── */

    useImperativeHandle(
      ref,
      () => ({
        getCrop: () => ({
          offsetY,
          scale,
          naturalW: naturalSize.current.w,
          naturalH: naturalSize.current.h,
        }),
      }),
      [offsetY, scale],
    );

    /* ── Can the user actually pan? ── */

    const canPan =
      imgLoaded &&
      photoAreaRef.current != null &&
      naturalSize.current.h * scale > photoAreaRef.current.clientWidth;

    /* ── Render ── */

    const displayW = imgLoaded ? naturalSize.current.w * scale : 0;
    const displayH = imgLoaded ? naturalSize.current.h * scale : 0;

    return (
      <div className={styles.polaroidFrame}>
        <div
          ref={photoAreaRef}
          className={styles.polaroidPhotoArea}
          style={canPan ? { cursor: "grab" } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt=""
            crossOrigin="anonymous"
            onLoad={handleImgLoad}
            className={styles.polaroidPhotoImg}
            style={
              imgLoaded
                ? {
                    width: displayW,
                    height: displayH,
                    transform: `translate(0px, ${offsetY}px)`,
                  }
                : { opacity: 0 }
            }
          />
          {showHint && imgLoaded && canPan && (
            <span className={styles.polaroidCropHint}>
              Arrastra para encuadrar
            </span>
          )}
        </div>
        <div className={styles.polaroidWhiteArea}>
          <span className={styles.polaroidPlaceholder}>
            Aqui ira tu dedicatoria
          </span>
        </div>
      </div>
    );
  },
);

PolaroidCanvas.displayName = "PolaroidCanvas";
export default PolaroidCanvas;
