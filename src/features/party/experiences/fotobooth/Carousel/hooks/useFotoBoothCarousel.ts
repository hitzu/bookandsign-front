import { PointerEvent, useRef } from "react";
import { useRouter } from "next/router";
import { CarouselProps } from "../../../types";
import {
  buildDownloadFilename,
  copyToClipboard,
  downloadFile,
  fetchRemoteFile,
  getFileExtensionFromUrl,
  shareFile,
} from "../../../../utils/mediaActions";
import { AnalyticsAction } from "../../../../../../interfaces";
import { trackEvent } from "../../../../../../api/services/eventAnalyticsService";
import { ExportVariant } from "../../../../types/session";
import { useFotoBoothCarouselStore } from "../stores/useFotoBoothCarouselStore";
import { buildFallbackItems } from "../types";
import { generateStaticExportAsset } from "../export/generateStaticExportAsset";

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
}: CarouselProps) => {
  const router = useRouter();
  const pointerStartX = useRef<number | null>(null);

  const {
    index,
    activeEffect,
    gifHintVisible,
    pickerAction,
    isPickerOpen,
    isGeneratingAsset,
    isSuccessCtaOpen,
    shareFallbackFile,
    shareFallbackPreviewUrl,
    isShareFallbackOpen,
    itemStates,
    setIndex,
    openPicker,
    closePicker,
    setIsGeneratingAsset,
    openSuccessCta,
    closeSuccessCta,
    openShareFallback,
    closeShareFallback,
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
        entryPoint: "session_qr",
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
      buildDownloadFilename(
        eventData.honoreesNames,
        activeItem.index,
        getFileExtensionFromUrl(
          activeItem.src,
          activeItem.type === "gif" ? "gif" : "jpg",
        ),
      ),
    );
  };

  const handleDownloadSuccess = (file: File, variant: ExportVariant) => {
    if (!activeItem) return;

    downloadFile(file);
    closePicker();
    trackSessionEvent(AnalyticsAction.DOWNLOAD, {
      itemIndex: index,
      itemType: activeItem.type,
      effectName: activeEffect,
      variant,
    });
    openSuccessCta();
  };

  const handleShareSuccess = async (file: File, variant: ExportVariant) => {
    if (!activeItem) return;

    const shareTitle = `${eventData.honoreesNames} · ${variant}`;
    const shareResult = await shareFile(file, shareTitle);

    if (shareResult === "shared") {
      closePicker();
      trackSessionEvent(AnalyticsAction.SHARE_CONFIRM_EXECUTED, {
        itemIndex: index,
        itemType: activeItem.type,
        effectName: activeEffect,
        variant,
        surface: "session_carousel",
      });
      openSuccessCta();
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    closePicker();
    openShareFallback(file, previewUrl);
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

    if (activeItem.type === "gif") {
      const file = await buildOriginalItemFile();
      handleDownloadSuccess(file, "original");
      return;
    }

    openPicker("download");
  };

  const handleShare = async () => {
    if (!activeItem) return;

    if (activeItem.type === "gif") {
      const file = await buildOriginalItemFile();
      await handleShareSuccess(file, "original");
      return;
    }

    openPicker("share");
  };

  const handleVariantSelect = async (variant: ExportVariant) => {
    if (
      !activeItem ||
      !pickerAction ||
      activeItem.type !== "photo"
    ) {
      return;
    }

    setIsGeneratingAsset(true);

    try {
      const generatedFile =
        variant === "original" && activeEffect === "original"
          ? await buildOriginalItemFile()
          : await generateStaticExportAsset({
              effect: activeEffect,
              eventData,
              item: activeItem,
              variant,
            });

      if (pickerAction === "download") {
        handleDownloadSuccess(generatedFile, variant);
        return;
      }

      await handleShareSuccess(generatedFile, variant);
    } finally {
      setIsGeneratingAsset(false);
    }
  };

  const handleFallbackDownload = () => {
    if (!shareFallbackFile) return;
    downloadFile(shareFallbackFile);
    closeShareFallback();
    openSuccessCta();
  };

  const handleCopySessionLink = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    return copyToClipboard(window.location.href);
  };

  const handleOpenGallery = () => {
    if (!eventData.eventToken) return;
    void router.push(`/fiesta/${eventData.eventToken}`);
  };

  return {
    activeEffect,
    activeItem,
    activeItemState,
    canNavigate,
    canOpenGallery,
    closePicker,
    closeShareFallback,
    closeSuccessCta,
    formattedDate,
    gifHintVisible,
    goTo,
    handleCopySessionLink,
    handleFallbackDownload,
    handleItemError: markItemError,
    handleItemLoad: markItemLoaded,
    handleOpenGallery,
    handlePointerEnd,
    handlePointerStart,
    handleRetry: retryItem,
    handleSave,
    handleShare,
    handleVariantSelect,
    index,
    isGeneratingAsset,
    isPickerOpen,
    isShareFallbackOpen,
    isSuccessCtaOpen,
    items: normalizedItems,
    pickerNote: null,
    setGifHintVisible,
    shareFallbackPreviewUrl,
    supportsExport: activeItem?.type === "photo",
  };
};
