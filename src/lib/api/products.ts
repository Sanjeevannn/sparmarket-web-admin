import { apiRequest } from "@/lib/api/client";
import { mapApiProduct } from "@/lib/api/mappers";
import { uploadDataUrl } from "@/lib/api/media";
import type { Product, ProductFormValues } from "@/types/product";

interface ProductsResponse {
  success: boolean;
  products: Record<string, unknown>[];
}

interface ProductResponse {
  success: boolean;
  product: Record<string, unknown>;
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await apiRequest<ProductsResponse>("/api/admin/products/");
  return Promise.all((data.products || []).map((p) => mapApiProduct(p)));
}

export async function createProductApi(
  values: ProductFormValues,
  categoryId: string,
  subCategoryId?: string
) {
  let imageId: string | undefined;
  if (values.image?.startsWith("data:")) {
    const uploaded = await uploadDataUrl(values.image, "product-images");
    imageId = uploaded.media.id;
  }

  const body: Record<string, unknown> = {
    name: values.name.trim(),
    brand: values.brand,
    description: values.description.trim(),
    category: categoryId,
    subCategory: subCategoryId || null,
    hasVariants: false,
    price: Number(values.price) || 0,
    stock: Number(values.amount) || 0,
    unit: values.unit || "pcs",
  };
  if (imageId) body.imageId = imageId;

  const data = await apiRequest<ProductResponse>("/api/admin/products/", {
    method: "POST",
    body,
  });
  return mapApiProduct(data.product);
}

export async function updateProductApi(
  productId: string,
  values: ProductFormValues,
  categoryId: string,
  subCategoryId?: string,
  existingImageId?: string | null
) {
  let imageId = existingImageId || undefined;
  if (values.image?.startsWith("data:")) {
    const uploaded = await uploadDataUrl(values.image, "product-images");
    imageId = uploaded.media.id;
  }

  const body: Record<string, unknown> = {
    name: values.name.trim(),
    brand: values.brand,
    description: values.description.trim(),
    category: categoryId,
    subCategory: subCategoryId || null,
    price: Number(values.price) || 0,
    stock: Number(values.amount) || 0,
    unit: values.unit || "pcs",
  };
  if (imageId) body.imageId = imageId;

  const data = await apiRequest<ProductResponse>(
    `/api/admin/products/${productId}`,
    { method: "PUT", body }
  );
  return mapApiProduct(data.product);
}

export async function deleteProductApi(productId: string) {
  await apiRequest(`/api/admin/products/${productId}`, { method: "DELETE" });
}

export async function updateProductStatusApi(
  productId: string,
  isActive: boolean
) {
  const data = await apiRequest<ProductResponse>(
    `/api/admin/products/${productId}`,
    { method: "PUT", body: { isActive } }
  );
  return mapApiProduct(data.product);
}
