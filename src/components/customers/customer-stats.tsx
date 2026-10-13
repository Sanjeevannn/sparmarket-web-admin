"use client";

import { Users, UserPlus, X } from "lucide-react";
import { CUSTOMER_STATS } from "@/lib/data/customers";

const stats = [
  {
    label: "Total Customers",
    value: CUSTOMER_STATS.total,
    icon: Users,
    iconClass: "text-blue-500",
  },
  {
    label: "Total New Customers",
    value: CUSTOMER_STATS.newCustomers,
    icon: UserPlus,
    iconClass: "text-blue-500",
  },
  {
    label: "Account Deleted",
    value: CUSTOMER_STATS.accountDeleted,
    icon: X,
    iconClass: "text-red-500",
  },
];

export function CustomerStats() {
  return (
    <div className="grid grid-cols-3 gap-3">
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
            {/* 1. Logo */}
            <Icon className={`size-7 ${item.iconClass}`} strokeWidth={2} />
            {/* 2. Value */}
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            {/* 3. Label */}
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
