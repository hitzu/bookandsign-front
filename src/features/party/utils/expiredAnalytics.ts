import { AnalyticsAction } from "../../../interfaces";

export type ExpiredSurface = "session_expired" | "fiesta_expired";

export type ExpiredIntent = "viewed" | "message_clicked" | "recovery_requested";

const EXPIRED_EVENTS: Record<
  ExpiredSurface,
  Record<ExpiredIntent, AnalyticsAction>
> = {
  session_expired: {
    viewed: AnalyticsAction.SESSION_EXPIRED_VIEWED,
    message_clicked: AnalyticsAction.SESSION_EXPIRED_MESSAGE_CLICKED,
    recovery_requested: AnalyticsAction.SESSION_EXPIRED_RECOVERY_REQUESTED,
  },
  fiesta_expired: {
    viewed: AnalyticsAction.FIESTA_EXPIRED_VIEWED,
    message_clicked: AnalyticsAction.FIESTA_EXPIRED_MESSAGE_CLICKED,
    recovery_requested: AnalyticsAction.FIESTA_EXPIRED_RECOVERY_REQUESTED,
  },
};

export const expiredEventFor = (
  surface: ExpiredSurface,
  intent: ExpiredIntent,
): AnalyticsAction => EXPIRED_EVENTS[surface][intent];
