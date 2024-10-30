import { AxiosResponse } from "axios";
import { useState } from "react";

import { AxiosCall } from "@/models";
import { useEffectAfterMount } from ".";

export const useFetchAndLoader = () => {
  const [loading, setLoading] = useState(true);
  let controller: AbortController;

  const callEndpoint = async <T>(axiosCall: AxiosCall<T>): Promise<AxiosResponse<T, any>> => {
    if (axiosCall.controller) controller = axiosCall.controller;
    setLoading(true);
    let response = {} as AxiosResponse<T, any>;
    try {
      response = await axiosCall.call;
    } catch (error) {}
    setLoading(false);
    return response;
  };

  const cancelRequest = () => {
    setLoading(false);
    if (!!controller) controller.abort();
  };

  useEffectAfterMount(() => cancelRequest(), []);

  return { loading, callEndpoint };
};
