"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloudUpload, X } from "lucide-react";
import type { Product, ProductFormValues } from "@/types/product";
import {
  BRANDS,
  CATEGORIES,
  SUB_CATEGORIES,
  UNITS,
} from "@/lib/data/products";
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

function productToForm(product: Product): ProductFormValues {
  return {
    brand: product.brand,
    category: product.category,
    subCategory: product.subCategory,
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
  onOpenChange: (open: boolean) => void;
  onSave: (values: ProductFormValues, productId?: string) => void;
}

export function ProductFormModel({
  open,
  mode,
  product,
  onOpenChange,
  onSave,
}: ProductFormModelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProductFormValues>(EMPTY_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(product && mode === "edit" ? productToForm(product) : EMPTY_FORM);
    setConfirmOpen(false);
  }, [open, mode, product]);

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
    "h-11 rounded-xl border-0 bg-[#f3f4f6] shadow-none focus-visible:ring-spar-green/30";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:max-w-2xl"
        >
          <DialogHeader className="mb-2 flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-xl font-semibold">
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

          <form onSubmit={handleSaveClick} className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {form.image ? (
                  <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl bg-[#f3f4f6]">
                    <Image
                      src={form.image}
                      alt="Product preview"
                      width={180}
                      height={220}
                      unoptimized={form.image.startsWith("data:")}
                      className="max-h-[200px] w-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-md bg-[#7cbc9a] shadow-sm transition hover:bg-spar-green"
                      aria-label="Change image"
                    >
                      <Image
                        src="/products/edit.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="size-4 brightness-0 invert"
                      />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl bg-[#f3f4f6] px-4 text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFile(e.dataTransfer.files?.[0]);
                    }}
                  >
                    <CloudUpload
                      className="size-10 text-spar-green"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Choose a file or drag & drop it here
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PNG/JPG formats up to 10mb
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-lg border-border bg-white"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse file
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label>Brand</Label>
                  <Select
                    value={form.brand || null}
                    onValueChange={(v) => updateField("brand", v ?? "")}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Category</Label>
                  <Select
                    value={form.category || null}
                    onValueChange={(v) => updateField("category", v ?? "")}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Sub Category</Label>
                  <Select
                    value={form.subCategory || null}
                    onValueChange={(v) => updateField("subCategory", v ?? "")}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUB_CATEGORIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Product name</Label>
              <Input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="eg; Milk"
                className={fieldClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Amount, Unit, Price (e.g., L, kg, g, ml)</Label>
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
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    €
                  </span>
                  <Input
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    placeholder="20,0"
                    className={`${fieldClass} pl-7`}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>About this Product</Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="eg; Start your day with our fresh bakery & tea combo"
                className="min-h-24 rounded-xl border-0 bg-[#f3f4f6] shadow-none focus-visible:ring-spar-green/30"
              />
            </div>

            <Button
              type="submit"
              className="mt-2 h-12 w-full rounded-2xl bg-spar-green text-base font-semibold text-white hover:bg-spar-green-dark"
            >
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          onSave(form, mode === "edit" ? product?.id : undefined);
          onOpenChange(false);
        }}
      />
    </>
  );
}
