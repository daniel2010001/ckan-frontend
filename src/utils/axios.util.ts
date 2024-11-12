export function loadAbort(): AbortController {
  return new AbortController();
}

export function loadAbortable<T>(promise: Promise<T>, controller: AbortController): Promise<T> {
  return promise.then((value) => {
    controller.abort();
    return value;
  });
}
