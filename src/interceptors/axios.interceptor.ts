import axios, { AxiosResponse, InternalAxiosRequestConfig, isAxiosError } from "axios";
import { toast } from "sonner";

import { ResponseAdapter } from "@/adapters/ckan";
import { useAuthStore } from "@/hooks";
import { ComponentError, getCustomErrorCode } from "@/utils";

/** Interceptor para la autenticación */
export const AxiosInterceptor = () => {
  const updateHeader = (request: InternalAxiosRequestConfig) => {
    const { auth, type } = useAuthStore.getState();
    if (type) request.headers.Authorization = `Bearer ${auth.accessToken}`;
    if (!request.headers["Content-Type"]) request.headers["Content-Type"] = "application/json";
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
    async (error: unknown) => {
      if (isAxiosError(error) && error.code) {
        const request = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (request && !request._retry && !request.url?.includes("refresh"))
          if (ResponseAdapter.isError(error.response?.data)) {
            toast.error("Error en la petición: ", {
              description: () => ComponentError(error.response?.data.error),
            });
          } else if (error.response?.status === 401) {
            request._retry = true;
            const { type, logout, refreshAccessToken, reset } = useAuthStore.getState();
            if (type)
              if (await refreshAccessToken()) return await axios(request);
              else if (!(await logout())) reset(); // sesión expirada
          } else if (!request?.signal?.aborted) {
            toast.error("Ah ocurrido un error inesperado!", {
              description: getCustomErrorCode(error.code),
            });
          }
      } else console.error("Error Interceptor", error);
      return Promise.reject(error);
    }
  );
};
