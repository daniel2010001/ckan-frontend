import { z } from "zod";

export const extractDefaultValues = <T>(schema: z.ZodObject<any>): T => {
  const defaults: any = {};
  const shape = schema.shape;

  for (const key in shape) {
    if (shape[key]._def.defaultValue) {
      defaults[key] = shape[key]._def.defaultValue();
    }
  }

  return defaults as T;
};
