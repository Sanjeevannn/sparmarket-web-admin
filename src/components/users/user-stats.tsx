"use client";

import { Store, Users, UserCog, UserRound } from "lucide-react";
import { USER_STATS } from "@/lib/data/users";

const stats = [
  {
    label: "Total Branch",
    value: USER_STATS.totalBranch,
    icon: Store,
    iconClass: "text-amber-500",
  },
  {
    label: "Total Users",
    value: USER_STATS.totalUsers,
    icon: Users,
    iconClass: "text-blue-500",
  },
  {
    label: "Admin",
    value: USER_STATS.admin,
    icon: UserCog,
    iconClass: "text-blue-500",
  },
  {
    label: "Cashier",
    value: USER_STATS.cashier,
    icon: UserRound,
    iconClass: "text-violet-500",
  },
];

export function UserStats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-2xl bg-[#eceef2] px-5 py-4"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Icon className={`size-7 ${item.iconClass}`} strokeWidth={2} />
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
