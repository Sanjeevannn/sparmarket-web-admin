export type OrderPeriod = "now" | "weekly" | "monthly";

/** Customer-chosen order fulfillment type */
export type OrderType = "takeaway" | "online" | "cod";

/** Table status derived from current process step */
export type OrderStatus =
  | "in-progress"
  | "ready"
  | "out-for-delivery"
  | "completed";

export type OrderStepKey =
  | "ordered"
  | "preparing"
  | "packed"
  | "out-for-delivery"
  | "completed";

export interface OrderLineItem {
  id: string;
  category: string;
  name: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  qty: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  customerName: string;
  initials: string;
  email: string;
  phone?: string;
  itemCount: number;
  amount: number;
  orderType: OrderType;
  /** 0-based index into the process steps for this order type */
  currentStep: number;
  status: OrderStatus;
  orderTime: string;
  orderDate: string;
  deliveryLocation: string;
  items: OrderLineItem[];
}

export interface OrderStat {
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
}

export interface OrderPeriodData {
  stats: OrderStat[];
  orders: OrderItem[];
}

export interface OrderProcessStep {
  key: OrderStepKey;
  label: string;
}
