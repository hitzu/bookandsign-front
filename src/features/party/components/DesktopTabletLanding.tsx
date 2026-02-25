import React from "react";
import { EventPhoto } from "../../../interfaces";
import styles from "@assets/css/party-public.module.css";

type DesktopTabletLandingProps = {
  eventTitle: string;
  photos: EventPhoto[];
  selectedPhotoIndex: number;
  onSelectPhoto: (index: number) => void;
  onDownload: (photo: EventPhoto) => Promise<void>;
  onShare: (photo: EventPhoto) => Promise<void>;
};

const DesktopTabletLanding = ({
  eventTitle,
  photos,
  selectedPhotoIndex,
  onSelectPhoto,
  onDownload,
  onShare,
}: DesktopTabletLandingProps) => {
  const heroPhoto = photos[selectedPhotoIndex] || photos[0] || null;
  if (!heroPhoto) return null;

  return (
    <section className={styles.desktopLanding}>
      <div className={styles.heroWrap}>
        <div className={styles.heroPrimary}>
          <img src={heroPhoto.publicUrl} alt={eventTitle} className={styles.coverImage} />
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <p className={styles.heroKicker}>{eventTitle}</p>
            <h2>Tu momento, tu brillo.</h2>
            <div className={styles.heroActions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => onDownload(heroPhoto)}
              >
                Descargar
              </button>
              <button
                type="button"
                className={styles.secondaryActionBtn}
                onClick={() => onShare(heroPhoto)}
              >
                Compartir
              </button>
            </div>
          </div>
        </div>

        <aside className={styles.heroRail}>
          {photos.slice(0, 18).map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              className={[
                styles.previewCard,
                selectedPhotoIndex === index ? styles.previewCardActive : "",
              ].join(" ")}
              onClick={() => onSelectPhoto(index)}
              aria-label={`Ver foto ${index + 1}`}
            >
              <img
                src={photo.publicUrl}
                alt={`Preview ${index + 1}`}
                className={styles.previewImage}
                loading="lazy"
              />
            </button>
          ))}
        </aside>
      </div>

      <div id="galeria" className={styles.desktopGrid}>
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className={styles.card}
            onClick={() => onSelectPhoto(index)}
            aria-label={`Abrir foto ${index + 1}`}
          >
            <img
              src={photo.publicUrl}
              alt={`Foto del evento ${index + 1}`}
              className={styles.cardImage}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default DesktopTabletLanding;
