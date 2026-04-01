"use client";

import React from "react";
import styles from "@assets/css/party-public.module.css";

const DISCLAIMER =
  "Al descargar, aceptas que tu foto pueda compartirse en redes de Brillipoint.";

type DownloadCTAProps = {
  onDownload: () => void;
  disabled?: boolean;
  label?: string;
};

const DownloadCTA = ({
  onDownload,
  disabled,
  label = "Descargar foto",
}: DownloadCTAProps) => {
  return (
    <div className={styles.downloadCta}>
      <button
        type="button"
        className={styles.downloadCtaBtn}
        onClick={onDownload}
        disabled={disabled}
        aria-label="Descargar foto"
      >
        {label}
      </button>
      <p className={styles.downloadCtaDisclaimer}>{DISCLAIMER}</p>
    </div>
  );
};

export default DownloadCTA;
