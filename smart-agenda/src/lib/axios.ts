import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface JwtPayload {
  exp: number;
  purpose: string;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown = null) {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(),
  );
  failedQueue = [];
}

function isTokenExpiringSoon(token: string, thresholdSeconds = 60): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() / 1000 > exp - thresholdSeconds;
  } catch {
    return true;
  }
}

function getAccessTokenFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

let unauthorizedHandled = false;

export function emitUnauthorized() {
  if (unauthorizedHandled) return;
  unauthorizedHandled = true;

  localStorage.removeItem("user");

  window.dispatchEvent(new CustomEvent("unauthorized"));

  setTimeout(() => {
    unauthorizedHandled = false;
    window.location.href = "/login";
  }, 2000);
}

async function refreshTokens(): Promise<void> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    await axiosInstance.post("/auth/refresh");
    processQueue();
  } catch (err) {
    processQueue(err);
    throw err;
  } finally {
    isRefreshing = false;
  }
}
const backend_url = import.meta.env.VITE_API_URL

export const axiosInstance = axios.create({
  baseURL: backend_url,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config) => {
  if (config.url?.includes("/auth/refresh")) return config;
  if (config.url?.includes("/auth/signin")) return config;
  if (config.url?.includes("/auth/signup")) return config;

  const token = getAccessTokenFromCookie();

  if (token && isTokenExpiringSoon(token)) {
    try {
      await refreshTokens();
    } catch {}
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/signin")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshTokens();
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      emitUnauthorized();
      return Promise.reject(refreshError);
    }
  },
);