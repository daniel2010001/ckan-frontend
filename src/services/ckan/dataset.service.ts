import { DatasetResponse } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

export const getDatasets = () =>
  createAxiosCall<DatasetResponse[], undefined>(
    "GET",
    `/api/ckan/current_package_list_with_resources/`,
    undefined,
    // TODO: eliminar el límite en el backend, actualmente es de 10
    { params: { limit: 999 } }
  );

export const createDatasets = (data: any) =>
  createAxiosCall("POST", `/api/ckan/package_create/`, data);

export const getDataset = (nameOrId: string) =>
  createAxiosCall<DatasetResponse, undefined>("GET", `/api/ckan/package_show/`, undefined, {
    params: { id: nameOrId },
  });
