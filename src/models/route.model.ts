export enum BaseRoutes {
  HOME = "/",
  LOGIN = "/login",
  REGISTER = "/register",
  NOT_FOUND = "404",
  DATASET = "/datasets",
  GROUPS = "/groups",
  ORGANIZATIONS = "/organizations",
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
} as const;

export const GroupRoutes = {
  BASE: (route: string = ""): string => `${BaseRoutes.GROUPS}/${route}`,
  REGISTER: "register",
  MANAGE: "manage/:name",
  DETAIL: "detail/:name",
} as const;

export const OrganizationRoutes = {
  BASE: (route: string = ""): string => `${BaseRoutes.ORGANIZATIONS}/${route}`,
  REGISTER: "register",
  MANAGE: "manage/:name",
  DETAIL: "detail/:name",
} as const;
