import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import {
  SocialMediaCTA,
  SocialPlatform,
} from "../../../../components/SocialMediaCTA";

type SessionInlineCtaProps = {
  eventName: string;
  onWAClick?: () => void;
  onSocialClick?: (platform: SocialPlatform) => void;
};

const SessionInlineCta = ({
  eventName,
  onWAClick,
  onSocialClick,
}: SessionInlineCtaProps) => (
  <div className={styles.sessionInlineCta}>
    <SocialMediaCTA
      context="sessionPresence"
      variant="compact"
      nombreFestejado={eventName}
      onWAClick={onWAClick}
      onSocialClick={onSocialClick}
    />
  </div>
);

export default SessionInlineCta;
