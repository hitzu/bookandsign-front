import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import SwipeDownloadButton from "./SwipeDownloadButton";

type ActionBarProps = {
  isBusy?: boolean;
  onSave: () => void | Promise<void>;
  onShare: () => void | Promise<void>;
};

const ActionBar = ({ isBusy = false, onSave, onShare }: ActionBarProps) => (
  <div className={styles.actionRow}>
    <SwipeDownloadButton isBusy={isBusy} onComplete={onSave} />

    <button
      type="button"
      className={styles.btnShare}
      onClick={onShare}
      aria-label="Compartir foto"
      disabled={isBusy}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
      {isBusy ? "Procesando..." : "Compartir"}
    </button>

  </div>
);

export default ActionBar;
