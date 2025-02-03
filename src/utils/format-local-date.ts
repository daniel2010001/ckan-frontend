import { timestampFormats, DateFormat } from "@/models/ckan";

export const formatDate = (date: Date, format: DateFormat) => {
  const options: Intl.DateTimeFormatOptions = {};
  if (format === timestampFormats.DD_MM_YYYY.value)
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  if (format.includes("quarter")) {
    const quarter = Math.floor((date.getMonth() + 3) / 3);
    return `Q${quarter} ${format.includes("year") ? date.getFullYear() : ""}`;
  }
  if (format.includes("day")) options.day = "numeric";
  if (format.includes("month")) options.month = "long";
  if (format.includes("year")) options.year = "numeric";
  if (format.includes("weekday")) options.weekday = "long";
  if (format.includes("hour")) options.hour = "2-digit";
  if (format.includes("minute")) options.minute = "2-digit";
  return date.toLocaleDateString("es-ES", options);
};

export const formatDate_YYYY_MM_DD = (date: Date): string => {
  return date.toLocaleDateString("en-CA");
};

export const formatDate_DD_MMMM_YYYY = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    // weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const timeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Justo ahora";

  const intervals: { [key: string]: number } = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) return `Hace ${interval} ${unit}${interval > 1 ? "s" : ""}`;
  }

  return "Justo ahora";
};
