import React from "react";
import styles from "@assets/css/fotobooth.module.css";

type CarouselHeaderProps = {
  canOpenGallery: boolean;
  currentIndex: number;
  onOpenGallery: () => void;
  totalItems: number;
};

const CarouselHeader = ({
  canOpenGallery,
  currentIndex,
  onOpenGallery,
  totalItems,
}: CarouselHeaderProps) => (
  <div className={styles.carouselHeader}>
    <button
      type="button"
      className={styles.carouselBackLink}
      onClick={onOpenGallery}
      disabled={!canOpenGallery}
      aria-label="Ver galería"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Ver galería
    </button>
    <div className={styles.carouselCount}>
      {currentIndex + 1} / {totalItems}
    </div>
  </div>
);

export default CarouselHeader;
