import React from "react";
import Image from "next/image";
import logoWhite from "@assets/images/logo-white.png";
import styles from "@assets/css/party-public.module.css";

type EmptyStateNoPhotosProps = {
  onRetry: () => void;
};

const EmptyStateNoPhotos = ({ onRetry }: EmptyStateNoPhotosProps) => {
  return (
    <section className={styles.emptyNoPhotos}>
      <div className={styles.emptyNoPhotosHero}>
        <div className={styles.emptyNoPhotosLogo}>
          <Image src={logoWhite} alt="Brillipoint" width={72} height={72} priority />
        </div>
        <h2>Tus fotos están en camino ✨</h2>
        <p>En cuanto se tomen, aparecerán aquí automáticamente.</p>
        <button type="button" className={styles.primaryBtn} onClick={onRetry}>
          Reintentar
        </button>
      </div>

      <div className={styles.emptySkeletonGrid}>
        {new Array(8).fill(0).map((_, index) => (
          <div key={index} className={styles.mobileSkeletonCard} />
        ))}
      </div>
    </section>
  );
};

export default EmptyStateNoPhotos;
