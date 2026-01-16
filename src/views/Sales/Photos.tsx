import React, { useEffect, useMemo, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { MEDIA_DATA } from "../../media/mediaManifest";
import NewProductSlider, {
  PhotosCollection,
} from "@views/Application/E-details/NewProductSlider";
import styles from "../../assets/css/sales-photos.module.css";

export const Photos = () => {
  const [photosCollectionId, setPhotosCollectionId] =
    useState<string>("glitter_bar");
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const selectedPhotos: PhotosCollection[] = useMemo(() => {
    const section =
      MEDIA_DATA.sections.find((s) => s.id === photosCollectionId) ??
      MEDIA_DATA.sections[0];
    if (!section) return [];

    return section.photos.map((p, idx) => ({
      id: `${section.id}_${idx}`,
      url: p.src,
      urlFallback: p.fallbackSrc ?? "",
    }));
  }, [photosCollectionId]);

  // Close fullscreen when switching collection (avoids stale indices).
  useEffect(() => {
    setFullscreenIndex(null);
  }, [photosCollectionId]);

  // Prevent background scroll while fullscreen and allow ESC/Arrow keys.
  useEffect(() => {
    const isFullscreen = fullscreenIndex !== null;
    if (!isFullscreen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenIndex(null);
      if (e.key === "ArrowLeft") {
        setFullscreenIndex((i) => {
          if (i === null || selectedPhotos.length <= 1) return i;
          return (i - 1 + selectedPhotos.length) % selectedPhotos.length;
        });
      }
      if (e.key === "ArrowRight") {
        setFullscreenIndex((i) => {
          if (i === null || selectedPhotos.length <= 1) return i;
          return (i + 1) % selectedPhotos.length;
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fullscreenIndex, selectedPhotos.length]);

  const onFullscreenTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onFullscreenTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    touchStart.current = null;

    // Ignore mostly-vertical gestures (prevent accidental scroll-like swipes)
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < 40) return;

    if (dx < 0) {
      setFullscreenIndex((i) => {
        if (i === null || selectedPhotos.length <= 1) return i;
        return (i + 1) % selectedPhotos.length;
      });
    } else {
      setFullscreenIndex((i) => {
        if (i === null || selectedPhotos.length <= 1) return i;
        return (i - 1 + selectedPhotos.length) % selectedPhotos.length;
      });
    }
  };

  const fullscreenPhoto =
    fullscreenIndex !== null ? selectedPhotos[fullscreenIndex] : null;

  return (
    <>
      <div className={styles.photosContainer}>
        <Row className="justify-content-center">
          <Col xs={12} lg={12} xl={10} xxl={8}>
            <div style={{ width: "100%" }}>
              <div className={styles.photosCollectionsPillGroup}>
                {MEDIA_DATA.sections.map((c) => {
                  const isActive = c.id === photosCollectionId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPhotosCollectionId(c.id)}
                      className={
                        styles.photosCollectionsPill +
                        " " +
                        (isActive
                          ? styles.photosCollectionsPillActive
                          : styles.photosCollectionsPillInactive)
                      }
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} lg={12} xl={10} xxl={8}>
            <div className={styles.sliderWrap}>
              <NewProductSlider
                images={selectedPhotos}
                onImageClick={(idx) => {
                  if (!selectedPhotos[idx]) return;
                  setFullscreenIndex(idx);
                }}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Fullscreen overlay */}
      {fullscreenPhoto && fullscreenIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto en pantalla completa"
          className={styles.fullscreenOverlay}
          onTouchStart={onFullscreenTouchStart}
          onTouchEnd={onFullscreenTouchEnd}
          onClick={() => setFullscreenIndex(null)}
        >
          <button
            type="button"
            className={styles.fullscreenClose}
            aria-label="Cerrar"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIndex(null);
            }}
          >
            ×
          </button>

          <div
            className={styles.fullscreenImageWrap}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullscreenPhoto.url}
              alt={`Foto ${fullscreenIndex + 1}`}
              className={styles.fullscreenImage}
              onError={(e) => {
                if (!fullscreenPhoto.urlFallback) return;
                const el = e.currentTarget as HTMLImageElement;
                if (el.src !== fullscreenPhoto.urlFallback)
                  el.src = fullscreenPhoto.urlFallback;
              }}
            />
            <div className={styles.fullscreenFooter}>
              <div style={{ fontSize: 16, opacity: 0.9 }}>
                {MEDIA_DATA.sections.find((s) => s.id === photosCollectionId)
                  ?.label ?? "Fotos"}
                {selectedPhotos.length > 0
                  ? ` · ${fullscreenIndex + 1}/${selectedPhotos.length}`
                  : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
