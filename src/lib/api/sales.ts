import { apiRequest } from "@/lib/api/client";
import { formatEuroValue } from "@/lib/api/mappers";

export type SalesPeriodApi = "today" | "week" | "month";

interface SalesListResponse {
  success: boolean;
  sales?: Record<string, unknown>[];
  data?: Record<string, unknown>[];
  docs?: Record<string, unknown>[];
}

interface SummaryResponse {
  success: boolean;
  summary?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export function mapUiPeriodToApi(
  period: "now" | "weekly" | "monthly"
): SalesPeriodApi {
  if (period === "weekly") return "week";
  if (period === "monthly") return "month";
  return "today";
}

export async function fetchSales(period: SalesPeriodApi) {
  const data = await apiRequest<SalesListResponse>(
    `/api/admin/sales/?period=${period}&limit=100`
  );
  return data.sales || data.data || data.docs || [];
}

export async function fetchSalesSummary(period: SalesPeriodApi) {
  const data = await apiRequest<SummaryResponse>(
    `/api/admin/sales/summary?period=${period}`
  );
  return data.summary || data.data || {};
}

export function mapSaleRow(raw: Record<string, unknown>) {
  const items = Array.isArray(raw.items) ? raw.items : [];
  const first = (items[0] || {}) as Record<string, unknown>;
  const product = (first.product || {}) as Record<string, unknown>;

  return {
    id: String(raw._id || raw.id || ""),
    itemName: String(product.name || first.name || "Sale item"),
    brand: String(product.brand || first.brand || "—"),
    category: String(
      (product.category as { name?: string })?.name ||
        first.category ||
        "—"
    ),
    subCategory: String(
      (product.subCategory as { name?: string })?.name ||
        first.subCategory ||
        "—"
    ),
    unit: String(product.unit || first.unit || "pcs"),
    revenue: Number(raw.total ?? first.price ?? 0),
  };
}
