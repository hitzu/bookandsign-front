import React from "react";
import { EventPhoto } from "../../../interfaces";
import styles from "@assets/css/party-public.module.css";

type PhotoGridProps = {
  id?: string;
  items: EventPhoto[];
  isLoading?: boolean;
  loadingText?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onSelectPhoto: (index: number) => void;
};

const SKELETON_ITEMS = 8;

const PhotoGrid = ({
  id,
  items,
  isLoading = false,
  loadingText = "Cargando ideas para tu próxima foto...",
  emptyTitle = "Estamos preparando ideas para este evento ✨",
  emptyDescription = "Vuelve en unos minutos y descubre nuevas poses + glitter.",
  emptyActionLabel,
  onEmptyAction,
  onSelectPhoto,
}: PhotoGridProps) => {
  if (isLoading) {
    return (
      <section id={id} className={styles.inspirationGridSection}>
        <p className={styles.inspirationLoadingText}>{loadingText}</p>
        <div className={styles.inspirationGrid}>
          {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
            <div key={index} className={styles.inspirationSkeletonCard} />
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section id={id} className={styles.inspirationGridSection}>
        <div className={styles.inspirationEmptyCard}>
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
          {emptyActionLabel && onEmptyAction ? (
            <button type="button" className={styles.primaryBtn} onClick={onEmptyAction}>
              {emptyActionLabel}
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={styles.inspirationGridSection}>
      <div className={styles.inspirationGrid}>
        {items.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className={styles.inspirationGridCard}
            onClick={() => onSelectPhoto(index)}
            aria-label={`Abrir idea ${index + 1}`}
          >
            <img
              src={photo.publicUrl}
              alt={`Idea para foto ${index + 1}`}
              className={styles.inspirationGridImage}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default PhotoGrid;
