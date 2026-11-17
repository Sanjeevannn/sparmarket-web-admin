"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "cn";
import { ADMIN_NAV } from "@/lib/constants/nav";
import { SparLogo } from "@/components/layout/spar-logo";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

function SidebarNav({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-full flex-col bg-spar-green text-white">
      <div className="flex items-center justify-between px-5 py-6">
        <SparLogo />
        {onNavigate ? (
          <button
            type="button"
            className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white md:hidden"
            onClick={onNavigate}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-0">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 py-3 pr-4 pl-5 text-sm transition-colors",
                isActive
                  ? "font-semibold text-white"
                  : "font-normal text-white/80 hover:text-white"
              )}
            >
              {isActive && (
                <span className="absolute top-1/2 left-0 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-white" />
              )}
              <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
              <span className="flex-1">{item.title}</span>
              {isActive && (
                <span className="size-1.5 shrink-0 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        {user?.email && (
          <p className="mb-2 truncate px-3 text-xs text-white/70">{user.email}</p>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-red-400 hover:bg-white/10 hover:text-red-300"
          onClick={async () => {
            await logout();
            onNavigate?.();
            router.replace("/login");
          }}
        >
          <LogOut className="size-[18px]" strokeWidth={1.75} />
          Log out
        </Button>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden h-screen w-[220px] shrink-0 flex-col rounded-r-3xl bg-spar-green text-white md:flex">
        <SidebarNav />
      </aside>

      <div className="fixed top-3 left-3 z-40 md:hidden">
        <Button
          type="button"
          size="icon-sm"
          className="size-10 rounded-full bg-spar-green text-white shadow-md hover:bg-spar-green-dark"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="w-[240px] border-0 bg-spar-green p-0 text-white"
          >
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
