"use client";

import {
  Check,
  Package,
  CreditCard,
  Truck,
  Clock,
  Calendar,
  User,
  Mail,
  ShoppingBag,
  MapPin,
  X,
  Download,
} from "lucide-react";
import Image from "next/image";
import type { OrderItem, OrderStepKey } from "@/types/order";
import {
  getOrderTypeLabel,
  getStepsForOrderType,
} from "@/lib/order-process";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

interface OrderDetailsModelProps {
  open: boolean;
  order: OrderItem | null;
  onOpenChange: (open: boolean) => void;
  onStepChange: (orderId: string, stepIndex: number) => void;
  onDelete: (order: OrderItem) => void;
}

function StepIcon({
  stepKey,
  active,
}: {
  stepKey: OrderStepKey;
  active: boolean;
}) {
  const className = cn("size-4", active ? "text-white" : "text-muted-foreground");
  if (stepKey === "ordered" || stepKey === "completed") {
    if (stepKey === "ordered" && active) {
      return <Check className={className} strokeWidth={2.5} />;
    }
    if (stepKey === "completed") {
      return <CreditCard className={className} strokeWidth={2} />;
    }
    return <Check className={className} strokeWidth={2.5} />;
  }
  if (stepKey === "out-for-delivery") {
    return <Truck className={className} strokeWidth={2} />;
  }
  return <Package className={className} strokeWidth={2} />;
}

function InfoRow({
  label,
  icon: Icon,
  value,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2 text-sm text-foreground">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span>{value}</span>
      </div>
    </div>
  );
}

export function OrderDetailsModel({
  open,
  order,
  onOpenChange,
  onStepChange,
  onDelete,
}: OrderDetailsModelProps) {
  if (!order) return null;

  const steps = getStepsForOrderType(order.orderType);
  const typeLabel = getOrderTypeLabel(order.orderType);
  const isOnline = order.orderType === "online";
  const isCod = order.orderType === "cod";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl p-6 sm:max-w-xl"
      >
        <DialogHeader className="mb-2 space-y-0">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-xl font-semibold">
              Order - {order.orderId}
            </DialogTitle>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                className="h-9 rounded-xl bg-[#49AE20] px-4 text-white hover:bg-[#3d941b]"
              >
                <Download className="size-4" />
                Download
              </Button>
              <button
                type="button"
                onClick={() => onDelete(order)}
                className="flex size-9 items-center justify-center rounded-lg border border-red-500 transition hover:bg-red-50"
                aria-label="Delete order"
              >
                <Image
                  src="/products/delete.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-[#49AE20] transition hover:opacity-70"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Process stepper */}
        <div className="flex items-start justify-between gap-1 px-1">
          {steps.map((step, index) => {
            const reached = index <= order.currentStep;
            const isCurrent = index === order.currentStep;
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => onStepChange(order.id, index)}
                className="relative flex flex-1 flex-col items-center gap-2"
              >
                {index < steps.length - 1 && (
                  <span
                    className={cn(
                      "absolute top-4 left-[calc(50%+16px)] h-0.5 w-[calc(100%-32px)]",
                      index < order.currentStep ? "bg-[#49AE20]" : "bg-border"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex size-8 items-center justify-center rounded-full border-2 transition",
                    reached
                      ? "border-[#49AE20] bg-[#49AE20]"
                      : "border-border bg-white"
                  )}
                >
                  <StepIcon stepKey={step.key} active={reached} />
                </span>
                <span
                  className={cn(
                    "text-center text-[11px] font-medium",
                    isCurrent || reached
                      ? "text-[#49AE20]"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Payment banner */}
        {isOnline && (
          <div className="flex items-center gap-2 rounded-full bg-[#49AE20] px-4 py-2.5 text-sm font-medium text-white">
            <Check className="size-4" strokeWidth={2.5} />
            Online payment
          </div>
        )}
        {isCod && (
          <div className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-sm font-medium text-white">
            <Check className="size-4" strokeWidth={2.5} />
            Cash on delivery
          </div>
        )}

        {/* Order QR — mobile app style */}
        <div className="mx-auto flex size-40 items-center justify-center rounded-xl bg-white p-3 ring-1 ring-border">
          <Image
            src="/orders/qr.png"
            alt="Order QR code"
            width={140}
            height={140}
            className="size-[140px] object-contain"
            priority
          />
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold">Order Information</h3>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#f3f4f6] px-4 py-4">
              <InfoRow label="Order time" icon={Clock} value={order.orderTime} />
              <InfoRow
                label="Order date"
                icon={Calendar}
                value={order.orderDate}
              />
              <InfoRow
                label="Customer name"
                icon={User}
                value={order.customerName}
              />
              <InfoRow label="Email address" icon={Mail} value={order.email} />
            </div>
            <div className="rounded-2xl bg-[#f3f4f6] px-4 py-4">
              <InfoRow
                label="Order type"
                icon={ShoppingBag}
                value={typeLabel}
              />
            </div>
            <div className="rounded-2xl bg-[#f3f4f6] px-4 py-4">
              <InfoRow
                label="Delivery Location"
                icon={MapPin}
                value={order.deliveryLocation}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold">Order Items</h3>
          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-[#f3f4f6] px-4 py-3"
              >
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {item.category}
                </p>
                <div className="mt-1 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.size}</p>
                  </div>
                  <p className="text-sm">
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                    {item.compareAtPrice != null && (
                      <span className="ml-1.5 text-xs text-muted-foreground line-through">
                        ${item.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm font-semibold">
                  <span>QTY: {item.qty}</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
