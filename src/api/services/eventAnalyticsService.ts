import { AnalyticsAction } from "../../interfaces";
import { axiosInstanceWithoutToken } from "../config/axiosConfig";

type TrackEventOptions = {
  sessionId?: string | null;
  metadata?: Record<string, unknown>;
};

export const trackEvent = async (
  action: AnalyticsAction,
  eventToken: string,
  options: TrackEventOptions = {},
): Promise<void> => {
  try {
    await axiosInstanceWithoutToken.post("/event-analytics/track", {
      action,
      eventToken,
      sessionId: options.sessionId ?? null,
      ...(options.metadata ? { metadata: options.metadata } : {}),
    });
  } catch {
    // fire-and-forget — never block the UI
  }
};
