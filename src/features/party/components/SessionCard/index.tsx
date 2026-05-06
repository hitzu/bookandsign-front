import React from "react";
import { GallerySessionItem } from "../../../../interfaces/eventGallery";
import styles from "@assets/css/party-public.module.css";

interface SessionCardProps {
  session: GallerySessionItem;
  onClick: () => void;
}

const MultiPhotoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="white"
    width="18"
    height="18"
    aria-hidden="true"
  >
    <path d="M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm16-4a4 4 0 0 1 4 4v10a1 1 0 1 1-2 0V6a2 2 0 0 0-2-2H6a1 1 0 1 1 0-2h12z" />
  </svg>
);

const SessionCard = ({ session, onClick }: SessionCardProps) => (
  <button
    type="button"
    className={styles.mobileMasonryCard}
    onClick={onClick}
    aria-label="Ver fotos de esta sesión"
  >
    <img
      src={session.coverPhoto}
      alt="Portada de la sesión"
      className={styles.mobileMasonryImage}
      loading="lazy"
    />
    {session.photoCount > 1 && (
      <div className={styles.multiPhotoIcon}>
        <MultiPhotoIcon />
      </div>
    )}
  </button>
);

export default SessionCard;
