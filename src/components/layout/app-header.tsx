"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { PAGE_TITLES } from "@/lib/constants/nav";
import { Input } from "@/components/ui/input";

interface AppHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

export function AppHeader({
  searchValue,
  onSearchChange,
  showSearch = true,
}: AppHeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <header className="mx-4 mt-4 shrink-0 sm:mx-6">
      <div className="flex items-center justify-between gap-4 rounded-full bg-[#eceef2] px-5 py-2.5">
        <h1 className="min-w-0 shrink text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </h1>

        {showSearch && (
          <div className="relative mx-auto w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="h-9 rounded-full border-0 bg-white pl-9 shadow-none focus-visible:ring-spar-green/20"
            />
          </div>
        )}

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
    </header>
  );
}
