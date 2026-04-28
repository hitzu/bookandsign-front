import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import logoExperience from "@assets/images/logo-experience-white.png";
import styles from "@assets/css/fotobooth.module.css";
import { SplashProps } from "../types";

const CONFETTI_COLORS = [
  "#ec4899",
  "#f9a8d4",
  "#a855f7",
  "#c084fc",
  "#fb7185",
  "#818cf8",
  "#f0abfc",
];

const FotoBoothSplash = ({
  honoreesNames,
  date,
  isReady = false,
  stepLabel = "Preparando la experiencia",
  onComplete,
  duration = 3200,
}: SplashProps) => {
  useEffect(() => {
    const t = setTimeout(onComplete, duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const size = 4 + Math.random() * 6;
        return (
          <div
            key={i}
            className={styles.confettiPiece}
            style={{
              left: `${Math.random() * 100}%`,
              top: "-10px",
              width: `${size}px`,
              height: `${size}px`,
              background:
                CONFETTI_COLORS[
                  Math.floor(Math.random() * CONFETTI_COLORS.length)
                ],
              borderRadius: Math.random() > 0.5 ? "50%" : "1px",
              animationDuration: `${3 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        );
      }),
    [],
  );

  return (
    <div className={styles.screen}>
      <div className={styles.splashBg} />
      <div className={styles.splashBlob1} />
      <div className={styles.splashBlob2} />
      <div className={styles.confettiContainer}>{confetti}</div>

      <div className={styles.splashContent}>
        <div className={styles.splashLogoRing}>
          <Image
            src={logoExperience}
            alt="Brillipoint"
            width={64}
            height={64}
            priority
          />
        </div>

        <div className={styles.splashDivider} />

        {isReady ? (
          <>
            {honoreesNames && (
              <div className={styles.splashName}>{honoreesNames}</div>
            )}

            {date && <div className={styles.splashDate}>{date}</div>}
          </>
        ) : (
          <div className={styles.splashStep}>{stepLabel}</div>
        )}

        <div className={styles.splashSparkles}>
          <span className={styles.splashSpark}>✦</span>
          <span className={styles.splashSpark}>✦</span>
          <span className={styles.splashSpark}>✦</span>
        </div>
      </div>
    </div>
  );
};

export default FotoBoothSplash;
