"use client";

import { Eye } from "lucide-react";
import type { Customer } from "@/types/customer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CustomerDirectoryProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
}

function formatEuro(value: number) {
  return `€ ${value.toFixed(2)}`;
}

export function CustomerDirectory({
  customers,
  onView,
}: CustomerDirectoryProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Customer name
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Phone number
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Orders
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Spend
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="h-12 px-4 text-center text-xs font-semibold text-muted-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="border-border">
              <TableCell className="h-14 px-4">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8">
                    {customer.avatar && (
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                    )}
                    <AvatarFallback className="bg-[#e8f5ee] text-xs font-semibold text-spar-green">
                      {customer.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{customer.name}</span>
                </div>
              </TableCell>
              <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                {customer.email}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                {customer.phone}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm font-medium">
                {customer.orders}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm font-medium">
                {formatEuro(customer.spend)}
              </TableCell>
              <TableCell className="h-14 px-4">
                <Badge
                  className={
                    customer.status === "active"
                      ? "rounded-full bg-[#49AE20] px-2.5 text-white hover:bg-[#49AE20]"
                      : "rounded-full bg-red-500 px-2.5 text-white hover:bg-red-500"
                  }
                >
                  {customer.status === "active" ? "Active" : "Account closed"}
                </Badge>
              </TableCell>
              <TableCell className="h-14 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onView(customer)}
                  className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-[#f3f4f6] hover:text-spar-green"
                  aria-label={`View ${customer.name}`}
                >
                  <Eye className="size-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
