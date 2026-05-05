import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import { SocialMediaCTA } from "../../../../components/SocialMediaCTA";

type SuccessCtaModalProps = {
  eventName: string;
  isOpen: boolean;
  onClose: () => void;
};

const SuccessCtaModal = ({
  eventName,
  isOpen,
  onClose,
}: SuccessCtaModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={styles.successCtaOverlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.successCtaModal}>
        <SocialMediaCTA
          context="download"
          variant="sheet"
          nombreFestejado={eventName}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default SuccessCtaModal;
