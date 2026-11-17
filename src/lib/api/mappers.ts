import type { Product } from "@/types/product";
import type { OfferItem, ComboOfferProduct } from "@/types/offer";
import type { AppUser, UserRole, UserStatus } from "@/types/user";
import type { Customer } from "@/types/customer";
import type { OrderItem, OrderStatus, OrderType } from "@/types/order";
import { extractMediaId, getMediaUrl } from "@/lib/api/media";

function idOf(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as { _id?: string; id?: string };
    return String(obj.id || obj._id || "");
  }
  return String(value);
}

function nameOf(value: unknown, fallback = ""): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as { name?: string };
    return obj.name || fallback;
  }
  return fallback;
}

function formatDisplayDate(value?: string | Date | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

async function resolveImage(media: unknown, fallback: string) {
  const mediaId = extractMediaId(media);
  if (!mediaId) return fallback;
  try {
    return await getMediaUrl(mediaId);
  } catch {
    return fallback;
  }
}

export async function mapApiProduct(raw: Record<string, unknown>): Promise<Product & {
  categoryId?: string;
  subCategoryId?: string;
  imageId?: string | null;
}> {
  const unit = String(raw.unit || "pcs");
  const imageId = extractMediaId(raw.image);
  const image = await resolveImage(raw.image, "/products/product.png");

  return {
    id: idOf(raw._id || raw.id),
    brand: String(raw.brand || ""),
    name: String(raw.name || ""),
    amount: "1",
    unit,
    volume: unit,
    price: Number(raw.price ?? 0),
    compareAtPrice:
      raw.compareAtPrice != null ? Number(raw.compareAtPrice) : undefined,
    image,
    category: nameOf(raw.category, "Uncategorized"),
    subCategory: nameOf(raw.subCategory, ""),
    description: String(raw.description || ""),
    status: raw.isActive === false ? "inactive" : "active",
    categoryId: idOf(raw.category) || undefined,
    subCategoryId: idOf(raw.subCategory) || undefined,
    imageId,
  };
}

export async function mapApiOffer(raw: Record<string, unknown>): Promise<OfferItem> {
  const type = String(raw.type || "SINGLE").toUpperCase();
  const kind = type === "COMBO" ? "combo" : "single";
  const image = await resolveImage(
    raw.image,
    kind === "combo" ? "/offer/combo.png" : "/products/product.png"
  );

  const items = Array.isArray(raw.items) ? raw.items : [];
  const products: ComboOfferProduct[] = items.map((item) => {
    const row = item as Record<string, unknown>;
    const product = (row.product || {}) as Record<string, unknown>;
    return {
      productId: idOf(product._id || product.id || row.product),
      title: String(product.name || "Product"),
      brand: String(product.brand || ""),
      volume: String(product.unit || ""),
      image: "/products/product.png",
      price: Number(product.price ?? row.price ?? 0),
      quantity: 1,
      offerPrice: Number(row.price ?? 0),
    };
  });

  const first = products[0];
  const price =
    products.reduce((sum, p) => sum + p.offerPrice, 0) ||
    Number(first?.offerPrice ?? 0);

  return {
    id: idOf(raw._id || raw.id),
    kind,
    title: String(raw.name || "Offer"),
    brand: first?.brand,
    volume: first?.volume,
    description: String(raw.description || ""),
    image,
    price,
    compareAtPrice: first?.price,
    validityFrom: formatDisplayDate(raw.startDate as string),
    validityTo: formatDisplayDate(raw.endDate as string),
    status: raw.isActive === false ? "inactive" : "active",
    category: kind === "combo" ? "Bakery" : "Milk",
    subCategory: kind === "combo" ? undefined : "Dairy",
    products: kind === "combo" ? products : undefined,
  };
}

function mapRole(role?: string): UserRole {
  const r = (role || "").toUpperCase();
  if (r === "ADMIN") return "admin";
  return "cashier";
}

export function mapApiUser(raw: Record<string, unknown>): AppUser {
  return {
    id: idOf(raw._id || raw.id),
    username: String(raw.username || raw.email || ""),
    manager: String(raw.managerName || raw.fullName || ""),
    createdAt: formatDisplayDate(raw.createdAt as string) || "—",
    status: (raw.isActive === false ? "inactive" : "active") as UserStatus,
    role: mapRole(raw.role as string),
  };
}

export function mapApiCustomer(raw: Record<string, unknown>): Customer {
  const closed = raw.isActive === false;
  const name = String(raw.fullName || raw.name || "Customer");
  const parts = name.trim().split(/\s+/);
  const initials = `${parts[0]?.[0] || "C"}${parts[1]?.[0] || ""}`.toUpperCase();

  return {
    id: idOf(raw._id || raw.id),
    name,
    email: String(raw.email || ""),
    phone: String(raw.phoneNumber || raw.phone || ""),
    orders: Number(
      raw.totalOrders ?? raw.ordersCount ?? raw.orderCount ?? 0
    ),
    spend: Number(
      raw.totalSpent ?? raw.spent ?? raw.totalSpend ?? 0
    ),
    status: closed ? "closed" : "active",
    initials,
    gender: raw.gender ? String(raw.gender) : undefined,
    accountCreated: formatDisplayDate(raw.createdAt as string) || "—",
    dateOfBirth: formatDisplayDate(raw.dateOfBirth as string) || "—",
    closureReason: closed
      ? String(
          (raw.accountDeletionReason as { reason?: string })?.reason ||
            raw.closureReason ||
            ""
        ) || undefined
      : undefined,
  };
}

const ORDER_STATUS_MAP: Record<string, OrderStatus> = {
  PENDING: "in-progress",
  CONFIRMED: "in-progress",
  PROCESSING: "in-progress",
  READY: "ready",
  OUT_FOR_DELIVERY: "out-for-delivery",
  COMPLETED: "completed",
  CANCELLED: "completed",
};

const ORDER_TYPE_MAP: Record<string, OrderType> = {
  TAKEAWAY: "takeaway",
  DELIVERY: "online",
};

export function mapApiOrder(raw: Record<string, unknown>): OrderItem {
  const customer = (raw.customer || {}) as Record<string, unknown>;
  const items = Array.isArray(raw.items) ? raw.items : [];
  const fulfillment = String(raw.fulfillmentType || "TAKEAWAY").toUpperCase();
  const payment = String(raw.paymentMethod || "").toUpperCase();
  let orderType: OrderType = ORDER_TYPE_MAP[fulfillment] || "takeaway";
  if (payment === "CASH" && fulfillment === "DELIVERY") orderType = "cod";

  const backendStatus = String(raw.status || "PENDING").toUpperCase();
  const status = ORDER_STATUS_MAP[backendStatus] || "in-progress";
  const customerName = String(customer.fullName || customer.name || "Customer");
  const parts = customerName.trim().split(/\s+/);
  const initials = `${parts[0]?.[0] || "C"}${parts[1]?.[0] || ""}`.toUpperCase();

  const mappedItems = items.map((item, index) => {
    const row = item as Record<string, unknown>;
    const product = (row.product || {}) as Record<string, unknown>;
    return {
      id: idOf(row._id || row.id || product._id) || `line-${index}`,
      category: nameOf(product.category, "PRODUCT"),
      name: String(product.name || row.name || "Item"),
      size: String(product.unit || row.unit || ""),
      price: Number(row.price ?? product.price ?? 0),
      compareAtPrice:
        product.compareAtPrice != null
          ? Number(product.compareAtPrice)
          : undefined,
      qty: Number(row.quantity ?? 1),
    };
  });

  const created = raw.createdAt ? new Date(String(raw.createdAt)) : null;
  const orderTime =
    created && !Number.isNaN(created.getTime())
      ? created.toLocaleTimeString("en-US")
      : "—";
  const orderDate =
    created && !Number.isNaN(created.getTime())
      ? formatDisplayDate(created)
      : "—";

  const stepFromStatus: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    PROCESSING: 1,
    READY: 2,
    OUT_FOR_DELIVERY: orderType === "takeaway" ? 2 : 3,
    COMPLETED: orderType === "takeaway" ? 3 : 4,
    CANCELLED: 0,
  };

  return {
    id: idOf(raw._id || raw.id),
    orderId: String(raw.orderNumber || raw._id || ""),
    customerName,
    initials,
    email: String(customer.email || ""),
    phone: String(customer.phoneNumber || ""),
    itemCount: mappedItems.reduce((sum, item) => sum + item.qty, 0),
    amount: Number(raw.total ?? raw.grandTotal ?? 0),
    orderType,
    currentStep: stepFromStatus[backendStatus] ?? 0,
    status,
    orderTime,
    orderDate,
    deliveryLocation: String(
      (raw.deliveryAddress as { addressLine?: string })?.addressLine ||
        raw.deliveryLocation ||
        "—"
    ),
    items: mappedItems,
  };
}

export function toBackendOrderStatus(status: OrderStatus): string {
  switch (status) {
    case "ready":
      return "READY";
    case "out-for-delivery":
      return "OUT_FOR_DELIVERY";
    case "completed":
      return "COMPLETED";
    default:
      return "PROCESSING";
  }
}

export function formatEuroValue(value: number) {
  return `${Number(value || 0).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}
