import { AxiosCall } from "@/models";
import { useEffectAfterMount } from ".";

/**
 * Función para realizar llamadas a una API y manejar el estado de carga
 * @returns loading: boolean que indica si se está cargando
 * @returns callEndpoint: función que realiza la llamada a la API y maneja el estado de carga
 */
export const useFetchAndLoader = (
  useState: (
    initialState: boolean
  ) => [boolean, (value: boolean | ((prevState: boolean) => boolean)) => void]
) => {
  const [loading, setLoading] = useState(false);
  let controller: AbortController;

  /**
   * Función que realiza la llamada a la API y maneja el estado de carga
   * @param axiosCall Llamada a la API
   * @returns Response de la llamada a la API
   */
  const callEndpoint = async <T = unknown, D = undefined>(axiosCall: AxiosCall<T, D>) => {
    if (axiosCall?.controller) controller = axiosCall.controller;
    setLoading(true);
    const response = await axiosCall?.call;
    setLoading(false);
    if (response instanceof Error) throw response;
    return response;
  };

  const cancelRequest = () => {
    setLoading(false);
    if (controller) controller.abort();
  };

  useEffectAfterMount(() => cancelRequest(), []);

  return { loading, callEndpoint };
};
