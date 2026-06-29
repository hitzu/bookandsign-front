import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "@assets/css/fotobooth.module.css";
import { EventPageTheme } from "../../../../types/eventPageTheme";
import { buildThemeVars } from "../../../../utils/themeVars";

export interface GiftModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  handle?: string;
  disclaimer?: string;
  theme?: EventPageTheme;
}

const DEFAULT_HANDLE = "@brillipoint";
const DEFAULT_DISCLAIMER =
  "Válido para tu próxima reservación con Brillipoint";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const GiftModal = ({
  visible,
  onClose,
  onShare,
  handle = DEFAULT_HANDLE,
  disclaimer = DEFAULT_DISCLAIMER,
  theme,
}: GiftModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const previousActiveElement =
      typeof document !== "undefined"
        ? (document.activeElement as HTMLElement | null)
        : null;

    closeButtonRef.current?.focus();
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === firstElement || activeElement === modalRef.current) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previousActiveElement?.focus();
    };
  }, [visible, onClose]);

  if (!visible || !portalTarget) return null;

  return createPortal(
    <div
      className={styles.giftModalOverlay}
      style={theme ? buildThemeVars(theme) : undefined}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={styles.giftModalCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.giftModalCloseBtn}
          onClick={onClose}
          aria-label="Cerrar beneficio"
        >
          <i className="ti ti-x" aria-hidden="true" />
        </button>

        <div className={styles.giftModalHero} aria-hidden="true">
          <span className={styles.giftModalHeroEmoji}>🎁</span>
        </div>

        <span className={styles.giftModalBadge}>BENEFICIO EXCLUSIVO</span>

        <h3 id={titleId} className={styles.giftModalTitle}>
          ¡Comparte y recibe un regalo!
        </h3>

        <div id={descriptionId} className={styles.giftModalSteps}>
          <div className={styles.giftModalStep}>
            <span className={styles.giftModalStepNumber}>1</span>
            <p className={styles.giftModalStepText}>
              Publica tu foto usando el botón{" "}
              <strong className={styles.giftModalStepStrong}>Compartir</strong>
            </p>
          </div>

          <div className={styles.giftModalStep}>
            <span className={styles.giftModalStepNumber}>2</span>
            <p className={styles.giftModalStepText}>
              Etiqueta a{" "}
              <strong className={styles.giftModalStepHandle}>{handle}</strong>{" "}
              en tu publicación
            </p>
          </div>

          <div className={styles.giftModalStep}>
            <span className={styles.giftModalStepNumber}>3</span>
            <p className={styles.giftModalStepText}>
              Recibe tu sorpresa en tu próximo servicio
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.giftModalShareBtn}
          onClick={onShare}
        >
          Compartir ahora
        </button>

        <p className={styles.giftModalDisclaimer}>{disclaimer}</p>
      </div>
    </div>,
    portalTarget,
  );
};

export default GiftModal;
