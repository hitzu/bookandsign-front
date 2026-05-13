import { AnalyticsAction } from "../../interfaces";
import { axiosInstanceWithoutToken } from "../config/axiosConfig";

type TrackEventOptions = {
  sessionId?: string | null;
  source?: string | null;
  metadata?: Record<string, unknown>;
};

export const trackEvent = async (
  action: AnalyticsAction,
  eventToken: string,
  options: TrackEventOptions = {},
): Promise<void> => {
  const metadataSource =
    typeof options.metadata?.source === "string" ? options.metadata.source : null;
  const source = options.source ?? metadataSource;

  try {
    await axiosInstanceWithoutToken.post("/event-analytics/track", {
      action,
      eventToken,
      sessionId: options.sessionId ?? null,
      ...(source ? { source } : {}),
      ...(options.metadata ? { metadata: options.metadata } : {}),
    });
  } catch {
    // fire-and-forget — never block the UI
  }
};
