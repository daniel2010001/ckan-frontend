import { DatastoreResponse, Datastore, Field, Row, fieldTypes } from "@/models/ckan";
import { convertToSystemTimeZone } from "@/utils/data-validation";

export class DatastoreAdapter {
  public static parseRecord = (fields: Field[], record: Row): Row => {
    const parsedRecord: Row = {};
    fields.forEach(({ id, type, info: { type_override } = {} }) => {
      const value = record[id];
      switch (type_override ?? type) {
        case fieldTypes.TEXT.value:
          parsedRecord[id] = String(value);
          break;
        case fieldTypes.NUMBER.value:
          parsedRecord[id] = Number(value);
          break;
        case fieldTypes.DATE.value:
          if (typeof value !== "boolean" && value !== null) {
            const date = convertToSystemTimeZone(value);
            parsedRecord[id] = !isNaN(date.getTime()) ? date : null;
          }
          break;
        case fieldTypes.TIME.value:
          parsedRecord[id] = String(value);
          break;
        case fieldTypes.TIMESTAMP.value:
          if (typeof value !== "boolean" && value !== null) {
            const date = new Date(value);
            parsedRecord[id] = !isNaN(date.getTime()) ? date : null;
          }
          break;
        case fieldTypes.BOOLEAN.value:
          parsedRecord[id] = value !== "false" && Boolean(value);
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
