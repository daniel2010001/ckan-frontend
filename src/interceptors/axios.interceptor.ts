// import { LocalStorageKeys } from "@/models";
// import { SnackbarUtilities, customAxiosError, getLocalStore } from "@/utilities";
// import { useUserStore } from "@/hooks";
import axios, { InternalAxiosRequestConfig } from "axios";

/** Interceptor para la autenticación */
export const AxiosInterceptor = () => {
  const updateHeader = (request: InternalAxiosRequestConfig) => {
    // const user = useUserStore();
    // if (auth?.isAuthed) request.headers["x-access-token"] = auth.token;
    request.headers["Content-Type"] = "application/json";
    return request;
  };

  axios.interceptors.request.use((request) => {
    if (request.url?.includes("assets")) return request;
    return updateHeader(request);
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // if (error.code !== "ERR_CANCELED") SnackbarUtilities.error(customAxiosError(error.code));
      return Promise.reject(error);
    }
  );
};
