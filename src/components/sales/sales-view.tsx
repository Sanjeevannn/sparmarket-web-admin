"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
} from "lucide-react";
import type { SalesPeriod } from "@/types/sales";
import {
  SALES_BY_PERIOD,
  SALES_BRANDS,
  SALES_CATEGORIES,
  SALES_SUB_CATEGORIES,
} from "@/lib/data/sales";
import { SalesStats } from "@/components/sales/sales-stats";
import { SalesTable } from "@/components/sales/sales-table";
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

const PERIOD_TABS: { key: SalesPeriod; label: string }[] = [
  { key: "now", label: "Now" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

export function SalesView() {
  const [period, setPeriod] = useState<SalesPeriod>("now");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [date, setDate] = useState("2025-04-12");
  const [page, setPage] = useState(1);

  const periodData = SALES_BY_PERIOD[period];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return periodData.items.filter((item) => {
      if (q) {
        const hay =
          `${item.itemName} ${item.brand} ${item.category} ${item.subCategory}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (brand && brand !== "all" && item.brand.toLowerCase() !== brand) {
        return false;
      }
      if (
        category &&
        category !== "all" &&
        item.category.toLowerCase() !== category
      ) {
        return false;
      }
      if (
        subCategory &&
        subCategory !== "all" &&
        item.subCategory.toLowerCase() !== subCategory
      ) {
        return false;
      }
      return true;
    });
  }, [periodData.items, search, brand, category, subCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const showingFrom = filtered.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PAGE_SIZE, filtered.length);

  function changePeriod(next: SalesPeriod) {
    setPeriod(next);
    setPage(1);
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
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 rounded-full bg-[#eceef2] px-5 py-2.5">
          <h1 className="min-w-0 shrink text-lg font-semibold tracking-tight text-foreground">
            Sales management
          </h1>

          <div className="relative mx-auto w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
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

        {/* Period tabs + filters */}
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
                    ? "bg-[#d8efe3] text-spar-green"
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
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={brand || null}
              onValueChange={(v) => {
                setBrand(v ?? "");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 min-w-[120px] rounded-full border-0 bg-white shadow-none">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brand</SelectItem>
                {SALES_BRANDS.map((b) => (
                  <SelectItem key={b} value={b.toLowerCase()}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={category || null}
              onValueChange={(v) => {
                setCategory(v ?? "");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 min-w-[120px] rounded-full border-0 bg-white shadow-none">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Category</SelectItem>
                {SALES_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c.toLowerCase()}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={subCategory || null}
              onValueChange={(v) => {
                setSubCategory(v ?? "");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 min-w-[130px] rounded-full border-0 bg-white shadow-none">
                <SelectValue placeholder="Sub Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub Category</SelectItem>
                {SALES_SUB_CATEGORIES.map((s) => (
                  <SelectItem key={s} value={s.toLowerCase()}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        <SalesStats key={period} stats={periodData.stats} />

        <div className="rounded-[28px] bg-[#eceef2] p-4">
          <SalesTable items={pageItems} />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-full bg-white px-4 py-2.5">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {String(showingFrom).padStart(2, "0")}-
                {String(showingTo).padStart(2, "0")}
              </span>{" "}
              of {filtered.length} Sales
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
                        "bg-[#d8efe3] text-spar-green hover:bg-[#c5e6d4] hover:text-spar-green"
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
    </div>
  );
}
