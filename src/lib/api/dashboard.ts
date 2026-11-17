import { apiRequest } from "@/lib/api/client";
import { formatEuroValue } from "@/lib/api/mappers";
import { fetchCustomers } from "@/lib/api/customers";
import { fetchOrders } from "@/lib/api/orders";
import { fetchSales, fetchSalesSummary } from "@/lib/api/sales";

export type DashboardCard = {
  id: string;
  label: string;
  value: string;
  icon:
    | "cart"
    | "package"
    | "truck"
    | "check"
    | "users"
    | "bags"
    | "card"
    | "chart"
    | "wallet"
    | "coins";
  href?: string;
};

interface OverviewResponse {
  success: boolean;
  data: {
    revenue?: number;
    discount?: number;
    sales?: number;
    orders?: number;
    customers?: number;
    products?: number;
    lowStock?: number;
    outOfStock?: number;
  };
}

interface OrdersStatsResponse {
  success: boolean;
  data: {
    total?: number;
    ready?: number;
    outForDelivery?: number;
    completed?: number;
    processing?: number;
    pending?: number;
    confirmed?: number;
  };
}

interface SalesSummaryShape {
  totalRevenue?: number;
  revenue?: number;
  total?: number;
  totalSales?: number;
  totalDiscount?: number;
}

function revenueOf(summary: SalesSummaryShape | Record<string, unknown>) {
  const s = summary as SalesSummaryShape;
  return Number(s.totalRevenue ?? s.revenue ?? s.total ?? 0);
}

function salesCountOf(summary: SalesSummaryShape | Record<string, unknown>) {
  const s = summary as SalesSummaryShape;
  return Number(s.totalSales ?? 0);
}

/** Build order status counts from the same list the Orders page uses. */
function countOrdersFromList(
  orders: Awaited<ReturnType<typeof fetchOrders>>
) {
  const counts = {
    total: orders.length,
    ready: 0,
    outForDelivery: 0,
    completed: 0,
  };
  for (const order of orders) {
    if (order.status === "ready") counts.ready += 1;
    else if (order.status === "out-for-delivery") counts.outForDelivery += 1;
    else if (order.status === "completed") counts.completed += 1;
  }
  return counts;
}

export async function fetchDashboardCards(): Promise<DashboardCard[]> {
  const [
    overview,
    todaySummary,
    weekSummary,
    monthSummary,
    orderStatsApi,
    orders,
    customers,
    monthSales,
  ] = await Promise.all([
    apiRequest<OverviewResponse>("/api/admin/dashboard/overview"),
    fetchSalesSummary("today"),
    fetchSalesSummary("week"),
    fetchSalesSummary("month"),
    apiRequest<OrdersStatsResponse>("/api/admin/dashboard/orders").catch(
      () => null
    ),
    fetchOrders().catch(() => []),
    fetchCustomers().catch(() => []),
    fetchSales("month").catch(() => []),
  ]);

  const listCounts = countOrdersFromList(orders);
  const apiCounts = orderStatsApi?.data;
  // Prefer live Orders-page list when available; fall back to dashboard aggregate.
  const orderCounts = {
    total: listCounts.total || apiCounts?.total || overview.data?.orders || 0,
    ready: listCounts.total ? listCounts.ready : apiCounts?.ready || 0,
    outForDelivery: listCounts.total
      ? listCounts.outForDelivery
      : apiCounts?.outForDelivery || 0,
    completed: listCounts.total
      ? listCounts.completed
      : apiCounts?.completed || 0,
  };

  const customerCount =
    customers.length || overview.data?.customers || 0;

  const productSold =
    salesCountOf(monthSummary) ||
    monthSales.length ||
    overview.data?.sales ||
    0;

  const todayRevenue = revenueOf(todaySummary);
  const weekRevenue = revenueOf(weekSummary);
  const monthRevenue = revenueOf(monthSummary);
  const totalRevenue = Number(overview.data?.revenue ?? monthRevenue ?? 0);

  return [
    {
      id: "total-orders",
      label: "Total orders",
      value: String(orderCounts.total),
      icon: "cart",
      href: "/orders",
    },
    {
      id: "packed",
      label: "Packed Orders",
      value: String(orderCounts.ready),
      icon: "package",
      href: "/orders",
    },
    {
      id: "out",
      label: "Out for Delivery",
      value: String(orderCounts.outForDelivery),
      icon: "truck",
      href: "/orders",
    },
    {
      id: "completed",
      label: "Completed Orders",
      value: String(orderCounts.completed),
      icon: "check",
      href: "/orders",
    },
    {
      id: "customers",
      label: "Total Customers",
      value: String(customerCount),
      icon: "users",
      href: "/customers",
    },
    {
      id: "sold",
      label: "Product Sold",
      value: String(productSold),
      icon: "bags",
      href: "/sales",
    },
    {
      id: "today",
      label: "Today's Revenue",
      value: formatEuroValue(todayRevenue),
      icon: "card",
      href: "/sales",
    },
    {
      id: "weekly",
      label: "Weekly Revenue",
      value: formatEuroValue(weekRevenue),
      icon: "chart",
      href: "/sales",
    },
    {
      id: "monthly",
      label: "Monthly Revenue",
      value: formatEuroValue(monthRevenue),
      icon: "wallet",
      href: "/sales",
    },
    {
      id: "total",
      label: "Total Revenue",
      value: formatEuroValue(totalRevenue),
      icon: "coins",
      href: "/sales",
    },
  ];
}
