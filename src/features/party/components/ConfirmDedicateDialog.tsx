"use client";

import React from "react";
import styles from "@assets/css/party-public.module.css";

type ConfirmDedicateDialogProps = {
  isOpen: boolean;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDedicateDialog = ({
  isOpen,
  isProcessing,
  onCancel,
  onConfirm,
}: ConfirmDedicateDialogProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={styles.confirmDialogBackdrop}
      onClick={onCancel}
      role="presentation"
    >
      <div
        className={styles.confirmDialogCard}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dedicate-title"
        aria-describedby="confirm-dedicate-body"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-dedicate-title" className={styles.confirmDialogTitle}>
          Enviar dedicatoria
        </h3>
        <p id="confirm-dedicate-body" className={styles.confirmDialogBody}>
          Esta dedicatoria sera enviada a los festejados. No podras modificarla
          despues.
        </p>
        <div className={styles.confirmDialogActions}>
          <button
            type="button"
            className={styles.confirmDialogCancel}
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.confirmDialogConfirm}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Enviando..." : "Enviar dedicatoria"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDedicateDialog;
