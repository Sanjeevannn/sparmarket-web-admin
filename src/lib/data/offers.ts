import type { ComboOfferProduct, OfferItem } from "@/types/offer";

export const OFFER_CATEGORIES = ["Milk", "Dairy", "Beverages", "Bakery", "Snacks"];

export const SINGLE_OFFERS: OfferItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `single-${i + 1}`,
  kind: "single",
  title: "Fresh Milk",
  brand: "AMBEWELA",
  volume: "1l",
  image: "/products/product.png",
  price: 12,
  compareAtPrice: 12,
  validityFrom: i % 3 === 0 ? "12/02/2026" : "20/09/2026",
  validityTo: i % 3 === 0 ? "20/02/2026" : "30/10/2026",
  status: i === 4 ? "inactive" : "active",
  category: "Milk",
  subCategory: "Dairy",
  description:
    "Start your day with creamy Ambewela milk — fresh, pure, and perfect for everyday use.",
}));

const COMBO_PRODUCTS: ComboOfferProduct[] = [
  {
    productId: "prod-1",
    title: "Fresh Milk",
    brand: "AMBEWELA",
    volume: "1l",
    image: "/products/product.png",
    price: 12,
    quantity: 2,
    offerPrice: 2.2,
  },
  {
    productId: "prod-2",
    title: "Fresh Milk",
    brand: "AMBEWELA",
    volume: "1l",
    image: "/products/product.png",
    price: 12,
    quantity: 2,
    offerPrice: 2.2,
  },
  {
    productId: "prod-3",
    title: "Fresh Milk",
    brand: "AMBEWELA",
    volume: "1l",
    image: "/products/product.png",
    price: 12,
    quantity: 2,
    offerPrice: 2.2,
  },
  {
    productId: "prod-4",
    title: "Fresh Milk",
    brand: "AMBEWELA",
    volume: "1l",
    image: "/products/product.png",
    price: 12,
    quantity: 2,
    offerPrice: 2.2,
  },
];

export const COMBO_OFFERS: OfferItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: `combo-${i + 1}`,
  kind: "combo",
  title: "Summer Offer",
  description:
    "Kaffe Krümel is a cozy café offering freshly brewed coffee, handcrafted beverages, delicious pastries, and light meals in a warm and welcoming atmosphere.",
  image: "/offer/combo.png",
  price: 1.2,
  compareAtPrice: 12,
  validityFrom: i % 4 === 0 ? "01/01/2026" : "18/09/2026",
  validityTo: i % 4 === 0 ? "31/01/2026" : "31/12/2026",
  status: "active",
  soldOut: i === 2 || i === 5,
  category: "Bakery",
  products: COMBO_PRODUCTS,
}));
