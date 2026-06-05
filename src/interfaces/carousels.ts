export interface Carousel {
  id: number;
  page: string;
  section: string;
  brandId: number;
  contentType: "image" | "video" | "text";
  title: string | null;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  metadata: Record<string, unknown>;
  sortOrder: number;
  status: "active" | "inactive";
}
