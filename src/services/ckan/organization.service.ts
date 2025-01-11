import { OrganizationResponse } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

export const getOrganizations = () =>
  createAxiosCall<OrganizationResponse[]>("GET", `/api/ckan/organization_list/`, undefined, {
    params: { all_fields: true },
  });
