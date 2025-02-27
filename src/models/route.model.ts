export enum BaseRoutes {
  HOME = "/",
  LOGIN = "/login",
  REGISTER = "/register",
  NOT_FOUND = "404",
  DATASET = "/datasets",
  GROUPS = "/groups",
  ORGANIZATION = "/organization",
  ABOUT = "/about",
}

export const DatasetRoutes = {
  BASE: (route: string = ""): string => `${BaseRoutes.DATASET}/${route}`,
  REGISTER: "register",
  MY_DATASETS: "my-datasets",
  CATEGORY: "category/:category",
  TAG: "tag/:name",
  DETAIL: "detail/:url",
  EDIT: "edit",
  MANAGE: "manage",
  RESOURCE: "resource/:id",
  DICTIONARY: "dictionary",
  NEW_VIEW: "new-view",
  NEW_CHART: "new-chart",
} as const;

export const GroupRoutes = {
  BASE: (route: string = ""): string => `${BaseRoutes.GROUPS}/${route}`,
  CREATE: "new",
  MANAGE: "manage/:name",
  DETAIL: "detail/:name",
} as const;

export const OrganizationRoutes = {
  BASE: (route: string = ""): string => `${BaseRoutes.ORGANIZATION}/${route}`,
  CREATE: "new",
  MANAGE: "manage/:name",
  DETAIL: "detail/:name",
} as const;
