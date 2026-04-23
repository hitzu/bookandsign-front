import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { axiosInstanceWithoutToken } from "../../../api/config/axiosConfig";
import { SocialMediaPlugin } from "../../booking/components/SocialMediaPlugin";
import BrillipointShell from "../components/BrillipointShell";
import { Splash } from "../components/Splash";
import HeroCoverMobile from "../components/HeroCoverMobile";
import SessionsGrid from "../components/SessionsGrid";
import { GalleryResponse, GallerySessionItem, SessionEventData } from "../types";
import { shareUrl } from "../utils/mediaActions";
import styles from "@assets/css/party-public.module.css";

const SPLASH_DURATION_MS = 2500;

// ─── Empty states ────────────────────────────────────────────────────────────

const EmptyStateGaleria = ({ eventData }: { eventData: SessionEventData | null }) => (
  <section className={styles.centerState}>
    <p className={styles.emptyTitle}>
      El evento de <strong>{eventData?.honoreesNames ?? "hoy"}</strong> acaba de
      comenzar ✨
    </p>
    {eventData?.date && (
      <p className={styles.emptySubtitle}>
        {formatDate(eventData.date)} · Acércate a la cabina y sé el primero
      </p>
    )}
  </section>
);

const EmptyStateError = ({ onRetry }: { onRetry: () => void }) => (
  <section className={styles.centerState}>
    <p className={styles.emptyTitle}>No pudimos cargar la galería ✨</p>
    <button className={styles.retryBtn} onClick={onRetry}>
      Reintentar
    </button>
  </section>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FiestaPage({ eventToken }: { eventToken: string }) {
  const router = useRouter();

  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<GallerySessionItem[]>([]);
  const [eventData, setEventData] = useState<SessionEventData | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const splashDone = useRef(false);
  const dataReady = useRef(false);

  useEffect(() => {
    const onScroll = () => setParallaxOffset(window.scrollY * 0.08);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  const fetchGallery = async () => {
    try {
      const { data } = await axiosInstanceWithoutToken.get<GalleryResponse>(
        `/sessions/gallery/${eventToken}`,
      );
      setEventData(data.event);
      setSessions(data.sessions);
      setIsEmpty(data.sessions.length === 0);
      setError(false);
    } catch {
      setError(true);
    } finally {
      dataReady.current = true;
      setLoading(false);
      if (splashDone.current) setShowSplash(false);
    }
  };

  useEffect(() => {
    if (!eventToken) return;
    fetchGallery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventToken]);

  // Polling cuando no hay sesiones aún
  useEffect(() => {
    if (!isEmpty) return;
    const interval = setInterval(fetchGallery, 4000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty]);

  const handleSplashComplete = () => {
    splashDone.current = true;
    if (dataReady.current) setShowSplash(false);
  };

  const handleShareLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const result = await shareUrl(url, eventData?.honoreesNames ?? "Evento");
    if (result === "shared") setToastMessage("Enlace compartido");
    else if (result === "copied") setToastMessage("Enlace copiado ✨");
    else setToastMessage("No se pudo compartir en este dispositivo");
  };

  const eventDateLabel = eventData?.date ? formatDate(eventData.date) : "";
  const coverUrls = sessions.map((s) => s.coverPhoto).filter(Boolean) as string[];

  if (showSplash) {
    return (
      <BrillipointShell>
        <Splash
          honoreesNames={eventData?.honoreesNames}
          date={eventDateLabel}
          onComplete={handleSplashComplete}
          duration={SPLASH_DURATION_MS}
        />
      </BrillipointShell>
    );
  }

  return (
    <BrillipointShell>
      {loading ? (
        <section className={styles.centerState}>
          <div className={styles.loaderOrb} />
          <p>Cargando galería del evento...</p>
        </section>
      ) : error ? (
        <EmptyStateError onRetry={fetchGallery} />
      ) : (
        <>
          <HeroCoverMobile
            className={styles.fiestaHero}
            eventName={eventData?.honoreesNames}
            eventDateLabel={eventDateLabel}
            coverUrls={coverUrls}
            parallaxOffset={parallaxOffset}
            onViewPhotos={() =>
              document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth" })
            }
            onShareLink={handleShareLink}
          />

          {isEmpty ? (
            <EmptyStateGaleria eventData={eventData} />
          ) : (
            <SessionsGrid
              sessions={sessions}
              onSelectSession={(token) => router.push(`/mis-fotos/${token}`)}
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

      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}
    </BrillipointShell>
  );
}
