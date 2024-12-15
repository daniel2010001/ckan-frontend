import {
  type Tag,
  type Organization,
  type OrganizationResponse,
  type Resource,
  type ResourceResponse,
  type TagResponse,
  State,
} from ".";

export type Category =
  | "económica"
  | "social"
  | "cultural"
  | "demográfica"
  | "sanitaria"
  | "ciencia"
  | "tecnológica";

export type Extra = {
  key: string;
  value: string;
};

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
  state: State;
  title: string;
  type: string;
  url: string;
  version: string;
  resources: ResourceResponse[];
  extras: Extra[];
  tags: TagResponse[];
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
  created: Date;
  modified: Date;
  url: string;
  description: string;
  numResources: number;
  numTags: number;
  organization: Organization;
  ownerOrg: string;
  private: boolean;
  isActive: boolean;
  title: string;
  type: string;
  source: string;
  version: string;
  resources: Resource[];
  extras: Extra[];
  tags: Tag[];
  groups: any[];
  // extras: any[];
  category?: string;
}
