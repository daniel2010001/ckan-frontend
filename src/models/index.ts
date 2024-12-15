export * from "./axios.model";
export * from "./notice.model";
export * from "./route.model";
export * from "./storage.model";
export * from "./store.model";
export type TypeWithKey<T> = { [key: string]: T };
export type ValueOf<T> = T[keyof T];
