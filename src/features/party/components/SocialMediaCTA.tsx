import { useMemo } from "react";
import styles from "@assets/css/social-media-cta.module.css";

type Context = "download" | "personalized" | "dedicated";

interface SocialMediaCTAProps {
  context: Context;
  nombreFestejado?: string;
  onWAClick?: () => void;
  onClose?: () => void;
}

const COPY: Record<Context, { titulo: string; subtitulo: string }> = {
  download: {
    titulo: "Imagina esto en tu evento ✨",
    subtitulo: "Haz que tus invitados vivan una experiencia inolvidable 💫",
  },
  personalized: {
    titulo: "Tu foto personalizada se descargó ✨",
    subtitulo: "Haz que tus invitados vivan una experiencia inolvidable 💫",
  },
  dedicated: {
    titulo: "Tu dedicatoria fue enviada 💖",
    subtitulo: "Haz que tus invitados vivan una experiencia inolvidable 💫",
  },
};

export const SocialMediaCTA = ({
  context,
  nombreFestejado = "",
  onWAClick,
  onClose,
}: SocialMediaCTAProps) => {
  const phone = useMemo(() => {
    const raw = (
      process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5212215775211"
    ).trim();
    return raw.replace(/[^\d]/g, "");
  }, []);

  const waLink = useMemo(() => {
    const mensaje = `Hola, acabo de ver las fotos en el evento de ${nombreFestejado} y me encantó la experiencia. Me gustaría conocer más.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;
  }, [phone, nombreFestejado]);

  const { titulo, subtitulo } = COPY[context];

  return (
    <div
      className={
        context === "download"
          ? styles.modalEndStateDownload
          : styles.modalEndState
      }
    >
      {context === "download" && onClose && (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}

      <p className={styles.titulo}>{titulo}</p>
      <p className={styles.subtitulo}>{subtitulo}</p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onWAClick}
        className={styles.waBtn}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M16 2.667C8.643 2.667 2.667 8.643 2.667 16c0 2.373.62 4.691 1.799 6.73L2.667 29.333l6.843-1.769A13.27 13.27 0 0 0 16 29.333c7.357 0 13.333-5.976 13.333-13.333S23.357 2.667 16 2.667Zm0 24A10.6 10.6 0 0 1 10.4 25.07l-.4-.235-4.06 1.05 1.085-3.956-.26-.41A10.61 10.61 0 1 1 16 26.667Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M22.24 18.645c-.33-.165-1.957-.965-2.26-1.076-.303-.11-.524-.165-.744.165-.22.33-.855 1.076-1.05 1.296-.193.22-.386.247-.716.082-.33-.165-1.395-.514-2.658-1.64-.982-.876-1.645-1.958-1.84-2.288-.193-.33-.021-.509.144-.674.149-.148.33-.386.495-.579.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.579-.082-.165-.744-1.797-1.02-2.46-.268-.642-.54-.555-.744-.565l-.634-.012c-.22 0-.578.082-.88.413-.303.33-1.156 1.13-1.156 2.756 0 1.626 1.185 3.198 1.35 3.418.165.22 2.333 3.56 5.65 4.99.79.34 1.405.543 1.885.695.792.252 1.512.217 2.08.132.635-.095 1.957-.8 2.233-1.57.275-.772.275-1.434.193-1.57-.082-.138-.303-.22-.634-.386Z"
            fill="currentColor"
          />
        </svg>
        Quiero esto en mi evento
      </a>

      <div className={styles.redes}>
        <a
          href="https://www.instagram.com/brillipoint"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={styles.red}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Z"
              fill="currentColor"
              opacity="0.95"
            />
            <path
              d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
              fill="currentColor"
            />
            <path
              d="M17.6 6.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@brillipoint.glitterbar"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className={styles.red}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          href="https://www.facebook.com/brillipoint"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className={styles.red}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 21v-7h2.4l.4-3H13.5V9.2c0-.87.24-1.46 1.5-1.46h1.6V5.06c-.28-.04-1.24-.12-2.36-.12-2.33 0-3.94 1.42-3.94 4.03V11H8v3h2.8v7h2.7Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};
