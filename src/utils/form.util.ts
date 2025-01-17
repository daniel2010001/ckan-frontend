import { z } from "zod";

export function extractDefaultValues<T>(schema: z.ZodObject<any>): T {
  const defaults: any = {};
  const shape = schema.shape;
  for (const key in shape)
    if (shape[key]._def.defaultValue) defaults[key] = shape[key]._def.defaultValue();
  return defaults as T;
}

export const transformToPath = (text: string): string => {
  return text
    .trim() // Elimina espacios al inicio y al final
    .toLowerCase()
    .replace(/\s+/g, "-") // Reemplaza espacios con guiones
    .replace(/[^a-z0-9-]/g, "_") // Reemplaza caracteres no alfanuméricos (excepto guiones) con guiones bajos
    .replace(/^[^a-z0-9]+/, "") // Elimina caracteres no alfanuméricos al inicio
    .replace(/-+/g, "-") // Reemplaza múltiples guiones con uno solo
    .replace(/_+/g, "_") // Reemplaza múltiples guiones bajos con uno solo
    .replace(/^-|-$/g, "") // Elimina guiones al inicio y al final
    .replace(/^_|_$/g, ""); // Elimina guiones bajos al inicio y al final
};
