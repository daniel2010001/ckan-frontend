import { CKANResponse, CKANResponseError } from "@/models/ckan";

export class ResponseAdapter {
  static isResponse<T>(response: any): response is CKANResponse<T> {
    return (response as CKANResponse<T>)?.success !== undefined;
  }

  static isError<T>(response: any): response is CKANResponseError<T> {
    return (response as CKANResponse<T>)?.success === false;
  }

  static toResponse<T>(response: any): T {
    if (!ResponseAdapter.isResponse<T>(response)) throw "Invalid response";
    if (ResponseAdapter.isError<T>(response)) throw "Invalid response";
    return response.result;
  }
}
