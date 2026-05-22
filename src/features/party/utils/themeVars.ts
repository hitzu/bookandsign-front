import React from "react";
import { EventPageTheme } from "../types/eventPageTheme";

export function buildThemeVars(theme: EventPageTheme): React.CSSProperties {
  const vars: Record<string, string> = {};
  if (theme.pageBackground) vars["--ep-page-bg"] = theme.pageBackground;
  if (theme.primaryButtonBg) vars["--ep-primary-btn-bg"] = theme.primaryButtonBg;
  if (theme.primaryButtonText) vars["--ep-primary-btn-text"] = theme.primaryButtonText;
  if (theme.secondaryButtonBg) vars["--ep-secondary-btn-bg"] = theme.secondaryButtonBg;
  if (theme.secondaryButtonText) vars["--ep-secondary-btn-text"] = theme.secondaryButtonText;
  if (theme.accentColor) vars["--ep-accent"] = theme.accentColor;
  if (theme.textColor) vars["--ep-text"] = theme.textColor;
  if (theme.mutedTextColor) vars["--ep-muted-text"] = theme.mutedTextColor;
  if (theme.dividerColor) vars["--ep-divider"] = theme.dividerColor;
  if (theme.surfaceBackground) vars["--ep-surface-bg"] = theme.surfaceBackground;
  if (theme.surfaceBorderColor) vars["--ep-surface-border"] = theme.surfaceBorderColor;
  if (theme.surfaceShadow) vars["--ep-surface-shadow"] = theme.surfaceShadow;
  if (theme.accentGlow) vars["--ep-accent-glow"] = theme.accentGlow;
  return vars as React.CSSProperties;
}
