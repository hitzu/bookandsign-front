import { useEffect, useRef } from "react";
import { AnalyticsAction } from "../../../interfaces";
import { trackEvent } from "../../../api/services/eventAnalyticsService";
import { PartnerLandingReadyState } from "../types";

type Props = {
  landing: PartnerLandingReadyState;
};

const PARTNER_LANDING_VIEWED = "partner_landing_viewed" as AnalyticsAction;

export const PartnerLandingAnalytics = ({ landing }: Props) => {
  const hasTracked = useRef(false);
  const eventToken = landing.partner.analytics?.eventToken;

  useEffect(() => {
    if (hasTracked.current || !eventToken) return;
    hasTracked.current = true;

    trackEvent(PARTNER_LANDING_VIEWED, eventToken, {
      source: "partner_landing",
      surface: "partners_landing",
      metadata: {
        partnerSlug: landing.partner.slug,
        occasion: landing.occasion,
      },
    });
  }, [eventToken, landing.occasion, landing.partner.slug]);

  return null;
};
