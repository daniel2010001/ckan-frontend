import axios, { AxiosResponse, InternalAxiosRequestConfig, isAxiosError } from "axios";

import { useAuthStore } from "@/hooks";
import { BaseRoutes } from "@/models";
import { getCustomError } from "@/utils";

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
    async (error: any) => {
      if (isAxiosError(error) && error.code) {
        // if (error.signal?.aborted) SnackbarUtilities.error(customAxiosError(error.code));
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (originalRequest && !originalRequest._retry && !originalRequest.url?.includes("refresh"))
          if (!error.response?.data?.success) console.log(error.response?.data?.error?.message);
          else if (error.response?.status === 401) {
            originalRequest._retry = true;
            const { type, logout, refreshAccessToken, reset } = useAuthStore.getState();
            if (type) {
              if (await refreshAccessToken()) return await axios(originalRequest);
              else if (!(await logout())) reset(); // sesión expirada
            } else window.location.href = BaseRoutes.LOGIN;
          } else if (!error.config?.signal?.aborted) console.log(getCustomError(error.code));
      } else console.error("Error Interceptor", error);
      return Promise.reject(error);
    }
  );
};
