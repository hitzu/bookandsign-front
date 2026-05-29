import React from "react";
import styles from "@assets/css/fotobooth.module.css";

export interface BenefitBannerProps {
  titulo: string;
  subtitulo: string;
  onPress: () => void;
}

const BenefitBanner = ({
  titulo,
  subtitulo,
  onPress,
}: BenefitBannerProps) => (
  <button
    type="button"
    className={styles.benefitBanner}
    onClick={onPress}
    aria-label={`${titulo}. ${subtitulo}`}
  >
    <span className={styles.benefitBannerIcon} aria-hidden="true">
      🎁
    </span>

    <span className={styles.benefitBannerCopy}>
      <span className={styles.benefitBannerTitle}>{titulo}</span>
      <span className={styles.benefitBannerSubtitle}>{subtitulo}</span>
    </span>

    <i
      className={`ti ti-chevron-right ${styles.benefitBannerChevron}`}
      aria-hidden="true"
    />
  </button>
);

export default BenefitBanner;
