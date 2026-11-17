import { apiRequest } from "@/lib/api/client";

export interface CategoryOption {
  id: string;
  name: string;
  parentId: string | null;
}

interface CategoriesResponse {
  success: boolean;
  categories: Record<string, unknown>[];
}

function idOf(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;
  const obj = value as { _id?: string; id?: string };
  return String(obj.id || obj._id || "");
}

interface CategoryResponse {
  success: boolean;
  category: Record<string, unknown>;
  message?: string;
}

function mapCategory(c: Record<string, unknown>): CategoryOption {
  return {
    id: idOf(c._id || c.id),
    name: String(c.name || ""),
    parentId: c.parentCategory ? idOf(c.parentCategory) : null,
  };
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  const data = await apiRequest<CategoriesResponse>("/api/admin/categories/");
  return (data.categories || []).map(mapCategory);
}

export async function createCategoryApi(payload: {
  name: string;
  parentCategory?: string | null;
}): Promise<CategoryOption> {
  const data = await apiRequest<CategoryResponse>("/api/admin/categories/", {
    method: "POST",
    body: {
      name: payload.name,
      parentCategory: payload.parentCategory || null,
    },
  });
  return mapCategory(data.category);
}

export async function updateCategoryApi(
  categoryId: string,
  payload: {
    name: string;
    parentCategory?: string | null;
  }
): Promise<CategoryOption> {
  const data = await apiRequest<CategoryResponse>(
    `/api/admin/categories/${categoryId}`,
    {
      method: "PUT",
      body: {
        name: payload.name,
        parentCategory:
          payload.parentCategory === undefined
            ? undefined
            : payload.parentCategory || null,
      },
    }
  );
  return mapCategory(data.category);
}

export async function deleteCategoryApi(categoryId: string): Promise<void> {
  await apiRequest(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
}

export function mainCategories(categories: CategoryOption[]) {
  return categories.filter((c) => !c.parentId);
}

export function subCategoriesOf(
  categories: CategoryOption[],
  parentId: string
) {
  return categories.filter((c) => c.parentId === parentId);
}
