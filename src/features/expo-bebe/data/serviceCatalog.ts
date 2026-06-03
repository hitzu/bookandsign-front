import type { ServiceItem } from "../types";

export const YEARS = [2026, 2027, 2028];

export const SERVICES: ServiceItem[] = [
  {
    eyebrow: "01 · servicio estrella",
    title: ["Photo", "Booth"],
    desc: "Set fotográfico profesional estilo gala con galería digital y fotos impresas.",
    price: "$3,100",
    bg: "linear-gradient(160deg, #efddc8, #d0b594)",
    label: "[ photobooth · set principal ]",
    includes: [
      {
        icon: "◆",
        color: "#F2E8D2",
        title: "Set fotográfico gala",
        sub: "Estilo profesional durante recepción",
      },
      {
        icon: "◆",
        color: "#E8D8F0",
        title: "Galería digital",
        sub: "Personalizada con tu temática",
      },
      {
        icon: "◆",
        color: "#D8EBF5",
        title: "Fotos impresas",
        sub: "Personalizadas para tus invitados",
      },
      {
        icon: "◆",
        color: "#D8F0E3",
        title: "2 horas de servicio",
        sub: "Cobertura durante tu evento",
      },
      {
        icon: "◆",
        color: "#F0E2D8",
        title: "Staff de apoyo",
        sub: "Personal dedicado y atento",
      },
    ],
  },
  {
    eyebrow: "02 · servicio",
    title: ["Foto", "Llaveros"],
    desc: "Set fotográfico estilo gala con estación de llaveros personalizados.",
    price: "$3,600",
    bg: "linear-gradient(160deg, #e7d3df, #c9a6bd)",
    label: "[ foto llaveros · estación ]",
    includes: [
      {
        icon: "◆",
        color: "#F2E8D2",
        title: "Set fotográfico gala",
        sub: "Durante la hora de recepción",
      },
      {
        icon: "◆",
        color: "#E8D8F0",
        title: "Galería digital",
        sub: "Personalizada con tu temática",
      },
      {
        icon: "◆",
        color: "#D8F0E3",
        title: "Estación de llaveros",
        sub: "Entrega personalizada en sitio",
      },
      {
        icon: "◆",
        color: "#F0E2D8",
        title: "Foto llaveros",
        sub: "Recuerdo físico para invitados",
      },
      {
        icon: "◆",
        color: "#D8EBF5",
        title: "Staff de apoyo",
        sub: "Personal dedicado al servicio",
      },
    ],
  },
];

export const EXTRAS: ServiceItem[] = [
  {
    eyebrow: "extra 01 · premium",
    title: ["Glitter", "Bar Móvil"],
    desc: "Estación móvil de glitter cosmético con artista especializada.",
    price: "$800",
    bg: "linear-gradient(160deg, #dde6f0, #aac3dd)",
    label: "[ glitter bar · móvil ]",
    includes: [
      {
        icon: "◆",
        color: "#E8D8F0",
        title: "Glitter cosmético",
        sub: "100% seguro y certificado",
      },
      {
        icon: "◆",
        color: "#F2E8D2",
        title: "Artista especializada",
        sub: "Diseños únicos personalizados",
      },
      {
        icon: "◆",
        color: "#D8EBF5",
        title: "Estación móvil",
        sub: "Se instala en tu evento",
      },
      {
        icon: "◆",
        color: "#D8F0E3",
        title: "Staff de apoyo",
        sub: "Atención personalizada",
      },
    ],
  },
  {
    eyebrow: "extra 02 · cambio de back",
    title: ["Sueño", "Rosa"],
    desc: "Backdrop con plumas blancas + neón 'Amor Eterno'. Ideal baby shower y XV.",
    price: "$500",
    bg: "linear-gradient(160deg, #f5dad9, #e3a8a6)",
    label: "[ backdrop · sueño rosa ]",
    includes: [
      {
        icon: "◆",
        color: "#F5D8D8",
        title: "Backdrop de plumas",
        sub: "Plumas blancas premium",
      },
      {
        icon: "◆",
        color: "#F2E8D2",
        title: "Neón 'Amor Eterno'",
        sub: "Letrero luminoso incluido",
      },
      {
        icon: "◆",
        color: "#E8D8F0",
        title: "Estética soñadora",
        sub: "Ideal XV, Baby Shower, boda",
      },
    ],
  },
  {
    eyebrow: "extra 03 · cambio de back",
    title: ["Cascada de", "Flores"],
    desc: "Muro de flores premium personalizable según la paleta de tu evento.",
    price: "$300",
    bg: "linear-gradient(160deg, #e6e0ef, #b9a6d2)",
    label: "[ backdrop · cascada flores ]",
    includes: [
      {
        icon: "◆",
        color: "#E8D8F0",
        title: "Muro de flores",
        sub: "Flores premium de alta calidad",
      },
      {
        icon: "◆",
        color: "#D8F0E3",
        title: "Personalizable",
        sub: "Colores según tu paleta",
      },
      {
        icon: "◆",
        color: "#F2E8D2",
        title: "Instalación incluida",
        sub: "Montaje y desmontaje",
      },
    ],
  },
  {
    eyebrow: "extra 04 · accesorio",
    title: ["Libro de", "Firmas"],
    desc: "Libro premium tapa dura para dedicatorias con fotos polaroid del evento.",
    price: "$300",
    bg: "linear-gradient(160deg, #efe6d6, #d2c0a0)",
    label: "[ libro firmas · accesorio ]",
    includes: [
      {
        icon: "◆",
        color: "#F2E8D2",
        title: "Libro tapa dura",
        sub: "Acabado premium personalizado",
      },
      {
        icon: "◆",
        color: "#D8EBF5",
        title: "Fotos polaroid",
        sub: "Del evento para pegar",
      },
      {
        icon: "◆",
        color: "#E8D8F0",
        title: "Pluma caligráfica",
        sub: "Para dedicatorias especiales",
      },
    ],
  },
  {
    eyebrow: "extra 05 · accesorio",
    title: ["Accesorios", "Adicionales"],
    desc: "Kit de props y accesorios temáticos para personalizar tu sesión fotográfica.",
    price: "$400",
    bg: "linear-gradient(160deg, #e0ede4, #a8c8b0)",
    label: "[ accesorios · props ]",
    includes: [
      {
        icon: "◆",
        color: "#D8F0E3",
        title: "Props temáticos",
        sub: "Según la paleta de tu evento",
      },
      {
        icon: "◆",
        color: "#F2E8D2",
        title: "Kit personalizado",
        sub: "Coordinado con tu temática",
      },
      {
        icon: "◆",
        color: "#E8D8F0",
        title: "Selección en sitio",
        sub: "Disponibles durante el evento",
      },
    ],
  },
];
