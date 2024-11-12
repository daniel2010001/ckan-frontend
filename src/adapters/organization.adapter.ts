import { OrganizationResponse, Organization } from "@/models";

/** Adapter for Organization */
export class OrganizationAdapter {
  /**
   * Converts an OrganizationResponse to an Organization
   * @param organizationResponse OrganizationResponse to convert
   * @returns Organization
   *
   * @example
   * const organization = OrganizationAdapter.toOrganization(organizationResponse);
   */
  public static toOrganization(organizationResponse: OrganizationResponse): Organization {
    return {
      id: organizationResponse.id,
      name: organizationResponse.name,
      title: organizationResponse.title,
      type: organizationResponse.type,
      description: organizationResponse.description,
      imageUrl: organizationResponse.image_url,
      created: organizationResponse.created,
      isOrganization: organizationResponse.is_organization,
      approvalStatus: organizationResponse.approval_status,
      state: organizationResponse.state,
    };
  }

  /**
   * Converts an Organization to an OrganizationResponse
   * @param organization Organization to convert
   * @returns OrganizationResponse
   *
   * @example
   * const organizationResponse = OrganizationAdapter.toOrganizationResponse(organization);
   */
  public static toOrganizationResponse(organization: Organization): OrganizationResponse {
    return {
      id: organization.id,
      name: organization.name,
      title: organization.title,
      type: organization.type,
      description: organization.description,
      image_url: organization.imageUrl,
      created: organization.created,
      is_organization: organization.isOrganization,
      approval_status: organization.approvalStatus,
      state: organization.state,
    };
  }
}
