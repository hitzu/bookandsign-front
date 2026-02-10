export type PrepProfileQuestionGroup =
  | "celebracion"
  | "concepto"
  | "look_nupcial"
  | "maquillaje"
  | "peinado";

export type PrepProfileQuestionType =
  | "string"
  | "textarea"
  | "radio"
  | "date"
  | "time"
  | "boolean"
  | "object"
  | "asset"
  | "asset_array";

export type PrepProfileRadioOption = {
  value: string;
  label: string;
};

export interface PrepProfileQuestionDefinition {
  id: string;
  type: PrepProfileQuestionType;
  label?: string;
  placeholder?: string;
  group?: PrepProfileQuestionGroup;
  options?: PrepProfileRadioOption[];
}

export const SOCIAL_PREFIX = (n: number) => `social-n-${n}-`;

export const stripSocialPrefix = (questionId: string): string => {
  return questionId.replace(/^social-n-\d+-/, "");
};

export const getSocialIndex = (questionId: string): number | null => {
  const m = questionId.match(/^social-n-(\d+)-/);
  if (!m?.[1]) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
};

const BRIDE_QUESTIONS: PrepProfileQuestionDefinition[] = [
  // CELEBRACIÓN
  {
    id: "event_daypart",
    type: "radio",
    group: "celebracion",
    label: "¿Tu evento será en el día, la tarde o la noche?",
    options: [
      { value: "dia", label: "Día" },
      { value: "tarde", label: "Tarde" },
      { value: "noche", label: "Noche" },
    ],
  },
  {
    id: "event_start_time",
    type: "time",
    group: "celebracion",
    label: "¿A qué hora inicia tu evento?",
    placeholder: "Ej: 17:00",
  },
  {
    id: "event_end_time",
    type: "time",
    group: "celebracion",
    label: "¿A qué hora termina tu evento? (aprox.)",
    placeholder: "Ej: 23:00",
  },
  {
    id: "venue_type",
    type: "radio",
    group: "celebracion",
    label: "¿Qué tipo de lugar será?",
    options: [
      { value: "salon_jardin", label: "Jardín / salón jardín" },
      { value: "salon_eventos", label: "Salón de eventos" },
      { value: "hotel", label: "Hotel" },
      { value: "casa", label: "Casa" },
      { value: "otro", label: "Otro" },
    ],
  },
  {
    id: "prep_at_salon",
    type: "radio",
    group: "celebracion",
    label: "¿Dónde te gustaría realizar tu maquillaje y peinado el día de tu boda?",
    options: [
      { value: "sucursal", label: "En nuestra sucursal (opción recomendada)" },
      { value: "otra_ubicacion", label: "En otra ubicación (hotel / domicilio / venue)" },
    ],
  },
  {
    id: "prep_location_maps_url",
    type: "string",
    group: "celebracion",
    label: "Ubicación exacta donde te arreglarás (link de Google Maps)",
    placeholder:
      "Pega aquí el enlace de Google Maps.\n\nNota: El servicio fuera de la sucursal puede generar un costo adicional por traslado y logística, el cual se cotiza según la ubicación.",
  },

  // CONCEPTO
  {
    id: "wedding_concept_style",
    type: "radio",
    group: "concepto",
    label:
      "Cuando imaginas tu look de novia (vestido, maquillaje y peinado), ¿qué estilo sientes más tuyo?",
    options: [
      { value: "romantico", label: "Romántico" },
      { value: "elegante", label: "Elegante" },
      { value: "natural", label: "Natural" },
      { value: "sensual", label: "Sensual" },
      { value: "atrevida", label: "Atrevida" },
      { value: "no_definido", label: "Aún no lo defino" },
    ],
  },
  {
    id: "wedding_palette_preferred",
    type: "string",
    group: "concepto",
    label: "¿Hay algún color o paleta que predomine?",
    placeholder: "Ej: blanco + verdes / nude + dorado / pasteles / etc.",
  },
  {
    id: "wedding_palette_vetoed",
    type: "string",
    group: "concepto",
    label: "¿Hay colores que NO quieres (vetados)?",
    placeholder: "Ej: rojo, morado, etc.",
  },
  {
    id: "ready_by_time",
    type: "time",
    group: "concepto",
    label: "¿A qué hora necesitas estar lista (ya arreglada)?",
    placeholder: "Ej: 14:00",
  },

  // TU LOOK NUPCIAL (VESTIDO + ACCESORIOS)
  {
    id: "dress",
    type: "object",
    group: "look_nupcial",
    label: "Vestido de novia",
    placeholder:
      "Si ya lo tienes, marca la casilla y sube una foto con buena luz. Si aún no lo tienes, cuéntanos tu idea (silueta, escote, tela o estilo).",
  },

  {
    id: "accessories",
    type: "object",
    group: "look_nupcial",
    label: "Accesorios",
    placeholder:
      "Marca lo que ya tienes y sube fotos. Tip: en joyería puedes subir varias (aretes, collar, pulseras, etc.).",
  },

  // MAQUILLAJE
  {
    id: "makeup_intensity",
    type: "radio",
    group: "maquillaje",
    label: "¿Qué tan cargado te gusta el maquillaje?",
    options: [
      { value: "natural", label: "Natural / suave" },
      { value: "medio", label: "Equilibrado" },
      { value: "intenso", label: "Glam / intenso" },
    ],
  },
  {
    id: "highlight_focus",
    type: "textarea",
    group: "maquillaje",
    label: "¿Qué te gustaría resaltar o disimular?",
    placeholder:
      "Ej: resaltar ojos / disimular ojeras / labios / contorno / etc.",
  },
  {
    id: "makeup_idea",
    type: "textarea",
    group: "maquillaje",
    label: "¿Qué idea general tienes para tu maquillaje?",
    placeholder:
      "Ej: piel luminosa, ojos suaves, delineado marcado, labios nude, etc.",
  },
  {
    id: "skincare_routine",
    type: "textarea",
    group: "maquillaje",
    label: "¿Sigues alguna rutina de skincare?",
    placeholder:
      "Cuéntanos brevemente cuáles son los productos que utilizas y cómo sueles aplicarlos.",
  },
  {
    id: "dislikes_makeup",
    type: "textarea",
    group: "maquillaje",
    label: "NO negociables en maquillaje (lo que NO te gusta)",
    placeholder:
      "Ej: base pesada, glitter, cejas muy marcadas, labios muy oscuros, pestañas muy largas, etc.",
  },
  {
    id: "face_photos",
    type: "asset_array",
    group: "maquillaje",
    label: "Fotos de tu carita (2 fotos)",
    placeholder:
      "Cómo tomarlas (importante): por la mañana o con luz natural, frente a una ventana (interior) sin contraluz, con blusa blanca, sin maquillaje y sin filtros. Cámara a la altura de tus ojos, sin inclinación.\n\nFotos: (1) rostro completamente despejado (cabello hacia atrás). (2) cabello a los costados con caída natural (seco). Ambas totalmente de frente.",
  },
  {
    id: "makeup_references",
    type: "asset_array",
    group: "maquillaje",
    label: "Referencias de maquillaje (máx. 2)",
    placeholder:
      "Sube hasta 2 referencias. No necesitas que sean idénticas a ti: solo que representen el estilo que te gusta.",
  },

  // PEINADO
  {
    id: "hair_idea",
    type: "textarea",
    group: "peinado",
    label: "¿Qué idea general tienes para tu peinado?",
    placeholder:
      "Ej: recogido bajo pulido, ondas sueltas, semi recogido, cola alta, trenza suave, etc.",
  },
  {
    id: "dislikes_hair",
    type: "textarea",
    group: "peinado",
    label: "NO negociables en peinado (lo que NO te gusta)",
    placeholder:
      "Ej: muy tirante, demasiado volumen, ondas muy marcadas, peinados muy altos, etc.",
  },
  {
    id: "hair_photos",
    type: "asset_array",
    group: "peinado",
    label: "Fotos de tu cabello (2 fotos)",
    placeholder:
      "Cómo tomarlas: por la mañana, con el cabello limpio y completamente seco. Sin ningún tipo de moldeado (sin plancha, sin tenaza, sin ondas, sin secadora con cepillo). Que se aprecie claramente el largo.\n\nSube 2 fotos: (1) espalda y (2) perfil (sin filtros).",
  },
  {
    id: "hair_references",
    type: "asset_array",
    group: "peinado",
    label: "Referencias de peinado (máx. 2)",
    placeholder:
      "Sube hasta 2 referencias. Prioriza fotos claras (frente/lateral) del estilo que te gusta.",
  },
];

const buildSocialQuestions = (n: number): PrepProfileQuestionDefinition[] => {
  const p = SOCIAL_PREFIX(n);
  return [
    {
      id: `${p}ready_by_time`,
      type: "time",
      group: "celebracion",
      label: "¿A qué hora necesita estar lista? (social de regalo)",
      placeholder: "Ej: 14:00",
    },
    {
      id: `${p}gift_face_photo`,
      type: "asset",
      group: "maquillaje",
      label: "Foto de rostro (social de regalo)",
      placeholder:
        "Con luz natural, sin filtros, sin maquillaje y cámara a la altura de los ojos. Ideal: cerca de una ventana (interior).",
    },
    {
      id: `${p}gift_makeup_references`,
      type: "asset_array",
      group: "maquillaje",
      label: "Referencias de maquillaje (social de regalo) (máx. 2)",
      placeholder:
        "Sube hasta 2 referencias. No necesita ser idéntico: solo el estilo.",
    },
    {
      id: `${p}makeup_note`,
      type: "textarea",
      group: "maquillaje",
      label: "Detalles para maquillaje (social de regalo)",
      placeholder:
        "Indica qué le gustaría resaltar/disimular y si hay algo con lo que debamos tener especial cuidado (alergias, piel sensible, etc.).",
    },
    {
      id: `${p}gift_hair_photo`,
      type: "asset_array",
      group: "peinado",
      label: "Fotos de cabello (social de regalo) (2 fotos)",
      placeholder:
        "Cabello seco, sin moldeado, que se vea claramente el largo.\n\nSube 2 fotos: (1) espalda y (2) perfil (sin filtros).",
    },
    {
      id: `${p}gift_hair_references`,
      type: "asset_array",
      group: "peinado",
      label: "Referencias de peinado (social de regalo) (máx. 2)",
      placeholder: "Sube hasta 2 referencias de peinado.",
    },
    {
      id: `${p}hair_note`,
      type: "textarea",
      group: "peinado",
      label: "Detalles para peinado (social de regalo)",
      placeholder:
        "Indica qué estilo le gusta, qué NO le gusta y si hay algo con lo que debamos tener especial cuidado.",
    },
  ];
};

export const PREP_PROFILE_QUESTIONS: ReadonlyArray<PrepProfileQuestionDefinition> = [
  ...BRIDE_QUESTIONS,
  // Workaround: hoy solo existe social #1 (futuro: agregar buildSocialQuestions(2), etc.)
  ...buildSocialQuestions(1),
];

