import { AxiosResponse } from "axios";

export interface AxiosCall<T> {
  call: Promise<AxiosResponse<T, any>>;
  controller: AbortController;
}
