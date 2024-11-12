import {
  type Organization,
  type OrganizationResponse,
  type Resource,
  type ResourceResponse,
} from "..";

/** Interface for Dataset for the backend */
export interface DatasetResponse {
  author: string;
  author_email: string;
  creator_user_id: string;
  id: string;
  isopen: boolean;
  license_id: string;
  license_title: string;
  maintainer: string;
  maintainer_email: string;
  metadata_created: string;
  metadata_modified: string;
  name: string;
  notes: string;
  num_resources: number;
  num_tags: number;
  organization: OrganizationResponse;
  owner_org: string;
  private: boolean;
  state: string;
  title: string;
  type: string;
  url: string;
  version: string;
  resources: ResourceResponse[];
  extras: any[];
  tags: any[];
  groups: any[];
  relationships_as_subject: any[];
  relationships_as_object: any[];
}

/** Interface for Dataset for the frontend */
export interface Dataset {
  author: string;
  authorEmail: string;
  creatorUserId: string;
  id: string;
  isOpen: boolean;
  licenseId: string;
  licenseTitle: string;
  maintainer: string;
  maintainerEmail: string;
  metadataCreated: string;
  metadataModified: string;
  name: string;
  notes: string;
  numResources: number;
  numTags: number;
  organization: Organization;
  ownerOrg: string;
  private: boolean;
  state: string;
  title: string;
  type: string;
  url: string;
  version: string;
  resources: Resource[];
  extras: any[];
  tags: any[];
  groups: any[];
  relationshipsAsSubject: any[];
  relationshipsAsObject: any[];
}
