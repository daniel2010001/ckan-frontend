import { DatastoreResponse, Field, Row } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

export const getDatastore = (id: string, limit = 100) =>
  createAxiosCall<DatastoreResponse>(
    "GET",
    `/api/ckan/datastore_search/`,
    undefined,
    // TODO: eliminar el límite en el backend, actualmente es de 32000
    { params: { resource_id: id, limit, records_format: "objects" } }
  );

type DatastoreCreate = { resource_id: string; force: boolean; fields: Omit<Field, "type">[] };
export const createDatastore = (resourceId: string, fields: Omit<Field, "type">[]) =>
  createAxiosCall<DatastoreCreate, DatastoreCreate>("POST", "/api/ckan/datastore_create/", {
    resource_id: resourceId,
    force: true,
    fields,
  });

type XloaderSubmit = { ignore_hash: boolean; resource_id: string };
export const xloaderSubmit = (resourceId: string) =>
  createAxiosCall<boolean, XloaderSubmit>("POST", `/api/ckan/xloader_submit/`, {
    ignore_hash: true,
    resource_id: resourceId,
  });

type DatastoreSQL = { sql: string; records: Row[]; fields: Field[] };
export const getDatastoreSql = (sql: string) =>
  createAxiosCall<DatastoreSQL, { sql: string }>("POST", `/api/ckan/datastore_search_sql/`, {
    sql,
  });
