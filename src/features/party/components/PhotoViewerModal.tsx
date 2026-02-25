import React, { useEffect } from "react";
import { EventPhoto } from "../../../interfaces";
import styles from "@assets/css/party-public.module.css";

type PhotoViewerModalProps = {
  isOpen: boolean;
  photo: EventPhoto | null;
  eventTitle: string;
  onClose: () => void;
  onDownload: (photo: EventPhoto) => Promise<void>;
  onShare: (photo: EventPhoto) => Promise<void>;
};

const PhotoViewerModal = ({
  isOpen,
  photo,
  eventTitle,
  onClose,
  onDownload,
  onShare,
}: PhotoViewerModalProps) => {
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
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !photo) return null;

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
        <img
          src={photo.publicUrl}
          alt={eventTitle}
          className={styles.viewerImage}
        />
      </div>
      <div className={styles.viewerActions}>
        <button
          type="button"
          className={`${styles.primaryBtn} ${styles.viewerActionBtn}`}
          onClick={() => onDownload(photo)}
          aria-label="Descargar foto"
        >
          Descargar
        </button>
        <button
          type="button"
          className={`${styles.secondaryActionBtn} ${styles.viewerActionBtn}`}
          onClick={() => onShare(photo)}
          aria-label="Compartir foto"
        >
          Compartir
        </button>
      </div>
    </div>
  );
};

export default PhotoViewerModal;
