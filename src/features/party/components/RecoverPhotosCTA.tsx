import styles from "./RecoverPhotosCTA.module.css";

interface RecoverPhotosCTAProps {
  eventName: string;
  eventDate: string;
  onRecover?: () => void;
}

export function RecoverPhotosCTA({
  eventName,
  eventDate,
  onRecover,
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
      onClick={onRecover}
    >
      Recuperar fotos →
    </a>
  );
}
