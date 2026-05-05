import React from "react";
import styles from "@assets/css/fotobooth.module.css";

type ActionBarProps = {
  onSave: () => void | Promise<void>;
  onShare: () => void | Promise<void>;
};

const ActionBar = ({ onSave, onShare }: ActionBarProps) => (
  <div className={styles.actionRow}>
    <button
      type="button"
      className={styles.btnSave}
      onClick={onSave}
      aria-label="Guardar foto"
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Guardar
    </button>

    <button
      type="button"
      className={styles.btnShare}
      onClick={onShare}
      aria-label="Compartir foto"
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
      Compartir
    </button>

  </div>
);

export default ActionBar;
