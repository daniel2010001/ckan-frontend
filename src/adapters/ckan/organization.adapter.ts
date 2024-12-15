import { OrganizationResponse, Organization } from "@/models/ckan";
import { StateAdapter } from "./state.adapter";

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
      isActive: StateAdapter.isActive(organizationResponse.state),
    };
  }
}
