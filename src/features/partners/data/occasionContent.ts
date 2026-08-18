import { PartnerLandingContent } from "../types";
import weddingHero from "@assets/images/partners/wedding-photobooth.png";
import xvHero from "@assets/images/partners/xv-activation.png";
import tattooStation from "@assets/images/partners/wedding-tattoo-station.png";
import weddingGuestExperience from "@assets/images/partners/wedding-guest-experience.png";
import xvGlitterBar from "@assets/images/partners/xv-glitter-bar.png";

export const PARTNER_OCCASION_CONTENT: Record<string, PartnerLandingContent> = {
  bodas: {
    occasion: "bodas",
    occasionLabel: "Bodas",
    seoTitle: "Bodas · Photobooth + Tattoo Station",
    seoDescription:
      "Photobooth, gemas y tatuajes temporales: la estación que {organizerName} eligió para tu boda.",
    heroTitle: "Un rincón de tu boda que tus invitados no van a olvidar.",
    heroLead:
      "Photobooth, gemas y tatuajes temporales, presentados con la misma elegancia que el resto de tu boda. {organizerName} los eligió para darle a tus invitados un motivo más para quedarse en la fiesta.",
    belongingTitle: "Se ve como si siempre hubiera sido parte de tu boda.",
    belongingLead:
      "{organizerName} la incorporó dentro de tu planeación cuidando que combine con la decoración, la paleta de colores y el tono de tu celebración. Nada se siente ajeno ni improvisado.",
    experienceTitle: "Photobooth + Tattoo Station",
    experienceLead:
      "Una estación donde tus invitados se detienen, se arreglan un poco y se llevan un recuerdo, sin interrumpir la elegancia de tu boda.",
    inclusions: [
      {
        title: "Photobooth",
        body: "Fotos instantáneas que tus invitados se llevan esa misma noche, y que tú conservas para siempre.",
      },
      {
        title: "Tattoo Station",
        body: "Gemas y diseños temporales que brillan en cada foto: de aplicación superficial, sin agujas, y se van solos en unos días.",
      },
      {
        title: "Diseño integrado",
        body: "Colores, texturas y montaje elegidos para combinar con tu boda, no para destacar por su cuenta.",
      },
    ],
    benefits: [
      {
        title: "Cero logística para ti",
        body: "Todo se instala, opera y retira sin que tengas que coordinar nada el día de tu boda.",
      },
      {
        title: "A tu paleta de colores",
        body: "El diseño visual se ajusta al estilo y los tonos que ya elegiste con {organizerName}.",
      },
      {
        title: "Una razón más para bailar",
        body: "Una estación que saca a tus invitados de la mesa y los mete de lleno en la fiesta.",
      },
    ],
    galleryLabel: "Fotos reales de esta estación en una boda",
    gallery: [
      {
        title: "Photobooth para bodas",
        caption: "El photobooth, listo antes de que lleguen tus invitados.",
        ariaLabel: "Photobooth preparado para una boda",
        tone: "ivory",
        imageSrc: weddingHero,
      },
      {
        title: "Gemas y tatuajes temporales",
        caption: "Gemas y tatuajes temporales: el detalle que todos quieren probar.",
        ariaLabel: "Tattoo Station con gemas y tatuajes temporales",
        tone: "champagne",
        imageSrc: tattooStation,
      },
      {
        title: "Recuerdos para compartir",
        caption: "Risas, poses y fotos que se comparten esa misma noche.",
        ariaLabel: "Invitados compartiendo una experiencia de photobooth en una boda",
        tone: "stone",
        imageSrc: weddingGuestExperience,
      },
    ],
    process: [
      { title: "Explora", body: "Mira lo que {organizerName} ya eligió para ti." },
      {
        title: "Elige",
        body: "Dile que sí, o pregúntale lo que te haga falta saber.",
      },
      {
        title: "Continúa",
        body: "Ella confirma fecha, precio y los detalles finales contigo.",
      },
    ],
    readinessTitle: "Tú solo disfruta tu boda.",
    readinessLead:
      "{organizerName} ya tiene todo bajo control. La estación llega montada, lista y a tiempo, para que tú no pienses en nada más que en tu boda.",
    faqs: [
      {
        question: "¿Qué incluye exactamente?",
        answer:
          "Photobooth, Tattoo Station, montaje completo y personalización según lo que definiste con {organizerName}.",
      },
      {
        question: "¿Los tatuajes son permanentes?",
        answer:
          "No. Son temporales, superficiales y sin agujas: se aplican fácil y se van solos en unos días.",
      },
      {
        question: "¿Cómo consulto precio y disponibilidad?",
        answer: "Con {organizerName}. Ella tiene toda la propuesta y te confirma directamente.",
      },
    ],
    ctaTitle: "Dile que sí a este momento.",
    ctaBody:
      "Ya la viste. Ahora imagina a tus invitados alrededor de esta estación, foto en mano. Regresa con {organizerName} para confirmar fecha y detalles.",
  },
  "xv-anos": {
    occasion: "xv-anos",
    occasionLabel: "XV años",
    seoTitle: "XV años · Photobooth + Glitter Bar",
    seoDescription:
      "Photobooth y Glitter Bar: la estación que {organizerName} eligió para tu fiesta de XV años.",
    heroTitle: "El rincón más fotografiado de tu fiesta de XV.",
    heroLead:
      "Photobooth y Glitter Bar, elegidos por {organizerName} para que tu fiesta se vea tan brillante como te la imaginaste.",
    belongingTitle: "Hecha para brillar exactamente como tú quieres.",
    belongingLead:
      "{organizerName} la incorporó a tu planeación cuidando que combine con tu tema, tus colores y el estilo que elegiste para tus XV años.",
    experienceTitle: "Photobooth + Glitter Bar",
    experienceLead:
      "Una estación para brillar, literal: tus invitados eligen su estilo, se lo ponen y se toman la foto que van a presumir esa misma noche.",
    inclusions: [
      {
        title: "Photobooth",
        body: "Fotos instantáneas que tus invitados se llevan esa misma noche.",
      },
      {
        title: "Glitter Bar",
        body: "Glitter y accesorios para que cada quien arme su propio brillo antes de la foto.",
      },
      {
        title: "Diseño integrado",
        body: "Colores y montaje elegidos para combinar con el tema de tu fiesta, no para verse aparte.",
      },
    ],
    benefits: [
      {
        title: "Cero logística para ti",
        body: "Todo se instala, opera y retira sin que tengas que coordinar nada el día de tu fiesta.",
      },
      {
        title: "A tu tema y tus colores",
        body: "El glitter y los accesorios se ajustan al estilo que ya elegiste con {organizerName}.",
      },
      {
        title: "La foto que todos van a compartir",
        body: "Una estación diseñada para que tus invitados la posteen esa misma noche.",
      },
    ],
    galleryLabel: "Fotos reales de esta estación en una fiesta de XV años",
    gallery: [
      {
        title: "Photobooth para XV años",
        caption: "El photobooth, listo antes de que lleguen tus invitados.",
        ariaLabel: "Photobooth preparado para una celebración de XV años",
        tone: "stone",
        imageSrc: xvHero,
      },
      {
        title: "Glitter Bar y accesorios",
        caption: "Cada quien arma su brillo antes de la foto.",
        ariaLabel: "Glitter Bar preparada para una fiesta de XV años",
        tone: "champagne",
        imageSrc: xvGlitterBar,
      },
    ],
    process: [
      { title: "Explora", body: "Mira lo que {organizerName} ya eligió para ti." },
      {
        title: "Elige",
        body: "Dile que sí, o pregúntale lo que te haga falta saber.",
      },
      {
        title: "Continúa",
        body: "Ella confirma fecha, precio y los detalles finales contigo.",
      },
    ],
    readinessTitle: "Tú solo disfruta tu fiesta.",
    readinessLead:
      "{organizerName} ya tiene todo bajo control. La estación llega montada, lista y a tiempo, para que tú solo pienses en brillar.",
    faqs: [
      {
        question: "¿Qué incluye exactamente?",
        answer:
          "Photobooth, Glitter Bar, montaje completo y personalización según lo que definiste con {organizerName}.",
      },
      {
        question: "¿Puedo elegir el estilo del glitter?",
        answer:
          "Sí. Los tonos y accesorios se coordinan con {organizerName} para que combinen con el resto de tu fiesta.",
      },
      {
        question: "¿Cómo consulto precio y disponibilidad?",
        answer: "Con {organizerName}. Ella tiene toda la propuesta y te confirma directamente.",
      },
    ],
    ctaTitle: "Dile que sí a este momento.",
    ctaBody:
      "Ya la viste. Ahora imagina a tus invitados formados esperando su turno de brillar. Regresa con {organizerName} para confirmar fecha y detalles.",
  },
};
