export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5007";

export const ACCESS_TOKEN_KEY = "spar_admin_access_token";
export const REFRESH_TOKEN_KEY = "spar_admin_refresh_token";
export const USER_KEY = "spar_admin_user";
export const ACCESS_COOKIE = "spar_admin_access";
