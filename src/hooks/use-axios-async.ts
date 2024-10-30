import { AxiosResponse } from "axios";
import { useEffectAfterMount } from ".";

/**
 * Función para manejar operaciones asíncronas usando useEffect. Ejecuta la petición de
 * axios y maneja el resultado siempre y cuando se tenga montado el componente.
 *
 * También captura los errores y los maneja en el contexto de error.
 *
 * @param asyncFunction Petición de axios que se desea ejecutar
 * @param successFunction Función que se ejecuta cuando se resuelve la petición, recibe como parámetro los datos obtenidos
 * @param returnFunction Función que se ejecuta cuando el componente se desmonta o si cambian las dependencias
 * @param dependencies Array de dependencias que se pasa al useEffect
 */
export const useAsync = <T>(
  asyncFunction: () => Promise<AxiosResponse<T, any>>,
  successFunction: (data: T) => void,
  returnFunction: Function = () => {},
  dependencies: any[] = []
) => {
  useEffectAfterMount(() => {
    let isActive = true;
    asyncFunction()
      .then((result) => {
        if (isActive) successFunction(result.data);
      })
      .catch();
    return () => {
      if (!!returnFunction) returnFunction();
      isActive = false;
    };
  }, dependencies);
};
