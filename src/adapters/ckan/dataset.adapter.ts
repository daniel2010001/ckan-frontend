import { AdvancedSearchDatasetType, categories, Dataset, DatasetResponse } from "@/models/ckan";
import { GroupAdapter } from "./group.adapter";
import { OrganizationAdapter } from "./organization.adapter";
import { ResourceAdapter } from "./resource.adapter";
import { StateAdapter } from "./state.adapter";
import { TagAdapter } from "./tag.adapter";

/** Adapter for Dataset */
export class DatasetAdapter {
  /**
   * Converts a DatasetResponse to a Dataset
   * @param data DatasetResponse to convert
   * @returns Dataset
   *
   * @example
   * const dataset = DatasetAdapter.toDataset(datasetResponse);
   */
  public static toDataset(data: DatasetResponse): Dataset {
    const category = Object.values(categories).find(
      ({ value }) => value === data.extras.find(({ key }) => key === "category")?.value
    );
    return {
      author: data.author,
      authorEmail: data.author_email,
      creatorUserId: data.creator_user_id,
      id: data.id,
      isOpen: data.isopen,
      licenseId: data.license_id,
      licenseTitle: data.license_title,
      maintainer: data.maintainer,
      maintainerEmail: data.maintainer_email,
      created: new Date(data.metadata_created),
      modified: new Date(data.metadata_modified),
      url: data.name,
      description: data.notes,
      numResources: data.num_resources,
      numTags: data.num_tags,
      organization: OrganizationAdapter.toOrganization(data.organization),
      ownerOrg: data.owner_org,
      private: data.private,
      state: StateAdapter.toState(data.state),
      title: data.title,
      type: data.type,
      source: data.url,
      version: data.version,
      resources: data.resources
        .map((resource) => ResourceAdapter.toResource(resource))
        .sort((a, b) => a.position - b.position),
      extras: data.extras,
      tags: data.tags.map((item) => TagAdapter.toTag(item)),
      groups: data.groups.map((item) => GroupAdapter.toGroup(item)),
      category: category ?? categories.OTHERS,
    };
  }

  /**
   * Converts a SearchDatasetType to a SearchDatasetRequest
   * @param schema SearchDatasetType to convert
   * @returns SearchDatasetRequest
   *
   * @example
   * const searchDatasetRequest = DatasetAdapter.toSearchDatasetRequest(searchDatasetType);
   */
  public static toFilterQuery(schema: AdvancedSearchDatasetType): string {
    return (
      (schema.title ? `+title:(${schema.title})` : "") +
      (schema.category?.length ? `+category:("${schema.category.join('" OR "')}")` : "") +
      (schema.tags?.length ? `+tags:("${schema.tags.join('" AND "')}")` : "") +
      (schema.organization?.length
        ? `+organization:("${schema.organization.join('" OR "')}")`
        : "") +
      (schema.groups?.length ? `+groups:("${schema.groups.join('" OR "')}")` : "") +
      (schema.format?.length ? `+res_format:("${schema.format.join('" OR "')}")` : "")
    );
  }
}
