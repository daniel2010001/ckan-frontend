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
  BASE: (route: string = ""): string => `${BaseRoutes.DATASET}${route}`,
  CATEGORY: "/category/:category",
  TAG: "/tag/:tag",
  DETAIL: "/detail/:id",
  REGISTER: "/register",
  RESOURCE: "/resource/:id",
} as const;

export const GroupRoutes = {
  BASE: (route: string = ""): string => `${BaseRoutes.GROUPS}${route}`,
  DETAIL: "/detail/:id",
  REGISTER: "/register",
} as const;

export const OrganizationRoutes = {
  BASE: (route: string = ""): string => `${BaseRoutes.ORGANIZATIONS}${route}`,
  DETAIL: "/detail/:id",
  REGISTER: "/register",
} as const;
