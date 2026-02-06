export type PrepProfileQuestionType =
  | "string"
  | "date"
  | "boolean"
  | "object"
  | "asset"
  | "asset_array";

export interface PrepAssetMetadata {
  assetId?: number;
  path: string;
  mime: string;
}

export interface PrepProfileQuestionDefinition {
  id: string;
  type: PrepProfileQuestionType;
  label?: string;
  placeholder?: string;
}

export const PREP_PROFILE_QUESTIONS = [
  // 1) Sobre su boda y el contexto del gran día
  {
    id: "wedding_date",
    type: "date",
    label: "Fecha de la boda",
    placeholder: "Selecciona la fecha",
  },
  {
    id: "event_time",
    type: "string",
    label: "Horario del evento (día/noche)",
    placeholder: "Ej: Día, Tarde, Noche",
  }, // day/night
  {
    id: "venue_setting",
    type: "string",
    label: "Tipo de venue (interior/exterior)",
    placeholder: "Ej: Interior, Exterior, Mixto",
  }, // outdoor/indoor
  {
    id: "wedding_style",
    type: "string",
    label: "Estilo de la boda",
    placeholder: "Ej: Clásica, Boho, Glam, Minimal",
  },
  {
    id: "wedding_palette",
    type: "string",
    label: "Paleta de colores",
    placeholder: "Ej: tonos nude, pastel, blanco y dorado",
  },
  {
    id: "ready_by_time",
    type: "string",
    label: "¿A qué hora necesitas estar lista?",
    placeholder: "Ej: 2:00 pm",
  },

  // 2) Vestido, accesorios y detalles
  {
    id: "dress",
    type: "object",
    label: "Vestido",
    placeholder: "Indica si ya tienes vestido y sube una foto (si aplica)",
  }, // { hasDress: boolean, photo?: asset }
  {
    id: "accessories",
    type: "object",
    label: "Accesorios",
    placeholder: "Sube fotos de joyería, tocado y/o velo (si aplica)",
  }, // { jewelry?: asset_array, headpiece?: asset_array, veil?: asset_array }
  {
    id: "dress_accessories_ideas",
    type: "string",
    label: "Ideas de accesorios",
    placeholder: "Cuéntame qué tienes en mente (joyería, tocado, velo, etc.)",
  },
  {
    id: "dress_accessories_style_preference",
    type: "string",
    label: "Preferencias de estilo para accesorios",
    placeholder: "Ej: delicados, statement, vintage, modernos",
  },

  // 3) Lo que buscas en tu maquillaje y peinado
  {
    id: "desired_feeling",
    type: "string",
    label: "¿Cómo te gustaría sentirte ese día?",
    placeholder: "Ej: natural, elegante, glam, romántica",
  },
  {
    id: "makeup_intensity",
    type: "string",
    label: "Intensidad del maquillaje",
    placeholder: "Ej: suave/natural, medio, intenso",
  },
  {
    id: "highlight_focus",
    type: "string",
    label: "¿Qué te gustaría resaltar?",
    placeholder: "Ej: ojos, piel luminosa, labios, cejas",
  },
  {
    id: "makeup_hair_general_idea",
    type: "string",
    label: "Idea general de maquillaje y peinado",
    placeholder: "Describe tu idea o lo que te inspira",
  },

  // 4) Gustos y NO negociables
  {
    id: "dislikes_makeup",
    type: "string",
    label: "Cosas que NO te gustan en maquillaje",
    placeholder: "Ej: base pesada, glitter, cejas muy marcadas",
  },
  {
    id: "dislikes_hair",
    type: "string",
    label: "Cosas que NO te gustan en peinado",
    placeholder: "Ej: muy tirante, mucho volumen, ondas muy marcadas",
  },
  {
    id: "definitely_not_use",
    type: "string",
    label: "Definitivamente NO (no negociables)",
    placeholder: "Cuéntame tus “deal breakers”",
  },
  {
    id: "tried_and_disliked",
    type: "string",
    label: "Algo que ya probaste y no te gustó",
    placeholder: "Ej: smokey, delineado cat-eye, recogido alto",
  },

  // 5) Fotos necesarias – Tu carita
  {
    id: "face_photos",
    type: "asset_array",
    label: "Fotos de tu carita",
    placeholder: "Sube fotos con buena luz (frente y perfil, sin filtros)",
  },

  // 6) Fotos necesarias – Tu cabello
  {
    id: "hair_photos",
    type: "asset_array",
    label: "Fotos de tu cabello",
    placeholder:
      "Sube fotos donde se vea largo, textura y color (si puedes: frente y atrás)",
  },

  // 7) Referencias visuales
  {
    id: "makeup_references",
    type: "asset_array",
    label: "Referencias de maquillaje",
    placeholder: "Sube 2–5 fotos de looks que te encantan",
  },
  {
    id: "hair_references",
    type: "asset_array",
    label: "Referencias de peinado",
    placeholder: "Sube 2–5 fotos de peinados que te encantan",
  },

  // 8) Maquillaje y peinado social de regalo
  {
    id: "gift_face_photo",
    type: "asset",
    label: "Foto de rostro (social de regalo)",
    placeholder: "Sube una foto con buena luz (sin filtros)",
  },
  {
    id: "gift_hair_photo",
    type: "asset",
    label: "Foto de cabello (social de regalo)",
    placeholder: "Sube una foto donde se vea el cabello claramente",
  },
  {
    id: "gift_makeup_references",
    type: "asset_array",
    label: "Referencias de maquillaje (social de regalo)",
    placeholder: "Sube 1–3 fotos de referencia",
  },
  {
    id: "gift_hair_references",
    type: "asset_array",
    label: "Referencias de peinado (social de regalo)",
    placeholder: "Sube 1–3 fotos de referencia",
  },
] as const satisfies ReadonlyArray<PrepProfileQuestionDefinition>;

