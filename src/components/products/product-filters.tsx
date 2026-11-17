"use client";

import { Filter, Plus, Bell, Search, User, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATUSES } from "@/lib/data/products";
import { useAdminChrome } from "@/components/layout/admin-chrome";
import type { BrandOption } from "@/lib/api/brands";
import type { CategoryOption } from "@/lib/api/categories";
import { mainCategories, subCategoriesOf } from "@/lib/api/categories";

export interface ProductFiltersState {
  brand: string;
  category: string;
  subCategory: string;
  status: string;
}

export type TaxonomyFilterKind = "brand" | "category" | "subCategory";

interface ProductFiltersProps {
  filters: ProductFiltersState;
  brands: BrandOption[];
  categories: CategoryOption[];
  onChange: (next: ProductFiltersState) => void;
  onAddProduct?: () => void;
  onAddTaxonomy?: (kind: TaxonomyFilterKind) => void;
  onEditTaxonomy?: (kind: TaxonomyFilterKind) => void;
  onDeleteTaxonomy?: (kind: TaxonomyFilterKind) => void;
}

function ActionIconButton({
  label,
  onClick,
  disabled,
  children,
  danger,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className={`size-8 rounded-full border-0 bg-white shadow-none disabled:opacity-40 ${
        danger
          ? "text-spar-red hover:bg-white hover:text-spar-red"
          : "text-spar-green hover:bg-white hover:text-spar-green-dark"
      }`}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

function FilterSelect({
  placeholder,
  value,
  options,
  onValueChange,
  onAdd,
  onEdit,
  onDelete,
  showActions,
}: {
  placeholder: string;
  value: string;
  options: { id: string; name: string }[];
  onValueChange: (value: string | null) => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}) {
  const hasSelection = Boolean(value && value !== "all");
  const selectItems = [
    { value: "all", label: `All ${placeholder}` },
    ...options.map((opt) => ({ value: opt.id, label: opt.name })),
  ];

  return (
    <div className="flex items-center gap-1.5">
      <Select
        value={value || null}
        onValueChange={(v) => onValueChange(v)}
        items={selectItems}
      >
        <SelectTrigger className="h-9 min-w-[118px] gap-2 rounded-full border-0 bg-white shadow-none">
          <Filter className="size-3.5 shrink-0 text-muted-foreground" />
          <SelectValue placeholder={placeholder}>
            {(selected) => {
              if (selected == null || selected === "") return placeholder;
              if (selected === "all") return `All ${placeholder}`;
              return (
                options.find((opt) => opt.id === selected)?.name ??
                String(selected)
              );
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" label={`All ${placeholder}`}>
            All {placeholder}
          </SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id} label={opt.name}>
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showActions ? (
        <>
          <ActionIconButton label={`Add ${placeholder}`} onClick={onAdd}>
            <Plus className="size-4" strokeWidth={2.5} />
          </ActionIconButton>
          <ActionIconButton
            label={`Edit ${placeholder}`}
            onClick={onEdit}
            disabled={!hasSelection}
          >
            <Pencil className="size-3.5" strokeWidth={2.25} />
          </ActionIconButton>
          <ActionIconButton
            label={`Delete ${placeholder}`}
            onClick={onDelete}
            disabled={!hasSelection}
            danger
          >
            <Trash2 className="size-3.5" strokeWidth={2.25} />
          </ActionIconButton>
        </>
      ) : null}
    </div>
  );
}

export function ProductFilters({
  filters,
  brands,
  categories,
  onChange,
  onAddProduct,
  onAddTaxonomy,
  onEditTaxonomy,
  onDeleteTaxonomy,
}: ProductFiltersProps) {
  const { search, setSearch } = useAdminChrome();
  const mainCats = mainCategories(categories);
  const subCats =
    filters.category && filters.category !== "all"
      ? subCategoriesOf(categories, filters.category)
      : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-[24px] bg-[#eceef2] px-4 py-3 sm:rounded-full sm:px-5 sm:py-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <h1 className="min-w-0 shrink pl-10 text-lg font-semibold tracking-tight text-foreground md:pl-0">
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

        <div className="flex shrink-0 items-center justify-end gap-3">
          <button
            type="button"
            disabled
            title="Notifications coming soon"
            className="relative flex size-9 cursor-not-allowed items-center justify-center rounded-full text-muted-foreground opacity-60"
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="flex size-8 items-center justify-center rounded-full bg-white text-muted-foreground">
              <User className="size-4" strokeWidth={1.75} />
            </span>
            Admin
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[24px] bg-[#eceef2] px-4 py-3 sm:rounded-full sm:px-4 sm:py-2.5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            placeholder="Brand"
            value={filters.brand}
            options={brands}
            showActions
            onValueChange={(v) => onChange({ ...filters, brand: v ?? "" })}
            onAdd={() => onAddTaxonomy?.("brand")}
            onEdit={() => onEditTaxonomy?.("brand")}
            onDelete={() => onDeleteTaxonomy?.("brand")}
          />
          <FilterSelect
            placeholder="Category"
            value={filters.category}
            options={mainCats}
            showActions
            onValueChange={(v) =>
              onChange({
                ...filters,
                category: v ?? "",
                subCategory: "",
              })
            }
            onAdd={() => onAddTaxonomy?.("category")}
            onEdit={() => onEditTaxonomy?.("category")}
            onDelete={() => onDeleteTaxonomy?.("category")}
          />
          <FilterSelect
            placeholder="Sub Category"
            value={filters.subCategory}
            options={subCats}
            showActions
            onValueChange={(v) =>
              onChange({ ...filters, subCategory: v ?? "" })
            }
            onAdd={() => onAddTaxonomy?.("subCategory")}
            onEdit={() => onEditTaxonomy?.("subCategory")}
            onDelete={() => onDeleteTaxonomy?.("subCategory")}
          />
          <FilterSelect
            placeholder="Status"
            value={filters.status}
            options={STATUSES.map((s) => ({
              id: s.toLowerCase(),
              name: s,
            }))}
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
