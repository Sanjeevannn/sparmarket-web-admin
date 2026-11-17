import { apiRequest } from "@/lib/api/client";

export interface BrandOption {
  id: string;
  name: string;
  isActive?: boolean;
}

interface BrandsResponse {
  success: boolean;
  brands: Record<string, unknown>[];
}

interface BrandResponse {
  success: boolean;
  brand: Record<string, unknown>;
  message?: string;
}

function mapBrand(b: Record<string, unknown>): BrandOption {
  return {
    id: String(b._id || b.id || ""),
    name: String(b.name || ""),
    isActive: b.isActive !== false,
  };
}

export async function fetchBrands(): Promise<BrandOption[]> {
  const data = await apiRequest<BrandsResponse>("/api/admin/brands/");
  return (data.brands || []).map(mapBrand);
}

export async function createBrandApi(name: string): Promise<BrandOption> {
  const data = await apiRequest<BrandResponse>("/api/admin/brands/", {
    method: "POST",
    body: { name },
  });
  return mapBrand(data.brand);
}

export async function updateBrandApi(
  brandId: string,
  name: string
): Promise<BrandOption> {
  const data = await apiRequest<BrandResponse>(`/api/admin/brands/${brandId}`, {
    method: "PUT",
    body: { name },
  });
  return mapBrand(data.brand);
}

export async function deleteBrandApi(brandId: string): Promise<void> {
  await apiRequest(`/api/admin/brands/${brandId}`, { method: "DELETE" });
}
