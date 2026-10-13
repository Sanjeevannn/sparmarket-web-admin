"use client";

import type { SaleItem } from "@/types/sales";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SalesTableProps {
  items: SaleItem[];
}

function formatEuro(value: number) {
  return `€ ${value.toFixed(2)}`;
}

export function SalesTable({ items }: SalesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Item Name
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Brand
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Category
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Sub Category
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Unit
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Revenue
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-border">
              <TableCell className="h-14 px-4 text-sm font-medium">
                {item.itemName}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                {item.brand}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                {item.category}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                {item.subCategory}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                {item.unit}
              </TableCell>
              <TableCell className="h-14 px-4 text-sm font-medium">
                {formatEuro(item.revenue)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
