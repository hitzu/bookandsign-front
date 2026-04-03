"use client";

import React, { useEffect, useState } from "react";
import { getEventPhrases } from "../../../api/services/partyPublicService";
import type { DedicationPhrase } from "../utils/dedicationPhrases";
import styles from "@assets/css/party-public.module.css";

type PhraseGridProps = {
  eventToken: string;
  onSelectPhrase: (phrase: DedicationPhrase) => void;
};

const PhraseGrid = ({ eventToken, onSelectPhrase }: PhraseGridProps) => {
  const [phrases, setPhrases] = useState<DedicationPhrase[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getEventPhrases(eventToken, controller.signal)
      .then((data) =>
        setPhrases(data.map((p) => ({ id: String(p.id), text: p.content }))),
      )
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error("Error fetching phrases:", err);
        }
      });
    return () => controller.abort();
  }, [eventToken]);

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
