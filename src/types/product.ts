export type ProductStatus = "active" | "inactive";

export interface Product {
  id: string;
  brand: string;
  name: string;
  amount: string;
  unit: string;
  volume: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  subCategory: string;
  description: string;
  status: ProductStatus;
}

export interface ProductFormValues {
  brand: string;
  category: string;
  subCategory: string;
  name: string;
  amount: string;
  unit: string;
  price: string;
  description: string;
  image: string;
}
