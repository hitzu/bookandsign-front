export type PartnerOccasion = "bodas" | "xv-anos";
export type PartnerStatus = "active" | "inactive";
export type PartnerLandingAnalyticsConfig = { eventToken?: string | null };

export type PartnerLandingTokens = {
  surface: { page: string; card: string; elevated: string; border: string; shadow: string };
  hero: { background: string; overlay: string; visual: string };
  main: { background: string; alternate: string };
  fontFace: { heading: string; body: string; script: string };
  text: { primary: string; secondary: string; muted: string; inverse: string };
  accent: { primary: string; secondary: string; warm: string };
  focus: { ring: string; outline: string };
};

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type PartnerAsset = string | { src: string };
export type PartnerConfig = {
  slug: string; displayName: string; visibleName: string; organizerName: string; status: PartnerStatus; logoSrc?: PartnerAsset;
  defaultOccasion: PartnerOccasion; enabledOccasions: PartnerOccasion[];
  analytics?: PartnerLandingAnalyticsConfig; tokens?: DeepPartial<PartnerLandingTokens>;
};
export type PartnerLandingVisual = {
  title: string; caption: string; ariaLabel: string;
  tone: "ivory" | "stone" | "champagne" | "charcoal";
  imageSrc?: PartnerAsset; focalPoint?: string;
};
export type PartnerLandingContent = {
  occasion: PartnerOccasion; occasionLabel: string; seoTitle: string; seoDescription: string;
  heroTitle: string; heroLead: string; belongingTitle: string; belongingLead: string;
  experienceTitle: string; experienceLead: string;
  inclusions: Array<{ title: string; body: string }>;
  benefits: Array<{ title: string; body: string }>;
  galleryLabel: string; gallery: PartnerLandingVisual[];
  process: Array<{ title: string; body: string }>;
  readinessTitle: string; readinessLead: string;
  faqs: Array<{ question: string; answer: string }>;
  ctaTitle: string; ctaBody: string;
};
export type PartnerLandingReadyState = {
  state: "ready"; partner: Pick<PartnerConfig, "slug" | "displayName" | "visibleName" | "organizerName" | "logoSrc" | "analytics">;
  occasion: PartnerOccasion; content: PartnerLandingContent; tokens: PartnerLandingTokens;
};
export type PartnerLandingErrorState = { state: "not_found" | "inactive" | "occasion_unavailable" | "invalid_config"; slug?: string; occasion?: string; title: string; message: string };
export type PartnerLandingRedirectState = { state: "redirect"; destination: string };
export type PartnerLandingRouteState = PartnerLandingReadyState | PartnerLandingErrorState | PartnerLandingRedirectState;
