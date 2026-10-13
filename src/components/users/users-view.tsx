"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  User,
} from "lucide-react";
import { USERS } from "@/lib/data/users";
import type { AppUser, UserFormValues, UserStatus } from "@/types/user";
import { UserStats } from "@/components/users/user-stats";
import { UsersTable } from "@/components/users/users-table";
import { UserFormModel } from "@/components/Models/user-form-model";
import { DeleteConfirmDialog } from "@/components/Dialogs/delete-confirm-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";

const PAGE_SIZE = 10;

function formatToday() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function UsersView() {
  const [users, setUsers] = useState<AppUser[]>(USERS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (q) {
        const hay = `${u.username} ${u.manager}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (status && status !== "all" && u.status !== status) return false;
      return true;
    });
  }, [users, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  const showingFrom = filtered.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PAGE_SIZE, filtered.length);

  function openAdd() {
    setFormMode("add");
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEdit(user: AppUser) {
    setFormMode("edit");
    setEditingUser(user);
    setFormOpen(true);
  }

  function handleSave(values: UserFormValues, userId?: string) {
    if (userId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                manager: values.manager.trim(),
                username: values.username.trim(),
              }
            : u
        )
      );
    } else {
      const created: AppUser = {
        id: `user-${Date.now()}`,
        username: values.username.trim(),
        manager: values.manager.trim(),
        createdAt: formatToday(),
        status: "active",
        role: "admin",
      };
      setUsers((prev) => [created, ...prev]);
      setPage(1);
    }
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function handleStatusChange(userId: string, next: UserStatus) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: next } : u))
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-4 rounded-full bg-[#eceef2] px-5 py-2.5">
          <h1 className="min-w-0 shrink text-lg font-semibold tracking-tight text-foreground">
            User management
          </h1>

          <div className="relative mx-auto w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-full border-0 bg-white pl-9 shadow-none focus-visible:ring-spar-green/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/70 hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-5" strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-spar-red" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="flex size-8 items-center justify-center rounded-full bg-white text-muted-foreground">
                <User className="size-4" strokeWidth={1.75} />
              </span>
              Admin
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 rounded-full bg-[#eceef2] px-4 py-2.5">
          <Select
            value={status || null}
            onValueChange={(v) => {
              setStatus(v ?? "");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 min-w-[120px] gap-2 rounded-full border-0 bg-white shadow-none">
              <Filter className="size-3.5 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            className="h-9 rounded-full bg-spar-green px-5 text-white hover:bg-spar-green-dark"
            onClick={openAdd}
          >
            Add User
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        <UserStats />

        <div className="rounded-[28px] bg-[#eceef2] p-4">
          <UsersTable
            users={pageItems}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onStatusChange={handleStatusChange}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-full bg-white px-4 py-2.5">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {String(showingFrom).padStart(2, "0")}-
                {String(showingTo).padStart(2, "0")}
              </span>{" "}
              of {filtered.length} Users
            </p>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(
                (n) => (
                  <Button
                    key={n}
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      "size-8 rounded-full",
                      n === currentPage &&
                        "bg-[#d8efe3] text-spar-green hover:bg-[#c5e6d4] hover:text-spar-green"
                    )}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </Button>
                )
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <UserFormModel
        open={formOpen}
        mode={formMode}
        user={editingUser}
        onOpenChange={setFormOpen}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
