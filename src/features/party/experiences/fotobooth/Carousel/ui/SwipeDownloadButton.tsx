import React, { KeyboardEvent, PointerEvent, useEffect, useRef, useState } from "react";
import styles from "@assets/css/fotobooth.module.css";

type SwipeDownloadButtonProps = {
  isBusy?: boolean;
  onComplete: () => void | Promise<void>;
};

const THUMB_SIZE_PX = 44;
const TRACK_PADDING_PX = 4;
const TRIGGER_RATIO = 0.72;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const SwipeDownloadButton = ({
  isBusy = false,
  onComplete,
}: SwipeDownloadButtonProps) => {
  const trackRef = useRef<HTMLButtonElement | null>(null);
  const dragStartXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const wasBusyRef = useRef(isBusy);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const setOffset = (nextOffset: number) => {
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };

  const getMaxOffset = () => {
    const trackWidth = trackRef.current?.clientWidth ?? 0;
    return Math.max(trackWidth - THUMB_SIZE_PX - TRACK_PADDING_PX * 2, 0);
  };

  const resetSwipe = () => {
    setIsDragging(false);
    setOffset(0);
  };

  useEffect(() => {
    if (isBusy) {
      setOffset(getMaxOffset());
    } else if (wasBusyRef.current) {
      resetSwipe();
    }

    wasBusyRef.current = isBusy;
  }, [isBusy]);

  const triggerAction = () => {
    if (isBusy) return;

    setOffset(getMaxOffset());
    void onComplete();
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (isBusy) return;

    dragStartXRef.current = event.clientX - dragOffsetRef.current;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || isBusy) return;

    const maxOffset = getMaxOffset();
    const nextOffset = clamp(
      event.clientX - dragStartXRef.current,
      0,
      maxOffset,
    );
    setOffset(nextOffset);
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const maxOffset = getMaxOffset();
    if (maxOffset > 0 && dragOffsetRef.current >= maxOffset * TRIGGER_RATIO) {
      triggerAction();
      return;
    }

    resetSwipe();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isBusy) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      triggerAction();
    }
  };

  const dragProgress = getMaxOffset() > 0 ? dragOffset / getMaxOffset() : 0;
  const progressWidth = dragOffset + THUMB_SIZE_PX;

  return (
    <button
      ref={trackRef}
      type="button"
      className={styles.swipeDownload}
      aria-label="Desliza para guardar foto"
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      disabled={isBusy}
    >
      <span
        className={styles.swipeDownloadProgress}
        style={{ width: `${progressWidth}px` }}
      />
      <span className={styles.swipeDownloadText}>
        {isBusy ? "Guardando foto..." : "Desliza para guardar"}
      </span>
      {!isBusy && (
        <span
          className={styles.swipeDownloadHint}
          aria-hidden="true"
          style={{ opacity: 1 - Math.min(dragProgress * 1.5, 1) }}
        >
          Desliza
        </span>
      )}
      <span
        className={styles.swipeDownloadThumb}
        aria-hidden="true"
        style={{ transform: `translateX(${dragOffset}px)` }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
};

export default SwipeDownloadButton;
