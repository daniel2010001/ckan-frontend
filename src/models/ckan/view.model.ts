import { z } from "zod";

export const viewTypes = {
  IMAGE: { label: "Image", value: "image_view", disabled: true },
  MAP: { label: "Map", value: "map_view", disabled: true },
  TABLE: { label: "Tabla de datos", value: "datatables_view", disabled: true },
  PDF: { label: "PDF", value: "pdf_view", disabled: true },
  AUDIO: { label: "Audio", value: "audio_view", disabled: true },
  VIDEO: { label: "Video", value: "video_view", disabled: true },
  CHART: { label: "Gráfico", value: "chart_view" },
} as const;
export type ViewType = (typeof viewTypes)[keyof typeof viewTypes]["value"];
export interface ViewResponse {
  id: string;
  resource_id: string;
  title: string;
  description: string;
  view_type: ViewType;
  package_id: string;
  [key: string]: unknown;
}

export interface View {
  id: string;
  title: string;
  description: string;
  type: ViewType;
  packageId: string;
  resourceId: string;
}

export const viewFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title is required")
    .max(100, "Title must be 100 characters or less")
    .default(""),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .default("")
    .optional(),
  viewType: z
    .enum(Object.values(viewTypes).map(({ value }) => value) as [ViewType])
    .default("chart_view"),
});
export type ViewFormData = z.infer<typeof viewFormSchema>;

export const universalOperations = {
  COUNT: { label: "Contar", value: "COUNT(yAxis) as COUNT" },
  DISTINCT_COUNT: { label: "Conteo Distinto", value: "COUNT(DISTINCT yAxis) as DISTINCT_COUNT" },
};
export const textOperations = {};
export const numberOperations = {
  AVG: { label: "Promedio", value: "AVG(yAxis) as AVG" },
  SUM: { label: "Suma", value: "SUM(yAxis) as SUM" },
  MIN: { label: "Mínimo", value: "MIN(yAxis) as MIN" },
  MAX: { label: "Máximo", value: "MAX(yAxis) as MAX" },
  MEDIAN: { label: "Mediana", value: "MEDIAN(yAxis) as MEDIAN" },
};
// TODO: Revisar tipos de operaciones para fechas
export const dateOperations = {
  YEAR: { label: "Año", value: "YEAR(yAxis) as YEAR", disable: true },
  QUARTER: { label: "Trimestre", value: "QUARTER(yAxis) as QUARTER", disable: true },
  MONTH: { label: "Mes", value: "MONTH(yAxis) as MONTH", disable: true },
  DAY: { label: "Día", value: "DAY(yAxis) as DAY", disable: true },
};

export const chartTypes = {
  AREA: { label: "Gráfico de área", value: "area_chart" },
  BAR: { label: "Gráfico de barras", value: "bar_chart" },
  LINE: { label: "Gráfico de líneas", value: "line_chart" },
  PIE: { label: "Gráfico circular", value: "pie_chart" },
  SCATTER: { label: "Gráfico de dispersión", value: "scatter_chart" },
} as const;
export type ChartType = (typeof chartTypes)[keyof typeof chartTypes]["value"];

export const chartFormSchema = z.object({
  chartType: z
    .enum(Object.values(chartTypes).map(({ value }) => value) as [ChartType])
    .default("bar_chart"),
  xAxis: z
    .array(z.string())
    .min(1, "El eje x es obligatorio")
    .max(3, "El eje x no puede tener más de 3 elementos")
    .default([]),
  yAxis: z.string().default(""),
  operation: z.string().default(""),
});
export type ChartFormData = z.infer<typeof chartFormSchema>;
