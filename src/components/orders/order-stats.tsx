"use client";

import {
  ShoppingCart,
  Package,
  Truck,
  CircleCheck,
  Users,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  Wallet,
  Coins,
} from "lucide-react";
import type { OrderStat } from "@/types/order";

const ICONS = {
  cart: ShoppingCart,
  package: Package,
  truck: Truck,
  check: CircleCheck,
  users: Users,
  bags: ShoppingBag,
  card: CreditCard,
  chart: TrendingUp,
  wallet: Wallet,
  coins: Coins,
} as const;

const ICON_COLORS = {
  cart: "text-blue-500",
  package: "text-amber-500",
  truck: "text-orange-500",
  check: "text-[#49AE20]",
  users: "text-blue-500",
  bags: "text-amber-500",
  card: "text-blue-500",
  chart: "text-emerald-500",
  wallet: "text-violet-500",
  coins: "text-orange-500",
} as const;

interface OrderStatsProps {
  stats: OrderStat[];
}

export function OrderStats({ stats }: OrderStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <div
            key={item.id}
            className="rounded-2xl bg-[#eceef2] px-5 py-4"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Icon
              className={`size-7 ${ICON_COLORS[item.icon]}`}
              strokeWidth={2}
            />
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
