export type SalesPeriod = "now" | "weekly" | "monthly";

export interface SaleItem {
  id: string;
  itemName: string;
  brand: string;
  category: string;
  subCategory: string;
  unit: string;
  revenue: number;
}

export interface SalesStat {
  id: string;
  label: string;
  value: string;
  icon: "bags" | "card" | "chart" | "wallet" | "coins";
}

export interface SalesPeriodData {
  stats: SalesStat[];
  items: SaleItem[];
}
