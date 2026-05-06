import { PointerEvent, useRef } from "react";
import { useRouter } from "next/router";
import { CarouselProps } from "../../../types";
import {
  buildUniqueDownloadFilename,
  copyToClipboard,
  downloadFile,
  fetchRemoteFile,
  getFileExtensionFromUrl,
  shareUrl,
} from "../../../../utils/mediaActions";
import { AnalyticsAction } from "../../../../../../interfaces";
import { trackEvent } from "../../../../../../api/services/eventAnalyticsService";
import { useFotoBoothCarouselStore } from "../stores/useFotoBoothCarouselStore";
import { buildFallbackItems } from "../types";
import { appendSourceToPath } from "../../../../utils/sourceTracking";
import {
  buildSessionShareMessage,
  buildSessionShareText,
  buildSessionShareUrl,
} from "../../../../utils/sessionShare";

const SWIPE_THRESHOLD_PX = 40;

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return date
    .toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
};

export const useFotoBoothCarousel = ({
  photos,
  items,
  eventData,
  eventToken,
  sessionToken,
  source = "direct",
}: CarouselProps) => {
  const router = useRouter();
  const pointerStartX = useRef<number | null>(null);

  const {
    index,
    activeEffect,
    gifHintVisible,
    isGeneratingAsset,
    isSuccessCtaOpen,
    itemStates,
    setIndex,
    setIsGeneratingAsset,
    openSuccessCta,
    closeSuccessCta,
    setGifHintVisible,
    markItemLoaded,
    markItemError,
    retryItem,
  } = useFotoBoothCarouselStore();

  const normalizedItems =
    items && items.length > 0
      ? items
      : buildFallbackItems(photos.map((photo) => photo.url));

  const activeItem = normalizedItems[index] ?? null;
  const activeItemState = itemStates[index] ?? { retryCount: 0, status: "idle" };
  const canNavigate = normalizedItems.length > 1;
  const canOpenGallery = Boolean(eventData.eventToken);
  const formattedDate = eventData.date ? formatDate(eventData.date) : "";

  const trackSessionEvent = (
    action: AnalyticsAction,
    metadata: Record<string, unknown> = {},
  ) => {
    if (!eventToken) return;

    trackEvent(action, eventToken, {
      sessionId: sessionToken,
      metadata: {
        source,
        session_id: sessionToken,
        photoCount: photos.length,
        itemCount: normalizedItems.length,
        ...metadata,
      },
    });
  };

  const buildOriginalItemFile = async () => {
    if (!activeItem) {
      throw new Error("No hay un item activo para exportar.");
    }

    return fetchRemoteFile(
      activeItem.src,
      buildUniqueDownloadFilename(
        "brillipoint",
        getFileExtensionFromUrl(
          activeItem.src,
          activeItem.type === "gif" ? "gif" : "jpg",
        ),
      ),
    );
  };

  const handleDownloadSuccess = (file: File) => {
    if (!activeItem) return;

    downloadFile(file);
    trackSessionEvent(AnalyticsAction.DOWNLOAD, {
      itemIndex: index,
      itemType: activeItem.type,
      effectName: activeEffect,
      variant: "original",
    });
    openSuccessCta();
  };

  const goTo = (nextIndex: number) => {
    if (!canNavigate) return;

    const total = normalizedItems.length;
    setIndex(((nextIndex % total) + total) % total);
  };

  const handlePointerStart = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;

    const deltaX = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(deltaX) <= SWIPE_THRESHOLD_PX) return;

    goTo(deltaX < 0 ? index + 1 : index - 1);
  };

  const handleSave = async () => {
    if (!activeItem) return;

    setIsGeneratingAsset(true);
    try {
      const file = await buildOriginalItemFile();
      handleDownloadSuccess(file);
    } finally {
      setIsGeneratingAsset(false);
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined" || !sessionToken) return;

    setIsGeneratingAsset(true);
    try {
      const sessionShareUrl = buildSessionShareUrl({
        origin: window.location.origin,
        sessionToken,
        source,
      });
      const shareText = buildSessionShareText({
        eventName: eventData.honoreesNames,
      });
      const shareMessage = buildSessionShareMessage({
        eventName: eventData.honoreesNames,
        url: sessionShareUrl,
      });

      const nativeShareResult = await shareUrl(
        sessionShareUrl,
        `Fotos de ${eventData.honoreesNames?.trim() || "este evento"}`,
        {
          nativeOnly: true,
          text: shareText,
        },
      );

      if (nativeShareResult === "shared") {
        trackSessionEvent(AnalyticsAction.SHARE_CONFIRM_EXECUTED, {
          channel: "native",
          surface: "session_link",
        });
        return;
      }

      const copied = await copyToClipboard(shareMessage);
      if (copied) {
        trackSessionEvent(AnalyticsAction.SHARE_CONFIRM_EXECUTED, {
          channel: "copy_link",
          surface: "session_link",
        });
      }
    } finally {
      setIsGeneratingAsset(false);
    }
  };

  const handleOpenGallery = () => {
    if (!eventData.eventToken) return;
    trackSessionEvent(AnalyticsAction.GALLERY_CTA_CLICKED, {
      surface: "session_header",
    });
    void router.push(
      appendSourceToPath(`/fiesta/${eventData.eventToken}`, "gallery"),
    );
  };

  return {
    activeEffect,
    activeItem,
    activeItemState,
    canNavigate,
    canOpenGallery,
    closeSuccessCta,
    formattedDate,
    gifHintVisible,
    goTo,
    handleItemError: markItemError,
    handleItemLoad: markItemLoaded,
    handleOpenGallery,
    handlePointerEnd,
    handlePointerStart,
    handleRetry: retryItem,
    handleSave,
    handleShare,
    index,
    isGeneratingAsset,
    isSuccessCtaOpen,
    items: normalizedItems,
    setGifHintVisible,
  };
};
