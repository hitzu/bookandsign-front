import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AxiosError } from "axios";
import logoWhite from "@assets/images/logo-white.png";
import styles from "@assets/css/party-public.module.css";
import {
  getPublicEventByToken,
  getPublicPhotosByEventToken,
} from "../../../api/services/partyPublicService";
import { EventPhoto, PublicEvent } from "../../../interfaces";
import { SocialMediaPlugin } from "../../booking/components/SocialMediaPlugin";

type Props = {
  token?: string;
};

const POLLING_INTERVAL_MS = 8000;
const SLIDESHOW_INTERVAL_MS = 4000;
const INTRO_DURATION_MS = 2500;

const isOptimizedImageHost = (url: string): boolean => {
  try {
    const hostname = new URL(url).hostname;
    return (
      hostname.endsWith(".storage.supabase.co") ||
      hostname === "uljzbxuxzknilubykrlw.storage.supabase.co"
    );
  } catch (_error) {
    return false;
  }
};

const sortByNewest = (photos: EventPhoto[]) =>
  [...photos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

const buildDownloadFilename = (photo: EventPhoto) => {
  const safeDate = new Date(photo.createdAt)
    .toISOString()
    .replace(/[:.]/g, "-");
  return `brillipoint-${photo.id}-${safeDate}.jpg`;
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

const PartyPublicPage = ({ token }: Props) => {
  const reduceMotion = useReducedMotion();
  const pollAbortRef = useRef<AbortController | null>(null);
  const pollInFlightRef = useRef(false);
  const lastSeenRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [lastSeenCreatedAt, setLastSeenCreatedAt] = useState<string | null>(
    null,
  );
  const [isPolling, setIsPolling] = useState(false);

  const [showIntro, setShowIntro] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    lastSeenRef.current = lastSeenCreatedAt;
  }, [lastSeenCreatedAt]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowIntro(false),
      INTRO_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  const fetchEvent = useCallback(
    async (eventToken: string): Promise<PublicEvent> =>
      getPublicEventByToken(eventToken),
    [],
  );

  const fetchPhotos = useCallback(
    async (eventToken: string, signal?: AbortSignal) => {
      return getPublicPhotosByEventToken(eventToken, signal);
    },
    [],
  );

  const handleInitialLoad = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const [eventResponse, photosResponse] = await Promise.all([
        fetchEvent(token),
        fetchPhotos(token),
      ]);
      const orderedPhotos = sortByNewest(photosResponse);
      setEvent(eventResponse);
      setPhotos(orderedPhotos);
      setHeroIndex(0);
      setLastSeenCreatedAt(orderedPhotos[0]?.createdAt || null);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setNotFound(true);
      } else {
        setError("No pudimos cargar las fotos del evento. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchEvent, fetchPhotos, token]);

  const pollForPhotos = useCallback(async () => {
    if (!token || typeof document === "undefined" || document.hidden) return;
    if (pollInFlightRef.current) return;

    pollInFlightRef.current = true;
    setIsPolling(true);
    pollAbortRef.current?.abort();
    const controller = new AbortController();
    pollAbortRef.current = controller;

    try {
      const incoming = sortByNewest(
        await fetchPhotos(token, controller.signal),
      );
      if (!incoming.length) return;

      setPhotos((previous) => {
        const previousIds = new Set(previous.map((photo) => photo.id));
        const fresh = incoming.filter((photo) => !previousIds.has(photo.id));
        if (!fresh.length) return previous;
        const merged = [...fresh, ...previous];
        const latest = merged[0]?.createdAt || lastSeenRef.current;
        setLastSeenCreatedAt(latest || null);
        return merged;
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (error instanceof AxiosError && error.response?.status === 404) {
        setNotFound(true);
        return;
      }
      setError("No pudimos actualizar las fotos en tiempo real.");
    } finally {
      pollInFlightRef.current = false;
      setIsPolling(false);
    }
  }, [fetchPhotos, token]);

  useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]);

  useEffect(() => {
    if (!token) return;
    const interval = window.setInterval(pollForPhotos, POLLING_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (!document.hidden) pollForPhotos();
      if (document.hidden) pollAbortRef.current?.abort();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      pollAbortRef.current?.abort();
    };
  }, [pollForPhotos, token]);

  useEffect(() => {
    if (!photos.length) return;
    if (heroIndex > photos.length - 1) setHeroIndex(0);
  }, [heroIndex, photos.length]);

  useEffect(() => {
    if (reduceMotion || showIntro || hasInteracted || photos.length <= 1)
      return;
    const interval = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % photos.length);
    }, SLIDESHOW_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [hasInteracted, photos.length, reduceMotion, showIntro]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const heroPhoto = photos[heroIndex] || photos[0] || null;
  const canUseNextImage = heroPhoto
    ? isOptimizedImageHost(heroPhoto.publicUrl)
    : false;
  const eventTitle = event?.name || "Experiencia Brillipoint";
  const isEmptyPhotos = !loading && !notFound && !error && photos.length === 0;

  const setHeroFromPhoto = (photoId: number) => {
    setHasInteracted(true);
    const index = photos.findIndex((photo) => photo.id === photoId);
    if (index >= 0) setHeroIndex(index);
  };

  const handleDownload = async (photo: EventPhoto) => {
    try {
      await downloadPhoto(photo.publicUrl, buildDownloadFilename(photo));
      setToastMessage("Foto descargada con exito");
    } catch (_error) {
      setToastMessage("No se pudo descargar la foto");
    }
  };

  const handleShare = async (photo: EventPhoto) => {
    const shareTitle = eventTitle;
    const shareText = "Tu momento, tu brillo ✨";
    const shareUrl = photo.publicUrl;

    try {
      if (typeof navigator === "undefined") throw new Error("No navigator");

      if (navigator.share) {
        try {
          const response = await fetch(shareUrl);
          const blob = await response.blob();
          const file = new File([blob], buildDownloadFilename(photo), {
            type: blob.type || "image/jpeg",
          });

          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              files: [file],
            });
            setToastMessage("Compartido");
            return;
          }
        } catch (_error) {
          // Fallback to URL share when file share is unavailable.
        }

        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setToastMessage("Compartido");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setToastMessage("Link copiado");
        return;
      }

      setToastMessage("No se pudo compartir en este dispositivo");
    } catch (_error) {
      setToastMessage("No se pudo compartir en este dispositivo");
    }
  };

  const handleSharePartyLink = async () => {
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : `/party/${token}`;
    const shareTitle = "Galeria del evento Brillipoint";
    const shareText =
      "Comparte este enlace con los demas invitados para que disfruten las fotos en vivo.";

    try {
      if (typeof navigator === "undefined") throw new Error("No navigator");

      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setToastMessage("Enlace compartido");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setToastMessage("Enlace copiado");
        return;
      }

      setToastMessage("No se pudo compartir en este dispositivo");
    } catch (_error) {
      setToastMessage("No se pudo compartir en este dispositivo");
    }
  };

  const floatingParticles = useMemo(
    () =>
      new Array(8)
        .fill(0)
        .map((_, index) => <div key={index} className={styles.particle} />),
    [],
  );

  if (!token) {
    return <div className={styles.pageRoot}>Cargando experiencia...</div>;
  }

  return (
    <div
      className={styles.pageRoot}
      onPointerDown={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      <AnimatePresence>
        {showIntro ? (
          <motion.section
            className={styles.introScreen}
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: reduceMotion ? 0 : 0.8 },
            }}
          >
            <div className={styles.particleLayer}>{floatingParticles}</div>
            <motion.div
              className={styles.introLogo}
              initial={{ scale: 0.96, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 1.2 }}
            >
              <Image
                src={logoWhite}
                alt="Brillipoint"
                width={220}
                height={220}
                priority
              />
            </motion.div>
            <motion.h1
              className={styles.introTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.9,
                delay: reduceMotion ? 0 : 0.3,
              }}
            >
              Bienvenido a la experiencia Brillipoint ✨
            </motion.h1>
          </motion.section>
        ) : null}
      </AnimatePresence>

      {!showIntro && (
        <>
          {loading ? (
            <section className={styles.centerState}>
              <div className={styles.loaderOrb} />
              <p>Cargando momentos inolvidables...</p>
            </section>
          ) : notFound ? (
            <section className={styles.centerState}>
              <h2>Evento no encontrado</h2>
              <p>
                Verifica el QR o solicita uno nuevo al equipo de Brillipoint.
              </p>
            </section>
          ) : error ? (
            <section className={styles.centerState}>
              <h2>Algo salio mal</h2>
              <p>{error}</p>
              <button
                className={styles.primaryBtn}
                type="button"
                onClick={handleInitialLoad}
              >
                Reintentar
              </button>
            </section>
          ) : (
            <>
              {isEmptyPhotos ? (
                <section className={styles.emptyStateSection}>
                  <div className={styles.emptyStateCard}>
                    <h2 className={styles.emptyStateTitle}>
                      La magia de tu evento esta por comenzar
                    </h2>
                    <p className={styles.emptyStateText}>
                      Este espacio se ira llenando con cada sonrisa, cada pose y
                      cada momento especial que capturemos durante la
                      experiencia Brillipoint. En cuanto empiecen a llegar las
                      primeras tomas, las veras aparecer aqui para revivirlas,
                      compartirlas y descargarlas al instante.
                    </p>
                    <p className={styles.emptyStateHint}>
                      Comparte este enlace con los demas invitados para que
                      entren y disfruten las fotos en cuanto vayan apareciendo.
                    </p>
                    <button
                      type="button"
                      className={styles.emptyStateShareBtn}
                      onClick={handleSharePartyLink}
                    >
                      Compartir enlace con invitados
                    </button>
                  </div>
                </section>
              ) : heroPhoto ? (
                <section className={styles.heroWrap}>
                  <div className={styles.heroAmbient} />
                  <div className={styles.heroShell}>
                    <div className={styles.heroPrimary}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={heroPhoto.id}
                          className={styles.heroMedia}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.9 }}
                        >
                          {canUseNextImage ? (
                            <motion.div
                              className={styles.imageMotionWrap}
                              initial={{ scale: 1.05 }}
                              animate={{ scale: 1 }}
                              transition={{
                                duration: reduceMotion ? 0 : 8,
                                ease: "easeOut",
                              }}
                            >
                              <Image
                                src={heroPhoto.publicUrl}
                                alt={eventTitle}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 70vw"
                                className={styles.coverImage}
                              />
                            </motion.div>
                          ) : (
                            <motion.img
                              src={heroPhoto.publicUrl}
                              alt={eventTitle}
                              className={styles.coverImage}
                              initial={{ scale: 1.05 }}
                              animate={{ scale: 1 }}
                              transition={{
                                duration: reduceMotion ? 0 : 8,
                                ease: "easeOut",
                              }}
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                      <div className={styles.heroOverlay} />
                      <div className={styles.heroContent}>
                        <p className={styles.heroKicker}>{eventTitle}</p>
                        <h2>Tu momento, tu brillo.</h2>
                        <div className={styles.heroActions}>
                          <button
                            type="button"
                            className={styles.primaryBtn}
                            onClick={() => handleDownload(heroPhoto)}
                          >
                            Descargar
                          </button>
                          <button
                            type="button"
                            className={styles.secondaryActionBtn}
                            onClick={() => handleShare(heroPhoto)}
                          >
                            Compartir
                          </button>
                        </div>
                      </div>
                    </div>
                    <aside className={styles.heroRail}>
                      {photos.map((photo) => {
                        const useNextImage = isOptimizedImageHost(
                          photo.publicUrl,
                        );
                        return (
                          <button
                            key={photo.id}
                            type="button"
                            className={[
                              styles.previewCard,
                              photo.id === heroPhoto.id
                                ? styles.previewCardActive
                                : "",
                            ].join(" ")}
                            onClick={() => setHeroFromPhoto(photo.id)}
                            aria-label={`Ver foto ${photo.id} en principal`}
                          >
                            {useNextImage ? (
                              <Image
                                src={photo.publicUrl}
                                alt={`Preview ${photo.id}`}
                                fill
                                sizes="(max-width: 1024px) 28vw, 18vw"
                                className={styles.previewImage}
                              />
                            ) : (
                              <img
                                src={photo.publicUrl}
                                alt={`Preview ${photo.id}`}
                                className={styles.previewImage}
                                loading="lazy"
                              />
                            )}
                          </button>
                        );
                      })}
                    </aside>
                  </div>
                </section>
              ) : null}

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
        </>
      )}

      {toastMessage ? <div className={styles.toast}>{toastMessage}</div> : null}
    </div>
  );
};

export default PartyPublicPage;
