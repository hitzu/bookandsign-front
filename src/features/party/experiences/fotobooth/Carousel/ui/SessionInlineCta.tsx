import React from "react";
import styles from "@assets/css/fotobooth.module.css";
import { SocialMediaCTA } from "../../../../components/SocialMediaCTA";

type SessionInlineCtaProps = {
  eventName: string;
};

const SessionInlineCta = ({ eventName }: SessionInlineCtaProps) => (
  <div className={styles.sessionInlineCta}>
    <SocialMediaCTA
      context="sessionPresence"
      variant="compact"
      nombreFestejado={eventName}
    />
  </div>
);

export default SessionInlineCta;
