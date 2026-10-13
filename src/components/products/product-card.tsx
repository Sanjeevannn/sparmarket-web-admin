"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { cn } from "cn";

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export function ProductCard({
  product,
  onClick,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const isActive = product.status === "active";

  return (
    <article
      className="relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#e8e8e8] bg-white transition hover:shadow-sm"
      onClick={() => onClick?.(product)}
    >
      <div className="relative flex h-[110px] items-center justify-center bg-[#f7f7f8]">
        <span
          className={cn(
            "absolute top-2.5 right-2.5 z-10 h-3 w-4 rounded-[4px]",
            isActive ? "bg-[#49AE20]" : "bg-red-500"
          )}
          title={isActive ? "Active" : "Inactive"}
        />
        <Image
          src={product.image}
          alt={product.name}
          width={80}
          height={100}
          unoptimized={product.image.startsWith("data:")}
          className="h-[95px] w-auto object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col px-3 pt-2.5 pb-3">
        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          {product.brand}
        </p>
        <p className="truncate text-sm leading-tight font-semibold text-foreground">
          {product.name}
        </p>
        <p className="text-xs text-muted-foreground">{product.volume}</p>
        <p className="mt-1 text-sm">
          <span className="font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice != null && (
            <span className="ml-1.5 text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="flex h-9 flex-1 items-center justify-center rounded-lg border border-[#07C187] bg-white transition hover:bg-[#07C187]/10"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(product);
            }}
            aria-label={`Edit ${product.name}`}
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
              onDelete?.(product);
            }}
            aria-label={`Delete ${product.name}`}
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
