import React, { useEffect, useRef, useState } from "react";
import { axiosInstanceWithoutToken } from "../../../api/config/axiosConfig";
import { getExperience } from "../experiences";
import {
  SessionEventData,
  SessionPhoto,
  SessionResponse,
} from "../types";
import styles from "@assets/css/party-public.module.css";

type PageState = "loading" | "ready" | "empty" | "error";

// ─── Empty states ────────────────────────────────────────────────────────────

const EmptyStateEnCamino = ({
  eventData,
  sessionToken,
}: {
  eventData: SessionEventData | null;
  sessionToken: string;
}) => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data } = await axiosInstanceWithoutToken.get<SessionResponse>(
          `/sessions/${sessionToken}`,
        );
        if (data.photos.length > 0) window.location.reload();
      } catch {
        // ignorar
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [sessionToken]);

  return (
    <div className={styles.centerState}>
      <p className={styles.emptyTitle}>
        Tus fotos del evento de{" "}
        <strong>{eventData?.honoreesNames ?? "tu evento"}</strong> están en
        camino ✨
      </p>
      {eventData?.date && (
        <p className={styles.emptySubtitle}>{eventData.date}</p>
      )}
    </div>
  );
};

const EmptyStateError = ({
  eventData,
}: {
  eventData: SessionEventData | null;
  sessionToken: string;
}) => (
  <div className={styles.centerState}>
    <p className={styles.emptyTitle}>
      Estamos teniendo problemas de conexión en{" "}
      <strong>{eventData?.honoreesNames ?? "tu evento"}</strong> ✨
    </p>
    {eventData?.date && (
      <p className={styles.emptySubtitle}>
        {eventData.date} · Mientras tanto puedes ir por tu foto impresa
      </p>
    )}
    <button className={styles.retryBtn} onClick={() => window.location.reload()}>
      Reintentar
    </button>
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MisFotosPage({
  sessionToken,
}: {
  sessionToken: string;
}) {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [photos, setPhotos] = useState<SessionPhoto[]>([]);
  const [eventData, setEventData] = useState<SessionEventData | null>(null);
  const [splashDone, setSplashDone] = useState(false);

  const photosReady = useRef(false);
  const photosData = useRef<SessionPhoto[]>([]);
  const splashDoneRef = useRef(false);

  // Fetch en paralelo al splash
  useEffect(() => {
    if (!sessionToken) return;

    axiosInstanceWithoutToken
      .get<SessionResponse>(`/sessions/${sessionToken}`)
      .then(({ data }) => {
        setPhotos(data.photos);
        photosData.current = data.photos;
        setEventData(data.event);
        photosReady.current = true;

        if (splashDoneRef.current) {
          setPageState(data.photos.length > 0 ? "ready" : "empty");
        }
      })
      .catch(() => {
        photosReady.current = true;
        if (splashDoneRef.current) setPageState("error");
      });
  }, [sessionToken]);

  const handleSplashComplete = () => {
    splashDoneRef.current = true;
    setSplashDone(true);
    if (photosReady.current) {
      setPageState(photosData.current.length > 0 ? "ready" : "empty");
    }
  };

  // El eventType vendrá del backend cuando esté disponible.
  // Por ahora el factory devuelve siempre fotoBoothExperience.
  const { Splash, Carousel } = getExperience(/* eventData?.eventType */);

  // Mostrar splash hasta que tanto el splash haya terminado como los datos lleguen.
  // Si el splash termina antes que los datos: esperamos.
  const showSplash = !splashDone || (splashDone && !photosReady.current && pageState === "loading");

  if (showSplash) {
    return (
      <Splash
        honoreesNames={eventData?.honoreesNames}
        date={eventData?.date}
        onComplete={handleSplashComplete}
        duration={3200}
      />
    );
  }

  if (pageState === "empty") {
    return (
      <EmptyStateEnCamino eventData={eventData} sessionToken={sessionToken} />
    );
  }

  if (pageState === "error") {
    return (
      <EmptyStateError eventData={eventData} sessionToken={sessionToken} />
    );
  }

  return <Carousel photos={photos} eventData={eventData!} />;
}
