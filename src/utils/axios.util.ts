import axios, { AxiosRequestConfig, Method } from "axios";

import { AxiosCall, codeMatcher } from "@/models";

export function loadAbort(): AbortController {
  return new AbortController();
}

export async function loadAbortable<T = unknown, D = undefined>({
  call,
  controller,
}: AxiosCall<T, D>) {
  const value = await call?.catch((error) => error);
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
  const call = axios<T, Awaited<AxiosCall<T, D>["call"]>, D>({
    method,
    url,
    data,
    ...config,
    signal: controller.signal,
  });
  return { call, controller };
}

/**
 * Función para obtener el mensaje de error personalizado de un código de error
 * @param code Código de error
 * @returns Mensaje de error personalizado
 */
export function getCustomError(code: string): string {
  const response = codeMatcher[code];
  if (!response) console.log(code);
  return codeMatcher[code] || codeMatcher.ERR_UNKNOWN;
}
