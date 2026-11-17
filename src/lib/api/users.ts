import { apiRequest } from "@/lib/api/client";
import { mapApiUser } from "@/lib/api/mappers";
import type { AppUser, UserFormValues, UserStatus } from "@/types/user";

interface UsersResponse {
  success: boolean;
  users?: Record<string, unknown>[];
  data?: Record<string, unknown>[];
}

interface UserResponse {
  success: boolean;
  user: Record<string, unknown>;
}

function listFrom(data: UsersResponse) {
  return data.users || data.data || [];
}

export async function fetchUsers(): Promise<AppUser[]> {
  const data = await apiRequest<UsersResponse>(
    "/api/admin/users/?limit=100"
  );
  return listFrom(data).map((u) => mapApiUser(u));
}

export async function createUserApi(values: UserFormValues) {
  const data = await apiRequest<UserResponse>("/api/admin/users/", {
    method: "POST",
    body: {
      username: values.username.trim(),
      managerName: values.manager.trim(),
      password: values.password,
      role: "CASHIER",
    },
  });
  return mapApiUser(data.user);
}

export async function updateUserApi(userId: string, values: UserFormValues) {
  const body: Record<string, string> = {
    username: values.username.trim(),
    managerName: values.manager.trim(),
  };
  if (values.password) {
    body.password = values.password;
  }

  const data = await apiRequest<UserResponse>(`/api/admin/users/${userId}`, {
    method: "PUT",
    body,
  });
  return mapApiUser(data.user);
}

export async function updateUserStatusApi(
  userId: string,
  status: UserStatus
) {
  const data = await apiRequest<UserResponse>(
    `/api/admin/users/${userId}/status`,
    {
      method: "PATCH",
      body: { isActive: status === "active" },
    }
  );
  return mapApiUser(data.user);
}

export async function deleteUserApi(userId: string) {
  await apiRequest(`/api/admin/users/${userId}`, { method: "DELETE" });
}
