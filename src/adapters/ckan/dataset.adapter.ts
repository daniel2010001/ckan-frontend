import { AdvancedSearchDatasetType, CategoryType, Dataset, DatasetResponse } from "@/models/ckan";
import { GroupAdapter } from "./group.adapter";
import { OrganizationAdapter } from "./organization.adapter";
import { ResourceAdapter } from "./resource.adapter";
import { StateAdapter } from "./state.adapter";
import { TagAdapter } from "./tag.adapter";

/** Adapter for Dataset */
export class DatasetAdapter {
  /**
   * Converts a DatasetResponse to a Dataset
   * @param datasetResponse DatasetResponse to convert
   * @returns Dataset
   *
   * @example
   * const dataset = DatasetAdapter.toDataset(datasetResponse);
   */
  public static toDataset(datasetResponse: DatasetResponse): Dataset {
    return {
      author: datasetResponse.author,
      authorEmail: datasetResponse.author_email,
      creatorUserId: datasetResponse.creator_user_id,
      id: datasetResponse.id,
      isOpen: datasetResponse.isopen,
      licenseId: datasetResponse.license_id,
      licenseTitle: datasetResponse.license_title,
      maintainer: datasetResponse.maintainer,
      maintainerEmail: datasetResponse.maintainer_email,
      created: new Date(datasetResponse.metadata_created),
      modified: new Date(datasetResponse.metadata_modified),
      url: datasetResponse.name,
      description: datasetResponse.notes,
      numResources: datasetResponse.num_resources,
      numTags: datasetResponse.num_tags,
      organization: OrganizationAdapter.toOrganization(datasetResponse.organization),
      ownerOrg: datasetResponse.owner_org,
      private: datasetResponse.private,
      isActive: StateAdapter.isActive(datasetResponse.state),
      title: datasetResponse.title,
      type: datasetResponse.type,
      source: datasetResponse.url,
      version: datasetResponse.version,
      resources: datasetResponse.resources
        .map((resource) => ResourceAdapter.toResource(resource))
        .sort((a, b) => a.position - b.position),
      extras: datasetResponse.extras,
      tags: datasetResponse.tags.map((item) => TagAdapter.toTag(item)),
      groups: datasetResponse.groups.map((item) => GroupAdapter.toGroup(item)),
      category:
        (datasetResponse.extras.find((item) => item.key === "category")?.value as CategoryType) ??
        "others",
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
      (schema.groups?.length ? `+groups:("${schema.groups.join('" OR "')}")` : "")
    );
  }
}
