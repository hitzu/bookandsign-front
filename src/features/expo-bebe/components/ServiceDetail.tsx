import { useEffect, useRef, useState } from "react";
import styles from "@assets/css/expo-bebe.module.css";
import type { ServiceItem } from "../types";
import { IconChevronLeft, IconChevronRight, IconX } from "./Icons";

export function ServiceDetail({
  isOpen,
  items,
  currentIndex,
  modeLabel,
  onClose,
  onSelectIndex,
  onPrevious,
  onNext,
}: {
  isOpen: boolean;
  items: ServiceItem[];
  currentIndex: number;
  modeLabel: string;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const lastTap = useRef<{ x: number; y: number; time: number } | null>(null);
  const service = items[currentIndex] ?? null;

  useEffect(() => {
    if (isOpen) setControlsVisible(true);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onNext, onPrevious]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;

    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;
    const dx = x - touchStart.current.x;
    const dy = y - touchStart.current.y;
    const now = Date.now();

    if (Math.abs(dx) > 40) {
      if (dx < 0) onNext();
      else onPrevious();
      touchStart.current = null;
      lastTap.current = null;
      return;
    }

    if (Math.abs(dx) < 16 && Math.abs(dy) < 16) {
      const previousTap = lastTap.current;
      const isDoubleTap =
        previousTap &&
        now - previousTap.time < 320 &&
        Math.abs(x - previousTap.x) < 28 &&
        Math.abs(y - previousTap.y) < 28;

      if (isDoubleTap) {
        setControlsVisible((visible) => !visible);
        lastTap.current = null;
      } else {
        lastTap.current = { x, y, time: now };
      }
    }

    touchStart.current = null;
  };

  const toggleControls = () => {
    setControlsVisible((visible) => !visible);
  };

  return (
    <div
      className={`${styles.detailOverlay} ${isOpen ? styles.detailOverlayOpen : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${modeLabel} Expo Bebé`}
    >
      {service && (
        <>
          <div
            className={styles.detailPhotoArea}
            style={{ background: service.bg }}
            onDoubleClick={toggleControls}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className={styles.detailPhotoStripeOverlay} />
            <div className={styles.detailPhotoLabelOverlay}>
              {service.label}
            </div>
          </div>

          <button
            className={`${styles.detailClose} ${
              !controlsVisible ? styles.detailControlHidden : ""
            }`}
            onClick={onClose}
            aria-label="Cerrar"
            type="button"
          >
            <IconX />
          </button>

          {items.length > 1 && (
            <>
              <button
                className={`${styles.detailArrow} ${styles.detailArrowPrev} ${
                  !controlsVisible ? styles.detailControlHidden : ""
                }`}
                onClick={onPrevious}
                aria-label="Anterior"
                type="button"
              >
                <IconChevronLeft />
              </button>
              <button
                className={`${styles.detailArrow} ${styles.detailArrowNext} ${
                  !controlsVisible ? styles.detailControlHidden : ""
                }`}
                onClick={onNext}
                aria-label="Siguiente"
                type="button"
              >
                <IconChevronRight />
              </button>
            </>
          )}

          <div
            className={`${styles.detailThumbRail} ${
              !controlsVisible ? styles.detailControlHidden : ""
            }`}
          >
            <div className={styles.detailThumbHeader}>
              <span>{modeLabel}</span>
              <span>
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(items.length).padStart(2, "0")}
              </span>
            </div>

            <div className={styles.detailThumbScroller}>
              {items.map((item, index) => (
                <button
                  key={`${modeLabel}-${index}`}
                  className={`${styles.detailThumb} ${
                    index === currentIndex ? styles.detailThumbActive : ""
                  }`}
                  onClick={() => onSelectIndex(index)}
                  aria-label={`Ver ${item.title.join(" ")}`}
                  aria-current={index === currentIndex}
                  type="button"
                >
                  <span
                    className={styles.detailThumbImage}
                    style={{ background: item.bg }}
                  >
                    <span className={styles.detailThumbStripe} />
                  </span>
                  <span className={styles.detailThumbText}>
                    {item.title.join(" ")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
