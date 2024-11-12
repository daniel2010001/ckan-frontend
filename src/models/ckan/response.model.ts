export interface CKANResponse<T> {
  success: boolean;
  error?: CKANResponseError<T>;
  result: T;
}

export type CKANResponseError<T> = Partial<Record<keyof T, string>> & {
  __type: string;
  message?: string;
};
