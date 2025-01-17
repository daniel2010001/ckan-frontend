import { GroupResponse } from "@/models/ckan/group.model";
import { createAxiosCall } from "@/utils";

export const getGroups = () =>
  createAxiosCall<GroupResponse[]>("GET", `/api/ckan/group_list/`, undefined, {
    params: { all_fields: true },
  });

export const getMyGroups = () =>
  createAxiosCall<GroupResponse[]>("GET", `/api/ckan/group_list_authz/`);
