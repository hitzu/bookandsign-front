import React from "react";
import { EventPhoto } from "../../../interfaces";
import styles from "@assets/css/party-public.module.css";

type MasonryGridMobileProps = {
  items: EventPhoto[];
  onSelectPhoto: (index: number) => void;
};

const MasonryGridMobile = ({
  items,
  onSelectPhoto,
}: MasonryGridMobileProps) => {
  return (
    <section id="galeria" className={styles.mobileGallerySection}>
      <div className={styles.mobileGalleryHeader}>
        <p>{items.length} recuerdos capturados</p>
      </div>

      <div className={styles.mobileMasonry}>
        {items.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className={styles.mobileMasonryCard}
            onClick={() => onSelectPhoto(index)}
            aria-label={`Abrir foto ${index + 1}`}
          >
            <img
              src={photo.publicUrl}
              alt={`Foto del evento ${index + 1}`}
              className={styles.mobileMasonryImage}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default MasonryGridMobile;
