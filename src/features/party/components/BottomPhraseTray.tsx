"use client";

import React, { useEffect } from "react";
import PhraseGrid from "./PhraseGrid";
import type { DedicationEventType, DedicationPhrase } from "../utils/dedicationPhrases";
import styles from "@assets/css/party-public.module.css";

type BottomPhraseTrayProps = {
  isOpen: boolean;
  eventType: DedicationEventType;
  onClose: () => void;
  onSelectPhrase: (phrase: DedicationPhrase) => void;
};

const BottomPhraseTray = ({
  isOpen,
  eventType,
  onClose,
  onSelectPhrase,
}: BottomPhraseTrayProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (phrase: DedicationPhrase) => {
    onSelectPhrase(phrase);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={styles.stickerTrayBackdrop}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      <div className={styles.stickerTraySheet}>
        <div className={styles.stickerTrayHandle} />
        <div className={styles.stickerTrayContent}>
          <PhraseGrid eventType={eventType} onSelectPhrase={handleSelect} />
        </div>
      </div>
    </>
  );
};

export default BottomPhraseTray;
