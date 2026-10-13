"use client";

import { Filter, Plus, Bell, Search, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BRANDS,
  CATEGORIES,
  STATUSES,
  SUB_CATEGORIES,
} from "@/lib/data/products";
import { useAdminChrome } from "@/components/layout/admin-chrome";

export interface ProductFiltersState {
  brand: string;
  category: string;
  subCategory: string;
  status: string;
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onChange: (next: ProductFiltersState) => void;
  onAddProduct?: () => void;
}

function FilterSelect({
  placeholder,
  value,
  options,
  onValueChange,
  showAdd,
}: {
  placeholder: string;
  value: string;
  options: string[];
  onValueChange: (value: string | null) => void;
  showAdd?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Select value={value || null} onValueChange={(v) => onValueChange(v)}>
        <SelectTrigger className="h-9 min-w-[118px] gap-2 rounded-full border-0 bg-white shadow-none">
          <Filter className="size-3.5 shrink-0 text-muted-foreground" />
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {placeholder}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt.toLowerCase()}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showAdd && (
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          className="size-8 rounded-full border-0 bg-white text-spar-green shadow-none hover:bg-white hover:text-spar-green-dark"
          aria-label={`Add ${placeholder}`}
        >
          <Plus className="size-4" strokeWidth={2.5} />
        </Button>
      )}
    </div>
  );
}

export function ProductFilters({
  filters,
  onChange,
  onAddProduct,
}: ProductFiltersProps) {
  const { search, setSearch } = useAdminChrome();

  return (
    <div className="flex flex-col gap-3">
      {/* Top bar — separate long round grey container */}
      <div className="flex items-center justify-between gap-4 rounded-full bg-[#eceef2] px-5 py-2.5">
        <h1 className="min-w-0 shrink text-lg font-semibold tracking-tight text-foreground">
          Product management
        </h1>

        <div className="relative mx-auto w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      {/* Filters — separate long round grey container */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-full bg-[#eceef2] px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            placeholder="Brand"
            value={filters.brand}
            options={BRANDS}
            showAdd
            onValueChange={(v) => onChange({ ...filters, brand: v ?? "" })}
          />
          <FilterSelect
            placeholder="Category"
            value={filters.category}
            options={CATEGORIES}
            showAdd
            onValueChange={(v) => onChange({ ...filters, category: v ?? "" })}
          />
          <FilterSelect
            placeholder="Sub Category"
            value={filters.subCategory}
            options={SUB_CATEGORIES}
            showAdd
            onValueChange={(v) =>
              onChange({ ...filters, subCategory: v ?? "" })
            }
          />
          <FilterSelect
            placeholder="Status"
            value={filters.status}
            options={STATUSES}
            onValueChange={(v) => onChange({ ...filters, status: v ?? "" })}
          />
        </div>

        <Button
          type="button"
          className="h-9 rounded-full bg-spar-green px-5 text-white hover:bg-spar-green-dark"
          onClick={onAddProduct}
        >
          Add Product
        </Button>
      </div>
    </div>
  );
}
