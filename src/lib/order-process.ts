import type {
  OrderProcessStep,
  OrderStatus,
  OrderStepKey,
  OrderType,
} from "@/types/order";

/** Takeaway: 4 steps */
export const TAKEAWAY_STEPS: OrderProcessStep[] = [
  { key: "ordered", label: "Ordered" },
  { key: "preparing", label: "Preparing" },
  { key: "packed", label: "Packed" },
  { key: "completed", label: "Completed" },
];

/** Online cash pay delivery: 5 steps */
export const ONLINE_STEPS: OrderProcessStep[] = [
  { key: "ordered", label: "Ordered" },
  { key: "preparing", label: "Preparing" },
  { key: "packed", label: "Packed" },
  { key: "out-for-delivery", label: "Out for Delivery" },
  { key: "completed", label: "Completed" },
];

/** Cash on delivery: 5 steps (same flow as online delivery) */
export const COD_STEPS: OrderProcessStep[] = [
  { key: "ordered", label: "Ordered" },
  { key: "preparing", label: "Preparing" },
  { key: "packed", label: "Packed" },
  { key: "out-for-delivery", label: "Out for Delivery" },
  { key: "completed", label: "Completed" },
];

export function getStepsForOrderType(type: OrderType): OrderProcessStep[] {
  if (type === "takeaway") return TAKEAWAY_STEPS;
  if (type === "online") return ONLINE_STEPS;
  return COD_STEPS;
}

export function getOrderTypeLabel(type: OrderType): string {
  if (type === "takeaway") return "Takeaway";
  if (type === "online") return "Online cash pay Delivery";
  return "Cash on delivery";
}

/** Map process step → table status badge */
export function statusFromStep(
  type: OrderType,
  stepIndex: number
): OrderStatus {
  const steps = getStepsForOrderType(type);
  const key: OrderStepKey =
    steps[Math.min(stepIndex, steps.length - 1)]?.key ?? "ordered";

  if (key === "completed") return "completed";
  if (key === "out-for-delivery") return "out-for-delivery";
  if (key === "packed") return "ready";
  return "in-progress";
}

export function statusLabel(status: OrderStatus): string {
  if (status === "in-progress") return "In-Progress";
  if (status === "ready") return "Ready";
  if (status === "out-for-delivery") return "Out for Delivery";
  return "Completed";
}

export function statusBadgeClass(status: OrderStatus): string {
  if (status === "in-progress") {
    return "rounded-full bg-orange-500 px-2.5 text-white hover:bg-orange-500";
  }
  if (status === "ready") {
    return "rounded-full bg-amber-400 px-2.5 text-white hover:bg-amber-400";
  }
  if (status === "out-for-delivery") {
    return "rounded-full bg-blue-500 px-2.5 text-white hover:bg-blue-500";
  }
  return "rounded-full bg-[#49AE20] px-2.5 text-white hover:bg-[#49AE20]";
}
