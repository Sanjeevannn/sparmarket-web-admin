"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { AppUser, UserStatus } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "cn";

interface UsersTableProps {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onDelete: (user: AppUser) => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

export function UsersTable({
  users,
  onEdit,
  onDelete,
  onStatusChange,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Username
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Manager
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Created at
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="h-12 px-4 text-xs font-semibold text-muted-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isActive = user.status === "active";
            return (
              <TableRow key={user.id} className="border-border">
                <TableCell className="h-14 px-4 text-sm font-medium">
                  {user.username}
                </TableCell>
                <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                  {user.manager}
                </TableCell>
                <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                  {user.createdAt}
                </TableCell>
                <TableCell className="h-14 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={cn(
                        "inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-medium text-white outline-none",
                        isActive ? "bg-[#49AE20]" : "bg-red-500"
                      )}
                    >
                      {isActive ? "Active" : "Inactive"}
                      <ChevronDown className="size-3.5 opacity-90" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => onStatusChange(user.id, "active")}
                      >
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(user.id, "inactive")}
                      >
                        Inactive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="h-14 px-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-lg border border-[#07C187] transition hover:bg-[#07C187]/10"
                      onClick={() => onEdit(user)}
                      aria-label={`Edit ${user.username}`}
                    >
                      <Image
                        src="/products/edit.svg"
                        alt=""
                        width={14}
                        height={14}
                        className="size-3.5"
                      />
                    </button>
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-lg border border-red-500 transition hover:bg-red-50"
                      onClick={() => onDelete(user)}
                      aria-label={`Delete ${user.username}`}
                    >
                      <Image
                        src="/products/delete.svg"
                        alt=""
                        width={14}
                        height={14}
                        className="size-3.5"
                      />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
