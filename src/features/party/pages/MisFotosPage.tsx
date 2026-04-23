import React, { useEffect, useRef, useState } from "react";
import { axiosInstanceWithoutToken } from "../../../api/config/axiosConfig";
import BrillipointShell from "../components/BrillipointShell";
import { Splash } from "../components/Splash";
import SessionCarousel from "../components/SessionCarousel";
import {
  SessionEventData,
  SessionPhoto,
  SessionResponse,
} from "../types";
import styles from "@assets/css/party-public.module.css";

type PageState = "splash" | "ready" | "empty" | "error";

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
  const [pageState, setPageState] = useState<PageState>("splash");
  const [photos, setPhotos] = useState<SessionPhoto[]>([]);
  const [eventData, setEventData] = useState<SessionEventData | null>(null);

  const photosReady = useRef(false);
  const photosData = useRef<SessionPhoto[]>([]);
  const splashDone = useRef(false);

  useEffect(() => {
    if (!sessionToken) return;

    axiosInstanceWithoutToken
      .get<SessionResponse>(`/sessions/${sessionToken}`)
      .then(({ data }) => {
        setPhotos(data.photos);
        photosData.current = data.photos;
        setEventData(data.event);
        photosReady.current = true;

        if (splashDone.current) {
          setPageState(data.photos.length > 0 ? "ready" : "empty");
        }
      })
      .catch(() => {
        photosReady.current = true;
        if (splashDone.current) setPageState("error");
      });
  }, [sessionToken]);

  const handleSplashComplete = () => {
    splashDone.current = true;
    if (photosReady.current) {
      setPageState(photosData.current.length > 0 ? "ready" : "empty");
    }
  };

  if (pageState === "splash") {
    return (
      <BrillipointShell>
        <Splash
          honoreesNames={eventData?.honoreesNames}
          date={eventData?.date}
          onComplete={handleSplashComplete}
          duration={3000}
        />
      </BrillipointShell>
    );
  }

  if (pageState === "empty") {
    return (
      <BrillipointShell>
        <EmptyStateEnCamino eventData={eventData} sessionToken={sessionToken} />
      </BrillipointShell>
    );
  }

  if (pageState === "error") {
    return (
      <BrillipointShell>
        <EmptyStateError eventData={eventData} sessionToken={sessionToken} />
      </BrillipointShell>
    );
  }

  return (
    <BrillipointShell>
      <SessionCarousel photos={photos} eventData={eventData!} />
    </BrillipointShell>
  );
}
