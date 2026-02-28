import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST INTERCEPTOR ───────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ──────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // No response at all — network down or server not running
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        isNetworkError: true,
      });
    }

    const { status } = error.response;

    // 401 — token expired or invalid
    // Redirect to login, but avoid infinite loop if /api/auth/me itself 401s
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't redirect if it's the login or me endpoint itself
      const isAuthEndpoint =
        originalRequest.url.includes("/api/auth/login") ||
        originalRequest.url.includes("/api/auth/me");

      if (!isAuthEndpoint) {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    // 403 — logged in but not admin
    if (status === 403) {
      window.location.href = "/";
      return Promise.reject(error);
    }

    // 408 or timeout
    if (status === 408 || error.code === "ECONNABORTED") {
      return Promise.reject({
        message: "Request timed out. Please try again.",
        isTimeout: true,
      });
    }

    // 500+ — server error
    if (status >= 500) {
      return Promise.reject({
        message: "Something went wrong on our end. Please try again later.",
        isServerError: true,
        status,
      });
    }

    // Everything else — pass the backend's error message through
    // so your UI can display it (e.g. "Invalid credentials", "Out of stock")
    return Promise.reject(error);
  }
);

export default axiosInstance;