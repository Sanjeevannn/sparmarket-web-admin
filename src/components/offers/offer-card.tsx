"use client";

import Image from "next/image";
import type { OfferItem } from "@/types/offer";
import { isOfferExpired } from "@/lib/offer-dates";
import { cn } from "cn";

interface OfferCardProps {
  offer: OfferItem;
  onClick?: (offer: OfferItem) => void;
  onEdit?: (offer: OfferItem) => void;
  onDelete?: (offer: OfferItem) => void;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export function OfferCard({ offer, onClick, onEdit, onDelete }: OfferCardProps) {
  const isCombo = offer.kind === "combo";
  const expired = isOfferExpired(offer.validityTo);
  const isActive = offer.status === "active" && !expired;

  return (
    <article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={() => onClick?.(offer)}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(offer);
        }
      }}
      className="relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#e8e8e8] bg-white transition hover:shadow-sm"
    >
      <div
        className={cn(
          "relative flex items-center justify-center bg-[#f7f7f8]",
          isCombo ? "h-[130px]" : "h-[110px]"
        )}
      >
        <span
          className={cn(
            "absolute top-2.5 right-2.5 z-10 h-3 w-4 rounded-[4px]",
            isActive ? "bg-[#49AE20]" : "bg-red-500"
          )}
          title={expired ? "Expired" : isActive ? "Active" : "Inactive"}
        />

        {expired && (
          <span className="absolute right-0 bottom-3 z-10 rotate-[-18deg] bg-amber-600 px-3 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase shadow-sm">
            Expired
          </span>
        )}

        {!expired && offer.soldOut && (
          <span className="absolute right-0 bottom-3 z-10 rotate-[-18deg] bg-red-500 px-3 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase shadow-sm">
            Sold Out
          </span>
        )}

        <Image
          src={offer.image}
          alt={offer.title}
          width={isCombo ? 220 : 80}
          height={isCombo ? 120 : 100}
          className={
            isCombo
              ? "h-full w-full object-cover"
              : "h-[95px] w-auto object-contain"
          }
        />
      </div>

      <div className="flex flex-1 flex-col px-3 pt-2.5 pb-3">
        {offer.brand && (
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            {offer.brand}
          </p>
        )}
        <p className="truncate text-sm leading-tight font-semibold text-foreground">
          {offer.title}
        </p>
        {offer.volume && (
          <p className="text-xs text-muted-foreground">{offer.volume}</p>
        )}
        <p
          className={cn(
            "mt-0.5 text-xs",
            expired ? "font-medium text-amber-700" : "text-muted-foreground"
          )}
        >
          Validity: {offer.validityFrom} - {offer.validityTo}
          {expired ? " · Expired" : ""}
        </p>
        {offer.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {offer.description}
          </p>
        )}
        <p className="mt-1 text-sm">
          <span className="font-bold text-foreground">
            {formatPrice(offer.price)}
          </span>
          {offer.compareAtPrice != null && (
            <span className="ml-1.5 text-xs text-muted-foreground line-through">
              {formatPrice(offer.compareAtPrice)}
            </span>
          )}
        </p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="flex h-9 flex-1 items-center justify-center rounded-lg border border-[#49AE20] bg-white transition hover:bg-[#49AE20]/10"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(offer);
            }}
            aria-label={`Edit ${offer.title}`}
          >
            <Image
              src="/products/edit.svg"
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
          </button>
          <button
            type="button"
            className="flex h-9 flex-1 items-center justify-center rounded-lg border border-red-500 bg-white transition hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(offer);
            }}
            aria-label={`Delete ${offer.title}`}
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
      </div>
    </article>
  );
}
