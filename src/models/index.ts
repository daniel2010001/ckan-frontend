export * from "./axios.model";
export * from "./route.model";
export * from "./state.model";
export * from "./storage.model";
// Types utils
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type ValueOf<T> = T[keyof T];
