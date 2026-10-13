"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CloudUpload, Pencil, Search, X } from "lucide-react";
import type { Product } from "@/types/product";
import type {
  ComboOfferFormResult,
  ComboOfferProduct,
} from "@/types/offer";
import { PRODUCTS } from "@/lib/data/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/Dialogs/confirm-dialog";
import {
  EMPTY_DATE_PARTS,
  formatDateParts,
  type DateParts,
  validateOfferDateRange,
} from "@/lib/offer-dates";

function formatMoney(price: number) {
  return `$${price.toFixed(2)}`;
}

function formatEuroBadge(price: number) {
  return `€${price.toFixed(2).replace(".", ",")}`;
}

function DatePartsRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DateParts;
  onChange: (next: DateParts) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <Input
          inputMode="numeric"
          maxLength={2}
          placeholder="DD"
          value={value.dd}
          onChange={(e) =>
            onChange({
              ...value,
              dd: e.target.value.replace(/\D/g, "").slice(0, 2),
            })
          }
          className="h-10 w-14 rounded-xl border-0 bg-[#eceef2] px-2 text-center shadow-none placeholder:text-muted-foreground/70"
        />
        <span className="text-muted-foreground">/</span>
        <Input
          inputMode="numeric"
          maxLength={2}
          placeholder="MM"
          value={value.mm}
          onChange={(e) =>
            onChange({
              ...value,
              mm: e.target.value.replace(/\D/g, "").slice(0, 2),
            })
          }
          className="h-10 w-14 rounded-xl border-0 bg-[#eceef2] px-2 text-center shadow-none placeholder:text-muted-foreground/70"
        />
        <span className="text-muted-foreground">/</span>
        <Input
          inputMode="numeric"
          maxLength={4}
          placeholder="YYYY"
          value={value.yyyy}
          onChange={(e) =>
            onChange({
              ...value,
              yyyy: e.target.value.replace(/\D/g, "").slice(0, 4),
            })
          }
          className="h-10 w-[4.5rem] rounded-xl border-0 bg-[#eceef2] px-2 text-center shadow-none placeholder:text-muted-foreground/70"
        />
      </div>
    </div>
  );
}

interface ComboOfferFormModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (result: ComboOfferFormResult) => void;
}

export function ComboOfferFormModel({
  open,
  onOpenChange,
  onSave,
}: ComboOfferFormModelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState<DateParts>(EMPTY_DATE_PARTS);
  const [end, setEnd] = useState<DateParts>(EMPTY_DATE_PARTS);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [discount, setDiscount] = useState("");
  const [products, setProducts] = useState<ComboOfferProduct[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setImage("");
    setTitle("");
    setDescription("");
    setStart(EMPTY_DATE_PARTS);
    setEnd(EMPTY_DATE_PARTS);
    setQuery("");
    setSelected(null);
    setQuantity("1");
    setDiscount("");
    setProducts([]);
    setConfirmOpen(false);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || selected) return [];
    return PRODUCTS.filter((p) => {
      if (p.status !== "active") return false;
      const hay = `${p.brand} ${p.name} ${p.category}`.toLowerCase();
      return hay.includes(q);
    }).slice(0, 5);
  }, [query, selected]);

  function handleFile(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  function handleSelectProduct(product: Product) {
    setSelected(product);
    setQuery(product.name);
    setQuantity("1");
    setDiscount("");
  }

  function handleAddProduct() {
    if (!selected) return;
    const qty = Number(quantity);
    const offerPrice = Number(discount);
    if (!Number.isFinite(qty) || qty < 1) return;
    if (!Number.isFinite(offerPrice) || offerPrice <= 0) return;

    setProducts((prev) => [
      ...prev,
      {
        productId: selected.id,
        title: selected.name,
        brand: selected.brand,
        volume: selected.volume,
        image: selected.image,
        price: selected.compareAtPrice ?? selected.price,
        quantity: qty,
        offerPrice,
      },
    ]);
    setSelected(null);
    setQuery("");
    setQuantity("1");
    setDiscount("");
  }

  const dateValidation = validateOfferDateRange(start, end);

  const canStep1 =
    !!image &&
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    dateValidation.ok;

  const canAddProduct =
    !!selected &&
    Number(quantity) >= 1 &&
    Number(discount) > 0 &&
    Number.isFinite(Number(discount));

  const canSave = products.length > 0 && dateValidation.ok;

  function handleConfirmSave() {
    const dateCheck = validateOfferDateRange(start, end);
    if (!dateCheck.ok) return;
    const total = products.reduce((sum, p) => sum + p.offerPrice, 0);
    onSave({
      title: title.trim(),
      description: description.trim(),
      image,
      validityFrom: formatDateParts(start),
      validityTo: formatDateParts(end),
      category: "Bakery",
      products,
      price: Number(total.toFixed(2)),
    });
    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:max-w-lg"
        >
          <DialogHeader className="mb-3 space-y-0">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-xl font-semibold text-spar-green">
                Add Combo Offer
              </DialogTitle>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-spar-green transition-opacity hover:opacity-70"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={2.5} />
              </button>
            </div>
          </DialogHeader>

          <div className="mb-4">
            <p className="mb-2 text-xs text-muted-foreground">Step 01 to 02</p>
            <div className="h-2 overflow-hidden rounded-full bg-[#eceef2]">
              <div
                className="h-full rounded-full bg-spar-green transition-all"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
          </div>

          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold">1. Basic information</h2>

              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Offer Image
                </Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {image ? (
                  <div className="relative overflow-hidden rounded-2xl bg-[#eceef2]">
                    <Image
                      src={image}
                      alt="Offer preview"
                      width={640}
                      height={280}
                      unoptimized={image.startsWith("data:")}
                      className="h-[180px] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-[#c5e6d4] px-3 py-1.5 text-sm font-medium text-spar-green shadow-sm transition hover:bg-[#b4dcc6]"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl bg-[#eceef2] px-4 text-center"
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
                      <p className="text-sm font-medium">
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

              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Offer Title
                </Label>
                <Input
                  placeholder="eg; Summer Breakfast Combo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 rounded-xl border-0 bg-[#eceef2] shadow-none"
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Description
                </Label>
                <Input
                  placeholder="eg; Start your day with our fresh bakery & tea combo"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-11 rounded-xl border-0 bg-[#eceef2] shadow-none"
                />
              </div>

              <div>
                <Label className="mb-3 block text-sm font-medium">
                  Offer validity period
                </Label>
                <div className="flex flex-wrap gap-6">
                  <DatePartsRow label="Start" value={start} onChange={setStart} />
                  <DatePartsRow label="End" value={end} onChange={setEnd} />
                </div>
                {(start.dd || start.mm || start.yyyy || end.dd || end.mm || end.yyyy) &&
                  !dateValidation.ok && (
                    <p className="mt-2 text-sm text-spar-red">
                      {dateValidation.message}
                    </p>
                  )}
              </div>

              <Button
                type="button"
                disabled={!canStep1}
                onClick={() => setStep(2)}
                className="mt-2 h-12 w-full rounded-xl bg-spar-green text-base font-semibold text-white hover:bg-spar-green-dark disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold">2. Select Product</h2>

              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected(null);
                  }}
                  className="h-11 rounded-full border-0 bg-[#eceef2] pl-9 shadow-none"
                />
              </div>

              {results.length > 0 && (
                <div className="flex flex-col gap-2">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className="flex items-center gap-3 rounded-2xl bg-[#eceef2] px-3 py-3 text-left transition hover:bg-[#e3e5ea]"
                    >
                      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={56}
                          className="h-12 w-auto object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {product.brand}
                        </p>
                        <p className="truncate text-sm font-semibold">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.volume}
                        </p>
                      </div>
                      <div className="shrink-0 text-sm">
                        <span className="font-bold">
                          {formatMoney(product.price)}
                        </span>
                        {product.compareAtPrice != null && (
                          <span className="ml-1.5 text-xs text-muted-foreground line-through">
                            {formatMoney(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selected && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-[#eceef2] px-3 py-3">
                    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                      <Image
                        src={selected.image}
                        alt={selected.name}
                        width={48}
                        height={56}
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {selected.brand}
                      </p>
                      <p className="truncate text-sm font-semibold">
                        {selected.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selected.volume}
                      </p>
                    </div>
                    <div className="shrink-0 text-sm">
                      <span className="font-bold">
                        {formatMoney(selected.price)}
                      </span>
                      <span className="ml-1.5 text-xs text-muted-foreground line-through">
                        {formatMoney(
                          selected.compareAtPrice ?? selected.price
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Quantity
                      </Label>
                      <Input
                        inputMode="numeric"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(e.target.value.replace(/\D/g, ""))
                        }
                        className="h-11 rounded-xl border-0 bg-[#eceef2] shadow-none"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Discount
                      </Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                          €
                        </span>
                        <Input
                          inputMode="decimal"
                          placeholder="0.00"
                          value={discount}
                          onChange={(e) =>
                            setDiscount(e.target.value.replace(/[^\d.]/g, ""))
                          }
                          className="h-11 rounded-xl border-0 bg-[#eceef2] pl-8 shadow-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!canAddProduct}
                  onClick={handleAddProduct}
                  className="h-10 rounded-full border-spar-green px-8 text-spar-green hover:bg-spar-green/5 hover:text-spar-green disabled:opacity-40"
                >
                  Add Product
                </Button>
              </div>

              {products.length > 0 && (
                <div className="flex flex-col gap-2">
                  {products.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="relative flex items-center gap-3 rounded-2xl bg-[#eceef2] px-3 py-3 pr-10"
                    >
                      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={48}
                          height={56}
                          className="h-12 w-auto object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {item.brand}
                        </p>
                        <p className="truncate text-sm font-semibold">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.volume}
                        </p>
                        <p className="mt-0.5 text-sm">
                          <span className="font-bold">
                            {formatMoney(item.price)}
                          </span>
                          <span className="ml-1.5 text-xs text-muted-foreground line-through">
                            {formatMoney(item.price)}
                          </span>
                        </p>
                        <span className="mt-1 inline-flex rounded-full bg-[#49AE20] px-2 py-0.5 text-[11px] font-semibold text-white">
                          {item.quantity} for {formatEuroBadge(item.offerPrice)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProducts((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-2 right-2 text-spar-red transition-opacity hover:opacity-70"
                        aria-label="Remove product"
                      >
                        <Image
                          src="/products/delete.svg"
                          alt=""
                          width={16}
                          height={16}
                          className="size-4"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="h-12 rounded-xl bg-[#e8e8e8] text-base font-medium text-foreground hover:bg-[#dcdcdc]"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  disabled={!canSave}
                  onClick={() => setConfirmOpen(true)}
                  className="h-12 rounded-xl bg-spar-green text-base font-semibold text-white hover:bg-spar-green-dark disabled:opacity-40"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Save Action"
        message={`Please confirm if you want to save the Offer record of ${title.trim() || "this offer"}.`}
        onConfirm={handleConfirmSave}
      />
    </>
  );
}
