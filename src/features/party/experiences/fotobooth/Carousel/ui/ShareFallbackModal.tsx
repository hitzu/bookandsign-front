import React, { useState } from "react";
import styles from "@assets/css/fotobooth.module.css";

type ShareFallbackModalProps = {
  onClose: () => void;
  onCopyLink: () => Promise<boolean>;
  onDownload: () => void;
  previewUrl: string;
};

const ShareFallbackModal = ({
  onClose,
  onCopyLink,
  onDownload,
  previewUrl,
}: ShareFallbackModalProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className={styles.shareFallbackOverlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.shareFallbackModal}>
        <button
          type="button"
          className={styles.shareFallbackClose}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <p className={styles.shareFallbackEyebrow}>Compartir manualmente</p>
        <h3 className={styles.shareFallbackTitle}>
          Tu navegador no soporta compartir archivos
        </h3>
        <p className={styles.shareFallbackText}>
          Puedes descargar la imagen o copiar el link de la sesión.
        </p>

        <div className={styles.shareFallbackPreviewCard}>
          <img
            src={previewUrl}
            alt="Vista previa del archivo generado"
            className={styles.shareFallbackPreviewImage}
          />
        </div>

        <div className={styles.shareFallbackActions}>
          <button
            type="button"
            className={styles.shareFallbackPrimary}
            onClick={onDownload}
          >
            Descargar
          </button>
          <button
            type="button"
            className={styles.shareFallbackSecondary}
            onClick={async () => {
              const success = await onCopyLink();
              setCopied(success);
            }}
          >
            {copied ? "Link copiado" : "Copiar link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareFallbackModal;
