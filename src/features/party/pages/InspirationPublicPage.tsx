import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "@assets/css/party-public.module.css";
import logoWhite from "@assets/images/logo-white.png";
import { EventPhoto } from "../../../interfaces";
import { SocialMediaPlugin } from "../../booking/components/SocialMediaPlugin";
import BrillipointShell from "../components/BrillipointShell";
import IntroHero from "../components/IntroHero";
import PhotoGrid from "../components/PhotoGrid";
import PhotoViewerModal from "../components/PhotoViewerModal";

const INTRO_DURATION_MS = 2500;

// Placeholder: agrega más URLs aquí cuando expandamos el feed.
const INSPIRATION_PHOTO_URLS = [
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/1.jpg",
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/2.jpg",
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/3.jpg",
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/4.jpg",
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/5.jpg",
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/6.jpg",
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/7.jpg",
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/8.jpg",
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/9.jpg",
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/catalogo_poses/10.jpg",
];

const InspirationPublicPage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowIntro(false),
      INTRO_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  const inspirationPhotos = useMemo<EventPhoto[]>(
    () =>
      INSPIRATION_PHOTO_URLS.map((publicUrl, index) => ({
        id: index + 1,
        publicUrl,
        storagePath: `inspiration/${index + 1}.jpg`,
        consentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })),
    [],
  );

  const eventTitle = "Ideas para tu foto";
  const inspirationDescription =
    "Poses y glitter para inspirarte. Elige tu idea favorita y prepárate para crear tu momento brillante.";

  return (
    <BrillipointShell>
      <IntroHero isVisible={showIntro} />

      <section
        className={styles.inspirationBrandWrap}
        aria-label="Brillipoint branding"
      >
        <Image
          src={logoWhite}
          alt="Logo Brillipoint Beauty & Glitter Bar"
          className={styles.inspirationBrandLogo}
          priority
        />
      </section>

      <section className={styles.inspirationHeader}>
        <p className={styles.heroKicker}>IDEAS PARA TU FOTO</p>
        <p className={styles.inspirationActionLead}>{inspirationDescription}</p>
      </section>

      <PhotoGrid
        id="inspiracion-galeria"
        items={inspirationPhotos}
        isLoading={false}
        onSelectPhoto={setViewerIndex}
        emptyTitle="Estamos preparando ideas para este evento ✨"
        emptyDescription="Vuelve en unos minutos para descubrir nuevas poses + glitter."
      />

      <section className={styles.socialSection}>
        <SocialMediaPlugin
          copy={{
            title: "¿Estás listo para tu propio evento Brillipoint?",
            subtitle:
              "Reserva tu fecha o solicita información personalizada por WhatsApp.",
            followLabel:
              "Sigue nuestras redes sociales para que no te pierdas nuestras promociones",
            thanksText: "✨ Nos encantara ser parte de tu evento ✨",
            ctas: [
              {
                label: "Reservar fecha",
                message:
                  "Hola, quiero reservar la experiencia Brillipoint para mi evento.",
                variant: "primary",
              },
            ],
          }}
        />
      </section>

      <PhotoViewerModal
        isOpen={viewerIndex !== null}
        photos={inspirationPhotos}
        activeIndex={viewerIndex}
        eventTitle={eventTitle}
        onClose={() => setViewerIndex(null)}
        onActiveIndexChange={setViewerIndex}
        showMediaActions={false}
      />
    </BrillipointShell>
  );
};

export default InspirationPublicPage;
