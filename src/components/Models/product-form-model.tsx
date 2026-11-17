"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloudUpload, X } from "lucide-react";
import type { Product, ProductFormValues } from "@/types/product";
import { UNITS } from "@/lib/data/products";
import type { BrandOption } from "@/lib/api/brands";
import type { CategoryOption } from "@/lib/api/categories";
import {
  mainCategories,
  subCategoriesOf,
} from "@/lib/api/categories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/Dialogs/confirm-dialog";

const EMPTY_FORM: ProductFormValues = {
  brand: "",
  category: "",
  subCategory: "",
  name: "",
  amount: "",
  unit: "",
  price: "",
  description: "",
  image: "",
};

function resolveMainCategoryId(
  product: Product,
  categories: CategoryOption[]
) {
  const mains = categories.filter((c) => !c.parentId);
  if (product.categoryId && mains.some((c) => c.id === product.categoryId)) {
    return product.categoryId;
  }

  const asSub = categories.find(
    (c) => c.id === product.categoryId && c.parentId
  );
  if (asSub?.parentId) return asSub.parentId;

  const byName = mains.find(
    (c) => c.name.toLowerCase() === product.category.toLowerCase()
  );
  return byName?.id || "";
}

function resolveSubCategoryId(
  product: Product,
  categories: CategoryOption[],
  parentId: string
) {
  const subs = categories.filter((c) => c.parentId === parentId);
  if (
    product.subCategoryId &&
    subs.some((c) => c.id === product.subCategoryId)
  ) {
    return product.subCategoryId;
  }

  const byName = subs.find(
    (c) =>
      c.name.toLowerCase() === (product.subCategory || "").toLowerCase()
  );
  return byName?.id || "";
}

function productToForm(
  product: Product,
  categories: CategoryOption[] = []
): ProductFormValues {
  const category = resolveMainCategoryId(product, categories);
  return {
    brand: product.brand,
    category,
    subCategory: resolveSubCategoryId(product, categories, category),
    name: product.name,
    amount: product.amount,
    unit: product.unit,
    price: String(product.price),
    description: product.description,
    image: product.image,
  };
}

interface ProductFormModelProps {
  open: boolean;
  mode: "add" | "edit";
  product?: Product | null;
  categories?: CategoryOption[];
  brands?: BrandOption[];
  onOpenChange: (open: boolean) => void;
  onSave: (values: ProductFormValues, productId?: string) => void | Promise<void>;
}

export function ProductFormModel({
  open,
  mode,
  product,
  categories = [],
  brands = [],
  onOpenChange,
  onSave,
}: ProductFormModelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProductFormValues>(EMPTY_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      product && mode === "edit"
        ? productToForm(product, categories)
        : EMPTY_FORM
    );
    setConfirmOpen(false);
  }, [open, mode, product, categories]);

  function updateField<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFile(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateField("image", String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  }

  function handleSaveClick(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.brand || !form.category) return;
    setConfirmOpen(true);
  }

  const fieldClass =
    "h-9 rounded-lg border-0 bg-[#f3f4f6] shadow-none focus-visible:ring-spar-green/30";

  const apiMains = mainCategories(categories);
  const apiSubs = form.category
    ? subCategoriesOf(categories, form.category)
    : [];
  const categoryOptions = apiMains.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  const subCategoryOptions = apiSubs.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="!flex h-[min(100dvh-1.5rem,640px)] !w-[min(96vw,900px)] !max-w-[900px] !flex-col !gap-0 overflow-hidden rounded-2xl !p-0 sm:h-[min(100dvh-2.5rem,600px)] sm:!w-[min(92vw,980px)] sm:!max-w-[980px] sm:rounded-3xl"
        >
          <DialogHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 border-b border-border/40 px-4 py-3 sm:px-5">
            <DialogTitle className="text-lg font-semibold sm:text-xl">
              {mode === "add" ? "Add Product" : "Edit Product"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-spar-green transition-opacity hover:opacity-70"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={2.5} />
            </button>
          </DialogHeader>

          <form
            onSubmit={handleSaveClick}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-5 py-3 sm:gap-3 sm:px-7 sm:py-4">
              <div className="grid min-h-0 flex-[1.35] grid-cols-2 gap-3 sm:gap-5">
                <div className="flex min-h-0 flex-col gap-1">
                  <Label className="text-xs font-medium sm:text-sm">Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />

                  {form.image ? (
                    <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-[#f3f4f6]">
                      <Image
                        src={form.image}
                        alt="Product preview"
                        width={160}
                        height={160}
                        unoptimized={form.image.startsWith("data:")}
                        className="max-h-full w-auto object-contain p-2"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md bg-[#7cbc9a] shadow-sm transition hover:bg-spar-green"
                        aria-label="Change image"
                      >
                        <Image
                          src="/products/edit.svg"
                          alt=""
                          width={14}
                          height={14}
                          className="size-3.5 brightness-0 invert"
                        />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#f3f4f6] px-3 text-center"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleFile(e.dataTransfer.files?.[0]);
                      }}
                    >
                      <CloudUpload
                        className="size-7 text-spar-green sm:size-8"
                        strokeWidth={1.5}
                      />
                      <div>
                        <p className="text-xs font-medium text-foreground sm:text-sm">
                          Choose a file or drag & drop it here
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          PNG/JPG up to 10mb
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 rounded-lg border-border bg-white px-3 text-xs"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Browse file
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex min-h-0 flex-col justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs sm:text-sm">Brand</Label>
                    <Select
                      value={form.brand || null}
                      onValueChange={(v) => updateField("brand", v ?? "")}
                      items={brands.map((b) => ({
                        value: b.name,
                        label: b.name,
                      }))}
                    >
                      <SelectTrigger className={fieldClass}>
                        <SelectValue placeholder="Select">
                          {(selected) =>
                            selected
                              ? brands.find((b) => b.name === selected)?.name ??
                                String(selected)
                              : "Select"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b.id} value={b.name} label={b.name}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs sm:text-sm">Category</Label>
                    <Select
                      value={form.category || null}
                      onValueChange={(v) => {
                        updateField("category", v ?? "");
                        updateField("subCategory", "");
                      }}
                      items={categoryOptions.map((c) => ({
                        value: c.value,
                        label: c.label,
                      }))}
                    >
                      <SelectTrigger className={fieldClass}>
                        <SelectValue placeholder="Select">
                          {(selected) =>
                            selected
                              ? categoryOptions.find((c) => c.value === selected)
                                  ?.label ?? String(selected)
                              : "Select"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((c) => (
                          <SelectItem
                            key={c.value}
                            value={c.value}
                            label={c.label}
                          >
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs sm:text-sm">Sub Category</Label>
                    <Select
                      value={form.subCategory || null}
                      onValueChange={(v) => updateField("subCategory", v ?? "")}
                      items={subCategoryOptions.map((s) => ({
                        value: s.value,
                        label: s.label,
                      }))}
                    >
                      <SelectTrigger className={fieldClass}>
                        <SelectValue placeholder="Select">
                          {(selected) =>
                            selected
                              ? subCategoryOptions.find(
                                  (s) => s.value === selected
                                )?.label ?? String(selected)
                              : "Select"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {subCategoryOptions.map((s) => (
                          <SelectItem
                            key={s.value}
                            value={s.value}
                            label={s.label}
                          >
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <Label className="text-xs sm:text-sm">Product name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="eg; Milk"
                  className={fieldClass}
                  required
                />
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <Label className="text-xs sm:text-sm">
                  Amount, Unit, Price (e.g., L, kg, g, ml)
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={form.amount}
                    onChange={(e) => updateField("amount", e.target.value)}
                    placeholder="eg; 1"
                    className={fieldClass}
                    required
                  />
                  <Select
                    value={form.unit || null}
                    onValueChange={(v) => updateField("unit", v ?? "")}
                    items={UNITS.map((u) => ({ value: u, label: u }))}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Select Unit">
                        {(selected) =>
                          selected ? String(selected) : "Select Unit"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => (
                        <SelectItem key={u} value={u} label={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground sm:text-sm">
                      €
                    </span>
                    <Input
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      placeholder="20,0"
                      className={`${fieldClass} pl-6`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-1">
                <Label className="shrink-0 text-xs sm:text-sm">
                  About this Product
                </Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="eg; Start your day with our fresh bakery & tea combo"
                  className="min-h-0 flex-1 resize-none rounded-lg border-0 bg-[#f3f4f6] shadow-none focus-visible:ring-spar-green/30"
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-border/40 px-4 py-3 sm:px-5">
              <Button
                type="submit"
                className="h-10 w-full rounded-xl bg-spar-green text-sm font-semibold text-white hover:bg-spar-green-dark sm:h-11 sm:rounded-2xl sm:text-base"
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={async () => {
          await onSave(form, mode === "edit" ? product?.id : undefined);
          onOpenChange(false);
        }}
      />
    </>
  );
}
