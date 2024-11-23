import { loadAbort } from "@/utils";
import { AxiosCall } from "@/models";
import axios, { AxiosResponse } from "axios";

const api = import.meta.env.VITE_BACKEND;

export const getPackagesList = (params?: {
  limit: number;
  offset: number;
}): Promise<AxiosResponse<string[], any>> => {
  return axios.get(api + "/api/3/action/package_list", { params: params });
};

export const getPackagesListWithController = (): AxiosCall<any> => {
  const controller = loadAbort();
  return {
    call: axios.get(api + "/api/3/action/package_list", {
      signal: controller.signal,
    }),
    controller,
  };
};
