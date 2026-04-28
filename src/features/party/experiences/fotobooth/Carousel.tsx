import React, { useEffect, useRef, useState } from "react";
import styles from "@assets/css/fotobooth.module.css";
import {
  buildDownloadFilename,
  downloadPhoto,
  sharePhoto,
} from "../../utils/mediaActions";
import { SocialMediaCTA } from "../../components/SocialMediaCTA";
import { CarouselProps } from "../types";
import { AnalyticsAction } from "../../../../interfaces";
import { trackEvent } from "../../../../api/services/eventAnalyticsService";

type CtaSource = "download" | "share";

const FotoBoothCarousel = ({
  photos,
  eventData,
  eventToken,
  sessionToken,
}: CarouselProps) => {
  const [index, setIndex] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [ctaSource, setCtaSource] = useState<CtaSource>("download");
  const [showToast, setShowToast] = useState(false);

  const touchStartX = useRef(0);
  const viewedPhotoIndexes = useRef(new Set<number>());
  const hasTrackedSessionView = useRef(false);

  const trackSessionEvent = (
    action: AnalyticsAction,
    metadata: Record<string, unknown> = {},
  ) => {
    if (!eventToken) return;

    trackEvent(action, eventToken, {
      sessionId: sessionToken,
      metadata: {
        entryPoint: "session_qr",
        photoCount: photos.length,
        ...metadata,
      },
    });
  };

  useEffect(() => {
    if (!eventToken || hasTrackedSessionView.current) return;

    hasTrackedSessionView.current = true;
    trackSessionEvent(AnalyticsAction.SESSION_VIEW);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventToken]);

  useEffect(() => {
    if (!eventToken || viewedPhotoIndexes.current.has(index)) return;

    viewedPhotoIndexes.current.add(index);
    trackSessionEvent(AnalyticsAction.PHOTO_VIEW, { photoIndex: index });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventToken, index]);

  const goTo = (next: number) => {
    setIndex(((next % photos.length) + photos.length) % photos.length);
  };

  const handleSave = async () => {
    await downloadPhoto(
      photos[index].url,
      buildDownloadFilename(eventData.honoreesNames, index),
    );
    trackSessionEvent(AnalyticsAction.DOWNLOAD, { photoIndex: index });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
    setCtaSource("download");
    setTimeout(() => setShowCTA(true), 800);
  };

  const handleShare = async () => {
    await sharePhoto(photos[index].url, eventData.honoreesNames);
    trackSessionEvent(AnalyticsAction.SHARE_CONFIRM_EXECUTED, {
      photoIndex: index,
      surface: "session_carousel",
    });
    setCtaSource("share");
    setShowCTA(true);
  };

  const handleWaClick = () => {
    trackSessionEvent(
      ctaSource === "download"
        ? AnalyticsAction.CTA_WA_POST_DOWNLOAD
        : AnalyticsAction.CTA_WA_MODAL,
      {
        photoIndex: index,
        surface: "session_carousel_sheet",
      },
    );
  };

  const formattedDate = (() => {
    const d = new Date(eventData.date);
    if (isNaN(d.getTime())) return eventData.date;
    return d
      .toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  })();

  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.carouselHeader}>
        <div className={styles.carouselLogo}>✦ mis fotos</div>
        <div className={styles.carouselCount}>
          {index + 1} / {photos.length}
        </div>
      </div>

      {/* Name bar */}
      <div className={styles.carouselNameBar}>
        <div className={styles.carouselNameText}>
          {eventData.honoreesNames}
          {eventData.date ? ` · ${formattedDate}` : ""}
        </div>
      </div>

      {/* Photo area */}
      <div className={styles.photoArea}>
        <div
          className={styles.photoCard}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 40) goTo(dx < 0 ? index + 1 : index - 1);
          }}
        >
          <img
            src={photos[index].url}
            alt={`Foto ${index + 1}`}
            className={styles.photoImg}
          />
        </div>

        <button
          className={`${styles.navBtn} ${styles.navBtnPrev}`}
          onClick={() => goTo(index - 1)}
          aria-label="Foto anterior"
        >
          <svg width="12" height="16" viewBox="0 0 12 16" fill="#ec4899">
            <polygon points="12,0 0,8 12,16" />
          </svg>
        </button>
        <button
          className={`${styles.navBtn} ${styles.navBtnNext}`}
          onClick={() => goTo(index + 1)}
          aria-label="Foto siguiente"
        >
          <svg width="12" height="16" viewBox="0 0 12 16" fill="#ec4899">
            <polygon points="0,0 12,8 0,16" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      {photos.length > 1 && (
        <div className={styles.dotsRow}>
          {photos.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            />
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className={styles.actionRow}>
        <button
          className={styles.btnSave}
          onClick={handleSave}
          aria-label="Guardar foto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Guardar
        </button>
        <button
          className={styles.btnShare}
          onClick={handleShare}
          aria-label="Compartir foto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Compartir
        </button>
      </div>

      {/* Download toast */}
      {showToast && (
        <div className={styles.downloadToast}>
          <span className={styles.toastCheck}>✓</span>
          ¡Foto guardada!
        </div>
      )}

      {/* CTA overlay */}
      {showCTA && (
        <div
          className={styles.ctaOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCTA(false);
          }}
        >
          <div className={styles.ctaSheet}>
            <div className={styles.ctaHandle} />
            <div className={styles.ctaInner}>
              <SocialMediaCTA
                context="eventBooking"
                variant="sheet"
                nombreFestejado={eventData.honoreesNames}
                onWAClick={handleWaClick}
                onClose={() => setShowCTA(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FotoBoothCarousel;
