import { useEffect, useRef } from "react";

/**
 * UseEffect que se ejecuta solo una vez después de montar el componente
 * @param fn función de efecto a ejecutar
 * @param deps Arreglo de dependencias creadas con useState
 */
export const useEffectAfterMount = (fn: Function, deps: any[] = []) => {
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    fn();
  }, deps);
};
