import React, { useState, useCallback, useEffect, useRef } from "react";
import Lightbox, { type ControllerRef } from "yet-another-react-lightbox";
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
  /** Muestra marca “Beta” en el botón de personalizar (p. ej. hasta estabilizar stickers). */
  personalizeIsBeta?: boolean;
  onDedicate?: (photo: EventPhoto) => void;
  showMediaActions?: boolean;
  showNavigationHints?: boolean;
  showExplicitClose?: boolean;
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
  personalizeIsBeta = false,
  onDedicate,
  showMediaActions = true,
  showNavigationHints = false,
  showExplicitClose = false,
}: PhotoViewerLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex ?? 0);
  const controllerRef = useRef<ControllerRef | null>(null);

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
    activeIndex !== null && activeIndex >= 0
      ? (photos[activeIndex] ?? null)
      : null;
  const canNavigate = photos.length > 1;

  const handleView = useCallback(
    ({ index }: { index: number }) => {
      setCurrentIndex(index);
      onActiveIndexChange(index);
    },
    [onActiveIndexChange],
  );

  const currentPhoto = photos[currentIndex] ?? activePhoto;
  const showNavigationUi = showNavigationHints && canNavigate;
  const showActions = showMediaActions && currentPhoto;
  const showControls = showExplicitClose || showNavigationUi || showActions;

  const handlePrev = useCallback(() => {
    controllerRef.current?.prev();
  }, []);

  const handleNext = useCallback(() => {
    controllerRef.current?.next();
  }, []);

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
      controller={{ closeOnBackdropClick: true, ref: controllerRef }}
      className={styles.yarlDarkOverlay}
      render={{
        buttonClose: showExplicitClose ? () => null : undefined,
        buttonPrev: showNavigationUi ? () => null : undefined,
        buttonNext: showNavigationUi ? () => null : undefined,
        controls: () =>
          showControls ? (
            <>
              {showExplicitClose ? (
                <button
                  type="button"
                  className={styles.viewerClose}
                  onClick={onClose}
                  aria-label="Cerrar visor"
                >
                  ← Cerrar
                </button>
              ) : null}
              {showNavigationUi ? (
                <>
                  <button
                    type="button"
                    className={`${styles.viewerNav} ${styles.viewerNavLeft}`}
                    onClick={handlePrev}
                    aria-label="Foto anterior"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className={`${styles.viewerNav} ${styles.viewerNavRight}`}
                    onClick={handleNext}
                    aria-label="Foto siguiente"
                  >
                    ›
                  </button>
                </>
              ) : null}
              <div className={styles.viewerActionsFixed}>
                {showNavigationUi ? (
                  <div className={styles.viewerNavigationMeta}>
                    <p className={styles.viewerHint}>
                      Desliza o usa las flechas para ver mas fotos
                    </p>
                    <p
                      className={styles.viewerCounter}
                      aria-label="Posicion de la foto actual"
                    >
                      {currentIndex + 1} / {photos.length}
                    </p>
                  </div>
                ) : null}
                {showActions ? (
                  <>
                    <div className={styles.viewerPrimaryActions}>
                      {onPersonalize ? (
                        <div className={styles.viewerPersonalizeBtnWrap}>
                          <button
                            type="button"
                            className={`${styles.viewerPrimaryBtn} ${styles.viewerActionBtn}`}
                            onClick={() => onPersonalize(currentPhoto)}
                            aria-label="Personalizar foto (beta)"
                          >
                            <span className={styles.viewerActionIcon}>✨</span>
                            Personalizar
                          </button>
                          {personalizeIsBeta ? (
                            <span className={styles.viewerBetaBadge} aria-hidden="true">
                              Beta
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                      {onDedicate ? (
                        <button
                          type="button"
                          className={`${styles.viewerPrimaryBtn} ${styles.viewerActionBtn}`}
                          onClick={() => onDedicate(currentPhoto)}
                          aria-label="Dedicar esta foto"
                        >
                          <span className={styles.viewerActionIcon}>💌</span>
                          Dedicar
                        </button>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className={`${styles.viewerSecondaryBtn} ${styles.viewerActionBtn}`}
                      onClick={() => onDownload?.(currentPhoto)}
                      aria-label="Descargar foto"
                    >
                      <span className={styles.viewerActionIcon}>⬇</span>
                      Descargar
                    </button>
                  </>
                ) : null}
              </div>
            </>
          ) : null,
      }}
    />
  );
};

export default PhotoViewerLightbox;
