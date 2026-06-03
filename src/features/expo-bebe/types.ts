import type { GetPackagesResponse, Promotion } from "../../interfaces";

export type TabKey = "cal" | "srv" | "ext" | "ctr";
export type ContentTabKey = "cal" | "ctr";
export type CatalogMode = "servicios" | "extras";

export type PackageLineItem = {
  pkg: GetPackagesResponse;
  quantity: number;
  promotion: Promotion | null;
};

export interface ServiceIncludeItem {
  icon: string;
  color: string;
  title: string;
  sub: string;
}

export interface ServiceItem {
  eyebrow: string;
  title: [string, string];
  desc: string;
  price: string;
  bg: string;
  label: string;
  includes: ServiceIncludeItem[];
}

/**
 * Brands that already have at least one event booked in a given month.
 * Returned by the calendar/month endpoint once the backend exposes it.
 */
export interface MonthBrandUsage {
  year: number;
  /** 1-12 */
  month: number;
  bookedBrandIds: number[];
}
