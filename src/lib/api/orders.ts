import { apiRequest } from "@/lib/api/client";
import { mapApiOrder, toBackendOrderStatus } from "@/lib/api/mappers";
import type { OrderItem, OrderStatus } from "@/types/order";

interface OrdersResponse {
  success: boolean;
  orders: Record<string, unknown>[];
}

interface OrderResponse {
  success: boolean;
  order: Record<string, unknown>;
}

export async function fetchOrders(status?: string): Promise<OrderItem[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const data = await apiRequest<OrdersResponse>(`/api/admin/orders/${qs}`);
  return (data.orders || []).map((o) => mapApiOrder(o));
}

export async function updateOrderStatusApi(
  orderId: string,
  status: OrderStatus
) {
  const data = await apiRequest<OrderResponse>(
    `/api/admin/orders/${orderId}/status`,
    {
      method: "PATCH",
      body: { status: toBackendOrderStatus(status) },
    }
  );
  return mapApiOrder(data.order);
}

export async function deleteOrderApi(orderId: string) {
  await apiRequest(`/api/admin/orders/${orderId}`, { method: "DELETE" });
}

export async function exportOrdersCsv() {
  // Browser download via authenticated fetch is handled in view if needed
  const data = await apiRequest<BlobPart>("/api/admin/orders/export");
  return data;
}
