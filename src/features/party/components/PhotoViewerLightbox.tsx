import React, { useState, useCallback, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { EventPhoto } from "../../../interfaces";
import styles from "@assets/css/party-public.module.css";

type PhotoViewerLightboxProps = {
  isOpen: boolean;
  photos: EventPhoto[];
  activeIndex: number | null;
  eventTitle: string;
  onClose: () => void;
  onActiveIndexChange: (nextIndex: number) => void;
  onDownload?: (photo: EventPhoto) => Promise<void>;
  onShare?: (photo: EventPhoto) => Promise<void>;
  onPersonalize?: (photo: EventPhoto) => void;
  onDedicate?: (photo: EventPhoto) => void;
  showMediaActions?: boolean;
};

const PhotoViewerLightbox = ({
  isOpen,
  photos,
  activeIndex,
  eventTitle,
  onClose,
  onActiveIndexChange,
  onDownload,
  onShare,
  onPersonalize,
  onDedicate,
  showMediaActions = true,
}: PhotoViewerLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex ?? 0);

  useEffect(() => {
    if (isOpen && activeIndex !== null) {
      setCurrentIndex(activeIndex);
    }
  }, [isOpen, activeIndex]);

  const slides = photos.map((p) => ({
    src: p.publicUrl,
    alt: eventTitle,
  }));

  const activePhoto =
    activeIndex !== null && activeIndex >= 0 ? photos[activeIndex] ?? null : null;
  const canNavigate = photos.length > 1;

  const handleView = useCallback(
    ({ index }: { index: number }) => {
      setCurrentIndex(index);
      onActiveIndexChange(index);
    },
    [onActiveIndexChange],
  );

  const currentPhoto = photos[currentIndex] ?? activePhoto;

  if (!isOpen || photos.length === 0) return null;

  return (
    <Lightbox
      open={isOpen}
      index={activeIndex ?? 0}
      close={onClose}
      slides={slides}
      on={{ view: handleView }}
      carousel={{
        finite: !canNavigate,
        preload: 2,
      }}
      controller={{ closeOnBackdropClick: true }}
      className={styles.yarlDarkOverlay}
      render={{
        controls: () =>
          showMediaActions && currentPhoto ? (
            <div className={styles.viewerActionsFixed}>
              <button
                type="button"
                className={`${styles.viewerPrimaryBtn} ${styles.viewerActionBtn}`}
                onClick={() => onDownload?.(currentPhoto)}
                aria-label="Descargar foto"
              >
                <span className={styles.viewerActionIcon}>⬇</span>
                Descargar
              </button>
              <button
                type="button"
                className={`${styles.viewerSecondaryBtn} ${styles.viewerActionBtn}`}
                onClick={() => onShare?.(currentPhoto)}
                aria-label="Compartir foto"
              >
                <span className={styles.viewerActionIcon}>↗</span>
                Compartir
              </button>
              {onPersonalize ? (
                <button
                  type="button"
                  className={`${styles.viewerSecondaryBtn} ${styles.viewerActionBtn}`}
                  onClick={() => onPersonalize(currentPhoto)}
                  aria-label="Personalizar foto"
                >
                  <span className={styles.viewerActionIcon}>✨</span>
                  Personalizar
                </button>
              ) : null}
              {onDedicate ? (
                <button
                  type="button"
                  className={`${styles.viewerSecondaryBtn} ${styles.viewerActionBtn}`}
                  onClick={() => onDedicate(currentPhoto)}
                  aria-label="Dedicar esta foto"
                >
                  <span className={styles.viewerActionIcon}>💌</span>
                  Dedicar
                </button>
              ) : null}
            </div>
          ) : null,
      }}
    />
  );
};

export default PhotoViewerLightbox;
