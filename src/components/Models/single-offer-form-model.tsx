"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import type { Product } from "@/types/product";
import type { SingleOfferFormResult, SingleOfferLine } from "@/types/offer";
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
import { cn } from "cn";
import {
  EMPTY_DATE_PARTS,
  formatDateParts,
  type DateParts,
  validateOfferDateRange,
} from "@/lib/offer-dates";

function formatMoney(price: number) {
  return `$${price.toFixed(2)}`;
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
            onChange({ ...value, dd: e.target.value.replace(/\D/g, "").slice(0, 2) })
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
            onChange({ ...value, mm: e.target.value.replace(/\D/g, "").slice(0, 2) })
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

function ProductRow({
  product,
  price,
  onClick,
  onRemove,
  className,
}: {
  product: Pick<
    Product,
    "brand" | "name" | "volume" | "image" | "price" | "compareAtPrice"
  >;
  price?: number;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}) {
  const displayPrice = price ?? product.price;
  const compare = product.compareAtPrice ?? product.price;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "relative flex items-center gap-3 rounded-2xl bg-[#eceef2] px-3 py-3",
        onClick && "cursor-pointer transition hover:bg-[#e3e5ea]",
        className
      )}
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
        <p className="truncate text-sm font-semibold text-foreground">
          {product.name}
        </p>
        <p className="text-xs text-muted-foreground">{product.volume}</p>
      </div>
      <div className="shrink-0 text-right text-sm">
        <span className="font-bold text-foreground">
          {formatMoney(displayPrice)}
        </span>
        <span className="ml-1.5 text-xs text-muted-foreground line-through">
          {formatMoney(compare)}
        </span>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
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
      )}
    </div>
  );
}

interface SingleOfferFormModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (result: SingleOfferFormResult) => void;
}

export function SingleOfferFormModel({
  open,
  onOpenChange,
  onSave,
}: SingleOfferFormModelProps) {
  const [start, setStart] = useState<DateParts>(EMPTY_DATE_PARTS);
  const [end, setEnd] = useState<DateParts>(EMPTY_DATE_PARTS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [added, setAdded] = useState<SingleOfferLine | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStart(EMPTY_DATE_PARTS);
    setEnd(EMPTY_DATE_PARTS);
    setQuery("");
    setSelected(null);
    setPriceInput("");
    setAdded(null);
    setConfirmOpen(false);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => {
      if (p.status !== "active") return false;
      const hay = `${p.brand} ${p.name} ${p.category} ${p.subCategory}`.toLowerCase();
      return hay.includes(q);
    }).slice(0, 5);
  }, [query]);

  function handleSelectProduct(product: Product) {
    setSelected(product);
    setPriceInput("");
    setQuery(product.name);
  }

  function handleAddLine() {
    if (!selected) return;
    const price = Number(priceInput);
    if (!Number.isFinite(price) || price <= 0) return;

    setAdded({
      productId: selected.id,
      title: selected.name,
      brand: selected.brand,
      volume: selected.volume,
      image: selected.image,
      category: selected.category,
      subCategory: selected.subCategory,
      description: selected.description,
      compareAtPrice: selected.compareAtPrice ?? selected.price,
      price,
    });
    setSelected(null);
    setPriceInput("");
    setQuery("");
  }

  function handleNext() {
    if (!added) return;
    const dateCheck = validateOfferDateRange(start, end);
    if (!dateCheck.ok) return;
    setConfirmOpen(true);
  }

  function handleConfirmSave() {
    if (!added) return;
    const dateCheck = validateOfferDateRange(start, end);
    if (!dateCheck.ok) return;
    onSave({
      validityFrom: formatDateParts(start),
      validityTo: formatDateParts(end),
      line: added,
    });
    onOpenChange(false);
  }

  const canAdd =
    !!selected && Number(priceInput) > 0 && Number.isFinite(Number(priceInput));
  const dateValidation = validateOfferDateRange(start, end);
  const canSave = !!added && dateValidation.ok;

  const confirmName = added
    ? added.title.includes(added.brand)
      ? added.title
      : `${added.brand} ${added.title}`
    : "this offer";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:max-w-lg"
        >
          <DialogHeader className="mb-4 space-y-0">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-xl font-semibold text-spar-green">
                Add Single Offer
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

          <div className="flex flex-col gap-5">
            <div>
              <Label className="mb-3 block text-sm font-medium text-foreground">
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

            <div>
              <Label className="mb-2 block text-sm font-medium text-foreground">
                Select Product
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-spar-green" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected(null);
                    setPriceInput("");
                  }}
                  className="h-11 rounded-full border-0 bg-[#eceef2] pl-9 shadow-none"
                />
              </div>

              {results.length > 0 && !selected && (
                <div className="mt-3 flex flex-col gap-2">
                  {results.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onClick={() => handleSelectProduct(product)}
                    />
                  ))}
                </div>
              )}

              {selected && (
                <div className="mt-3 flex flex-col gap-3">
                  <ProductRow product={selected} />
                  <div>
                    <Label className="mb-2 block text-sm font-medium">
                      Price
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                        €
                      </span>
                      <Input
                        inputMode="decimal"
                        placeholder="0.00"
                        value={priceInput}
                        onChange={(e) =>
                          setPriceInput(
                            e.target.value.replace(/[^\d.]/g, "")
                          )
                        }
                        className="h-11 rounded-xl border-0 bg-[#eceef2] pl-8 shadow-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                disabled={!canAdd}
                onClick={handleAddLine}
                className="h-10 rounded-full border-spar-green px-8 text-spar-green hover:bg-spar-green/5 hover:text-spar-green disabled:opacity-40"
              >
                {selected ? "Add" : "Add Offer"}
              </Button>
            </div>

            {added && (
              <ProductRow
                product={{
                  brand: added.brand,
                  name: added.title,
                  volume: added.volume,
                  image: added.image,
                  price: added.price,
                  compareAtPrice: added.compareAtPrice,
                }}
                price={added.price}
                onRemove={() => setAdded(null)}
                className="pr-10"
              />
            )}

            <Button
              type="button"
              disabled={!canSave}
              onClick={handleNext}
              className="h-12 w-full rounded-xl bg-spar-green text-base font-semibold text-white hover:bg-spar-green-dark disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Save Action"
        message={`Please confirm if you want to save the Offer record of ${confirmName}.`}
        onConfirm={handleConfirmSave}
      />
    </>
  );
}
