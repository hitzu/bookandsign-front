import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { axiosInstanceWithoutToken } from "../../../api/config/axiosConfig";
import { getExperience } from "../experiences";
import { GalleryResponse, GallerySessionItem, SessionEventData } from "../types";
import { shareUrl } from "../utils/mediaActions";
import styles from "@assets/css/fotobooth-overview.module.css";

const SPLASH_DURATION_MS = 3200;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FiestaPage({ eventToken }: { eventToken: string }) {
  const router = useRouter();

  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<GallerySessionItem[]>([]);
  const [eventData, setEventData] = useState<SessionEventData | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState(false);

  const splashDone = useRef(false);
  const dataReady = useRef(false);

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

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    await shareUrl(url, eventData?.honoreesNames ?? "Evento");
  };

  const { Splash, Overview } = getExperience(eventData?.eventType);

  if (showSplash) {
    return (
      <Splash
        honoreesNames={eventData?.honoreesNames}
        date={eventData?.date}
        onComplete={handleSplashComplete}
        duration={SPLASH_DURATION_MS}
      />
    );
  }

  if (loading) {
    return (
      <div className={styles.centerPage}>
        <div className={styles.loaderOrb} />
        <p>Cargando galería del evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centerPage}>
        <p>No pudimos cargar la galería</p>
        <button className={styles.retryBtn} onClick={fetchGallery}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <Overview
      sessions={sessions}
      eventData={eventData}
      onSelectSession={(token) => router.push(`/mis-fotos/${token}`)}
      onShare={handleShare}
    />
  );
}
