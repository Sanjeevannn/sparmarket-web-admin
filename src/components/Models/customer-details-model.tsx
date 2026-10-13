"use client";

import {
  X,
  Phone,
  User,
  VenusAndMars,
  Clock,
  Mail,
  Calendar,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import type { Customer } from "@/types/customer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CustomerDetailsModelProps {
  open: boolean;
  customer: Customer | null;
  onOpenChange: (open: boolean) => void;
}

function formatEuro(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

function InfoItem({
  label,
  icon: Icon,
  value,
  muted,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-2 text-sm">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className={muted ? "text-muted-foreground" : "text-foreground"}>
          {value}
        </span>
      </div>
    </div>
  );
}

export function CustomerDetailsModel({
  open,
  customer,
  onOpenChange,
}: CustomerDetailsModelProps) {
  if (!customer) return null;

  const isActive = customer.status === "active";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:max-w-2xl"
      >
        <DialogHeader className="mb-1 space-y-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-xl font-semibold">
                {customer.name}
              </DialogTitle>
              <Badge
                className={
                  isActive
                    ? "rounded-full bg-[#49AE20] text-white hover:bg-[#49AE20]"
                    : "rounded-full bg-red-500 text-white hover:bg-red-500"
                }
              >
                {isActive ? "Active" : "Account Closed"}
              </Badge>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                className="h-9 rounded-xl bg-spar-green px-4 text-white hover:bg-spar-green-dark"
              >
                Download CSV
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

        {!isActive && customer.closureReason && (
          <div className="rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white">
            Reason: {customer.closureReason}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f3f4f6] px-4 py-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white">
              <ShoppingCart className="size-5 text-spar-green" />
            </span>
            <div>
              <p className="text-xl font-bold leading-none">{customer.orders}</p>
              <p className="mt-1 text-xs text-muted-foreground">Total orders</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#f3f4f6] px-4 py-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white">
              <Wallet className="size-5 text-spar-green" />
            </span>
            <div>
              <p className="text-xl font-bold leading-none">
                {formatEuro(customer.spend)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 gap-5 rounded-2xl bg-[#f3f4f6] px-5 py-5 sm:grid-cols-2">
            <div className="flex flex-col gap-5">
              <InfoItem
                label="Phone number"
                icon={Phone}
                value={customer.phone}
              />
              <InfoItem
                label="Customer name"
                icon={User}
                value={customer.name}
              />
              <InfoItem
                label="Gender"
                icon={VenusAndMars}
                value={customer.gender ?? "Not yet added"}
                muted={!customer.gender}
              />
            </div>
            <div className="flex flex-col gap-5">
              <InfoItem
                label="Account Created"
                icon={Clock}
                value={customer.accountCreated}
              />
              <InfoItem
                label="Email address"
                icon={Mail}
                value={customer.email}
              />
              <InfoItem
                label="Date of Birth"
                icon={Calendar}
                value={customer.dateOfBirth}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
