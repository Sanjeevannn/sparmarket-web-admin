"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS } from "@/lib/data/products";
import type { Product, ProductFormValues } from "@/types/product";
import { useAdminChrome } from "@/components/layout/admin-chrome";
import {
  ProductFilters,
  type ProductFiltersState,
} from "@/components/products/product-filters";
import { ProductCard } from "@/components/products/product-card";
import { ProductFormModel } from "@/components/Models/product-form-model";
import { ProductDetailsModel } from "@/components/Models/product-details-model";
import { ConfirmDialog } from "@/components/Dialogs/confirm-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

const PAGE_SIZE = 10;

function parsePrice(value: string) {
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : 0;
}

function formToProduct(
  values: ProductFormValues,
  existing?: Product
): Product {
  const amount = values.amount.trim() || "1";
  const unit = values.unit || "L";
  const price = parsePrice(values.price);

  return {
    id: existing?.id ?? `prod-${Date.now()}`,
    brand: values.brand,
    name: values.name.trim(),
    amount,
    unit,
    volume: `${amount}${unit.toLowerCase()}`,
    price,
    compareAtPrice: existing?.compareAtPrice ?? price,
    image: values.image || "/products/product.png",
    category: values.category,
    subCategory: values.subCategory,
    description:
      values.description.trim() ||
      "Start your day with our fresh bakery & tea combo",
    status: existing?.status ?? "active",
  };
}

export function ProductsView() {
  const { search } = useAdminChrome();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [filters, setFilters] = useState<ProductFiltersState>({
    brand: "",
    category: "",
    subCategory: "",
    status: "",
  });
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q) {
        const hay = `${p.brand} ${p.name} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.brand && filters.brand !== "all") {
        if (p.brand.toLowerCase() !== filters.brand) return false;
      }
      if (filters.category && filters.category !== "all") {
        if (p.category.toLowerCase() !== filters.category) return false;
      }
      if (filters.subCategory && filters.subCategory !== "all") {
        if (p.subCategory.toLowerCase() !== filters.subCategory) return false;
      }
      if (filters.status && filters.status !== "all") {
        if (p.status !== filters.status) return false;
      }
      return true;
    });
  }, [products, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const showingFrom = filtered.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PAGE_SIZE, filtered.length);

  function openAdd() {
    setFormMode("add");
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setDetailsOpen(false);
    setFormMode("edit");
    setEditingProduct(product);
    setFormOpen(true);
  }

  function openDetails(product: Product) {
    setSelectedProduct(product);
    setDetailsOpen(true);
  }

  function handleSave(values: ProductFormValues, productId?: string) {
    if (productId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? formToProduct(values, p) : p
        )
      );
      setSelectedProduct((prev) =>
        prev?.id === productId ? formToProduct(values, prev) : prev
      );
    } else {
      const created = formToProduct(values);
      setProducts((prev) => [created, ...prev]);
      setPage(1);
    }
  }

  function handleStatusChange(productId: string, active: boolean) {
    const status = active ? "active" : "inactive";
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status } : p))
    );
    setSelectedProduct((prev) =>
      prev?.id === productId ? { ...prev, status } : prev
    );
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    if (selectedProduct?.id === deleteTarget.id) {
      setDetailsOpen(false);
      setSelectedProduct(null);
    }
    setDeleteTarget(null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0">
        <ProductFilters
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
          onAddProduct={openAdd}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* 5 cards per row × 2 rows = 10 products per page */}
        <div className="grid grid-cols-5 gap-4">
          {pageItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={openDetails}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-3 rounded-2xl bg-white p-10 text-center text-sm text-muted-foreground shadow-sm">
            No products match your filters.
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-full bg-[#eceef2] px-5 py-2.5">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {String(showingFrom).padStart(2, "0")}-
            {String(showingTo).padStart(2, "0")}
          </span>{" "}
          of {filtered.length} Products
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

      <ProductFormModel
        open={formOpen}
        mode={formMode}
        product={editingProduct}
        onOpenChange={setFormOpen}
        onSave={handleSave}
      />

      <ProductDetailsModel
        open={detailsOpen}
        product={selectedProduct}
        onOpenChange={setDetailsOpen}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onStatusChange={handleStatusChange}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Confirm Delete Action"
        message="Please confirm if you want to delete this Product."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
