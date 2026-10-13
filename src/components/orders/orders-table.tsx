"use client";

import { Eye } from "lucide-react";
import type { OrderItem } from "@/types/order";
import { statusBadgeClass, statusLabel } from "@/lib/order-process";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrdersTableProps {
  orders: OrderItem[];
  onView?: (order: OrderItem) => void;
}

function formatEuro(value: number) {
  return `€ ${value.toFixed(2)}`;
}

export function OrdersTable({ orders, onView }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Order ID
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Customer name
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Item
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Amount
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
          {orders.map((order) => (
            <TableRow key={order.id} className="border-border">
              <TableCell className="h-14 px-4 text-sm font-medium">
                {order.orderId}
              </TableCell>
              <TableCell className="h-14 px-4">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-[#e8f5ee] text-xs font-semibold text-spar-green">
                      {order.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {order.customerName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                {order.email}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm font-medium">
                {order.itemCount}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm font-medium">
                {formatEuro(order.amount)}
              </TableCell>
              <TableCell className="h-14 px-4">
                <Badge className={statusBadgeClass(order.status)}>
                  {statusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="h-14 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onView?.(order)}
                  className="inline-flex size-8 items-center justify-center rounded-full text-[#49AE20] transition hover:bg-[#e8f5ee]"
                  aria-label={`View ${order.orderId}`}
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
