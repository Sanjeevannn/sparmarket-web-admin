import type { Product } from "@/types/product";

export const UNITS = ["L", "ml", "kg", "g"];

export const BRANDS = ["Ambewela", "Anchor", "Highland", "Kotmale"];
export const CATEGORIES = ["Milk", "Yogurt", "Cheese", "Butter"];
export const SUB_CATEGORIES = ["Dairy", "Beverages", "Snacks", "Grocery"];
export const STATUSES = ["Active", "Inactive"];

export const PRODUCTS: Product[] = Array.from({ length: 32 }, (_, i) => ({
  id: `prod-${i + 1}`,
  brand: "Ambewela",
  name: "Fresh Milk",
  amount: "1",
  unit: "L",
  volume: "1l",
  price: 12,
  compareAtPrice: 12,
  image: "/products/product.png",
  category: "Milk",
  subCategory: "Dairy",
  description:
    "Start your day with our fresh bakery & tea combo — creamy Ambewela milk for everyday freshness.",
  status: i === 4 || i === 17 ? "inactive" : "active",
}));
