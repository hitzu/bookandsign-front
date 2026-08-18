import { CSSProperties } from "react";
import { DeepPartial, PartnerLandingTokens } from "../types";

export const DEFAULT_PARTNER_LANDING_TOKENS: PartnerLandingTokens = {
  surface: { page: "#f7f4ee", card: "#fffdf9", elevated: "#ffffff", border: "#ded8cd", shadow: "0 20px 60px rgba(42, 36, 29, 0.12)" },
  hero: { background: "#ebe5db", overlay: "rgba(31, 29, 25, 0.22)", visual: "#d8cfc1" },
  main: { background: "#f7f4ee", alternate: "#eee9e1" },
  fontFace: { heading: "Cormorant Garamond, Georgia, serif", body: "Public Sans, system-ui, sans-serif", script: "Great Vibes, Cormorant Garamond, cursive" },
  text: { primary: "#24211d", secondary: "#5c554c", muted: "#837b70", inverse: "#fffdf9" },
  accent: { primary: "#8b7350", secondary: "#b29a72", warm: "#c8a978" },
  focus: { ring: "rgba(139, 115, 80, 0.32)", outline: "#8b7350" },
};
const valueOrFallback = (value: unknown, fallback: string) => typeof value === "string" && value.trim() ? value : fallback;
export const normalizePartnerLandingTokens = (tokens?: DeepPartial<PartnerLandingTokens>): PartnerLandingTokens => {
  const fallback = DEFAULT_PARTNER_LANDING_TOKENS;
  return {
    surface: { page: valueOrFallback(tokens?.surface?.page, fallback.surface.page), card: valueOrFallback(tokens?.surface?.card, fallback.surface.card), elevated: valueOrFallback(tokens?.surface?.elevated, fallback.surface.elevated), border: valueOrFallback(tokens?.surface?.border, fallback.surface.border), shadow: valueOrFallback(tokens?.surface?.shadow, fallback.surface.shadow) },
    hero: { background: valueOrFallback(tokens?.hero?.background, fallback.hero.background), overlay: valueOrFallback(tokens?.hero?.overlay, fallback.hero.overlay), visual: valueOrFallback(tokens?.hero?.visual, fallback.hero.visual) },
    main: { background: valueOrFallback(tokens?.main?.background, fallback.main.background), alternate: valueOrFallback(tokens?.main?.alternate, fallback.main.alternate) },
    fontFace: { heading: valueOrFallback(tokens?.fontFace?.heading, fallback.fontFace.heading), body: valueOrFallback(tokens?.fontFace?.body, fallback.fontFace.body), script: valueOrFallback(tokens?.fontFace?.script, fallback.fontFace.script) },
    text: { primary: valueOrFallback(tokens?.text?.primary, fallback.text.primary), secondary: valueOrFallback(tokens?.text?.secondary, fallback.text.secondary), muted: valueOrFallback(tokens?.text?.muted, fallback.text.muted), inverse: valueOrFallback(tokens?.text?.inverse, fallback.text.inverse) },
    accent: { primary: valueOrFallback(tokens?.accent?.primary, fallback.accent.primary), secondary: valueOrFallback(tokens?.accent?.secondary, fallback.accent.secondary), warm: valueOrFallback(tokens?.accent?.warm, fallback.accent.warm) },
    focus: { ring: valueOrFallback(tokens?.focus?.ring, fallback.focus.ring), outline: valueOrFallback(tokens?.focus?.outline, fallback.focus.outline) },
  };
};
export const tokensToCssVars = (tokens: PartnerLandingTokens): CSSProperties => ({
  "--partner-surface-page": tokens.surface.page, "--partner-surface-card": tokens.surface.card, "--partner-surface-elevated": tokens.surface.elevated, "--partner-surface-border": tokens.surface.border, "--partner-surface-shadow": tokens.surface.shadow,
  "--partner-hero-background": tokens.hero.background, "--partner-hero-overlay": tokens.hero.overlay, "--partner-hero-visual": tokens.hero.visual,
  "--partner-main-background": tokens.main.background, "--partner-main-alternate": tokens.main.alternate,
  "--partner-font-heading": tokens.fontFace.heading, "--partner-font-body": tokens.fontFace.body, "--partner-font-script": tokens.fontFace.script,
  "--partner-text-primary": tokens.text.primary, "--partner-text-secondary": tokens.text.secondary, "--partner-text-muted": tokens.text.muted, "--partner-text-inverse": tokens.text.inverse,
  "--partner-accent-primary": tokens.accent.primary, "--partner-accent-secondary": tokens.accent.secondary, "--partner-accent-warm": tokens.accent.warm,
  "--partner-focus-ring": tokens.focus.ring, "--partner-focus-outline": tokens.focus.outline,
}) as CSSProperties;
