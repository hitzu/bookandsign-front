import styles from "@assets/css/social-media-footer.module.css";
import { useMemo } from "react";
import { ContractSlot, GetContractByIdResponse } from "../../../interfaces";

export const SocialMediaFooter = ({
  data,
  slot,
  onOpenContact,
}: {
  data: GetContractByIdResponse;
  slot: ContractSlot;
  onOpenContact?: () => void;
}) => {
  const normalizeWhatsAppPhone = (raw: string) => raw.replace(/[^\d]/g, "");

  const whatsappHref = useMemo(() => {
    const phoneRaw = (
      process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "5212215775211"
    ).trim();
    const phone = normalizeWhatsAppPhone(phoneRaw);
    const contractId = data?.contract?.id;
    const date = slot?.slot?.eventDate ? ` el ${slot?.slot?.eventDate}` : "";
    const text = `Hola, Tengo una duda sobre mi reserva Brillipoint${
      contractId ? ` (Contrato #${contractId})` : ""
    }${date}.`;
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${phone}?text=${encoded}`;
  }, [data?.contract?.id, slot]);

  return (
    <div className={styles.footerCard}>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className={styles.whatsappBtn}
      >
        <span className={styles.btnIcon} aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 2.667C8.643 2.667 2.667 8.643 2.667 16c0 2.373.62 4.691 1.799 6.73L2.667 29.333l6.843-1.769A13.27 13.27 0 0 0 16 29.333c7.357 0 13.333-5.976 13.333-13.333S23.357 2.667 16 2.667Zm0 24A10.6 10.6 0 0 1 10.4 25.07l-.4-.235-4.06 1.05 1.085-3.956-.26-.41A10.61 10.61 0 1 1 16 26.667Z"
              fill="currentColor"
              opacity="0.92"
            />
            <path
              d="M22.24 18.645c-.33-.165-1.957-.965-2.26-1.076-.303-.11-.524-.165-.744.165-.22.33-.855 1.076-1.05 1.296-.193.22-.386.247-.716.082-.33-.165-1.395-.514-2.658-1.64-.982-.876-1.645-1.958-1.84-2.288-.193-.33-.021-.509.144-.674.149-.148.33-.386.495-.579.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.579-.082-.165-.744-1.797-1.02-2.46-.268-.642-.54-.555-.744-.565l-.634-.012c-.22 0-.578.082-.88.413-.303.33-1.156 1.13-1.156 2.756 0 1.626 1.185 3.198 1.35 3.418.165.22 2.333 3.56 5.65 4.99.79.34 1.405.543 1.885.695.792.252 1.512.217 2.08.132.635-.095 1.957-.8 2.233-1.57.275-.772.275-1.434.193-1.57-.082-.138-.303-.22-.634-.386Z"
              fill="currentColor"
            />
          </svg>
        </span>
        WhatsApp
      </a>

      <div className={styles.actions}>
        <a
          href="https://www.instagram.com/brillipoint/"
          target="_blank"
          rel="noreferrer"
          className={styles.iconLink}
          aria-label="Instagram"
          title="Instagram"
        >
          IG
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61579380963496"
          target="_blank"
          rel="noreferrer"
          className={styles.iconLink}
          aria-label="Facebook"
          title="Facebook"
        >
          FB
        </a>

        {onOpenContact ? (
          <button
            type="button"
            className={styles.moreBtn}
            onClick={onOpenContact}
          >
            Ver más
          </button>
        ) : null}
      </div>
    </div>
  );
};
