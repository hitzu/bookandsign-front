import { useEffect, useRef } from "react";
import { SessionItem } from "../../../../types/session";
import { CarouselProps } from "../../../types";
import { AnalyticsAction } from "../../../../../../interfaces";
import { trackEvent } from "../../../../../../api/services/eventAnalyticsService";
import { useFotoBoothCarouselStore } from "../stores/useFotoBoothCarouselStore";

type UseFotoBoothCarouselEffectsParams = Pick<
  CarouselProps,
  "eventToken" | "photos" | "sessionToken" | "source"
> & {
  activeItem: SessionItem | null;
  activeItemStatus: "idle" | "loaded" | "error";
  index: number;
  items: SessionItem[];
  shareFallbackPreviewUrl: string | null;
  setGifHintVisible: (gifHintVisible: boolean) => void;
};

export const useFotoBoothCarouselEffects = ({
  activeItem,
  activeItemStatus,
  eventToken,
  index,
  items,
  photos,
  source = "direct",
  shareFallbackPreviewUrl,
  sessionToken,
  setGifHintVisible,
}: UseFotoBoothCarouselEffectsParams) => {
  const hasTrackedSessionView = useRef(false);
  const viewedItemIndexes = useRef(new Set<number>());
  const preloadedItemIndexes = useRef(new Set<number>());
  const previousFallbackPreviewUrl = useRef<string | null>(null);
  const reset = useFotoBoothCarouselStore((state) => state.reset);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    if (!eventToken || hasTrackedSessionView.current) return;

    hasTrackedSessionView.current = true;
    trackEvent(AnalyticsAction.SESSION_OPENED, eventToken, {
      sessionId: sessionToken,
      metadata: {
        source,
        photoCount: photos.length,
        itemCount: items.length,
        hasGif: items.some((item) => item.type === "gif"),
      },
    });
  }, [eventToken, items, photos.length, sessionToken, source]);

  useEffect(() => {
    if (!eventToken || viewedItemIndexes.current.has(index)) return;

    viewedItemIndexes.current.add(index);
    trackEvent(AnalyticsAction.PHOTO_VIEW, eventToken, {
      sessionId: sessionToken,
      metadata: {
        source,
        itemIndex: index,
        itemType: activeItem?.type ?? "photo",
      },
    });
  }, [activeItem?.type, eventToken, index, sessionToken, source]);

  useEffect(() => {
    if (activeItem?.type !== "gif" || activeItemStatus === "loaded") {
      setGifHintVisible(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setGifHintVisible(true);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeItem?.type, activeItemStatus, setGifHintVisible]);

  useEffect(() => {
    if (activeItemStatus !== "loaded") return;

    items.forEach((item, itemIndex) => {
      if (itemIndex === index || preloadedItemIndexes.current.has(itemIndex)) {
        return;
      }

      preloadedItemIndexes.current.add(itemIndex);
      const image = new Image();
      image.src = item.src;
    });
  }, [activeItemStatus, index, items]);

  useEffect(() => {
    if (
      previousFallbackPreviewUrl.current &&
      previousFallbackPreviewUrl.current !== shareFallbackPreviewUrl
    ) {
      URL.revokeObjectURL(previousFallbackPreviewUrl.current);
    }

    previousFallbackPreviewUrl.current = shareFallbackPreviewUrl;
  }, [shareFallbackPreviewUrl]);

  useEffect(() => {
    return () => {
      if (previousFallbackPreviewUrl.current) {
        URL.revokeObjectURL(previousFallbackPreviewUrl.current);
      }
    };
  }, []);
};
