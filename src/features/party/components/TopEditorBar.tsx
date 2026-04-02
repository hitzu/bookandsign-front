"use client";

import React from "react";
import styles from "@assets/css/party-public.module.css";

type TopEditorBarProps = {
  onBack: () => void;
  onStickers: () => void;
  backLabel?: string;
  actionLabel?: string;
  actionEmoji?: string;
};

const TopEditorBar = ({
  onBack,
  onStickers,
  backLabel = "Cerrar",
  actionLabel = "Stickers",
  actionEmoji = "😊",
}: TopEditorBarProps) => {
  return (
    <header className={styles.topEditorBar}>
      <button
        type="button"
        className={styles.topEditorBackBtn}
        onClick={onBack}
        aria-label={backLabel}
      >
        ← {backLabel}
      </button>
      <button
        type="button"
        className={styles.topEditorStickerBtn}
        onClick={onStickers}
        aria-label={actionLabel}
      >
        {actionLabel} <span>{actionEmoji}</span>
      </button>
    </header>
  );
};

export default TopEditorBar;
