import { apiRequest } from "@/lib/api/client";
import { mapApiCustomer } from "@/lib/api/mappers";
import type { Customer } from "@/types/customer";

interface CustomersResponse {
  success: boolean;
  customers?: Record<string, unknown>[];
  data?: Record<string, unknown>[];
}

interface ClosureResponse {
  success: boolean;
  reasons?: { reason: string; count: number }[];
  data?: { reason: string; count: number }[];
}

function listFrom(data: CustomersResponse) {
  return data.customers || data.data || [];
}

export async function fetchCustomers(): Promise<Customer[]> {
  const data = await apiRequest<CustomersResponse>(
    "/api/admin/customers/?limit=100"
  );
  return listFrom(data).map((c) => mapApiCustomer(c));
}

export async function fetchClosureReasons() {
  const data = await apiRequest<ClosureResponse>(
    "/api/admin/customers/closure-reasons"
  );
  return data.reasons || data.data || [];
}
