"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product, ProductFormValues } from "@/types/product";
import { useAdminChrome } from "@/components/layout/admin-chrome";
import {
  ProductFilters,
  type ProductFiltersState,
  type TaxonomyFilterKind,
} from "@/components/products/product-filters";
import { ProductCard } from "@/components/products/product-card";
import { ProductFormModel } from "@/components/Models/product-form-model";
import { ProductDetailsModel } from "@/components/Models/product-details-model";
import {
  TaxonomyFormModel,
  type TaxonomyFormValues,
  type TaxonomyKind,
} from "@/components/Models/taxonomy-form-model";
import { ConfirmDialog } from "@/components/Dialogs/confirm-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import {
  createProductApi,
  deleteProductApi,
  fetchProducts,
  updateProductApi,
  updateProductStatusApi,
} from "@/lib/api/products";
import {
  createCategoryApi,
  deleteCategoryApi,
  fetchCategories,
  mainCategories,
  updateCategoryApi,
  type CategoryOption,
} from "@/lib/api/categories";
import {
  createBrandApi,
  deleteBrandApi,
  fetchBrands,
  updateBrandApi,
  type BrandOption,
} from "@/lib/api/brands";
import { ApiError } from "@/lib/api/client";

const PAGE_SIZE = 10;

type TaxonomyModalState = {
  open: boolean;
  mode: "add" | "edit";
  kind: TaxonomyKind;
};

type DeleteTaxonomyState = {
  kind: TaxonomyFilterKind;
  id: string;
  name: string;
} | null;

export function ProductsView() {
  const { search } = useAdminChrome();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const [taxonomyModal, setTaxonomyModal] = useState<TaxonomyModalState>({
    open: false,
    mode: "add",
    kind: "brand",
  });
  const [deleteTaxonomy, setDeleteTaxonomy] =
    useState<DeleteTaxonomyState>(null);

  async function loadCatalog() {
    setLoading(true);
    setError("");
    try {
      const [list, cats, brandList] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBrands(),
      ]);
      setProducts(list);
      setCategories(cats);
      setBrands(brandList);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCatalog();
  }, []);

  const brandNameById = useMemo(() => {
    const map = new Map<string, string>();
    brands.forEach((b) => map.set(b.id, b.name));
    return map;
  }, [brands]);

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q) {
        const hay = `${p.brand} ${p.name} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.brand && filters.brand !== "all") {
        const brandName = brandNameById.get(filters.brand);
        if (!brandName || p.brand.toLowerCase() !== brandName.toLowerCase()) {
          return false;
        }
      }
      if (filters.category && filters.category !== "all") {
        const categoryName = categoryNameById.get(filters.category);
        if (
          !categoryName ||
          p.category.toLowerCase() !== categoryName.toLowerCase()
        ) {
          return false;
        }
      }
      if (filters.subCategory && filters.subCategory !== "all") {
        const subName = categoryNameById.get(filters.subCategory);
        if (!subName || p.subCategory.toLowerCase() !== subName.toLowerCase()) {
          return false;
        }
      }
      if (filters.status && filters.status !== "all") {
        if (p.status !== filters.status) return false;
      }
      return true;
    });
  }, [products, search, filters, brandNameById, categoryNameById]);

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

  function selectedTaxonomy(kind: TaxonomyFilterKind) {
    if (kind === "brand") {
      const id = filters.brand;
      if (!id || id === "all") return null;
      const brand = brands.find((b) => b.id === id);
      return brand ? { id: brand.id, name: brand.name, parentId: null } : null;
    }

    const id = kind === "category" ? filters.category : filters.subCategory;
    if (!id || id === "all") return null;
    const category = categories.find((c) => c.id === id);
    return category
      ? { id: category.id, name: category.name, parentId: category.parentId }
      : null;
  }

  function handleAddTaxonomy(kind: TaxonomyFilterKind) {
    setError("");
    setTaxonomyModal({ open: true, mode: "add", kind });
  }

  function handleEditTaxonomy(kind: TaxonomyFilterKind) {
    const selected = selectedTaxonomy(kind);
    if (!selected) {
      setError(
        `Select a ${kind === "subCategory" ? "sub category" : kind} first.`
      );
      return;
    }
    setError("");
    setTaxonomyModal({ open: true, mode: "edit", kind });
  }

  function handleDeleteTaxonomy(kind: TaxonomyFilterKind) {
    const selected = selectedTaxonomy(kind);
    if (!selected) {
      setError(
        `Select a ${kind === "subCategory" ? "sub category" : kind} first.`
      );
      return;
    }
    setError("");
    setDeleteTaxonomy({ kind, id: selected.id, name: selected.name });
  }

  async function handleTaxonomySubmit(values: TaxonomyFormValues) {
    const { kind, mode } = taxonomyModal;

    try {
      if (kind === "brand") {
        if (mode === "add") {
          const created = await createBrandApi(values.name);
          setBrands((prev) =>
            [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
          );
          setFilters((prev) => ({ ...prev, brand: created.id }));
        } else {
          const selected = selectedTaxonomy("brand");
          if (!selected) throw new Error("Select a brand first.");
          const updated = await updateBrandApi(selected.id, values.name);
          setBrands((prev) =>
            prev
              .map((b) => (b.id === updated.id ? updated : b))
              .sort((a, b) => a.name.localeCompare(b.name))
          );
          setProducts((prev) =>
            prev.map((p) =>
              p.brand.toLowerCase() === selected.name.toLowerCase()
                ? { ...p, brand: updated.name }
                : p
            )
          );
        }
        return;
      }

      if (mode === "add") {
        const created = await createCategoryApi({
          name: values.name,
          parentCategory:
            kind === "subCategory" ? values.parentCategoryId || null : null,
        });
        setCategories((prev) => [created, ...prev]);
        if (kind === "category") {
          setFilters((prev) => ({
            ...prev,
            category: created.id,
            subCategory: "",
          }));
        } else {
          setFilters((prev) => ({
            ...prev,
            category: created.parentId || prev.category,
            subCategory: created.id,
          }));
        }
        return;
      }

      const selected = selectedTaxonomy(kind);
      if (!selected) throw new Error("Select an item first.");

      const updated = await updateCategoryApi(selected.id, {
        name: values.name,
        parentCategory:
          kind === "subCategory"
            ? values.parentCategoryId || selected.parentId
            : null,
      });

      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      if (kind === "category") {
        setProducts((prev) =>
          prev.map((p) =>
            p.category.toLowerCase() === selected.name.toLowerCase()
              ? { ...p, category: updated.name }
              : p
          )
        );
      } else {
        setProducts((prev) =>
          prev.map((p) =>
            p.subCategory.toLowerCase() === selected.name.toLowerCase()
              ? { ...p, subCategory: updated.name }
              : p
          )
        );
      }
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Failed to save";
      setError(message);
      throw err;
    }
  }

  async function handleDeleteTaxonomyConfirm() {
    if (!deleteTaxonomy) return;

    try {
      if (deleteTaxonomy.kind === "brand") {
        await deleteBrandApi(deleteTaxonomy.id);
        setBrands((prev) => prev.filter((b) => b.id !== deleteTaxonomy.id));
        setFilters((prev) =>
          prev.brand === deleteTaxonomy.id ? { ...prev, brand: "" } : prev
        );
      } else {
        await deleteCategoryApi(deleteTaxonomy.id);
        setCategories((prev) =>
          prev.filter((c) => c.id !== deleteTaxonomy.id)
        );
        setFilters((prev) => {
          const next = { ...prev };
          if (prev.category === deleteTaxonomy.id) {
            next.category = "";
            next.subCategory = "";
          }
          if (prev.subCategory === deleteTaxonomy.id) {
            next.subCategory = "";
          }
          return next;
        });
      }
      setDeleteTaxonomy(null);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Failed to delete"
      );
    }
  }

  async function handleSave(values: ProductFormValues, productId?: string) {
    if (!values.category) {
      throw new Error("Category is required.");
    }

    try {
      if (productId) {
        const existing = products.find((p) => p.id === productId);
        const updated = await updateProductApi(
          productId,
          values,
          values.category,
          values.subCategory || undefined,
          existing?.imageId
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? updated : p))
        );
        setSelectedProduct((prev) =>
          prev?.id === productId ? updated : prev
        );
      } else {
        const created = await createProductApi(
          values,
          values.category,
          values.subCategory || undefined
        );
        setProducts((prev) => [created, ...prev]);
        setPage(1);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save product");
      throw err;
    }
  }

  async function handleStatusChange(productId: string, active: boolean) {
    try {
      const updated = await updateProductStatusApi(productId, active);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updated : p))
      );
      setSelectedProduct((prev) =>
        prev?.id === productId ? updated : prev
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to update status"
      );
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteProductApi(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      if (selectedProduct?.id === deleteTarget.id) {
        setDetailsOpen(false);
        setSelectedProduct(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to delete product"
      );
    }
  }

  const editingTaxonomy = selectedTaxonomy(taxonomyModal.kind);
  const taxonomyInitialParentId =
    taxonomyModal.kind === "subCategory"
      ? taxonomyModal.mode === "edit"
        ? editingTaxonomy?.parentId || filters.category || ""
        : filters.category && filters.category !== "all"
          ? filters.category
          : ""
      : "";

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0">
        <ProductFilters
          filters={filters}
          brands={brands}
          categories={categories}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
          onAddProduct={openAdd}
          onAddTaxonomy={handleAddTaxonomy}
          onEditTaxonomy={handleEditTaxonomy}
          onDeleteTaxonomy={handleDeleteTaxonomy}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {error && <p className="mb-2 text-sm text-spar-red">{error}</p>}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading products...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
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
          </>
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
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => {
              if (totalPages <= 5) return true;
              return (
                n === 1 ||
                n === totalPages ||
                Math.abs(n - currentPage) <= 1
              );
            })
            .map((n, index, arr) => {
              const prev = arr[index - 1];
              const showEllipsis = prev != null && n - prev > 1;
              return (
                <span key={n} className="flex items-center gap-1">
                  {showEllipsis ? (
                    <span className="px-1 text-muted-foreground">…</span>
                  ) : null}
                  <Button
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
                </span>
              );
            })}
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
        categories={categories}
        brands={brands}
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

      <TaxonomyFormModel
        open={taxonomyModal.open}
        mode={taxonomyModal.mode}
        kind={taxonomyModal.kind}
        initialName={
          taxonomyModal.mode === "edit" ? editingTaxonomy?.name || "" : ""
        }
        initialParentId={taxonomyInitialParentId}
        parentOptions={mainCategories(categories)}
        onOpenChange={(open) =>
          setTaxonomyModal((prev) => ({ ...prev, open }))
        }
        onSubmit={handleTaxonomySubmit}
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

      <ConfirmDialog
        open={!!deleteTaxonomy}
        onOpenChange={(open) => {
          if (!open) setDeleteTaxonomy(null);
        }}
        title="Confirm Delete Action"
        message={
          deleteTaxonomy
            ? `Please confirm if you want to delete "${deleteTaxonomy.name}".`
            : "Please confirm delete."
        }
        onConfirm={handleDeleteTaxonomyConfirm}
      />
    </div>
  );
}
