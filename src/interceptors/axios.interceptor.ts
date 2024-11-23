// import { LocalStorageKeys } from "@/models";
// import { SnackbarUtilities, customAxiosError, getLocalStore } from "@/utilities";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/hooks";

/** Interceptor para la autenticación */
export const AxiosInterceptor = () => {
  const updateHeader = (request: InternalAxiosRequestConfig) => {
    const { auth, type } = useAuthStore.getState();
    request.headers["Content-Type"] = "application/json";
    if (type) request.headers.Authorization = `Bearer ${auth.accessToken}`;
    return request;
  };

  axios.interceptors.request.use((request) => {
    if (request.url?.includes("assets")) return request;
    return updateHeader(request);
  });

  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status === 401 && originalRequest && originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { type, refreshAccessToken } = useAuthStore.getState();
          if (type) await refreshAccessToken();
          return axios(originalRequest);
        } catch (refreshError) {
          // if (accessToken) window.location.href = "/login";
          console.log(refreshError);
        }
      }
      // if (error.code !== "ERR_CANCELED") SnackbarUtilities.error(customAxiosError(error.code));
      return Promise.reject(error);
    }
  );
};
