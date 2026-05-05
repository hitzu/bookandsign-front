import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { axiosInstanceWithoutToken } from "../../../api/config/axiosConfig";
import { getExperience } from "../experiences";
import {
  SessionEventData,
  SessionPhoto,
  SessionResponse,
} from "../../../interfaces/eventGallery";
import styles from "@assets/css/party-public.module.css";
import { getEventGallerySessionV2 } from "../../../api/services/partyPublicService";
import { buildSessionItems, getPhotoItems } from "../utils/buildSessionItems";
import { formatSplashDate } from "../utils/formatSplashDate";
import { SessionItem } from "../types/session";
import { readSourceFromRouter } from "../utils/sourceTracking";

type PageState = "loading" | "ready" | "empty" | "error";
const SPLASH_DURATION_MS = 3200;
const READY_REVEAL_MS = 1800;

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
        if (buildSessionItems(data).length > 0) window.location.reload();
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
    <button
      className={styles.retryBtn}
      onClick={() => window.location.reload()}
    >
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
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [items, setItems] = useState<SessionItem[]>([]);
  const [photos, setPhotos] = useState<SessionPhoto[]>([]);
  const [eventData, setEventData] = useState<SessionEventData | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashReady, setIsSplashReady] = useState(false);
  const [splashStep, setSplashStep] = useState("Preparando la experiencia");

  const splashDone = useRef(false);
  const assetsReady = useRef(false);
  const readyRevealDone = useRef(false);
  const source = readSourceFromRouter(router);

  const finishSplashIfReady = () => {
    if (splashDone.current && assetsReady.current && readyRevealDone.current) {
      setShowSplash(false);
    }
  };

  const completeSplashLoading = (showReadyState: boolean) => {
    assetsReady.current = true;

    if (!showReadyState) {
      readyRevealDone.current = true;
      finishSplashIfReady();
      return;
    }

    setIsSplashReady(true);
    window.setTimeout(() => {
      readyRevealDone.current = true;
      finishSplashIfReady();
    }, READY_REVEAL_MS);
  };

  const fetchSession = async () => {
    try {
      setSplashStep("Buscando tu sesión de fotos");
      const session = await getEventGallerySessionV2(sessionToken);
      const sessionItems = buildSessionItems(session);
      const orderedPhotos: SessionPhoto[] = getPhotoItems(sessionItems).map(
        (item) => ({
          url: item.src,
          position: item.photoPosition ?? item.index,
        }),
      );

      setEventData(session?.event ?? null);
      setItems(sessionItems);

      if (sessionItems.length === 0) {
        setItems([]);
        setPhotos([]);
        setPageState("empty");
        completeSplashLoading(true);
        return;
      }

      setSplashStep(
        sessionItems.some((item) => item.type === "gif")
          ? "Preparando tu video"
          : "Revelando tus fotos",
      );
      setPhotos(orderedPhotos);
      setPageState("ready");
      completeSplashLoading(true);
    } catch (error) {
      console.error("[MisFotosPage] Failed to load session", {
        sessionToken,
        error,
      });
      setPageState("error");
      completeSplashLoading(false);
    }
  };

  // Fetch en paralelo al splash
  useEffect(() => {
    if (!sessionToken) return;

    fetchSession();
  }, [sessionToken]);

  const handleSplashComplete = () => {
    splashDone.current = true;
    finishSplashIfReady();
  };

  // El eventType vendrá del backend cuando esté disponible.
  // Por ahora el factory devuelve siempre fotoBoothExperience.
  const { Splash, Carousel } = getExperience(eventData?.eventTheme?.key);
  const splashDate = formatSplashDate(eventData?.date);

  if (showSplash) {
    return (
      <Splash
        honoreesNames={eventData?.honoreesNames}
        date={splashDate}
        isReady={isSplashReady}
        stepLabel={splashStep}
        onComplete={handleSplashComplete}
        duration={SPLASH_DURATION_MS}
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

  return (
    <Carousel
      items={items}
      photos={photos}
      eventData={eventData!}
      eventToken={eventData?.eventToken}
      sessionToken={sessionToken}
      source={source}
    />
  );
}
