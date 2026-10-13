"use client";

import {
  Bell,
  User,
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
import { DASHBOARD_STATS } from "@/lib/data/dashboard";

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
  package: "text-amber-600",
  truck: "text-orange-500",
  check: "text-[#49AE20]",
  users: "text-blue-500",
  bags: "text-pink-500",
  card: "text-sky-500",
  chart: "text-red-500",
  wallet: "text-red-500",
  coins: "text-amber-700",
} as const;

export function DashboardView() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 items-center justify-between gap-4 rounded-full bg-[#eceef2] px-5 py-2.5">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/70 hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={1.75} />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-spar-red" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="flex size-8 items-center justify-center rounded-full bg-white text-muted-foreground">
              <User className="size-4" strokeWidth={1.75} />
            </span>
            Admin
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {DASHBOARD_STATS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#eceef2] px-5 py-5"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <Icon
                  className={`size-8 ${ICON_COLORS[item.icon]}`}
                  strokeWidth={2}
                />
                <p className="text-2xl font-bold leading-none text-foreground">
                  {item.value}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
