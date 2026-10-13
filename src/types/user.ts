export type UserStatus = "active" | "inactive";
export type UserRole = "admin" | "cashier";

export interface AppUser {
  id: string;
  username: string;
  manager: string;
  createdAt: string;
  status: UserStatus;
  role: UserRole;
  password?: string;
}

export interface UserFormValues {
  manager: string;
  username: string;
  password: string;
  confirmPassword: string;
}
