import { DatastoreResponse, RecordFormat } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

export const getDatastore = (id: string, records_format: RecordFormat = "objects") =>
  createAxiosCall<DatastoreResponse<typeof records_format>>(
    "GET",
    `/api/ckan/datastore_search/`,
    undefined,
    // TODO: eliminar el límite en el backend, actualmente es de 32000
    { params: { resource_id: id, limit: 32000, records_format } }
  );
