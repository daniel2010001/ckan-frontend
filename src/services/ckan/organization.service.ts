import { OrganizationResponse, UserPermission } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

export const getOrganizations = () =>
  createAxiosCall<OrganizationResponse[]>("GET", `/api/ckan/organization_list/`, undefined, {
    params: { all_fields: true, include_extras: true },
  });

export const getMyOrganizations = (permission: UserPermission) =>
  createAxiosCall<OrganizationResponse[]>(
    "GET",
    `/api/ckan/organization_list_for_user/`,
    undefined,
    { params: { permission } }
  );

export const getOrganization = (name: string) =>
  createAxiosCall<OrganizationResponse>("GET", `/api/ckan/organization_show/`, undefined, {
    params: { id: name },
  });
