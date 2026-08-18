import { PARTNER_OCCASION_CONTENT } from "../data/occasionContent";
import { PARTNER_CONFIGS } from "../data/partnersConfig";
import {
  PartnerConfig,
  PartnerLandingContent,
  PartnerLandingErrorState,
  PartnerLandingRouteState,
  PartnerOccasion,
} from "../types";
import { normalizePartnerLandingTokens } from "../utils/tokens";

const replaceOrganizer = <T>(value: T, organizerName: string): T => {
  if (typeof value === "string") {
    return value.replaceAll("{organizerName}", organizerName) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceOrganizer(item, organizerName)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        replaceOrganizer(item, organizerName),
      ]),
    ) as T;
  }

  return value;
};

const isNonEmptyText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isOccasion = (value: string): value is PartnerOccasion =>
  value === "bodas" || value === "xv-anos";

const errorState = (
  state: PartnerLandingErrorState["state"],
  title: string,
  message: string,
  slug?: string,
  occasion?: string,
): PartnerLandingErrorState => ({ state, title, message, slug, occasion });

const validateConfig = (
  partner: PartnerConfig,
  contentByOccasion: Record<string, PartnerLandingContent>,
): PartnerLandingErrorState | null => {
  if (
    !isNonEmptyText(partner.slug) ||
    !isNonEmptyText(partner.displayName) ||
    !isNonEmptyText(partner.organizerName)
  ) {
    return errorState(
      "invalid_config",
      "Configuración incompleta",
      "Esta experiencia todavía no tiene la información mínima para mostrarse.",
      partner.slug,
    );
  }

  if (!partner.enabledOccasions.length || !isOccasion(partner.defaultOccasion)) {
    return errorState(
      "invalid_config",
      "Configuración incompleta",
      "La experiencia no tiene una ocasión principal válida configurada.",
      partner.slug,
    );
  }

  if (!partner.enabledOccasions.includes(partner.defaultOccasion)) {
    return errorState(
      "invalid_config",
      "Configuración inconsistente",
      "La ocasión principal no está habilitada para esta organizadora.",
      partner.slug,
    );
  }

  const hasMissingContent = partner.enabledOccasions.some(
    (occasion) => !contentByOccasion[occasion],
  );
  return hasMissingContent
    ? errorState(
        "invalid_config",
        "Configuración incompleta",
        "Hay una ocasión habilitada sin contenido disponible.",
        partner.slug,
      )
    : null;
};

export const resolvePartnerLandingRoute = (
  slug: string | undefined,
  occasion?: string,
  partners: PartnerConfig[] = PARTNER_CONFIGS,
  contentByOccasion: Record<string, PartnerLandingContent> = PARTNER_OCCASION_CONTENT,
): PartnerLandingRouteState => {
  const normalizedSlug = slug?.trim();

  if (!normalizedSlug) {
    return errorState(
      "not_found",
      "Organizadora no encontrada",
      "No pudimos encontrar esta experiencia compartida.",
    );
  }

  const partner = partners.find((item) => item.slug === normalizedSlug);
  if (!partner) {
    return errorState(
      "not_found",
      "Organizadora no encontrada",
      "No pudimos encontrar esta experiencia compartida.",
      normalizedSlug,
      occasion,
    );
  }

  const configError = validateConfig(partner, contentByOccasion);
  if (configError) return configError;

  if (partner.status !== "active") {
    return errorState(
      "inactive",
      "Experiencia no disponible",
      "Esta página está pausada por la organizadora.",
      partner.slug,
      occasion,
    );
  }

  if (!occasion) {
    return {
      state: "redirect",
      destination: `/con/${encodeURIComponent(partner.slug)}/${partner.defaultOccasion}`,
    };
  }

  const normalizedOccasion = occasion.trim();
  const content = contentByOccasion[normalizedOccasion];
  if (!isOccasion(normalizedOccasion) || !partner.enabledOccasions.includes(normalizedOccasion) || !content) {
    return errorState(
      "occasion_unavailable",
      "Ocasión no disponible",
      "Esta organizadora todavía no tiene habilitada esa experiencia.",
      partner.slug,
      normalizedOccasion,
    );
  }

  return {
    state: "ready",
    partner: {
      slug: partner.slug,
      displayName: partner.displayName,
      visibleName: partner.visibleName,
      organizerName: partner.organizerName,
      logoSrc: partner.logoSrc,
      analytics: partner.analytics,
    },
    occasion: normalizedOccasion,
    content: replaceOrganizer(content, partner.organizerName),
    tokens: normalizePartnerLandingTokens(partner.tokens),
  };
};
