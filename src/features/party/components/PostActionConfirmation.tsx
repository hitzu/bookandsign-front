import { useEffect } from "react";
import styles from "./PostActionConfirmation.module.css";
import { CtaSource } from "../experiences/fotobooth/Carousel/types";

interface PostActionConfirmationProps {
  onClose: () => void;
  source?: CtaSource;
}

const AUTO_CLOSE_MS = 2500;

export function PostActionConfirmation({
  onClose,
  source = "download",
}: PostActionConfirmationProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, AUTO_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  const title = source === "share" ? "¡Foto compartida!" : "¡Foto guardada!";
  const subtitle =
    source === "share"
      ? "Gracias por compartir tu momento"
      : "Gracias por vivir tu momento";

  return (
    <div className={styles.card}>
      <p className={styles.check}>✓</p>
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>
        {subtitle}
        <br />
        <span className={styles.brand}>Brillipoint Experience ✨</span>
      </p>
      <button type="button" className={styles.continueBtn} onClick={onClose}>
        Continuar
      </button>
    </div>
  );
}
