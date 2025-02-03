import z from "zod";
import {
  type Organization,
  type OrganizationResponse,
  type Resource,
  type ResourceResponse,
  type Tag,
  type TagResponse,
  State,
} from ".";
import { Group, GroupResponse } from "./group.model";

import {
  Activity,
  Book,
  Building,
  TreePine,
  Users,
  Palette,
  Plane,
  PiggyBank,
  Cpu,
  MoreHorizontal,
} from "lucide-react";

export const orderBy = {
  // TODO: Instalar el plugin tracking en CKAN para habilitar esta opción
  POPULARITY: { label: "Populares", value: "views_recent desc", disabled: true },
  RELEVANCE: { label: "Relevancia", value: "score desc, metadata_modified desc" },
  NAME_ASC: { label: "Nombre ascendente", value: "title asc" },
  NAME_DESC: { label: "Nombre descendente", value: "title desc" },
  CREATED_ASC: { label: "Más antiguos", value: "metadata_created asc" },
  CREATED_DESC: { label: "Más recientes", value: "metadata_created desc" },
  UPDATED_DESC: { label: "Última modificación", value: "metadata_modified desc" },
} as const;
export type OrderBy = (typeof orderBy)[keyof typeof orderBy]["value"];

export const categories = {
  HEALTH: {
    label: "Salud",
    value: "health",
    icon: Activity,
  },
  EDUCATION: {
    label: "Educación",
    value: "education",
    icon: Book,
  },
  TERRITORIAL_INFRASTRUCTURE: {
    label: "Infraestructura Territorial",
    value: "territorial",
    icon: Building,
  },
  PLANNING_AND_ENVIRONMENT: {
    label: "Planificación y Medioambiente",
    value: "planning",
    icon: TreePine,
  },
  HUMAN_DEVELOPMENT: {
    label: "Desarrollo Humano",
    value: "human-development",
    icon: Users,
  },
  CULTURE: {
    label: "Cultura",
    value: "culture",
    icon: Palette,
  },
  TOURISM: {
    label: "Turismo",
    value: "tourism",
    icon: Plane,
  },
  ECONOMY_AND_FINANCE: {
    label: "Economía y Finanzas",
    value: "economy",
    icon: PiggyBank,
  },
  TECHNOLOGY: {
    label: "Tecnología",
    value: "technology",
    icon: Cpu,
  },
  OTHERS: {
    label: "Otros",
    value: "others",
    icon: MoreHorizontal,
  },
} as const;
export type Category = (typeof categories)[keyof typeof categories];

export const PathSchema = () =>
  z
    .string()
    .min(3, "Debe ingresar al menos 3 caracteres")
    .max(100, "Debe ingresar menos de 100 caracteres")
    .regex(/^[a-z0-9]/, { message: "Debe comenzar con un carácter alfanumérico." })
    .regex(/^[a-z0-9_-]*$/, {
      message: "Solo se permiten caracteres alfanuméricos en minúscula, guiones y guiones bajos.",
    });
export const EmailSchema = () =>
  z
    .string()
    .email("Debe ingresar un correo electrónico válido")
    .min(5, "El correo electrónico debe tener al menos 5 caracteres")
    .max(100, "El correo electrónico debe tener menos de 100 caracteres");
export const datasetFormSchema = z.object({
  title: z
    .string()
    .max(100, "El título debe tener menos de 100 caracteres")
    .regex(/^[a-zA-Z0-9]/, { message: "Debe comenzar con un carácter alfanumérico." })
    .optional()
    .default(""),
  path: PathSchema().default(""),
  description: z.string().optional().default(""),
  private: z.boolean().optional().default(false),
  source: z.string().optional().default(""),
  version: z.string().optional().default(""),

  author: z.string().optional().default(""),
  authorEmail: z.string().optional().default(""),
  maintainer: z.string().optional().default(""),
  maintainerEmail: z.string().optional().default(""),

  category: z.string().default("others"),
  tags: z
    .array(
      z
        .string()
        .min(3, "Debe ingresar al menos 3 caracteres")
        .max(100, "Debe ingresar menos de 100 caracteres")
    )
    .max(5, "Debe ingresar menos de 6 etiquetas")
    .default([]),
  license: z.string().optional().default("notspecified"),
  organization: z.string({ required_error: "Debe ingresar una organización" }).default(""),
  groups: z.array(z.string()).min(1, "Debe ingresar al menos un grupo").default([]),
});
export type DatasetForm = z.infer<typeof datasetFormSchema>;

export type DatasetRequest = {
  name: string;
  title?: string;
  private: boolean;
  author?: string;
  author_email?: string;
  maintainer?: string;
  maintainer_email?: string;
  license_id?: string;
  notes?: string;
  url?: string;
  version?: string;
  tags?: { name: string; display_name?: string }[];
  extras?: { key: string; value: string }[];
  groups?: { name: string }[];
  owner_org: string;
};

export type Extra = { key: string; value: string };
/** Interface for Dataset for the backend */
export interface DatasetResponse {
  author: string;
  author_email: string;
  creator_user_id: string;
  id: string;
  isopen: boolean;
  license_id: string;
  license_title: string;
  maintainer: string;
  maintainer_email: string;
  metadata_created: string;
  metadata_modified: string;
  name: string;
  notes: string;
  num_resources: number;
  num_tags: number;
  organization: OrganizationResponse;
  owner_org: string;
  private: boolean;
  state: string;
  title: string;
  type: string;
  url: string;
  version: string;
  resources: ResourceResponse[];
  extras: Extra[];
  tags: TagResponse[];
  groups: GroupResponse[];
  relationships_as_subject: unknown[];
  relationships_as_object: unknown[];
}

/** Interface for Dataset for the frontend */
export interface Dataset {
  author: string;
  authorEmail: string;
  creatorUserId: string;
  id: string;
  isOpen: boolean;
  licenseId: string;
  licenseTitle: string;
  maintainer: string;
  maintainerEmail: string;
  created: Date;
  modified: Date;
  url: string;
  description: string;
  numResources: number;
  numTags: number;
  organization: Organization;
  ownerOrg: string;
  private: boolean;
  state: State;
  title: string;
  type: string;
  source: string;
  version: string;
  resources: Resource[];
  extras: Extra[];
  tags: Tag[];
  groups: Group[];
  category: Category;
}

export type LicenseResponse = {
  domain_content: string;
  id: string;
  domain_data: string;
  domain_software: string;
  family: string;
  is_generic: string;
  od_conformance: string;
  osd_conformance: string;
  maintainer: string;
  status: string;
  url: string;
  title: string;
};

export const advancedSearchDatasetSchema = z.object({
  title: z.string().optional(),
  category: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  organization: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  format: z.array(z.string()).optional(),
});
export type AdvancedSearchDatasetType = z.infer<typeof advancedSearchDatasetSchema>;

export type SearchDatasetRequest = {
  q?: string;
  fq?: string;
  sort?: OrderBy;
  rows?: number;
  start?: number;
  include_private?: boolean;
  include_drafts?: boolean;
  include_deleted?: boolean;
};

export type SearchDatasetResponse = {
  count: number;
  results: DatasetResponse[];
};
