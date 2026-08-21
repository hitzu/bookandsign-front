import React, { useEffect, useRef } from "react";
import styles from "@assets/css/fotobooth.module.css";
import {
  SocialMediaCTA,
  SocialPlatform,
} from "../../../../components/SocialMediaCTA";

type SessionInlineCtaProps = {
  eventName: string;
  onWAClick?: () => void;
  onSocialClick?: (platform: SocialPlatform) => void;
  onGiftPress?: () => void;
  onCtaVisible?: () => void;
};

const SessionInlineCta = ({
  eventName,
  onWAClick,
  onSocialClick,
  onGiftPress,
  onCtaVisible,
}: SessionInlineCtaProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!onCtaVisible) return;
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onCtaVisible();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onCtaVisible]);

  return (
    <div className={styles.sessionInlineCta} ref={containerRef}>
      {onGiftPress && (
        <button
          type="button"
          className={styles.giftTeaser}
          onClick={onGiftPress}
          aria-label="Sorpresa especial"
        >
          🎁
        </button>
      )}

      <SocialMediaCTA
        context="sessionPresence"
        variant="compact"
        nombreFestejado={eventName}
        onWAClick={onWAClick}
        onSocialClick={onSocialClick}
      />
    </div>
  );
};

export default SessionInlineCta;
