import { describe, expect, it } from "vitest";
import {
  DEFAULT_PARTNER_LANDING_TOKENS,
  normalizePartnerLandingTokens,
  tokensToCssVars,
} from "../tokens";

describe("partner landing tokens", () => {
  it("fills every semantic token from safe defaults", () => {
    const tokens = normalizePartnerLandingTokens();

    expect(tokens.surface.page).toBe(DEFAULT_PARTNER_LANDING_TOKENS.surface.page);
    expect(tokens.hero.background).toBe(DEFAULT_PARTNER_LANDING_TOKENS.hero.background);
    expect(tokens.main.alternate).toBe(DEFAULT_PARTNER_LANDING_TOKENS.main.alternate);
    expect(tokens.fontFace.heading).toContain("Cormorant Garamond");
    expect(tokens.text.primary).toBe("#24211d");
    expect(tokens.accent.primary).toBe("#8b7350");
    expect(tokens.focus.outline).toBe("#8b7350");
  });

  it("keeps configured values and falls back for blank strings", () => {
    const tokens = normalizePartnerLandingTokens({
      surface: { page: "#111111", card: "" },
      accent: { primary: "#ff00aa" },
    });

    expect(tokens.surface.page).toBe("#111111");
    expect(tokens.surface.card).toBe(DEFAULT_PARTNER_LANDING_TOKENS.surface.card);
    expect(tokens.accent.primary).toBe("#ff00aa");
  });

  it("maps semantic tokens to css variables", () => {
    const vars = tokensToCssVars(normalizePartnerLandingTokens({
      text: { primary: "#fafafa" },
    })) as Record<string, string>;

    expect(vars["--partner-text-primary"]).toBe("#fafafa");
    expect(vars["--partner-surface-page"]).toBe(DEFAULT_PARTNER_LANDING_TOKENS.surface.page);
    expect(vars["--partner-focus-ring"]).toBe(DEFAULT_PARTNER_LANDING_TOKENS.focus.ring);
  });
});
