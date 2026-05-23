import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import { RewardPromoCopy } from "../rewardPromoCopy";

type RewardPromoBadgeProps = {
  copy: RewardPromoCopy;
  onClick: () => void;
};

const RewardPromoBadge = ({ copy, onClick }: RewardPromoBadgeProps) => (
  <button
    type="button"
    className={styles.rewardPromoBadge}
    onClick={onClick}
    aria-label={copy.triggerAriaLabel}
  >
    <span className={styles.rewardPromoBadgeIcon} aria-hidden="true">
      🎁
    </span>
  </button>
);

export default RewardPromoBadge;
