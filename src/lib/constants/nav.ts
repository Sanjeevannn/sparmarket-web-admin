import {
  LayoutDashboard,
  Package,
  Tag,
  TrendingUp,
  ShoppingCart,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Product", href: "/products", icon: Package },
  { title: "Offer", href: "/offers", icon: Tag },
  { title: "Sales", href: "/sales", icon: TrendingUp },
  { title: "Orders", href: "/orders", icon: ShoppingCart },
  { title: "Users", href: "/users", icon: Users },
  { title: "Customers", href: "/customers", icon: UserRound },
];

export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Product management",
  "/offers": "Offer management",
  "/sales": "Sales management",
  "/orders": "Order management",
  "/users": "User management",
  "/customers": "Customers",
};
