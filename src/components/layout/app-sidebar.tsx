"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "cn";
import { ADMIN_NAV } from "@/lib/constants/nav";
import { SparLogo } from "@/components/layout/spar-logo";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col rounded-r-3xl bg-spar-green text-white">
      <div className="flex items-center px-5 py-6">
        <SparLogo />
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
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-red-400 hover:bg-white/10 hover:text-red-300"
          onClick={() => router.push("/login")}
        >
          <LogOut className="size-[18px]" strokeWidth={1.75} />
          Log out
        </Button>
      </div>
    </aside>
  );
}
