"use client";

import { X } from "lucide-react";
import type { ClosureReason } from "@/types/customer";
import { cn } from "cn";

interface ClosureAnalysisProps {
  reasons: ClosureReason[];
}

export function ClosureAnalysis({ reasons }: ClosureAnalysisProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {reasons.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
            <X className="size-5 text-red-500" strokeWidth={2.5} />
          </span>
          <p
            className={cn(
              "min-w-0 flex-1 text-sm",
              item.isOther
                ? "font-semibold text-red-500"
                : "text-muted-foreground"
            )}
          >
            {item.isOther ? `Other: ${item.reason}` : item.reason}
          </p>
          <p className="shrink-0 text-sm font-semibold text-foreground">
            {String(item.count).padStart(2, "0")} Customer
            {item.count === 1 ? "" : "s"}
          </p>
        </div>
      ))}
    </div>
  );
}
