"use client";

import React from "react";
import {
  getDedicationPhrases,
  type DedicationEventType,
  type DedicationPhrase,
} from "../utils/dedicationPhrases";
import styles from "@assets/css/party-public.module.css";

type PhraseGridProps = {
  eventType: DedicationEventType;
  onSelectPhrase: (phrase: DedicationPhrase) => void;
};

const PhraseGrid = ({ eventType, onSelectPhrase }: PhraseGridProps) => {
  const phrases = getDedicationPhrases(eventType);

  return (
    <div className={styles.phraseGrid}>
      {phrases.map((phrase) => (
        <button
          key={phrase.id}
          type="button"
          className={styles.phraseGridItem}
          onClick={() => onSelectPhrase(phrase)}
        >
          {phrase.text}
        </button>
      ))}
    </div>
  );
};

export default PhraseGrid;
