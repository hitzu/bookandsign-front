"use client";

import React from "react";
import styles from "@assets/css/party-public.module.css";

type TopEditorBarProps = {
  onBack: () => void;
  onStickers: () => void;
};

const TopEditorBar = ({ onBack, onStickers }: TopEditorBarProps) => {
  return (
    <header className={styles.topEditorBar}>
      <button
        type="button"
        className={styles.topEditorBackBtn}
        onClick={onBack}
        aria-label="Cerrar editor"
      >
        ← Cerrar
      </button>
      <button
        type="button"
        className={styles.topEditorStickerBtn}
        onClick={onStickers}
        aria-label="Añadir stickers"
      >
        Stickers <span>😊</span>
      </button>
    </header>
  );
};

export default TopEditorBar;
