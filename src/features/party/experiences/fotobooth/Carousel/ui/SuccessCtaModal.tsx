import styles from "@assets/css/fotobooth.module.css";
import { PostActionConfirmation } from "../../../../components/PostActionConfirmation";
import { CtaSource } from "../types";

type SuccessCtaModalProps = {
  eventName: string;
  isOpen: boolean;
  onClose: () => void;
  source: CtaSource;
};

const SuccessCtaModal = ({
  isOpen,
  onClose,
  source,
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
        <PostActionConfirmation onClose={onClose} source={source} />
      </div>
    </div>
  );
};

export default SuccessCtaModal;
