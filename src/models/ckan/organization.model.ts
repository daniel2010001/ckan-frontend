/** Interface for Organization for the backend */
export interface OrganizationResponse {
  id: string;
  name: string;
  title: string;
  type: string;
  description: string;
  image_url: string;
  created: string;
  is_organization: boolean;
  approval_status: string;
  state: string;
}

/** Interface for Organization for the frontend */
export interface Organization {
  id: string;
  name: string;
  title: string;
  type: string;
  description: string;
  imageUrl: string;
  created: string;
  isOrganization: boolean;
  approvalStatus: string;
  state: string;
}
