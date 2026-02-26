import React from "react";
import { EventPhoto } from "../../../interfaces";
import styles from "@assets/css/party-public.module.css";

type DesktopTabletLandingProps = {
  eventName?: string;
  eventDescription?: string;
  eventDateLabel?: string;
  photos: EventPhoto[];
  selectedPhotoIndex: number;
  onSelectPhoto: (index: number) => void;
  onDownload: (photo: EventPhoto) => Promise<void>;
  onShare: (photo: EventPhoto) => Promise<void>;
};

const DesktopTabletLanding = ({
  eventName,
  eventDescription,
  eventDateLabel,
  photos,
  selectedPhotoIndex,
  onSelectPhoto,
  onDownload,
  onShare,
}: DesktopTabletLandingProps) => {
  const heroPhoto = photos[selectedPhotoIndex] || photos[0] || null;
  const normalizedDescription = eventDescription?.trim() || "";
  const normalizedEventName = eventName?.trim() || "";
  const shouldShowDescriptionAndName = Boolean(normalizedDescription);
  const heroTitle = shouldShowDescriptionAndName
    ? normalizedDescription
    : "Tu momento tu brillo";
  if (!heroPhoto) return null;

  return (
    <>
      <section className={styles.heroWrap}>
        <div className={styles.heroAmbient} />
        <div className={styles.heroShell}>
          <div className={styles.heroPrimary}>
            <img
              src={heroPhoto.publicUrl}
              alt={heroTitle}
              className={styles.coverImage}
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              {eventDateLabel ? <p className={styles.heroKicker}>{eventDateLabel}</p> : null}
              <h2 className={shouldShowDescriptionAndName ? styles.heroDescriptionTitle : ""}>
                {heroTitle}
              </h2>
              {shouldShowDescriptionAndName && normalizedEventName ? (
                <p className={styles.pollingHint}>{normalizedEventName}</p>
              ) : null}
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
            {photos.map((photo, index) => (
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
      </section>

    </>
  );
};

export default DesktopTabletLanding;
