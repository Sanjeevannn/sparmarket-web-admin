"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  User,
} from "lucide-react";
import type { OrderItem, OrderPeriod } from "@/types/order";
import { ORDERS_BY_PERIOD } from "@/lib/data/orders";
import { statusFromStep } from "@/lib/order-process";
import { OrderStats } from "@/components/orders/order-stats";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrderDetailsModel } from "@/components/Models/order-details-model";
import { DeleteConfirmDialog } from "@/components/Dialogs/delete-confirm-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";

const PAGE_SIZE = 10;

const PERIOD_TABS: { key: OrderPeriod; label: string }[] = [
  { key: "now", label: "Now" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

function clonePeriodOrders(): Record<OrderPeriod, OrderItem[]> {
  return {
    now: ORDERS_BY_PERIOD.now.orders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({ ...i })),
    })),
    weekly: ORDERS_BY_PERIOD.weekly.orders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({ ...i })),
    })),
    monthly: ORDERS_BY_PERIOD.monthly.orders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({ ...i })),
    })),
  };
}

export function OrdersView() {
  const [period, setPeriod] = useState<OrderPeriod>("now");
  const [ordersByPeriod, setOrdersByPeriod] = useState(clonePeriodOrders);
  const [headerSearch, setHeaderSearch] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("2025-04-12");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<OrderItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OrderItem | null>(null);

  const orders = ordersByPeriod[period];
  const stats = ORDERS_BY_PERIOD[period].stats;

  // Keep selected order in sync when list updates
  useEffect(() => {
    if (!selected) return;
    const updated = orders.find((o) => o.id === selected.id) ?? null;
    setSelected(updated);
  }, [orders, selected?.id]);

  const filtered = useMemo(() => {
    const q = `${headerSearch} ${tableSearch}`.trim().toLowerCase();
    return orders.filter((order) => {
      if (q) {
        const hay =
          `${order.orderId} ${order.customerName} ${order.email} ${order.orderType}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (status && status !== "all" && order.status !== status) return false;
      return true;
    });
  }, [orders, headerSearch, tableSearch, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const showingFrom = filtered.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PAGE_SIZE, filtered.length);

  function changePeriod(next: OrderPeriod) {
    setPeriod(next);
    setPage(1);
    setDetailsOpen(false);
  }

  function updateOrder(
    orderId: string,
    updater: (order: OrderItem) => OrderItem
  ) {
    setOrdersByPeriod((prev) => ({
      ...prev,
      [period]: prev[period].map((o) => (o.id === orderId ? updater(o) : o)),
    }));
  }

  function handleStepChange(orderId: string, stepIndex: number) {
    updateOrder(orderId, (o) => ({
      ...o,
      currentStep: stepIndex,
      status: statusFromStep(o.orderType, stepIndex),
    }));
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setOrdersByPeriod((prev) => ({
      ...prev,
      [period]: prev[period].filter((o) => o.id !== deleteTarget.id),
    }));
    setDetailsOpen(false);
    setSelected(null);
    setDeleteTarget(null);
  }

  const displayDate = date
    ? (() => {
        const [y, m, d] = date.split("-");
        return `${d}/${m}/${y}`;
      })()
    : "Select date";

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-4 rounded-full bg-[#eceef2] px-5 py-2.5">
          <h1 className="min-w-0 shrink text-lg font-semibold tracking-tight text-foreground">
            Order management
          </h1>

          <div className="relative mx-auto w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              value={headerSearch}
              onChange={(e) => {
                setHeaderSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-full border-0 bg-white pl-9 shadow-none focus-visible:ring-spar-green/20"
            />
          </div>

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

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-full bg-[#eceef2] px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {PERIOD_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => changePeriod(tab.key)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition",
                  period === tab.key
                    ? "bg-[#d8efe3] text-[#49AE20]"
                    : "bg-transparent text-spar-green/80 hover:bg-white/60"
                )}
              >
                {tab.label}
              </button>
            ))}

            <label className="relative flex h-9 cursor-pointer items-center gap-2 rounded-full bg-white px-3 text-sm text-foreground">
              <Calendar className="size-4 text-muted-foreground" />
              <span>{displayDate}</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>

            <div className="relative w-full min-w-[180px] max-w-xs flex-1 sm:w-auto">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search"
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-full border-0 bg-white pl-9 shadow-none focus-visible:ring-spar-green/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={status || null}
              onValueChange={(v) => {
                setStatus(v ?? "");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 min-w-[120px] gap-2 rounded-full border-0 bg-white shadow-none">
                <Filter className="size-3.5 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-progress">In-Progress</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              className="h-9 rounded-full bg-spar-green px-4 text-white hover:bg-spar-green-dark"
            >
              <Download className="size-4" />
              Download CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        <OrderStats key={period} stats={stats} />

        <div className="rounded-[28px] bg-[#eceef2] p-4">
          <OrdersTable
            orders={pageItems}
            onView={(order) => {
              setSelected(order);
              setDetailsOpen(true);
            }}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-full bg-white px-4 py-2.5">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {String(showingFrom).padStart(2, "0")}-
                {String(showingTo).padStart(2, "0")}
              </span>{" "}
              of {filtered.length} Orders
            </p>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(
                (n) => (
                  <Button
                    key={n}
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      "size-8 rounded-full",
                      n === currentPage &&
                        "bg-[#d8efe3] text-[#49AE20] hover:bg-[#c5e6d4] hover:text-[#49AE20]"
                    )}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </Button>
                )
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OrderDetailsModel
        open={detailsOpen}
        order={selected}
        onOpenChange={setDetailsOpen}
        onStepChange={handleStepChange}
        onDelete={setDeleteTarget}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Confirm Order Deletion"
        message="Deleting this Order will permanently remove all associated details. Do you want to continue?"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
