import { loadAbort } from "@/utils";
import { AxiosCall } from "@/models";
import axios from "axios";

const api = import.meta.env.VITE_BACKEND;

export const getPackagesList = (): AxiosCall<string[]> => {
  const controller = loadAbort();
  return {
    call: axios.get(api + "/api/3/action/package_list", {
      signal: controller.signal,
    }),
    controller,
  };
};
