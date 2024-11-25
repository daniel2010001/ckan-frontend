export * from "./axios.model";
export * from "./route.model";
export * from "./store.model";
export * from "./storage.model";
// Types utils
export type ValueOf<T> = T[keyof T];
export type TypeWithKey<T> = { [key: string]: T };
