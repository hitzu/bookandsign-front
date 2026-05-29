import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import { RewardPromoCopy } from "../rewardPromoCopy";

type RewardPromoBadgeProps = {
  className?: string;
  copy: RewardPromoCopy;
  onClick: () => void;
};

const RewardPromoBadge = ({
  className = "",
  copy,
  onClick,
}: RewardPromoBadgeProps) => (
  <button
    type="button"
    className={`${styles.rewardPromoBadge} ${className}`.trim()}
    onClick={onClick}
    aria-label={copy.triggerAriaLabel}
  >
    <span className={styles.rewardPromoBadgeIcon} aria-hidden="true">
      🎁
    </span>
  </button>
);

export default RewardPromoBadge;
