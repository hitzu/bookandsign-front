import React from "react";
import styles from "@assets/css/party-public.module.css";

type EventEmptyStateProps = {
  onRetry: () => Promise<void> | void;
  isRetrying: boolean;
  onCopyLink?: () => void;
};

const EventEmptyState = ({
  onRetry,
  isRetrying,
  onCopyLink,
}: EventEmptyStateProps) => {
  return (
    <section className={styles.eventEmptyWrap} aria-live="polite">
      <div className={styles.eventEmptyCard}>
        <span className={styles.eventLiveBadge}>En vivo</span>
        <h2 className={styles.eventEmptyTitle}>✨ La experiencia acaba de comenzar</h2>
        <p className={styles.eventEmptySubtitle}>
          En unos minutos verás aquí tus fotos del evento.
        </p>

        <ul className={styles.eventEmptyBullets}>
          <li>Puedes dejar esta página abierta; se actualizará automáticamente.</li>
          <li>Cuando veas tu foto, tócala para abrirla y descargarla.</li>
        </ul>

        <div className={styles.eventEmptyActions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onRetry}
            disabled={isRetrying}
          >
            {isRetrying ? "Reintentando..." : "Reintentar"}
          </button>
          {onCopyLink ? (
            <button
              type="button"
              className={styles.secondaryActionBtn}
              onClick={onCopyLink}
            >
              Copiar enlace
            </button>
          ) : null}
        </div>

        <p className={styles.eventEmptyFootnote}>
          Tip: guarda este enlace para regresar más tarde.
        </p>
      </div>
    </section>
  );
};

export default EventEmptyState;
