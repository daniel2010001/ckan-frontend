import { Dataset, DatasetResponse } from "@/models";
import { OrganizationAdapter, ResourceAdapter } from ".";

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
      metadataCreated: datasetResponse.metadata_created,
      metadataModified: datasetResponse.metadata_modified,
      name: datasetResponse.name,
      notes: datasetResponse.notes,
      numResources: datasetResponse.num_resources,
      numTags: datasetResponse.num_tags,
      organization: OrganizationAdapter.toOrganization(datasetResponse.organization),
      ownerOrg: datasetResponse.owner_org,
      private: datasetResponse.private,
      state: datasetResponse.state,
      title: datasetResponse.title,
      type: datasetResponse.type,
      url: datasetResponse.url,
      version: datasetResponse.version,
      resources: datasetResponse.resources.map((resource) => ResourceAdapter.toResource(resource)),
      extras: datasetResponse.extras,
      tags: datasetResponse.tags,
      groups: datasetResponse.groups,
      relationshipsAsSubject: datasetResponse.relationships_as_subject,
      relationshipsAsObject: datasetResponse.relationships_as_object,
    };
  }

  /**
   * Converts a Dataset to a DatasetResponse
   * @param dataset Dataset to convert
   * @returns DatasetResponse
   *
   * @example
   * const datasetResponse = DatasetAdapter.toDatasetResponse(dataset);
   */
  public static toDatasetResponse(dataset: Dataset): DatasetResponse {
    return {
      author: dataset.author,
      author_email: dataset.authorEmail,
      creator_user_id: dataset.creatorUserId,
      id: dataset.id,
      isopen: dataset.isOpen,
      license_id: dataset.licenseId,
      license_title: dataset.licenseTitle,
      maintainer: dataset.maintainer,
      maintainer_email: dataset.maintainerEmail,
      metadata_created: dataset.metadataCreated,
      metadata_modified: dataset.metadataModified,
      name: dataset.name,
      notes: dataset.notes,
      num_resources: dataset.numResources,
      num_tags: dataset.numTags,
      organization: OrganizationAdapter.toOrganizationResponse(dataset.organization),
      owner_org: dataset.ownerOrg,
      private: dataset.private,
      state: dataset.state,
      title: dataset.title,
      type: dataset.type,
      url: dataset.url,
      version: dataset.version,
      resources: dataset.resources.map((resource) => ResourceAdapter.toResourceResponse(resource)),
      extras: dataset.extras,
      tags: dataset.tags,
      groups: dataset.groups,
      relationships_as_subject: dataset.relationshipsAsSubject,
      relationships_as_object: dataset.relationshipsAsObject,
    };
  }
}
