import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

import { AxiosCall } from "@/models";

export function loadAbort(): AbortController {
  return new AbortController();
}

export async function loadAbortable<T, D = any>({ call, controller }: AxiosCall<T, D>) {
  const value = await call;
  controller?.abort();
  return value;
}

export function createAxiosCall<T = unknown, D = undefined>(
  method: Method,
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
): AxiosCall<T, D> | never {
  const controller = loadAbort();
  const call = axios<T, AxiosResponse<T, D>, D>({
    method,
    url,
    data,
    ...config,
    signal: controller.signal,
  });
  return { call, controller };
}
