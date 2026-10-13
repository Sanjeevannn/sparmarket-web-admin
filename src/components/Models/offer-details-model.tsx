"use client";

import Image from "next/image";
import { Calendar, FileText, X } from "lucide-react";
import type { OfferItem } from "@/types/offer";
import { isOfferExpired } from "@/lib/offer-dates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface OfferDetailsModelProps {
  open: boolean;
  offer: OfferItem | null;
  onOpenChange: (open: boolean) => void;
  onEdit?: (offer: OfferItem) => void;
  onDelete: (offer: OfferItem) => void;
  onStatusChange: (offerId: string, active: boolean) => void;
}

function formatEuro(price: number) {
  return `€ ${price.toFixed(2).replace(".", ",")}`;
}

function formatMoney(price: number) {
  return `$${price.toFixed(2)}`;
}

export function OfferDetailsModel({
  open,
  offer,
  onOpenChange,
  onEdit,
  onDelete,
  onStatusChange,
}: OfferDetailsModelProps) {
  if (!offer) return null;

  const expired = isOfferExpired(offer.validityTo);
  const isActive = offer.status === "active" && !expired;
  const isCombo = offer.kind === "combo";
  const displayName =
    !isCombo &&
    offer.brand &&
    !offer.title.toLowerCase().includes(offer.brand.toLowerCase())
      ? `${offer.brand} ${offer.title}`
      : offer.title;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl p-6 sm:max-w-xl"
      >
        <DialogHeader className="mb-2 space-y-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <DialogTitle className="text-xl font-semibold">
                {displayName}
              </DialogTitle>
              <Badge
                className={
                  expired
                    ? "rounded-full bg-amber-600 text-white"
                    : isActive
                      ? "rounded-full bg-spar-green text-white"
                      : "rounded-full bg-spar-red text-white"
                }
              >
                {expired ? "Expired" : isActive ? "Active" : "Inactive"}
              </Badge>
              {!expired && (
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    onStatusChange(offer.id, checked)
                  }
                  className="data-checked:bg-spar-green"
                />
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {onEdit && (
                <Button
                  type="button"
                  className="h-9 rounded-xl bg-spar-green px-5 text-white hover:bg-spar-green-dark"
                  onClick={() => onEdit(offer)}
                >
                  Edit
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 border-spar-red"
                onClick={() => onDelete(offer)}
                aria-label="Delete offer"
              >
                <Image
                  src="/products/delete.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="size-[18px]"
                />
              </Button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-spar-green transition-opacity hover:opacity-70"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </DialogHeader>

        {isCombo ? (
          <>
            <div className="overflow-hidden rounded-2xl bg-[#eceef2]">
              <Image
                src={offer.image}
                alt={offer.title}
                width={640}
                height={280}
                unoptimized={offer.image.startsWith("data:")}
                className="h-[200px] w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold">{offer.title}</p>
              <Badge className="rounded-full bg-violet-500 text-white hover:bg-violet-500">
                For {formatEuro(offer.price)}
              </Badge>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#eceef2] px-3 py-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              Validity: {offer.validityFrom} - {offer.validityTo}
              {expired ? (
                <span className="font-semibold text-amber-700">· Expired</span>
              ) : null}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Description</p>
              <div className="rounded-2xl bg-[#eceef2] px-4 py-4">
                <div className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                  <FileText className="mt-0.5 size-4 shrink-0 text-spar-green" />
                  <p>
                    {offer.description ||
                      "No description available for this offer."}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Products</p>
              {(offer.products?.length ?? 0) > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {offer.products!.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex items-center gap-2 rounded-2xl bg-[#eceef2] p-2.5"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={40}
                          height={48}
                          className="h-10 w-auto object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {item.brand}
                        </p>
                        <p className="truncate text-xs font-semibold">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.volume}
                        </p>
                        <div className="mt-0.5 flex items-center justify-between gap-1">
                          <span className="text-xs font-bold">
                            {formatMoney(item.price)}
                          </span>
                          <span className="text-[11px] font-bold">
                            QTY: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#eceef2] px-4 py-6 text-center text-sm text-muted-foreground">
                  No products linked to this offer.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-[#eceef2] p-6">
              <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-sm">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  width={200}
                  height={240}
                  unoptimized={offer.image.startsWith("data:")}
                  className="max-h-[200px] w-auto object-contain"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold">{displayName}</p>
              {offer.volume && (
                <Badge className="rounded-full bg-amber-500 text-white hover:bg-amber-500">
                  {offer.volume}
                </Badge>
              )}
              <Badge className="rounded-full bg-violet-500 text-white hover:bg-violet-500">
                {offer.compareAtPrice != null
                  ? `${formatEuro(offer.compareAtPrice)} ${formatEuro(offer.price)}`
                  : formatEuro(offer.price)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#eceef2] px-4 py-4">
              <div>
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Brand
                </p>
                <p className="mt-1 text-sm font-medium">{offer.brand ?? "—"}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Category
                </p>
                <p className="mt-1 text-sm font-medium">{offer.category}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Sub Category
                </p>
                <p className="mt-1 text-sm font-medium">
                  {offer.subCategory ?? "—"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#eceef2] px-4 py-4">
              <p className="mb-2 text-sm font-semibold">About this product</p>
              <div className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <FileText className="mt-0.5 size-4 shrink-0 text-spar-green" />
                <p>
                  {offer.description ||
                    "No description available for this offer."}
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Validity: {offer.validityFrom} – {offer.validityTo}
              {expired ? (
                <span className="font-semibold text-amber-700"> · Expired</span>
              ) : null}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
