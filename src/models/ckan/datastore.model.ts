import { z } from "zod";

export const timestampFormats = {
  YEAR_MONTH_DAY: { label: "Fecha", value: "year-month-day" },
  YEAR_MONTH_DAY_WEEKDAY: {
    label: "Fecha (con día de la semana)",
    value: "year-month-day-weekday",
  },
  DD_MM_YYYY: { label: "Fecha con barra", value: "/" },
  FULL_DATE: { label: "Fecha y hora", value: "year-month-day-weekday-hour-minute" },
  MONTH_DAY: { label: "Día del mes", value: "month-day-weekday" },
  YEAR_MONTH: { label: "Mes y año", value: "year-month" },
  YEAR_QUARTER: { label: "Trimestre y año", value: "year-quarter" },
  MONTH: { label: "Solo mes", value: "month" },
  QUARTER: { label: "Solo Trimestre", value: "quarter" },
  YEAR: { label: "Solo año", value: "year" },
} as const;
export type DateFormat = (typeof timestampFormats)[keyof typeof timestampFormats]["value"];

export const fieldTypes = {
  TEXT: { label: "Texto", value: "text" },
  NUMBER: { label: "Número", value: "numeric" },
  TIMESTAMP: { label: "Fecha (formato ISO)", value: "timestamp" },
  DATE: { label: "Fecha (YYYY-MM-DD)", value: "date" },
  TIME: { label: "Hora", value: "time" },
  BOOLEAN: { label: "Booleano (true-false)", value: "bool" },
} as const;

export const fieldInfoSchema = z.object({
  label: z.string().max(40, "Label must be 40 characters or less").optional().default(""),
  notes: z.string().max(100, "Notes must be 100 characters or less").optional().default(""),
  type_override: z.enum(Object.values(fieldTypes).map(({ value }) => value) as [FieldType]),
  unit: z.string().optional().default(""),
  timestamp_format: z
    .enum(Object.values(timestampFormats).map(({ value }) => value) as [DateFormat])
    .optional()
    .default(timestampFormats.YEAR_MONTH_DAY.value),
});
export const formFieldsSchema = z.record(z.string(), fieldInfoSchema);

export type FieldType = (typeof fieldTypes)[keyof typeof fieldTypes]["value"];
export type FieldInfo = Partial<z.infer<typeof fieldInfoSchema>>;
export type Field = { id: string; type: FieldType; info?: FieldInfo };
export type FormFieldsData = z.infer<typeof formFieldsSchema>;

export type RecordFormat = "objects" | "lists" | "csv" | "tsv";
export interface RecordType<F extends readonly Field[]> {
  objects: { [K in F[number] as K["id"]]: FieldType }[];
  lists: unknown[];
  csv: string;
  tsv: string;
}

export type Row = Record<string, string | number | boolean | Date | null>;
export interface DatastoreResponse {
  include_total: boolean;
  limit: number;
  offset: number;
  records_format: RecordFormat;
  resource_id: string;
  total_estimation_threshold: null;
  records: (Row & { _id: number })[];
  fields: Field[];
  _links: {
    start: string;
    next: string;
    // TODO: enviar desde el backend
    prev?: string;
    last?: string;
    self?: string;
  };
  total: number;
  total_was_estimated: boolean;
}

export interface Datastore {
  includeTotal: boolean;
  limit: number;
  offset: number;
  recordsFormat: RecordFormat;
  resourceId: string;
  records: Row[];
  fields: Field[];
  total: number;
  totalWasEstimated: boolean;
}
