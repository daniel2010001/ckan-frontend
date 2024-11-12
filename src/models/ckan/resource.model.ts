/** Interface for Resource for the backend */
export interface ResourceResponse {
  cache_last_updated: string | null;
  cache_url: string | null;
  created: string;
  datastore_active: boolean;
  datastore_contains_all_records_of_source_file: boolean;
  description: string;
  format: string;
  hash: string;
  id: string;
  last_modified: string;
  metadata_modified: string;
  mimetype: string;
  mimetype_inner: string | null;
  name: string;
  package_id: string;
  position: number;
  resource_type: string | null;
  size: number;
  state: string;
  url: string;
  url_type: string;
}

/** Interface for Resource for the frontend */
export interface Resource {
  cacheLastUpdated: string | null;
  cacheUrl: string | null;
  created: string;
  datastoreActive: boolean;
  datastoreContainsAllRecordsOfSourceFile: boolean;
  description: string;
  format: string;
  hash: string;
  id: string;
  lastModified: string;
  metadataModified: string;
  mimetype: string;
  mimetypeInner: string | null;
  name: string;
  packageId: string;
  position: number;
  resourceType: string | null;
  size: number;
  state: string;
  url: string;
  urlType: string;
}
