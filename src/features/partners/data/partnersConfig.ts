import { PartnerConfig } from "../types";
import susanaEventsLogo from "@assets/images/partners/susana-events-logo.svg";
export const PARTNER_CONFIGS: PartnerConfig[] = [{
  slug: "planner-demo", displayName: "Susana Events", visibleName: "Susana Events", organizerName: "Susana", status: "active", logoSrc: susanaEventsLogo,
  defaultOccasion: "bodas", enabledOccasions: ["bodas", "xv-anos"], analytics: { eventToken: null },
  tokens: { accent: { primary: "#8b7350", secondary: "#b29a72", warm: "#c8a978" }, hero: { background: "#ebe5db", overlay: "rgba(31, 29, 25, 0.22)", visual: "#d8cfc1" } },
}];
