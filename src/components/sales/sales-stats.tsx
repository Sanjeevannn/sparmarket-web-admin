"use client";

import {
  ShoppingBag,
  CreditCard,
  TrendingUp,
  Wallet,
  Coins,
} from "lucide-react";
import type { SalesStat } from "@/types/sales";

const ICONS = {
  bags: ShoppingBag,
  card: CreditCard,
  chart: TrendingUp,
  wallet: Wallet,
  coins: Coins,
} as const;

const ICON_COLORS = {
  bags: "text-amber-500",
  card: "text-blue-500",
  chart: "text-emerald-500",
  wallet: "text-violet-500",
  coins: "text-orange-500",
} as const;

interface SalesStatsProps {
  stats: SalesStat[];
}

export function SalesStats({ stats }: SalesStatsProps) {
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
