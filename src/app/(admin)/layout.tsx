"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import {
  AdminChromeProvider,
  useAdminChrome,
} from "@/components/layout/admin-chrome";

const PAGES_WITH_OWN_HEADER = [
  "/dashboard",
  "/products",
  "/offers",
  "/customers",
  "/sales",
  "/users",
  "/orders",
] as const;

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { search, setSearch } = useAdminChrome();

  const hideGlobalHeader = PAGES_WITH_OWN_HEADER.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        {!hideGlobalHeader && (
          <AppHeader searchValue={search} onSearchChange={setSearch} />
        )}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white px-4 pt-4 pb-4 sm:px-6">
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminChromeProvider>
      <AdminShell>{children}</AdminShell>
    </AdminChromeProvider>
  );
}
