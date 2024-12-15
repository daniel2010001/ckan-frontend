import { ResourceCreate, ResourceResponse, ViewResponse } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

export const createResource = (data: ResourceCreate) =>
  createAxiosCall<ResourceResponse, ResourceCreate>("POST", "/api/ckan/resource_create/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getResource = (id: string) =>
  createAxiosCall<ResourceResponse>("GET", `/api/ckan/resource_show/`, undefined, {
    params: { id },
  });

export const getResourceView = (id: string) =>
  createAxiosCall<ResourceResponse>("GET", `/api/ckan/resource_view_show/`, undefined, {
    params: { id },
  });

export const getResourceViewList = (id: string) =>
  createAxiosCall<ViewResponse[]>("GET", `/api/ckan/resource_view_list/`, undefined, {
    params: { id },
  });

export const getResourceDatastore = (id: string) =>
  createAxiosCall<ResourceResponse>("GET", `/api/ckan/datastore_search/`, undefined, {
    params: { resource_id: id, limit: 32000 }, // TODO: eliminar el límite en el backend, actualmente es de 32000
  });
