"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Filter,
} from "lucide-react";
import {
  CUSTOMERS,
  CLOSURE_REASONS,
} from "@/lib/data/customers";
import type { Customer } from "@/types/customer";
import { CustomerStats } from "@/components/customers/customer-stats";
import { CustomerDirectory } from "@/components/customers/customer-directory";
import { ClosureAnalysis } from "@/components/customers/closure-analysis";
import { CustomerDetailsModel } from "@/components/Models/customer-details-model";
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

type TabKey = "directory" | "closure";

export function CustomersView() {
  const [tab, setTab] = useState<TabKey>("directory");
  const [headerSearch, setHeaderSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = `${headerSearch} ${filterSearch}`.trim().toLowerCase();
    return CUSTOMERS.filter((c) => {
      if (q) {
        const hay = `${c.name} ${c.email} ${c.phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (status && status !== "all") {
        if (c.status !== status) return false;
      }
      return true;
    });
  }, [headerSearch, filterSearch, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const showingFrom = filtered.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PAGE_SIZE, filtered.length);

  function openDetails(customer: Customer) {
    setSelected(customer);
    setDetailsOpen(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 flex-col gap-3">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 rounded-full bg-[#eceef2] px-5 py-2.5">
          <h1 className="min-w-0 shrink text-lg font-semibold tracking-tight text-foreground">
            Customers
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

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-full bg-[#eceef2] px-4 py-2.5">
          <div className="relative w-full max-w-sm flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              value={filterSearch}
              onChange={(e) => {
                setFilterSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-full border-0 bg-white pl-9 shadow-none focus-visible:ring-spar-green/20"
            />
          </div>

          <Select
            value={status || null}
            onValueChange={(v) => {
              setStatus(v ?? "");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 min-w-[130px] gap-2 rounded-full border-0 bg-white shadow-none">
              <Filter className="size-3.5 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Account closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        <CustomerStats key="customer-stats-v2" />

        {/* Tabs + content */}
        <div className="rounded-[28px] bg-[#eceef2] p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("directory")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                tab === "directory"
                  ? "bg-spar-green text-white"
                  : "bg-white text-muted-foreground hover:text-foreground"
              )}
            >
              Customer Directory
            </button>
            <button
              type="button"
              onClick={() => setTab("closure")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                tab === "closure"
                  ? "bg-spar-green text-white"
                  : "bg-white text-muted-foreground hover:text-foreground"
              )}
            >
              Account Closure Analysis
            </button>
          </div>

          {tab === "directory" ? (
            <>
              <CustomerDirectory customers={pageItems} onView={openDetails} />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-full bg-white px-4 py-2.5">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {String(showingFrom).padStart(2, "0")}-
                    {String(showingTo).padStart(2, "0")}
                  </span>{" "}
                  of {filtered.length} Customers
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
                  {Array.from(
                    { length: Math.min(3, totalPages) },
                    (_, i) => i + 1
                  ).map((n) => (
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
                  ))}
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
            </>
          ) : (
            <ClosureAnalysis reasons={CLOSURE_REASONS} />
          )}
        </div>
      </div>

      <CustomerDetailsModel
        open={detailsOpen}
        customer={selected}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
