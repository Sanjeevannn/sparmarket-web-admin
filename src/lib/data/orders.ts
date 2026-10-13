import type {
  OrderPeriod,
  OrderPeriodData,
  OrderItem,
  OrderStat,
  OrderType,
} from "@/types/order";
import { statusFromStep } from "@/lib/order-process";

const ORDER_TYPES: OrderType[] = ["takeaway", "online", "cod"];

const DEFAULT_ITEMS = [
  {
    id: "li-1",
    category: "SUPERMARKET",
    name: "Sweet Melon",
    size: "80g",
    price: 5,
    compareAtPrice: 12,
    qty: 1,
  },
];

function makeOrders(
  prefix: string,
  count: number,
  amountBase: number
): OrderItem[] {
  return Array.from({ length: count }, (_, i) => {
    const orderType = ORDER_TYPES[i % ORDER_TYPES.length];
    const maxStep =
      orderType === "takeaway" ? 3 : 4;
    const currentStep = i % (maxStep + 1);
    return {
      id: `${prefix}-${i + 1}`,
      orderId: `Or ${1200 + i}`,
      customerName: "John Doe",
      initials: "JD",
      email: "example@gmail.com",
      phone: "0776621515",
      itemCount: DEFAULT_ITEMS.reduce((s, x) => s + x.qty, 0),
      amount: amountBase + (i % 4) * 10,
      orderType,
      currentStep,
      status: statusFromStep(orderType, currentStep),
      orderTime: "04:23:09PM",
      orderDate: "06/06/2026",
      deliveryLocation: "Jaffna town, st 123, North",
      items: DEFAULT_ITEMS.map((item) => ({ ...item, id: `${prefix}-li-${i}` })),
    };
  });
}

function makeStats(values: {
  totalOrders: string;
  packed: string;
  out: string;
  completed: string;
  customers: string;
  sold: string;
  today: string;
  weekly: string;
  monthly: string;
  total: string;
}): OrderStat[] {
  return [
    { id: "total-orders", label: "Total orders", value: values.totalOrders, icon: "cart" },
    { id: "packed", label: "Packed Orders", value: values.packed, icon: "package" },
    { id: "out", label: "Out for Delivery", value: values.out, icon: "truck" },
    { id: "completed", label: "Completed Orders", value: values.completed, icon: "check" },
    { id: "customers", label: "Total Customers", value: values.customers, icon: "users" },
    { id: "sold", label: "Product Sold", value: values.sold, icon: "bags" },
    { id: "today", label: "Today's Revenue", value: values.today, icon: "card" },
    { id: "weekly", label: "Weekly Revenue", value: values.weekly, icon: "chart" },
    { id: "monthly", label: "Monthly Revenue", value: values.monthly, icon: "wallet" },
    { id: "total", label: "Total Revenue", value: values.total, icon: "coins" },
  ];
}

export const ORDERS_BY_PERIOD: Record<OrderPeriod, OrderPeriodData> = {
  now: {
    stats: makeStats({
      totalOrders: "45",
      packed: "12",
      out: "8",
      completed: "25",
      customers: "45",
      sold: "1.234",
      today: "123,00 €",
      weekly: "456,00 €",
      monthly: "1.890,00 €",
      total: "12.340,00 €",
    }),
    orders: makeOrders("now", 30, 123),
  },
  weekly: {
    stats: makeStats({
      totalOrders: "210",
      packed: "40",
      out: "28",
      completed: "142",
      customers: "98",
      sold: "8.560",
      today: "890,00 €",
      weekly: "3.450,00 €",
      monthly: "9.200,00 €",
      total: "28.100,00 €",
    }),
    orders: makeOrders("week", 30, 210),
  },
  monthly: {
    stats: makeStats({
      totalOrders: "860",
      packed: "95",
      out: "70",
      completed: "695",
      customers: "320",
      sold: "32.100",
      today: "1.200,00 €",
      weekly: "8.900,00 €",
      monthly: "24.500,00 €",
      total: "96.400,00 €",
    }),
    orders: makeOrders("month", 30, 350),
  },
};
