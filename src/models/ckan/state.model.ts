export const states = {
  ACTIVE: { label: "Activo", value: "active" },
  DELETED: { label: "Borrado", value: "deleted" },
  DRAFT: { label: "Borrador", value: "draft" },
  INACTIVE: { label: "Inactivo", value: "inactive" },
} as const;

export type State = (typeof states)[keyof typeof states];
