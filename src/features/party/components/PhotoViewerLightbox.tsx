import React, { useState, useCallback, useEffect, useRef } from "react";
import Lightbox, { type ControllerRef } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { EventPhoto } from "../../../interfaces";
import styles from "@assets/css/party-public.module.css";
import { sharePhoto } from "../utils/mediaActions";
import { SocialMediaCTA } from "./SocialMediaCTA";

type ModalState = "foto" | "share-confirm" | "post-descarga";

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
  nombreFestejado?: string;
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
  onDedicate,
  nombreFestejado = "",
  showMediaActions = true,
  showNavigationHints = false,
  showExplicitClose = false,
}: PhotoViewerLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex ?? 0);
  const [modalState, setModalState] = useState<ModalState>("foto");
  const controllerRef = useRef<ControllerRef | null>(null);

  useEffect(() => {
    if (isOpen && activeIndex !== null) {
      setCurrentIndex(activeIndex);
    }
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modal: true }, "");

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, onClose]);

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
      setModalState("foto");
      onActiveIndexChange(index);
    },
    [onActiveIndexChange],
  );

  const currentPhoto = photos[currentIndex] ?? activePhoto;
  const showNavigationUi = showNavigationHints && canNavigate;
  const showActions = showMediaActions && currentPhoto;
  const showControls = showExplicitClose || showNavigationUi || showActions;

  const handleClose = useCallback(() => {
    if (window.history.state?.modal) {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);

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
      close={handleClose}
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
                  onClick={handleClose}
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
                    {modalState === "foto" && (
                      <>
                        {/* Fila 1 — experiencia, peso visual dominante */}
                        <div className={styles.viewerPrimaryActions}>
                          {onPersonalize ? (
                            <button
                              type="button"
                              className={`${styles.btnExperience} ${styles.btnPersonalizar}`}
                              onClick={() => onPersonalize(currentPhoto)}
                              aria-label="Personalizar foto"
                            >
                              <span className={styles.viewerActionIcon}>
                                ✨
                              </span>
                              Personalizar
                            </button>
                          ) : null}
                          {onDedicate ? (
                            <div className={styles.viewerDedicarBtnWrap}>
                              <button
                                type="button"
                                className={`${styles.btnExperience} ${styles.btnDedicar}`}
                                onClick={() => onDedicate(currentPhoto)}
                                aria-label="Dedicar esta foto"
                              >
                                <span className={styles.viewerActionIcon}>
                                  ❤️
                                </span>
                                Dedicar
                              </button>
                              <span
                                className={styles.viewerNewBadge}
                                aria-hidden="true"
                              >
                                Nuevo
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {/* Fila 2 — utilitarios, íconos sin texto */}
                        <div className={styles.viewerSecondaryActions}>
                          <button
                            type="button"
                            className={styles.btnIcon}
                            aria-label="Descargar foto"
                            onClick={async () => {
                              await onDownload?.(currentPhoto);
                              setModalState("post-descarga");
                            }}
                          >
                            ⬇
                          </button>
                          {onShare ? (
                            <button
                              type="button"
                              className={styles.btnIcon}
                              aria-label="Compartir foto"
                              onClick={() => setModalState("share-confirm")}
                            >
                              ↗
                            </button>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          className={styles.btnTextEscape}
                          onClick={handleClose}
                        >
                          Ver galería
                        </button>
                      </>
                    )}

                    {modalState === "post-descarga" && (
                      <div className={styles.modalEndState}>
                        <button
                          type="button"
                          className={styles.postDescargaClose}
                          onClick={() => setModalState("foto")}
                          aria-label="Cerrar"
                        >
                          ✕
                        </button>
                        <div className={styles.postDescargaCard}>
                          <div className={styles.postDescargaGlow} />
                          <p className={styles.postDescargaScript}>
                            Increíble ✨
                          </p>
                          <p className={styles.postDescargaTitulo}>
                            Imagina esto en tu evento
                          </p>
                          <p className={styles.postDescargaSubtitulo}>
                            Te cotizamos en minutos. Sin compromiso.
                          </p>
                          <SocialMediaCTA
                            variant="modal-end-state"
                            nombreFestejado={nombreFestejado}
                          />
                        </div>
                      </div>
                    )}

                    {modalState === "share-confirm" && (
                      <div className={styles.modalEndState}>
                        <div className={styles.shareConfirmCard}>
                          <p className={styles.shareConfirmKicker}>
                            Comparte tu foto
                          </p>
                          <p className={styles.endStateTitulo}>
                            Etiquétanos como{" "}
                            <span className={styles.shareHighlight}>
                              @brillipoint
                            </span>{" "}
                            y obtén un descuento en tu próximo servicio
                          </p>
                          <p className={styles.endStateSubtitulo}>
                            Se abrirá el selector de tu dispositivo para elegir
                            dónde compartir
                          </p>
                          <button
                            type="button"
                            className={styles.shareConfirmBtn}
                            onClick={() => {
                              sharePhoto(
                                currentPhoto.publicUrl,
                                `Brillipoint - ${eventTitle}`,
                              );
                              setModalState("foto");
                            }}
                          >
                            <span className={styles.shareConfirmBtnIcon}>
                              ↗
                            </span>
                            Compartir foto
                          </button>
                        </div>
                        <button
                          type="button"
                          className={styles.btnTextEscape}
                          onClick={() => setModalState("foto")}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
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
