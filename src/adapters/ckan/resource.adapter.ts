import { ResourceResponse, Resource } from "@/models";

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
      cacheLastUpdated: resourceResponse.cache_last_updated,
      cacheUrl: resourceResponse.cache_url,
      created: resourceResponse.created,
      datastoreActive: resourceResponse.datastore_active,
      datastoreContainsAllRecordsOfSourceFile:
        resourceResponse.datastore_contains_all_records_of_source_file,
      description: resourceResponse.description,
      format: resourceResponse.format,
      hash: resourceResponse.hash,
      id: resourceResponse.id,
      lastModified: resourceResponse.last_modified,
      metadataModified: resourceResponse.metadata_modified,
      mimetype: resourceResponse.mimetype,
      mimetypeInner: resourceResponse.mimetype_inner,
      name: resourceResponse.name,
      packageId: resourceResponse.package_id,
      position: resourceResponse.position,
      resourceType: resourceResponse.resource_type,
      size: resourceResponse.size,
      state: resourceResponse.state,
      url: resourceResponse.url,
      urlType: resourceResponse.url_type,
    };
  }

  /**
   * Converts a Resource to a ResourceResponse
   * @param resource Resource to convert
   * @returns ResourceResponse
   *
   * @example
   * const resourceResponse = ResourceAdapter.toResourceResponse(resource);
   */
  public static toResourceResponse(resource: Resource): ResourceResponse {
    return {
      cache_last_updated: resource.cacheLastUpdated,
      cache_url: resource.cacheUrl,
      created: resource.created,
      datastore_active: resource.datastoreActive,
      datastore_contains_all_records_of_source_file:
        resource.datastoreContainsAllRecordsOfSourceFile,
      description: resource.description,
      format: resource.format,
      hash: resource.hash,
      id: resource.id,
      last_modified: resource.lastModified,
      metadata_modified: resource.metadataModified,
      mimetype: resource.mimetype,
      mimetype_inner: resource.mimetypeInner,
      name: resource.name,
      package_id: resource.packageId,
      position: resource.position,
      resource_type: resource.resourceType,
      size: resource.size,
      state: resource.state,
      url: resource.url,
      url_type: resource.urlType,
    };
  }
}
