import { OrganizationResponse, Organization, organizationTypes } from "@/models/ckan";
import { StateAdapter } from "./state.adapter";
import { UserAdapter } from "./user.adapter";
import { GroupAdapter } from "./group.adapter";

import placeholderImage from "@/assets/images/placeholder.png";

/** Adapter for Organization */
export class OrganizationAdapter {
  /**
   * Converts an OrganizationResponse to an Organization
   * @param data OrganizationResponse to convert
   * @returns Organization
   *
   * @example
   * const organization = OrganizationAdapter.toOrganization(organizationResponse);
   */
  public static toOrganization(data: OrganizationResponse): Organization {
    const type = Object.values(organizationTypes).find(
      (type) => type.value === data.extras?.find(({ key }) => key === "type")?.value
    );
    return {
      id: data.id,
      name: data.name,
      title: data.title,
      type: type ?? organizationTypes.OTHER,
      description: data.description,
      image: data.image_display_url || placeholderImage,
      created: data.created,
      isOrganization: data.is_organization,
      approvalStatus: data.approval_status,
      state: StateAdapter.toState(data.state),
      followers: data.num_followers,
      datasets: data.package_count,
      users: data.users?.map(UserAdapter.toMember) ?? [],
      groups: data.groups?.map(GroupAdapter.toGroup) ?? [],
    };
  }
}
