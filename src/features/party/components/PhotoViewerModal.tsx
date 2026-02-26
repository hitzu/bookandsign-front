import React, { useEffect } from "react";
import { EventPhoto } from "../../../interfaces";
import styles from "@assets/css/party-public.module.css";

type PhotoViewerModalProps = {
  isOpen: boolean;
  photos: EventPhoto[];
  activeIndex: number | null;
  eventTitle: string;
  onClose: () => void;
  onActiveIndexChange: (nextIndex: number) => void;
  onDownload?: (photo: EventPhoto) => Promise<void>;
  onShare?: (photo: EventPhoto) => Promise<void>;
  showMediaActions?: boolean;
};

const PhotoViewerModal = ({
  isOpen,
  photos,
  activeIndex,
  eventTitle,
  onClose,
  onActiveIndexChange,
  onDownload,
  onShare,
  showMediaActions = true,
}: PhotoViewerModalProps) => {
  const activePhoto =
    activeIndex !== null && activeIndex >= 0 ? photos[activeIndex] || null : null;
  const canNavigate = photos.length > 1;

  const goToPrevious = () => {
    if (!canNavigate || activeIndex === null) return;
    const previousIndex = activeIndex - 1 < 0 ? photos.length - 1 : activeIndex - 1;
    onActiveIndexChange(previousIndex);
  };

  const goToNext = () => {
    if (!canNavigate || activeIndex === null) return;
    const nextIndex = activeIndex + 1 >= photos.length ? 0 : activeIndex + 1;
    onActiveIndexChange(nextIndex);
  };

  useEffect(() => {
    if (!isOpen) return;

    const { overflow, touchAction } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.touchAction = touchAction;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToNext, goToPrevious, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !activePhoto || !canNavigate || activeIndex === null) return;

    const nextPhoto = photos[activeIndex + 1] || photos[0];
    const previousPhoto = photos[activeIndex - 1] || photos[photos.length - 1];

    [nextPhoto, previousPhoto].forEach((photo) => {
      const image = new Image();
      image.src = photo.publicUrl;
    });
  }, [activeIndex, activePhoto, canNavigate, isOpen, photos]);

  if (!isOpen || !activePhoto) return null;

  return (
    <div
      className={styles.viewerOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de foto"
    >
      <button
        type="button"
        className={styles.viewerClose}
        onClick={onClose}
        aria-label="Cerrar visor"
      >
        ×
      </button>
      <div className={styles.viewerBody}>
        {canNavigate ? (
          <button
            type="button"
            className={`${styles.viewerNav} ${styles.viewerNavLeft}`}
            onClick={goToPrevious}
            aria-label="Ver foto anterior"
          >
            ‹
          </button>
        ) : null}
        <img
          src={activePhoto.publicUrl}
          alt={eventTitle}
          className={styles.viewerImage}
          onTouchStart={(event) => {
            const start = event.changedTouches[0]?.clientX || 0;
            event.currentTarget.dataset.touchStartX = String(start);
          }}
          onTouchEnd={(event) => {
            const start = Number(event.currentTarget.dataset.touchStartX || 0);
            const end = event.changedTouches[0]?.clientX || 0;
            const delta = end - start;
            if (Math.abs(delta) < 44) return;
            if (delta > 0) {
              goToPrevious();
              return;
            }
            goToNext();
          }}
        />
        {canNavigate ? (
          <button
            type="button"
            className={`${styles.viewerNav} ${styles.viewerNavRight}`}
            onClick={goToNext}
            aria-label="Ver foto siguiente"
          >
            ›
          </button>
        ) : null}
      </div>
      {showMediaActions ? (
        <div className={styles.viewerActions}>
          {canNavigate ? <p className={styles.viewerHint}>Desliza para ver más</p> : null}
          <button
            type="button"
            className={`${styles.primaryBtn} ${styles.viewerActionBtn}`}
            onClick={() => onDownload?.(activePhoto)}
            aria-label="Descargar foto"
          >
            Descargar
          </button>
          <button
            type="button"
            className={`${styles.secondaryActionBtn} ${styles.viewerActionBtn}`}
            onClick={() => onShare?.(activePhoto)}
            aria-label="Compartir foto"
          >
            Compartir
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default PhotoViewerModal;
