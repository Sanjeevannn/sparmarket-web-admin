"use client";

import Image from "next/image";
import { FileText, X } from "lucide-react";
import type { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface ProductDetailsModelProps {
  open: boolean;
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onStatusChange: (productId: string, active: boolean) => void;
}

function formatEuro(price: number) {
  return `€ ${price.toFixed(2).replace(".", ",")}`;
}

export function ProductDetailsModel({
  open,
  product,
  onOpenChange,
  onEdit,
  onDelete,
  onStatusChange,
}: ProductDetailsModelProps) {
  if (!product) return null;

  const isActive = product.status === "active";
  const displayName = product.name.includes(product.brand)
    ? product.name
    : `${product.brand} ${product.name}`;

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
                  isActive
                    ? "rounded-full bg-spar-green text-white"
                    : "rounded-full bg-spar-red text-white"
                }
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
              <Switch
                checked={isActive}
                onCheckedChange={(checked) =>
                  onStatusChange(product.id, checked)
                }
                className="data-checked:bg-spar-green"
              />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                className="h-9 rounded-xl bg-spar-green px-5 text-white hover:bg-spar-green-dark"
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 border-spar-red"
                onClick={() => onDelete(product)}
                aria-label="Delete product"
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

        <div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-[#f3f4f6] p-6">
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={240}
            unoptimized={product.image.startsWith("data:")}
            className="max-h-[220px] w-auto object-contain"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base font-semibold">{displayName}</p>
          <Badge className="rounded-full bg-amber-500 text-white hover:bg-amber-500">
            {product.volume}
          </Badge>
          <Badge className="rounded-full bg-violet-500 text-white hover:bg-violet-500">
            {formatEuro(product.price)}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#f3f4f6] px-4 py-4">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Brand
            </p>
            <p className="mt-1 text-sm font-medium">{product.brand}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Category
            </p>
            <p className="mt-1 text-sm font-medium">{product.category}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Sub Category
            </p>
            <p className="mt-1 text-sm font-medium">{product.subCategory}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#f3f4f6] px-4 py-4">
          <p className="mb-2 text-sm font-semibold">About this product</p>
          <div className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <FileText className="mt-0.5 size-4 shrink-0 text-spar-green" />
            <p>{product.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
