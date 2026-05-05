import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import { EffectName } from "../../../../types/session";

type EffectOverlayProps = {
  effect: EffectName;
};

const EffectOverlay = ({ effect }: EffectOverlayProps) => {
  if (effect === "confetti") {
    return (
      <div className={styles.viewerEffectOverlay} aria-hidden="true">
        {Array.from({ length: 14 }, (_, pieceIndex) => (
          <span
            key={`confetti-${pieceIndex}`}
            className={`${styles.effectParticle} ${styles.effectConfetti}`}
            style={{
              left: `${6 + pieceIndex * 6.5}%`,
              animationDelay: `${(pieceIndex % 5) * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (effect === "hearts") {
    return (
      <div className={styles.viewerEffectOverlay} aria-hidden="true">
        {Array.from({ length: 8 }, (_, pieceIndex) => (
          <span
            key={`heart-${pieceIndex}`}
            className={`${styles.effectParticle} ${styles.effectHeart}`}
            style={{
              left: `${10 + pieceIndex * 10}%`,
              animationDelay: `${(pieceIndex % 4) * 0.35}s`,
            }}
          >
            ❤
          </span>
        ))}
      </div>
    );
  }

  return null;
};

export default EffectOverlay;
