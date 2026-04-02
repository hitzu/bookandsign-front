"use client";

import React from "react";
import styles from "@assets/css/party-public.module.css";

type BackStepAlertProps = {
  isOpen: boolean;
  message: string;
  onStay: () => void;
  onGoBack: () => void;
};

const BackStepAlert = ({
  isOpen,
  message,
  onStay,
  onGoBack,
}: BackStepAlertProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={styles.confirmDialogBackdrop}
      onClick={onStay}
      role="presentation"
    >
      <div
        className={styles.backStepAlertCard}
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.backStepAlertBody}>{message}</p>
        <div className={styles.confirmDialogActions}>
          <button
            type="button"
            className={styles.confirmDialogCancel}
            onClick={onStay}
          >
            Quedarme
          </button>
          <button
            type="button"
            className={styles.backStepAlertConfirm}
            onClick={onGoBack}
          >
            Si, regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackStepAlert;
