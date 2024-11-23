import { AxiosError, AxiosResponse } from "axios";
export interface AxiosCall<T, D = undefined> {
  call: Promise<AxiosResponse<T, D> | AxiosError<T, D>>;
  controller: AbortController;
}
