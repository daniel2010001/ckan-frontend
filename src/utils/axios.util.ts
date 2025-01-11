import axios, { AxiosRequestConfig, isAxiosError, Method } from "axios";

import { AxiosCall, Call, codeMatcher } from "@/models";

export function loadAbort(): AbortController {
  return new AbortController();
}

export async function loadAbortable<T = unknown, D = undefined>({
  call,
  controller,
}: AxiosCall<T, D>) {
  let value: Awaited<AxiosCall<T, D>["call"]>;
  try {
    value = await call;
    controller?.abort();
  } catch (e) {
    if (isAxiosError<T, D>(e)) value = e;
    else return;
  }
  return value;
}

export function createAxiosCall<T = unknown, D = undefined>(
  method: Method,
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
): AxiosCall<T, D> | never {
  const controller = loadAbort();
  let call = axios<T, Call<T, D>, D>({
    method,
    url,
    data,
    baseURL: import.meta.env.VITE_BACKEND,
    signal: controller.signal,
    ...config,
  });
  const resolved = (data: T) => (call = new Promise((resolve) => resolve({ data } as Call<T, D>)));
  return { call, controller, resolved };
}

/**
 * Función para obtener el mensaje de error personalizado de un código de error
 * @param code Código de error
 * @returns Mensaje de error personalizado
 */
export function getCustomErrorCode(code: string): string {
  const response = codeMatcher[code];
  if (!response) console.log(code);
  return codeMatcher[code] || codeMatcher.ERR_UNKNOWN;
}
