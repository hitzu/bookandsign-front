import { AnalyticsAction } from "../../../interfaces";
import { trackEvent } from "../../../api/services/eventAnalyticsService";
import styles from "./RecoverPhotosCTA.module.css";

interface RecoverPhotosCTAProps {
  eventName: string;
  eventDate: string;
  eventToken: string;
}

export function RecoverPhotosCTA({
  eventName,
  eventDate,
  eventToken,
}: RecoverPhotosCTAProps) {
  const phone = (
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5212215775211"
  ).replace(/[^\d]/g, "");
  const message = encodeURIComponent(
    `Hola Brillipoint, necesito recuperar las fotos del evento ${eventName} del ${eventDate}. Mi nombre es...`,
  );
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.recoverBtn}
      onClick={() =>
        trackEvent(AnalyticsAction.RECOVER_PHOTOS_CTA_CLICKED, eventToken, {
          metadata: {
            surface: "event_expired",
          },
        })
      }
    >
      Recuperar fotos →
    </a>
  );
}
