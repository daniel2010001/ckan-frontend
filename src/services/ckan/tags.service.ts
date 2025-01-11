import { TagResponse } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

export const getTags = () =>
  createAxiosCall<TagResponse[]>("GET", "/api/ckan/tag_list/", undefined, {
    params: { all_fields: true },
  });
