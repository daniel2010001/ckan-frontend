import { Dataset, DatasetResponse } from "@/models/ckan";
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
      groups: datasetResponse.groups,
      category: datasetResponse.extras.find((item) => item.key === "category")?.value,
    };
  }
}
