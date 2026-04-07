import { AnalyticsAction } from "../../interfaces";
import { axiosInstanceWithoutToken } from "../config/axiosConfig";

export const trackEvent = async (
  action: AnalyticsAction,
  eventToken: string,
): Promise<void> => {
  try {
    await axiosInstanceWithoutToken.post("/event-analytics/track", {
      action,
      eventToken,
      sessionId: null,
    });
  } catch {
    // fire-and-forget — never block the UI
  }
};
