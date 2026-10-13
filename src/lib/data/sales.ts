import type { SalesPeriod, SalesPeriodData, SaleItem } from "@/types/sales";

function makeItems(
  prefix: string,
  count: number,
  revenueBase: number
): SaleItem[] {
  const brands = ["Ambewela", "Anchor", "Highland", "Kotmale"];
  const categories = ["Drinks", "Food", "Dairy", "Snacks"];
  const subs = ["Coffee", "Milk", "Bakery", "Juice"];
  const units = ["Cup", "L", "Pack", "Bottle"];

  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    itemName: "Caramel Macchiato",
    brand: brands[i % brands.length],
    category: categories[i % categories.length],
    subCategory: subs[i % subs.length],
    unit: units[i % units.length],
    revenue: revenueBase + (i % 5) * 10,
  }));
}

export const SALES_BY_PERIOD: Record<SalesPeriod, SalesPeriodData> = {
  now: {
    stats: [
      { id: "sold", label: "Product Sold", value: "1.234", icon: "bags" },
      {
        id: "today",
        label: "Today's Revenue",
        value: "123,00 €",
        icon: "card",
      },
      {
        id: "weekly",
        label: "Weekly Revenue",
        value: "456,00 €",
        icon: "chart",
      },
      {
        id: "monthly",
        label: "Monthly Revenue",
        value: "1.890,00 €",
        icon: "wallet",
      },
      {
        id: "total",
        label: "Total Revenue",
        value: "12.340,00 €",
        icon: "coins",
      },
    ],
    items: makeItems("now", 30, 123),
  },
  weekly: {
    stats: [
      { id: "sold", label: "Product Sold", value: "8.560", icon: "bags" },
      {
        id: "today",
        label: "Today's Revenue",
        value: "890,00 €",
        icon: "card",
      },
      {
        id: "weekly",
        label: "Weekly Revenue",
        value: "3.450,00 €",
        icon: "chart",
      },
      {
        id: "monthly",
        label: "Monthly Revenue",
        value: "9.200,00 €",
        icon: "wallet",
      },
      {
        id: "total",
        label: "Total Revenue",
        value: "28.100,00 €",
        icon: "coins",
      },
    ],
    items: makeItems("week", 30, 210),
  },
  monthly: {
    stats: [
      { id: "sold", label: "Product Sold", value: "32.100", icon: "bags" },
      {
        id: "today",
        label: "Today's Revenue",
        value: "1.200,00 €",
        icon: "card",
      },
      {
        id: "weekly",
        label: "Weekly Revenue",
        value: "8.900,00 €",
        icon: "chart",
      },
      {
        id: "monthly",
        label: "Monthly Revenue",
        value: "24.500,00 €",
        icon: "wallet",
      },
      {
        id: "total",
        label: "Total Revenue",
        value: "96.400,00 €",
        icon: "coins",
      },
    ],
    items: makeItems("month", 30, 350),
  },
};

export const SALES_BRANDS = ["Ambewela", "Anchor", "Highland", "Kotmale"];
export const SALES_CATEGORIES = ["Drinks", "Food", "Dairy", "Snacks"];
export const SALES_SUB_CATEGORIES = ["Coffee", "Milk", "Bakery", "Juice"];
