import { Resource, ResourceResponse } from "@/models/ckan";
import { StateAdapter } from "./state.adapter";

/** Adapter for Resource */
export class ResourceAdapter {
  /**
   * Converts a ResourceResponse to a Resource
   * @param resourceResponse ResourceResponse to convert
   * @returns Resource
   *
   * @example
   * const resource = ResourceAdapter.toResource(resourceResponse);
   */
  public static toResource(resourceResponse: ResourceResponse): Resource {
    return {
      created: new Date(resourceResponse.created),
      datastoreActive: resourceResponse.datastore_active,
      datastoreContainsAllRecordsOfSourceFile:
        resourceResponse.datastore_contains_all_records_of_source_file,
      description: resourceResponse.description,
      format: resourceResponse.format,
      hash: resourceResponse.hash,
      id: resourceResponse.id,
      lastModified: new Date(resourceResponse.last_modified),
      metadataModified: new Date(resourceResponse.metadata_modified),
      mimetype: resourceResponse.mimetype,
      name: resourceResponse.name,
      packageId: resourceResponse.package_id,
      position: resourceResponse.position,
      resourceType: resourceResponse.resource_type,
      size: resourceResponse.size,
      state: StateAdapter.toState(resourceResponse.state),
      url: resourceResponse.url,
      urlType: resourceResponse.url_type,
    };
  }
}
