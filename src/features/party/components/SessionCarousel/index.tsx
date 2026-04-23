import React, { useState } from "react";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { SocialMediaCTA } from "../SocialMediaCTA";
import { SessionPhoto, SessionEventData } from "../../types";
import {
  downloadPhoto,
  sharePhoto,
  buildDownloadFilename,
} from "../../utils/mediaActions";
import styles from "@assets/css/party-public.module.css";

type ActionState = "buttons" | "cta";

interface SessionCarouselProps {
  photos: SessionPhoto[];
  eventData: SessionEventData;
}

const SessionCarousel = ({ photos, eventData }: SessionCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [actionState, setActionState] = useState<ActionState>("buttons");
  const [ctaContext, setCtaContext] = useState<"download" | "personalized">("download");

  const slides = photos.map((p) => ({ src: p.url }));

  const handleDownload = async () => {
    await downloadPhoto(
      photos[index].url,
      buildDownloadFilename(eventData.honoreesNames, index),
    );
    setCtaContext("download");
    setActionState("cta");
  };

  const handleShare = async () => {
    await sharePhoto(photos[index].url, eventData.honoreesNames);
    setCtaContext("personalized");
    setActionState("cta");
  };

  return (
    <>
      <Lightbox
        open
        close={() => {}}
        slides={slides}
        index={index}
        on={{ view: ({ index: i }) => { setIndex(i); setActionState("buttons"); } }}
        className={styles.yarlDarkOverlay}
        render={{
          buttonClose: () => null,
          controls: () => (
            <div className={styles.viewerActionsFixed}>
              {actionState === "buttons" && (
                <div className={styles.viewerPrimaryActions}>
                  <button
                    type="button"
                    className={`${styles.btnExperience} ${styles.btnPersonalizar}`}
                    onClick={handleDownload}
                    aria-label="Descargar foto"
                  >
                    <svg
                      width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ marginRight: 6 }}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Descargar
                  </button>
                  <button
                    type="button"
                    className={`${styles.btnExperience} ${styles.btnDedicar}`}
                    onClick={handleShare}
                    aria-label="Compartir foto"
                  >
                    <svg
                      width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ marginRight: 6 }}
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Compartir
                  </button>
                </div>
              )}

              {actionState === "cta" && (
                <div className={styles.modalEndState}>
                  <SocialMediaCTA
                    context={ctaContext}
                    nombreFestejado={eventData.honoreesNames}
                    onClose={() => setActionState("buttons")}
                  />
                </div>
              )}

              {eventData.eventToken && (
                <div className={styles.sessionGalleryLink}>
                  <Link href={`/fiesta/${eventData.eventToken}`}>
                    Ver galería del evento
                  </Link>
                </div>
              )}
            </div>
          ),
        }}
      />
    </>
  );
};

export default SessionCarousel;
