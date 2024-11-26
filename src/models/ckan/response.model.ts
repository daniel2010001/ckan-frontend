export type CKANResponseError<T> = {
  success: false;
  error: Partial<Record<keyof T, string[]>> & { __type: string; message?: string };
};

export type CKANResponse<T> = { success: true; result: T } | CKANResponseError<T>;
