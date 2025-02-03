import { z } from "zod";
import { Extra, PathSchema, State, User, UserResponse } from ".";
import { Group, GroupResponse } from "./group.model";

export const userRoles = {
  ADMIN: { value: "admin", label: "Administrador" },
  EDIT: { value: "editor", label: "Editor" },
  READ: { value: "member", label: "Lector" },
  // TODO: Revisar para qué es esto
  // PUBLIC: { value: "public", label: "Usuario público" },
  // PRIVATE: { value: "private", label: "Usuario privado" },
} as const;
export type UserRole = (typeof userRoles)[keyof typeof userRoles];

export const organizationTypes = {
  GOVERNMENT: { value: "government", label: "Gubernamental" },
  EDUCATION: { value: "education", label: "Educativa" },
  ENTERPRISE: { value: "enterprise", label: "Empresarial" },
  OTHER: { value: "other", label: "Otro" },
} as const;
export type OrganizationType = (typeof organizationTypes)[keyof typeof organizationTypes];

export interface MemberResponse extends UserResponse {
  capacity: string;
}
/** Interface for Organization for the backend */
export interface OrganizationResponse {
  id: string;
  name: string;
  title: string;
  type: string;
  description: string;
  image_display_url: string;
  image_url: string;
  created: string;
  is_organization: boolean;
  approval_status: string;
  state: string;
  // Includes
  package_count: number;
  extras: Extra[];
  users: MemberResponse[];
  groups: GroupResponse[];
  num_followers: number;
}

export interface Member extends User {
  role: UserRole;
}
/** Interface for Organization for the frontend */
export interface Organization {
  id: string;
  name: string;
  title: string;
  type: OrganizationType;
  description: string;
  image: string;
  created: string;
  isOrganization: boolean;
  approvalStatus: string;
  state: State;
  datasets: number;
  users: Member[];
  groups: Group[];
  followers: number;
}

export const organizationRegisterSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título debe tener menos de 100 caracteres")
    .regex(/^[a-zA-Z0-9]/, { message: "Debe comenzar con un carácter alfanumérico." })
    .default(""),
  path: PathSchema().default(""),
  description: z.string().default(""),
  info: z.string().optional().default(""),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 1048576, { message: "El archivo debe ser menor a 1 MB" })
    .optional(),
  type: z.string().default(organizationTypes.OTHER.value),
});
export type OrganizationFormData = z.infer<typeof organizationRegisterSchema>;

export type OrganizationRequest = {
  name: string;
  title?: string;
  description?: string;
  image?: File;
  extra?: Extra[];
  groups?: { name: string; capacity: string }[];
  users?: { name: string; capacity: UserRole["value"] }[];
};
