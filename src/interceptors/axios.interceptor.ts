import axios, { AxiosResponse, InternalAxiosRequestConfig, isAxiosError } from "axios";

import { ResponseAdapter } from "@/adapters/ckan";
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
    (response: AxiosResponse) => {
      if (ResponseAdapter.isResponse(response.data)) {
        const ckanResponse = response.data;
        if (ResponseAdapter.isError(ckanResponse)) throw ckanResponse.error;
        response.data = ResponseAdapter.toResponse(ckanResponse);
      }
      return response;
    },
    async (error: any) => {
      if (isAxiosError(error) && error.code) {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (originalRequest && !originalRequest._retry && !originalRequest.url?.includes("refresh"))
          if (error.response?.data?.success === false)
            console.log("Error request", error.response.data.error);
          else if (error.response?.status === 401) {
            originalRequest._retry = true;
            const { type, logout, refreshAccessToken, reset } = useAuthStore.getState();
            if (type) {
              if (await refreshAccessToken()) return await axios(originalRequest);
              else if (!(await logout())) reset(); // sesión expirada
            } else window.location.href = BaseRoutes.LOGIN;
          } else if (!originalRequest?.signal?.aborted) console.log(getCustomError(error.code));
      } else console.error("Error Interceptor", error);
      return Promise.reject(error);
    }
  );
};
