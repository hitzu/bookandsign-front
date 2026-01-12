export interface Promotion {
  id: number;
  brandId: number;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  status: string;
}
