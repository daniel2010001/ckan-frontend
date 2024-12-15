export interface FieldType {
  text: string;
  json: any;
  date: Date;
  time: Date;
  timestamp: Date;
  int: number;
  float: number;
  bool: boolean;
}
export type Field = { id: string; type: keyof FieldType };
export type RecordFormat = "objects" | "lists" | "csv" | "tsv";
export interface RecordType<F extends readonly Field[]> {
  objects: { [K in F[number] as K["id"]]: FieldType[K["type"]] }[];
  lists: any[];
  csv: string;
  tsv: string;
}

export interface DatastoreResponse<T extends RecordFormat> {
  include_total: true;
  limit: number;
  offset: number;
  records_format: T;
  resource_id: string;
  total_estimation_threshold: null;
  records: Record<string, any>[];
  fields: Field[];
  _links: {
    start: string;
    next: string;
    prev?: string; // TODO: enviar desde el backend
    last?: string; // TODO: enviar desde el backend
    self?: string; // TODO: enviar desde el backend
  };
  total: number;
  total_was_estimated: boolean;
}

export interface Datastore<T extends readonly Field[], D extends RecordFormat = "objects"> {
  includeTotal: true;
  limit: number;
  offset: number;
  recordsFormat: D;
  resourceId: string;
  records: RecordType<T>[D];
  fields: T;
  total: number;
  totalWasEstimated: boolean;
}
