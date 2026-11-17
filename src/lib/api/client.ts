import { API_BASE_URL } from "@/lib/api/config";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/lib/api/storage";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
  formData?: FormData;
};

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.accessToken) {
      clearAuthSession();
      return null;
    }
    setAccessToken(data.accessToken as string);
    return data.accessToken as string;
  } catch {
    clearAuthSession();
    return null;
  }
}

async function ensureFreshToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = true, formData, headers, ...rest } = options;
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const finalHeaders = new Headers(headers);
  if (!formData && body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const init: RequestInit = {
    ...rest,
    headers: finalHeaders,
    body: formData
      ? formData
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  };

  let res = await fetch(url, init);

  if (res.status === 401 && auth) {
    const newToken = await ensureFreshToken();
    if (newToken) {
      finalHeaders.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(url, { ...init, headers: finalHeaders });
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearAuthSession();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    throw new ApiError(
      (data as { message?: string })?.message || "Request failed",
      res.status,
      data
    );
  }

  return data as T;
}
