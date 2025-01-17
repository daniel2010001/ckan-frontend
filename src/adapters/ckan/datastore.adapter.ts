import { DatastoreResponse, Datastore, Field, Row } from "@/models/ckan";

export class DatastoreAdapter {
  public static parseRecord = (fields: Field[], record: Row): Row => {
    const parsedRecord: Row = {};
    fields.forEach(({ id, type }) => {
      const value = record[id];
      switch (type) {
        case "text":
          parsedRecord[id] = String(value);
          break;
        case "numeric":
          parsedRecord[id] = Number(value);
          break;
        case "timestamp":
          if (typeof value !== "boolean" && value !== null) {
            const date = new Date(value);
            parsedRecord[id] = !isNaN(date.getTime()) ? date : null;
          }
          break;
        default:
          parsedRecord[id] = value;
      }
    });
    return parsedRecord;
  };

  /**
   * Convierte una respuesta de la API de CKAN a un objeto de tipo DatastoreResponse
   * @param datastoreResponse Respuesta de la API de CKAN
   * @returns Objeto de tipo DatastoreResponse
   */
  public static toDatastore(datastoreResponse: DatastoreResponse): Datastore {
    return {
      includeTotal: datastoreResponse.include_total,
      limit: datastoreResponse.limit,
      offset: datastoreResponse.offset,
      recordsFormat: datastoreResponse.records_format,
      resourceId: datastoreResponse.resource_id,
      records: datastoreResponse.records
        // .sort((a, b) => a._id - b._id) // TODO: revisar si el records está ordenado
        .map(({ _id, ...record }) =>
          DatastoreAdapter.parseRecord(datastoreResponse.fields, record)
        ),
      fields: datastoreResponse.fields.filter((field) => field.id !== "_id"),
      total: datastoreResponse.total,
      totalWasEstimated: datastoreResponse.total_was_estimated,
    };
  }
}
