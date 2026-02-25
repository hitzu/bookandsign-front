import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import styles from "@assets/css/party-public.module.css";
import {
  getEventPhotosPage,
  getPublicEventByToken,
} from "../../../api/services/partyPublicService";
import { EventPhoto, PublicEvent } from "../../../interfaces";
import { SocialMediaPlugin } from "../../booking/components/SocialMediaPlugin";
import { parseLocalDate } from "@common/dates";
import EmptyStateNoPhotos from "../components/EmptyStateNoPhotos";
import EmptyStateNotFound from "../components/EmptyStateNotFound";
import MobileWowLanding from "../components/MobileWowLanding";
import PhotoViewerModal from "../components/PhotoViewerModal";
import DesktopTabletLanding from "../components/DesktopTabletLanding";

type Props = {
  token?: string;
};

const MOBILE_BREAKPOINT_PX = 767;
const INITIAL_PAGE_LIMIT = 60;

const sortByNewest = (photos: EventPhoto[]) =>
  [...photos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

const sanitizeSegment = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const buildDownloadFilename = (eventName: string, photoIndex: number) => {
  const safeEventName = sanitizeSegment(eventName || "evento");
  return `brillipoint-${safeEventName}-${photoIndex + 1}.jpg`;
};

const downloadPhoto = async (url: string, filename: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudo descargar la foto");
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
};

const copyToClipboard = async (value: string): Promise<boolean> => {
  if (typeof navigator === "undefined") return false;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  return false;
};

const PartyPublicPage = ({ token }: Props) => {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [desktopSelectedPhotoIndex, setDesktopSelectedPhotoIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  const fetchEvent = useCallback(async (eventToken: string): Promise<PublicEvent> => {
    return getPublicEventByToken(eventToken);
  }, []);

  const handleInitialLoad = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setInitialError(null);
    setLoadMoreError(null);
    setNotFound(false);

    try {
      const page = await getEventPhotosPage(token, {
        limit: INITIAL_PAGE_LIMIT,
      });
      const orderedPhotos = sortByNewest(page.items);
      const eventResponse = page.event || (await fetchEvent(token));

      setEvent(eventResponse);
      setPhotos(orderedPhotos);
      setDesktopSelectedPhotoIndex(0);
      setNextCursor(page.nextCursor || null);
      setHasMore(Boolean(page.hasMore || page.nextCursor));
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setNotFound(true);
      } else {
        setInitialError("No pudimos cargar las fotos del evento. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchEvent, token]);

  useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT_PX}px)`,
    );
    const applyViewportState = (matches: boolean) => {
      setIsMobileViewport(matches);
    };

    applyViewportState(mediaQuery.matches);

    const handleMediaChange = (event: MediaQueryListEvent) => {
      applyViewportState(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (!isMobileViewport) return;
    const onScroll = () => {
      setParallaxOffset(window.scrollY * 0.08);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobileViewport]);

  const handleLoadMore = useCallback(async () => {
    if (!token || !hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const page = await getEventPhotosPage(token, {
        limit: INITIAL_PAGE_LIMIT,
        cursor: nextCursor,
      });
      setPhotos((previous) => {
        const previousIds = new Set(previous.map((photo) => photo.id));
        const incoming = page.items.filter((photo) => !previousIds.has(photo.id));
        return [...previous, ...incoming];
      });
      setHasMore(Boolean(page.hasMore || page.nextCursor));
      setNextCursor(page.nextCursor || null);
      if (page.event?.name || page.event?.description || page.event?.coverUrl) {
        setEvent((previous) => ({ ...(previous || { token }), ...page.event }));
      }
    } catch (_error) {
      setLoadMoreError("No pudimos cargar más fotos.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextCursor, token]);

  const handleDownload = async (photo: EventPhoto) => {
    const photoIndex = Math.max(
      0,
      photos.findIndex((item) => item.id === photo.id),
    );

    try {
      await downloadPhoto(photo.publicUrl, buildDownloadFilename(eventTitle, photoIndex));
      setToastMessage("Descarga iniciada");
    } catch (_error) {
      setToastMessage("No se pudo descargar la foto");
    }
  };

  const handleShare = async (photo: EventPhoto) => {
    const shareUrl = photo.publicUrl;
    const shareTitle = `Brillipoint - ${eventTitle || "Mi foto"}`;

    try {
      if (typeof navigator === "undefined") throw new Error("No navigator");

      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        setToastMessage("Compartido");
        return;
      }

      const copied = await copyToClipboard(shareUrl);
      if (copied) {
        setToastMessage("Enlace copiado ✨");
        return;
      }

      setToastMessage("No se pudo compartir en este dispositivo");
    } catch (_error) {
      setToastMessage("No se pudo compartir en este dispositivo");
    }
  };

  const handleShareEventLink = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = event?.name || "Brillipoint";

    try {
      if (typeof navigator === "undefined") throw new Error("No navigator");
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url: shareUrl });
        setToastMessage("Enlace compartido");
        return;
      }

      const copied = await copyToClipboard(shareUrl);
      if (copied) {
        setToastMessage("Enlace copiado ✨");
        return;
      }

      setToastMessage("No se pudo compartir en este dispositivo");
    } catch (_error) {
      setToastMessage("No se pudo compartir en este dispositivo");
    }
  };

  const handleScrollToGallery = () => {
    const section = document.getElementById("galeria");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const eventTitle = event?.name || "Experiencia Brillipoint";
  const eventDateLabel = useMemo(() => {
    const rawDate = event?.createdAt;
    if (!rawDate) return "Momentos en vivo";
    const date = /^\d{4}-\d{2}-\d{2}/.test(rawDate)
      ? parseLocalDate(rawDate)
      : new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "Momentos en vivo";
    return new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }, [event?.createdAt]);

  const coverUrls = useMemo(() => {
    const candidates = [event?.coverUrl, ...photos.map((photo) => photo.publicUrl)];
    return Array.from(new Set(candidates.filter(Boolean) as string[]));
  }, [event?.coverUrl, photos]);
  const isEmptyPhotos = !loading && !notFound && !initialError && photos.length === 0;
  const activePhoto = viewerIndex !== null ? photos[viewerIndex] || null : null;

  if (!token) {
    return <div className={styles.pageRoot}>Cargando experiencia...</div>;
  }

  return (
    <div className={styles.pageRoot}>
      {loading ? (
        <section className={styles.centerState}>
          <div className={styles.loaderOrb} />
          <p>Cargando momentos inolvidables...</p>
        </section>
      ) : notFound ? (
        <EmptyStateNotFound />
      ) : initialError ? (
        <section className={styles.centerState}>
          <h2>Algo salió mal</h2>
          <p>{initialError}</p>
          <button className={styles.primaryBtn} type="button" onClick={handleInitialLoad}>
            Reintentar
          </button>
        </section>
      ) : isEmptyPhotos ? (
        <EmptyStateNoPhotos onRetry={handleInitialLoad} />
      ) : (
        <>
          {isMobileViewport ? (
            <MobileWowLanding
              eventSubtitle={eventDateLabel}
              heroCoverUrls={coverUrls}
              items={photos}
              parallaxOffset={parallaxOffset}
              onViewPhotos={handleScrollToGallery}
              onShareLink={handleShareEventLink}
              onSelectPhoto={setViewerIndex}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              loadMoreError={loadMoreError}
              onLoadMore={handleLoadMore}
              onRetryLoadMore={handleLoadMore}
            />
          ) : (
            <DesktopTabletLanding
              eventSubtitle={eventDateLabel}
              photos={photos}
              selectedPhotoIndex={desktopSelectedPhotoIndex}
              onSelectPhoto={setDesktopSelectedPhotoIndex}
              onDownload={handleDownload}
              onShare={handleShare}
            />
          )}

          <section className={styles.socialSection}>
            <SocialMediaPlugin
              copy={{
                title: "¿Estás listo para tu propio evento Brillipoint?",
                subtitle:
                  "Reserva tu fecha o solicita información personalizada por WhatsApp.",
                followLabel:
                  "Sigue nuestras redes sociales para que no te pierdas nuestras promociones",
                thanksText: "✨ Nos encantara ser parte de tu evento ✨",
                ctas: [
                  {
                    label: "Reservar fecha",
                    message:
                      "Hola, quiero reservar la experiencia Brillipoint para mi evento.",
                    variant: "primary",
                  },
                ],
              }}
            />
          </section>
        </>
      )}

      <PhotoViewerModal
        isOpen={isMobileViewport && viewerIndex !== null}
        photo={activePhoto}
        eventTitle={eventTitle}
        onClose={() => setViewerIndex(null)}
        onDownload={handleDownload}
        onShare={handleShare}
      />
      {toastMessage ? <div className={styles.toast}>{toastMessage}</div> : null}
    </div>
  );
};

export default PartyPublicPage;
