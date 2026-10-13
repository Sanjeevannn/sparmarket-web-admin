export type OfferKind = "single" | "combo";

export interface ComboOfferProduct {
  productId: string;
  title: string;
  brand: string;
  volume: string;
  image: string;
  price: number;
  quantity: number;
  offerPrice: number;
}

export interface OfferItem {
  id: string;
  kind: OfferKind;
  title: string;
  brand?: string;
  volume?: string;
  description?: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  validityFrom: string;
  validityTo: string;
  status: "active" | "inactive";
  soldOut?: boolean;
  category: string;
  subCategory?: string;
  products?: ComboOfferProduct[];
}

export interface SingleOfferLine {
  productId: string;
  title: string;
  brand: string;
  volume: string;
  image: string;
  category: string;
  subCategory: string;
  description: string;
  compareAtPrice: number;
  price: number;
}

export interface SingleOfferFormResult {
  validityFrom: string;
  validityTo: string;
  line: SingleOfferLine;
}

export interface ComboOfferFormResult {
  title: string;
  description: string;
  image: string;
  validityFrom: string;
  validityTo: string;
  category: string;
  products: ComboOfferProduct[];
  price: number;
}
