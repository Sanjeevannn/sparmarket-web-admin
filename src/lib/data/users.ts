import type { AppUser } from "@/types/user";

export const USERS: AppUser[] = Array.from({ length: 30 }, (_, i) => ({
  id: `user-${i + 1}`,
  username: `Admin${(i % 5) + 1}`,
  manager: "Kishana",
  createdAt: "12/02/2025",
  status: i >= 28 ? "inactive" : "active",
  role: i % 4 === 0 ? "cashier" : "admin",
}));

export const USER_STATS = {
  totalBranch: 10,
  totalUsers: 45,
  admin: 35,
  cashier: 10,
};
