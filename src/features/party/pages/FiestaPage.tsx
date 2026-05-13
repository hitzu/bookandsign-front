import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getExperience } from "../experiences";
import {
  GallerySessionItem,
  SessionEventData,
} from "../../../interfaces/eventGallery";
import { AnalyticsAction } from "../../../interfaces";
import { trackEvent } from "../../../api/services/eventAnalyticsService";
import { shareUrl } from "../utils/mediaActions";
import styles from "@assets/css/fotobooth-overview.module.css";
import { getEventGalleryV2 } from "../../../api/services/partyPublicService";
import { formatSplashDate } from "../utils/formatSplashDate";
import { preloadImages } from "../utils/preloadImages";
import { appendSourceToPath, readSourceFromRouter } from "../utils/sourceTracking";

const SPLASH_DURATION_MS = 3200;
const CRITICAL_COVER_COUNT = 10;
const READY_REVEAL_MS = 1800;

const getQueryValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const isRoutePlaceholder = (value: string) =>
  value.startsWith("[") && value.endsWith("]");

const getFiestaTokenFromPath = (asPath: string) => {
  const [pathname = ""] = asPath.split("?");
  const segments = pathname.split("/").filter(Boolean);
  const fiestaIndex = segments.findIndex((segment) => segment === "fiesta");

  if (fiestaIndex === -1) return undefined;

  const token = segments[fiestaIndex + 1];
  if (!token || isRoutePlaceholder(token)) return undefined;

  return decodeURIComponent(token);
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FiestaPage({ eventToken }: { eventToken?: string }) {
  const router = useRouter();

  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<GallerySessionItem[]>([]);
  const [eventData, setEventData] = useState<SessionEventData | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [isSplashReady, setIsSplashReady] = useState(false);
  const [splashStep, setSplashStep] = useState("Preparando la experiencia");

  const splashDone = useRef(false);
  const assetsReady = useRef(false);
  const readyRevealDone = useRef(false);
  const hasTrackedGalleryOpened = useRef(false);
  const source = readSourceFromRouter(router);
  const resolvedEventToken =
    eventToken ||
    getQueryValue(router.query.eventToken) ||
    getFiestaTokenFromPath(router.asPath);

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

  const preloadGalleryCovers = async (gallerySessions: GallerySessionItem[]) => {
    const coverUrls = gallerySessions
      .map((session) => session.coverPhoto)
      .filter(Boolean);
    const criticalCoverUrls = coverUrls.slice(0, CRITICAL_COVER_COUNT);
    const backgroundCoverUrls = coverUrls.slice(CRITICAL_COVER_COUNT);

    if (criticalCoverUrls.length > 0) {
      setSplashStep("Revelando los mejores momentos");
      await preloadImages(criticalCoverUrls);
    }

    if (backgroundCoverUrls.length > 0) {
      void preloadImages(backgroundCoverUrls);
    }
  };

  const fetchGallery = async () => {
    if (!resolvedEventToken) return;

    try {
      setSplashStep("Buscando las fotos de la fiesta");
      const data = await getEventGalleryV2(resolvedEventToken);
      setEventData(data.event);
      setSessions(data.sessions);
      setIsEmpty(data.sessions.length === 0);
      setError(false);

      setSplashStep("Acomodando la galería");
      await preloadGalleryCovers(data.sessions);
      setLoading(false);
      completeSplashLoading(true);
    } catch {
      setError(true);
      setLoading(false);
      completeSplashLoading(false);
    }
  };

  useEffect(() => {
    if (!resolvedEventToken) return;
    fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedEventToken]);

  // Polling cuando no hay sesiones aún
  useEffect(() => {
    if (!isEmpty) return;
    const interval = setInterval(fetchGallery, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty]);

  const handleSplashComplete = () => {
    splashDone.current = true;
    finishSplashIfReady();
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    await shareUrl(url, eventData?.honoreesNames ?? "Evento");
  };

  useEffect(() => {
    if (
      !router.isReady ||
      !resolvedEventToken ||
      isRoutePlaceholder(resolvedEventToken) ||
      hasTrackedGalleryOpened.current
    ) {
      return;
    }

    hasTrackedGalleryOpened.current = true;
    trackEvent(AnalyticsAction.GALLERY_OPENED, resolvedEventToken, {
      source,
      metadata: {
        source,
        surface: "fiesta_page",
      },
    });
  }, [resolvedEventToken, router.isReady, source]);

  const { Splash, Overview } = getExperience(eventData?.eventTheme?.key);
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

  if (!resolvedEventToken) {
    return (
      <div className={styles.centerPage}>
        <div className={styles.loaderOrb} />
        <p>Cargando galería del evento...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Fiesta{eventData?.honoreesNames ? ` - ${eventData.honoreesNames}` : ""}</title>
      </Head>
      <Overview
        eventToken={resolvedEventToken}
        sessions={sessions}
        eventData={eventData}
        source={source}
        onSelectSession={(token) =>
          router.push(appendSourceToPath(`/mis-fotos/${token}`, source))
        }
        onShare={handleShare}
      />
    </>
  );
}
