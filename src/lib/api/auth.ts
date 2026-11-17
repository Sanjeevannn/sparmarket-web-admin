import { apiRequest } from "@/lib/api/client";
import {
  clearAuthSession,
  getRefreshToken,
  setAuthSession,
  type AuthUser,
} from "@/lib/api/storage";

interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export async function loginAdmin(email: string, password: string) {
  const data = await apiRequest<LoginResponse>("/api/admin/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  });

  setAuthSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  });

  return data.user;
}

export async function logoutAdmin() {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await apiRequest("/api/admin/auth/logout", {
        method: "POST",
        auth: false,
        body: { refreshToken },
      });
    }
  } catch {
    // ignore logout API errors
  } finally {
    clearAuthSession();
  }
}
